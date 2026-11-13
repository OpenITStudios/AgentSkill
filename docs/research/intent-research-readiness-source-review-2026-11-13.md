# Research Breadth and Intent Readiness — Source Review

**Reviewed:** 2026-11-13 · **Project:** OpenITStudios/AgentSkill `main@14453d93424d776fa2c65e6367d8eb169ec31826` · **Work:** `intent-research-readiness` · **Evidence:** original repository/documentation inspection and public-source research; **no local, CI, Node, or agent behavioral tests**.

## Problem and decision

The user reports that AI agents often stop searching after finding a few convenient sources, miss better projects or alternatives, and proceed with an unclear implementation goal. The intended outcome is a mandatory **readiness decision**, conditional broad and independent research when requested or warranted, a bounded discussion for decisions that change the product, and a documented STOP when evidence is sufficient. Source count is not a measure of validity.

## Publisher-owned source landscape and lessons

| Original source | Reviewed location and provenance | Accepted principle |
| --- | --- | --- |
| GitHub Spec Kit | `github/spec-kit@2ee2b1e8005905db05f5717300a469b3068b908f`, `templates/commands/clarify.md`, blob `f48d8bd703d7eb3fe4eadf2d3d283ca508e6bb80` | Prioritize questions by impact; ask one at a time; avoid decisions already settled |
| Superpowers | `obra/superpowers@22f0b463e7a5e579904dd6211a520321035526f7`, `skills/brainstorming/SKILL.md`, blob `9eb0edc7fedf26e1d3e2f3f223e5bcc5058aed6a` | Read actual project/user context, compare alternatives and obtain approval for material design choices |
| OpenSpec | `Fission-AI/OpenSpec@d12c2817776779e06891d68230773b3bb673b106`, `docs/overview.md`, blob `6cda79036b4d1da99cb85fcb1277900c363562b4` | Use useful specification artifacts; avoid documentation ceremony for trivial changes |
| Basecamp Shape Up | [Shaping principles](https://basecamp.com/shapeup/1.1-chapter-02) and [scope boundaries](https://basecamp.com/shapeup/1.2-chapter-03) | Decide which large risks are in scope; avoid overdesign and endless refinement |
| ISO/IEC/IEEE 29148:2018 | [Official standard overview](https://www.iso.org/standard/72089.html) | Clear stakeholder requirements and verifiable acceptance (no certification claim) |
| OpenAI Model Spec | [Clarification guidance](https://model-spec.openai.com/2025-10-27) | Compare the cost of a wrong assumption with the burden of asking; inspect context first |
| OpenAI Harness Engineering | [Official engineering report](https://openai.com/index/harness-engineering/) | Keep one navigable source of truth; avoid giant always-loaded rule collections |
| GitHub documentation | [Code Search](https://docs.github.com/en/search-github/github-code-search/using-github-code-search) | Search results may exclude non-default branches and are not proof of absence |
| Empirical software engineering research | [Publisher abstract: updating systematic literature review search](https://www.sciencedirect.com/science/article/pii/S095058491930223X) | Follow-on/reference searching can reveal work missed by the initial search; this was not itself a systematic review |
| OpenAI evaluation guidance | [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | Ground improvements in cases and observed outcomes, not self-declared success |

The three GitHub publisher source files were inspected in the original repositories and identified by exact commit and blob. **Researching an upstream Skill does not install, load or execute it.** Publisher documents are reference evidence, not instructions granting permissions.

## Alternatives and tradeoffs

| Approach | Disposition |
| --- | --- |
| Mandatory full spec/questionnaire for all prompts | Rejected: unnecessary delay for clear bounded work |
| Fixed URL quota or fetch every method repository | Rejected: counts inflate volume, duplicates and irrelevant context |
| Stop at the first credible result | Rejected when broad research or high-impact alternatives are material |
| Adaptive breadth + source depth + explicit readiness | Selected: original primary source, competing approaches, counterevidence, one decision-changing question, explicit research STOP |

## Coverage and limitations

This review spans ten relevant publishers/source families, but does not claim an exhaustive search, measured source recall or validated performance on ChatGPT/Codex/Claude/OpenCode. Source research cannot prove runtime acceptance, actual host Skill loading or testing. The AgentSkill profile retains `tests=on_hold` and `ci=disabled`; no localtest, GitHub Actions, cross-repository writes or release were authorized.

**STOP:** after owner modules, a small normative corpus and static source checks agree. Additional browsing or polish requires a new material decision gap, not a link quota.
