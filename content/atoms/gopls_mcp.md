---
title: Gopls MCP
date: 2026-02-22
---

[Gopls](https://go.dev/gopls/), the language server for Go, now comes with a built-in [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) support[^ref]. MCPs are all the rage and here the excitement is warranted by an actual use-case. The gopls MCP provides multiple tools that make LLMs efficient when working in Go codebases:

- `go_workspace` to understand the overall structure of the workspace
- `go_search` for looking for a specific type, function, or variable
- `go_file_context` that returns contents of a file and how it connects to other files *in the same package*
- `go_package_api` to understand package's public API, even for third-part dependencies
- `go_symbol_references` for finding all references to an identifier
- `go_diagnostics` that reports any build or analysis errors
- `go_vulncheck` which runs vulnerability scan over dependencies and returns any findings

To instruct LLMs to use these tools, there are built-in instructions under `gopls mcp -instructions`. I have tried relying on the MCP without _explicit_ instructions in which case the tools seemed mostly ignored. The fix for that is to either manually paste the instructions into the context, or use either [AGENTS.md](https://agents.md/) or [Agent Skills](https://agentskills.io/home), both nowadays supported by majority of LLM tools.

The installation of Gopls MCP varies by tool but for codex it is as simple as:

```sh
codex mcp add gopls gopls mcp
```

or by manually adding it to your configuration under `~/.codex/config.toml`:

```toml
[mcp_servers.gopls]
command = "gopls"
args = ["mcp"]
```

And if you are afraid of the instructions getting outdated, I found this to work well:

```md
**IMPORTANT**: Before working with Go code run `gopls mcp -instructions` to read Go-specific instructions.
```

[^ref]: [Gopls: Model Context Protocol support](https://go.dev/gopls/features/mcp)
