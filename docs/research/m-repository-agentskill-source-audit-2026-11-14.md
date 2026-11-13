# AgentSkill M-Series Source Adoption — Aggregate Audit (2026-11-14)

**Source standard:** `OpenITStudios/AgentSkill`, branch `main`, commit `d726ee745a7b38bfadaff2a5475cd875f41d5bea` (`0.1.0-draft`).

**Scope:** the 11 repositories with names starting `M-` visible to the authorized OpenITStudios GitHub connection at review time. Their respective development refs and GitHub object identities were inspected directly. Individual repository identities, private commit metadata, target-specific hold details and product source are deliberately **not** reproduced in this public summary. Each target has its own exact source lock, local profile, historical root snapshots and Git commit receipts.

**Outcome:** `11/11 SOURCE_ADOPTION_OBSERVED`; **`0/11 HOST_BEHAVIOR_VERIFIED`**. `SOURCE_ADOPTION_OBSERVED` is a descriptive source-evidence conclusion, not a host installation or runtime validation result.

## Scope and evidence

| Check on the exact selected target ref | Source observation | Limit |
| --- | --- | --- |
| Package state | 11 of 11 contain `.agent-standard/standard.lock.json` with `status: ADOPTED`, source SHA above and 24 declared portable paths | Status field alone is not an execution or host receipt |
| Two root instruction files | 11 of 11 exact Git blob identities match upstream `AGENTS.md` and `GITHUB_RULES.md` | Matching bytes do not prove a ChatGPT session automatically loaded them |
| Shared core | All 15 canonical core policy file Git blob identities match upstream in 11 of 11 | No model routing result measured |
| Host adapters | All 3 adapter file Git blob identities match upstream in 11 of 11 | Codex, Claude Code and OpenCode effective instruction loading not examined on local hosts |
| Method registry | Canonical method registry Git blob identity matches upstream in 11 of 11 | The references are not automatically installed third-party Skills |
| Three shared governance Skills | All 3 `oits-*` Skill subtree Git identities match upstream in 11 of 11 | Host discovery/activation remains `NOT_VERIFIED` |
| Project domain Skills | The original domain Skill subtree names and Git tree identities remained unchanged on all 10 targets that already had domain Skills. One target had none before adoption | This preserves authored source, not runtime routing behavior |
| Historical rules | All 11 targets retain exact original root `AGENTS.md` and `GITHUB_RULES.md` Git blob identities, matched against the pre-adoption target commit | Archives are historical evidence, not parallel instruction authorities |
| Project-specific policy | 11 of 11 have a repository-local profile and `.agent-standard/project-policy.md` | Actual host reading of the local policy is not proven by file presence |
| Tests, CI, native/product verification | No test or GitHub Actions run was initiated as part of this audit | `NOT_EXECUTED`; preserved target-specific holds still apply |

**Portable package composition:** 2 root files + 15 core modules + 1 method registry + 3 host adapters + 3 shared Skills = **24** paths per target. Source-to-target Git blob identity and stored lock path counts were inspected. No complete permitted execution of the offline `standard.mjs verify` parity runner or host-level evaluation is claimed.

## Operational boundaries

1. Keep each repository's current working branch, profile holds, security classification, existing domain Skill routing and stable/release branch rules. Source adoption is not branch promotion or a package release.
2. Do not trigger CI, tests, agent benchmarks, native apps, or PC-local tools in ChatGPT/GitHub to manufacture successful acceptance; only the separately authorized real host can supply matching execution evidence.
3. During actual future work, read the target repo's root instruction files, `.agent-standard/profile.json`, the referenced `.agent-standard/project-policy.md`, and only the task-relevant owners/Skills. Neither a GitHub link nor an `ADOPTED` lock means the host loaded them automatically.
4. Distinguish `SOURCE_ADOPTION_OBSERVED`, `HOST_LOAD_NOT_VERIFIED`, `TEST_NOT_EXECUTED` and product acceptance. Preserve the current project's stricter rules and stop on a real conflict.
5. This is a fixed **dated evidence snapshot**, not a second central operations ledger or monitoring service. Target commits and on-ref profiles remain authoritative for each project. Re-pin before later work.

**Evidence ceiling:** GitHub source and object inspection only. No blanket behavioral parity, model benchmark, native QA, downstream installer, release, automated sync or automatic rollout is asserted.

## Follow-up: mandatory local policy loading (2026-11-14)

The initial adoption snapshot above refers to the original portable source `d726ee745a7b38bfadaff2a5475cd875f41d5bea`. A subsequent source-only correction closed a material startup ambiguity: the root `AGENTS.md` now expressly requires reading the actual target-local `.agent-standard/project-policy.md` before selecting a Skill or taking action. A profile note, archived prior root or source lock cannot substitute for the local policy's contents. Source SHA: `44ab44a981f5ad036643bd5df3bbfc5cd2402664`.

**Observed target reconciliation:** all **11/11** previously adopted target repositories were updated on their respective authorized development branches. Each follow-up GitHub commit has the observed preceding branch HEAD as its parent; the only changed paths are `AGENTS.md` and `.agent-standard/standard.lock.json`. On all 11 targets:

- Current branch HEAD agrees with the verified follow-up commit.
- Updated root Git blob identity matches the canonical AgentSkill blob `5642d7fc99b71447d62ab4c3a99deed155b796c9`.
- Lock `sourceCommit` is `44ab44a981f5ad036643bd5df3bbfc5cd2402664`; root SHA-256 entry is `ec1b33e8efefb156c020a735b6dd1d945c2fc7ace327152640d4d9076a03a18e`; all 24 portable paths remain declared.
- This follow-up did not change the other 23 portable source files, project-owned Skills, local profiles, holds, CI configuration, product code or archived original root policies. Earlier Git-object identity checks for those unchanged files remain applicable at these descendant commits.

**Current source conclusion:** `11/11 PORTABLE_SOURCE_PARITY_OBSERVED` at the revised canonical source SHA, with **`HOST_LOAD_NOT_VERIFIED`** and **`TEST_NOT_EXECUTED`**. The post-adoption edit and lock reconciliation are not model compliance, executed static tests, evidence of remote/cloud CI suppression, or native product acceptance. No installed host was driven or evaluated as part of this follow-up. This addendum is a fixed historical evidence receipt, not automatic future monitoring or a new registry.
