# OpenITStudios Repository Root Layout — Read-Only Cross-Repo Audit

**Date:** 2026-11-13 · **Source work:** `CHATGPT_GITHUB` · **Status:** source-only inventory and standard synthesis; no PC-local validation, CI, file moves, or product writes.

## Coverage and verification boundaries

A connector-visible inventory returned **15 OpenITStudios repositories**: fourteen project repositories and AgentSkill. Root entries were read from the user-relevant working branch when established (`Local` in most projects, `chatgpt-dev` in the Blockbench example, and the actual observed working branch for the finance example). Related READMEs, agent guidance and `.gitignore` were reviewed selectively in representative repositories; **not every subdirectory or runtime consumer was exhaustively inspected**.

The public standard records only public-repository examples and aggregate patterns. Privately visible repositories were consulted for the cross-project taxonomy, but **no private source content, identifiers, paths, or business details are copied into this public research note**. A read-only GitHub tree does not establish the actual user's PC, test pass, tracked/ignored status for arbitrary unseen files, or safe migration.

## Public project examples

| Public source and selected branch | Root practice supported by source |
| --- | --- |
| [M-LazyDesigner / Local](https://github.com/OpenITStudios/M-LazyDesigner/blob/Local/README.md) | Explicit repository root policy: root as navigation facade, owner mapping, special filenames preserved, no automatic moves |
| [M-Lazy-Developer / Local](https://github.com/OpenITStudios/M-Lazy-Developer/blob/Local/README.md) | One responsibility per root file; domain source and working artifacts use canonical directories |
| [M-TranslateIT / Local](https://github.com/OpenITStudios/M-TranslateIT/blob/Local/README.md) | Stable root documents distinguish product orientation from current planning; tooling, runtime and private data have different owners |
| [M-Minecraft-Emulator / Local](https://github.com/OpenITStudios/M-Minecraft-Emulator/blob/Local/README.md) | Thin root launcher/entrypoints may be necessary; local builds and evidence are not automatically public source |
| [M-DanaIndonesiana / Local](https://github.com/OpenITStudios/M-DanaIndonesiana/blob/Local/README.md) | Document-first domain structure is valid; a repo without extensive app tooling does not need a synthetic `src/` |
| [LazyPrompting / Local](https://github.com/OpenITStudios/LazyPrompting/tree/Local) | Multiple project entry and toolchain directories can be valid when required by their existing owner |
| [AgentSkill / main](https://github.com/OpenITStudios/AgentSkill) | Shared rules, source-pinned methods, normative evaluations and reference documentation remain separately owned |

## Findings that can change the design

- The roots are **not uniform by language, lifecycle or product**. A rigid whitelist or mandatory `src/`, `tests/`, `CHANGELOG.md`, `LICENSE`, `CONTEXT.md` and `DEV.cmd` template would create false violations.
- Strong projects already distinguish root **navigation**, toolchain contracts, application/domain source, local/private data, distribution and test artifacts. Preserve these distinctions.
- Some root/near-root launcher, configuration and output names are tied to actual tool/framework and product semantics; appearance alone does not prove an incorrect location.
- Existing local/private runtime boundaries and ignored build caches must not be copied into the shared public standard. Whether a particular output is safely disposable requires its project-specific retention and consumer contract.
- A root cleanup that breaks imports, scripts, native builds, packaging, GitHub workflows, saved assets or deep links is a **regression**, not an improvement.

## Design choice and excluded approaches

**Selected:** [Repository Root Layout Standard](../standards/repository-root-layout.md) — one conditional policy for placement, ownership, exceptions and authorized migrations.

**Rejected:** one fixed root tree for all repos; root file count quotas; blanket lowercase renames of framework names; moving every `outputs/` folder into ignored cache; creating placeholder dirs just for cosmetic parity; automatic 15-repo cleanup; adding another global root checker without a reproducible concrete failure.

## Evidence and next boundary

This audit establishes **source-visible layout patterns only**. It does not establish completeness of every code/config consumer, on-disk ignored data or a tested layout migration. All production repositories remain unchanged. Evaluate a proposed actual root move only after a separate per-project authorization and selected-branch/HEAD/consumer inspection.

**STOP:** the common source standard and central adoption reference are documented; additional research or automatic rearrangement is not part of this task.
