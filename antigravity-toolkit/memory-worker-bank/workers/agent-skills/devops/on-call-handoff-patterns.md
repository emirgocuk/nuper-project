# on-call-handoff-patterns
Source: https://antigravity.codes/agent-skills/devops/on-call-handoff-patterns

## AI Worker Instructions
When the user requests functionality related to on-call-handoff-patterns, follow these guidelines and utilize this context.

## Scraped Content

# on-call-handoff-patterns
```
Recommended: 30 min overlap between shiftsOutgoing:├── 15 min: Write handoff document└── 15 min: Sync call with incomingIncoming:├── 15 min: Review handoff document├── 15 min: Sync call with outgoing└── 5 min: Verify alerting setup
```
```
Recommended: 30 min overlap between shiftsOutgoing:├── 15 min: Write handoff document└── 15 min: Sync call with incomingIncoming:├── 15 min: Review handoff document├── 15 min: Sync call with outgoing└── 5 min: Verify alerting setup
```
```
# On-Call Handoff: Platform Team**Outgoing**: @alice (2024-01-15 to 2024-01-22)**Incoming**: @bob (2024-01-22 to 2024-01-29)**Handoff Time**: 2024-01-22 09:00 UTC---## 🔴 Active Incidents### None currently activeNo active incidents at handoff time.---## 🟡 Ongoing Investigations### 1. Intermittent API Timeouts (ENG-1234)**Status**: Investigating**Started**: 2024-01-20**Impact**: ~0.1% of requests timing out**Context**:- Timeouts correlate with database backup window (02:00-03:00 UTC)- Suspect backup process causing lock contention- Added extra logging in PR #567 (deployed 01/21)**Next Steps**:- [ ] Review new logs after tonight's backup- [ ] Consider moving backup window if confirmed**Resources**:- Dashboard: [API Latency](https://grafana/d/api-latency)- Thread: #platform-eng (01/20, 14:32)---### 2. Memory Growth in Auth Service (ENG-1235)**Status**: Monitoring**Started**: 2024-01-18**Impact**: None yet (proactive)**Context**:- Memory usage growing ~5% per day- No memory leak found in profiling- Suspect connection pool not releasing properly**Next Steps**:- [ ] Review heap dump from 01/21- [ ] Consider restart if usage > 80%**Resources**:- Dashboard: [Auth Service Memory](https://grafana/d/auth-memory)- Analysis doc: [Memory Investigation](https://docs/eng-1235)---## 🟢 Resolved This Shift### Payment Service Outage (2024-01-19)- **Duration**: 23 minutes- **Root Cause**: Database connection exhaustion- **Resolution**: Rolled back v2.3.4, increased pool size- **Postmortem**: [POSTMORTEM-89](https://docs/postmortem-89)- **Follow-up tickets**: ENG-1230, ENG-1231---## 📋 Recent Changes### Deployments| Service      | Version | Time        | Notes                      || ------------ | ------- | ----------- | -------------------------- || api-gateway  | v3.2.1  | 01/21 14:00 | Bug fix for header parsing || user-service | v2.8.0  | 01/20 10:00 | New profile features       || auth-service | v4.1.2  | 01/19 16:00 | Security patch             |### Configuration Changes- 01/21: Increased API rate limit from 1000 to 1500 RPS- 01/20: Updated database connection pool max from 50 to 75### Infrastructure- 01/20: Added 2 nodes to Kubernetes cluster- 01/19: Upgraded Redis from 6.2 to 7.0---## ⚠️ Known Issues & Workarounds### 1. Slow Dashboard Loading**Issue**: Grafana dashboards slow on Monday mornings**Workaround**: Wait 5 min after 08:00 UTC for cache warm-up**Ticket**: OPS-456 (P3)### 2. Flaky Integration Test**Issue**: test_payment_flow fails intermittently in CI**Workaround**: Re-run failed job (usually passes on retry)**Ticket**: ENG-1200 (P2)---## 📅 Upcoming Events| Date        | Event                | Impact              | Contact       || ----------- | -------------------- | ------------------- | ------------- || 01/23 02:00 | Database maintenance | 5 min read-only     | @dba-team     || 01/24 14:00 | Major release v5.0   | Monitor closely     | @release-team || 01/25       | Marketing campaign   | 2x traffic expected | @platform     |---## 📞 Escalation Reminders| Issue Type      | First Escalation     | Second Escalation || --------------- | -------------------- | ----------------- || Payment issues  | @payments-oncall     | @payments-manager || Auth issues     | @auth-oncall         | @security-team    || Database issues | @dba-team            | @infra-manager    || Unknown/severe  | @engineering-manager | @vp-engineering   |---## 🔧 Quick Reference### Common Commandsbash# Check service healthkubectl get pods -A | grep -v Running# Recent deploymentskubectl get events --sort-by='.lastTimestamp' | tail -20# Database connectionspsql -c "SELECT count(*) FROM pg_stat_activity;"# Clear cache (emergency only)redis-cli FLUSHDB
```
```
# On-Call Handoff: Platform Team**Outgoing**: @alice (2024-01-15 to 2024-01-22)**Incoming**: @bob (2024-01-22 to 2024-01-29)**Handoff Time**: 2024-01-22 09:00 UTC---## 🔴 Active Incidents### None currently activeNo active incidents at handoff time.---## 🟡 Ongoing Investigations### 1. Intermittent API Timeouts (ENG-1234)**Status**: Investigating**Started**: 2024-01-20**Impact**: ~0.1% of requests timing out**Context**:- Timeouts correlate with database backup window (02:00-03:00 UTC)- Suspect backup process causing lock contention- Added extra logging in PR #567 (deployed 01/21)**Next Steps**:- [ ] Review new logs after tonight's backup- [ ] Consider moving backup window if confirmed**Resources**:- Dashboard: [API Latency](https://grafana/d/api-latency)- Thread: #platform-eng (01/20, 14:32)---### 2. Memory Growth in Auth Service (ENG-1235)**Status**: Monitoring**Started**: 2024-01-18**Impact**: None yet (proactive)**Context**:- Memory usage growing ~5% per day- No memory leak found in profiling- Suspect connection pool not releasing properly**Next Steps**:- [ ] Review heap dump from 01/21- [ ] Consider restart if usage > 80%**Resources**:- Dashboard: [Auth Service Memory](https://grafana/d/auth-memory)- Analysis doc: [Memory Investigation](https://docs/eng-1235)---## 🟢 Resolved This Shift### Payment Service Outage (2024-01-19)- **Duration**: 23 minutes- **Root Cause**: Database connection exhaustion- **Resolution**: Rolled back v2.3.4, increased pool size- **Postmortem**: [POSTMORTEM-89](https://docs/postmortem-89)- **Follow-up tickets**: ENG-1230, ENG-1231---## 📋 Recent Changes### Deployments| Service      | Version | Time        | Notes                      || ------------ | ------- | ----------- | -------------------------- || api-gateway  | v3.2.1  | 01/21 14:00 | Bug fix for header parsing || user-service | v2.8.0  | 01/20 10:00 | New profile features       || auth-service | v4.1.2  | 01/19 16:00 | Security patch             |### Configuration Changes- 01/21: Increased API rate limit from 1000 to 1500 RPS- 01/20: Updated database connection pool max from 50 to 75### Infrastructure- 01/20: Added 2 nodes to Kubernetes cluster- 01/19: Upgraded Redis from 6.2 to 7.0---## ⚠️ Known Issues & Workarounds### 1. Slow Dashboard Loading**Issue**: Grafana dashboards slow on Monday mornings**Workaround**: Wait 5 min after 08:00 UTC for cache warm-up**Ticket**: OPS-456 (P3)### 2. Flaky Integration Test**Issue**: test_payment_flow fails intermittently in CI**Workaround**: Re-run failed job (usually passes on retry)**Ticket**: ENG-1200 (P2)---## 📅 Upcoming Events| Date        | Event                | Impact              | Contact       || ----------- | -------------------- | ------------------- | ------------- || 01/23 02:00 | Database maintenance | 5 min read-only     | @dba-team     || 01/24 14:00 | Major release v5.0   | Monitor closely     | @release-team || 01/25       | Marketing campaign   | 2x traffic expected | @platform     |---## 📞 Escalation Reminders| Issue Type      | First Escalation     | Second Escalation || --------------- | -------------------- | ----------------- || Payment issues  | @payments-oncall     | @payments-manager || Auth issues     | @auth-oncall         | @security-team    || Database issues | @dba-team            | @infra-manager    || Unknown/severe  | @engineering-manager | @vp-engineering   |---## 🔧 Quick Reference### Common Commands
```
```
# On-Call Handoff: Platform Team**Outgoing**: @alice (2024-01-15 to 2024-01-22)**Incoming**: @bob (2024-01-22 to 2024-01-29)**Handoff Time**: 2024-01-22 09:00 UTC---## 🔴 Active Incidents### None currently activeNo active incidents at handoff time.---## 🟡 Ongoing Investigations### 1. Intermittent API Timeouts (ENG-1234)**Status**: Investigating**Started**: 2024-01-20**Impact**: ~0.1% of requests timing out**Context**:- Timeouts correlate with database backup window (02:00-03:00 UTC)- Suspect backup process causing lock contention- Added extra logging in PR #567 (deployed 01/21)**Next Steps**:- [ ] Review new logs after tonight's backup- [ ] Consider moving backup window if confirmed**Resources**:- Dashboard: [API Latency](https://grafana/d/api-latency)- Thread: #platform-eng (01/20, 14:32)---### 2. Memory Growth in Auth Service (ENG-1235)**Status**: Monitoring**Started**: 2024-01-18**Impact**: None yet (proactive)**Context**:- Memory usage growing ~5% per day- No memory leak found in profiling- Suspect connection pool not releasing properly**Next Steps**:- [ ] Review heap dump from 01/21- [ ] Consider restart if usage > 80%**Resources**:- Dashboard: [Auth Service Memory](https://grafana/d/auth-memory)- Analysis doc: [Memory Investigation](https://docs/eng-1235)---## 🟢 Resolved This Shift### Payment Service Outage (2024-01-19)- **Duration**: 23 minutes- **Root Cause**: Database connection exhaustion- **Resolution**: Rolled back v2.3.4, increased pool size- **Postmortem**: [POSTMORTEM-89](https://docs/postmortem-89)- **Follow-up tickets**: ENG-1230, ENG-1231---## 📋 Recent Changes### Deployments| Service      | Version | Time        | Notes                      || ------------ | ------- | ----------- | -------------------------- || api-gateway  | v3.2.1  | 01/21 14:00 | Bug fix for header parsing || user-service | v2.8.0  | 01/20 10:00 | New profile features       || auth-service | v4.1.2  | 01/19 16:00 | Security patch             |### Configuration Changes- 01/21: Increased API rate limit from 1000 to 1500 RPS- 01/20: Updated database connection pool max from 50 to 75### Infrastructure- 01/20: Added 2 nodes to Kubernetes cluster- 01/19: Upgraded Redis from 6.2 to 7.0---## ⚠️ Known Issues & Workarounds### 1. Slow Dashboard Loading**Issue**: Grafana dashboards slow on Monday mornings**Workaround**: Wait 5 min after 08:00 UTC for cache warm-up**Ticket**: OPS-456 (P3)### 2. Flaky Integration Test**Issue**:
```
```
fails intermittently in CI**Workaround**: Re-run failed job (usually passes on retry)**Ticket**: ENG-1200 (P2)---## 📅 Upcoming Events| Date        | Event                | Impact              | Contact       || ----------- | -------------------- | ------------------- | ------------- || 01/23 02:00 | Database maintenance | 5 min read-only     | @dba-team     || 01/24 14:00 | Major release v5.0   | Monitor closely     | @release-team || 01/25       | Marketing campaign   | 2x traffic expected | @platform     |---## 📞 Escalation Reminders| Issue Type      | First Escalation     | Second Escalation || --------------- | -------------------- | ----------------- || Payment issues  | @payments-oncall     | @payments-manager || Auth issues     | @auth-oncall         | @security-team    || Database issues | @dba-team            | @infra-manager    || Unknown/severe  | @engineering-manager | @vp-engineering   |---## 🔧 Quick Reference### Common Commands
```
```

```
```

```
```
### Template 2: Quick Handoff (Async)markdown# Quick Handoff: @alice → @bob## TL;DR- No active incidents- 1 investigation ongoing (API timeouts, see ENG-1234)- Major release tomorrow (01/24) - be ready for issues## Watch List1. API latency around 02:00-03:00 UTC (backup window)2. Auth service memory (restart if > 80%)## Recent- Deployed api-gateway v3.2.1 yesterday (stable)- Increased rate limits to 1500 RPS## Coming Up- 01/23 02:00 - DB maintenance (5 min read-only)- 01/24 14:00 - v5.0 release## Questions?I'll be available on Slack until 17:00 today.
```
```
### Template 2: Quick Handoff (Async)
```
```
### Template 2: Quick Handoff (Async)
```
```
### Template 3: Incident Handoff (Mid-Incident)
```
```
### Template 3: Incident Handoff (Mid-Incident)
```
```
## Handoff Sync Meeting### Agenda (15 minutes)
```
```
## Handoff Sync Meeting### Agenda (15 minutes)
```
```
## On-Call Best Practices### Before Your Shift
```
```
## On-Call Best Practices### Before Your Shift
```
```
### During Your Shift
```
```
### During Your Shift
```
```
### After Your Shift
```
```
### After Your Shift
```
```
## Escalation Guidelines### When to Escalate
```
```
## Escalation Guidelines### When to Escalate
```
Navigating the complexities of on-call rotations demands meticulous planning and execution, especially during shift transitions. This specialized AI agent skill provides a comprehensive framework for establishing best practices in on-call handoffs. It guides engineers through the crucial steps of transferring incident context, documenting ongoing investigations, and preparing for upcoming system events. By leveraging these patterns, teams can significantly reduce miscommunication, minimize incident resolution times, and ensure seamless continuity in critical system support. Empower your on-call team with the tools to perform efficient and error-free shift changes, fostering a more resilient and responsive operational environment.

# When to Use This Skill
- •Facilitating smooth on-call shift transitions to ensure incident continuity.
- •Generating comprehensive handoff documentation and shift summaries.
- •Developing or refining on-call rotation policies and procedures.
- •Onboarding new engineers to effective on-call practices and expectations.

# Pro Tips
- 💡Integrate handoff documentation with your incident management system for real-time context and historical tracking.
- 💡Conduct regular 'handoff drills' or 'game days' to simulate transitions and identify areas for improvement before a real incident.
- 💡Encourage outgoing engineers to provide a brief verbal summary in addition to written documentation, addressing any nuances not easily captured in text.

