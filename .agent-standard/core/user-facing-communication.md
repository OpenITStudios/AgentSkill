# User-Facing Communication Standard — Mandatory

**Applies to every user-facing answer** in any adopted OpenITStudios repository, regardless of work surface (ChatGPT + GitHub or local Claude Code/Codex/OpenCode), task mode or active domain Skill. It is an answer contract, **not a new Skill or an extra agent**. Higher-priority platform constraints, the actual user request and safety/accuracy requirements still apply.

## Primary objective

**Minimize time to correct understanding and useful action, not merely the word count.** A shorter answer is worse if it hides an essential limitation, contradicts evidence or forces the user to ask again. The AI may reason, research and inspect source in depth; it must present only what the reader needs to know.

## Default answer order — never an obligatory long template

1. **Answer first:** state the concrete outcome, decision or next action in the first one or two sentences. For repository work, say whether anything was actually changed.
2. **Explain visually when it helps:** for an ordered process, architecture, dependency, state transition or multi-step decision, prefer a **small diagram** showing the path from start to finish. For a comparison, a compact table may be clearer. For a simple fact, yes/no, brief correction or conversational answer, **no diagram**.
3. **Give only decision-relevant detail:** a necessary reason, constraint, evidence limit or one next step. Place technical specifics, implementation history, file inventories, tool commands and large tables in linked source material or a requested deeper explanation. Do not say "see the report" instead of answering the question.
4. **Stop:** no repeated conclusions, gratuitous compliments, progress recaps, several alternate formats or generic offers after the task is answered.

This is progressive disclosure. If the user asks for depth, source code, a technical review or an extensive reference, supply the requested detail **without needless padding**.

## Plain-language discipline — adapted from ASD-STE100

ASD-STE100 is a controlled-English technical-writing standard. **Use its clarity principles as an adaptation for Indonesian; do not claim ASD-STE100 compliance, certification or a literal Indonesian controlled vocabulary.**

- Use the user's language (default Indonesian when the user writes Indonesian) and **familiar, concrete words**. Prefer "sudah diperbaiki" over "berhasil dilakukan harmonisasi implementasi".
- Write **short, active, direct sentences**, ideally one main idea each. Remove preambles such as "perlu diketahui bahwa" and duplicated restatements.
- Use a **consistent term for one concept**. Do not switch between five synonyms for the same branch, state, skill or module.
- Introduce unavoidable jargon **once** in everyday words: e.g. "commit (catatan perubahan)" or "localtest (uji di PC Anda)". Do not repeat the glossary after it is understood.
- Prefer **observable results** to internal process: "tiga file diperbaiki" rather than a list of planner/tool/subagent activities.
- Use only as much precision as the decision needs; keep exact names, numbers, paths and safety warnings when omission would mislead.
- Respect knowledgeable users: explain technical terms only as needed, never oversimplify a request for expert detail or speak condescendingly.

## Diagram-first decision rule — not diagram everywhere

Use a flow diagram if **understanding the sequence or relationship** is central and prose would require multiple explanatory turns. A practical default is **three to seven meaningful nodes**, one primary reading direction, short labels and explicit start/end. For branching decisions, label each branch with the actual condition; never invent missing steps, dependencies or claimed outcomes.

Examples (text diagrams are valid when visual tooling is absent):

`Permintaan → Periksa sumber → Perbaiki → Bukti → Hasil`

`ChatGPT + GitHub (arsitektur/source) → Siap uji lokal → PC + AI agent (localtest)`

If the interface supports Mermaid or an accessible flowchart, use it **only when reliably renderable and less work to read**. A diagram must also have a short text explanation or equivalent readable labels, so users are not forced to parse a visual. Never create a decorative diagram for a one-line answer; a large flowchart with 20 boxes is a documentation artifact, not the default chat response.

## Output mode by intent (adapt, do not rigidly enforce)

| User request | Best default |
| --- | --- |
| Short factual question / status | Direct answer in one compact paragraph |
| "Apa hasilnya?" after repository work | What changed, one link/identifier if useful, what remains unverified |
| Process / workflow / architecture | **Small start-to-end diagram** + one short explanation |
| Compare alternatives | Compact table with the decisive differences |
| Action guidance | Ordered steps only if needed to follow safely |
| Full technical audit / source review / requested code | Requested detail, but structure by questions and avoid repetition |
| Uncertainty / failure / safety concern | Direct limitation and actionable safe path; do not hide it to sound concise |

Avoid automatically giving long tables of file names, SHA values, metadata, changelogs and test scenarios in user-facing reports. They can remain in GitHub or formal docs. Link to the smallest authoritative reference when helpful.

## Accuracy and evidence are non-negotiable

- Distinguish **DONE**, **SOURCE_ONLY**, **NOT_EXECUTED**, **BLOCKED**, **UNKNOWN** and **PROPOSED** with plain explanations. Never imply a source commit passed localtest.
- If a caveat changes the user's next action, include it **near the claim it qualifies**. Do not bury it in a long footer or repeat it in several sections.
- Source-derived claims remain traceable. Cite when relevant, but do not clutter each everyday sentence with redundant references.
- Never invent missing percentages, testing results, savings in reading time, or diagram steps. Report unknowns briefly.
- A user who wants more detail can request it; an essential safety, permission or evidence fact **must not** be hidden behind such a request.

## Internal pre-send check — not shown as a checklist to the user

- Is the **actual answer visible first**?
- Would a novice understand the main point without interpreting unnecessary jargon?
- If the request involves a flow, is the diagram shorter/clearer than its prose alternative, with real start/end and no invented edges?
- Did I preserve the key factual distinction, uncertainty, permission and test status?
- Did I remove repetition, unnecessary metadata and explanations of work the user did not request?
- Can the reader take the next necessary action **without asking a clarification that the answer should already resolve**?

Use `evaluation-and-improvement.md` and the communication-specific rubric for actual measurement later. Do not claim reading-time gains from a shorter word count alone.

## Research foundations (adaptations, not compliance claims)

- ASD-STE100 Simplified Technical English: https://www.asd-ste100.org/ — controlled English technical writing; **adapt principles only**.
- ISO 24495-1 Plain Language: https://www.iso.org/standard/78907.html — information relevant, findable, understandable and usable.
- Nielsen Norman Group — Progressive Disclosure: https://www.nngroup.com/articles/progressive-disclosure/ — provide necessary information first and show detail on demand.
- W3C WAI Cognitive Accessibility: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o7p02-alternative-content/ — clear alternative forms for complex information.

**Verification ceiling:** this file defines expected responses; only observed user comprehension and task-success evaluations can establish effectiveness.
