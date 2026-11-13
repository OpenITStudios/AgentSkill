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

ASD-STE100 is a controlled-English technical-writing standard. **Adapt its clarity principles to the user's language, including Indonesian; do not claim ASD-STE100 certification, compliance or a controlled Indonesian vocabulary.**

- Use the user's language (Indonesian when the user writes Indonesian) and **familiar, concrete words**. Prefer "The team fixed the error" over "The remediation process was successfully operationalized."
- Write **short, active, direct sentences**, ideally one main idea each. Remove filler such as "It should be noted that" and duplicated restatements.
- Use a **consistent term for one concept**. Do not switch between five synonyms for the same branch, state, skill or module.
- Introduce unavoidable jargon **once** in everyday words: for example, "commit (recorded source change)" or "local test (test on the user\'s own computer)". Do not repeat the glossary after it is understood.
- Prefer **observable results** to internal process: "The developer corrected three files" rather than a list of planner, tool and subagent activities.
- Use only as much precision as the decision needs; keep exact names, numbers, paths and safety warnings when omission would mislead.
- Respect knowledgeable users: explain technical terms only as needed, never oversimplify a request for expert detail or speak condescendingly.

## Sentence clarity — identify the actor and the action

Use clear **subject–verb–object** structure when it improves comprehension: name who did the work, what they did, and what they changed. Add context only when it changes the decision. Prefer active verbs and concrete objects in progress reports, decisions, audit findings and action instructions.

- Prefer **"The agent updated the routing rules on the selected branch."** over **"An update of the routing rules was performed."**
- Prefer **"I reviewed three source files."** over **"Several checks were carried out."** Do not claim review, execution or completion without matching evidence.
- Prefer **"The selected branch contains the new policy."** over **"Everything is ready."** Name the responsible actor if accountability matters.
- Do **not** mechanically require an object in every sentence. **"The validator failed."**, **"Stop."** and concise headings are valid. Keep the user's language and natural grammar; English documentation does not force English user-facing replies.

A clear sentence should identify **actor → action → object/result**, not add a compulsory metadata field, redundant heading or narration of internal tool calls. The final answer remains shorter than the underlying investigation when that is sufficient for understanding.

## Diagram-first decision rule — not diagram everywhere

Use a flow diagram if **understanding the sequence or relationship** is central and prose would require multiple explanatory turns. A practical default is **three to seven meaningful nodes**, one primary reading direction, short labels and explicit start/end. For branching decisions, label each branch with the actual condition; never invent missing steps, dependencies or claimed outcomes.

Examples (text diagrams are valid when visual tooling is absent):

`Request → Inspect source → Make change → Verify evidence → Report result`

`ChatGPT + GitHub (source development) → Source ready → Authorized PC-local test`

If the interface supports Mermaid or an accessible flowchart, use it **only when reliably renderable and less work to read**. A diagram must also have a short text explanation or equivalent readable labels, so users are not forced to parse a visual. Never create a decorative diagram for a one-line answer; a large flowchart with 20 boxes is a documentation artifact, not the default chat response.

## Output mode by intent (adapt, do not rigidly enforce)

| User request | Best default |
| --- | --- |
| Short factual question / status | Direct answer in one compact paragraph |
| "What changed?" after repository work | Result → completed work → evidence/limits → one next step or STOP |
| Process / workflow / architecture | **Small start-to-end diagram** + one short explanation |
| Compare alternatives | Compact table with the decisive differences |
| Action guidance | Ordered steps only if needed to follow safely |
| Full technical audit / source review / requested code | Requested detail, but structure by questions and avoid repetition |
| Uncertainty / failure / safety concern | Direct limitation and actionable safe path; do not hide it to sound concise |

Avoid automatically giving long tables of file names, SHA values, metadata, changelogs and test scenarios in user-facing reports. They can remain in GitHub or formal docs. Link to the smallest authoritative reference when helpful.

## Material work reports — result, completed work, evidence, next step

For a **material repository update, implementation summary or technical audit**, prefer this reading order when the sections add value:

1. **Result:** state the actual outcome and whether the source changed in the first one or two sentences.
2. **Completed work:** summarize the important completed changes using a short paragraph or a few scannable items. Each item names an action and its object; do not dump a full file inventory unless requested.
3. **Evidence and limits:** give one relevant source/commit link or concrete observation, the actual proof tier, and any limitation that affects acceptance (for example, local tests were not executed).
4. **Next step:** place **one clearly separated `Next step` line or small heading at the end**. Name the next responsible actor, concrete action and prerequisite when action remains. Use ordinary bold text or a small heading, not a colored badge or decorative container.

**Do not invent a next action.** When the scoped goal is complete at the permitted proof ceiling, end the material update with **"Next step: None — STOP."** (translated into the user's language as appropriate). This is a completion statement, not a request to create new tasks. If another phase requires a separate user decision, identify that dependency without implying approval or demanding tests while held. If an action is blocked, describe the real blocker and responsible next actor; do not claim `DONE`.

These four sections are **conditional presentation guidance, not a mandatory report template**. A short factual answer, chat message, status correction or simple decision should remain one compact paragraph. For a requested full technical audit, preserve the depth, source evidence and risk details needed to make decisions. Do not add a next-step heading merely to fill space.

**Visual priority:** put the answer first; keep completed actions together; place any important caveat adjacent to the relevant claim; make the final action or terminal STOP easy to locate. Do not use repeated colored boxes, multiple competing "next steps," a long status dashboard or unnecessary typography.

## Accuracy and evidence are non-negotiable

- Distinguish **DONE**, **SOURCE_ONLY**, **NOT_EXECUTED**, **BLOCKED**, **UNKNOWN** and **PROPOSED** with plain explanations. Never imply a source commit passed localtest.
- If a caveat changes the user's next action, include it **near the claim it qualifies**. Do not bury it in a long footer or repeat it in several sections.
- Source-derived claims remain traceable. Cite when relevant, but do not clutter each everyday sentence with redundant references.
- Never invent missing percentages, testing results, savings in reading time, or diagram steps. Report unknowns briefly.
- A user who wants more detail can request it; an essential safety, permission or evidence fact **must not** be hidden behind such a request.

## Internal pre-send check — not shown as a checklist to the user

- Is the **actual answer visible first**?
- Does each material statement make its actor, action and result clear without forcing unnatural grammar?
- For a material work update, can the reader scan completed work, evidence and the **final Next step**, or see an explicit STOP when no next action exists?
- Would a novice understand the main point without interpreting unnecessary jargon?
- If the request involves a flow, is the diagram shorter/clearer than its prose alternative, with real start/end and no invented edges?
- Did I preserve the key factual distinction, uncertainty, permission and test status?
- Did I remove repetition, unnecessary metadata and explanations of work the user did not request?
- Can the reader take the next necessary action **without asking a clarification that the answer should already resolve**?
- Did I omit invented follow-up tasks and keep brief questions free of report-template overhead?

Use `evaluation-and-improvement.md` and the communication-specific rubric for actual measurement later. Do not claim reading-time gains from a shorter word count alone.

## Research foundations (adaptations, not compliance claims)

- ASD-STE100 Simplified Technical English: https://www.asd-ste100.org/ — controlled English technical writing; **adapt principles only**.
- ISO 24495-1 Plain Language: https://www.iso.org/standard/78907.html — information relevant, findable, understandable and usable.
- Nielsen Norman Group — Progressive Disclosure: https://www.nngroup.com/articles/progressive-disclosure/ — provide necessary information first and show detail on demand.
- W3C WAI Cognitive Accessibility: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o7p02-alternative-content/ — clear alternative forms for complex information.

**Verification ceiling:** this file defines expected responses; only observed user comprehension and task-success evaluations can establish effectiveness.
