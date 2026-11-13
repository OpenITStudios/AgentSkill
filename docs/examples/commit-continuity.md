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

Goal: Keep changes on the user-selected branch.
Work: permission-routing — tighten project action gates.
State: ACTIVE; SOURCE_INTEGRATION.
Proof: SOURCE_REVIEWED; LOCAL_TEST_DEFERRED.
Decision: Preserve explicit user authorization and existing test holds.
Unresolved: Effective local agent permission loading remains unverified.
Next: Inspect current host adapter source only.
```

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

If the global newest commit belongs to audio, **do not switch**. If a path was renamed or a response is partial, broaden only as needed. If the old Next conflicts with a hold or newer source, the hold/new source wins. Do not rewrite old Git history merely to add v2 fields.
