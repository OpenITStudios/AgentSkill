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
const ALLOWED_KINDS = new Set(['root', 'core', 'skill']);
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
    ensure(index.includes(file.split('/').at(-1)), 'CORE INDEX: missing module entry ' + file);
  }
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
    } else {
      ensure(['AGENTS.md','GITHUB_RULES.md'].includes(source) && target === source, 'invalid root policy target');
    }
  }
  ensure(dstSeen.has('AGENTS.md') && dstSeen.has('GITHUB_RULES.md'), 'missing portable root rules');
  ensure(skillCount >= 3, 'minimum core skills missing');
  await ensureCompletePortableInventory(manifest);

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
  process.stdout.write('PARITY PASS: ' + expectedNames.length + ' canonical files match SHA-256. SOURCE ONLY; not behavioral/native proof.\n');
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
