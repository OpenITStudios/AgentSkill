# Original Upstream Skill Authenticity — REA & UI UX Pro Max

**Audit date:** 2026-11-13. **Surface:** read-only publisher GitHub inspection in ChatGPT + GitHub. **Scope:** actual original source identity and *bounded* old/new Skill + directly relevant reference comparisons, not installation or execution on the user's PC. No installers, external scripts, tools, tests, CI or cross-repository mutations ran. Source observations and Git object SHA are evidence of inspected repository bytes, not that any agent loaded those bytes.

## 1. Source provenance and identity

| Property | REA | UI UX Pro Max |
| --- | --- | --- |
| Publisher-owned repository | [`morluto/rea`](https://github.com/morluto/rea) | [`nextlevelbuilder/ui-ux-pro-max-skill`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |
| Reviewed canonical Skill | [`.agents/skills/reverse-engineer-anything/SKILL.md`](https://github.com/morluto/rea/blob/54906fdb1fc735b507961b2954f6968775cae4f6/.agents/skills/reverse-engineer-anything/SKILL.md) | [`.claude/skills/ui-ux-pro-max/SKILL.md`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6ae86f61f520d6ca229d2f40e070410638c908c5/.claude/skills/ui-ux-pro-max/SKILL.md) |
| Previous reviewed commit | `560674e2de851cec3f670be8297d28835009247a` | `b7d5353e0130feb8c5574ef1251f8a1db1873ccb` |
| Current reviewed upstream HEAD | `54906fdb1fc735b507961b2954f6968775cae4f6` | `6ae86f61f520d6ca229d2f40e070410638c908c5` |
| Previous Git blob | `b98687ef390d7801a60a3804cf5cf726c44381d8` | `23cdf0466e10ed460627ca9c0a68984b1a6bf98b` |
| Current Git blob | `baea9f529b572dd28a72d874f192a75c426b845e` | `2cacc8756e816a1eb6bfa44307372f2aeb445902` |
| Publisher license | MIT (2026 morluto); separate third-party notices/tool licenses remain | MIT (2024 Next Level Builder) |
| AgentSkill state | `REFERENCE_ONLY`; exact source path reviewed | `REFERENCE_ONLY`; exact source path reviewed |

**Publisher identity checks:** REA's own README identifies `morluto/rea`, `rea.tools` and `rea-agents` as its distribution channels and warns that similarly named/copy repositories are not proof of official origin. UI UX Pro Max's own README identifies `nextlevelbuilder/ui-ux-pro-max-skill`, the `ui-ux-pro-max-cli` package and the `uipro` installer. References were read from those repositories, not from third-party mirrors or copies.

## 2. Original-source semantic changes reviewed

### REA

Between the two exact original `SKILL.md` Git blobs, 549 → 609 lines, roughly **86 added / 26 removed lines** under a line-wise comparison. The frontmatter metadata changes `version: "60"` → `"62"`; it is **upstream Skill metadata**, not AgentSkill's package version.

Relevant additions include:

- New scoped workflow for Linux desktop application environments from a request, with a required [desktop-build reference](https://github.com/morluto/rea/blob/54906fdb1fc735b507961b2954f6968775cae4f6/.agents/skills/reverse-engineer-anything/references/desktop-build.md). This reference requires its own permitted MCP tools, Linux/Docker build environment, and evidence. **Not available merely by reading it.**
- New static inspection cases (Deno compile artifacts, Windows shortcuts, native initializers/ELF unwind ranges, Linux kernel build config) and more precise Go and EVM evidence contracts.
- Added exposure assessment for shipped applications, but the Skill states that this does **not** establish application security.
- Documentation paths were relocated under structured guide directories; using old doc paths without checking is unsafe.
- Explicit separation of REA Skill-only installation, MCP server registration, actual providers and real tool schemas. A newer upstream Skill can describe tools missing from an older installed server.

**Decision:** source provenance updated to the reviewed original `54906fdb` in AgentSkill's method registry. No attempt is made to mirror 609 lines as a substitute for the original Skill, enable a REA MCP host, add a provider or claim REA tools were used. Target-specific REA capabilities remain unverified.

### UI UX Pro Max

The publisher-owned `SKILL.md` has **the same 218-line structure**, with only three changed lines: descriptions and the reference count change **119 → 120 UX guidelines**. The matching original source changes are independently present in:

- [`data/ux-guidelines.csv`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6ae86f61f520d6ca229d2f40e070410638c908c5/.claude/skills/ui-ux-pro-max/data/ux-guidelines.csv): a new `IME Composition Enter` guideline for Korean/Japanese/Chinese input.
- [`references/quick-reference.md`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6ae86f61f520d6ca229d2f40e070410638c908c5/.claude/skills/ui-ux-pro-max/references/quick-reference.md): an `ime-composition-enter` entry.
- `references/pro-rules.md` was unchanged at the compared revisions.

The upstream Skill's actual workflow calls its bundled Python search tool and queries data by outcome/domain/stack; it **does not** become operational when a generic "UI UX Pro Max" summary is written in another repository.

**Decision:** reference provenance updated to reviewed original `6ae86f61`. No local `uipro` installation, full data copy, code execution or proven host UI review was performed. A project may use publisher-owned `uipro init --ai universal` or platform-specific installation only as a separate approved host action, and then verify real installed assets and effective loaded paths.

## 3. Original-source acceptance gates

1. **Original source:** validate publisher-owned repo and exact revision/path/blob, not a cloned README or lookalike skill name.
2. **Full installation:** check actual target host path and required assets/scripts/tools, whether byte-identical source or documented publisher-owned installer transformation; do not infer from this GitHub report.
3. **Host instruction loading:** confirm actual loaded Skill path/host version and absence of shadowing or higher-priority restriction conflicts.
4. **Runtime capability:** check real MCP/CLI/server schemas, provider/tool dependencies and permissions when relevant.
5. **Task usage:** only claim the original Skill was used when real host evidence shows its activation/commands/output at the correct revision.

In a ChatGPT+GitHub source session, **only step 1 is supported by this audit**. It does not certify steps 2–5, local-PC tests, native UI quality or binary analysis. The central `registry/methods.json` entries remain `POLICY_ADAPTED_SOURCE_ONLY`, not executable original Skills.

## 4. No destructive adoption

- Do not install third-party Skills in AgentSkill merely to claim authenticity, and do not overwrite existing project agents/Skills, nested instructions or branch/test holds.
- No automatic download, npm/skills.sh installer, MCP registration, provider installation, CI run or hosted substitute.
- When future per-project adoption is explicitly authorized, verify the exact working branch/HEAD, local skill contents and official publisher installation path before mutation. A publisher Skill may have host-specific transformations; document them rather than claiming byte-identical provenance without proof.
- This audit is complete at `SOURCE_REVIEWED` level only. Source-file reads do **not** show that an original Skill was installed or exercised.

## First-party documentation

- [REA original repository README](https://github.com/morluto/rea/blob/54906fdb1fc735b507961b2954f6968775cae4f6/README.md), [installation guide](https://github.com/morluto/rea/blob/54906fdb1fc735b507961b2954f6968775cae4f6/docs/getting-started/installation.md), [MIT license](https://github.com/morluto/rea/blob/54906fdb1fc735b507961b2954f6968775cae4f6/LICENSE).
- [UI UX Pro Max original repository README](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6ae86f61f520d6ca229d2f40e070410638c908c5/README.md), [MIT license](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/6ae86f61f520d6ca229d2f40e070410638c908c5/LICENSE).

