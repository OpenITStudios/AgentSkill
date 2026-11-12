import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, appendFile, mkdir, writeFile, rm, cp, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(ROOT, 'tools', 'standard.mjs');
function run(...args) {
  return spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
}

test('canonical source, skill metadata and 128 normative cases validate', () => {
  const r = run('validate');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /VALIDATE PASS/);
  assert.match(r.stdout, /128 normative cases/);
  assert.match(r.stdout, /NO MODEL TESTS RUN/);
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

test('trivial typo commit can omit material body only by explicit option', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'oits-commit-trivial-'));
  try {
    const target = join(parent, 'message.txt');
    await writeFile(target, 'docs(readme): correct a misspelled heading');
    const normal = spawnSync(process.execPath, [join(ROOT, 'tools/commit-message-check.mjs'), target], { encoding: 'utf8' });
    assert.notEqual(normal.status, 0);
    const trivial = spawnSync(process.execPath, [join(ROOT, 'tools/commit-message-check.mjs'), target, '--trivial'], { encoding: 'utf8' });
    assert.equal(trivial.status, 0, trivial.stderr);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});
