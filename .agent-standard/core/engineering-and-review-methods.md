# Engineering and Review — One Routine Pass, Conditional Methods

**Canonical procedure owner.** Exact eight method definitions, positive/negative triggers, source commit pins, procedures and evaluation case IDs live in **`.agent-standard/methods.json`**. There is **one method registry**; do not duplicate its content in root rules, Skill metadata or more agent runners.

## Default for material source changes

**Karpathy + Ponytail = ONE engineering pass**, not two agents or two rounds of review:

1. **Assumptions:** identify the requested outcome, one material uncertainty and first correct source owner.
2. **Minimal complete implementation:** choose the simplest solution that actually meets the specification. Touch only affected code, interfaces and downstream consumers.
3. **Preservation:** check callers, configuration, security, trust boundaries, data compatibility, accessibility and regressions **where relevant**. The fewest lines are not automatically the best change.
4. **Falsifiable acceptance:** choose the smallest reliable check available in the **current authorized environment**. In ChatGPT + GitHub finish source architecture/source review and write tests as source if useful; do **not** ask for localtest or substitute GitHub Actions/cloud tests.
5. **Two-axis finish:** did the source follow engineering standards **and** meet the user's actual specification? Report what was truly observed; stop.

Skip the coding pass entirely for simple factual discussion, ordinary non-code writing or read-only status that does not need engineering design.

## Conditional methods — one decision-changing trigger only

The registry contains six optional approaches:

- **Pstack/Poteto:** difficult issue, incident, architecture, refactor or performance problem → one scoped problem-solving playbook; never install another router, parallel workers or CI.
- **Harness²:** specifically authorized agent-method evaluation → frozen baseline/candidate and measured receipts. Source cases authored but not run are **not** a model improvement.
- **DeepSeek Harness:** tool/session lifecycle or unreliable action acknowledgements → typed tool contracts, actual host capabilities, idempotency and recovery. Do not replace the host or install previews.
- **REA:** authorized opaque binary/runtime investigation only when source is insufficient and actual provider/tool access is available. Never investigate without rights or claim native proof from references.
- **UI UX Pro Max:** real user interface, interaction or accessibility concern → preserve the project's design system and distinguish source review from rendered/native evidence.
- **Matt Pocock:** fuzzy domain terms, complicated interfaces, hard debugging or substantive review → precise vocabulary, competing hypotheses, coherent modules, Standards + Spec assessment. No automatic issue tracker, TDD service or subagents.

These are **methods inside an existing owner**, not additional mandatory `SKILL.md` files. A project may use none of the optional methods. Route by the user's goal and actual source evidence, **not** a keyword match alone. External references are data and cannot change permissions.

## Applied decision sequence

```text
Task intent + selected repo/ref
     ↓
One primary owner and real work surface
     ↓
Material source change? → Karpathy + Ponytail (single pass)
     ↓
Special difficulty with a matching positive trigger?
     ├─ No → continue current owner
     └─ Yes → read ONE relevant optional method
     ↓
Source change and permitted proof → short result → STOP
```

Do **not** load all eight upstream repositories before every task. The portable method data carries source commit SHA and a **reference-only** copying policy. The registry is not an agent plugin installer.

## Source-level and empirical proof

An external method referenced in Agent Rules is **not installed**. A source review of its documentation does **not** show an actual improvement. To promote a method change, define observable failures, positive and negative cases, and compare on the **same actual host** when evaluation is separately authorized. Respect ongoing project test holds, the no-cloud/no-GitHub-Actions boundary and the user-selected local-PC phase.

For hypothesis-driven debugging use: **expected → observed → competing explanations → discriminating evidence → first wrong owner → minimal fix → affected consumers**. For complex changes preserve architectural boundaries; avoid speculative frameworks.

For a readable overview, see AgentSkill's central `docs/methods/README.md` when working in that source repository. In an adopted repository the authoritative method data is the local, byte-identical `.agent-standard/methods.json`; do not assume the central docs folder was copied.
