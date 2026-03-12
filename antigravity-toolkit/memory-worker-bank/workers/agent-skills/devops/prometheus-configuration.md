# prometheus-configuration
Source: https://antigravity.codes/agent-skills/devops/prometheus-configuration

## AI Worker Instructions
When the user requests functionality related to prometheus-configuration, follow these guidelines and utilize this context.

## Scraped Content

# prometheus-configuration
```
┌──────────────┐│ Applications │ ← Instrumented with client libraries└──────┬───────┘       │ /metrics endpoint       ↓┌──────────────┐│  Prometheus  │ ← Scrapes metrics periodically│    Server    │└──────┬───────┘       │       ├─→ AlertManager (alerts)       ├─→ Grafana (visualization)       └─→ Long-term storage (Thanos/Cortex)
```
```
┌──────────────┐│ Applications │ ← Instrumented with client libraries└──────┬───────┘       │ /metrics endpoint       ↓┌──────────────┐│  Prometheus  │ ← Scrapes metrics periodically│    Server    │└──────┬───────┘       │       ├─→ AlertManager (alerts)       ├─→ Grafana (visualization)       └─→ Long-term storage (Thanos/Cortex)
```
```
helm repo add prometheus-community https://prometheus-community.github.io/helm-chartshelm repo updatehelm install prometheus prometheus-community/kube-prometheus-stack \  --namespace monitoring \  --create-namespace \  --set prometheus.prometheusSpec.retention=30d \  --set prometheus.prometheusSpec.storageVolumeSize=50Gi
```
```
helm repo add prometheus-community https://prometheus-community.github.io/helm-chartshelm repo updatehelm install prometheus prometheus-community/kube-prometheus-stack \  --namespace monitoring \  --create-namespace \  --set prometheus.prometheusSpec.retention=30d \  --set prometheus.prometheusSpec.storageVolumeSize=50Gi
```
```
version: "3.8"services:  prometheus:    image: prom/prometheus:latest    ports:      - "9090:9090"    volumes:      - ./prometheus.yml:/etc/prometheus/prometheus.yml      - prometheus-data:/prometheus    command:      - "--config.file=/etc/prometheus/prometheus.yml"      - "--storage.tsdb.path=/prometheus"      - "--storage.tsdb.retention.time=30d"volumes:  prometheus-data:
```
```
version: "3.8"services:  prometheus:    image: prom/prometheus:latest    ports:      - "9090:9090"    volumes:      - ./prometheus.yml:/etc/prometheus/prometheus.yml      - prometheus-data:/prometheus    command:      - "--config.file=/etc/prometheus/prometheus.yml"      - "--storage.tsdb.path=/prometheus"      - "--storage.tsdb.retention.time=30d"volumes:  prometheus-data:
```
```
global:  scrape_interval: 15s  evaluation_interval: 15s  external_labels:    cluster: "production"    region: "us-west-2"# Alertmanager configurationalerting:  alertmanagers:    - static_configs:        - targets:            - alertmanager:9093# Load rules filesrule_files:  - /etc/prometheus/rules/*.yml# Scrape configurationsscrape_configs:  # Prometheus itself  - job_name: "prometheus"    static_configs:      - targets: ["localhost:9090"]  # Node exporters  - job_name: "node-exporter"    static_configs:      - targets:          - "node1:9100"          - "node2:9100"          - "node3:9100"    relabel_configs:      - source_labels: [__address__]        target_label: instance        regex: "([^:]+)(:[0-9]+)?"        replacement: "${1}"  # Kubernetes pods with annotations  - job_name: "kubernetes-pods"    kubernetes_sd_configs:      - role: pod    relabel_configs:      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]        action: keep        regex: true      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]        action: replace        target_label: __metrics_path__        regex: (.+)      - source_labels:          [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]        action: replace        regex: ([^:]+)(?::\d+)?;(\d+)        replacement: $1:$2        target_label: __address__      - source_labels: [__meta_kubernetes_namespace]        action: replace        target_label: namespace      - source_labels: [__meta_kubernetes_pod_name]        action: replace        target_label: pod  # Application metrics  - job_name: "my-app"    static_configs:      - targets:          - "app1.example.com:9090"          - "app2.example.com:9090"    metrics_path: "/metrics"    scheme: "https"    tls_config:      ca_file: /etc/prometheus/ca.crt      cert_file: /etc/prometheus/client.crt      key_file: /etc/prometheus/client.key
```
```
global:  scrape_interval: 15s  evaluation_interval: 15s  external_labels:    cluster: "production"    region: "us-west-2"# Alertmanager configurationalerting:  alertmanagers:    - static_configs:        - targets:            - alertmanager:9093# Load rules filesrule_files:  - /etc/prometheus/rules/*.yml# Scrape configurationsscrape_configs:  # Prometheus itself  - job_name: "prometheus"    static_configs:      - targets: ["localhost:9090"]  # Node exporters  - job_name: "node-exporter"    static_configs:      - targets:          - "node1:9100"          - "node2:9100"          - "node3:9100"    relabel_configs:      - source_labels: [__address__]        target_label: instance        regex: "([^:]+)(:[0-9]+)?"        replacement: "${1}"  # Kubernetes pods with annotations  - job_name: "kubernetes-pods"    kubernetes_sd_configs:      - role: pod    relabel_configs:      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]        action: keep        regex: true      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]        action: replace        target_label: __metrics_path__        regex: (.+)      - source_labels:          [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]        action: replace        regex: ([^:]+)(?::\d+)?;(\d+)        replacement: $1:$2        target_label: __address__      - source_labels: [__meta_kubernetes_namespace]        action: replace        target_label: namespace      - source_labels: [__meta_kubernetes_pod_name]        action: replace        target_label: pod  # Application metrics  - job_name: "my-app"    static_configs:      - targets:          - "app1.example.com:9090"          - "app2.example.com:9090"    metrics_path: "/metrics"    scheme: "https"    tls_config:      ca_file: /etc/prometheus/ca.crt      cert_file: /etc/prometheus/client.crt      key_file: /etc/prometheus/client.key
```
```
assets/prometheus.yml.template
```
```
scrape_configs:  - job_name: "static-targets"    static_configs:      - targets: ["host1:9100", "host2:9100"]        labels:          env: "production"          region: "us-west-2"
```
```
scrape_configs:  - job_name: "static-targets"    static_configs:      - targets: ["host1:9100", "host2:9100"]        labels:          env: "production"          region: "us-west-2"
```
```
scrape_configs:  - job_name: "file-sd"    file_sd_configs:      - files:          - /etc/prometheus/targets/*.json          - /etc/prometheus/targets/*.yml        refresh_interval: 5m
```
```
scrape_configs:  - job_name: "file-sd"    file_sd_configs:      - files:          - /etc/prometheus/targets/*.json          - /etc/prometheus/targets/*.yml        refresh_interval: 5m
```
```
[  {    "targets": ["app1:9090", "app2:9090"],    "labels": {      "env": "production",      "service": "api"    }  }]
```
```
[  {    "targets": ["app1:9090", "app2:9090"],    "labels": {      "env": "production",      "service": "api"    }  }]
```
```
scrape_configs:  - job_name: "kubernetes-services"    kubernetes_sd_configs:      - role: service    relabel_configs:      - source_labels:          [__meta_kubernetes_service_annotation_prometheus_io_scrape]        action: keep        regex: true      - source_labels:          [__meta_kubernetes_service_annotation_prometheus_io_scheme]        action: replace        target_label: __scheme__        regex: (https?)      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]        action: replace        target_label: __metrics_path__        regex: (.+)
```
```
scrape_configs:  - job_name: "kubernetes-services"    kubernetes_sd_configs:      - role: service    relabel_configs:      - source_labels:          [__meta_kubernetes_service_annotation_prometheus_io_scrape]        action: keep        regex: true      - source_labels:          [__meta_kubernetes_service_annotation_prometheus_io_scheme]        action: replace        target_label: __scheme__        regex: (https?)      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]        action: replace        target_label: __metrics_path__        regex: (.+)
```
```
references/scrape-configs.md
```
```
# /etc/prometheus/rules/recording_rules.ymlgroups:  - name: api_metrics    interval: 15s    rules:      # HTTP request rate per service      - record: job:http_requests:rate5m        expr: sum by (job) (rate(http_requests_total[5m]))      # Error rate percentage      - record: job:http_requests_errors:rate5m        expr: sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))      - record: job:http_requests_error_rate:percentage        expr: |          (job:http_requests_errors:rate5m / job:http_requests:rate5m) * 100      # P95 latency      - record: job:http_request_duration:p95        expr: |          histogram_quantile(0.95,            sum by (job, le) (rate(http_request_duration_seconds_bucket[5m]))          )  - name: resource_metrics    interval: 30s    rules:      # CPU utilization percentage      - record: instance:node_cpu:utilization        expr: |          100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)      # Memory utilization percentage      - record: instance:node_memory:utilization        expr: |          100 - ((node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100)      # Disk usage percentage      - record: instance:node_disk:utilization        expr: |          100 - ((node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100)
```
```
# /etc/prometheus/rules/recording_rules.ymlgroups:  - name: api_metrics    interval: 15s    rules:      # HTTP request rate per service      - record: job:http_requests:rate5m        expr: sum by (job) (rate(http_requests_total[5m]))      # Error rate percentage      - record: job:http_requests_errors:rate5m        expr: sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))      - record: job:http_requests_error_rate:percentage        expr: |          (job:http_requests_errors:rate5m / job:http_requests:rate5m) * 100      # P95 latency      - record: job:http_request_duration:p95        expr: |          histogram_quantile(0.95,            sum by (job, le) (rate(http_request_duration_seconds_bucket[5m]))          )  - name: resource_metrics    interval: 30s    rules:      # CPU utilization percentage      - record: instance:node_cpu:utilization        expr: |          100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)      # Memory utilization percentage      - record: instance:node_memory:utilization        expr: |          100 - ((node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100)      # Disk usage percentage      - record: instance:node_disk:utilization        expr: |          100 - ((node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100)
```
```
references/recording-rules.md
```
```
# /etc/prometheus/rules/alert_rules.ymlgroups:  - name: availability    interval: 30s    rules:      - alert: ServiceDown        expr: up{job="my-app"} == 0        for: 1m        labels:          severity: critical        annotations:          summary: "Service {{ $labels.instance }} is down"          description: "{{ $labels.job }} has been down for more than 1 minute"      - alert: HighErrorRate        expr: job:http_requests_error_rate:percentage > 5        for: 5m        labels:          severity: warning        annotations:          summary: "High error rate for {{ $labels.job }}"          description: "Error rate is {{ $value }}% (threshold: 5%)"      - alert: HighLatency        expr: job:http_request_duration:p95 > 1        for: 5m        labels:          severity: warning        annotations:          summary: "High latency for {{ $labels.job }}"          description: "P95 latency is {{ $value }}s (threshold: 1s)"  - name: resources    interval: 1m    rules:      - alert: HighCPUUsage        expr: instance:node_cpu:utilization > 80        for: 5m        labels:          severity: warning        annotations:          summary: "High CPU usage on {{ $labels.instance }}"          description: "CPU usage is {{ $value }}%"      - alert: HighMemoryUsage        expr: instance:node_memory:utilization > 85        for: 5m        labels:          severity: warning        annotations:          summary: "High memory usage on {{ $labels.instance }}"          description: "Memory usage is {{ $value }}%"      - alert: DiskSpaceLow        expr: instance:node_disk:utilization > 90        for: 5m        labels:          severity: critical        annotations:          summary: "Low disk space on {{ $labels.instance }}"          description: "Disk usage is {{ $value }}%"
```
```
# /etc/prometheus/rules/alert_rules.ymlgroups:  - name: availability    interval: 30s    rules:      - alert: ServiceDown        expr: up{job="my-app"} == 0        for: 1m        labels:          severity: critical        annotations:          summary: "Service {{ $labels.instance }} is down"          description: "{{ $labels.job }} has been down for more than 1 minute"      - alert: HighErrorRate        expr: job:http_requests_error_rate:percentage > 5        for: 5m        labels:          severity: warning        annotations:          summary: "High error rate for {{ $labels.job }}"          description: "Error rate is {{ $value }}% (threshold: 5%)"      - alert: HighLatency        expr: job:http_request_duration:p95 > 1        for: 5m        labels:          severity: warning        annotations:          summary: "High latency for {{ $labels.job }}"          description: "P95 latency is {{ $value }}s (threshold: 1s)"  - name: resources    interval: 1m    rules:      - alert: HighCPUUsage        expr: instance:node_cpu:utilization > 80        for: 5m        labels:          severity: warning        annotations:          summary: "High CPU usage on {{ $labels.instance }}"          description: "CPU usage is {{ $value }}%"      - alert: HighMemoryUsage        expr: instance:node_memory:utilization > 85        for: 5m        labels:          severity: warning        annotations:          summary: "High memory usage on {{ $labels.instance }}"          description: "Memory usage is {{ $value }}%"      - alert: DiskSpaceLow        expr: instance:node_disk:utilization > 90        for: 5m        labels:          severity: critical        annotations:          summary: "Low disk space on {{ $labels.instance }}"          description: "Disk usage is {{ $value }}%"
```
```
# Validate configurationpromtool check config prometheus.yml# Validate rulespromtool check rules /etc/prometheus/rules/*.yml# Test querypromtool query instant http://localhost:9090 'up'
```
```
# Validate configurationpromtool check config prometheus.yml# Validate rulespromtool check rules /etc/prometheus/rules/*.yml# Test querypromtool query instant http://localhost:9090 'up'
```
```
scripts/validate-prometheus.sh
```
```
curl http://localhost:9090/api/v1/targets
```
```
curl http://localhost:9090/api/v1/targets
```
```
curl http://localhost:9090/api/v1/status/config
```
```
curl http://localhost:9090/api/v1/status/config
```
```
curl 'http://localhost:9090/api/v1/query?query=up'
```
```
curl 'http://localhost:9090/api/v1/query?query=up'
```
```
assets/prometheus.yml.template
```
```
references/scrape-configs.md
```
```
references/recording-rules.md
```
```
scripts/validate-prometheus.sh
```
```
grafana-dashboards
```
```
slo-implementation
```
```
distributed-tracing
```
This agent skill provides a comprehensive guide to implementing Prometheus for effective system and application monitoring. It delves into the architectural components, installation procedures across various environments like Kubernetes and Docker, and essential configuration aspects. Users will learn how to set up metric scraping, define recording rules, design robust alert policies, and integrate with visualization tools like Grafana. Leverage this skill to ensure high observability and proactive issue detection within your infrastructure, transforming raw data into actionable insights for improved reliability.

# When to Use This Skill
- •Setting up a new monitoring stack for a Kubernetes cluster using Prometheus and Helm.
- •Configuring custom metric scraping jobs for new microservices or applications.
- •Defining recording rules to pre-aggregate metrics for faster dashboard queries and reduced load.
- •Implementing alert rules to notify teams about critical incidents and performance anomalies.

# Pro Tips
- 💡Prioritize Service Discovery: Instead of manual scrape configurations, leverage Prometheus's service discovery mechanisms (e.g., Kubernetes SD, EC2 SD) to dynamically discover targets and reduce configuration overhead.
- 💡Optimize Storage and Retention: Carefully plan your storage allocation and retention policies. Use downsampling with tools like Thanos or Cortex for long-term storage to balance cost and historical data needs.
- 💡Refine Alerting: Design your alert rules with clear thresholds and effective notification channels. Use `for` clauses to prevent flapping alerts and ensure alerts are actionable.

