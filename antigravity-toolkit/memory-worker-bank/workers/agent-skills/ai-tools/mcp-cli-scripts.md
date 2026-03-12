# mcp-cli-scripts
Source: https://antigravity.codes/agent-skills/ai-tools/mcp-cli-scripts

## AI Worker Instructions
When the user requests functionality related to mcp-cli-scripts, follow these guidelines and utilize this context.

## Scraped Content

# mcp-cli-scripts
```
mcp-{name}/├── src/│   └── index.ts              # MCP server (for Claude.ai, remote clients)├── scripts/│   ├── {tool-name}.ts        # One script per tool│   ├── {another-tool}.ts│   └── _shared.ts            # Shared auth/config helpers (optional)├── SCRIPTS.md                # Documents available scripts for Claude Code├── package.json└── README.md
```
```
mcp-{name}/├── src/│   └── index.ts              # MCP server (for Claude.ai, remote clients)├── scripts/│   ├── {tool-name}.ts        # One script per tool│   ├── {another-tool}.ts│   └── _shared.ts            # Shared auth/config helpers (optional)├── SCRIPTS.md                # Documents available scripts for Claude Code├── package.json└── README.md
```
```
// Good - structured outputconsole.log(JSON.stringify({ success: true, data: result }, null, 2));// Avoid - unstructured text (unless --format text requested)console.log("Found 5 results:");
```
```
// Good - structured outputconsole.log(JSON.stringify({ success: true, data: result }, null, 2));// Avoid - unstructured text (unless --format text requested)console.log("Found 5 results:");
```
```
// Input/Output files--input data.csv          // Batch process from file--output results.json     // Save results to file--append                  // Append to existing file// Caching--cache                   // Use local cache--cache-ttl 3600          // Cache for 1 hour--no-cache                // Force fresh request// Output formats--format json|csv|table   // Different output formats--quiet                   // Suppress non-essential output--verbose                 // Extra debugging info// Batch operations--batch                   // Process multiple items--concurrency 5           // Parallel processing limit
```
```
// Input/Output files--input data.csv          // Batch process from file--output results.json     // Save results to file--append                  // Append to existing file// Caching--cache                   // Use local cache--cache-ttl 3600          // Cache for 1 hour--no-cache                // Force fresh request// Output formats--format json|csv|table   // Different output formats--quiet                   // Suppress non-essential output--verbose                 // Extra debugging info// Batch operations--batch                   // Process multiple items--concurrency 5           // Parallel processing limit
```
```
# Standard patterns--input <file>            # Read input from file--output <file>           # Write output to file--format <type>           # Output format--profile <name>          # Auth profile (for multi-account)--verbose                 # Debug output--help                    # Show usage
```
```
# Standard patterns--input <file>            # Read input from file--output <file>           # Write output to file--format <type>           # Output format--profile <name>          # Auth profile (for multi-account)--verbose                 # Debug output--help                    # Show usage
```
```
#!/usr/bin/env npx tsx/** * Brief description of what this script does * * Usage: *   npx tsx scripts/tool-name.ts <required-arg> *   npx tsx scripts/tool-name.ts --option value * * Examples: *   npx tsx scripts/tool-name.ts 12345 *   npx tsx scripts/tool-name.ts --input batch.csv --output results.json */
```
```
#!/usr/bin/env npx tsx/** * Brief description of what this script does * * Usage: *   npx tsx scripts/tool-name.ts <required-arg> *   npx tsx scripts/tool-name.ts --option value * * Examples: *   npx tsx scripts/tool-name.ts 12345 *   npx tsx scripts/tool-name.ts --input batch.csv --output results.json */
```
```
#!/usr/bin/env npx tsx
```
```
{ success: false, error: "..." }
```
```
console.log()
```
```
node
```
```
ts-node
```
```
src/├── core/│   ├── lookup.ts         # Pure function, no I/O assumptions│   └── index.ts          # Export all core functions├── mcp/│   └── index.ts          # MCP handlers, import from core└── cli/    └── lookup.ts         # CLI wrapper, import from core
```
```
src/├── core/│   ├── lookup.ts         # Pure function, no I/O assumptions│   └── index.ts          # Export all core functions├── mcp/│   └── index.ts          # MCP handlers, import from core└── cli/    └── lookup.ts         # CLI wrapper, import from core
```
```
# Copy to your projectcp ~/.claude/skills/mcp-cli-scripts/templates/script-template.ts scripts/new-tool.ts
```
```
# Copy to your projectcp ~/.claude/skills/mcp-cli-scripts/templates/script-template.ts scripts/new-tool.ts
```
```
# Copy to your projectcp ~/.claude/skills/mcp-cli-scripts/templates/SCRIPTS-TEMPLATE.md SCRIPTS.md
```
```
# Copy to your projectcp ~/.claude/skills/mcp-cli-scripts/templates/SCRIPTS-TEMPLATE.md SCRIPTS.md
```
```
.claude/rules/
```
```
cp ~/.claude/skills/mcp-cli-scripts/rules/mcp-cli-scripts.md .claude/rules/
```
```
cp ~/.claude/skills/mcp-cli-scripts/rules/mcp-cli-scripts.md .claude/rules/
```
```
{  "devDependencies": {    "tsx": "^4.21.0"  }}
```
```
{  "devDependencies": {    "tsx": "^4.21.0"  }}
```
```
{  "devDependencies": {    "tsx": "^4.21.0"  }}
```
```
{  "devDependencies": {    "tsx": "^4.21.0"  }}
```
```
scripts/
```
```
npx tsx scripts/tool-name.ts --help
```
```
scripts/
```
```
#!/usr/bin/env node
```
```
#!/usr/bin/env npx tsx
```
```
#!/usr/bin/env ts-node
```
```
#!/usr/bin/env npx tsx
```
```
#!/usr/bin/env npx tsx
```
```
console.log("Found 5 results")
```
```
console.log(JSON.stringify({ success: true, count: 5 }))
```
```
console.log(data)
```
```
console.log(JSON.stringify(data, null, 2))
```
```
console.error("Error: " + err.message)
```
```
console.error(JSON.stringify({ success: false, error: err.message }))
```
```
throw new Error(...)
```
```
process.exit(1)
```
```
--input <file>
```
```
--output <file>
```
```
--format <type>
```
```
--verbose
```
```
--help
```
```
-h
```
```
console.log("Processing...")
```
```
if (args.verbose) console.error("Processing...")
```
The MCP CLI Scripts Agent Skill empowers AI coding assistants like Claude Code and Cursor to perform powerful local operations directly within your terminal environment. Unlike remote MCP servers, these companion scripts provide full read/write access to your local file system, enable batch processing, and offer versatile output formats beyond standard JSON. This skill is crucial for developers seeking to automate complex workflows, process data locally, and integrate AI capabilities more deeply into their development pipelines, moving beyond the limitations of purely cloud-based interactions and unlocking new levels of productivity and control.

# When to Use This Skill
- •Automating repetitive coding tasks that require local file system interaction, such as refactoring large codebases or generating boilerplate.
- •Processing multiple files or large datasets locally, where sending data to a remote server would be inefficient or impractical.
- •Generating custom reports, logs, or formatted outputs (CSV, tables, text files) directly from AI-processed data.
- •Chaining AI-generated outputs with other local command-line tools for complex, multi-step development workflows.

# Pro Tips
- 💡Design your CLI scripts to be idempotent where possible, ensuring they can be re-run safely without unintended side effects.
- 💡Leverage the `_shared.ts` pattern for common functionalities like authentication and configuration, promoting consistency and reducing boilerplate across your scripts.
- 💡Integrate robust error handling and clear logging into your scripts to facilitate debugging and ensure reliable execution in various terminal environments.

