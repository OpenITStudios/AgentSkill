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
