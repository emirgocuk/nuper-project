# slo-implementation
Source: https://antigravity.codes/agent-skills/devops/slo-implementation

## AI Worker Instructions
When the user requests functionality related to slo-implementation, follow these guidelines and utilize this context.

## Scraped Content

# slo-implementation
```
SLA (Service Level Agreement)  ↓ Contract with customersSLO (Service Level Objective)  ↓ Internal reliability targetSLI (Service Level Indicator)  ↓ Actual measurement
```
```
SLA (Service Level Agreement)  ↓ Contract with customersSLO (Service Level Objective)  ↓ Internal reliability targetSLI (Service Level Indicator)  ↓ Actual measurement
```
```
# Successful requests / Total requestssum(rate(http_requests_total{status!~"5.."}[28d]))/sum(rate(http_requests_total[28d]))
```
```
# Successful requests / Total requestssum(rate(http_requests_total{status!~"5.."}[28d]))/sum(rate(http_requests_total[28d]))
```
```
# Requests below latency threshold / Total requestssum(rate(http_request_duration_seconds_bucket{le="0.5"}[28d]))/sum(rate(http_request_duration_seconds_count[28d]))
```
```
# Requests below latency threshold / Total requestssum(rate(http_request_duration_seconds_bucket{le="0.5"}[28d]))/sum(rate(http_request_duration_seconds_count[28d]))
```
```
# Successful writes / Total writessum(storage_writes_successful_total)/sum(storage_writes_total)
```
```
# Successful writes / Total writessum(storage_writes_successful_total)/sum(storage_writes_total)
```
```
references/slo-definitions.md
```
```
slos:  - name: api_availability    target: 99.9    window: 28d    sli: |      sum(rate(http_requests_total{status!~"5.."}[28d]))      /      sum(rate(http_requests_total[28d]))  - name: api_latency_p95    target: 99    window: 28d    sli: |      sum(rate(http_request_duration_seconds_bucket{le="0.5"}[28d]))      /      sum(rate(http_request_duration_seconds_count[28d]))
```
```
slos:  - name: api_availability    target: 99.9    window: 28d    sli: |      sum(rate(http_requests_total{status!~"5.."}[28d]))      /      sum(rate(http_requests_total[28d]))  - name: api_latency_p95    target: 99    window: 28d    sli: |      sum(rate(http_request_duration_seconds_bucket{le="0.5"}[28d]))      /      sum(rate(http_request_duration_seconds_count[28d]))
```
```
Error Budget = 1 - SLO Target
```
```
Error Budget = 1 - SLO Target
```
```
error_budget_policy:  - remaining_budget: 100%    action: Normal development velocity  - remaining_budget: 50%    action: Consider postponing risky changes  - remaining_budget: 10%    action: Freeze non-critical changes  - remaining_budget: 0%    action: Feature freeze, focus on reliability
```
```
error_budget_policy:  - remaining_budget: 100%    action: Normal development velocity  - remaining_budget: 50%    action: Consider postponing risky changes  - remaining_budget: 10%    action: Freeze non-critical changes  - remaining_budget: 0%    action: Feature freeze, focus on reliability
```
```
references/error-budget.md
```
```
# SLI Recording Rulesgroups:  - name: sli_rules    interval: 30s    rules:      # Availability SLI      - record: sli:http_availability:ratio        expr: |          sum(rate(http_requests_total{status!~"5.."}[28d]))          /          sum(rate(http_requests_total[28d]))      # Latency SLI (requests < 500ms)      - record: sli:http_latency:ratio        expr: |          sum(rate(http_request_duration_seconds_bucket{le="0.5"}[28d]))          /          sum(rate(http_request_duration_seconds_count[28d]))  - name: slo_rules    interval: 5m    rules:      # SLO compliance (1 = meeting SLO, 0 = violating)      - record: slo:http_availability:compliance        expr: sli:http_availability:ratio >= bool 0.999      - record: slo:http_latency:compliance        expr: sli:http_latency:ratio >= bool 0.99      # Error budget remaining (percentage)      - record: slo:http_availability:error_budget_remaining        expr: |          (sli:http_availability:ratio - 0.999) / (1 - 0.999) * 100      # Error budget burn rate      - record: slo:http_availability:burn_rate_5m        expr: |          (1 - (            sum(rate(http_requests_total{status!~"5.."}[5m]))            /            sum(rate(http_requests_total[5m]))          )) / (1 - 0.999)
```
```
# SLI Recording Rulesgroups:  - name: sli_rules    interval: 30s    rules:      # Availability SLI      - record: sli:http_availability:ratio        expr: |          sum(rate(http_requests_total{status!~"5.."}[28d]))          /          sum(rate(http_requests_total[28d]))      # Latency SLI (requests < 500ms)      - record: sli:http_latency:ratio        expr: |          sum(rate(http_request_duration_seconds_bucket{le="0.5"}[28d]))          /          sum(rate(http_request_duration_seconds_count[28d]))  - name: slo_rules    interval: 5m    rules:      # SLO compliance (1 = meeting SLO, 0 = violating)      - record: slo:http_availability:compliance        expr: sli:http_availability:ratio >= bool 0.999      - record: slo:http_latency:compliance        expr: sli:http_latency:ratio >= bool 0.99      # Error budget remaining (percentage)      - record: slo:http_availability:error_budget_remaining        expr: |          (sli:http_availability:ratio - 0.999) / (1 - 0.999) * 100      # Error budget burn rate      - record: slo:http_availability:burn_rate_5m        expr: |          (1 - (            sum(rate(http_requests_total{status!~"5.."}[5m]))            /            sum(rate(http_requests_total[5m]))          )) / (1 - 0.999)
```
```
groups:  - name: slo_alerts    interval: 1m    rules:      # Fast burn: 14.4x rate, 1 hour window      # Consumes 2% error budget in 1 hour      - alert: SLOErrorBudgetBurnFast        expr: |          slo:http_availability:burn_rate_1h > 14.4          and          slo:http_availability:burn_rate_5m > 14.4        for: 2m        labels:          severity: critical        annotations:          summary: "Fast error budget burn detected"          description: "Error budget burning at {{ $value }}x rate"      # Slow burn: 6x rate, 6 hour window      # Consumes 5% error budget in 6 hours      - alert: SLOErrorBudgetBurnSlow        expr: |          slo:http_availability:burn_rate_6h > 6          and          slo:http_availability:burn_rate_30m > 6        for: 15m        labels:          severity: warning        annotations:          summary: "Slow error budget burn detected"          description: "Error budget burning at {{ $value }}x rate"      # Error budget exhausted      - alert: SLOErrorBudgetExhausted        expr: slo:http_availability:error_budget_remaining < 0        for: 5m        labels:          severity: critical        annotations:          summary: "SLO error budget exhausted"          description: "Error budget remaining: {{ $value }}%"
```
```
groups:  - name: slo_alerts    interval: 1m    rules:      # Fast burn: 14.4x rate, 1 hour window      # Consumes 2% error budget in 1 hour      - alert: SLOErrorBudgetBurnFast        expr: |          slo:http_availability:burn_rate_1h > 14.4          and          slo:http_availability:burn_rate_5m > 14.4        for: 2m        labels:          severity: critical        annotations:          summary: "Fast error budget burn detected"          description: "Error budget burning at {{ $value }}x rate"      # Slow burn: 6x rate, 6 hour window      # Consumes 5% error budget in 6 hours      - alert: SLOErrorBudgetBurnSlow        expr: |          slo:http_availability:burn_rate_6h > 6          and          slo:http_availability:burn_rate_30m > 6        for: 15m        labels:          severity: warning        annotations:          summary: "Slow error budget burn detected"          description: "Error budget burning at {{ $value }}x rate"      # Error budget exhausted      - alert: SLOErrorBudgetExhausted        expr: slo:http_availability:error_budget_remaining < 0        for: 5m        labels:          severity: critical        annotations:          summary: "SLO error budget exhausted"          description: "Error budget remaining: {{ $value }}%"
```
```
┌────────────────────────────────────┐│ SLO Compliance (Current)           ││ ✓ 99.95% (Target: 99.9%)          │├────────────────────────────────────┤│ Error Budget Remaining: 65%        ││ ████████░░ 65%                     │├────────────────────────────────────┤│ SLI Trend (28 days)                ││ [Time series graph]                │├────────────────────────────────────┤│ Burn Rate Analysis                 ││ [Burn rate by time window]         │└────────────────────────────────────┘
```
```
┌────────────────────────────────────┐│ SLO Compliance (Current)           ││ ✓ 99.95% (Target: 99.9%)          │├────────────────────────────────────┤│ Error Budget Remaining: 65%        ││ ████████░░ 65%                     │├────────────────────────────────────┤│ SLI Trend (28 days)                ││ [Time series graph]                │├────────────────────────────────────┤│ Burn Rate Analysis                 ││ [Burn rate by time window]         │└────────────────────────────────────┘
```
```
# Current SLO compliancesli:http_availability:ratio * 100# Error budget remainingslo:http_availability:error_budget_remaining# Days until error budget exhausted (at current burn rate)(slo:http_availability:error_budget_remaining / 100)*28/(1 - sli:http_availability:ratio) * (1 - 0.999)
```
```
# Current SLO compliancesli:http_availability:ratio * 100# Error budget remainingslo:http_availability:error_budget_remaining# Days until error budget exhausted (at current burn rate)(slo:http_availability:error_budget_remaining / 100)*28/(1 - sli:http_availability:ratio) * (1 - 0.999)
```
```
# Combination of short and long windows reduces false positivesrules:  - alert: SLOBurnRateHigh    expr: |      (        slo:http_availability:burn_rate_1h > 14.4        and        slo:http_availability:burn_rate_5m > 14.4      )      or      (        slo:http_availability:burn_rate_6h > 6        and        slo:http_availability:burn_rate_30m > 6      )    labels:      severity: critical
```
```
# Combination of short and long windows reduces false positivesrules:  - alert: SLOBurnRateHigh    expr: |      (        slo:http_availability:burn_rate_1h > 14.4        and        slo:http_availability:burn_rate_5m > 14.4      )      or      (        slo:http_availability:burn_rate_6h > 6        and        slo:http_availability:burn_rate_30m > 6      )    labels:      severity: critical
```
```
assets/slo-template.md
```
```
references/slo-definitions.md
```
```
references/error-budget.md
```
```
prometheus-configuration
```
```
grafana-dashboards
```
Leverage this specialized agent skill to proficiently establish and manage Service Level Objectives (SLOs) within your development workflow. Designed to streamline the often-complex process of defining Service Level Indicators (SLIs), calculating error budgets, and setting up proactive alerting, this skill empowers your team to balance innovation with critical reliability goals. By automating key aspects of SRE practices, you can ensure consistent service performance and maintain user trust, turning abstract reliability concepts into actionable, measurable targets for your systems.

# When to Use This Skill
- •Define comprehensive service reliability targets for a new microservice or application.
- •Implement and track error budgets to manage acceptable rates of failure or degradation.
- •Establish or refine SRE (Site Reliability Engineering) practices within a development team.
- •Create and configure SLO-based alerts to ensure timely responses to reliability breaches.

# Pro Tips
- 💡Always cross-reference generated PromQL queries with your specific monitoring system's documentation to ensure syntax and metric names are accurate for your environment.
- 💡Utilize the agent to generate initial SLO documentation outlines, then collaborate with your team to refine the human-readable context and business impact for each objective.
- 💡When defining SLIs, guide the agent to focus on user-centric metrics (e.g., successful requests from the user's perspective) rather than purely internal system health, for a more accurate reflection of customer experience.

