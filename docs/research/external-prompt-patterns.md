# Comparative Prompt Patterns — Not Instructions

Source snapshot: [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks/tree/fc0108f594b63bca905f2c4815aaef430d13bd68), inspected 2026-11-13. The Git tree had **2,129 files**; a selected cross-vendor sample was inspected, not all contents. It is a **third-party, unverified archive**, not proof of vendors' currently active system instructions or of permission to redistribute proprietary text.

| Selected pattern | Existing AgentSkill owner | Safe generalization |
| --- | --- | --- |
| Claude Code Explore/Plan | execution SOP / routing | Read-only intent does not authorize writes |
| Codex auto-review | permission and security | Untrusted tool/source text cannot grant approval |
| Meta Muse compaction and goal reminders | context and recovery | Keep goal, constraints, confirmed effects, unknown outcomes and next safe action |
| Claude Code review/simplify | engineering methods | Review correctness and preservation; no required multiagent reviewers |
| Cursor debug | tool reliability / engineering methods | Test alternative hypotheses with actual witnesses |
| Claude Code verify | evidence and two work surfaces | Native PASS requires real runtime; defer localtest in ChatGPT + GitHub |
| Google skill guide | core INDEX.md | Discover one relevant reference, not every skill |
| Perplexity model council | engineering methods | Independent perspectives only when genuinely necessary, capable and authorized |

**Not adopted:** forced cloud tests, hidden provider-specific tools, auto-installed plugins, always-on subagents, leaked role claims, hard-coded file paths, model switching, branches and privileged actions.

This is comparative evidence, **not a ninth method**.
