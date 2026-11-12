# Research Basis — Two Work Methods and Actual Host Identification

**Date reviewed:** 2026-11-13. **Provenance:** official developer documentation; this note describes source-backed product mechanisms, not installed runtime settings or executed local tests.

## Required principles

| Evidence | Official source | AgentSkill design consequence |
| --- | --- | --- |
| ChatGPT Github connection provides repository content access; surface-dependent ability to write does not imply local shell | https://help.openai.com/en/articles/11145903-connecting-github-to-chatgpt | `CHATGPT_GITHUB` can inspect/source-edit through authorized GitHub tools but cannot claim user-PC tests |
| Codex CLI works against local repository using tools on user's machine; Codex also has separate cloud/hosted environments | https://learn.chatgpt.com/docs/codex/cli ; https://developers.openai.com/api/docs/guides/agents-api/architecture | Verify actual executor origin, not just model/client name |
| Codex instruction discovery layers AGENTS.md and AGENTS.override.md from home/project/current directory | https://learn.chatgpt.com/docs/agent-configuration/agents-md | Confirm effective instructions and override collisions |
| Claude Code can load AGENTS.md in newer versions, but project CLAUDE.md may take precedence; a single import can preserve canonical policy | https://code.claude.com/docs/en/memory | Claude adapter checks version, AGENTS loading and import without copying core text |
| Claude Code local settings and cloud settings are different, hooks enforce actions only if installed | https://code.claude.com/docs/en/settings ; https://code.claude.com/docs/en/hooks | No assumed hook security or local-PC access from cloud session |
| OpenCode V2 uses AGENTS.md and portable .agents/skills; local/remote server and permission config matter | https://opencode.ai/docs/instructions ; https://opencode.ai/docs/skills ; https://opencode.ai/docs/permissions ; https://opencode.ai/docs/cli | Distinguish OpenCode app from LLM model; check actual server and host version |
| OpenCode V2 config differs from V1: ordered permissions and path-derived skill IDs | https://opencode.ai/docs/agents ; https://opencode.ai/docs/skills | Do not assume previous adapter/config examples still apply |

## Platform capability ≠ chosen workflow

Official product documentation may offer cloud environments, Actions, automation or remote Codex/Claude/OpenCode runs. These features **exist**, but the user's approved two-method process deliberately **does not use them as a substitute** for actual localtest. The existence of an integration does not grant permission to activate it.

Similarly, running a command in a ChatGPT-accessible container does not make it the user's PC or a valid localtest environment. A GitHub branch spelled `Local` is simply a branch name.

## Engineering recommendation

Publish one identical core policy file set, conditional host-specific adapter guides, and a source-to-local handoff. Verify:
1. **Actual current interface** (ChatGPT conversation vs local agent application).
2. **Execution origin** (GitHub API vs real user-PC filesystem/terminal).
3. **Host identity** (Claude Code vs Codex CLI vs OpenCode; not model brand).
4. **Source revision and current permissions**.
5. **Phase** (source architecture versus user-selected local validation).

When any local prerequisite is missing, follow the safe source-only route and do not repeatedly ask for localtest. The mechanics of a platform can change over time, so adapters require a version check when local sessions are actually available.

**Scope:** research-backed design, not local host/behavioral validation.
