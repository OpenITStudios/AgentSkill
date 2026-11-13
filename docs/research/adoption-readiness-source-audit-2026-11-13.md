# Read-Only Adoption Readiness Audit — 2026-11-13

**Scope:** 14 OpenITStudios project repositories inspected through the selected working branches, **read-only**. These checks establish visible file structure and initial migration risks, **not** successful adoption, active CI status, host instruction loading or runtime/model behavior.

## Inventory (observed)

| Structural check | Observed |
| --- | ---: |
| Repository root `AGENTS.md` | **14 / 14** |
| Repository root `GITHUB_RULES.md` | **12 / 14** |
| Central AgentSkill portable core installed | **0 / 14** |
| Local `.agent-standard/profile.json` installed | **0 / 14** |
| Local `.agent-standard/methods.json` installed | **0 / 14** |
| Existing root main-domain Skills under `.agents/skills/` | **55** across the 14 projects |
| Existing current-status/continuity source candidate | **12 / 14** (path presence only) |

Each repository has its **own** existing rules. Their current content, nested `AGENTS.md`, branch policy, active holds and project Skills must be classified before replacing anything. A file count does not show whether the original policy is correct or whether a workflow executes.

## Public repository source examples

| Public project | Working source pinned | Migration observation |
| --- | --- | --- |
| [M-LazyDesigner](https://github.com/OpenITStudios/M-LazyDesigner/tree/994fe868740634c9722442b734ce973079add1a1) | `Local` at `994fe868` | Existing rich domain Skills/status source; native proof holds and nested AGENTS ownership must survive |
| [M-TranslateIT](https://github.com/OpenITStudios/M-TranslateIT/tree/69160b132cda3e9fdc689624461cfdff4559631b) | `Local` at `69160b13` | Existing Rules and multiple Skills; host-specific UI/audio data and testing must remain local |
| [M-Lazy-Developer](https://github.com/OpenITStudios/M-Lazy-Developer/tree/64533d95ef7eb17ca398a8fab3ba4fc73dfa03d5) | `Local` at `64533d95` | Many **nested `AGENTS.md`** files; directory-specific instructions and path ownership require an explicit preservation pass |
| [M-Minecraft-Emulator](https://github.com/OpenITStudios/M-Minecraft-Emulator/tree/f24a1aad133ad80eb15d779545805769eca492f4) | `Local` at `f24a1aad` | Smaller existing Skill footprint; candidate public-domain pilot for lossless rule migration |
| [M-DanaIndonesiana](https://github.com/OpenITStudios/M-DanaIndonesiana/tree/ce9d372d0be2ac7194e494f0312a203fb344eac8) | `develop` at `ce9d372d` | Explicit single-branch and test holds; private-project content restrictions must be preserved |
| [LazyPrompting](https://github.com/OpenITStudios/LazyPrompting/tree/5816a9cd553d53a4542927d362a50593e366442d) | `Local` at `5816a9cd` | Source-based continuity exists; current status and user-controlled ordinary-chat workflow cannot be overridden |

**Other eight repositories are private.** Only their aggregate counts contribute to the inventory. Their identities, branch names, internal paths, workflow code, policies and product-specific content are **intentionally not repeated** in this public report. Two of the fourteen repositories lack a root `GITHUB_RULES.md`; whether that is a design choice or a gap requires a private migration review. All 14 lack the central portable bundle.

## Observed limitations and migration risks

- **1:1 is not yet deployed** anywhere. Do not equate a shared policy on AgentSkill main with actual instruction loading in Codex/Claude Code/OpenCode in other repositories.
- **Nested instruction precedence:** blindly replacing root rules can silently drop directory-specific requirements. Enumerate current nested `AGENTS.md` first, classify and preserve each legitimate owner.
- **Branch and authority:** current selected branch differs among projects. Never default to `main`, create migration branches, or auto-promote a change.
- **CI/workflow visibility:** source files under `.github/workflows/` can exist even when a project forbids executing CI. File presence alone is not an active CI run, not a right to dispatch, and not runtime acceptance. **No GitHub Actions/cloud fallback**.
- **Current status:** 12/14 have a visible status/continuity candidate; some are long and historical. Reuse their *current active section* rather than creating a second status database.
- **Slash in branch names:** one available GitHub connector route rejected a URL path containing an encoded slash. Use **List branches + exact name match + pinned commit SHA** when direct branch lookup cannot express the selected ref. Do not silently switch branches, and handle pagination if branch list is incomplete.
- **Privacy:** never republish private source or protected project metadata into public AgentSkill to achieve a universal template.

## Controlled pilot order (proposal only)

1. **M-Minecraft-Emulator (public)** — inspect compatibility and preservation with small Skill count, **no writes** until its source owner explicitly authorizes adoption.
2. **M-DanaIndonesiana (public)** — validate evidence labels and branch/test holds without private project content.
3. **M-LazyDesigner (public)** — stress-test nested rules, long status docs, Skill routing and source/native proof separation.

This is a **read-only assessment and sequencing proposal**. Every future repo must first receive an explicit per-repo conflict mapping (`CORE / METHOD / DOMAIN / PROFILE-HOLD / HISTORY / CONFLICT`) and adopted-version SHA before any write. No source, branch, CI, hooks or project data were changed in these 14 projects.

## Next implementation gap

AgentSkill's source rules and optional snapshot consistency checker are authored. **Source-level structural audit** can be repeated through the GitHub connector, but 1:1 deployment, actual host instruction loading, behavior improvements and local-PC tests remain **NOT_EXECUTED / NOT_MEASURED**.
