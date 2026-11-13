# Legacy Method Migration — Source-Level Record

Reviewed 2026-11-13. Existing project restrictions and domain Skills are **not** replaced by central methods until separately authorized and reviewed. No private file content or internal project paths are published here.

| Historic rule | Central owner | Still local to the project |
| --- | --- | --- |
| Karpathy + Ponytail default coding standards | `.agent-standard/methods.json` + `engineering-and-review-methods.md` | Code owner, affected consumers, real tests |
| Pstack/Poteto conditional playbook | Method registry, conditional | Actual domain incident/architecture procedure |
| Harness² experiment method | Method registry + `evaluation-and-improvement.md` | Approved host, frozen baselines and measured receipts |
| DeepSeek Harness lifecycle principles | Method registry + `tool-contracts-and-reliability.md` | Current app/tool runtime |
| REA lawful opaque investigation | Registry + security/permission owner | Rights, target artifact and actual connected provider |
| UI UX Pro Max review | Registry + local visual Skill | Product style, design system and native preview |
| Matt Pocock engineering review | Registry + selected domain owner | Domain glossary, real module and review artifacts |

## Scope of comparison

Selected working-branch AGENTS and source docs were examined across the **14 project repositories** inventoried in the earlier AgentSkill audit. Several older root rules explicitly named eight reference methods; some named seven with Matt Pocock as an overlay; others centered domain procedures rather than listing the same methods. This **does not** mean unnamed methods were never applied in practice.

Public source examples:
- [M-LazyDesigner](https://github.com/OpenITStudios/M-LazyDesigner/blob/Local/AGENTS.md)
- [M-TranslateIT](https://github.com/OpenITStudios/M-TranslateIT/blob/Local/AGENTS.md)
- [M-Lazy-Developer](https://github.com/OpenITStudios/M-Lazy-Developer/blob/Local/AGENTS.md)
- [M-Minecraft-Emulator](https://github.com/OpenITStudios/M-Minecraft-Emulator/blob/Local/AGENTS.md)
- [M-DanaIndonesiana](https://github.com/OpenITStudios/M-DanaIndonesiana/blob/develop/docs/skills/agent-rules.md)
- [LazyPrompting](https://github.com/OpenITStudios/LazyPrompting/blob/Local/AGENTS.md)

## Migration classification

For each authorized future project adoption, pin its working branch/HEAD and classify old clauses as **CORE**, **METHOD**, **DOMAIN**, **PROFILE/HOLD**, **HISTORY**, or **CONFLICT**. Shared core and methods distribute 1:1. Domain procedures, workstream pauses, private data and branch/CI/localtest policy remain local. Verify actual loaded instructions separately from source parity.

No project repo has been migrated by this research-led method registry commit. External licenses must be reviewed before copying any upstream code or proprietary prompt text.

## Upstream publisher/source freshness inventory — 2026-11-13

**Read-only GitHub source observation.** This is research provenance, not evidence of installed/updated Skills or a blanket adoption. The pinned revisions in `registry/methods.json` remain the **last reviewed references**, not a promise that every latest upstream change was incorporated. Current HEADs were checked on the upstream's actual default branch.

| Method | Upstream repository | Pinned revision | Observed HEAD | Relevant recorded path |
| --- | --- | --- | --- | --- |
| Karpathy Guidelines | `multica-ai/andrej-karpathy-skills` (**community adaptation**, not Andrej Karpathy's official project) | `2c606141` | `2c606141` | HEAD unchanged |
| Ponytail | `dietrichgebert/ponytail` (project publisher) | `96608e07` | `96608e07` | HEAD unchanged |
| Pstack / Poteto | `cursor/plugins` (Cursor publisher) | `2776ddd2` | `6e359ce0` | Reviewed guide blob unchanged |
| Harness² | `google-research/harness2` (publisher) | `68688175` | `68688175` | HEAD unchanged |
| DeepSeek Harness | `deepseek-ai/deepseek-harness` (publisher) | `fcc0ad46` | `e8f7b93a` | Reviewed README blob unchanged; **923** intervening commits, larger compare incomplete |
| REA | `morluto/rea` (project publisher) | `560674e2` → **`54906fdb`** (source review) | `54906fdb` | Original `SKILL.md` diff reviewed; MCP/Skill installation **not verified**, new capabilities not adopted |
| UI UX Pro Max | `nextlevelbuilder/ui-ux-pro-max-skill` (project publisher) | `b7d5353e` → **`6ae86f61`** (source review) | `6ae86f61` | Original `SKILL.md` and new IME guideline source reviewed; installed Skill and Python search execution **not verified** |
| Matt Pocock | `mattpocock/skills` (author repository) | `4ae2317d` | `5863806d` | Reviewed code-review Skill blob unchanged |

**Limits:** A matching reviewed-file blob does not rule out related changes in other upstream files, dependencies or runtime behavior. The REA compare spanned 781 commits and exposed only the first 300 changed files; DeepSeek spanned 923 commits with a first-page 300-file limit. This table is a bounded spot check, not a complete review of all upstream changes. REA's changed description now includes Linux desktop app environments; UI UX Pro Max's description reflects 120 UX guidelines instead of 119. **Original upstream Skill source was reviewed and the two pinned REA/UI UX reference SHAs were updated in the AgentSkill method registry.** This changes reference provenance only: no upstream Skill files, MCP servers, search scripts or new capabilities were installed/adopted in any target repo.

**Process:** Check only the method selected for the task; compare the exact owned source path and relevant dependencies against the pinned reference. Record what changed and why, preserve all local Skills/agents and restrictions, then propose the smallest useful adaptation. Do not mistake a source HEAD change for an instruction to update automatically.


See [`upstream-original-skill-authenticity-2026-11-13.md`](upstream-original-skill-authenticity-2026-11-13.md) for first-party sources, exact source blob identifiers, audited deltas and installation-versus-execution evidence limits.
