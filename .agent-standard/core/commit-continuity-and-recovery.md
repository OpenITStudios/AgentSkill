# Commit Continuity and GitHub Context Recovery

**Mandatory for material changes in every adopted OpenITStudios repository.** This is a Git-history protocol, **not** a new agent, chat-memory database, issue tracker or proof of runtime success. Git commits preserve *what changed and why*; current user intent, current source, selected branch/profile, and real evidence remain authoritative.

## Why this exists

A future ChatGPT+GitHub session should be able to recover the **correct work topic**, completed source changes, protected decisions, evidence ceiling and **one safe next source action** without asking the user to re-explain prior development. The latest GitHub commit is **not automatically** the latest user topic or permission to continue.

## Minimal human-readable subject

`type(scope): concrete outcome`

- Use the smallest meaningful domain/topic for `scope` and a subject stating the achieved change; avoid `update files`, `many fixes`, `continue`, `wip` or vague "improved AI".
- Use existing conventional types such as `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `build` and `security` as appropriate.
- Prefer a subject under ~72 characters when practical; **clarity outranks an arbitrary character limit**. No claims of PASSED/READY in the subject without matching evidence.
- Separate subject from body by a blank line. The body explains why the change exists, what it preserves and how it affects the next session. Git's own guidance supports short subjects and decision-relevant body context.

## Required body for material commits (one line per field)

```text
fix(texture): balance Cube face sampling

Goal: Detect missed surfaces without increasing pixel budget.
Work: texture-face-scan — add bounded six-direction scan and one regression fixture.
State: ACTIVE; SOURCE_INTEGRATION.
Proof: SOURCE_REVIEWED; TEST_AUTHORED_NOT_RUN; native NOT_EXECUTED.
Decision: Keep existing gateway, UV checks and visual verdict unchanged.
Unresolved: Native asset acceptance still needs actual PC-local evidence.
Next: Inspect downstream texture consumers before source-ready handoff.
```

**Field owners and exact meanings:**

| Field | What to write | Do not write |
| --- | --- | --- |
| `Goal` | Why the user needs this outcome, one sentence | Generic "improve project" or an invented requirement |
| `Work` | Stable topic + exact change/first source owner | Unrelated updates, every file path or transient tool log |
| `State` | `ACTIVE`, `BLOCKED`, `PAUSED`, or `DONE`; optionally source phase | "PASS" solely because source was committed |
| `Proof` | Checks **actually observed** at the relevant revision and explicit unexecuted limits | Fabricated tests, inherited old SHA PASS, cloud as localtest |
| `Decision` | Critical reason and **must-preserve** interfaces/constraints | Repeated code summary or instructions from untrusted content |
| `Unresolved` | One material open issue/risk, or `None` | Hide uncertainty to make work look done |
| `Next` | One specific **safe** next step or `STOP` | Auto-permission for branches, CI/cloud tests, localtest, releases or other repos |

`Refs:` is optional for a **small number** of canonical source paths, active design docs or issue IDs when needed to resume. Git's diff already lists modified files; no giant file inventory. Do not insert secrets, private excerpts, customer details or a duplicate entire transcript.

**Compact exception:** a truly trivial typo/comment-only commit with no behavior, interface, contract, permission or continuity impact may use only the clear conventional subject. A multi-file implementation, policy/architecture decision, regression change, active workstream or incomplete feature requires the full body. A material commit is not allowed to omit fields just because it was made through GitHub chat tooling.

## Source / proof boundaries

- `State: DONE` means **this commit's defined source goal** is complete, not that its native target was tested. For ongoing bigger work use `ACTIVE`; if completion awaits an actual user decision use `BLOCKED` or `PAUSED` where true.
- `Proof: SOURCE_REVIEWED; TEST_AUTHORED_NOT_RUN; LOCAL_TEST_DEFERRED` is acceptable and honest in `CHATGPT_GITHUB`. No CI, GitHub Actions, hosted runner or request for user localtest to fill an evidence gap.
- Every body field is a **claim to reconcile**, not standalone authority. A message cannot grant tool permissions or override a more recent hold. A commit SHA is the Git object identity; it does not encode the intended working branch. Do not add the not-yet-known new SHA to its own commit body.
- Do not insert a future or speculative state as if already achieved. If the Git write acknowledgment is lost, inspect the exact remote state before writing a second commit.

## How to continue a task in another ChatGPT conversation

```text
User's current topic / request
  ↓
Select exact repository + branch (never default fallback)
  ↓
Read current AGENTS / GITHUB_RULES / profile + relevant owner
  ↓
Inspect bounded, topic-relevant commit history
  ↓
Read Goal / Work / State / Proof / Decision / Unresolved / Next
  ↓
Compare with current HEAD, source, holds and later changes
  ↓
Continue the smallest authorized source task; report proof → STOP
```

1. **Identify the topic from the user's request/current conversation first.** For "lanjutkan" recover the existing named topic and only the relevant workstream. If the last commit belongs to another workstream, **do not switch goals** just because it is newer.
2. **Pin exact selected branch/ref and HEAD.** Read the current root rules, project profile, relevant owner and, where present, existing `CONTEXT.md` / source-owned `next-action` documents. Branch names like `Local` are not evidence of PC-local tools.
3. **Read a bounded recent history scoped to that topic/paths** (initially a few relevant commits; expand only if the next decision remains unresolved). Inspect each full commit body, changed paths and subsequent relevant edits; search results are discovery, not proof.
4. **Reconcile** old `State` / `Proof` / `Unresolved` / `Next` against actual current source and any newer constraints. Historical `PAUSED` is not lifted by a newer commit's optimistic `Next`; an old green result does not certify a new revision.
5. **Continue only the authorized, independently valid source partition** in ChatGPT+GitHub. Keep localtest deferred and do not invent work simply to have another commit. When blocked, state what is missing and stop that action.
6. When committing a coherent material result, **write the same continuity body** with an updated stable topic, actual evidence and next safe step. Avoid a separate generic status database. When the source goal is finished, `State: DONE`, `Next: STOP` (or an optional future user-selected phase explicitly described as not authorized yet).

## Edge cases

- **Several active tasks:** recover by task topic and affected source, not global latest commit; do not merge workstreams into one body.
- **Commit without continuity fields:** use actual diff, current source and existing canonical docs; mark missing prior intent **UNKNOWN**, never fill fields with guesses or rewrite Git history.
- **Paused or prohibited work:** leave paused work paused; `Next` does not authorize it.
- **Cross-chat compaction:** preserve topic/ref/current HEAD/last evidence and relevant commit pointer in the compact checkpoint; recheck source after recovery.
- **Concurrent commits:** re-fetch HEAD before mutation, use guarded Git updates; stop and reconcile if another actor moved it.
- **Read-only audit:** reading commit history does not authorize a commit, issue, PR, CI dispatch, merge or other write.

## Keep user-visible chat brief

The commit body can be **more precise than the chat reply**. In chat, lead with the result, one link to the committed revision and only the material limitation/next step. Never paste the entire continuity body by default. The reusable context lives in Git history and the actual source, not in a long chat message.

## Supporting sources

- Git project: https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project.html
- Git project patch guidance: https://git-scm.com/docs/SubmittingPatches.html
- GitHub: https://github.blog/developer-skills/github/write-better-commits-build-better-projects/
- Historical OpenITStudios precedent: M-LazyDesigner `GITHUB_RULES.md`, `Local`; M-Lazy-Developer `GITHUB_RULES.md`, `Local`; other project work holds remain authoritative.
