# Clear commit continuity — v2 examples

Illustrative text only; no tests or native runtime are claimed.

## TRIVIAL — a verified documentation typo

```text
docs(readme): correct misspelled heading
```

The real patch must show one harmless non-policy word correction. The `--trivial` flag **alone** is rejected; if ambiguous, use NORMAL.

## NORMAL — coherent source work

```text
fix(texture): cover all Cube face orientations

Surface: CHATGPT_GITHUB
Goal: Find missed faces without raising sampling budget.
Work: texture-face-scan — improve bounded six-direction scanning.
State: ACTIVE; SOURCE_INTEGRATION.
Proof: SOURCE_REVIEWED; TEST_AUTHORED_NOT_RUN.
Next: Review texture callers on the selected branch.
```

Add `Decision` and `Unresolved` when material, between Proof and Next. Major interface or policy changes use CRITICAL.

## CRITICAL — architecture and permissions

```text
feat(agent): restrict repository write authority

Surface: CHATGPT_GITHUB
Goal: Keep changes on the user-selected branch.
Work: permission-routing — tighten project action gates.
State: ACTIVE; SOURCE_INTEGRATION.
Proof: SOURCE_REVIEWED; LOCAL_TEST_DEFERRED.
Decision: Preserve explicit user authorization and existing test holds.
Unresolved: Effective local agent permission loading remains unverified.
Next: Inspect current host adapter source only.
```

## Unexpected chat-limit recovery — source-grounded example

A new chat is opened after the earlier ChatGPT conversation reached its length limit. The previous chat included a design decision that may not have reached the repository.

**Copy-ready read-only restart request:**

> Continue `WORK_TOPIC` in `OWNER/REPOSITORY` on branch `SELECTED_BRANCH`. First pin the current HEAD, read active rules, holds and the existing status owner, then recover only the relevant decisions and evidence. Identify any UNSAVED or UNKNOWN_OUTCOME work before proposing a next action. Do not repeat writes or run tests during recovery without authorization.

```text
TOPIC: selected workstream (user-supplied)
WORK_ID: observed stable topic, or INFERRED
REPO: <selected-repository>
BRANCH: <selected-branch>
LAST_OBSERVED_HEAD: <verified-prior-SHA, if available>
DECISIONS: <user-approved decision and original evidence, if verified>
HOLDS: <current known restriction; re-read on recovery>
UNKNOWN_OUTCOMES: <unacknowledged write or none>
NEXT_SAFE_STEP: re-pin HEAD, inspect current owner and relevant history
SAVE_STATE: UNSAVED
```

The packet is **copyable**, not proof that it was saved or that a user authorized another write. On a new chat, pin the actual selected branch HEAD, read current rules/profile and existing status owner, then use topic-scoped commit history. If the decision is absent from verifiable source/history and remains essential, request that one decision rather than inventing it. If a GitHub commit timed out, read the actual commit/ref before any retry; never create duplicate effects.

For an authorized checkpoint write, change `SAVE_STATE` to `PERSISTED` **only after** the destination and source/commit receipt are verified. This is still a source-level result, not a ChatGPT-native resume or PC-local test.

## Recovery from another chat

```text
User: "Lanjutkan pekerjaan tekstur di branch Local"
       ↓
Pin Local HEAD and read current profile/status
       ↓
List Local commits for texture owner path (small page)
       ↓
Compare topic decisions with current source
       ↓
Continue source only; no localtest request
```

If the global newest commit belongs to audio, **do not switch**. If a path was renamed or a response is partial, broaden only as needed. If the old Next conflicts with a hold or newer source, the hold/new source wins. Do not rewrite old Git history merely to add newly standardized fields.
