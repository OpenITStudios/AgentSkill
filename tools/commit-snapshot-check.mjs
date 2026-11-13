#!/usr/bin/env node
/**
 * Read-only consistency review of REST snapshots supplied by an operator.
 * No network, Git, CI, cloud runner, localtest, or target repository writes.
 * Caller-supplied JSON is NOT authenticated evidence of GitHub origin.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessCommitMessage, hasRiskyChangedFiles } from './commit-message-check.mjs';

const SHA=/^[a-f0-9]{40}$/;
const REPO=/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const REF=/^(?!.*\.\.)(?!\/)[A-Za-z0-9._/-]{1,200}$/;
const STATUSES=new Set(['added','modified','removed','renamed','copied','changed','unchanged']);

export function reviewGitHubCommitSnapshot(snapshot) {
  const errors=[], warnings=[];
  const stop=()=>({
    state:'REJECTED',errors,warnings,
    origin:'CALLER_SUPPLIED_SNAPSHOT_NOT_AUTHENTICATED',
    proof:'METADATA_ONLY_NOT_RUNTIME_OR_SOURCE_ACCEPTANCE'
  });
  if(!snapshot || snapshot.schemaVersion!==1 || !REPO.test(snapshot.repository||'') ||
     !REF.test(snapshot.selectedBranch||'') || !SHA.test(snapshot.expectedHead||'')) {
    errors.push('INVALID_REQUEST_IDENTITY');
    return stop();
  }
  const branch=snapshot.branchResponse;
  const commit=snapshot.commitResponse;
  if(!branch || branch.name!==snapshot.selectedBranch ||
     !SHA.test(branch.commit?.sha||'')) errors.push('BRANCH_RESPONSE_MISMATCH');
  if(!commit || !SHA.test(commit.sha||'') || typeof commit.commit?.message!=='string') {
    errors.push('COMMIT_RESPONSE_INVALID');
  }
  if(errors.length) return stop();
  if(branch.commit.sha!==snapshot.expectedHead || commit.sha!==snapshot.expectedHead) {
    errors.push('STALE_OR_WRONG_BRANCH_HEAD');
  }
  const expectedURL='https://github.com/'+snapshot.repository+'/commit/'+snapshot.expectedHead;
  if(commit.html_url!==expectedURL) errors.push('COMMIT_REPOSITORY_IDENTITY_MISMATCH');
  if(!Array.isArray(commit.parents) || commit.parents.length!==1 ||
      !SHA.test(commit.parents[0]?.sha||'')) errors.push('PARENT_IDENTITY_INCOMPLETE_OR_MERGE');
  if(snapshot.expectedPreviousHead!==undefined) {
    if(!SHA.test(snapshot.expectedPreviousHead) ||
       commit.parents?.[0]?.sha!==snapshot.expectedPreviousHead) {
      errors.push('EXPECTED_PARENT_MISMATCH');
    }
  } else warnings.push('EXPECTED_PARENT_NOT_SUPPLIED');
  const raw=commit.files;
  if(!Array.isArray(raw) || raw.length===0) {
    errors.push('CHANGED_FILE_LIST_MISSING');
    return {...stop(),changedPaths:[]};
  }
  const seen=new Set(), paths=[], observed=[];
  for(const file of raw) {
    if(!file || typeof file.filename!=='string' ||
       file.filename.startsWith('/') || file.filename.includes('..') ||
       !STATUSES.has(file.status) || seen.has(file.filename)) {
      errors.push('INVALID_OR_DUPLICATE_CHANGED_FILE_ENTRY');
      continue;
    }
    seen.add(file.filename);
    paths.push(file.filename);
    observed.push({path:file.filename,status:file.status});
    if(file.status==='renamed' && (!file.previous_filename ||
       file.previous_filename===file.filename)) warnings.push('RENAME_PREVIOUS_PATH_UNRESOLVED');
    if(typeof file.patch!=='string') warnings.push('PATCH_UNAVAILABLE_FOR_'+file.filename);
  }
  if(raw.length>=300) warnings.push('FILE_LIST_MAY_BE_PAGINATED');
  const risk=hasRiskyChangedFiles(observed);
  const message=commit.commit.message;
  const subjectOnly=!message.includes('\n');
  let diffText;
  if(subjectOnly && raw.length===1) {
    const file=raw[0];
    if(file.status==='modified' && typeof file.patch==='string') {
      const p=file.filename;
      diffText='diff --git a/'+p+' b/'+p+'\n--- a/'+p+
        '\n+++ b/'+p+'\n'+file.patch;
    }
  }
  const format=assessCommitMessage(message,{
    tier:subjectOnly?'trivial':risk?'critical':undefined,
    diffText
  });
  if(format.errors.length) errors.push(...format.errors.map(e=>'MESSAGE: '+e));
  if(/\b(?:EXECUTED_TEST_PASS|LIVE_TARGET_VERIFIED)\b/.test(message)) {
    warnings.push('EXECUTION_RECEIPT_NOT_INSPECTED');
  }
  const state=errors.length ? 'REJECTED' :
    warnings.some(x=>x==='FILE_LIST_MAY_BE_PAGINATED') ? 'INCOMPLETE' :
    'SNAPSHOT_CONSISTENT';
  return {
    state,repository:snapshot.repository,branch:snapshot.selectedBranch,
    head:branch.commit.sha,commit:commit.sha,
    parent:commit.parents?.[0]?.sha??null,
    tier:format.tier,changedPaths:paths,changedFileCount:raw.length,
    riskDetected:risk,errors,warnings,
    origin:'CALLER_SUPPLIED_SNAPSHOT_NOT_AUTHENTICATED',
    proof:'METADATA_ONLY_NOT_RUNTIME_OR_SOURCE_ACCEPTANCE',
    note:'Re-fetch with an authorized GitHub connector and compare current branch state. A snapshot is not a trusted runtime receipt.'
  };
}

async function main() {
  const path=process.argv[2];
  if(!path || path==='--help') {
    process.stdout.write('Usage: node tools/commit-snapshot-check.mjs GITHUB_REST_SNAPSHOT.json\n');
    return;
  }
  const snapshot=JSON.parse(await readFile(resolve(path),'utf8'));
  const result=reviewGitHubCommitSnapshot(snapshot);
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
  if(result.state!=='SNAPSHOT_CONSISTENT') process.exitCode=1;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  main().catch(e=>{process.stderr.write('SNAPSHOT CHECK FAIL: '+e.message+'\n');process.exitCode=1;});
}
