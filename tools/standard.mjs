#!/usr/bin/env node
/**
 * AgentSkill static v0.1: validate canonical source, prepare offline bundle,
 * and compare a bundle/adopted repository to canonical file SHA-256.
 * No network, target mutation, branch/CI operations, or model invocation.
 */
import { createHash } from 'node:crypto';
import {
  readFile, writeFile, mkdir, lstat, readdir, realpath
} from 'node:fs/promises';
import { dirname, join, resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = 'registry/standard.manifest.json';
const PROFILE_PATH = '.agent-standard/profile.json';
const ALLOWED_KINDS = new Set(['root', 'core', 'skill', 'adapter', 'method_registry']);
const ALLOWED_LEVELS = new Set([
  'L0_STATIC', 'L1_ROUTING', 'L2_WORKFLOW', 'L3_ADVERSARIAL'
]);
const BLOCKED_ACTIONS = new Set([
  'write', 'test', 'ci', 'release', 'package', 'deploy', 'delete'
]);

function ensure(ok, message) {
  if (!ok) throw new Error(message);
}

function safeRelativePath(value) {
  ensure(typeof value === 'string' && value.length > 0, 'path must be a non-empty string');
  ensure(!isAbsolute(value) && !value.includes('\\') && !value.includes('\0'), 'unsafe path: ' + value);
  const segments = value.split('/');
  ensure(segments.every(s => s !== '' && s !== '.' && s !== '..'), 'unsafe path segments: ' + value);
  return value;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function readJson(path, base = ROOT) {
  return JSON.parse(await readFile(join(base, path), 'utf8'));
}

async function ensureRegularPortableFile(base, name) {
  const checked = safeRelativePath(name);
  let cursor = base;
  for (const segment of checked.split('/')) {
    cursor = join(cursor, segment);
    const state = await lstat(cursor);
    ensure(!state.isSymbolicLink(), 'SYMLINK BLOCKED: ' + checked);
  }
  const state = await lstat(cursor);
  ensure(state.isFile(), 'NOT REGULAR FILE: ' + checked);
}

async function ensureCompletePortableInventory(manifest) {
  const core = manifest.entries.filter(e => e.kind === 'core').map(e => e.source).sort();
  const dirents = await readdir(join(ROOT, '.agent-standard/core'), { withFileTypes: true });
  ensure(dirents.every(e => e.isFile() && e.name.endsWith('.md')), 'CORE INVENTORY: unexpected directory or non-Markdown file');
  const present = dirents.map(e => '.agent-standard/core/' + e.name).sort();
  ensure(JSON.stringify(core) === JSON.stringify(present), 'CORE INVENTORY: unlisted or missing shared module');
  const index = await readFile(join(ROOT, '.agent-standard/core/INDEX.md'), 'utf8');
  for (const file of present) {
    if (file.endsWith('/INDEX.md')) continue; // The selector need not link to itself.
    ensure(index.includes(file.split('/').at(-1)), 'CORE INDEX: missing module entry ' + file);
  }
  const adapters = manifest.entries.filter(e => e.kind === 'adapter').map(e => e.source).sort();
  const adapterFiles = await readdir(join(ROOT, 'docs/adapters'), { withFileTypes: true });
  ensure(adapterFiles.every(e => e.isFile() && e.name.endsWith('.md')), 'ADAPTER INVENTORY: invalid adapter source');
  ensure(JSON.stringify(adapterFiles.map(e => 'docs/adapters/' + e.name).sort()) === JSON.stringify(adapters), 'ADAPTER INVENTORY: unlisted or missing agent host adapter');
  const skills = manifest.entries.filter(e => e.kind === 'skill').map(e => e.source.split('/')[2]).sort();
  const skillDirs = await readdir(join(ROOT, 'skills/core'), { withFileTypes: true });
  ensure(skillDirs.every(e => e.isDirectory()), 'SKILL INVENTORY: unexpected top-level file');
  ensure(JSON.stringify(skillDirs.map(e => e.name).sort()) === JSON.stringify(skills), 'SKILL INVENTORY: unlisted shared skill');
}

function validateProfile(profile) {
  ensure(profile && profile.schemaVersion === 1, 'profile schemaVersion must be 1');
  ensure(typeof profile.repository === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(profile.repository), 'invalid repository');
  ensure(typeof profile.activeBranch === 'string' && profile.activeBranch.length > 0, 'activeBranch is required');
  const branch = profile.branchPolicy;
  ensure(branch && Array.isArray(branch.writableBranches), 'branchPolicy.writableBranches required');
  ensure(new Set(branch.writableBranches).size === branch.writableBranches.length && branch.writableBranches.every(b => typeof b === 'string' && b.length > 0), 'invalid writableBranches');
  ensure(branch.allowAutoBranch === false && branch.allowAutoPromotion === false, 'automatic branch/promotion must be disabled');
  const execution = profile.executionPolicy;
  ensure(execution && ['disabled','manual_only','normal'].includes(execution.ci), 'invalid CI policy');
  ensure(['on_hold','allowed_when_available'].includes(execution.tests), 'invalid test policy');
  ensure(execution.nativeProof === 'required_when_claimed', 'native proof must be required when claimed');
  const permission = profile.permissions;
  ensure(permission && permission.crossRepoWrites === false, 'cross-repo writes cannot be delegated by profile');
  ensure(permission.mutatingActionsRequireUserIntent === true, 'mutating actions require user intent');
  ensure(permission.releaseRequiresExplicitApproval === true, 'release requires explicit approval');
  ensure(Array.isArray(profile.protectedPaths) && profile.protectedPaths.every(x => typeof x === 'string' && x.length > 0), 'invalid protectedPaths');
  ensure(Array.isArray(profile.holds), 'holds must be an array');
  const holdIds = new Set();
  for (const h of profile.holds) {
    ensure(typeof h.id === 'string' && h.id.length > 0 && !holdIds.has(h.id), 'invalid or duplicate hold id');
    holdIds.add(h.id);
    ensure(typeof h.reason === 'string' && h.reason.length > 0, 'hold reason required');
    ensure(Array.isArray(h.paths) && h.paths.every(x => typeof x === 'string' && x.length > 0), 'hold paths required');
    ensure(Array.isArray(h.blockedActions) && h.blockedActions.length > 0 && h.blockedActions.every(x => BLOCKED_ACTIONS.has(x)), 'invalid hold actions');
    ensure(typeof h.until === 'string' && h.until.length > 0, 'hold release rule required');
  }
  ensure(['public-standards-only','private-repository','confidential-project'].includes(profile.dataPolicy), 'invalid data policy');
  const surface = profile.workflowPolicy;
  ensure(surface && surface.sourceSurface === 'CHATGPT_GITHUB' && surface.localValidationSurface === 'LOCAL_PC_AGENT', 'invalid two-surface policy');
  ensure(surface.localTestDuringSourcePhase === false && surface.requestLocaltestFromChatGPT === false && surface.githubActionsOrCloudTestSubstitution === false && surface.localValidationRequiresExplicitTransition === true, 'two-surface safety policy cannot be relaxed');
}

function validateSkill(text, entry, seen) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  ensure(fm !== null, 'missing YAML frontmatter: ' + entry.source);
  const fields = {};
  for (const line of fm[1].split(/\r?\n/)) {
    const m = line.match(/^([a-z][a-z-]*):\s*(.*)$/);
    ensure(m && m[2].trim().length > 0, 'unsupported/empty skill metadata: ' + entry.source);
    ensure(fields[m[1]] === undefined, 'duplicate skill metadata key: ' + m[1]);
    fields[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  const name = fields.name, description = fields.description;
  const folder = entry.source.split('/').at(-2);
  ensure(typeof name === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) && name.length <= 64, 'invalid skill name: ' + String(name));
  ensure(name === folder && name.startsWith('oits-'), 'skill folder/name or shared prefix mismatch: ' + entry.source);
  ensure(typeof description === 'string' && description.length >= 30 && description.length <= 1024, 'invalid skill description: ' + entry.source);
  ensure(!seen.has(name), 'duplicate core skill ID: ' + name);
  seen.add(name);
  ensure(text.includes('## ') && text.length > fm[0].length + 100, 'skill procedure missing: ' + entry.source);
}


async function validateActivationContracts(manifest) {
  const routing = await readFile(join(ROOT, '.agent-standard/core/decision-routing-and-ownership.md'), 'utf8');
  const section = routing.split('## Activation decision table\n')[1]?.split('\n## ')[0];
  ensure(typeof section === 'string', 'SKILL ROUTING: missing activation decision table');
  const lines = section.split(/\r?\n/).filter(line => line.startsWith('| '));
  ensure(lines.length >= 3 && lines[0] === '| Route ID | Positive trigger | Primary selection | Negative trigger / abstain |',
    'SKILL ROUTING: invalid activation table header');
  const expected = new Map([
    ['repository-audit', 'oits-repository-audit'],
    ['agent-quality', 'oits-agent-quality-review'],
    ['complex-development', 'oits-development-brief'],
    ['bounded-change', 'NONE'],
    ['domain-production', 'DOMAIN_LOCAL'],
    ['validation-only', 'NONE'],
    ['release-intent', 'NONE']
  ]);
  const available = new Set(manifest.entries.filter(e => e.kind === 'skill').map(e => e.source.split('/')[2]));
  const seen = new Set(), selected = new Set();
  for (const line of lines.slice(2)) {
    const cells = line.split('|').slice(1, -1).map(cell => cell.trim().replaceAll(String.fromCharCode(96), ''));
    ensure(cells.length === 4, 'SKILL ROUTING: invalid route column count');
    const [id, positive, primary, negative] = cells;
    ensure(expected.has(id) && !seen.has(id), 'SKILL ROUTING: unknown/duplicate route ' + id);
    seen.add(id);
    ensure(primary === expected.get(id), 'SKILL ROUTING: wrong owner for ' + id);
    ensure(positive.length > 35 && negative.length > 35, 'SKILL ROUTING: incomplete positive/negative trigger for ' + id);
    if (primary.startsWith('oits-')) {
      ensure(available.has(primary) && !selected.has(primary), 'SKILL ROUTING: missing/shadowed primary Skill ' + primary);
      selected.add(primary);
    }
  }
  ensure(seen.size === expected.size, 'SKILL ROUTING: missing required route');
  ensure(selected.size === available.size, 'SKILL ROUTING: a shared Skill lacks a primary route');
  const root = await readFile(join(ROOT, 'AGENTS.md'), 'utf8');
  ensure(root.includes('decision-routing-and-ownership.md') && root.includes('Abstain when no Skill adds value'),
    'SKILL ROUTING: root missing selective routing/abstention');
  for (const entry of manifest.entries.filter(e => e.kind === 'skill')) {
    const content = await readFile(join(ROOT, entry.source), 'utf8');
    const description = content.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? '';
    ensure(description.length >= 45 && description.length <= 320 &&
      /\b(use|when)\b/i.test(description) && /\b(not|skip|avoid)\b/i.test(description),
      'SKILL ROUTING: description lacks concise positive/negative conditions: ' + entry.source);
  }
  for (const name of ['codex-cli', 'claude-code', 'opencode']) {
    const doc = await readFile(join(ROOT, 'docs/adapters/' + name + '.md'), 'utf8');
    ensure(doc.includes('## Skill activation evidence (real host only)') && doc.includes('NOT_VERIFIED'),
      'SKILL ROUTING: missing host activation evidence boundary: ' + name);
  }
}

async function validateSkillActivationPilot(evals) {
  const pilot = await readJson('evals/skill-activation-pilot.json');
  ensure(pilot.schemaVersion === 1 && pilot.id === 'oits-skill-activation-pilot' &&
    pilot.work === 'skill-activation-reliability' && pilot.status === 'NORMATIVE_NOT_EXECUTED',
    'ACTIVATION PILOT: invalid identity or false executed state');
  ensure(pilot.historicalReferences?.preActivationSourceSha === '4dc6402479fb24f8c902ea67ae2d4a59c6fe593d' &&
    pilot.historicalReferences?.initialRoutingSourceSha === '95445ff3d361d1112b9ce1e75eb3abb2b7467a3c',
    'ACTIVATION PILOT: baseline source reference mismatch');
  const expected = new Map([
    ['GOV-211', ['required_core', 'oits-repository-audit']],
    ['GOV-212', ['required_core', 'oits-agent-quality-review']],
    ['GOV-213', ['required_core', 'oits-development-brief']],
    ['GOV-214', ['no_shared_skill', 'NONE']],
    ['GOV-215', ['required_domain', 'lazydesigner-modelling']],
    ['GOV-216', ['no_shared_skill', 'NONE']],
    ['GOV-217', ['unavailable', 'NOT_VERIFIED']],
    ['GOV-218', ['identity_integrity', 'NOT_VERIFIED']],
    ['GOV-219', ['method_selection', 'NONE']],
    ['GOV-220', ['evidence_integrity', 'NOT_VERIFIED']]
  ]);
  const knownCases = new Map(evals.cases.map(c => [c.id, c]));
  ensure(Array.isArray(pilot.cases) && pilot.cases.length === expected.size,
    'ACTIVATION PILOT: missing or extra frozen cases');
  const seen = new Set();
  for (const item of pilot.cases) {
    const required = expected.get(item.id);
    ensure(required && !seen.has(item.id) && knownCases.has(item.id) &&
      item.group === required[0] && item.expectedPrimary === required[1],
      'ACTIVATION PILOT: wrong owner/duplicate frozen case ' + String(item.id));
    seen.add(item.id);
  }
  ensure(pilot.trialRequirements?.noCIOrCloudSubstitution === true &&
    pilot.trialRequirements?.noAutomaticExecution === true &&
    pilot.trialRequirements?.sourceOnlyResultsAllowed === false &&
    pilot.trialRequirements?.suggestedTrialsPerCasePerArm >= 2 &&
    JSON.stringify(pilot.trialRequirements?.arms) === JSON.stringify(['baseline','candidate']),
    'ACTIVATION PILOT: invalid permission, comparison or source-only restrictions');
  const receipt = pilot.observationContract;
  ensure(Array.isArray(receipt?.required) && Array.isArray(receipt?.allowedOutcome) &&
    ['caseId','standardSha','targetHead','hostApp','selectedSkillId','effectiveLoadedSkillPath','loadEvidenceRef','outcome'].every(key => receipt.required.includes(key)) &&
    receipt.allowedOutcome.includes('NOT_VERIFIED') &&
    !receipt.allowedOutcome.includes('PASS'), 'ACTIVATION PILOT: insufficient host-proof contract');
  ensure(!Object.keys(pilot).some(key => ['results','measured','passRate','trials'].includes(key)),
    'ACTIVATION PILOT: unexecuted source must not include invented results');
  const protocol = await readFile(join(ROOT, 'evals/skill-activation-pilot.md'), 'utf8');
  ensure(protocol.includes('HOST_EVAL_NOT_EXECUTED') && protocol.includes('False negative') &&
    protocol.includes('False positive') && /safety|security|integrity/i.test(protocol),
    'ACTIVATION PILOT: missing evaluation or safety protocol');
}

function ownedMarkdownSection(markdown, title) {
  const lines = markdown.split(/\r?\n/);
  const heading = '## ' + title;
  const first = lines.indexOf(heading);
  if (first < 0 || lines.indexOf(heading, first + 1) >= 0) return '';
  let end = lines.findIndex((line, i) => i > first && /^## /.test(line));
  if (end < 0) end = lines.length;
  return lines.slice(first + 1, end).join('\n');
}

// L0 source guard: detects specific reversed policy directives, not arbitrary Markdown meaning.
async function validateGoalStopAndGitHubReliability() {
  const [root, sop, toolContract, evidence, continuity] = await Promise.all([
    readFile(join(ROOT, 'AGENTS.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/execution-sop.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/tool-contracts-and-reliability.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/evidence-and-recovery.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/context-and-session-continuity.md'), 'utf8')
  ]);
  const work = ownedMarkdownSection(root, 'Work discipline');
  const goalLine = work.split('\n').find(line => line.startsWith('- **Keep the user goal fixed:**')) || '';
  ensure(goalLine.includes('optional polish') && goalLine.includes('**not** authorization for more work'),
    'GOAL STOP: root must deny automatic scope expansion');
  const goal = ownedMarkdownSection(sop, 'Goal lock, scope guard and terminal STOP');
  const optionalLine = goal.split('\n').find(line => line.startsWith('- **OPTIONAL_OR_UNRELATED:**')) || '';
  const terminalLine = goal.split('\n').find(line => line.startsWith('**Terminal STOP decision:**')) || '';
  ensure(goal.includes('**REQUIRED_FOR_ACCEPTANCE:**') && goal.includes('**BLOCKER_OR_CONFLICT:**') &&
    optionalLine.includes('**Do not implement or automatically queue them.**') &&
    terminalLine.includes('set the scoped work `DONE`, report actual proof, and **STOP**'),
    'GOAL STOP: missing required/blocked classification, optional prohibition or terminal decision');
  const github = ownedMarkdownSection(toolContract, 'ChatGPT-GitHub operational preflight and commit reconciliation');
  ensure(github.includes('PARTIAL_SOURCE_CHANGE') && github.includes('expected-SHA/fast-forward guard') &&
    github.includes('UNKNOWN_OUTCOME') && github.includes('first inspect the actual remote branch/commit/file state'),
    'GITHUB RELIABILITY: partial/unknown writes must require remote reconciliation');
  const acceptance = ownedMarkdownSection(evidence, 'Goal acceptance before STOP');
  ensure(acceptance.includes('**Specification**') && acceptance.includes('**Standards**') &&
    acceptance.includes('**DONE → STOP**') && acceptance.includes('NOT_EXECUTED'),
    'GOAL STOP: missing two-axis acceptance and honest proof ceiling');
  const context = ownedMarkdownSection(continuity, 'Keep the primary goal across long prompting');
  ensure(context.includes('DONE → STOP') &&
    context.includes('Do not reclassify successive optional polish suggestions as mandatory work'),
    'GOAL STOP: long context may not promote agent polish into user work');
  const integrity = ownedMarkdownSection(evidence, 'Evidence integrity: observations, inferences and meaningful checks');
  ensure(integrity.includes('OBSERVED') && integrity.includes('INFERRED') &&
    integrity.includes('TEST_AUTHORED_NOT_RUN') && integrity.includes('negative control'),
    'EVIDENCE INTEGRITY: missing observation, causality or negative-control boundary');
}

async function validateResearchReadinessContracts() {
  const [root, routing, sop, evidence, brief, communication] = await Promise.all([
    readFile(join(ROOT, 'AGENTS.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/decision-routing-and-ownership.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/execution-sop.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/evidence-and-recovery.md'), 'utf8'),
    readFile(join(ROOT, 'skills/core/oits-development-brief/SKILL.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/user-facing-communication.md'), 'utf8')
  ]);
  const rootRules = ownedMarkdownSection(root, 'Work discipline');
  const routeRules = ownedMarkdownSection(routing, 'Intent and research readiness — mandatory decision, conditional depth');
  const researchRules = ownedMarkdownSection(sop, 'Clarification and broad research — before material implementation');
  const evidenceRules = ownedMarkdownSection(evidence, 'Research coverage, source quality and sufficiency');
  const briefRules = ownedMarkdownSection(brief, 'Readiness and source-grounded clarification');
  const communicationRules = ownedMarkdownSection(communication, 'Research-backed discussion before material implementation');
  ensure(rootRules.includes('**Research and clarify before material implementation:**') &&
    rootRules.includes('counterevidence'),
    'RESEARCH READINESS: root missing source-depth and clarification rule');
  ensure(['PROCEED_DIRECTLY','RESEARCH_MORE','DISCUSS_FIRST','BLOCKED','DESIGN_READY','ACTION_AUTHORIZED'].every(id => routeRules.includes(id)) &&
    routeRules.includes('**Design approval does not grant mutation permission.**'),
    'RESEARCH READINESS: missing readiness routes or design/permission separation');
  ensure(researchRules.includes('**Do not stop after the first convenient result.**') &&
    researchRules.includes('**Do not implement a materially ambiguous design merely because sources were found.**') &&
    researchRules.includes('**one decision-changing question per turn**') &&
    researchRules.includes('RESEARCH_INCOMPLETE'),
    'RESEARCH READINESS: missing broad research or material-ambiguity guard');
  ensure(evidenceRules.includes('**Do not stop after the first favorable or convenient source.**') &&
    evidenceRules.includes('**Breadth and depth are separate.**') &&
    evidenceRules.includes('adaptive saturation judgment') &&
    evidenceRules.includes('counterevidence'),
    'RESEARCH READINESS: source diversity and sufficiency evidence missing');
  ensure(briefRules.includes('**Do not implement a material unresolved design solely because the brief was written.**') &&
    communicationRules.includes('**Current status:**') &&
    communicationRules.includes('**Next step:**'),
    'RESEARCH READINESS: development brief or discussion boundary missing');
}

async function validateMethodRegistry(evals) {
  const data = await readJson('registry/methods.json');
  const schema = await readJson('schemas/method-registry.schema.json');
  ensure(schema && schema.properties && schema.properties.methods && schema.properties.defaultEngineeringPass, 'METHOD REGISTRY: missing schema controls');
  ensure(data.schemaVersion === 1 && data.id === 'oits-engineering-method-registry', 'METHOD REGISTRY: invalid registry identity');
  ensure(data.version === '0.1.0-draft' && data.status === 'SOURCE_REVIEWED_NOT_HOST_TESTED', 'METHOD REGISTRY: unproven status or version');
  const owner = '.agent-standard/core/engineering-and-review-methods.md';
  ensure(data.canonicalOwner === owner, 'METHOD REGISTRY: unexpected procedure owner');
  ensure(Array.isArray(data.defaultEngineeringPass) && JSON.stringify(data.defaultEngineeringPass) === JSON.stringify(['karpathy-guidelines','ponytail']), 'METHOD REGISTRY: default Karpathy/Ponytail pass must stay combined');
  ensure(data.defaultPassMode === 'single-compact-review', 'METHOD REGISTRY: duplicate baseline review not allowed');
  ensure(data.commonConstraints && Object.values(data.commonConstraints).length === 6 && Object.values(data.commonConstraints).every(x => x === true), 'METHOD REGISTRY: safety constraints cannot be weakened');
  ensure(Array.isArray(data.methods) && data.methods.length === 8, 'METHOD REGISTRY: exact eight reviewed methods required');
  const required = ['karpathy-guidelines','ponytail','pstack-poteto','harness2','deepseek-harness','rea','ui-ux-pro-max','matt-pocock'];
  const observed = data.methods.map(m => m.id);
  ensure(JSON.stringify(observed) === JSON.stringify(required), 'METHOD REGISTRY: missing, duplicated or reordered method');
  const cases = new Map(evals.cases.map(c => [c.id,c]));
  const linkedCaseIds = new Set();
  for (const [i, method] of data.methods.entries()) {
    ensure(method.group === (i < 2 ? 'baseline' : 'conditional'), 'METHOD REGISTRY: invalid activation class ' + method.id);
    ensure(method.state === 'POLICY_ADAPTED_SOURCE_ONLY', 'METHOD REGISTRY: unverified method claims ' + method.id);
    for (const field of ['triggers','negativeTriggers','procedure','sourceOnlyEvidence','prohibitions']) {
      const values = method[field];
      ensure(Array.isArray(values) && values.length >= (field === 'procedure' ? 3 : 1) && values.every(v => typeof v === 'string' && v.length > 10), 'METHOD REGISTRY: missing operational ' + field + ' for ' + method.id);
    }
    ensure(method.caseIds && method.caseIds.positive !== method.caseIds.negative, 'METHOD REGISTRY: positive/negative cases must differ for ' + method.id);
    for (const id of [method.caseIds.positive,method.caseIds.negative]) {
      ensure(typeof id === 'string' && cases.has(id) && !linkedCaseIds.has(id), 'METHOD REGISTRY: missing or shared eval case ' + String(id));
      linkedCaseIds.add(id);
      const testCase = cases.get(id);
      ensure(['L1_ROUTING','L2_WORKFLOW','L3_ADVERSARIAL'].includes(testCase.level), 'METHOD REGISTRY: unsupported case level ' + id);
    }
    const p = method.provenance;
    ensure(p && typeof p.repository === 'string' && p.repository.includes('/') && typeof p.reviewedPath === 'string' && p.reviewedPath.length > 3, 'METHOD REGISTRY: invalid provenance path');
    ensure(typeof p.revision === 'string' && /^[0-9a-f]{40}$/.test(p.revision), 'METHOD REGISTRY: unpinned source revision ' + method.id);
    ensure(p.url === 'https://github.com/' + p.repository + '/blob/' + p.revision + '/' + p.reviewedPath, 'METHOD REGISTRY: source reference mismatch ' + method.id);
    ensure(p.copyPolicy === 'REFERENCE_PATTERN_ONLY_REVIEW_LICENSE_BEFORE_COPY', 'METHOD REGISTRY: external code/prompt copying not authorized');
  }
  const root = await readFile(join(ROOT,'AGENTS.md'),'utf8');
  ensure(root.includes('.agent-standard/methods.json') && root.includes('Karpathy + Ponytail'), 'METHOD REGISTRY: root is missing mandatory conditional routing');
  const procedure = await readFile(join(ROOT,owner),'utf8');
  ensure(procedure.includes('.agent-standard/methods.json') && procedure.includes('Karpathy + Ponytail'), 'METHOD REGISTRY: source owner not linked');
}

function readmeProseOutsideFences(markdown) {
  const visible = [];
  let fence = null;
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^\s{0,3}(\x60{3,}|~{3,})/);
    if (match) {
      if (fence === null) fence = match[1];
      else if (match[1][0] === fence[0] && match[1].length >= fence.length) fence = null;
      continue;
    }
    if (fence === null) visible.push(line);
  }
  return visible.join('\n');
}

function readmeLinkDestinations(readme) {
  const prose = readmeProseOutsideFences(readme);
  const definitions = new Map();
  const normalize = label => label.trim().replace(/\s+/g, ' ').toLowerCase();
  const definition = /^\s{0,3}\[([^\]\n]+)\]:\s*(?:<([^>\n]+)>|([^\s\n]+))/gm;
  for (const match of prose.matchAll(definition)) {
    const label = normalize(match[1]);
    if (!definitions.has(label)) definitions.set(label, match[2] || match[3]);
  }
  const content = prose.replace(definition, '');
  const destinations = [];
  for (const match of content.matchAll(/!?\[[^\]\n]+\]\((<[^>\n]+>|[^\s)\n]+)(?:\s+["'][^"']*["'])?\)/g)) {
    const raw = match[1];
    destinations.push(raw.startsWith('<') ? raw.slice(1, -1) : raw);
  }
  // Full and collapsed reference links; complex or shortcut Markdown is not certified.
  for (const match of content.matchAll(/!?\[([^\]\n]+)\]\[([^\]\n]*)\]/g)) {
    const label = normalize(match[2] || match[1]);
    ensure(definitions.has(label), 'README REFERENCE UNRESOLVED: ' + label);
    destinations.push(definitions.get(label));
  }
  return destinations;
}

function readmeHeadingAnchors(markdown) {
  const anchors = new Set();
  const duplicates = new Map();
  const prose = readmeProseOutsideFences(markdown);
  for (const line of prose.split('\n')) {
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    const clean = heading[1].replace(/<[^>]*>/g, '').replace(/[\x60*_~]/g, '').toLowerCase().trim();
    const slug = clean.replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-');
    if (!slug) continue;
    const suffix = duplicates.get(slug) || 0;
    anchors.add(suffix === 0 ? slug : slug + '-' + suffix);
    duplicates.set(slug, suffix + 1);
  }
  for (const match of prose.matchAll(/<a\s+(?:name|id)=["']([^"']+)["'][^>]*>/gi)) {
    anchors.add(match[1]);
  }
  return anchors;
}

async function validateRepositoryReadme() {
  const readme = await readFile(join(ROOT, 'README.md'), 'utf8');
  const standard = await readFile(join(ROOT, 'docs/standards/repository-readme.md'), 'utf8');
  const pkg = await readJson('package.json');
  ensure(readme.startsWith('# OpenITStudios AgentSkill\n') &&
    readme.includes('## Start here') &&
    readme.includes('## Example: review AgentSkill source in ChatGPT') &&
    readme.includes('## Verification and evidence') &&
    readme.includes('docs/standards/repository-readme.md') &&
    standard.includes('## Claim verification and freshness') &&
    standard.includes('## Review workflow'),
    'README CONTRACT: entry, workflow example or quality standard missing');

  const status = readme.match(/^\*\*Status:\*\*\s*\x60([^\x60]+)\x60/m);
  ensure(status && status[1] === pkg.version, 'README VERSION: current status differs from package.json');

  // Only check simple npm commands in shell fences, not incidental words in prose.
  const commands = [];
  for (const block of readme.matchAll(/^\s{0,3}\x60{3}(?:bash|sh|shell)\s*\n([\s\S]*?)^\s{0,3}\x60{3}\s*$/gm)) {
    for (const line of block[1].split(/\r?\n/)) {
      const command = line.trim();
      if (/^npm\s+(?:run\s+|test(?:\s|$))/.test(command)) commands.push(command);
    }
  }
  ensure(commands.includes('npm run check') && commands.includes('npm test'),
    'README COMMANDS: documented check/test commands must be in shell fences');
  for (const command of commands) {
    const run = command.match(/^npm\s+run\s+([a-zA-Z0-9:_-]+)$/);
    const script = run ? run[1] : command === 'npm test' ? 'test' : null;
    ensure(script !== null && typeof pkg.scripts?.[script] === 'string',
      'README COMMANDS: unsupported or undeclared npm command: ' + command);
  }

  // Current root README: ordinary inline/full/collapsed links and simple heading fragments.
  // This does not validate remote URLs, arbitrary HTML, or every GFM link form.
  for (const destination of readmeLinkDestinations(readme)) {
    if (/^(?:https?:\/\/|mailto:|\/\/)/i.test(destination)) continue;
    ensure(!/^[a-z][a-z0-9+.-]*:/i.test(destination),
      'README LINK SCHEME UNSUPPORTED: ' + destination);
    const [beforeFragment, encodedFragment] = destination.split('#', 2);
    const rawPath = beforeFragment.split('?')[0];
    const unescaped = decodeURIComponent(rawPath);
    const local = unescaped.replace(/^\.\//, '').replace(/^\//, '') || 'README.md';
    const path = safeRelativePath(local);
    const state = await pathExists(join(ROOT, path));
    ensure(state !== null, 'README LINK MISSING: ' + path);
    if (!encodedFragment) continue;
    ensure(state.isFile() && /\.md$/i.test(path),
      'README ANCHOR UNSUPPORTED: ' + path);
    const fragment = decodeURIComponent(encodedFragment);
    const target = path === 'README.md' ? readme : await readFile(join(ROOT, path), 'utf8');
    ensure(readmeHeadingAnchors(target).has(fragment),
      'README ANCHOR MISSING: ' + path + '#' + fragment);
  }
}

// L0 policy-presence guard. It detects missing or inverted explicit safety rules;
// it does not prove ChatGPT recovery behavior, persistence or model compliance.
async function validateChatLimitRecoveryContracts() {
  const [root, context, continuity, handoff, examples] = await Promise.all([
    readFile(join(ROOT, 'AGENTS.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/context-and-session-continuity.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/commit-continuity-and-recovery.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/handoff-and-state.md'), 'utf8'),
    readFile(join(ROOT, 'docs/examples/commit-continuity.md'), 'utf8')
  ]);
  const rootRules = ownedMarkdownSection(root, 'Work discipline');
  const events = ownedMarkdownSection(context, 'Event-driven checkpoints for unexpected chat limits');
  const emergency = ownedMarkdownSection(continuity, 'Unexpected ChatGPT chat-limit recovery');
  const persistence = ownedMarkdownSection(handoff, 'Persisted checkpoints and unsaved handoffs');
  ensure(rootRules.includes('**Chat-limit recovery:**') &&
    rootRules.includes('never claim an unsaved checkpoint was persisted'),
    'CHAT LIMIT RECOVERY: missing root persistence/authority boundary');
  ensure(events.includes('**Do not wait for a chat-length warning or predict remaining capacity.**') &&
    events.includes('**Only an authorized, verified write is PERSISTED; a chat summary or unacknowledged write is not.**') &&
    events.includes('**If no authorized destination exists, provide a copyable handoff labeled UNSAVED; do not create a new status store.**'),
    'CHAT LIMIT RECOVERY: event triggers, verified persistence or UNSAVED fallback missing');
  ensure(emergency.includes('**Never treat a recovered checkpoint, Memory item, chat summary or old Next as renewed user authorization.**') &&
    emergency.includes('**Resolve UNKNOWN_OUTCOME against actual destination state before any retry.**') &&
    emergency.includes('RECOVERY_READY_SOURCE_ONLY') && emergency.includes('RECOVERY_AMBIGUOUS'),
    'CHAT LIMIT RECOVERY: recovery authority or remote reconciliation missing');
  ensure(persistence.includes('**For a lost acknowledgment or concurrent update, reread the actual remote state before any retry; do not force-push or blindly overwrite.**') &&
    persistence.includes('`UNSAVED`') && persistence.includes('`PERSISTED`'),
    'CHAT LIMIT RECOVERY: checkpoint state or concurrency guard missing');
  ensure(examples.includes('## Unexpected chat-limit recovery — source-grounded example') &&
    examples.includes('SAVE_STATE: UNSAVED') && examples.includes('read the actual commit/ref before any retry'),
    'CHAT LIMIT RECOVERY: read-only handoff example missing');
}

async function validateCanonical() {
  const manifest = await readJson(MANIFEST_PATH);
  ensure(manifest.schemaVersion === 1 && manifest.name === 'oits-agent-standard', 'invalid standard manifest identity');
  ensure(/^0\.1\.0-draft$/.test(manifest.version) && manifest.state === 'FOUNDATION_SOURCE_ONLY', 'unexpected manifest version/state');
  ensure(manifest.profilePath === PROFILE_PATH && manifest.casesPath === 'evals/cases.json', 'unexpected manifest owner paths');
  ensure(Array.isArray(manifest.entries) && manifest.entries.length >= 9, 'manifest entries missing');
  const srcSeen = new Set(), dstSeen = new Set(), skills = new Set();
  let skillCount = 0;
  for (const entry of manifest.entries) {
    ensure(entry && typeof entry === 'object' && ALLOWED_KINDS.has(entry.kind), 'invalid entry kind');
    const source = safeRelativePath(entry.source), target = safeRelativePath(entry.target);
    ensure(!srcSeen.has(source) && !dstSeen.has(target), 'duplicate distribution path: ' + source + ' -> ' + target);
    srcSeen.add(source);
    dstSeen.add(target);
    await ensureRegularPortableFile(ROOT, source);
    const bytes = await readFile(join(ROOT, source));
    ensure(bytes.length > 0, 'empty source: ' + source);
    if (entry.kind === 'skill') {
      ensure(source.startsWith('skills/core/') && source.endsWith('/SKILL.md'), 'invalid skill source path');
      ensure(target.startsWith('.agents/skills/') && target.endsWith('/SKILL.md'), 'invalid skill target path');
      validateSkill(bytes.toString('utf8'), entry, skills);
      ensure(target.split('/').at(-2) === source.split('/').at(-2), 'skill destination mismatch');
      skillCount++;
    } else if (entry.kind === 'core') {
      ensure(source.startsWith('.agent-standard/core/') && target === source, 'invalid core policy target');
    } else if (entry.kind === 'adapter') {
      ensure(source.startsWith('docs/adapters/') && source.endsWith('.md') && target === source.replace('docs/adapters/', '.agent-standard/adapters/'), 'invalid host adapter target');
    } else if (entry.kind === 'method_registry') {
      ensure(source === 'registry/methods.json' && target === '.agent-standard/methods.json', 'invalid method registry distribution target');
    } else {
      ensure(['AGENTS.md','GITHUB_RULES.md'].includes(source) && target === source, 'invalid root policy target');
    }
  }
  ensure(dstSeen.has('AGENTS.md') && dstSeen.has('GITHUB_RULES.md'), 'missing portable root rules');
  ensure(skillCount >= 3, 'minimum core skills missing');
  const continuityPath = '.agent-standard/core/commit-continuity-and-recovery.md';
  ensure(srcSeen.has(continuityPath) && dstSeen.has(continuityPath), 'COMMIT CONTINUITY: portable policy missing');
  const githubPolicy = await readFile(join(ROOT, 'GITHUB_RULES.md'), 'utf8');
  const rootPolicy = await readFile(join(ROOT, 'AGENTS.md'), 'utf8');
  const continuity = await readFile(join(ROOT, continuityPath), 'utf8');
  ensure(githubPolicy.includes('## Commit quality and cross-chat continuity') && rootPolicy.includes('## Commit continuity') && continuity.includes('## How to continue a task in another ChatGPT conversation'), 'COMMIT CONTINUITY: source policies not linked');
  ensure(continuity.includes('## Commit message: choose the smallest sufficient tier') &&
    continuity.includes('## Active status docs: small front door') &&
    githubPolicy.includes('**TRIVIAL**') && githubPolicy.includes('**CRITICAL**') &&
    rootPolicy.includes('GitHub Continuity Protocol v2'), 'COMMIT CONTINUITY V2: tiered format or scoped recovery missing');
  const checkerText = await readFile(join(ROOT,'tools/commit-message-check.mjs'),'utf8');
  ensure(checkerText.includes('TRIVIAL REQUIRES DIFF') && checkerText.includes('DIFF RISK') &&
    checkerText.includes('DIFF_NOT_REVIEWED'), 'COMMIT CONTINUITY V2: source scope guards missing');

  for (const field of ['Surface','Goal','Work','State','Proof','Decision','Unresolved','Next']) {
    ensure(continuity.includes('`' + field + '`') || continuity.includes(field + ':'), 'COMMIT CONTINUITY: missing field ' + field);
  }
  await ensureRegularPortableFile(ROOT, 'tools/commit-message-check.mjs');
  await ensureRegularPortableFile(ROOT, 'tools/commit-snapshot-check.mjs');
  const snapshotCheck = await readFile(join(ROOT, 'tools/commit-snapshot-check.mjs'),'utf8');
  ensure(snapshotCheck.includes('CALLER_SUPPLIED_SNAPSHOT_NOT_AUTHENTICATED') &&
    snapshotCheck.includes('SNAPSHOT_CONSISTENT') &&
    snapshotCheck.includes('FILE_LIST_MAY_BE_PAGINATED'), 'COMMIT SNAPSHOT: insufficient source-proof caveats');
  const pkg = await readJson('package.json');
  ensure(pkg.scripts && pkg.scripts['commit:check'] === 'node tools/commit-message-check.mjs', 'COMMIT CONTINUITY: offline checker not linked');
  ensure(pkg.scripts['snapshot:check'] === 'node tools/commit-snapshot-check.mjs' && pkg.scripts.test.includes('tests/commit-snapshot.test.mjs'), 'COMMIT SNAPSHOT: reference tests not registered');
  ensure(manifest.entries.filter(e => e.kind === 'method_registry').length === 1, 'METHOD REGISTRY: exactly one portable registry is required');
  const communicationPath = '.agent-standard/core/user-facing-communication.md';
  ensure(srcSeen.has(communicationPath) && dstSeen.has(communicationPath), 'MANDATORY COMMUNICATION POLICY: distribution entry missing');
  const rootInstructions = await readFile(join(ROOT, 'AGENTS.md'), 'utf8');
  ensure(rootInstructions.includes('## User-facing communication') && rootInstructions.includes(communicationPath), 'MANDATORY COMMUNICATION POLICY: root instruction missing');
  const communication = await readFile(join(ROOT, communicationPath), 'utf8');
  ensure(communication.includes('Answer first') && communication.includes('ASD-STE100') && communication.includes('Diagram-first'), 'MANDATORY COMMUNICATION POLICY: content incomplete');
  const sentenceRules = ownedMarkdownSection(communication, 'Sentence clarity — identify the actor and the action');
  const reportRules = ownedMarkdownSection(communication, 'Material work reports — three reading zones');
  ensure(sentenceRules.includes('subject–verb–object') && sentenceRules.includes('Do **not** mechanically require an object'),
    'COMMUNICATION FORMAT: clear but non-mechanical sentence contract missing');
  ensure(reportRules.includes('**Current status:**') &&
    reportRules.includes('**Explanation:**') &&
    reportRules.includes('**Completed work:**') &&
    reportRules.includes('**Evidence and limits:**') &&
    reportRules.includes('**Next step:**') &&
    reportRules.includes('**Keep each heading and its summary/status on the same line; never put CONTINUE/STOP on the line below.**') &&
    reportRules.includes('**Use a single horizontal divider immediately before the final Next step**') &&
    reportRules.includes('**Do not invent a next action.**') &&
    reportRules.includes('**"Next step — STOP"**') &&
    reportRules.includes('not a mandatory report template') &&
    reportRules.includes('no mandatory badge, colored callout, enclosing card'),
    'COMMUNICATION FORMAT: three-zone separation or next-step integrity missing');
  const visualRules = ownedMarkdownSection(communication, 'Visual-first selection — match the information structure');
  ensure(visualRules.includes('**one primary representation**') &&
    visualRules.includes('**Compact comparison table**') &&
    visualRules.includes('**Data chart**') &&
    visualRules.includes('Do not invent numbers simply to produce a graph') &&
    visualRules.includes('**short text equivalent**') &&
    visualRules.includes('The correct visual choice may be **none**'),
    'COMMUNICATION VISUAL: missing appropriate-format, data-integrity or readability guidance');
  const rubric = await readJson('evals/communication-rubric.json');
  ensure(rubric && rubric.schemaVersion === 1 && rubric.status === 'NORMATIVE_NOT_MEASURED' && rubric.standardPath === communicationPath, 'invalid communication rubric identity');
  ensure(Array.isArray(rubric.dimensions) && rubric.dimensions.length >= 6, 'insufficient communication quality dimensions');
  const rubricIds = new Set();
  for (const dimension of rubric.dimensions) {
    ensure(dimension && typeof dimension.id === 'string' && !rubricIds.has(dimension.id), 'invalid/duplicate communication dimension');
    rubricIds.add(dimension.id);
    ensure(['hard_gate','quality'].includes(dimension.type) && typeof dimension.question === 'string' && dimension.question.length > 10 && typeof dimension.evidence === 'string' && dimension.evidence.length > 10, 'invalid communication rubric criteria');
  }

  ensure(rubric.dimensions.some(d => d.id === 'visual_scanability' && d.type === 'quality'),
    'COMMUNICATION VISUAL: missing readability rubric');
  const mandatoryCommunicationDimensions = new Map([
    ['actor_action_clarity', 'quality'],
    ['completed_work_visibility', 'quality'],
    ['next_step_integrity', 'hard_gate']
  ]);
  for (const [id, type] of mandatoryCommunicationDimensions) {
    ensure(rubric.dimensions.some(d => d.id === id && d.type === type),
      'COMMUNICATION FORMAT: rubric lacks ' + id);
  }

  ensure(manifest.entries.filter(e => e.kind === 'adapter').length === 3, 'three canonical agent host adapters required');
  await ensureCompletePortableInventory(manifest);
  await validateActivationContracts(manifest);
  await validateGoalStopAndGitHubReliability();
  await validateResearchReadinessContracts();
  await validateChatLimitRecoveryContracts();
  await validateRepositoryReadme();

  const schema = await readJson('schemas/repository-profile.schema.json');
  ensure(schema && schema.properties && schema.properties.holds && schema.properties.branchPolicy, 'profile schema missing guards');
  validateProfile(await readJson(PROFILE_PATH));

  const evals = await readJson('evals/cases.json');
  ensure(evals.schemaVersion === 1 && evals.status === 'NORMATIVE_CASES_NOT_MODEL_EXECUTED', 'eval corpus cannot claim model execution');
  ensure(Array.isArray(evals.cases) && evals.cases.length >= 20, 'insufficient evaluation cases');
  const ids = new Set(), levels = new Set();
  for (const c of evals.cases) {
    ensure(c && typeof c.id === 'string' && /^GOV-[0-9]{3}$/.test(c.id) && !ids.has(c.id), 'invalid/duplicate case ID');
    ids.add(c.id);
    ensure(ALLOWED_LEVELS.has(c.level), 'invalid eval level: ' + c.id);
    levels.add(c.level);
    ensure(typeof c.title === 'string' && c.title.length > 5 && typeof c.request === 'string' && c.request.length > 10, 'invalid eval title/request: ' + c.id);
    ensure(c.context && typeof c.context === 'object' && !Array.isArray(c.context), 'missing eval context: ' + c.id);
    ensure(Array.isArray(c.expected) && c.expected.length > 0 && c.expected.every(x => typeof x === 'string' && x.length > 0), 'missing positive oracle: ' + c.id);
    ensure(Array.isArray(c.forbidden) && c.forbidden.length > 0 && c.forbidden.every(x => typeof x === 'string' && x.length > 0), 'missing negative oracle: ' + c.id);
    ensure(['low','medium','high','critical'].includes(c.severity), 'invalid severity: ' + c.id);
  }
  ensure(levels.size === 4, 'evaluation coverage must span L0-L3');
  await validateMethodRegistry(evals);
  await validateSkillActivationPilot(evals);
  return { manifest, caseCount: evals.cases.length, skillCount };
}

async function pathExists(p) {
  try { return await lstat(p); }
  catch (err) { if (err.code === 'ENOENT') return null; throw err; }
}

function preventRepoOutput(output) {
  const diff = relative(ROOT, output);
  ensure(diff === '..' || diff.startsWith('..' + sep) || isAbsolute(diff), 'PACKAGE BLOCKED: output cannot be inside the canonical repository');
}

async function preventRedirectedRepoOutput(target) {
  // A lexical outside-repo path can still enter the repo through a symlink.
  let ancestor = dirname(target);
  while (!(await pathExists(ancestor))) {
    const next = dirname(ancestor);
    ensure(next !== ancestor, 'PACKAGE BLOCKED: no existing ancestor');
    ancestor = next;
  }
  const state = await lstat(ancestor);
  ensure(state.isDirectory() && !state.isSymbolicLink(), 'PACKAGE BLOCKED: symlink/non-directory parent');
  const actualAncestor = await realpath(ancestor);
  const projectedTarget = resolve(actualAncestor, relative(ancestor, target));
  preventRepoOutput(projectedTarget);
}

async function packageBundle(rawTarget, validated) {
  ensure(typeof rawTarget === 'string' && rawTarget.length > 0, 'package requires a fresh output directory');
  const target = resolve(rawTarget);
  preventRepoOutput(target);
  await preventRedirectedRepoOutput(target);
  ensure((await pathExists(target)) === null, 'package destination already exists (no overwrite): ' + target);
  await mkdir(target, { recursive: true });
  const files = {};
  for (const entry of validated.manifest.entries) {
    const bytes = await readFile(join(ROOT, entry.source));
    const dest = join(target, entry.target);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, bytes, { flag: 'wx' });
    files[entry.target] = sha256(bytes);
  }
  const lock = {
    schemaVersion: 1,
    standard: validated.manifest.name,
    version: validated.manifest.version,
    status: 'STAGED_NOT_INSTALLED',
    sourceRepository: 'OpenITStudios/AgentSkill',
    sourceCommit: null,
    note: 'Stage only; adoption requires a pinned source commit, a project profile and actual host conformance.',
    files
  };
  const lockFile = join(target, '.agent-standard', 'standard.lock.json');
  await writeFile(lockFile, JSON.stringify(lock, null, 2) + '\n', { flag: 'wx' });
  process.stdout.write('PACKAGE PASS: staged ' + Object.keys(files).length + ' canonical files in ' + target + '; NOT installed.\n');
}

async function verifyParity(rawTarget, validated) {
  ensure(typeof rawTarget === 'string' && rawTarget.length > 0, 'verify requires a target directory');
  const target = resolve(rawTarget);
  const state = await lstat(target);
  ensure(state.isDirectory() && !state.isSymbolicLink(), 'VERIFY BLOCKED: target must be a real directory');
  await ensureRegularPortableFile(target, '.agent-standard/standard.lock.json');
  const lock = await readJson('.agent-standard/standard.lock.json', target);
  ensure(lock.schemaVersion === 1 && lock.standard === validated.manifest.name && lock.version === validated.manifest.version, 'lock/version mismatch');
  ensure(lock.files && typeof lock.files === 'object' && !Array.isArray(lock.files), 'lock files missing');
  const staged = lock.status === 'STAGED_NOT_INSTALLED';
  ensure(staged || lock.status === 'ADOPTED', 'invalid lock status: not staged or adopted');
  if (staged) {
    ensure(lock.sourceCommit === null, 'staging lock must not claim a committed adoption');
  } else {
    ensure(typeof lock.sourceCommit === 'string' && /^[0-9a-f]{40}$/.test(lock.sourceCommit), 'ADOPTION SOURCE SHA REQUIRED');
    ensure((await pathExists(join(target, '.agent-standard/profile.json'))) !== null, 'ADOPTION PROFILE REQUIRED');
    await ensureRegularPortableFile(target, '.agent-standard/profile.json');
    validateProfile(await readJson('.agent-standard/profile.json', target));
  }
  const expectedNames = validated.manifest.entries.map(e => e.target).sort();
  ensure(JSON.stringify(Object.keys(lock.files).sort()) === JSON.stringify(expectedNames), 'lock path list differs from canonical manifest');
  for (const entry of validated.manifest.entries) {
    await ensureRegularPortableFile(target, entry.target);
    const actual = await readFile(join(target, entry.target));
    const source = await readFile(join(ROOT, entry.source));
    const liveHash = sha256(actual), sourceHash = sha256(source);
    ensure(liveHash === sourceHash && lock.files[entry.target] === sourceHash, 'PARITY DRIFT: ' + entry.target);
    if (entry.kind === 'skill') {
      const skillName = entry.target.split('/').at(-2);
      for (const alt of ['.opencode/skills', '.claude/skills', '.codex/skills']) {
        const shadow = join(target, alt, skillName, 'SKILL.md');
        ensure((await pathExists(shadow)) === null, 'POTENTIAL SKILL SHADOW: ' + shadow);
      }
    }
  }
  process.stdout.write('PARITY PASS: ' + (staged ? 'STAGING ONLY; NOT ADOPTED' : 'ADOPTED PROFILE PRESENT; effective host not verified') + '; ' + expectedNames.length + ' canonical files match SHA-256. SOURCE ONLY; not behavioral/native proof.\n');
}

async function main() {
  const command = process.argv[2] || 'validate';
  const validated = await validateCanonical();
  if (command === 'validate') {
    process.stdout.write('VALIDATE PASS: ' + validated.manifest.entries.length + ' portable files; ' + validated.skillCount + ' core skills; ' + validated.caseCount + ' normative cases. NO MODEL TESTS RUN.\n');
  } else if (command === 'package') {
    await packageBundle(process.argv[3], validated);
  } else if (command === 'verify') {
    await verifyParity(process.argv[3], validated);
  } else {
    throw new Error('usage: node tools/standard.mjs [validate | package NEW_DIR | verify TARGET_DIR]');
  }
}

main().catch(error => {
  process.stderr.write('FAIL: ' + error.message + '\n');
  process.exitCode = 1;
});
