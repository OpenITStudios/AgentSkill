# Engineering Method Catalog — Short Guide

**Eight methods. One main task owner.** For material code work, combine **Karpathy + Ponytail** in ONE quick engineering pass. Choose another method only when the task requires it.

```text
User goal → Existing project owner
                ↓
        Code task? Karpathy + Ponytail
                ↓
        Special problem? ONE relevant method
                ↓
        Safe source work → Honest proof → STOP
```

| Method | Use when | Skip when |
| --- | --- | --- |
| Karpathy + Ponytail | Code needs a minimal **complete** change, review of callers and security | Non-code Q&A, repeated ceremonies |
| Pstack/Poteto | Difficult bug, incident, performance or architecture | Simple known-owner fix |
| Harness² | Approved, reproducible comparison of agent methods | Ordinary development or no permitted experiment |
| DeepSeek Harness | Session/tool lifecycle, permission and unknown outcomes | Replacing the current agent host |
| REA | Lawful opaque binary investigation with real tool access | Public source already answers the question |
| UI UX Pro Max | Real UI, navigation and accessibility | Backend-only work |
| Matt Pocock | Domain clarity, deep interfaces, hard diagnosis or Standards+Spec review | Forced issue tracker or agents |

**Machine-readable source:** [registry/methods.json](../../registry/methods.json), distributed 1:1 as `.agent-standard/methods.json`.

**One procedural owner:** [engineering-and-review-methods.md](../../.agent-standard/core/engineering-and-review-methods.md). **Not eight new SKILL.md files.**

**Provenance:** each method pins the external repository, source commit and reference path. External instructions are research data. We copy ideas, **not** vendor scripts or prompts.

**Source-only workflow:** ChatGPT + GitHub completes architecture/code/source review. No localtest demand, GitHub Actions, or cloud tests. Actual host behavior must be measured later with user-selected PC-local agent.
