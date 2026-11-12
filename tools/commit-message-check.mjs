#!/usr/bin/env node
/**
 * OpenITStudios commit-body lint. LOCAL/SOURCE tooling only.
 * Reads a supplied UTF-8 message file; never touches Git, network, CI or user PC remotely.
 * Structural checks are NOT a proof that changes/tests actually succeeded.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const CONTINUITY_FIELDS = Object.freeze([
  'Goal','Work','State','Proof','Decision','Unresolved','Next'
]);
const OPTIONAL = new Set(['Refs','Co-authored-by','Signed-off-by']);
const SUBJECT = /^(feat|fix|docs|refactor|test|chore|perf|build|security|ci|release|revert)\(([a-z][a-z0-9._-]*)\): (\S.{2,})$/;
const STATES = /^(ACTIVE|BLOCKED|PAUSED|DONE)(?:[;\s].*)?$/;
const PROOF = /\b(SOURCE_REVIEWED|SOURCE_COMMITTED|TEST_AUTHORED_NOT_RUN|EXECUTED_TEST_PASS|EXECUTED_TEST_FAIL|LIVE_TARGET_VERIFIED|NOT_EXECUTED|LOCAL_TEST_DEFERRED|UNKNOWN)\b/;

export function lintCommitMessage(rawMessage, options = {}) {
  const errors = [];
  const trivial = options.trivial === true;
  if (typeof rawMessage !== 'string' || !rawMessage.trim()) return ['Commit message is empty'];
  const lines = rawMessage.replace(/\r\n/g, '\n').trimEnd().split('\n');
  const subject = lines[0].trim();
  if (!SUBJECT.test(subject)) {
    errors.push('Subject must be: type(scope): concrete outcome');
  }
  if (subject.length > 100) errors.push('Subject is too long; make the outcome clearer');
  if (lines.length === 1) {
    if (!trivial) errors.push('Material commit missing seven continuity fields');
    return errors;
  }
  if (lines[1] !== '') errors.push('Separate subject and body with one blank line');
  const found = new Map();
  let lastField = null;
  let lastFieldIndex = -1;
  let afterOptional = false;
  for (const line of lines.slice(2)) {
    if (!line.trim()) continue;
    const match = /^([A-Za-z][A-Za-z-]*):[ \t]*(.*)$/.exec(line);
    if (match) {
      const field = match[1], value = match[2].trim();
      if (!CONTINUITY_FIELDS.includes(field) && !OPTIONAL.has(field)) {
        errors.push('Unexpected commit field: ' + field);
        continue;
      }
      if (found.has(field)) { errors.push('Duplicate commit field: ' + field); continue; }
      if (!value) errors.push('Commit field is empty: ' + field);
      const index = CONTINUITY_FIELDS.indexOf(field);
      if (index >= 0) {
        if (afterOptional || index < lastFieldIndex) errors.push('Fields are out of order: ' + field);
        lastFieldIndex = index;
      } else {
        afterOptional = true;
      }
      found.set(field, value);
      lastField = field;
    } else if (/^[ \t]{2,}\S/.test(line) && lastField !== null) {
      found.set(lastField, found.get(lastField) + ' ' + line.trim());
    } else {
      errors.push('Unlabeled commit-body text; use named fields');
    }
  }
  for (const field of CONTINUITY_FIELDS) {
    if (!found.has(field)) errors.push('Missing continuity field: ' + field);
  }
  if (found.has('Goal') && found.get('Goal').length < 10) errors.push('Goal is not meaningful');
  if (found.has('Work')) {
    const work = found.get('Work');
    if (!/^[a-z][a-z0-9._-]{2,}[ \t]*(?:—|--|\|)[ \t]+\S/.test(work)) {
      errors.push('Work must begin with a stable topic slug and separator');
    }
  }
  if (found.has('State') && !STATES.test(found.get('State'))) {
    errors.push('State must start with ACTIVE, BLOCKED, PAUSED or DONE');
  }
  if (found.has('Proof') && !PROOF.test(found.get('Proof'))) {
    errors.push('Proof must name the actual source/executed/unexecuted evidence tier');
  }
  if (found.has('Next') && found.get('Next').length < 4) errors.push('Next must be one safe step or STOP');
  return errors;
}

async function main() {
  const file = process.argv[2];
  if (!file || file === '--help') {
    process.stdout.write('Usage: node tools/commit-message-check.mjs MESSAGE.txt [--trivial]\n');
    return;
  }
  const text = await readFile(resolve(file), 'utf8');
  const errors = lintCommitMessage(text, { trivial: process.argv.includes('--trivial') });
  if (errors.length) {
    process.stderr.write('COMMIT FORMAT FAIL:\n- ' + errors.join('\n- ') + '\n');
    process.exitCode = 1;
  } else {
    process.stdout.write('COMMIT FORMAT PASS: structure only; permissions and proof not validated.\n');
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(e => {
    process.stderr.write('COMMIT FORMAT FAIL: ' + e.message + '\n');
    process.exitCode = 1;
  });
}
