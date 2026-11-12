# SOP — Universal Agent Workflow

**Owner:** AgentSkill. **Status:** normative v0.1.0-draft. A task need not execute every stage; stages are logical checks, not demands for extra artifacts.

## 1. BOOT and current authority
Capture `repo`, `selectedRef`, `currentHead`, `userGoal`, `userScope`, `taskMode`, `profileVersion`, available tools and active holds. A read-only request needs no mutation pipeline. Resolve the present owner from actual source, not recency of commits.

## 2. CLASSIFY intent, risk and complexity
- `INSPECT`: observe/audit/explain; no writes, issue/PR creation or CI.
- `PLAN`: research/design/specify; no mutation unless separately requested.
- `DEVELOP` / `MAINTAIN`: authorized source or policy changes within designated path/branch.
- `VALIDATE`: check actual behavior or source at permitted proof ceiling; validation is not implicit repair authorization.
- `PRODUCE`: execute a domain task with target-specific input/output/approval boundaries.
- `RELEASE`: separately controlled promotion, packaging or deployment.

Classify task as **bounded** (single known owner), **standard** (several known owners) or **complex** (ambiguous behavior, architecture, permissions or cross-system dependencies). Only complex work needs a fuller decision record.

## 3. ROUTE once
Resolve first wrong semantic owner. Read root/profile, relevant canonical documentation and one primary `SKILL.md`. Use helper skills only for independently needed capability; avoid preloading every skill and avoid duplicate router roles. Verify every skill's positive/negative trigger and host capability.

## 4. DEFINE a decision-complete contract
`Goal → observable acceptance → forbidden shortcuts → selected owner → inputs/evidence → allowed actions → verification → STOP`. Record assumptions that affect implementation; do not manufacture requirements. For complex work add non-goals, architecture boundaries, affected consumers and rollback conditions.

## 5. EXECUTE only authorized effects
Before each mutation perform the action-level preflight in `permission-and-security.md`. Check selected ref, current HEAD, file owner and hold. Prefer one coherent change, no duplicate state or framework stacking. Changes with irreversible effects need the actual platform's approval capability and user authorization.

## 6. VERIFY using a proof ceiling
Use `evidence-and-recovery.md`. Source-level inspection can prove source properties only; an authored test cannot prove executable behavior. If tests are held, do not run them. Verify negative cases, preservation of critical invariants and affected consumers at the available level; never dilute a gate.

## 7. REPORT and STOP
Return concise: goal/result, repository/ref+SHA, changed owner/files, checks actually run and outcomes, pending proof, known risk, next authorized dependency. STOP when the goal is met, action denied, approval genuinely required, a blocker cannot be resolved safely, or retries no longer add evidence.

## Failure and recovery
Observe the exact failure → classify source/test/tool/runtime/permission/context → identify falsifiable cause → apply bounded correction if allowed → revalidate at matching proof ceiling. If interrupted, checkpoint `goal/ref/head/owner/permissions/holds/completed/pending/evidence`. Re-read current source; never replay stale writes blindly.
