#!/usr/bin/env node
/**
 * OpenITStudios GitHub Continuity v2.
 * Reads a commit message and optionally a user-provided unified diff.
 * Never runs Git, network, CI, cloud tests, or touches target repositories.
 * Syntax and diff heuristics do not prove that a change is safe or tested.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ORDER = Object.freeze([
  'Goal','Work','State','Proof','Decision','Unresolved','Next'
]);
const MINIMUM = Object.freeze({
  trivial: [],
  normal: ['Goal','Work','State','Proof','Next'],
  critical: ORDER
});
const EXTRAS = new Set(['Refs','Co-authored-by','Signed-off-by']);
const SUBJECT = /^(feat|fix|docs|refactor|test|chore|perf|build|security|ci|release|revert)\(([a-z][a-z0-9._-]*)\): (\S.{2,})$/;
const STATE = /^(ACTIVE|BLOCKED|PAUSED|DONE)(?:[;\s].*)?$/;
const EVIDENCE = /\b(SOURCE_REVIEWED|SOURCE_COMMITTED|TEST_AUTHORED_NOT_RUN|EXECUTED_TEST_PASS|EXECUTED_TEST_FAIL|LIVE_TARGET_VERIFIED|NOT_EXECUTED|LOCAL_TEST_DEFERRED|UNKNOWN)\b/;
const SENSITIVE_PATH = /(?:^AGENTS\.md$|^GITHUB_RULES\.md$|^\.agent-standard\/|^\.github\/|^registry\/|^schemas\/|^tools\/|^tests\/|(?:^|\/)(?:auth|permissions?|security|migrations?|policies|policy|contracts?)(?:\/|\.|-))/i;
const ORDINARY_DOC = /^(?:README\.md|docs\/(?:examples|guides|tutorials|help|user-guide)\/[A-Za-z0-9._/-]+\.md)$/;
const CONTROL_TERMS = /\b(?:auth|allow|deny|permit|permission|secret|password|token|admin|security|branch|hold|ci|test|release|deploy|enable|disable|enabled|disabled|true|false|safe|unsafe|approval|approved|must|shall|require|prohibit|policy)\b/i;

function diffInfo(text) {
  if (typeof text !== 'string' || !text.trim()) return null;
  const items = [], lines = text.replace(/\r\n/g, '\n').split('\n');
  let entry = null;
  for (const line of lines) {
    if (line.startsWith('diff --git ')) {
      const m = /^diff --git a\/(.+?) b\/(.+)$/.exec(line);
      if (!m || m[1] !== m[2] || m[1].startsWith('"') || m[1].includes('..')) {
        return { error:'Unrecognized or renamed diff: manual review required' };
      }
      entry = { path:m[1], added:[], removed:[], hunks:0, metadata:[] };
      items.push(entry);
    } else if (entry) {
      if (/^(?:new file mode|deleted file mode|rename (?:from|to)|copy (?:from|to)|Binary files|GIT binary patch)/.test(line)) entry.metadata.push(line);
      else if (line.startsWith('@@ ')) entry.hunks++;
      else if (line.startsWith('+') && !line.startsWith('+++')) entry.added.push(line.slice(1));
      else if (line.startsWith('-') && !line.startsWith('---')) entry.removed.push(line.slice(1));
    }
  }
  if (!items.length) return { error:'No Git unified diff file headers detected' };
  return { files:items, requiresCritical:items.some(x => SENSITIVE_PATH.test(x.path)) || items.length > 5 };
}

function distanceAtMostTwo(a, b) {
  if (Math.abs(a.length-b.length) > 2 || a.length > 80 || b.length > 80) return false;
  const previous = Array.from({length:b.length+1},(_,i)=>i);
  for (let i=1;i<=a.length;i++) {
    let diagonal=previous[0];
    previous[0]=i;
    for (let j=1;j<=b.length;j++) {
      const old=previous[j];
      previous[j]=Math.min(previous[j]+1,previous[j-1]+1,diagonal+(a[i-1]===b[j-1]?0:1));
      diagonal=old;
    }
  }
  return previous[b.length] >= 1 && previous[b.length] <= 2;
}

function oneWordTypo(before, after) {
  if (before.length > 180 || after.length > 180 || CONTROL_TERMS.test(before) || CONTROL_TERMS.test(after)) return false;
  if (/[<>{}\[\]\x60\\/=$]/.test(before+after)) return false;
  const pattern = /\p{L}+/gu;
  const a=[...before.matchAll(pattern)], b=[...after.matchAll(pattern)];
  if (a.length < 1 || a.length !== b.length) return false;
  const skeleton = s => s.replace(pattern,'_');
  if (skeleton(before)!==skeleton(after)) return false;
  let changes=0;
  for(let i=0;i<a.length;i++) {
    if(a[i][0]!==b[i][0]) {
      changes++;
      if(changes>1 || !distanceAtMostTwo(a[i][0].toLowerCase(),b[i][0].toLowerCase())) return false;
    }
  }
  return changes===1;
}

function trivialCandidate(diff) {
  if (!diff || diff.error || diff.files.length!==1) return false;
  const x=diff.files[0];
  if (!ORDINARY_DOC.test(x.path) || SENSITIVE_PATH.test(x.path)) return false;
  if (x.metadata.length || x.hunks!==1 || x.added.length!==1 || x.removed.length!==1) return false;
  return oneWordTypo(x.removed[0],x.added[0]);
}

export function assessCommitMessage(raw, options={}) {
  const errors=[], message=typeof raw==='string'?raw.replace(/\r\n/g,'\n').trimEnd():'';
  if(!message.trim()) return {tier:'unknown',errors:['Commit message is empty'],diffStatus:'NOT_SUPPLIED'};
  const lines=message.split('\n'), subject=lines[0].trim();
  if(!SUBJECT.test(subject)) errors.push('Subject must be: type(scope): concrete outcome');
  if(subject.length>100) errors.push('Subject is too long; make the outcome clearer');
  const fields=new Map();
  let lastIndex=-1, afterExtra=false, activeField=null;
  if(lines.length>1 && lines[1]!=='') errors.push('Separate subject and body with a blank line');
  for(const line of lines.slice(2)) {
    if(!line.trim()) continue;
    const match=/^([A-Za-z][A-Za-z-]*):[ \t]*(.*)$/.exec(line);
    if(match) {
      const [,name,rawValue]=match, value=rawValue.trim(),index=ORDER.indexOf(name);
      if(index<0 && !EXTRAS.has(name)) { errors.push('Unexpected commit field: '+name);activeField=null;continue; }
      if(fields.has(name) && name!=='Co-authored-by') {errors.push('Duplicate commit field: '+name);activeField=null;continue;}
      if(!value) errors.push('Commit field is empty: '+name);
      if(index>=0) {
        if(afterExtra || index<=lastIndex) errors.push('Fields are out of order: '+name);
        lastIndex=index;
      } else afterExtra=true;
      fields.set(name, fields.has(name)?fields.get(name)+'; '+value:value);
      activeField=name;
    } else if(/^[ \t]{2,}\S/.test(line) && activeField) {
      fields.set(activeField,fields.get(activeField)+' '+line.trim());
    } else errors.push('Unlabeled commit-body text');
  }
  const inferred=lines.length===1?'trivial':fields.has('Decision')&&fields.has('Unresolved')?'critical':'normal';
  const tier=options.tier || (options.trivial===true?'trivial':inferred);
  if(!Object.hasOwn(MINIMUM,tier)) errors.push('Unknown tier (trivial, normal, critical only)');
  const diff=diffInfo(options.diffText);
  if(options.diffText!==undefined && diff?.error) errors.push('Diff is not usable: '+diff.error);
  if(tier==='trivial') {
    if(lines.length!==1) errors.push('Trivial commits must use a subject only');
    if(!diff || !trivialCandidate(diff)) errors.push('TRIVIAL REQUIRES DIFF: one reviewed plain-text word typo in an allowed documentation file');
  } else if(MINIMUM[tier]) {
    for(const key of MINIMUM[tier]) if(!fields.has(key)) errors.push('Missing continuity field: '+key);
    if(fields.has('Goal') && fields.get('Goal').length<10) errors.push('Goal is not meaningful');
    if(fields.has('Work') && !/^[a-z][a-z0-9._-]{2,}[ \t]*(?:—|--|\|)[ \t]+\S/.test(fields.get('Work'))) errors.push('Work must begin with stable topic slug and separator');
    if(fields.has('State') && !STATE.test(fields.get('State'))) errors.push('State must start with ACTIVE, BLOCKED, PAUSED or DONE');
    if(fields.has('Proof') && !EVIDENCE.test(fields.get('Proof'))) errors.push('Proof must name actual evidence tier');
    if(fields.has('Next') && fields.get('Next').length<4) errors.push('Next must be one safe step or STOP');
    if(diff && !diff.error && diff.requiresCritical && tier!=='critical') {
      errors.push('DIFF RISK: critical source paths or broad changes require all seven fields and critical tier');
    }
  }
  if(options.trivial===true && options.tier && options.tier!=='trivial') errors.push('Contradictory tier flags');
  return {
    tier, errors,
    diffStatus:diff ? diff.error?'INVALID_DIFF':'PATCH_STRUCTURE_ONLY' : 'DIFF_NOT_REVIEWED',
    changedPaths:diff?.files?.map(x=>x.path)??[],
    note:'Format and diff heuristics only. Not proof of source correctness, authorization or tests.'
  };
}

export function lintCommitMessage(raw,options={}) {
  return assessCommitMessage(raw,options).errors;
}

function usage() {
  return 'Usage: node tools/commit-message-check.mjs MESSAGE.txt [--tier trivial|normal|critical] [--diff PATCH.txt] [--trivial]\n' +
    'TRIVIAL requires a real reviewed unified patch; --trivial alone does not bypass metadata.\n';
}

async function main() {
  const args=process.argv.slice(2), file=args[0];
  if(!file || file==='--help') { process.stdout.write(usage());return; }
  let tier, diffFile, trivial=false;
  for(let i=1;i<args.length;i++) {
    const token=args[i];
    if(token==='--tier') tier=args[++i];
    else if(token==='--diff') diffFile=args[++i];
    else if(token==='--trivial') trivial=true;
    else throw new Error('Unknown option: '+token);
  }
  if((tier && !Object.hasOwn(MINIMUM,tier)) || (args.includes('--diff') && !diffFile)) throw new Error(usage().trim());
  const text=await readFile(resolve(file),'utf8');
  const diffText=diffFile ? await readFile(resolve(diffFile),'utf8') : undefined;
  const result=assessCommitMessage(text,{tier,trivial,diffText});
  if(result.errors.length) {
    process.stderr.write('COMMIT FORMAT FAIL ('+result.tier+'):\n- '+result.errors.join('\n- ')+'\n');
    process.exitCode=1;
  } else {
    process.stdout.write('COMMIT FORMAT PASS ('+result.tier+'; '+result.diffStatus+
      '): message structure only; scope, permissions and proof still require review.\n');
  }
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  main().catch(err=>{process.stderr.write('COMMIT FORMAT FAIL: '+err.message+'\n');process.exitCode=1;});
}
