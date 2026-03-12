# grafana-dashboards
Source: https://antigravity.codes/agent-skills/devops/grafana-dashboards

## AI Worker Instructions
When the user requests functionality related to grafana-dashboards, follow these guidelines and utilize this context.

## Scraped Content

# grafana-dashboards
```
┌─────────────────────────────────────┐│  Critical Metrics (Big Numbers)     │├─────────────────────────────────────┤│  Key Trends (Time Series)           │├─────────────────────────────────────┤│  Detailed Metrics (Tables/Heatmaps) │└─────────────────────────────────────┘
```
```
┌─────────────────────────────────────┐│  Critical Metrics (Big Numbers)     │├─────────────────────────────────────┤│  Key Trends (Time Series)           │├─────────────────────────────────────┤│  Detailed Metrics (Tables/Heatmaps) │└─────────────────────────────────────┘
```
```
{  "dashboard": {    "title": "API Monitoring",    "tags": ["api", "production"],    "timezone": "browser",    "refresh": "30s",    "panels": [      {        "title": "Request Rate",        "type": "graph",        "targets": [          {            "expr": "sum(rate(http_requests_total[5m])) by (service)",            "legendFormat": "{{service}}"          }        ],        "gridPos": { "x": 0, "y": 0, "w": 12, "h": 8 }      },      {        "title": "Error Rate %",        "type": "graph",        "targets": [          {            "expr": "(sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))) * 100",            "legendFormat": "Error Rate"          }        ],        "alert": {          "conditions": [            {              "evaluator": { "params": [5], "type": "gt" },              "operator": { "type": "and" },              "query": { "params": ["A", "5m", "now"] },              "type": "query"            }          ]        },        "gridPos": { "x": 12, "y": 0, "w": 12, "h": 8 }      },      {        "title": "P95 Latency",        "type": "graph",        "targets": [          {            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))",            "legendFormat": "{{service}}"          }        ],        "gridPos": { "x": 0, "y": 8, "w": 24, "h": 8 }      }    ]  }}
```
```
{  "dashboard": {    "title": "API Monitoring",    "tags": ["api", "production"],    "timezone": "browser",    "refresh": "30s",    "panels": [      {        "title": "Request Rate",        "type": "graph",        "targets": [          {            "expr": "sum(rate(http_requests_total[5m])) by (service)",            "legendFormat": "{{service}}"          }        ],        "gridPos": { "x": 0, "y": 0, "w": 12, "h": 8 }      },      {        "title": "Error Rate %",        "type": "graph",        "targets": [          {            "expr": "(sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))) * 100",            "legendFormat": "Error Rate"          }        ],        "alert": {          "conditions": [            {              "evaluator": { "params": [5], "type": "gt" },              "operator": { "type": "and" },              "query": { "params": ["A", "5m", "now"] },              "type": "query"            }          ]        },        "gridPos": { "x": 12, "y": 0, "w": 12, "h": 8 }      },      {        "title": "P95 Latency",        "type": "graph",        "targets": [          {            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))",            "legendFormat": "{{service}}"          }        ],        "gridPos": { "x": 0, "y": 8, "w": 24, "h": 8 }      }    ]  }}
```
```
assets/api-dashboard.json
```
```
{  "type": "stat",  "title": "Total Requests",  "targets": [    {      "expr": "sum(http_requests_total)"    }  ],  "options": {    "reduceOptions": {      "values": false,      "calcs": ["lastNotNull"]    },    "orientation": "auto",    "textMode": "auto",    "colorMode": "value"  },  "fieldConfig": {    "defaults": {      "thresholds": {        "mode": "absolute",        "steps": [          { "value": 0, "color": "green" },          { "value": 80, "color": "yellow" },          { "value": 90, "color": "red" }        ]      }    }  }}
```
```
{  "type": "stat",  "title": "Total Requests",  "targets": [    {      "expr": "sum(http_requests_total)"    }  ],  "options": {    "reduceOptions": {      "values": false,      "calcs": ["lastNotNull"]    },    "orientation": "auto",    "textMode": "auto",    "colorMode": "value"  },  "fieldConfig": {    "defaults": {      "thresholds": {        "mode": "absolute",        "steps": [          { "value": 0, "color": "green" },          { "value": 80, "color": "yellow" },          { "value": 90, "color": "red" }        ]      }    }  }}
```
```
{  "type": "graph",  "title": "CPU Usage",  "targets": [    {      "expr": "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)"    }  ],  "yaxes": [    { "format": "percent", "max": 100, "min": 0 },    { "format": "short" }  ]}
```
```
{  "type": "graph",  "title": "CPU Usage",  "targets": [    {      "expr": "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)"    }  ],  "yaxes": [    { "format": "percent", "max": 100, "min": 0 },    { "format": "short" }  ]}
```
```
{  "type": "table",  "title": "Service Status",  "targets": [    {      "expr": "up",      "format": "table",      "instant": true    }  ],  "transformations": [    {      "id": "organize",      "options": {        "excludeByName": { "Time": true },        "indexByName": {},        "renameByName": {          "instance": "Instance",          "job": "Service",          "Value": "Status"        }      }    }  ]}
```
```
{  "type": "table",  "title": "Service Status",  "targets": [    {      "expr": "up",      "format": "table",      "instant": true    }  ],  "transformations": [    {      "id": "organize",      "options": {        "excludeByName": { "Time": true },        "indexByName": {},        "renameByName": {          "instance": "Instance",          "job": "Service",          "Value": "Status"        }      }    }  ]}
```
```
{  "type": "heatmap",  "title": "Latency Heatmap",  "targets": [    {      "expr": "sum(rate(http_request_duration_seconds_bucket[5m])) by (le)",      "format": "heatmap"    }  ],  "dataFormat": "tsbuckets",  "yAxis": {    "format": "s"  }}
```
```
{  "type": "heatmap",  "title": "Latency Heatmap",  "targets": [    {      "expr": "sum(rate(http_request_duration_seconds_bucket[5m])) by (le)",      "format": "heatmap"    }  ],  "dataFormat": "tsbuckets",  "yAxis": {    "format": "s"  }}
```
```
{  "templating": {    "list": [      {        "name": "namespace",        "type": "query",        "datasource": "Prometheus",        "query": "label_values(kube_pod_info, namespace)",        "refresh": 1,        "multi": false      },      {        "name": "service",        "type": "query",        "datasource": "Prometheus",        "query": "label_values(kube_service_info{namespace=\"$namespace\"}, service)",        "refresh": 1,        "multi": true      }    ]  }}
```
```
{  "templating": {    "list": [      {        "name": "namespace",        "type": "query",        "datasource": "Prometheus",        "query": "label_values(kube_pod_info, namespace)",        "refresh": 1,        "multi": false      },      {        "name": "service",        "type": "query",        "datasource": "Prometheus",        "query": "label_values(kube_service_info{namespace=\"$namespace\"}, service)",        "refresh": 1,        "multi": true      }    ]  }}
```
```
sum(rate(http_requests_total{namespace="$namespace", service=~"$service"}[5m]))
```
```
sum(rate(http_requests_total{namespace="$namespace", service=~"$service"}[5m]))
```
```
{  "alert": {    "name": "High Error Rate",    "conditions": [      {        "evaluator": {          "params": [5],          "type": "gt"        },        "operator": { "type": "and" },        "query": {          "params": ["A", "5m", "now"]        },        "reducer": { "type": "avg" },        "type": "query"      }    ],    "executionErrorState": "alerting",    "for": "5m",    "frequency": "1m",    "message": "Error rate is above 5%",    "noDataState": "no_data",    "notifications": [{ "uid": "slack-channel" }]  }}
```
```
{  "alert": {    "name": "High Error Rate",    "conditions": [      {        "evaluator": {          "params": [5],          "type": "gt"        },        "operator": { "type": "and" },        "query": {          "params": ["A", "5m", "now"]        },        "reducer": { "type": "avg" },        "type": "query"      }    ],    "executionErrorState": "alerting",    "for": "5m",    "frequency": "1m",    "message": "Error rate is above 5%",    "noDataState": "no_data",    "notifications": [{ "uid": "slack-channel" }]  }}
```
```
apiVersion: 1providers:  - name: "default"    orgId: 1    folder: "General"    type: file    disableDeletion: false    updateIntervalSeconds: 10    allowUiUpdates: true    options:      path: /etc/grafana/dashboards
```
```
apiVersion: 1providers:  - name: "default"    orgId: 1    folder: "General"    type: file    disableDeletion: false    updateIntervalSeconds: 10    allowUiUpdates: true    options:      path: /etc/grafana/dashboards
```
```
assets/infrastructure-dashboard.json
```
```
assets/database-dashboard.json
```
```
resource "grafana_dashboard" "api_monitoring" {  config_json = file("${path.module}/dashboards/api-monitoring.json")  folder      = grafana_folder.monitoring.id}resource "grafana_folder" "monitoring" {  title = "Production Monitoring"}
```
```
resource "grafana_dashboard" "api_monitoring" {  config_json = file("${path.module}/dashboards/api-monitoring.json")  folder      = grafana_folder.monitoring.id}resource "grafana_folder" "monitoring" {  title = "Production Monitoring"}
```
```
- name: Deploy Grafana dashboards  copy:    src: "{{ item }}"    dest: /etc/grafana/dashboards/  with_fileglob:    - "dashboards/*.json"  notify: restart grafana
```
```
- name: Deploy Grafana dashboards  copy:    src: "{{ item }}"    dest: /etc/grafana/dashboards/  with_fileglob:    - "dashboards/*.json"  notify: restart grafana
```
```
assets/api-dashboard.json
```
```
assets/infrastructure-dashboard.json
```
```
assets/database-dashboard.json
```
```
references/dashboard-design.md
```
```
prometheus-configuration
```
```
slo-implementation
```
Empower your development workflow with the Grafana Dashboards AI Agent Skill. This advanced capability allows you to effortlessly design, deploy, and manage sophisticated Grafana dashboards tailored to your specific monitoring needs. Leverage AI to interpret complex metric data, identify critical trends, and ensure your systems maintain peak performance. From infrastructure health to business KPIs, this skill streamlines the creation of actionable visualizations, transforming raw data into clear, insightful operational intelligence. Enhance your team's ability to react proactively and maintain robust observability across all your applications and services.

# When to Use This Skill
- •Designing monitoring dashboards for new microservices and applications.
- •Visualizing Prometheus, influxDB, or other time-series database metrics.
- •Creating Executive or SLO (Service Level Objective) dashboards for key services.
- •Tracking business-specific Key Performance Indicators (KPIs) in real-time.

# Pro Tips
- 💡Start by applying the RED (Rate, Errors, Duration) or USE (Utilization, Saturation, Errors) methods to structure your initial panels for immediate impact and clarity.
- 💡Utilize Grafana's templating variables extensively to create dynamic dashboards that can adapt to different services, environments, or instances with minimal duplication.
- 💡Integrate alert rules directly within your Grafana panels to ensure that critical thresholds or anomalies automatically trigger notifications to your team.

