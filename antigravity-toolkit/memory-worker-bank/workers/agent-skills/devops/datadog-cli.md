# datadog-cli
Source: https://antigravity.codes/agent-skills/devops/datadog-cli

## AI Worker Instructions
When the user requests functionality related to datadog-cli, follow these guidelines and utilize this context.

## Scraped Content

# datadog-cli
```
export DD_API_KEY="your-api-key"export DD_APP_KEY="your-app-key"
```
```
export DD_API_KEY="your-api-key"export DD_APP_KEY="your-app-key"
```
```
npx @leoflores/datadog-cli <command>
```
```
npx @leoflores/datadog-cli <command>
```
```
--site
```
```
npx @leoflores/datadog-cli logs search --query "*" --site datadoghq.eu
```
```
npx @leoflores/datadog-cli logs search --query "*" --site datadoghq.eu
```
```
logs search
```
```
logs tail
```
```
logs trace
```
```
logs context
```
```
logs patterns
```
```
logs compare
```
```
logs multi
```
```
logs agg
```
```
metrics query
```
```
errors
```
```
services
```
```
dashboards
```
```
dashboard-lists
```
```
npx @leoflores/datadog-cli logs search --query "status:error" --from 1h --pretty
```
```
npx @leoflores/datadog-cli logs search --query "status:error" --from 1h --pretty
```
```
npx @leoflores/datadog-cli logs tail --query "service:api status:error" --pretty
```
```
npx @leoflores/datadog-cli logs tail --query "service:api status:error" --pretty
```
```
npx @leoflores/datadog-cli errors --from 1h --pretty
```
```
npx @leoflores/datadog-cli errors --from 1h --pretty
```
```
npx @leoflores/datadog-cli logs trace --id "abc123def456" --pretty
```
```
npx @leoflores/datadog-cli logs trace --id "abc123def456" --pretty
```
```
npx @leoflores/datadog-cli metrics query --query "avg:system.cpu.user{*}" --from 1h --pretty
```
```
npx @leoflores/datadog-cli metrics query --query "avg:system.cpu.user{*}" --from 1h --pretty
```
```
npx @leoflores/datadog-cli logs compare --query "status:error" --period 1h --pretty
```
```
npx @leoflores/datadog-cli logs compare --query "status:error" --period 1h --pretty
```
```
--pretty
```
```
--output <file>
```
```
--site <site>
```
```
datadoghq.eu
```
```
30m
```
```
1h
```
```
6h
```
```
24h
```
```
7d
```
```
2024-01-15T10:30:00Z
```
```
# 1. Quick error overviewnpx @leoflores/datadog-cli errors --from 1h --pretty# 2. Is this new? Compare to previous periodnpx @leoflores/datadog-cli logs compare --query "status:error" --period 1h --pretty# 3. Find error patternsnpx @leoflores/datadog-cli logs patterns --query "status:error" --from 1h --pretty# 4. Narrow down by servicenpx @leoflores/datadog-cli logs search --query "status:error service:api" --from 1h --pretty# 5. Get context around a timestampnpx @leoflores/datadog-cli logs context --timestamp "2024-01-15T10:30:00Z" --service api --pretty# 6. Follow the distributed tracenpx @leoflores/datadog-cli logs trace --id "TRACE_ID" --pretty
```
```
# 1. Quick error overviewnpx @leoflores/datadog-cli errors --from 1h --pretty# 2. Is this new? Compare to previous periodnpx @leoflores/datadog-cli logs compare --query "status:error" --period 1h --pretty# 3. Find error patternsnpx @leoflores/datadog-cli logs patterns --query "status:error" --from 1h --pretty# 4. Narrow down by servicenpx @leoflores/datadog-cli logs search --query "status:error service:api" --from 1h --pretty# 5. Get context around a timestampnpx @leoflores/datadog-cli logs context --timestamp "2024-01-15T10:30:00Z" --service api --pretty# 6. Follow the distributed tracenpx @leoflores/datadog-cli logs trace --id "TRACE_ID" --pretty
```
Empower your AI coding assistant with the advanced Datadog CLI skill, a critical tool for navigating complex production environments. This skill allows AI agents to directly interact with Datadog's extensive observability platform, facilitating rapid debugging and performance analysis. From sifting through countless log entries to pinpointing critical issues, to querying metrics for system health, this capability transforms how AI assists in maintaining robust applications. It's designed to streamline incident response and proactively monitor system behavior, making your agent an indispensable partner in operational excellence.

# When to Use This Skill
- •Diagnosing live production incidents by searching and tailing application logs.
- •Monitoring the performance and health of microservices and infrastructure using Datadog metrics.
- •Troubleshooting distributed system issues by tracing requests across various services with log context.
- •Identifying common error patterns and trends within high-volume logs to proactively address recurring problems.

# Pro Tips
- 💡Always specify a precise time range (`--from`, `--to`) when searching logs or querying metrics to narrow results and improve efficiency.
- 💡Utilize `logs trace` in conjunction with a trace ID to quickly isolate all logs related to a specific distributed transaction.
- 💡Leverage `logs patterns` after an initial broad search to identify common error messages or trends within high-volume logs.
- 💡Remember to set the `--site` flag for non-US Datadog instances to ensure proper connectivity and data retrieval.

