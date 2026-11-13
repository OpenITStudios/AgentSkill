import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, appendFile, mkdir, writeFile, readFile, rm, cp, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(ROOT, 'tools', 'standard.mjs');
function run(...args) {
  return spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
}

test('canonical source, skill metadata and 220 normative cases validate', () => {
  const r = run('validate');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /VALIDATE PASS/);
  assert.match(r.stdout, /220 normative cases/);
  assert.match(r.stdout, /NO MODEL TESTS RUN/);
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
  assert.match(skillPolicy, /not remove, rename, disable, replace or silently shadow/i);
  const methods = JSON.parse(registryText);
  const manifest = JSON.parse(manifestText);
  assert.deepEqual(methods.methods.map(x => x.id), ['karpathy-guidelines', 'ponytail', 'pstack-poteto', 'harness2', 'deepseek-harness', 'rea', 'ui-ux-pro-max', 'matt-pocock']);
  assert.equal(manifest.entries.filter(x => x.kind === 'skill').length, 3);
  assert.equal(manifest.version, '0.1.0-draft');
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


test('v2 NORMAL accepts five fields without pretending diff was checked', async () => {
  const parent=await mkdtemp(join(tmpdir(),'oits-normal-v2-'));
  try {
    const message=join(parent,'msg.txt');
    await writeFile(message,[
      'fix(texture): cover six Cube face orientations','',
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
