# SOP — Universal Agent Workflow

**Owner:** AgentSkill. **Status:** normative v0.1.0-draft. A task need not execute every stage; stages are logical checks, not demands for extra artifacts.

## 0. Identify the actual work surface — before task mode

- `CHATGPT_GITHUB`: ChatGPT conversation using GitHub for complete source architecture/integration. **No localtest request, no GitHub Actions/cloud CI workaround.** Never stop early to demand localtest while available source work remains.
- `LOCAL_PC_AGENT`: actual user-PC workspace controlled by a verified Claude Code, Codex CLI/IDE or OpenCode session, with separately chosen `LOCAL_VALIDATION` phase. Only this surface can provide actual user-PC execution proof.
- `UNKNOWN_SURFACE`: fail closed for local execution; finish safe read/source work.

See `work-surfaces-and-phase-gates.md` and `host-identification.md`. A model name, repo URL or branch `Local` does not define the work surface.

## Continuity boot for returning GitHub tasks

When the user says "lanjutkan" or starts a new conversation, use `commit-continuity-and-recovery.md`: derive the **same topic** from the user, pin the selected ref/HEAD, read relevant old commit continuity fields plus current source/holds, and resume the smallest permitted work. The newest Git commit may belong to a different topic; never follow it blindly.

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

## Source-to-local phase transition (not automatic)

Do not impose a localtest step between source features. In ChatGPT/GitHub, finish agreed architecture and integration, document source-only evidence, author relevant tests, and produce one source-ready handoff when genuinely complete. Do not demand immediate user action. Local validation starts only when the user explicitly chooses an actual local PC agent and the prepared source revision is reconciled.

## 6. VERIFY using a proof ceiling
Use `evidence-and-recovery.md`. Source-level inspection can prove source properties only; an authored test cannot prove executable behavior. If tests are held, do not run them. Verify negative cases, preservation of critical invariants and affected consumers at the available level; never dilute a gate.

## Material Git commit and future ChatGPT recovery

For material changes, select **NORMAL** (five continuity fields) or **CRITICAL** (seven fields) according to real scope; reserve **TRIVIAL** for proven one-word non-policy documentation edits. Apply `commit-continuity-and-recovery.md` and the existing proof ceiling. A commit history note is not localtest, deployment authorization, or a new user instruction. Recovery is branch- and work-topic-scoped, with current status/source winning over old Next.

## Commit/object evidence reconciliation

When reporting a material GitHub commit, confirm the selected branch and exact commit identity through the **current GitHub source connection**. Check real parent/changed paths, partial file pages, and the user-approved scope. A commit-body syntax check or offline snapshot assessor is **not** an authenticated GitHub read, source-semantic acceptance or localtest. See `commit-continuity-and-recovery.md`.

## 7. REPORT and STOP
**User-facing presentation must follow `user-facing-communication.md`:** answer first; write for the reader, not for the tool log; use a compact start-to-end diagram for complex flows when it is clearer; make technical details optional and never obscure uncertainty or source-only proof.
Return concise: goal/result, repository/ref+SHA, changed owner/files, checks actually run and outcomes, pending proof, known risk, next authorized dependency. STOP when the goal is met, action denied, approval genuinely required, a blocker cannot be resolved safely, or retries no longer add evidence.

## Failure and recovery
Observe the exact failure → classify source/test/tool/runtime/permission/context → identify falsifiable cause → apply bounded correction if allowed → revalidate at matching proof ceiling. If interrupted, checkpoint `goal/ref/head/owner/permissions/holds/completed/pending/evidence`. Re-read current source; never replay stale writes blindly.
