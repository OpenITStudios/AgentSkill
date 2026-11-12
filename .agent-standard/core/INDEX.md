# Core Policy Index — Single Ownership Map

This index is a **selector**, not a new agent/router. Shared root `AGENTS.md` defines entry and current profile defines restrictions. Open only the module needed for a material decision. All modules are canonical **1:1 distribution files**.

| Owner document | Trigger / question it answers | Load rule |
| --- | --- | --- |
| `execution-sop.md` | Which mode/stage and how to finish? | for multi-step work; skip full read for obvious bounded tasks |
| `permission-and-security.md` | Is this particular side effect allowed? | **required before material mutation** or when permissions conflict |
| `evidence-and-recovery.md` | What can be claimed, and how to recover? | when making completion claims, tests unavailable, or session interrupted |
| `skill-authoring.md` | How to create/adapt a portable Skill safely? | only for Skill changes |
| `decision-routing-and-ownership.md` | Which one owner/skill owns the result, and what must not activate? | if intent, owner or skill routing is non-trivial |
| `context-and-session-continuity.md` | What to load, reuse, exclude and preserve through compaction? | on complex/long tasks or context recovery |
| `engineering-and-review-methods.md` | Which engineering lens, design/review rigor or root-cause method helps? | for material development or methodology comparison |
| `handoff-and-state.md` | How to transfer one specialist's facts to another without duplicate truth? | on cross-owner work, stage transition or UNKNOWN_OUTCOME |
| `evaluation-and-improvement.md` | How to measure behavioral improvement against frozen baseline? | for agent rules, skill or harness quality work |
| `tool-contracts-and-reliability.md` | How to diagnose tool capabilities, receipts, errors and retries? | for tool/session design, real side effects or unreliable execution |

## Authority

- Root: task classification, basic safety and user scope.
- Local profile: currently permitted branch, CI/test holds and protected data; not copied with core.
- This index: **where** to find the answer.
- One owner module: **what** contract governs that question.
- Domain Skill: **how** the chosen product work is done.
- Source/test/native evidence: **whether** the observed result meets acceptance.

Avoid copying module prose into another Skill or adding a second method router. If two modules overlap, resolve by the question's owner: intent → routing; action authorization → security; host capability → tools; result claim → evidence; multi-owner transition → handoff; measured agent improvement → evaluation.

Static parity proves **file identity** only. Agent hosts must actually load the correct instruction set; Codex/OpenCode behavioral parity remains separately evaluated.
