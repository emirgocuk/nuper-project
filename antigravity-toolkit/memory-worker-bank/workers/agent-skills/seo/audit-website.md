# audit-website
Source: https://antigravity.codes/agent-skills/seo/audit-website

## AI Worker Instructions
When the user requests functionality related to audit-website, follow these guidelines and utilize this context.

## Scraped Content

# audit-website
```
curl -fsSL https://squirrelscan.com/install | bash
```
```
curl -fsSL https://squirrelscan.com/install | bash
```
```
~/.local/share/squirrel/releases/{version}/
```
```
~/.local/bin/squirrel
```
```
~/.squirrel/settings.json
```
```
~/.local/bin
```
```
export PATH="$HOME/.local/bin:$PATH"
```
```
export PATH="$HOME/.local/bin:$PATH"
```
```
squirrel --version
```
```
squirrel --version
```
```
squirrel init
```
```
squirrel init --project-name my-project
```
```
squirrel init --project-name my-project
```
```

```
```
squirrel config set project.name my-project
```
```
squirrel config set project.name my-project
```
```
squirrel audit https://example.com --format llm
```
```
squirrel audit https://example.com --format llm
```
```
# Step 1: Run audit (default: console output)squirrel audit https://example.com# Step 2: Export as LLM formatsquirrel report <audit-id> --format llm
```
```
# Step 1: Run audit (default: console output)squirrel audit https://example.com# Step 2: Export as LLM formatsquirrel report <audit-id> --format llm
```
```
squirrel audit https://example.com --maxPages 200
```
```
squirrel audit https://example.com --maxPages 200
```
```
squirrel audit https://example.com --refresh
```
```
squirrel audit https://example.com --refresh
```
```
squirrel audit https://example.com --resume
```
```
squirrel audit https://example.com --resume
```
```
squirrel audit https://example.com --verbose
```
```
squirrel audit https://example.com --verbose
```
```
|
```
```
| Maximum pages to crawl (max 500) | 50 ||
```
```
|
```
```
| Ignore cache, fetch all pages fresh | false ||
```
```
| - | Resume interrupted crawl | false ||
```
```
|
```
```
| Verbose output | false ||
```
```
| - | Debug logging | false |### Report Command Options| Option | Alias | Description ||--------|-------|-------------||
```
```
|
```
```
| Export in LLM-optimized format ||
```
```
|
```
```
| Export in verbose XML format ||
```
```
|
```
```
| Export in JSON format |## Output Formats### Console Output (default)The
```
```
command shows human-readable console output by default with colored output and progress indicators.### LLM FormatTo get LLM-optimized output, use the
```
```
command with
```
```
:squirrel report <audit-id> --format llmThe LLM format is a compact XML/text hybrid optimized for token efficiency (40% smaller than verbose XML):- **Summary**: Overall health score and key metrics- **Issues by Category**: Grouped by audit rule category (core SEO, technical, content, security)- **Broken Links**: List of broken external and internal links- **Recommendations**: Prioritized action items with fix suggestionsSee [OUTPUT-FORMAT.md](references/OUTPUT-FORMAT.md) for detailed format specification.## Examples### Example 1: Quick Site Audit# User asks: "Check squirrelscan.com for SEO issues"squirrel audit https://squirrelscan.com# Returns audit ID, e.g., "sqrl_abc123"# Then export in LLM formatsquirrel report sqrl_abc123 --format llm### Example 2: Deep Audit for Large Site# User asks: "Do a thorough audit of my blog with up to 500 pages"squirrel audit https://myblog.com --maxPages 500squirrel report sqrl_xyz789 --format llm### Example 3: Fresh Audit After Changes# User asks: "Re-audit the site and ignore cached results"squirrel audit https://example.com --refreshsquirrel report sqrl_def456 --format llm### Example 4: One-Line Workflow# Audit and immediately export in LLM formatAUDIT_ID=$(squirrel audit https://example.com --quiet | tail -1) && squirrel report $AUDIT_ID --format llm## Troubleshooting### squirrel command not foundIf you see this error, squirrel is not installed or not in your PATH.**Solution:**1. Install squirrel:
```
```
squirrel report <audit-id> --format llm
```
```
squirrel report <audit-id> --format llm
```
```
# User asks: "Check squirrelscan.com for SEO issues"squirrel audit https://squirrelscan.com# Returns audit ID, e.g., "sqrl_abc123"# Then export in LLM formatsquirrel report sqrl_abc123 --format llm
```
```
# User asks: "Check squirrelscan.com for SEO issues"squirrel audit https://squirrelscan.com# Returns audit ID, e.g., "sqrl_abc123"# Then export in LLM formatsquirrel report sqrl_abc123 --format llm
```
```
# User asks: "Do a thorough audit of my blog with up to 500 pages"squirrel audit https://myblog.com --maxPages 500squirrel report sqrl_xyz789 --format llm
```
```
# User asks: "Do a thorough audit of my blog with up to 500 pages"squirrel audit https://myblog.com --maxPages 500squirrel report sqrl_xyz789 --format llm
```
```
# User asks: "Re-audit the site and ignore cached results"squirrel audit https://example.com --refreshsquirrel report sqrl_def456 --format llm
```
```
# User asks: "Re-audit the site and ignore cached results"squirrel audit https://example.com --refreshsquirrel report sqrl_def456 --format llm
```
```
# Audit and immediately export in LLM formatAUDIT_ID=$(squirrel audit https://example.com --quiet | tail -1) && squirrel report $AUDIT_ID --format llm
```
```
# Audit and immediately export in LLM formatAUDIT_ID=$(squirrel audit https://example.com --quiet | tail -1) && squirrel report $AUDIT_ID --format llm
```
```
2. Add to PATH:
```
```
3. Verify:
```
```
### Permission deniedIf squirrel is not executable:chmod +x ~/.local/bin/squirrel### Crawl timeout or slow performanceFor very large sites, the audit may take several minutes. Use
```
```
chmod +x ~/.local/bin/squirrel
```
```
chmod +x ~/.local/bin/squirrel
```
```
to see progress:squirrel audit https://example.com --format llm --verbose### Invalid URLEnsure the URL includes the protocol (http:// or https://):# ✗ Wrongsquirrel audit example.com# ✓ Correctsquirrel audit https://example.com## How It Works1. **Crawl**: Discovers and fetches pages starting from the base URL2. **Analyze**: Runs audit rules on each page3. **External Links**: Checks external links for availability4. **Report**: Generates LLM-optimized report with findingsThe audit is stored in a local database and can be retrieved later with
```
```
squirrel audit https://example.com --format llm --verbose
```
```
squirrel audit https://example.com --format llm --verbose
```
```
# ✗ Wrongsquirrel audit example.com# ✓ Correctsquirrel audit https://example.com
```
```
# ✗ Wrongsquirrel audit example.com# ✓ Correctsquirrel audit https://example.com
```
```
commands.## Additional Resources- **Output Format Reference**: [OUTPUT-FORMAT.md](references/OUTPUT-FORMAT.md)- **squirrelscan Documentation**: https://docs.squirrelscan.com- **CLI Help**:
```
Unlock comprehensive insights into any website's performance and integrity with this powerful AI agent skill. Leveraging the advanced Squirrelscan CLI, it goes beyond basic checks to provide a deep dive into over 140 potential issues across critical areas. From optimizing search engine visibility to pinpointing technical bottlenecks and security vulnerabilities, this skill empowers developers and marketers to swiftly identify problems and implement effective solutions for improved online presence and user experience.

# When to Use This Skill
- •Performing a full SEO audit before a website relaunch.
- •Diagnosing performance bottlenecks impacting user experience.
- •Proactively identifying security vulnerabilities on a client's site.
- •Regularly monitoring a website's overall health and link integrity.

# Pro Tips
- 💡Prioritize issues by 'health score' to tackle critical problems first.
- 💡Cross-reference specific rule IDs with squirrelscan's detailed documentation for in-depth understanding and fix strategies.
- 💡Integrate this audit into CI/CD pipelines for continuous website health monitoring.

