# Context Recovery — Research and Acceptance Notes

**Status: source-reviewed, not behaviorally tested.** The only authoritative procedure is `.agent-standard/core/commit-continuity-and-recovery.md`.

At AgentSkill `main` SHA `efdf25ccc67c4b1841f04b18a2649e6ea82ffe91` on 2026-11-13, the 46 available commits covered multiple topics: latest adoption readiness, preceding evidence binding and older continuity work. This motivates workstream retrieval rather than single-latest-commit inference. The 30/50/100 cumulative windows are **initial heuristics, not empirically optimal**; targeted older history has no age cap.

Sources:
- GitHub List Commits (sha/path/pagination): https://docs.github.com/en/rest/commits/commits#list-commits
- GitHub Get Commit (parents/file-list limits): https://docs.github.com/en/rest/commits/commits#get-a-commit
- GitHub Compare (partial diff limits): https://docs.github.com/en/rest/commits/commits#compare-two-commits
- Git merge-base, log history: https://git-scm.com/docs/git-merge-base and https://git-scm.com/docs/git-log
- Progressive agent context: https://openai.com/index/harness-engineering/
- Untrusted retrieved instructions: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- Curated unreleased notes and numeric versions: https://keepachangelog.com/en/1.1.0/ and https://semver.org/spec/v2.0.0.html

Future comparison on identical branch/HEAD/user topic/host permissions should measure workstream correctness, current decision selection, wrong or unauthorized actions, stale proof, API/context cost and human corrections. GOV-171–190 are **normative not executed**. No local tests, CI or model-run result is claimed. Old research filenames and historical commit text remain provenance, not product releases.
