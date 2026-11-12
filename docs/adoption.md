# Controlled Adoption and Host Conformance

**State:** proposal; no product repository has adopted this version. Existing rules cannot be overwritten without lossless classification of their restrictions.

## Shared methods in adoption

Move historical Karpathy, Ponytail, Pstack/Poteto, Harness², DeepSeek Harness, REA, UI UX Pro Max, and Matt Pocock **general working principles** to the single byte-identical `.agent-standard/methods.json` and shared engineering procedure. Preserve local project skill taxonomy, source owner, workstream holds and actual tool permissions. Remove duplicated generic method blocks from older AGENTS only **after** their restrictions are mapped and adoption is explicitly authorized. Do not change existing project repositories as a side effect of maintaining AgentSkill.

## Git continuity in each adopted repository

Distribute `.agent-standard/core/commit-continuity-and-recovery.md` **byte-for-byte**, and preserve current local branch, workstream holds, and existing canonical project notes. New material commits use the seven-field continuity format; **do not rewrite old history** to backfill missing fields. On a new ChatGPT chat, recover by the user's **named topic** and the pinned branch rather than grabbing the global latest commit. A `Next` line is advisory, not authorization for localtest, CI/cloud, cross-repo writes, or branch promotion.

## Classification before migration
For every source repository pin the **user-selected working branch and HEAD**; read root/nearest AGENTS, GitHub rules, local skills, permission files, live branch restrictions, test/CI holds, privacy rules and workstream pauses. Classify each directive:
- `CORE` — belongs in AgentSkill shared policy, identical for all.
- `PROFILE` — branch, CI/test restrictions, protected paths, data classification and holds remain local.
- `DOMAIN` — capability-specific instructions and acceptance remain in domain skill/docs.
- `HISTORY` — superseded evidence; never use as current authorization.
- `CONFLICT` — unresolved authority or permission; stop before copying.

Write a **read-only migration assessment** mapping directive → destination owner → preservation check → conflict. Never delete old restrictions as a side effect of parity.

## Staging, never blind copying
1. Pin approved AgentSkill standard commit SHA and candidate target branch HEAD.
2. Prepare immutable staging package via `node tools/standard.mjs package /path/to/new-bundle`; confirm file digests and unique core skill names.
3. Review target profile and user authorization, then separately decide whether to adopt. Package creation does not grant repo mutation.
4. A permitted installer must use expected-head guarded updates and preserve all domain files/holds. No installer is provided in v0.1.0.
5. Audit exact-byte parity and link lock/version to pinned source commit; then separately test Codex and OpenCode effective instruction discovery.
6. Behavioral evaluations and native product tests require real available hosts and explicit authorization. Do not interpret static success as agent PASS.

## Codex / OpenCode
Both can consume root `AGENTS.md` and portable skills under `.agents/skills/`, but resolution, precedence, token limits, permissions and name shadowing differ. Record **effective loaded file paths, host version, active permissions, selected skill, resulting actions** in a conformance receipt. Verify duplicate IDs in any host-specific skill directories; identify unsupported behavior rather than assuming 1:1 model outputs.

## Pilot order (candidates only)
- `M-SearchNow`: small engineering repo / minimal skill routing.
- `M-DanaIndonesiana`: evidence/permission-intensive non-code domain; active test hold must be retained.
- `M-LazyDesigner`: complex specialist skill taxonomy; native Blockbench checks remain outside source-only acceptance.

The actual branches, branch permissions and holds must be re-read at pilot time. No cross-repo writes until each target has separately authorized adoption. No automatic CI reactivation.

## Rollback
Keep exact pre-adoption ref and blob authority, create no ad hoc branches for transport, and revert only within explicit target permissions and safe concurrency checks. Document preserved local restrictions and affected consumers. STOP when parity, source receipt and authorized acceptance are complete.


## Mandatory two-method migration safety

The downstream root must carry the `CHATGPT_GITHUB` / `LOCAL_PC_AGENT` distinction **unchanged**. The project profile must satisfy the immutable `workflowPolicy` defaults:
- `requestLocaltestFromChatGPT = false`;
- `localTestDuringSourcePhase = false`;
- `githubActionsOrCloudTestSubstitution = false`;
- `localValidationRequiresExplicitTransition = true`.

Complete all GitHub-source architecture/integration before writing one source-ready handoff. Do not solicit localtest as a migration prerequisite. Codex CLI, Claude Code, and OpenCode can receive adapted loader documentation from the portable `.agent-standard/adapters/` package, but no local host has been activated simply by adopting files. Actual executable proof requires the user's separately selected and verified PC-local context.


## Staging vs real adoption status

A generated `STAGED_NOT_INSTALLED` lock is **not** evidence that a host has adopted or loaded the rules. The offline verifier distinguishes this state from `ADOPTED`. Adopted status requires an explicit 40-character pinned source commit, a complete destination-specific `.agent-standard/profile.json` that passes policy validation, all canonical hashes, and no detected alternate-host core skill shadow. That static check still does **not** prove actual Claude Code/Codex/OpenCode instruction loading or behavioral compliance. No automatic installer, GitHub Actions or remote test runner is supplied.


## Mandatory communication contract during migration

Preserve the portable `AGENTS.md` statement and `.agent-standard/core/user-facing-communication.md` file unchanged. Each host may render diagrams differently, so the response policy allows a short arrow diagram or compact table where visual output is unavailable; do not install an image engine just for formatting. Evaluation cases `GOV-067`–`GOV-084` must remain normative until actually tested against host outputs and users. A shorter response is not acceptable if it drops proof limits, relevant caveats, source attribution or requested technical depth.
