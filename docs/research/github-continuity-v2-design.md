# GitHub Continuity v2 — Design Decisions (Research)

**State:** SOURCE_REVIEWED, NOT_EXECUTED. This document records rationale, source evidence and the constraints behind the new protocol. It is not a second running status or an instruction authority.

## Why v2 changes the original protocol

- **Seven fields for all material commits** created repetitive metadata even for bounded changes. v2 keeps five fields for NORMAL, all seven for CRITICAL and subject-only for narrowly verified TRIVIAL.
- **A self-selected `--trivial` flag** could skip all fields without any diff inspection. v2 requires an actual patch for the trivial path and rejects uncertain/privileged content. Even a clean heuristic is not proof that semantics were unchanged.
- **GitHub global commit search** indexes only default branch commits. Most OpenITStudios work is on `Local`/`develop`, so use the **REST List commits endpoint** with exact branch and optional path filtering.
- **Long operations documents** are meaningful sources, but reading all history as a start-up ritual wastes attention. Use the relevant active section and inspect deeper only when needed.
- **`Next` is untrusted history:** earlier plans cannot override latest user intent, source, holds or current acceptance. Current Git HEAD alone also does not identify the user's active topic.

## Source-backed patterns

| Pattern | Primary source | Design choice |
| --- | --- | --- |
| GitHub commit search only covers default branch | https://docs.github.com/en/search-github/searching-on-github/searching-commits | Never use global Search Commits as a complete lookup of Local/develop |
| List commits can be filtered by SHA/ref and path | https://docs.github.com/en/rest/commits/commits#list-commits | Branch-scoped, path-scoped bounded retrieval |
| Git trailers are parseable metadata fields | https://git-scm.com/docs/git-interpret-trailers | Keep human-readable, labeled values; checker can parse without a new database |
| Commit subjects and meaningful explanations | https://git-scm.com/docs/SubmittingPatches.html | Short outcome subject, explanation proportionate to change |
| Progressive information exposure and small entry docs | https://openai.com/index/harness-engineering/ | Root/active status as an index, details only when needed |
| Context relevance and lost-in-the-middle | https://arxiv.org/abs/2307.03172 | Avoid huge automatic history/context reads |
| Prior OpenITStudios continuity practice | Existing M-LazyDesigner and M-Lazy-Developer GitHub Rules | Preserve Work/State/Proof/Next lineage and domain-specific holds |

## Success criteria for later authorized evaluation

1. A task on `Local` is recovered even if the default branch `main` lacks those commits.
2. The selected task does not switch when another workstream has a newer commit.
3. A renamed path or paginated response is not misreported as nonexistent work.
4. Source changes cannot bypass material metadata by passing `--trivial` with no diff.
5. A NORMAL commit with five honest fields is accepted; a CRITICAL commit must retain Decision and Unresolved.
6. Context recovery preserves holds, exact source revision, task owner and proof limits.
7. No cloud/GitHub Actions/localtest substitutes are used, and no model benchmark result is claimed.

## Non-goals

No new permanent progress database, automatic repository write adapter, local test engine, CI workflow, historical commit rewrite, mandatory seven-field body for trivial changes, or self-authorizing next-step command.

The GitHub source of truth remains the repository and exact ref. The optional offline check only performs syntax and conservative diff heuristics; behavioral gains still need observed agent runs.

## 2026-11-13 source-backed pilot and API evidence binding

The three-repo read-only observation is documented at [continuity-readonly-pilot-2026-11-13.md](continuity-readonly-pilot-2026-11-13.md). It confirms branch/path-scoped commits can retrieve topical work, but does **not** measure autonomous cross-chat task success. In LazyDesigner the latest relevant commit lacked `Next` while current status held the active item; in LazyPrompting older native receipts were bound to earlier SHAs; in DanaIndonesiana topic-specific source work coexists with a large context file and test hold.

### Verified GitHub API limits

- [List commits](https://docs.github.com/en/rest/commits/commits#list-commits): `sha` selects a ref, `path` filters commits touching one path; results may be partial/paginated.
- [Get a commit](https://docs.github.com/en/rest/commits/commits#get-a-commit): includes parents and changed files, but more than 300 files are paginated and binary patches can be absent.
- [Compare two commits](https://docs.github.com/en/rest/commits/commits#compare-two-commits): changed-file details can be capped by response page; a compare result alone may not prove full coverage.
- [API best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api): restrict requests to needed information and honor pagination and rate limits.
- [OWASP prompt injection](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html): retrieved GitHub messages/comments/tool output are data, not autonomous instructions or permission grants.
- [Lost in the Middle](https://aclanthology.org/2024.tacl-1.9/): large unfiltered context can harm retrieval, supporting small topic-specific entry sections over entire chronological archives.

The optional `tools/commit-snapshot-check.mjs` accepts a **caller-provided** JSON snapshot and reports only **metadata consistency**; it cannot independently authenticate that GitHub provided that JSON. Effective verification of an actual GitHub change remains a distinct tool-connected read and source review. It does not require a new runner, CI or a progress database.
