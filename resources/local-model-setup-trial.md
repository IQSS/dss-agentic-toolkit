# Local-LLM setup trial

Recorded November 3, 2026, on the guide author’s Mac. This was a setup and tool-use trial with Qwen3 4B through Ollama, not an evaluation of research accuracy or comprehensive access restrictions.

An unrestricted category request returned explanatory text and reached the output limit. Repeating the request with a JSON schema returned the required category object. A separate two-turn Claude Code run through Ollama read an assigned harmless marker file and returned its content.

The tool-use run used the local endpoint `http://127.0.0.1:11434`, model tag `qwen3:4b`, an `ollama` authentication placeholder, bare mode, no saved session, an empty MCP server list, and explicit Read-tool permissions. The placeholder is not a provider credential. The serving process had cloud features disabled.

These settings describe that historical trial. Check current runtime and client documentation before reconstructing it, and select context and concurrency limits for the available hardware. Preserve the exact model digest, runtime version, requests, responses, and tool-call trace in any new run. A successful marker read does not show that other files or services were inaccessible.
