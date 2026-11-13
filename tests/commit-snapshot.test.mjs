import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewGitHubCommitSnapshot } from '../tools/commit-snapshot-check.mjs';
import { hasRiskyChangedFiles } from '../tools/commit-message-check.mjs';

const HEAD='a'.repeat(40);
const PREVIOUS='b'.repeat(40);
const normalMessage=[
  'fix(texture): balance bounded Cube face scan','',
  'Goal: Detect missed faces without increasing the sampling budget.',
  'Work: texture-face-scan — improve six-direction sampling.',
  'State: ACTIVE; SOURCE_INTEGRATION.',
  'Proof: SOURCE_REVIEWED; TEST_AUTHORED_NOT_RUN.',
  'Next: Review current source callers.'
].join('\n');
const criticalMessage=[
  'feat(agent): preserve source mutation permissions','',
  'Goal: Keep source operations within user-authorized repository scope.',
  'Work: permission-routing — preserve explicit branch and test holds.',
  'State: ACTIVE; SOURCE_INTEGRATION.',
  'Proof: SOURCE_REVIEWED; LOCAL_TEST_DEFERRED.',
  'Decision: Preserve explicit user approval and current project holds.',
  'Unresolved: Actual host loading and runtime behavior are not measured.',
  'Next: Inspect matching host adapter sources.'
].join('\n');
function record(message=normalMessage, files=[
  {filename:'src/texture/scan.ts',status:'modified',patch:'@@ -1 +1 @@\n-old\n+new'}
]) {
  return {
    schemaVersion:1,
    repository:'OpenITStudios/Example',
    selectedBranch:'Local',
    expectedHead:HEAD,
    expectedPreviousHead:PREVIOUS,
    branchResponse:{name:'Local',commit:{sha:HEAD}},
    commitResponse:{
      sha:HEAD,
      html_url:'https://github.com/OpenITStudios/Example/commit/'+HEAD,
      parents:[{sha:PREVIOUS}],
      commit:{message},
      files
    }
  };
}
test('consistent GitHub-like metadata remains explicitly unauthenticated and runtime untested',()=>{
  const actual=reviewGitHubCommitSnapshot(record());
  assert.equal(actual.state,'SNAPSHOT_CONSISTENT');
  assert.equal(actual.tier,'normal');
  assert.equal(actual.changedFileCount,1);
  assert.match(actual.origin,/NOT_AUTHENTICATED/);
  assert.match(actual.proof,/NOT_RUNTIME/);
  assert.equal(actual.surface,null);
  assert.equal(actual.surfaceStatus,'UNRECORDED');
  assert.ok(actual.warnings.includes('SURFACE_UNRECORDED_LEGACY'));
});
test('snapshot records declared host identity but cannot authenticate actual PC execution',()=>{
  const declared=criticalMessage.replace('Goal:','Surface: LOCAL_PC_AGENT; Host=CODEX_CLI\nGoal:');
  const files=[{filename:'AGENTS.md',status:'modified',patch:'@@ -1 +1 @@\n-old\n+new'}];
  const actual=reviewGitHubCommitSnapshot(record(declared,files));
  assert.equal(actual.state,'SNAPSHOT_CONSISTENT');
  assert.equal(actual.surface,'LOCAL_PC_AGENT; Host=CODEX_CLI');
  assert.equal(actual.surfaceStatus,'DECLARED_UNVERIFIED');
  assert.match(actual.origin,/NOT_AUTHENTICATED/);
  const wrong=declared.replace('Host=CODEX_CLI','Host=CHATGPT');
  const rejected=reviewGitHubCommitSnapshot(record(wrong,files));
  assert.equal(rejected.state,'REJECTED');
  assert.match(rejected.errors.join(' '),/Surface must be CHATGPT_GITHUB/);
});

test('incorrect branch, commit or parent cannot inherit HEAD proof',()=>{
  const mismatch=record();
  mismatch.branchResponse.name='main';
  assert.equal(reviewGitHubCommitSnapshot(mismatch).state,'REJECTED');
  const wrongHead=record();
  wrongHead.commitResponse.sha='c'.repeat(40);
  assert.match(reviewGitHubCommitSnapshot(wrongHead).errors.join(' '),/STALE_OR_WRONG_BRANCH_HEAD/);
  const wrongParent=record();
  wrongParent.commitResponse.parents=[{sha:'d'.repeat(40)}];
  assert.match(reviewGitHubCommitSnapshot(wrongParent).errors.join(' '),/EXPECTED_PARENT_MISMATCH/);
});
test('parent not supplied is incomplete, never silently verified',()=>{
  const s=record();
  delete s.expectedPreviousHead;
  const actual=reviewGitHubCommitSnapshot(s);
  assert.equal(actual.state,'INCOMPLETE');
  assert.ok(actual.warnings.includes('EXPECTED_PARENT_NOT_SUPPLIED'));
});
test('normal commit on protected AGENTS requires critical decision and unresolved fields',()=>{
  const files=[{filename:'AGENTS.md',status:'modified',patch:'@@ -1 +1 @@\n-old\n+new'}];
  const bad=reviewGitHubCommitSnapshot(record(normalMessage,files));
  assert.equal(bad.state,'REJECTED');
  assert.match(bad.errors.join(' '),/Missing continuity field: Decision/);
  const good=reviewGitHubCommitSnapshot(record(criticalMessage,files));
  assert.equal(good.state,'SNAPSHOT_CONSISTENT');
  assert.equal(good.tier,'critical');
});
test('subject-only typo requires actual patch in commit metadata',()=>{
  const msg='docs(readme): correct misspelled heading';
  const file={filename:'README.md',status:'modified',patch:'@@ -1 +1 @@\n-# Headng\n+# Heading'};
  const good=reviewGitHubCommitSnapshot(record(msg,[file]));
  assert.equal(good.state,'SNAPSHOT_CONSISTENT');
  assert.equal(good.tier,'trivial');
  const missing=reviewGitHubCommitSnapshot(record(msg,[{filename:'README.md',status:'modified'}]));
  assert.equal(missing.state,'REJECTED');
  assert.match(missing.errors.join(' '),/TRIVIAL REQUIRES DIFF/);
});
test('300 file boundary must remain incomplete pending pagination',()=>{
  const files=Array.from({length:300},(_,i)=>({
    filename:'src/part-'+i+'.ts',status:'modified',patch:'@@ -1 +1 @@\n-a\n+b'
  }));
  const actual=reviewGitHubCommitSnapshot(record(criticalMessage,files));
  assert.equal(actual.state,'INCOMPLETE');
  assert.ok(actual.warnings.includes('FILE_LIST_MAY_BE_PAGINATED'));
});
test('renames with missing previous path require reconciliation',()=>{
  const files=[{filename:'src/renamed.ts',status:'renamed',patch:'@@ -1 +1 @@\n-a\n+b'}];
  const actual=reviewGitHubCommitSnapshot(record(criticalMessage,files));
  assert.equal(actual.state,'INCOMPLETE');
  assert.ok(actual.warnings.includes('RENAME_PREVIOUS_PATH_UNRESOLVED'));
});
test('new ordinary file is not automatically a high-risk architecture commit',()=>{
  assert.equal(hasRiskyChangedFiles([{path:'src/feature.ts',status:'added'}]),false);
  assert.equal(hasRiskyChangedFiles([{path:'.agent-standard/core/policy.md',status:'added'}]),true);
  assert.equal(hasRiskyChangedFiles([{path:'src/feature.ts',status:'renamed'}]),true);
  assert.equal(hasRiskyChangedFiles([]),true);
});

test('a changed file without a readable patch has incomplete evidence',()=>{
  const missingPatch=record(criticalMessage,[{filename:'assets/model.bbmodel',status:'modified'}]);
  const observed=reviewGitHubCommitSnapshot(missingPatch);
  assert.equal(observed.state,'INCOMPLETE');
  assert.ok(observed.warnings.some(x=>x.startsWith('PATCH_UNAVAILABLE_FOR_')));
});
