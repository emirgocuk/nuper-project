# incident-runbook-templates
Source: https://antigravity.codes/agent-skills/devops/incident-runbook-templates

## AI Worker Instructions
When the user requests functionality related to incident-runbook-templates, follow these guidelines and utilize this context.

## Scraped Content

# incident-runbook-templates
```
1. Overview & Impact2. Detection & Alerts3. Initial Triage4. Mitigation Steps5. Root Cause Investigation6. Resolution Procedures7. Verification & Rollback8. Communication Templates9. Escalation Matrix
```
```
1. Overview & Impact2. Detection & Alerts3. Initial Triage4. Mitigation Steps5. Root Cause Investigation6. Resolution Procedures7. Verification & Rollback8. Communication Templates9. Escalation Matrix
```
```
# [Service Name] Outage Runbook## Overview**Service**: Payment Processing Service**Owner**: Platform Team**Slack**: #payments-incidents**PagerDuty**: payments-oncall## Impact Assessment- [ ] Which customers are affected?- [ ] What percentage of traffic is impacted?- [ ] Are there financial implications?- [ ] What's the blast radius?## Detection### Alerts- payment_error_rate > 5% (PagerDuty)- payment_latency_p99 > 2s (Slack)- payment_success_rate < 95% (PagerDuty)### Dashboards- [Payment Service Dashboard](https://grafana/d/payments)- [Error Tracking](https://sentry.io/payments)- [Dependency Status](https://status.stripe.com)## Initial Triage (First 5 Minutes)### 1. Assess Scopebash# Check service healthkubectl get pods -n payments -l app=payment-service# Check recent deploymentskubectl rollout history deployment/payment-service -n payments# Check error ratescurl -s "http://prometheus:9090/api/v1/query?query=sum(rate(http_requests_total{status=~'5..'}[5m]))"
```
```
# [Service Name] Outage Runbook## Overview**Service**: Payment Processing Service**Owner**: Platform Team**Slack**: #payments-incidents**PagerDuty**: payments-oncall## Impact Assessment- [ ] Which customers are affected?- [ ] What percentage of traffic is impacted?- [ ] Are there financial implications?- [ ] What's the blast radius?## Detection### Alerts- payment_error_rate > 5% (PagerDuty)- payment_latency_p99 > 2s (Slack)- payment_success_rate < 95% (PagerDuty)### Dashboards- [Payment Service Dashboard](https://grafana/d/payments)- [Error Tracking](https://sentry.io/payments)- [Dependency Status](https://status.stripe.com)## Initial Triage (First 5 Minutes)### 1. Assess Scope
```
```
# [Service Name] Outage Runbook## Overview**Service**: Payment Processing Service**Owner**: Platform Team**Slack**: #payments-incidents**PagerDuty**: payments-oncall## Impact Assessment- [ ] Which customers are affected?- [ ] What percentage of traffic is impacted?- [ ] Are there financial implications?- [ ] What's the blast radius?## Detection### Alerts-
```
```
(PagerDuty)-
```
```
(Slack)-
```
```
(PagerDuty)### Dashboards- [Payment Service Dashboard](https://grafana/d/payments)- [Error Tracking](https://sentry.io/payments)- [Dependency Status](https://status.stripe.com)## Initial Triage (First 5 Minutes)### 1. Assess Scope
```
```

```
```

```
```
curl -I https://api.company.com/payments/health
```
```
# Step 1: Check pod statuskubectl get pods -n payments# Step 2: If pods are crash-looping, check logskubectl logs -n payments -l app=payment-service --tail=100# Step 3: Check recent deploymentskubectl rollout history deployment/payment-service -n payments# Step 4: ROLLBACK if recent deploy is suspectkubectl rollout undo deployment/payment-service -n payments# Step 5: Scale up if resource constrainedkubectl scale deployment/payment-service -n payments --replicas=10# Step 6: Verify recoverykubectl rollout status deployment/payment-service -n payments
```
```
# Step 1: Check pod statuskubectl get pods -n payments# Step 2: If pods are crash-looping, check logskubectl logs -n payments -l app=payment-service --tail=100# Step 3: Check recent deploymentskubectl rollout history deployment/payment-service -n payments# Step 4: ROLLBACK if recent deploy is suspectkubectl rollout undo deployment/payment-service -n payments# Step 5: Scale up if resource constrainedkubectl scale deployment/payment-service -n payments --replicas=10# Step 6: Verify recoverykubectl rollout status deployment/payment-service -n payments
```
```
# Step 1: Check database connectionskubectl exec -n payments deploy/payment-service -- \  curl localhost:8080/metrics | grep db_pool# Step 2: Check slow queries (if DB issue)psql -h $DB_HOST -U $DB_USER -c "  SELECT pid, now() - query_start AS duration, query  FROM pg_stat_activity  WHERE state = 'active' AND duration > interval '5 seconds'  ORDER BY duration DESC;"# Step 3: Kill long-running queries if neededpsql -h $DB_HOST -U $DB_USER -c "SELECT pg_terminate_backend(pid);"# Step 4: Check external dependency latencycurl -w "@curl-format.txt" -o /dev/null -s https://api.stripe.com/v1/health# Step 5: Enable circuit breaker if dependency is slowkubectl set env deployment/payment-service \  STRIPE_CIRCUIT_BREAKER_ENABLED=true -n payments
```
```
# Step 1: Check database connectionskubectl exec -n payments deploy/payment-service -- \  curl localhost:8080/metrics | grep db_pool# Step 2: Check slow queries (if DB issue)psql -h $DB_HOST -U $DB_USER -c "  SELECT pid, now() - query_start AS duration, query  FROM pg_stat_activity  WHERE state = 'active' AND duration > interval '5 seconds'  ORDER BY duration DESC;"# Step 3: Kill long-running queries if neededpsql -h $DB_HOST -U $DB_USER -c "SELECT pg_terminate_backend(pid);"# Step 4: Check external dependency latencycurl -w "@curl-format.txt" -o /dev/null -s https://api.stripe.com/v1/health# Step 5: Enable circuit breaker if dependency is slowkubectl set env deployment/payment-service \  STRIPE_CIRCUIT_BREAKER_ENABLED=true -n payments
```
```
# Step 1: Identify error patternkubectl logs -n payments -l app=payment-service --tail=500 | \  grep -i error | sort | uniq -c | sort -rn | head -20# Step 2: Check error tracking# Go to Sentry: https://sentry.io/payments# Step 3: If specific endpoint, enable feature flag to disablecurl -X POST https://api.company.com/internal/feature-flags \  -d '{"flag": "DISABLE_PROBLEMATIC_FEATURE", "enabled": true}'# Step 4: If data issue, check recent data changespsql -h $DB_HOST -c "  SELECT * FROM audit_log  WHERE table_name = 'payment_methods'  AND created_at > now() - interval '1 hour';"
```
```
# Step 1: Identify error patternkubectl logs -n payments -l app=payment-service --tail=500 | \  grep -i error | sort | uniq -c | sort -rn | head -20# Step 2: Check error tracking# Go to Sentry: https://sentry.io/payments# Step 3: If specific endpoint, enable feature flag to disablecurl -X POST https://api.company.com/internal/feature-flags \  -d '{"flag": "DISABLE_PROBLEMATIC_FEATURE", "enabled": true}'# Step 4: If data issue, check recent data changespsql -h $DB_HOST -c "  SELECT * FROM audit_log  WHERE table_name = 'payment_methods'  AND created_at > now() - interval '1 hour';"
```
```
# Step 1: Check current request ratekubectl top pods -n payments# Step 2: Scale horizontallykubectl scale deployment/payment-service -n payments --replicas=20# Step 3: Enable rate limitingkubectl set env deployment/payment-service \  RATE_LIMIT_ENABLED=true \  RATE_LIMIT_RPS=1000 -n payments# Step 4: If attack, block suspicious IPskubectl apply -f - <<EOFapiVersion: networking.k8s.io/v1kind: NetworkPolicymetadata:  name: block-suspicious  namespace: paymentsspec:  podSelector:    matchLabels:      app: payment-service  ingress:  - from:    - ipBlock:        cidr: 0.0.0.0/0        except:        - 192.168.1.0/24  # Suspicious rangeEOF
```
```
# Step 1: Check current request ratekubectl top pods -n payments# Step 2: Scale horizontallykubectl scale deployment/payment-service -n payments --replicas=20# Step 3: Enable rate limitingkubectl set env deployment/payment-service \  RATE_LIMIT_ENABLED=true \  RATE_LIMIT_RPS=1000 -n payments# Step 4: If attack, block suspicious IPskubectl apply -f - <<EOFapiVersion: networking.k8s.io/v1kind: NetworkPolicymetadata:  name: block-suspicious  namespace: paymentsspec:  podSelector:    matchLabels:      app: payment-service  ingress:  - from:    - ipBlock:        cidr: 0.0.0.0/0        except:        - 192.168.1.0/24  # Suspicious rangeEOF
```
```
# Verify service is healthycurl -s https://api.company.com/payments/health | jq# Verify error rate is back to normalcurl -s "http://prometheus:9090/api/v1/query?query=sum(rate(http_requests_total{status=~'5..'}[5m]))" | jq '.data.result[0].value[1]'# Verify latency is acceptablecurl -s "http://prometheus:9090/api/v1/query?query=histogram_quantile(0.99,sum(rate(http_request_duration_seconds_bucket[5m]))by(le))" | jq# Smoke test critical flows./scripts/smoke-test-payments.sh
```
```
# Verify service is healthycurl -s https://api.company.com/payments/health | jq# Verify error rate is back to normalcurl -s "http://prometheus:9090/api/v1/query?query=sum(rate(http_requests_total{status=~'5..'}[5m]))" | jq '.data.result[0].value[1]'# Verify latency is acceptablecurl -s "http://prometheus:9090/api/v1/query?query=histogram_quantile(0.99,sum(rate(http_request_duration_seconds_bucket[5m]))by(le))" | jq# Smoke test critical flows./scripts/smoke-test-payments.sh
```
```
# Rollback Kubernetes deploymentkubectl rollout undo deployment/payment-service -n payments# Rollback database migration (if applicable)./scripts/db-rollback.sh $MIGRATION_VERSION# Rollback feature flagcurl -X POST https://api.company.com/internal/feature-flags \  -d '{"flag": "NEW_PAYMENT_FLOW", "enabled": false}'
```
```
# Rollback Kubernetes deploymentkubectl rollout undo deployment/payment-service -n payments# Rollback database migration (if applicable)./scripts/db-rollback.sh $MIGRATION_VERSION# Rollback feature flagcurl -X POST https://api.company.com/internal/feature-flags \  -d '{"flag": "NEW_PAYMENT_FLOW", "enabled": false}'
```
```
🚨 INCIDENT: Payment Service DegradationSeverity: SEV2Status: InvestigatingImpact: ~20% of payment requests failingStart Time: [TIME]Incident Commander: [NAME]Current Actions:- Investigating root cause- Scaling up service- Monitoring dashboardsUpdates in #payments-incidents
```
```
🚨 INCIDENT: Payment Service DegradationSeverity: SEV2Status: InvestigatingImpact: ~20% of payment requests failingStart Time: [TIME]Incident Commander: [NAME]Current Actions:- Investigating root cause- Scaling up service- Monitoring dashboardsUpdates in #payments-incidents
```
```
📊 UPDATE: Payment Service IncidentStatus: MitigatingImpact: Reduced to ~5% failure rateDuration: 25 minutesActions Taken:- Rolled back deployment v2.3.4 → v2.3.3- Scaled service from 5 → 10 replicasNext Steps:- Continuing to monitor- Root cause analysis in progressETA to Resolution: ~15 minutes
```
```
📊 UPDATE: Payment Service IncidentStatus: MitigatingImpact: Reduced to ~5% failure rateDuration: 25 minutesActions Taken:- Rolled back deployment v2.3.4 → v2.3.3- Scaled service from 5 → 10 replicasNext Steps:- Continuing to monitor- Root cause analysis in progressETA to Resolution: ~15 minutes
```
```
✅ RESOLVED: Payment Service IncidentDuration: 45 minutesImpact: ~5,000 affected transactionsRoot Cause: Memory leak in v2.3.4Resolution:- Rolled back to v2.3.3- Transactions auto-retried successfullyFollow-up:- Postmortem scheduled for [DATE]- Bug fix in progress
```
```
✅ RESOLVED: Payment Service IncidentDuration: 45 minutesImpact: ~5,000 affected transactionsRoot Cause: Memory leak in v2.3.4Resolution:- Rolled back to v2.3.3- Transactions auto-retried successfullyFollow-up:- Postmortem scheduled for [DATE]- Bug fix in progress
```
```
### Template 2: Database Incident Runbookmarkdown# Database Incident Runbook## Quick Reference| Issue | Command ||-------|---------|| Check connections |
```
```
### Template 2: Database Incident Runbook
```
```
### Template 2: Database Incident Runbook
```
```
|| Kill query |
```
```
|| Check replication lag |
```
```
|| Check locks |
```
```
|## Connection Pool Exhaustion-- Check current connectionsSELECT datname, usename, state, count(*)FROM pg_stat_activityGROUP BY datname, usename, stateORDER BY count(*) DESC;-- Identify long-running connectionsSELECT pid, usename, datname, state, query_start, queryFROM pg_stat_activityWHERE state != 'idle'ORDER BY query_start;-- Terminate idle connectionsSELECT pg_terminate_backend(pid)FROM pg_stat_activityWHERE state = 'idle'AND query_start < now() - interval '10 minutes';
```
```
-- Check current connectionsSELECT datname, usename, state, count(*)FROM pg_stat_activityGROUP BY datname, usename, stateORDER BY count(*) DESC;-- Identify long-running connectionsSELECT pid, usename, datname, state, query_start, queryFROM pg_stat_activityWHERE state != 'idle'ORDER BY query_start;-- Terminate idle connectionsSELECT pg_terminate_backend(pid)FROM pg_stat_activityWHERE state = 'idle'AND query_start < now() - interval '10 minutes';
```
```
-- Check current connectionsSELECT datname, usename, state, count(*)FROM pg_stat_activityGROUP BY datname, usename, stateORDER BY count(*) DESC;-- Identify long-running connectionsSELECT pid, usename, datname, state, query_start, queryFROM pg_stat_activityWHERE state != 'idle'ORDER BY query_start;-- Terminate idle connectionsSELECT pg_terminate_backend(pid)FROM pg_stat_activityWHERE state = 'idle'AND query_start < now() - interval '10 minutes';
```
```
-- Check lag on replicaSELECT  CASE    WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() THEN 0    ELSE extract(epoch from now() - pg_last_xact_replay_timestamp())  END AS lag_seconds;-- If lag > 60s, consider:-- 1. Check network between primary/replica-- 2. Check replica disk I/O-- 3. Consider failover if unrecoverable
```
```
-- Check lag on replicaSELECT  CASE    WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() THEN 0    ELSE extract(epoch from now() - pg_last_xact_replay_timestamp())  END AS lag_seconds;-- If lag > 60s, consider:-- 1. Check network between primary/replica-- 2. Check replica disk I/O-- 3. Consider failover if unrecoverable
```
```
# Check disk usagedf -h /var/lib/postgresql/data# Find large tablespsql -c "SELECT relname, pg_size_pretty(pg_total_relation_size(relid))FROM pg_catalog.pg_statio_user_tablesORDER BY pg_total_relation_size(relid) DESCLIMIT 10;"# VACUUM to reclaim spacepsql -c "VACUUM FULL large_table;"# If emergency, delete old data or expand disk
```
```
# Check disk usagedf -h /var/lib/postgresql/data# Find large tablespsql -c "SELECT relname, pg_size_pretty(pg_total_relation_size(relid))FROM pg_catalog.pg_statio_user_tablesORDER BY pg_total_relation_size(relid) DESCLIMIT 10;"# VACUUM to reclaim spacepsql -c "VACUUM FULL large_table;"# If emergency, delete old data or expand disk
```
```
## Best Practices### Do's- **Keep runbooks updated** - Review after every incident- **Test runbooks regularly** - Game days, chaos engineering- **Include rollback steps** - Always have an escape hatch- **Document assumptions** - What must be true for steps to work- **Link to dashboards** - Quick access during stress### Don'ts- **Don't assume knowledge** - Write for 3 AM brain- **Don't skip verification** - Confirm each step worked- **Don't forget communication** - Keep stakeholders informed- **Don't work alone** - Escalate early- **Don't skip postmortems** - Learn from every incident## Resources- [Google SRE Book - Incident Management](https://sre.google/sre-book/managing-incidents/)- [PagerDuty Incident Response](https://response.pagerduty.com/)- [Atlassian Incident Management](https://www.atlassian.com/incident-management)
```
```
## Best Practices### Do's- **Keep runbooks updated** - Review after every incident- **Test runbooks regularly** - Game days, chaos engineering- **Include rollback steps** - Always have an escape hatch- **Document assumptions** - What must be true for steps to work- **Link to dashboards** - Quick access during stress### Don'ts- **Don't assume knowledge** - Write for 3 AM brain- **Don't skip verification** - Confirm each step worked- **Don't forget communication** - Keep stakeholders informed- **Don't work alone** - Escalate early- **Don't skip postmortems** - Learn from every incident## Resources- [Google SRE Book - Incident Management](https://sre.google/sre-book/managing-incidents/)- [PagerDuty Incident Response](https://response.pagerduty.com/)- [Atlassian Incident Management](https://www.atlassian.com/incident-management)
```
In the unpredictable world of software operations, a well-defined incident response strategy is paramount. This agent skill provides meticulously crafted incident runbook templates, empowering your team to react swiftly and effectively during critical outages or degradations. By standardizing procedures for detection, triage, mitigation, and communication, it helps minimize downtime, reduce human error, and ensure a consistent approach to incident resolution. Leverage these templates to build resilience into your systems and foster a proactive incident management culture, ultimately safeguarding your services and user trust.

# When to Use This Skill
- •Developing comprehensive incident response plans for new services.
- •Standardizing on-call engineer training and onboarding procedures.
- •Rapidly drafting action plans during an active production incident.
- •Documenting post-incident recovery and verification processes.

# Pro Tips
- 💡Customize templates with service-specific alerts and diagnostic commands for faster triage.
- 💡Integrate communication templates directly into your incident management platform for consistent stakeholder updates.
- 💡Regularly review and update runbooks based on post-incident analyses to ensure they remain effective and current.

