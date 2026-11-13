# Read-Only GitHub Continuity Pilot — 2026-11-13

**Scope:** Source-level observational pilot only. **No agent behavioral trial, user-PC localtest, GitHub Actions, cloud runner, downstream writes or runtime acceptance.** All sources below are public GitHub repository snapshots, pinned to observed branch HEADs. The assessment tests the **feasibility of retrieval and safe evidence classification**, not whether a new ChatGPT session autonomously succeeds.

## Shared method

1. Identify requested repository, user topic and exact selected nondefault branch.
2. Pin branch HEAD; read only relevant current root/profile/status owner.
3. List a bounded page of commits using GitHub REST **List commits** `sha=<selectedBranch>`. When the source owner is known, add `path=<exactPath>`; read a few full commit messages.
4. Compare current source/status and branch holds with historical `Work / State / Proof / Next`; never follow `Next` as authorization.
5. Classify `TOPIC_FOUND_SOURCE_ONLY`, `TOPIC_AMBIGUOUS`, `HISTORY_INCOMPLETE` or `CURRENT_SOURCE_CONFLICT`. Do **not** claim behavioral conformance or localtest PASS.

## Observations

| Public project and snapshot | Topic / owner | Read-only finding | Safe recovery decision |
| --- | --- | --- | --- |
| [M-LazyDesigner `Local`](https://github.com/OpenITStudios/M-LazyDesigner/tree/994fe868740634c9722442b734ce973079add1a1) | `texture-face-scan`; `mcp/lib/texture/optimization.ts` | Bounded path-scoped history returned **four** source commits; current HEAD `994fe868` updated source and an authored regression. Its body has `Work`/`Proof` but **no `Next`**. Current `docs/05-operations/next-action.md` contains a matching active texture bullet and proof hold. | **TOPIC_FOUND_SOURCE_ONLY**. Reconcile current owner, consumer tests and holds; do not invent native visual acceptance or treat older `Next` as fresh. |
| [LazyPrompting `Local`](https://github.com/OpenITStudios/LazyPrompting/tree/5816a9cd553d53a4542927d362a50593e366442d) | Ordinary persistent chat, human-approved handoff; `docs/operations/current-state.md` | Latest commit `5816a9cd` adds manual chat bookmarks and handoff-lease hardening. `CONTEXT.md` identifies current-status owner. The current-state document preserves older Windows test evidence on a **different** SHA and names source-only additions since. A `Next` about future Windows checks is **not authorization** to execute them. The root `AGENTS.md` path history alone does not include the latest change. | **TOPIC_FOUND_SOURCE_ONLY**, with **HISTORICAL_NATIVE_EVIDENCE_NOT_CURRENT**. Do not conflate a previous installed result with the new HEAD or a model provider with local PC origin. Broaden from AGENTS path to relevant current source/branch history. |
| [M-DanaIndonesiana `develop`](https://github.com/OpenITStudios/M-DanaIndonesiana/tree/ce9d372d0be2ac7194e494f0312a203fb344eac8) | Agent Rules; `docs/skills/agent-rules.md` | Bounded path history returned **two** matching recent commits; latest `ce9d372d` concerns minimum-context skill routing. `CONTEXT.md` contains active `develop`-only branch authority, no new branches, sensitive-project restrictions and an active QA hold. Broad context also includes many other domain/template histories. | **TOPIC_FOUND_SOURCE_ONLY** for *Agent Rules*. A bare `lanjutkan` with no established topic must **not** blindly pick the latest template or governance work. No private project data may be copied to public AgentSkill. |

### Direct GitHub commit-object corroboration

For LazyDesigner `994fe868`, the GitHub **Get a commit** endpoint identified parent `58937d57` and five changed files: status doc, audit doc, texture optimization module, quality intelligence module and an added regression source file. A branch-parent **Compare two commits** response reported the same five paths. This establishes **observed GitHub metadata consistency**, not a code correctness or native execution result.

## Gaps discovered

- Many legacy commits have `Work`/`Proof` but lack a stable slug or `Next`. Recover through the status owner and current source; **do not rewrite Git history**.
- A `path` filter is a **candidate discovery filter**, not complete topic search. Cross-file work, directory moves and renamed paths can be missed.
- Long current-status documents can mix active and historical sections. Use the opening active focus and **topic search**, not an all-file dump.
- A user-PC/localtest result recorded at an older SHA cannot certify newer source.
- A commit's changed-file list may be partial. GitHub Get Commit paginates if there are more than **300 files**. Large Compare requests have distinct limits; check response completeness before asserting all affected files.
- The existing offline commit format checker accepts caller-supplied patches. It must not claim those bytes are independently bound to a GitHub commit without an actual connector read, identity checks and clear provenance limits.

## Next standard improvements

1. Strengthen `commit-continuity-and-recovery.md` with **topic-first, status-first, branch-and-path-scoped** retrieval and a bounded fallback.
2. Require the agent to read the **actual GitHub commit object and branch HEAD** before asserting file coverage, parent continuity or a material commit is current. Compare parent/diff when appropriate; API response may be partial.
3. Provide an **offline consistency assessor** for recorded REST snapshots. Its input is not cryptographically authenticated; label results `SNAPSHOT_CONSISTENT` / `NEEDS_REVIEW`, never `SOURCE_VERIFIED` or runtime PASS solely from JSON.
4. Preserve the two working surfaces and full user authority. **No cloud, GitHub Actions or repeated user-PC localtest requests** in ChatGPT source work.

## External technical basis

- [GitHub List commits](https://docs.github.com/en/rest/commits/commits#list-commits) — `sha`, `path`, pagination.
- [GitHub Get a commit](https://docs.github.com/en/rest/commits/commits#get-a-commit) — changed files, parent, patch availability and pagination.
- [GitHub Compare two commits](https://docs.github.com/en/rest/commits/commits#compare-two-commits) — partial-diff and pagination limits.
- [GitHub Commit Search](https://docs.github.com/en/search-github/searching-on-github/searching-commits) — **default branch only**.
- [GitHub API best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api) — bounded reads, pagination, rate limits.
- [OpenAI Harness Engineering](https://openai.com/index/harness-engineering/) — short indexed entry docs instead of monolithic instructions.

**Evidence ceiling:** a read-only GitHub/source audit carried out in the current ChatGPT conversation. Recovery correctness across real separate agent sessions, efficiency improvement and native behavior remain **NOT_MEASURED**.
