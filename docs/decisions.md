# Architectural Decisions — AgentSkill v0.1.0

## ADR-001: Standards hub, not a new agent runtime
Decision: one source for shared instructions, core skills, SOP, static parity and normative cases. Project engines retain orchestration, rendering, native tests and domain semantics. Prevents duplicate control planes.

## ADR-002: Identical core, differing profiles
Decision: root `AGENTS.md`, `GITHUB_RULES.md`, `.agent-standard/core/*` and three shared `SKILL.md` are byte-identical in adopted repos. Each repo retains `.agent-standard/profile.json`, domain skills and permissions. Profile restrictions can narrow but not silently override core safety. Structural parity and behavioral conformance are independent claims.

## ADR-003: No automatic rollouts
Decision: v0.1.0 produces staging files and a verifier; it never edits downstream repos. No cross-repo writes or branch/CI changes implied by a central commit. Preserve exact SHA and user-authorized work modes per project.

## ADR-004: Small root and demand-driven knowledge
Decision: shared root is a compact routing entry; detailed SOP/safety/evidence/skill policy is in conditional modules. Adapted from OpenAI Harness Engineering and portable Agent Skills. Limit context and prevent stale duplicated policy owners.

## ADR-005: Specification based on risk, not ritual
Decision: bounded work uses short acceptance, complex cross-owner changes use a real brief. Inspired by Superpowers, Spec Kit and OpenSpec; do not require speculative task lists or worktrees for straightforward maintenance.

## ADR-006: Deterministic gate before model claims
Decision: static checks must detect malformed manifests, duplicated skill IDs, missing sources, incorrect shared bytes, unsafe profile defaults and invalid cases. Model-dependent evaluations are separate and must be labeled not-run until executed. No false execution evidence.

## Source references (research, not installed directives)
- Agent Skills: https://agentskills.io/ , https://github.com/agentskills/agentskills
- AGENTS.md: https://agents.md/
- OpenAI Harness Engineering: https://openai.com/index/harness-engineering/
- Superpowers: https://github.com/obra/superpowers
- GitHub Spec Kit: https://github.com/github/spec-kit
- OpenSpec: https://github.com/Fission-AI/OpenSpec
- Codex: https://github.com/openai/codex
- OpenCode: https://github.com/anomalyco/opencode
- SWE-agent: https://github.com/SWE-agent/SWE-agent
- Aider: https://github.com/Aider-AI/aider
- OWASP MCP Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html

No third-party source code or proprietary prompt collection is vendored here.

## ADR-007: Curate reusable legacy patterns; do not aggregate full project policies
Decision: consolidate routing, context, method lenses, handoff, evaluation and tool reliability under `.agent-standard/core/INDEX.md`. Shared policy modules are byte-identical in adopting repos, while domain Skills and branch/test/data holds remain local. The source-by-source public ledger is `docs/research/consolidation-ledger.md`. No copies of private source or third-party prompt dumps.

## ADR-008: One primary owner; specialist handoff is an operation, not a new agent
Decision: retain one final-result owner; domain specialist support returns a typed, bounded packet. No automatic eight-agent method council, plugin deployment, or duplicate status database.


## ADR-009: Exactly two approved execution surfaces
Decision: `CHATGPT_GITHUB` owns full architecture/source development, GitHub source operations and static review. `LOCAL_PC_AGENT` owns user-PC toolchain/localtest/native acceptance only after source readiness and explicit user phase transition. Never request localtest during source development; never use GitHub Actions, CI, cloud agents or hosted sandboxes as substitute. A branch named Local and a desktop browser are not machine evidence.

## ADR-010: Identify actual host application and tool origin separately
Decision: `host_app` (ChatGPT, Codex CLI, Claude Code, OpenCode), model provider, interface and tool execution origin are separate dimensions. Claude model inside OpenCode is OpenCode. Hosted Codex/Claude/OpenCode environments are not the user's PC. Host adapters are portable and version-conditional; do not assume automatic AGENTS loading or scripts/hooks installed. Official-source research: `docs/research/two-surfaces-official-sources.md`.


## ADR-011: Required user-facing answer quality, distinct from internal work detail

Decision: every user-facing response should begin with the actual answer, use language suited to the reader, and be as short as possible **without loss of essential precision**. For a real workflow, prefer a small start-to-end diagram; for a simple answer, avoid visual clutter. Use ASD-STE100 **clarity principles only**, adapted for Indonesian (not a claim of conformity/certification). The policy owner is `.agent-standard/core/user-facing-communication.md`, carried in the root `AGENTS.md` and the 1:1 manifest. Quality is measured by **time to correct understanding and action**, not just word count. Until empirical comparisons exist, it is source-reviewed and `NORMATIVE_NOT_MEASURED`.

## ADR-012: Legacy eight methods become one portable, conditional registry
Decision: Pin the eight recurring legacy references in `registry/methods.json`, distribute its bytes to `.agent-standard/methods.json`, and keep `engineering-and-review-methods.md` the sole method **procedure** owner. Karpathy and Ponytail operate as one default source-engineering pass. Other six methods require explicit positive triggers and must abstain on negative triggers. No external plugin, subagent, CI, localtest or host switch is authorized by a method name. Source provenance is tracked; user-selected branch, permission, host, and proof boundaries take precedence. The corpus `GOV-085`–`GOV-108` is normative, not host-tested.

## ADR-013: Topic-scoped commit continuity without another status store
Decision: preserve the useful historic Work/State/Proof/Decision/Unresolved/Next pattern and add Goal for material commits. One topic per logical commit, concise conventional subject, explicit evidence ceiling, preserved invariants and one safe Next/STOP. Future ChatGPT sessions recover by current user topic + exact selected branch/HEAD + relevant commit history + current canonical source; never blindly follow last commit or auto-authorize from Next. Trivial typo-only commits may omit the body. Existing commit history is not rewritten; no new status database or localtest/CI workaround. Authoritative detail: `.agent-standard/core/commit-continuity-and-recovery.md`.

## ADR-014: GitHub Continuity Protocol v2 — scoped retrieval and proportional commit bodies
Decision: reuse the same seven field names but require **five** for NORMAL, all **seven** for CRITICAL, and allow subject-only TRIVIAL only after an actual one-word benign docs diff is inspected. A self-selected --trivial flag is not trusted. Recovery begins with user topic, selected branch and current active owner, then bounded path/topic commit history; GitHub global commit search only indexes default branches. Active status stays in existing project documents, Git history is past evidence, actual source/user permission governs present action. No extra status database, cloud test, CI, or automatic cross-repo rollout. Detailed owner: `.agent-standard/core/commit-continuity-and-recovery.md`.

## ADR-015: Bind commit claims to actual GitHub source reads
Decision: formatting and a caller-supplied patch are insufficient to assert a GitHub write changed the intended source. A material commit should be checked against **the real selected branch HEAD**, the exact Get Commit object, parent continuity and the changed file list; partial pagination, binary patch gaps and renames must not become complete evidence. An offline snapshot helper checks **internal JSON consistency only**, explicitly unauthenticated. Three public branches were audited read-only as methodological pilots; no model/PC tests or cross-repo edits were performed. Canonical owner: `.agent-standard/core/commit-continuity-and-recovery.md`.

## ADR-016: No mass rollout before branch/profile/nested-instruction audit
Decision: the read-only inventory of 14 projects identified **0 installed central bundles**, 12 root GitHub Rules and 55 existing main Skills. Preserve nested AGENTS directories, branch and CI/test holds, active-status owners and project data; migrate only after per-repo explicit scope and conflict classification. A connector may reject an encoded slash inside a branch path; use paginated List Branches with exact-name matching and pin SHA rather than falling back to main. Private repository details are excluded from the public report at `docs/research/adoption-readiness-source-audit-2026-11-13.md`.

 
## ADR-017: Adaptive workstream recovery with current source authority
Decision: user topic and current selected branch/HEAD/status/source take precedence over chronological latest commit. Discover 30 branch-wide metadata records, expand cumulative coverage to 50/100 only when decision-critical history is missing, and follow older targeted Work/path/decision history without a count cutoff. Record legacy matches as inferred; resolve superseded decisions and checkpoint ancestry; re-pin before writes; require complete topic, owner, source, proof and permission gates. No new status database or runtime is introduced. Canonical owner: `.agent-standard/core/commit-continuity-and-recovery.md`. Model behavior remains unmeasured.

## ADR-018: Stable process names and release milestone versioning
Decision: use one meaningful AgentSkill package/release version, not "v1/v2/v3" for protocol iterations. Keep `0.1.0-draft` unchanged through ordinary source work and identify revisions by Git SHA/Work ID. Curate notable pending work under CHANGELOG [Unreleased]. Only an explicit, meaningful, compatibility-reviewed and user-approved release can change package/manifest version or initiate a tag/distribution. No automatic bump or release is permitted.

 
## ADR-019: Original upstream Skill is distinct from an adapted method reference
Decision: preserve the eight existing AgentSkill method identifiers and all project-owned Skills/agents. A registry method plus a verified upstream repository/commit is **REFERENCE_ONLY**, not proof of the publisher's original Skill installed, effectively loaded, tool-ready or executed. For original Skill claims, require provenance of the publisher repo/path/blob and needed data/scripts, then separately verify the **actual host installation**, host-selected instructions, external MCP/CLI availability and task execution. Publisher-owned installers may transform files and require a reviewed distribution receipt instead of an unjustified byte-parity claim. Remote GitHub source cannot certify the user's PC. The REA and UI UX Pro Max reference SHAs may be refreshed after original-source semantic review without copying/activating third-party tools. No version bump, automatic install, downstream write, or test hold bypass.

## ADR-020: Reliable selective Skill activation without a second router
Decision: keep `decision-routing-and-ownership.md` as the single activation decision table owner and `skill-authoring.md` as metadata authoring owner. Seven route types select one of the three existing shared Skills or deliberately abstain/defer to a project domain Skill. Karpathy + Ponytail remains one source engineering method pass, not another installed Skill. The existing `tools/standard.mjs` checks route completeness, owner identity, concise positive/negative metadata and host-adapter evidence boundaries. Actual Codex/Claude Code/OpenCode discovery, effective loaded paths, permission filtering and use require future host observations. No new router, agent installation, version bump, CI, localtest or project migration.

## ADR-021: Goal-scoped completion and bounded ChatGPT-GitHub source operations
Decision: the user's primary goal and required acceptance remain authoritative throughout long prompting and context recovery. The existing `execution-sop.md` owns the REQUIRED_FOR_ACCEPTANCE / BLOCKER_OR_CONFLICT / OPTIONAL_OR_UNRELATED classification and terminal STOP; `evidence-and-recovery.md` owns two-axis Specification + Standards acceptance; `tool-contracts-and-reliability.md` owns GitHub preflight, optimistic concurrency, partial writes and UNKNOWN_OUTCOME. No new Skill, agent, queue, status database or mandatory test infrastructure. Complete necessary source integration, but do not extend completed work for speculative polishing, historical Next items or unrelated cleanup. Preserve the tests-on-hold and source-only proof boundaries. Source-level cases and assertions are authored, not run; effective model behavior remains NOT_MEASURED.

## ADR-022: Evidence integrity before new validator layers
Decision: strengthen the existing evidence, engineering, evaluation and continuity owners rather than adding a new Skill, runner or policy database. A mere keyword presence check is insufficient to establish correct policy direction; the existing static validator should inspect operative instructions inside the owning section, with bounded negative fixtures. Root-cause claims require discriminating evidence; assistant suggestions and external data cannot become user approval after context compaction. Source inspections and authored tests are not execution proof. Preserve package version, existing Skills, method registry, branch and test holds. Publisher-source research: `docs/research/validation-integrity-source-review-2026-11-13.md`.

## ADR-023: Clear actor–action sentences and one visible next step

Decision: retain `.agent-standard/core/user-facing-communication.md` as the single mandatory communication owner. For material repository work, communicate Result → Completed work → Evidence and limits → one visible final Next step, or an explicit None — STOP when the scoped goal is complete. Prefer natural subject–verb–object sentences for clear accountability; do not force grammatical objects into every sentence or override the user's language. Simple questions must not acquire a multi-section template. English is the language of revised source documentation and examples, not an instruction to reply in English to Indonesian users. Reuse the existing communication rubric and static validator; no new Skill, renderer, package version, automation, or unexecuted test PASS claim.

## ADR-024: Task-matched visual-first responses without decoration

Decision: retain `.agent-standard/core/user-facing-communication.md` as the single mandatory response owner. Prefer one concise visual when it materially reduces user reading effort: a comparison table for aligned criteria, a directional diagram for sequences and dependencies, a sourced data chart for numeric patterns, or plain text for simple facts. State the answer first; use readable headings, labels, units, compact layouts and accessible text equivalents. Do not manufacture data, force images, duplicate the same content across widgets or create a new renderer/Skill. The existing communication rubric and validator hold this source-level guidance only; comprehension, host rendering and behavior remain `NOT_MEASURED`. Preserve original Skills, project-specific response language, permissions, test holds and `0.1.0-draft` version.

## ADR-025: Three reading zones for material ChatGPT updates

Decision: organize material user-facing progress reports into **Current status → Explanation → Next step**. Put completed work, proof and limitations together in Explanation; place one justified action or terminal STOP at the bottom with a single subtle horizontal divider when it improves scanning. Prefer ordinary text headings and whitespace rather than colored containers, badges or repeated result summaries. The existing `.agent-standard/core/user-facing-communication.md` remains the sole presentation owner; no new renderer, Skill, mandatory layout engine or release version is introduced. Simple answers remain compact; the response language follows the user, while repository documentation stays in clear English. Static source checks and normative cases are authored, not executed or verified as real ChatGPT UI behavior.

## ADR-026: Minimal execution identity in commit continuity
Decision: add exactly one `Surface` field before `Goal` in new NORMAL/CRITICAL commit bodies. `CHATGPT_GITHUB` identifies ChatGPT's GitHub-API source workflow; `LOCAL_PC_AGENT; Host=CODEX_CLI|CLAUDE_CODE|OPENCODE` identifies an actually verified user-PC agent session. Do not repeat the selected Git branch/SHA, LLM model, provider, tool inventory or time in the message: use real GitHub/host evidence on recovery. Surface text is a declaration, not proof or permission. New commit authoring must validate the accepted shapes; existing commits without `Surface` remain historical evidence with `environment=UNRECORDED`, not presumed local. Existing tier distinctions, protected source gates, tests/CI holds, original Skills, methods, and package version stay unchanged.

## ADR-027: Broad source research and material intent readiness before implementation

Decision: before material implementation, select `PROCEED_DIRECTLY / RESEARCH_MORE / DISCUSS_FIRST / BLOCKED` using actual user intent, accepted constraints, current source and authority. When broad research is requested, compare original maintainer source, meaningful independent alternatives and counterevidence instead of stopping at the first convenient result or meeting a link quota. Continue until key options are understood and further targeted search has low decision value; report unverified coverage as `RESEARCH_INCOMPLETE`. Discuss one decision-changing question at a time, preserve already answered facts and keep `DESIGN_READY` independent of `ACTION_AUTHORIZED`. Reuse the existing development brief Skill conditionally; no new router, mandatory questionnaire, status database, version bump or test hold bypass. Source review: `docs/research/intent-research-readiness-source-review-2026-11-13.md`.
