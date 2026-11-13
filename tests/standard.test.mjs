import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, appendFile, mkdir, writeFile, readFile, rm, cp, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessCommitMessage } from '../tools/commit-message-check.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(ROOT, 'tools', 'standard.mjs');
function run(...args) {
  return spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
}

test('shared startup loads adopted local project policy before Skill routing', async () => {
  const root = await readFile(join(ROOT, 'AGENTS.md'), 'utf8');
  assert.match(root, /read the actual `\.agent-standard\/project-policy\.md` when present or required by the profile/);
  assert.match(root, /archived prior roots are history, not current instructions/);
});

test('local project policy source guard rejects skipping policy contents', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-project-policy-loading-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const file = join(snapshot, 'AGENTS.md');
    const original = await readFile(file, 'utf8');
    const directive = '**read the actual `.agent-standard/project-policy.md` when present or required by the profile**';
    assert.ok(original.includes(directive));
    await writeFile(file, original.replace(directive, '**do not open the local project policy**'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /LOCAL POLICY LOADING: missing mandatory project-specific policy read/);
  } finally { await rm(parent, { recursive: true, force: true }); }
});

test('canonical source, skill metadata and normative cases validate', async () => {
  const corpus = JSON.parse(await readFile(join(ROOT, 'evals/cases.json'), 'utf8'));
  const r = run('validate');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /VALIDATE PASS/);
  assert.ok(r.stdout.includes(corpus.cases.length + ' normative cases'), r.stdout);
  assert.match(r.stdout, /NO MODEL TESTS RUN/);
});

test('README standard documents source-grounded onboarding and package commands', async () => {
  const [readme, standard, pkgText] = await Promise.all([
    readFile(join(ROOT, 'README.md'), 'utf8'),
    readFile(join(ROOT, 'docs/standards/repository-readme.md'), 'utf8'),
    readFile(join(ROOT, 'package.json'), 'utf8')
  ]);
  const pkg = JSON.parse(pkgText);
  assert.match(readme, /^# OpenITStudios AgentSkill/m);
  assert.match(readme, /## Start here/);
  assert.match(readme, /## Verification and evidence/);
  assert.match(readme, /## Example: review AgentSkill source in ChatGPT/);
  assert.match(readme, /docs\/standards\/repository-readme\.md#review-workflow/);
  assert.match(readme, /docs\/standards\/repository-readme\.md/);
  assert.match(standard, /## Claim verification and freshness/);
  assert.match(standard, /read-only by default/i);
  assert.equal(pkg.scripts.check, 'node tools/standard.mjs validate');
  assert.match(readme, /npm run check/);
  assert.match(readme, /npm test/);
});

test('README validator rejects a nonexistent local link and an invented command', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-readme-source-check-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const file = join(snapshot, 'README.md');
    const original = await readFile(file, 'utf8');
    const correctLink = '[README quality standard](docs/standards/repository-readme.md)';
    assert.ok(original.includes(correctLink));
    await writeFile(file, original.replace(correctLink, '[README quality standard](docs/standards/missing.md)'));
    const badLink = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(badLink.status, 0);
    assert.match(badLink.stderr, /README LINK MISSING:/);

    assert.ok(original.includes('npm run check'));
    await writeFile(file, original.replace('npm run check', 'npm run invented-command'));
    const badCommand = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(badCommand.status, 0);
    assert.match(badCommand.stderr, /README COMMANDS:/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('README validator rejects broken heading anchors and reference-style targets', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-readme-anchor-review-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const file = join(snapshot, 'README.md');
    const original = await readFile(file, 'utf8');
    const good = 'docs/standards/repository-readme.md#review-workflow';
    assert.ok(original.includes(good));
    await writeFile(file, original.replace(good, 'docs/standards/repository-readme.md#missing-anchor'));
    const anchor = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(anchor.status, 0);
    assert.match(anchor.stderr, /README ANCHOR MISSING:/);

    await writeFile(file, original + '\n[Read this][invalid-target]\n\n[invalid-target]: docs/standards/missing-target.md\n');
    const reference = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(reference.status, 0);
    assert.match(reference.stderr, /README LINK MISSING:/);

    await writeFile(file, original + '\n```markdown\n[Illustrative link](docs/not-a-real-file.md)\n```\n');
    const fenced = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.equal(fenced.status, 0, fenced.stderr);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('chat-limit recovery preserves checkpoint, origin and permission boundaries in source', async () => {
  const [context, recovery, handoff, examples, corpusText] = await Promise.all([
    readFile(join(ROOT, '.agent-standard/core/context-and-session-continuity.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/commit-continuity-and-recovery.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/handoff-and-state.md'), 'utf8'),
    readFile(join(ROOT, 'docs/examples/commit-continuity.md'), 'utf8'),
    readFile(join(ROOT, 'evals/cases.json'), 'utf8')
  ]);
  assert.match(context, /Event-driven checkpoints for unexpected chat limits/);
  assert.match(context, /no authorized destination exists, provide a copyable handoff labeled UNSAVED/);
  assert.match(recovery, /Never treat a recovered checkpoint, Memory item, chat summary or old Next as renewed user authorization/);
  assert.match(recovery, /Resolve UNKNOWN_OUTCOME against actual destination state before any retry/);
  assert.match(handoff, /concurrent update, reread the actual remote state before any retry/);
  assert.match(examples, /SAVE_STATE: UNSAVED/);
  const cases = JSON.parse(corpusText).cases;
  for (let i = 262; i <= 267; i++) {
    assert.ok(cases.some(c => c.id === 'GOV-' + i), 'missing interruption case GOV-' + i);
  }
});

test('chat-limit source guard rejects false persisted checkpoints', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-chat-limit-persistence-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const path = join(snapshot, '.agent-standard/core/context-and-session-continuity.md');
    const before = await readFile(path, 'utf8');
    const rule = '**Only an authorized, verified write is PERSISTED; a chat summary or unacknowledged write is not.**';
    assert.ok(before.includes(rule));
    await writeFile(path, before.replace(rule, '**Any chat summary or unacknowledged write is automatically PERSISTED.**'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /CHAT LIMIT RECOVERY: event triggers, verified persistence or UNSAVED fallback missing/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('chat-limit source guard rejects blind retry after unknown outcome', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-chat-limit-retry-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const path = join(snapshot, '.agent-standard/core/commit-continuity-and-recovery.md');
    const before = await readFile(path, 'utf8');
    const rule = '**Resolve UNKNOWN_OUTCOME against actual destination state before any retry.**';
    assert.ok(before.includes(rule));
    await writeFile(path, before.replace(rule, '**Retry UNKNOWN_OUTCOME immediately without checking destination state.**'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /CHAT LIMIT RECOVERY: recovery authority or remote reconciliation missing/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('chat-limit source guard rejects checkpoint-based permission escalation', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-chat-limit-auth-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const path = join(snapshot, '.agent-standard/core/commit-continuity-and-recovery.md');
    const before = await readFile(path, 'utf8');
    const rule = '**Never treat a recovered checkpoint, Memory item, chat summary or old Next as renewed user authorization.**';
    assert.ok(before.includes(rule));
    await writeFile(path, before.replace(rule, '**Treat a recovered checkpoint as renewed permission to modify repositories.**'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /CHAT LIMIT RECOVERY: recovery authority or remote reconciliation missing/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('GitHub task cost lanes and commit safety are distinct', async () => {
  const [sop, toolPolicy, casesText] = await Promise.all([
    readFile(join(ROOT, '.agent-standard/core/execution-sop.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/tool-contracts-and-reliability.md'), 'utf8'),
    readFile(join(ROOT, 'evals/cases.json'), 'utf8')
  ]);
  assert.match(sop, /FAST does not waive branch, permission, security, compatibility or proof checks/);
  assert.match(sop, /Task-cost lane and commit-message tier are independent/);
  assert.match(toolPolicy, /A checked file blob SHA is not a branch-HEAD lease/);
  assert.match(toolPolicy, /One complete GitHub commit receipt can establish commit SHA, parent and changed paths/);
  const cases = JSON.parse(casesText).cases;
  for (let i = 268; i <= 273; i++) assert.ok(cases.some(c => c.id === 'GOV-' + i));
});

test('GitHub efficiency guard rejects an unsafe FAST shortcut', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-efficiency-safety-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(p => p === '.git' || p === 'node_modules') });
    const file = join(snapshot, '.agent-standard/core/execution-sop.md');
    const original = await readFile(file, 'utf8');
    const policy = '**FAST does not waive branch, permission, security, compatibility or proof checks.**';
    assert.ok(original.includes(policy));
    await writeFile(file, original.replace(policy, '**FAST skips permission and security checks.**'));
    const invalid = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /GITHUB EFFICIENCY: missing effort lanes or safety contract/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('context recovery is an unversioned policy and source version remains draft', async () => {
  const [policy, pkgText, manifestText, changelog, rules] = await Promise.all([
    readFile(join(ROOT, '.agent-standard/core/commit-continuity-and-recovery.md'), 'utf8'),
    readFile(join(ROOT, 'package.json'), 'utf8'),
    readFile(join(ROOT, 'registry/standard.manifest.json'), 'utf8'),
    readFile(join(ROOT, 'CHANGELOG.md'), 'utf8'),
    readFile(join(ROOT, 'GITHUB_RULES.md'), 'utf8')
  ]);
  assert.match(policy, /^# GitHub Commit Continuity and Context Recovery/m);
  assert.match(policy, /Adaptive workstream recovery/);
  assert.match(policy, /30 branch-wide/);
  assert.match(changelog, /## \[Unreleased\]/);
  assert.match(rules, /## Version and release discipline/);
  assert.equal(JSON.parse(pkgText).version, '0.1.0-draft');
  assert.equal(JSON.parse(manifestText).version, '0.1.0-draft');
});


test('categorized policy keeps method and shared Skill identities and pins upstream sources', async () => {
  const [index, engineering, skillPolicy, registryText, manifestText] = await Promise.all([
    readFile(join(ROOT, '.agent-standard/core/INDEX.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/engineering-and-review-methods.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/skill-authoring.md'), 'utf8'),
    readFile(join(ROOT, 'registry/methods.json'), 'utf8'),
    readFile(join(ROOT, 'registry/standard.manifest.json'), 'utf8')
  ]);
  for (const category of ['Code Engineering', 'Task Planning', 'Tools & Execution', 'Security & Permissions', 'Context & Continuity', 'Quality, Evidence', 'Communication', 'Release & Adoption']) {
    assert.ok(index.includes(category), 'missing category: ' + category);
  }
  assert.match(engineering, /upstream branch HEAD/i);
  assert.match(engineering, /First-pass code fit — contracts before edit/);
  assert.match(engineering, /Verify the owning contract and affected consumers before writing code/);
  assert.match(engineering, /Do not weaken a test, assertion or contract solely to make a check pass/);
  assert.match(engineering, /Stop a correction strategy after two attempts without new discriminating evidence/);
  assert.match(skillPolicy, /not remove, rename, disable, replace or silently shadow/i);
  const methods = JSON.parse(registryText);
  const manifest = JSON.parse(manifestText);
  assert.deepEqual(methods.methods.map(x => x.id), ['karpathy-guidelines', 'ponytail', 'pstack-poteto', 'harness2', 'deepseek-harness', 'rea', 'ui-ux-pro-max', 'matt-pocock']);
  assert.equal(manifest.entries.filter(x => x.kind === 'skill').length, 3);
  assert.equal(manifest.version, '0.1.0-draft');
});


test('engineering guard rejects weakening a failed acceptance gate for speed', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-first-pass-correction-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const file = join(snapshot, '.agent-standard/core/engineering-and-review-methods.md');
    const original = await readFile(file, 'utf8');
    const directive = '**Do not weaken a test, assertion or contract solely to make a check pass.**';
    assert.ok(original.includes(directive));
    await writeFile(file, original.replace(directive, '**Weaken an assertion whenever it makes a check pass.**'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ENGINEERING QUALITY: first-pass contract or evidence-led correction safety missing/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('original upstream REA and UI UX references remain source-only and pinned', async () => {
  const [registryText, policy, skillPolicy, report, manifestText] = await Promise.all([
    readFile(join(ROOT, 'registry/methods.json'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/engineering-and-review-methods.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/skill-authoring.md'), 'utf8'),
    readFile(join(ROOT, 'docs/research/upstream-original-skill-authenticity-2026-11-13.md'), 'utf8'),
    readFile(join(ROOT, 'registry/standard.manifest.json'), 'utf8')
  ]);
  const reg = JSON.parse(registryText), manifest = JSON.parse(manifestText);
  for (const [id, repo, sha] of [
    ['rea','morluto/rea','54906fdb1fc735b507961b2954f6968775cae4f6'],
    ['ui-ux-pro-max','nextlevelbuilder/ui-ux-pro-max-skill','6ae86f61f520d6ca229d2f40e070410638c908c5']
  ]) {
    const m = reg.methods.find(x => x.id === id);
    assert.equal(m.provenance.repository, repo);
    assert.equal(m.provenance.revision, sha);
    assert.equal(m.state, 'POLICY_ADAPTED_SOURCE_ONLY');
    assert.equal(m.provenance.copyPolicy, 'REFERENCE_PATTERN_ONLY_REVIEW_LICENSE_BEFORE_COPY');
  }
  assert.match(policy, /REFERENCE_ONLY/);
  assert.match(policy, /INSTALLED_SOURCE_VERIFIED/);
  assert.match(policy, /HOST_LOAD_VERIFIED/);
  assert.match(skillPolicy, /host filesystem or instruction traces are inaccessible/);
  assert.match(report, /original repository/i);
  assert.equal(manifest.version, '0.1.0-draft');
  assert.equal(manifest.entries.filter(x => x.kind === 'skill').length, 3);
});

test('activation routing keeps each shared Skill discoverable under one owner', async () => {
  const [routing, manifestText] = await Promise.all([
    readFile(join(ROOT, '.agent-standard/core/decision-routing-and-ownership.md'), 'utf8'),
    readFile(join(ROOT, 'registry/standard.manifest.json'), 'utf8')
  ]);
  const entries = JSON.parse(manifestText).entries.filter(e => e.kind === 'skill');
  assert.equal(entries.length, 3);
  for (const entry of entries) {
    const name = entry.source.split('/')[2];
    const content = await readFile(join(ROOT, entry.source), 'utf8');
    assert.ok(routing.includes(String.fromCharCode(96) + name + String.fromCharCode(96)));
    assert.match(content, /^description: .*\b(?:not|skip)\b/im);
  }
  assert.match(routing, /\| bounded-change \|/);
  assert.match(routing, /\| domain-production \|/);
});

test('validator rejects a missing activation route owner', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-skill-route-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: file => !file.includes('node_modules') && !file.includes('.git') });
    const file = join(snapshot, '.agent-standard/core/decision-routing-and-ownership.md');
    const source = await readFile(file, 'utf8');
    assert.match(source, /\| repository-audit \|/);
    await writeFile(file, source.replace('| repository-audit |', '| invalid-audit-id |'));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /SKILL ROUTING: unknown\/duplicate route/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('validator rejects vague Skill discovery metadata', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-skill-discovery-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: file => !file.includes('node_modules') && !file.includes('.git') });
    const file = join(snapshot, 'skills/core/oits-repository-audit/SKILL.md');
    const source = await readFile(file, 'utf8');
    await writeFile(file, source.replace(/^description: .*$/m, 'description: Helpful assistance with repository and coding topics.'));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /SKILL ROUTING: description lacks concise positive\/negative/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('frozen Skill activation pilot reuses ten normative cases without host outcomes', async () => {
  const [pilotSource, casesSource, protocol] = await Promise.all([
    readFile(join(ROOT, 'evals/skill-activation-pilot.json'), 'utf8'),
    readFile(join(ROOT, 'evals/cases.json'), 'utf8'),
    readFile(join(ROOT, 'evals/skill-activation-pilot.md'), 'utf8')
  ]);
  const pilot = JSON.parse(pilotSource);
  const cases = new Set(JSON.parse(casesSource).cases.map(x => x.id));
  assert.equal(pilot.status, 'NORMATIVE_NOT_EXECUTED');
  assert.equal(pilot.cases.length, 10);
  assert.ok(pilot.cases.every(x => cases.has(x.id)));
  assert.ok(pilot.cases.some(x => x.group === 'required_core'));
  assert.ok(pilot.cases.some(x => x.group === 'no_shared_skill'));
  assert.match(protocol, /HOST_EVAL_NOT_EXECUTED/);
});

test('activation pilot validator rejects invented observed results', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-activation-pilot-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: path => !path.includes('node_modules') && !path.includes('.git') });
    const file = join(snapshot, 'evals/skill-activation-pilot.json');
    const data = JSON.parse(await readFile(file, 'utf8'));
    data.results = [{ caseId: 'GOV-211', outcome: 'PASS' }];
    await writeFile(file, JSON.stringify(data));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /ACTIVATION PILOT: unexecuted source must not include invented results/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('activation pilot validator rejects a changed expected Skill owner', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-activation-owner-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: path => !path.includes('node_modules') && !path.includes('.git') });
    const file = join(snapshot, 'evals/skill-activation-pilot.json');
    const data = JSON.parse(await readFile(file, 'utf8'));
    data.cases[0].expectedPrimary = 'oits-development-brief';
    await writeFile(file, JSON.stringify(data));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /ACTIVATION PILOT: wrong owner\/duplicate frozen case/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('goal completion and GitHub reliability remain owned by existing policy modules', async () => {
  const [root, sop, toolContract, evidence, continuity] = await Promise.all([
    readFile(join(ROOT, 'AGENTS.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/execution-sop.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/tool-contracts-and-reliability.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/evidence-and-recovery.md'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/context-and-session-continuity.md'), 'utf8')
  ]);
  assert.match(root, /Keep the user goal fixed/);
  assert.match(sop, /Goal lock, scope guard and terminal STOP/);
  assert.match(sop, /OPTIONAL_OR_UNRELATED/);
  assert.match(toolContract, /PARTIAL_SOURCE_CHANGE/);
  assert.match(toolContract, /UNKNOWN_OUTCOME/);
  assert.match(evidence, /Specification/);
  assert.match(evidence, /Standards/);
  assert.match(continuity, /Keep the primary goal across long prompting/);
});

test('static validator detects loss of terminal goal-stop guard', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-goal-stop-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: file => !file.includes('node_modules') && !file.includes('.git') });
    const file = join(snapshot, '.agent-standard/core/execution-sop.md');
    const current = await readFile(file, 'utf8');
    assert.match(current, /OPTIONAL_OR_UNRELATED/);
    await writeFile(file, current.replace('OPTIONAL_OR_UNRELATED', 'ALWAYS_CONTINUE_POLISH'));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /GOAL STOP: missing required\/blocked classification, optional prohibition or terminal decision/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('inverted optional-work directive is rejected despite preserved route labels', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-inverted-stop-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: file => !file.includes('node_modules') && !file.includes('.git') });
    const file = join(snapshot, '.agent-standard/core/execution-sop.md');
    const original = await readFile(file, 'utf8');
    assert.match(original, /Do not implement or automatically queue them/);
    await writeFile(file, original.replace('Do not implement or automatically queue them.', 'Implement or automatically queue them.'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /GOAL STOP: missing required\/blocked classification, optional prohibition or terminal decision/);
  } finally { await rm(parent, { recursive: true, force: true }); }
});

test('reversed unknown-GitHub-write recovery is rejected without deleting markers', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-inverted-recovery-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: file => !file.includes('node_modules') && !file.includes('.git') });
    const file = join(snapshot, '.agent-standard/core/tool-contracts-and-reliability.md');
    const original = await readFile(file, 'utf8');
    assert.match(original, /first inspect the actual remote branch\/commit\/file state/);
    await writeFile(file, original.replace('first inspect the actual remote branch/commit/file state', 'skip inspecting the actual remote branch/commit/file state'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /GITHUB RELIABILITY: partial\/unknown writes must require remote reconciliation/);
  } finally { await rm(parent, { recursive: true, force: true }); }
});

test('research readiness source guard rejects premature stopping after one convenient result', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-research-depth-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: file => !file.includes('node_modules') && !file.includes('.git') });
    const file = join(snapshot, '.agent-standard/core/execution-sop.md');
    const text = await readFile(file, 'utf8');
    const directive = '**Do not stop after the first convenient result.**';
    assert.ok(text.includes(directive));
    await writeFile(file, text.replace(directive, '**Stop after the first convenient result.**'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /RESEARCH READINESS: missing broad research or material-ambiguity guard/);
  } finally { await rm(parent, { recursive: true, force: true }); }
});

test('research readiness guard rejects premature implementation of an ambiguous design', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-readiness-guard-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: file => !file.includes('node_modules') && !file.includes('.git') });
    const file = join(snapshot, '.agent-standard/core/execution-sop.md');
    const text = await readFile(file, 'utf8');
    const directive = '**Do not implement a materially ambiguous design merely because sources were found.**';
    assert.ok(text.includes(directive));
    await writeFile(file, text.replace(directive, '**Implement a materially ambiguous design whenever sources are found.**'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /RESEARCH READINESS: missing broad research or material-ambiguity guard/);
  } finally { await rm(parent, { recursive: true, force: true }); }
});

test('offline package creates verifiable byte-identical bundle, and drift fails', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-agent-standard-'));
  const target = join(parent, 'bundle');
  try {
    const pack = run('package', target);
    assert.equal(pack.status, 0, pack.stderr);
    assert.match(pack.stdout, /NOT installed/);
    const good = run('verify', target);
    assert.equal(good.status, 0, good.stderr);
    assert.match(good.stdout, /PARITY PASS/);
    await appendFile(join(target, 'AGENTS.md'), '\nUNAUTHORIZED EDIT\n');
    const bad = run('verify', target);
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /PARITY DRIFT/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('alternate-host duplicate skill ID is rejected', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-agent-shadow-'));
  const target = join(parent, 'bundle');
  try {
    assert.equal(run('package', target).status, 0);
    const shadow = join(target, '.opencode/skills/oits-development-brief');
    await mkdir(shadow, { recursive: true });
    await writeFile(join(shadow, 'SKILL.md'), '---\nname: oits-development-brief\ndescription: override\n---\n');
    const bad = run('verify', target);
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /POTENTIAL SKILL SHADOW/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('packaging refuses existing paths and writes inside canonical repository', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-agent-safety-'));
  try {
    const existing = run('package', parent);
    assert.notEqual(existing.status, 0);
    assert.match(existing.stderr, /already exists/);
    const insideRepo = run('package', join(ROOT, 'unwanted-bundle'));
    assert.notEqual(insideRepo.status, 0);
    assert.match(insideRepo.stderr, /PACKAGE BLOCKED/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('an undeclared shared policy module fails inventory validation', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-inventory-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, {
      recursive: true,
      filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules')
    });
    await writeFile(join(snapshot, '.agent-standard/core/unregistered.md'), '# unregistered\n');
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /CORE INVENTORY/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('offline bundle staging refuses a parent symlink redirected to source', { skip: process.platform === 'win32' }, async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-redirect-'));
  try {
    await symlink(ROOT, join(parent, 'redirect'), 'dir');
    const bad = run('package', join(parent, 'redirect', 'new-output'));
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /PACKAGE BLOCKED/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('rejects unsafe two-surface policy profile even without executing a model', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-surface-policy-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, {
      recursive: true,
      filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules')
    });
    const file = join(snapshot, '.agent-standard/profile.json');
    const profile = JSON.parse(await (await import('node:fs/promises')).readFile(file, 'utf8'));
    profile.workflowPolicy.githubActionsOrCloudTestSubstitution = true;
    await writeFile(file, JSON.stringify(profile));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /two-surface safety policy cannot be relaxed/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('staging parity cannot masquerade as adopted host without a local profile', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-adoption-gate-'));
  const dest = join(parent, 'bundle');
  try {
    const p = run('package', dest);
    assert.equal(p.status, 0, p.stderr);
    const staged = run('verify', dest);
    assert.equal(staged.status, 0, staged.stderr);
    assert.match(staged.stdout, /STAGING ONLY; NOT ADOPTED/);
    const lockPath = join(dest, '.agent-standard/standard.lock.json');
    const lock = JSON.parse(await (await import('node:fs/promises')).readFile(lockPath, 'utf8'));
    lock.status = 'ADOPTED';
    lock.sourceCommit = 'a'.repeat(40);
    await writeFile(lockPath, JSON.stringify(lock));
    const invalid = run('verify', dest);
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /ADOPTION PROFILE REQUIRED/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('portable communication rule cannot disappear from the shared root', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-communication-policy-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, {
      recursive: true,
      filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules')
    });
    const rootFile = join(snapshot, 'AGENTS.md');
    const source = await (await import('node:fs/promises')).readFile(rootFile, 'utf8');
    await writeFile(rootFile, source.replace('## User-facing communication', '## Optional communication'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /MANDATORY COMMUNICATION POLICY/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('communication rubric must remain normative and measured claims cannot be predeclared', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-communication-eval-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, {
      recursive: true,
      filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules')
    });
    const rubricFile = join(snapshot, 'evals/communication-rubric.json');
    const rubric = JSON.parse(await (await import('node:fs/promises')).readFile(rubricFile, 'utf8'));
    rubric.status = 'MODEL_EVALUATION_PASSED';
    await writeFile(rubricFile, JSON.stringify(rubric));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /invalid communication rubric identity/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});


test('terminal reports distinguish STOP, CONTINUE, BLOCKED and PROPOSED', async () => {
  const [policy, examples, rubricText, corpusText, recovery] = await Promise.all([
    readFile(join(ROOT, '.agent-standard/core/user-facing-communication.md'), 'utf8'),
    readFile(join(ROOT, 'docs/examples/user-facing-answer-patterns.md'), 'utf8'),
    readFile(join(ROOT, 'evals/communication-rubric.json'), 'utf8'),
    readFile(join(ROOT, 'evals/cases.json'), 'utf8'),
    readFile(join(ROOT, '.agent-standard/core/commit-continuity-and-recovery.md'), 'utf8')
  ]);
  assert.match(policy, /Never label a report STOP while assigning an actionable Next step/);
  assert.match(examples, /Next step — PROPOSED/);
  assert.match(examples, /Next step — BLOCKED/);
  assert.match(recovery, /Skip history loading when current status/);
  const rubric = JSON.parse(rubricText);
  assert.match(rubric.dimensions.find(x => x.id === 'next_step_integrity').evidence, /PROPOSED/);
  const ids = new Set(JSON.parse(corpusText).cases.map(x => x.id));
  for (const id of ['GOV-276','GOV-277','GOV-278','GOV-279','GOV-280','GOV-281']) assert.ok(ids.has(id));
});

test('terminal STOP source guard rejects actionable follow-up despite retained labels', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-report-stop-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const file = join(snapshot, '.agent-standard/core/user-facing-communication.md');
    const original = await readFile(file, 'utf8');
    const directive = '**Never label a report STOP while assigning an actionable Next step.**';
    assert.ok(original.includes(directive));
    await writeFile(file, original.replace(directive, '**Label a report STOP while assigning an actionable Next step.**'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /COMMUNICATION STATUS: STOP with actionable follow-up/);
  } finally { await rm(parent, { recursive: true, force: true }); }
});

test('conditional history source guard rejects unconditional 30-commit scan', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-history-conditional-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const file = join(snapshot, '.agent-standard/core/commit-continuity-and-recovery.md');
    const original = await readFile(file, 'utf8');
    const directive = '**Skip history loading when current status, source and decisions already resolve the requested task.**';
    assert.ok(original.includes(directive));
    await writeFile(file, original.replace(directive, '**Always load 30 commits even when current source resolves the requested task.**'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /CONTEXT RECOVERY: history loading must be conditional/);
  } finally { await rm(parent, { recursive: true, force: true }); }
});

test('communication update has explicit next-step evidence and preserves simple answers', async () => {
  const [policy, examples, rubricText] = await Promise.all([
    readFile(join(ROOT, '.agent-standard/core/user-facing-communication.md'), 'utf8'),
    readFile(join(ROOT, 'docs/examples/user-facing-answer-patterns.md'), 'utf8'),
    readFile(join(ROOT, 'evals/communication-rubric.json'), 'utf8')
  ]);
  const rubric = JSON.parse(rubricText);
  assert.match(policy, /subject–verb–object/);
  assert.match(policy, /Do not invent a next action/);
  assert.match(examples, /\*\*Current status — Routing updated\*\*/);
  assert.match(examples, /\*\*Explanation — Scope and evidence\*\*/);
  assert.match(examples, /\*\*Next step — STOP\*\*/);
  assert.match(examples, /\*\*Next step — CONTINUE\*\*/);
  assert.match(examples, /Simple factual answer — no template/);
  assert.ok(rubric.dimensions.some(x => x.id === 'next_step_integrity' && x.type === 'hard_gate'));
});

test('communication validator rejects an invented next-step directive', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-next-step-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const file = join(snapshot, '.agent-standard/core/user-facing-communication.md');
    const source = await readFile(file, 'utf8');
    assert.match(source, /\*\*Do not invent a next action\.\*\*/);
    await writeFile(file, source.replace('**Do not invent a next action.**', '**Invent a next action.**'));
    const result = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /COMMUNICATION FORMAT: three-zone separation or next-step integrity missing/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('three-zone communication rejects moving CONTINUE or STOP below its heading', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-heading-status-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const file = join(snapshot, '.agent-standard/core/user-facing-communication.md');
    const policy = await readFile(file, 'utf8');
    const directive = '**Keep each heading and its summary/status on the same line; never put STOP/CONTINUE/BLOCKED/PROPOSED on the line below.**';
    assert.ok(policy.includes(directive));
    await writeFile(file, policy.replace(directive, '**Put CONTINUE/STOP on a new line below each heading.**'));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /COMMUNICATION FORMAT: three-zone separation or next-step integrity missing/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('three-zone communication rejects loss of the final action divider', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-three-zone-separation-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const file = join(snapshot, '.agent-standard/core/user-facing-communication.md');
    const policy = await readFile(file, 'utf8');
    const directive = '**Use a single horizontal divider immediately before the final Next step**';
    assert.ok(policy.includes(directive));
    await writeFile(file, policy.replace(directive, '**Put the final Next step inside the Explanation without separation**'));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /COMMUNICATION FORMAT: three-zone separation or next-step integrity missing/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('visual-first communication preserves chart evidence and no-visual abstention', async () => {
  const [policy, examples, rubricText] = await Promise.all([
    readFile(join(ROOT, '.agent-standard/core/user-facing-communication.md'), 'utf8'),
    readFile(join(ROOT, 'docs/examples/user-facing-answer-patterns.md'), 'utf8'),
    readFile(join(ROOT, 'evals/communication-rubric.json'), 'utf8')
  ]);
  assert.match(policy, /Visual-first selection — match the information structure/);
  assert.match(policy, /Do not invent numbers simply to produce a graph/);
  assert.match(policy, /correct visual choice may be \*\*none\*\*/);
  assert.match(examples, /Visual-first examples — one view per information task/);
  const rubric = JSON.parse(rubricText);
  assert.equal(rubric.status, 'NORMATIVE_NOT_MEASURED');
  assert.ok(rubric.dimensions.some(d => d.id === 'visual_scanability' && d.type === 'quality'));
});

test('visual guidance validator rejects fabricated-chart permission with heading intact', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-visual-guidance-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, { recursive: true, filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules') });
    const path = join(snapshot, '.agent-standard/core/user-facing-communication.md');
    const policy = await readFile(path, 'utf8');
    const directive = 'Do not invent numbers simply to produce a graph';
    assert.ok(policy.includes(directive));
    await writeFile(path, policy.replace(directive, 'Invent numbers simply to produce a graph'));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /COMMUNICATION VISUAL: missing appropriate-format, data-integrity or readability guidance/);
  } finally { await rm(parent, { recursive: true, force: true }); }
});

test('method registry remains pinned and preserves one Karpathy/Ponytail default pass', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-method-gate-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, {
      recursive: true,
      filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules')
    });
    const file = join(snapshot, 'registry/methods.json');
    const methods = JSON.parse(await (await import('node:fs/promises')).readFile(file, 'utf8'));
    methods.defaultEngineeringPass = ['ponytail','karpathy-guidelines'];
    await writeFile(file, JSON.stringify(methods));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /METHOD REGISTRY: default Karpathy\/Ponytail pass/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('method registry rejects missing activation and negative trigger', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-method-negative-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, {
      recursive: true,
      filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules')
    });
    const file = join(snapshot, 'registry/methods.json');
    const methods = JSON.parse(await (await import('node:fs/promises')).readFile(file, 'utf8'));
    methods.methods[2].negativeTriggers = [];
    await writeFile(file, JSON.stringify(methods));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /METHOD REGISTRY: missing operational negativeTriggers/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('method references must pin actual eval IDs and may not permit unreviewed copying', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-method-provenance-'));
  const snapshot = join(parent, 'snapshot');
  try {
    await cp(ROOT, snapshot, {
      recursive: true,
      filter: src => !src.split(/[\\/]/).some(part => part === '.git' || part === 'node_modules')
    });
    const file = join(snapshot, 'registry/methods.json');
    const methods = JSON.parse(await (await import('node:fs/promises')).readFile(file, 'utf8'));
    methods.methods[7].provenance.copyPolicy = 'COPY_WITHOUT_REVIEW';
    await writeFile(file, JSON.stringify(methods));
    const bad = spawnSync(process.execPath, [join(snapshot, 'tools/standard.mjs'), 'validate'], { encoding: 'utf8' });
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /external code\/prompt copying not authorized/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('offline staging bundle method catalog is checked byte-for-byte', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-method-parity-'));
  const target = join(parent, 'bundle');
  try {
    const pack = run('package', target);
    assert.equal(pack.status, 0, pack.stderr);
    assert.equal(run('verify', target).status, 0);
    await appendFile(join(target, '.agent-standard/methods.json'), '\nUNAUTHORIZED CHANGE\n');
    const bad = run('verify', target);
    assert.notEqual(bad.status, 0);
    assert.match(bad.stderr, /PARITY DRIFT: .agent-standard\/methods.json/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});


test('material commit body validates in the offline syntax checker', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-commit-valid-'));
  try {
    const target = join(parent, 'message.txt');
    const message = [
      'fix(texture): cover previously missed Cube orientations',
      '',
      'Surface: CHATGPT_GITHUB',
      'Goal: Detect missed faces without increasing the texture pixel budget.',
      'Work: texture-face-scan — add sampling and one regression fixture.',
      'State: ACTIVE; SOURCE_INTEGRATION.',
      'Proof: SOURCE_REVIEWED; TEST_AUTHORED_NOT_RUN; NOT_EXECUTED.',
      'Decision: Preserve the existing cache and UV contracts.',
      'Unresolved: Native acceptance still requires an authorized PC-local phase.',
      'Next: Inspect current texture consumers before source-ready handoff.'
    ].join('\n');
    await writeFile(target, message);
    const run = spawnSync(process.execPath, [join(ROOT, 'tools/commit-message-check.mjs'), target], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    assert.match(run.stdout, /COMMIT FORMAT PASS/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('material Git commit rejects missing Next and fake success status', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-commit-invalid-'));
  try {
    const target = join(parent, 'message.txt');
    await writeFile(target, [
      'fix(texture): cover previously missed Cube orientations',
      '',
      'Surface: CHATGPT_GITHUB',
      'Goal: Detect missed faces without increasing the texture budget.',
      'Work: texture-face-scan — add bounded diagnostics.',
      'State: PASS.',
      'Proof: Everything is verified.',
      'Decision: Preserve existing contracts.',
      'Unresolved: None.'
    ].join('\n'));
    const run = spawnSync(process.execPath, [join(ROOT, 'tools/commit-message-check.mjs'), target], { encoding: 'utf8' });
    assert.notEqual(run.status, 0);
    assert.match(run.stderr, /Missing continuity field: Next/);
    assert.match(run.stderr, /State must start with/);
    assert.match(run.stderr, /Proof must name/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('new material commits require Surface, while explicit historical parsing preserves missing identity', () => {
  const msg=[
    'fix(context): identify the source execution method','',
    'Surface: CHATGPT_GITHUB',
    'Goal: Preserve the execution method for future GitHub source recovery.',
    'Work: commit-surface-identity — record the real working surface.',
    'State: DONE; SOURCE_INTEGRATION.',
    'Proof: SOURCE_REVIEWED; NOT_EXECUTED.',
    'Next: STOP'
  ].join('\n');
  assert.deepEqual(assessCommitMessage(msg).errors, []);
  assert.equal(assessCommitMessage(msg).surfaceStatus, 'DECLARED_UNVERIFIED');
  const legacy=msg.replace('Surface: CHATGPT_GITHUB\n','');
  assert.match(assessCommitMessage(legacy).errors.join(' '), /Missing continuity field: Surface/);
  assert.deepEqual(assessCommitMessage(legacy,{allowLegacySurface:true}).errors, []);
  assert.equal(assessCommitMessage(legacy,{allowLegacySurface:true}).surfaceStatus,'UNRECORDED');
});

test('Surface restricts host IDs without treating a model label as host proof', () => {
  const source=[
    'fix(context): identify a verified PC-local agent','',
    'Surface: LOCAL_PC_AGENT; Host=CODEX_CLI',
    'Goal: Record the actual local agent application used for source work.',
    'Work: commit-surface-identity — identify a bounded local session.',
    'State: DONE; SOURCE_INTEGRATION.',
    'Proof: SOURCE_REVIEWED; NOT_EXECUTED.',
    'Next: STOP'
  ].join('\n');
  for(const host of ['CODEX_CLI','CLAUDE_CODE','OPENCODE']) {
    assert.deepEqual(assessCommitMessage(source.replace('CODEX_CLI',host)).errors, []);
  }
  for(const bad of ['LOCAL_PC_AGENT','LOCAL_PC_AGENT; Host=CHATGPT','CHATGPT_GITHUB; Host=CODEX_CLI','LOCAL_PC_AGENT; Model=GPT','HOSTED_CLOUD']) {
    assert.match(assessCommitMessage(source.replace('LOCAL_PC_AGENT; Host=CODEX_CLI',bad)).errors.join(' '),/Surface must be CHATGPT_GITHUB/);
  }
  assert.equal(assessCommitMessage(source).surfaceStatus,'DECLARED_UNVERIFIED');
});

test('v2 trivial requires an actual narrow documentation diff, not merely --trivial', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-commit-trivial-v2-'));
  try {
    const message = join(parent,'message.txt'), patch = join(parent,'typo.diff');
    await writeFile(message,'docs(readme): correct a misspelled heading');
    await writeFile(patch, [
      'diff --git a/README.md b/README.md',
      'index 1234567..abcdef0 100644',
      '--- a/README.md',
      '+++ b/README.md',
      '@@ -1 +1 @@',
      '-# Headng',
      '+# Heading'
    ].join('\n'));
    const missing = spawnSync(process.execPath,[join(ROOT,'tools/commit-message-check.mjs'),message,'--trivial'],{encoding:'utf8'});
    assert.notEqual(missing.status,0);
    assert.match(missing.stderr,/TRIVIAL REQUIRES DIFF/);
    const candidate = spawnSync(process.execPath,[join(ROOT,'tools/commit-message-check.mjs'),message,'--trivial','--diff',patch],{encoding:'utf8'});
    assert.equal(candidate.status,0,candidate.stderr);
    assert.match(candidate.stdout,/PATCH_STRUCTURE_ONLY/);
  } finally {
    await rm(parent,{recursive:true,force:true});
  }
});

test('repeat co-author trailers do not replace required continuity fields', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-commit-authors-'));
  try {
    const target = join(parent, 'message.txt');
    await writeFile(target, [
      'docs(policy): explain safe commit continuity',
      '',
      'Surface: CHATGPT_GITHUB',
      'Goal: Make the next ChatGPT session recover the intended task.',
      'Work: git-continuity — improve commit metadata and context recovery.',
      'State: DONE; SOURCE_INTEGRATION.',
      'Proof: SOURCE_REVIEWED; NOT_EXECUTED.',
      'Decision: Reuse Git history rather than adding a status database.',
      'Unresolved: None for the scope of this documentation change.',
      'Next: STOP',
      'Co-authored-by: Example One <one@example.invalid>',
      'Co-authored-by: Example Two <two@example.invalid>'
    ].join('\n'));
    const result = spawnSync(process.execPath, [join(ROOT, 'tools/commit-message-check.mjs'), target], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});


test('NORMAL accepts Surface plus five fields without pretending diff was checked', async () => {
  const parent=await mkdtemp(join(tmpdir(),'oits-normal-v2-'));
  try {
    const message=join(parent,'msg.txt');
    await writeFile(message,[
      'fix(texture): cover six Cube face orientations','',
      'Surface: CHATGPT_GITHUB',
      'Goal: Find missing faces using existing sampling limits.',
      'Work: texture-face-scan — improve source sampling.',
      'State: ACTIVE; SOURCE_INTEGRATION.',
      'Proof: SOURCE_REVIEWED; TEST_AUTHORED_NOT_RUN.',
      'Next: Inspect current texture callers.'
    ].join('\n'));
    const check=spawnSync(process.execPath,[join(ROOT,'tools/commit-message-check.mjs'),message,'--tier','normal'],{encoding:'utf8'});
    assert.equal(check.status,0,check.stderr);
    assert.match(check.stdout,/DIFF_NOT_REVIEWED/);
  } finally {await rm(parent,{recursive:true,force:true});}
});

test('v2 CRITICAL requires Decision and Unresolved', async () => {
  const parent=await mkdtemp(join(tmpdir(),'oits-critical-v2-'));
  try {
    const message=join(parent,'msg.txt');
    const core=[
      'feat(agent): restrict repository permissions','',
      'Surface: CHATGPT_GITHUB',
      'Goal: Keep all changes within the selected branch.',
      'Work: permission-routing — tighten action gates.',
      'State: ACTIVE; SOURCE_INTEGRATION.',
      'Proof: SOURCE_REVIEWED; LOCAL_TEST_DEFERRED.',
      'Next: Inspect current host rules.'
    ];
    await writeFile(message,core.join('\n'));
    const fail=spawnSync(process.execPath,[join(ROOT,'tools/commit-message-check.mjs'),message,'--tier','critical'],{encoding:'utf8'});
    assert.notEqual(fail.status,0);
    assert.match(fail.stderr,/Missing continuity field: Decision/);
    assert.match(fail.stderr,/Missing continuity field: Unresolved/);
    const full=[...core.slice(0,-1),
      'Decision: Preserve existing user approval and hold rules.',
      'Unresolved: Actual local host behavior is unverified.',
      core.at(-1)];
    await writeFile(message,full.join('\n'));
    const good=spawnSync(process.execPath,[join(ROOT,'tools/commit-message-check.mjs'),message,'--tier','critical'],{encoding:'utf8'});
    assert.equal(good.status,0,good.stderr);
  } finally {await rm(parent,{recursive:true,force:true});}
});

test('v2 source-risk diff prevents normal tier for protected policy paths', async () => {
  const parent=await mkdtemp(join(tmpdir(),'oits-risk-v2-'));
  try {
    const message=join(parent,'msg.txt'),patch=join(parent,'patch.diff');
    await writeFile(message,[
      'feat(agent): restrict repository permissions','',
      'Surface: CHATGPT_GITHUB',
      'Goal: Keep changes on the selected user branch.',
      'Work: permission-routing — tighten action gates.',
      'State: ACTIVE; SOURCE_INTEGRATION.',
      'Proof: SOURCE_REVIEWED; LOCAL_TEST_DEFERRED.',
      'Next: Inspect current host source.'
    ].join('\n'));
    await writeFile(patch,[
      'diff --git a/AGENTS.md b/AGENTS.md',
      'index 1111111..2222222 100644',
      '--- a/AGENTS.md','+++ b/AGENTS.md','@@ -1 +1 @@',
      '-old policy','+new policy'
    ].join('\n'));
    const bad=spawnSync(process.execPath,[join(ROOT,'tools/commit-message-check.mjs'),message,'--tier','normal','--diff',patch],{encoding:'utf8'});
    assert.notEqual(bad.status,0);
    assert.match(bad.stderr,/DIFF RISK/);
  } finally {await rm(parent,{recursive:true,force:true});}
});

test('v2 trivial blocks code source, multi-line changes and policy wording', async () => {
  const parent=await mkdtemp(join(tmpdir(),'oits-trivial-risk-v2-'));
  try {
    const msg=join(parent,'message.txt'),patch=join(parent,'patch.diff');
    await writeFile(msg,'docs(readme): correct misspelled heading');
    const variants=[
      ['src/parser.ts','-# Headng','+# Heading'],
      ['README.md','-# Permisions','+# Permissions'],
      ['README.md','-# Headng\n-# Nmae','+# Heading\n+# Name']
    ];
    for(const [path,removed,added] of variants) {
      const p=[
        'diff --git a/'+path+' b/'+path,'index 1111111..2222222 100644',
        '--- a/'+path,'+++ b/'+path,'@@ -1 +1 @@',removed,added
      ].join('\n');
      await writeFile(patch,p);
      const result=spawnSync(process.execPath,[join(ROOT,'tools/commit-message-check.mjs'),msg,'--trivial','--diff',patch],{encoding:'utf8'});
      assert.notEqual(result.status,0,path+' incorrectly accepted');
    }
  } finally {await rm(parent,{recursive:true,force:true});}
});


test('v2 rejects an empty diff header rather than treating it as verified scope', async () => {
  const parent=await mkdtemp(join(tmpdir(),'oits-empty-patch-v2-'));
  try {
    const msg=join(parent,'msg.txt'),patch=join(parent,'empty.diff');
    await writeFile(msg,[
      'fix(texture): preserve source behavior','',
      'Surface: CHATGPT_GITHUB',
      'Goal: Keep material source changes traceable.',
      'Work: texture-face-scan — record a narrow source change.',
      'State: ACTIVE; SOURCE_INTEGRATION.',
      'Proof: SOURCE_REVIEWED; NOT_EXECUTED.',
      'Next: Check current owner and report limitations.'
    ].join('\n'));
    await writeFile(patch,'diff --git a/src/example.ts b/src/example.ts\n');
    const result=spawnSync(process.execPath,[join(ROOT,'tools/commit-message-check.mjs'),msg,'--tier','normal','--diff',patch],{encoding:'utf8'});
    assert.notEqual(result.status,0);
    assert.match(result.stderr,/Diff is not usable/);
  } finally {await rm(parent,{recursive:true,force:true});}
});
