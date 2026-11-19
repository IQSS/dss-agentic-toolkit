# Local-LLM setup trial

Recorded November 3, 2026, on the guide author’s Mac. This was a setup and tool-use trial with Qwen3 4B through `Ollama`, not an evaluation of research accuracy or comprehensive access restrictions. The details below let an agent reconstruct the tested setup; [Chapter 17: Run and adapt an LLM on your own hardware](https://dss-agentic-toolkit.pages.dev/chapters/local-models.html) explains the terms and current setup decisions.

A category-labeling prompt without a required output format returned explanatory text and reached the output limit. Repeating the prompt with a JSON schema, a definition of the required response fields and structure, returned the required category object. A separate two-turn `Claude Code` run through `Ollama` read an assigned harmless marker file and returned its content.

The tool-use run used the local endpoint `http://127.0.0.1:11434`, LLM tag `qwen3:4b`, an `ollama` authentication placeholder, bare mode, no saved session, an empty MCP server list, and explicit `Read`-tool permissions. The placeholder is not a provider credential. The serving process had cloud features disabled.

These settings describe that historical trial. Check current runtime and client documentation before reconstructing it, and select input-length and simultaneous-request limits for the available hardware. Preserve the exact LLM digest, runtime version, prompts, responses, and tool-call record in any new run. A successful marker read does not show that other files or services were inaccessible.
