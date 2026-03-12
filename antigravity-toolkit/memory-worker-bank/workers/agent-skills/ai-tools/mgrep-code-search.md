# mgrep-code-search
Source: https://antigravity.codes/agent-skills/ai-tools/mgrep-code-search

## AI Worker Instructions
When the user requests functionality related to mgrep-code-search, follow these guidelines and utilize this context.

## Scraped Content

# mgrep-code-search
```
bunx @mixedbread/mgrep watch
```
```
bunx @mixedbread/mgrep watch
```
```
watch
```
```
.gitignore
```
```
.mgrepignore
```
```
bunx @mixedbread/mgrep "your natural language query" [path]
```
```
bunx @mixedbread/mgrep "your natural language query" [path]
```
```
bunx @mixedbread/mgrep "where is authentication configured?"bunx @mixedbread/mgrep "how do we handle errors in API calls?" src/bunx @mixedbread/mgrep "database connection setup" src/lib
```
```
bunx @mixedbread/mgrep "where is authentication configured?"bunx @mixedbread/mgrep "how do we handle errors in API calls?" src/bunx @mixedbread/mgrep "database connection setup" src/lib
```
```
-m <count>
```
```
-c, --content
```
```
-a, --answer
```
```
-s, --sync
```
```
--no-rerank
```
```
# Get more resultsbunx @mixedbread/mgrep -m 25 "user authentication flow"# Show full content of matchesbunx @mixedbread/mgrep -c "error handling patterns"# Get an AI-synthesised answerbunx @mixedbread/mgrep -a "how does the caching layer work?"# Sync index before searchingbunx @mixedbread/mgrep -s "payment processing" src/services
```
```
# Get more resultsbunx @mixedbread/mgrep -m 25 "user authentication flow"# Show full content of matchesbunx @mixedbread/mgrep -c "error handling patterns"# Get an AI-synthesised answerbunx @mixedbread/mgrep -a "how does the caching layer work?"# Sync index before searchingbunx @mixedbread/mgrep -s "payment processing" src/services
```
```
bunx @mixedbread/mgrep watch
```
```
bunx @mixedbread/mgrep watch
```
```
bunx @mixedbread/mgrep "what you're looking for" [optional/path]
```
```
bunx @mixedbread/mgrep "what you're looking for" [optional/path]
```
```
bunx @mixedbread/mgrep -m 20 -c "refined query" src/specific/directory
```
```
bunx @mixedbread/mgrep -m 20 -c "refined query" src/specific/directory
```
```
MGREP_MAX_COUNT
```
```
MGREP_CONTENT
```
```
MGREP_ANSWER
```
```
MGREP_SYNC
```
```
bunx @mixedbread/mgrep
```
```
bunx @mixedbread/mgrep watch
```
```
.gitignore
```
```
.mgrepignore
```
Navigating vast and intricate code repositories can often feel like searching for a needle in a haystack when traditional string-based tools fall short. The mgrep Semantic Code Search Agent Skill transforms this challenge into an intuitive experience. By leveraging natural language processing, it empowers developers to query codebases conceptually, uncovering hidden logic and architectural patterns. This skill is designed to accelerate understanding and exploration, making it indispensable for anyone working with complex projects where intent and function are more critical than exact keyword matches, significantly boosting productivity for AI coding assistants.

# When to Use This Skill
- •Understanding a newly inherited or unfamiliar codebase with complex structures.
- •Locating all instances of a specific feature or conceptual implementation across a large application.
- •Debugging by understanding the intent behind complex or poorly documented code sections.
- •Performing refactoring efforts where you need to identify related logical components based on their function.

# Pro Tips
- 💡Combine semantic search with traditional `grep`/`ripgrep` for a hybrid approach: use `mgrep` for conceptual understanding and `grep` for precise string matches.
- 💡Ensure the `mgrep watch` command is running in your development environment to keep your codebase index up-to-date with file changes.
- 💡Refine natural language queries by starting broad and gradually narrowing down the scope to achieve more precise and relevant results.

