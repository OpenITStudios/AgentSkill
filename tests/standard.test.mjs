import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, appendFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(ROOT, 'tools', 'standard.mjs');
function run(...args) {
  return spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
}

test('canonical source, skill metadata and 28 normative cases validate', () => {
  const r = run('validate');
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /VALIDATE PASS/);
  assert.match(r.stdout, /28 normative cases/);
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
