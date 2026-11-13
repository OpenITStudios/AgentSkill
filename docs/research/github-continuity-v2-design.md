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
