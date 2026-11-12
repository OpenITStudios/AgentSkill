# Consolidation Ledger — OpenITStudios Legacy Research

**Date:** 2026-11-13. **Status:** SOURCE_REVIEWED patterns only; no claim that the inherited rules were deployed or model-evaluated. This ledger tracks **adapted generic ideas**, not verbatim imports or blanket migration of project policies.

## Public source provenance

The source repo/ref SHA below identifies the exact snapshot inspected during consolidation. Individual paths remain owned by their original repositories; this public ledger contains no private-code excerpt. Where newer branch heads exist, re-evaluate before making a source-specific assertion.

| Public source (ref@SHA) | Primary source inspected | Selected transferable pattern | Canonical AgentSkill owner |
| --- | --- | --- | --- |
| [M-LazyDesigner](https://github.com/OpenITStudios/M-LazyDesigner/tree/994fe868740634c9722442b734ce973079add1a1) (`Local`) | `docs/04-system/ai-context-loading.md`, `prompt-cache-and-compaction.md`, `skill-taxonomy.md` | progressive context, evidence freshness, phase isolation, method lenses | `context-and-session-continuity.md`, `decision-routing-and-ownership.md`, `engineering-and-review-methods.md` |
| [M-Lazy-Developer](https://github.com/OpenITStudios/M-Lazy-Developer/tree/64533d95ef7eb17ca398a8fab3ba4fc73dfa03d5) (`Local`) | `.agents/skill-registry.json`, `.agents/evals/manifest.json`, `docs/system/skill-routing.md`, supply-chain/evidence notes | one active lane, permission separation, frozen evals, proof cost | `decision-routing-and-ownership.md`, `evaluation-and-improvement.md`, `tool-contracts-and-reliability.md` |
| [M-DanaIndonesiana](https://github.com/OpenITStudios/M-DanaIndonesiana/tree/ce9d372d0be2ac7194e494f0312a203fb344eac8) (`develop`) | `docs/skills/agent-rules.md` | concise decision packet, one fact owner, progressive context, UNKNOWN_OUTCOME, cost-to-accepted-result | `context-and-session-continuity.md`, `handoff-and-state.md`, `evaluation-and-improvement.md` |
| [LazyPrompting](https://github.com/OpenITStudios/LazyPrompting/tree/5816a9cd553d53a4542927d362a50593e366442d) (`Local`) | `AGENTS.md`, `docs/governance/permission-evaluation.md`, `docs/governance/cross-repo-reuse.md` | capability ≠ authorization, session continuity, safe transfer and no unattended chat UI scraping | `tool-contracts-and-reliability.md`, `permission-and-security.md`, `handoff-and-state.md` |
| [M-TranslateIT](https://github.com/OpenITStudios/M-TranslateIT/tree/69160b132cda3e9fdc689624461cfdff4559631b) (`Local`) | `.agents/skill-registry.json`, root operating rules | registry for classification, not a second Skill procedure owner | `decision-routing-and-ownership.md` |
| [M-Minecraft-Emulator](https://github.com/OpenITStudios/M-Minecraft-Emulator/tree/f24a1aad133ad80eb15d779545805769eca492f4) (`Local`) | root routing and GitHub execution boundaries | distinguish source/static proof, executed source and real target acceptance | `evidence-and-recovery.md`, `tool-contracts-and-reliability.md` |

Some additional **private** owner repositories were inspected for generic patterns such as activation collisions, path permissions, staged handoff, visual proof and branch holds. **Names, links, source excerpts, internal implementation details and confidential workflows are intentionally excluded from this public ledger**; no private file was copied into AgentSkill.

## Adopted architecture decisions

| Pattern | Decision | Reason |
| --- | --- | --- |
| Large per-repo root rules | Replace shared clauses with short universal root and conditional modules | avoid drift and duplicated authority |
| Many independently selected sub-agents | One primary semantic owner; specialists provide bounded handoffs | reduce conflicting routing and side effects |
| Mandatory eight engineering methods | One compact baseline + optional lenses | no installed-plugin assumptions or unnecessary context |
| Prompt-cache/context tricks | Stable reusable prefix; evidence-based dynamic tail; no unmeasured token claim | host-neutral correctness |
| Rich stage/skill taxonomies | Portable semantic selection rules; **domain taxonomy stays local** | universal standard without imposing asset-specific details |
| Frozen evaluation and permission cases | Central normative L0–L3 examples; actual host trials remain separate | honest proof ceiling |
| Parallel status/backup folders | One canonical source per fact + small recovery checkpoint | avoid contradictory state |
| Automated multi-repo rollout | **Not adopted**; staging+hash parity and separately authorized project migrations | respect branch and test holds |

## Explicitly not centralized

- Minecraft building procedures, asset geometry/UV/texturing/animation recipes, game rules, finance calculation semantics, voice production, UI style tokens, device-specific instructions and product source code.
- Private repo paths, CI status, repository-specific branch policies, pause/hold exceptions, customer files and credentials.
- Third-party prompt dumps, vendored proprietary text, host-internal tooling, automatic plugin installation, multi-agent daemons, browser scraping or unverified deployment automation.

## Missing proof

The integration is a **source-level semantic consolidation**. It is not evidence that Codex/OpenCode loaded every instruction or that a product behaves better. Run L0 static validation on AgentSkill when available; later run authorized target-specific instruction resolution, baseline/candidate behavioral evaluation and product-native acceptance separately.
