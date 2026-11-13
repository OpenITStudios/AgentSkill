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
