# Controlled Adoption and Host Conformance

**State:** controlled manual source adoption observed in 11 authorized `M-` repositories on 2026-11-14. A [dated aggregate source audit](research/m-repository-agentskill-source-audit-2026-11-14.md) records byte-identical portable file checks, exact prior-root preservation and project-Skill retention. **Source adoption is not evidence that a ChatGPT, Codex, Claude Code or OpenCode host actually loaded, followed or tested these rules.** Future migrations must still preserve every target repository's stricter restrictions and require its own user authorization.

## Mandatory project-policy loading after source adoption

The portable root must explicitly direct each adopted host to read `.agent-standard/profile.json` **and the actual `.agent-standard/project-policy.md` when present or required by the profile** before routing or writing. The profile note and source lock are pointers/evidence, not proof that the local document was loaded. If required local policy is unavailable, source inspection can continue safely but the affected mutation is blocked. Archived original roots are not a substitute active policy. Host-effective instruction loading remains unverified until observed in a real supported client.

## Shared methods in adoption

Move historical Karpathy, Ponytail, Pstack/Poteto, Harness², DeepSeek Harness, REA, UI UX Pro Max, and Matt Pocock **general working principles** to the single byte-identical `.agent-standard/methods.json` and shared engineering procedure. Preserve local project skill taxonomy, source owner, workstream holds and actual tool permissions. Remove duplicated generic method blocks from older AGENTS only **after** their restrictions are mapped and adoption is explicitly authorized. Do not change existing project repositories as a side effect of maintaining AgentSkill.

## Original upstream Skill acceptance (not automatic adoption)

Distinguish centrally adapted method references from original installed Skills and effective host use. A `registry/methods.json` upstream URL/commit is **source provenance only**. To claim an original REA, UI UX Pro Max or other external Skill is installed in an authorized project, inspect the **actual target** Skill location, verify its content and required references/scripts/data against publisher-owned Git source or a reviewed publisher-owned installer manifest, preserve the license, and check host-specific selection precedence. To claim it ran, collect real host loaded-path/tool-call evidence at the selected revision. A GitHub-only inspection cannot satisfy these host steps.

Do not copy a single original `SKILL.md` and call the full bundle installed when original operation requires additional assets or MCP tools. Preserve every already installed Skill/agent, nested AGENTS instructions, profile holds and existing data. Any installation/update is a **separate explicit per-repository action**; this central source audit authorizes none. Never execute a third-party installer to establish authenticity during ChatGPT/GitHub source review.

## GitHub continuity and context recovery adoption

Distribute `.agent-standard/core/commit-continuity-and-recovery.md` byte-identically. New material commits use **NORMAL (Surface + five continuity fields)** or **CRITICAL (Surface + seven continuity fields)**; a **TRIVIAL** subject-only exception is allowed only after an actual safe single-word docs diff has been reviewed. Do not rewrite old history or delete its valid decisions.

Each repository retains its own branch, active status owner, holds, domain skills, privacy controls and native test policy. For ChatGPT recovery, start with **user topic → exact branch/HEAD → current owner/status/source → targeted history only when decisions or continuity remain uncertain → reconcile proof and permission**. When needed, expand branch-wide metadata through 30 → 50/100 and targeted older Work/path/decision evidence without cutoff. Prior Next is never a grant. No CI/cloud/localtest workaround, automatic rollout or new status database is part of adoption.

## Live source identity versus offline fixtures

For any future adoption, pin actual target branch/HEAD, then read **Get Commit** for material changed-file and parent evidence. A locally supplied JSON snapshot or format-check result alone is not source authentication. Preserve the existing status owner, authorization and the two work surfaces; do not install snapshot tools, enable CI, force tests or rewrite old project histories. For the concrete read-only source pilot see `docs/research/continuity-readonly-pilot-2026-11-13.md` in AgentSkill.

## Root layout review — non-destructive by default

For proposed root-level file or directory changes, consult [Repository Root Layout Standard](standards/repository-root-layout.md) and its [read-only evidence review](research/repository-root-layout-audit-2026-11-13.md). This standard is **conditional** and does not automatically reclassify current project root entries as errors.

At the selected authorized branch/HEAD, inspect actual root consumers, framework/toolchain discovery requirements, README, local layout policy, relevant `.gitignore` and nested/domain ownership. Classify root entries as `KEEP_ROOT`, `DOMAIN_OWNED`, `LOCAL_OR_GENERATED` or `REVIEW_EXCEPTION`. A root move must preserve imports, scripts, README links, installers, GitHub workflows, user data and existing Skills/agents. Respect local names and stricter rules. An audit or adoption discussion does **not** authorize migration or deletion.

## README quality review — read-only by default

Use the [Repository README Quality Standard](standards/repository-readme.md) to assess the selected project's actual purpose, supported onboarding, limitations, current evidence, licensing, and canonical documentation links. Check claims against its **selected branch/HEAD**, manifests, commands, relevant consumers, and existing project-specific instructions. Do not invent a contribution policy or remove valid domain content.

This review does **not** authorize updates to another repository. AgentSkill's own README is the initial source example, not a template that must be copied. Source-level links or commands do not prove runtime, host instruction loading, or product behavior. Only a separate project-specific permission can authorize adoption or changes.

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

## Pilot order (historical candidate plan; not current adoption status)
- `M-Minecraft-Emulator` (public): bounded Skill-owner migration and source-only policy checks.
- `M-DanaIndonesiana` (public): evidence/permission-heavy domain; active test hold and sensitive-project boundaries must be retained.
- `M-LazyDesigner` (public): complex nested instructions, Skill taxonomy and native Blockbench proof boundaries.

This was a planning order before adoption, not the observed rollout sequence. The initial read-only inventory remains historical at `docs/research/adoption-readiness-source-audit-2026-11-13.md`. The [2026-11-14 aggregate check](research/m-repository-agentskill-source-audit-2026-11-14.md) supersedes its **current adoption counts only**, not the underlying dated findings. Future cross-repository writes still require current project-specific user authorization and active restrictions; no automatic CI reactivation.

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
