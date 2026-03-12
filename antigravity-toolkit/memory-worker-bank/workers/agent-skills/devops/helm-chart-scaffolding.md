# helm-chart-scaffolding
Source: https://antigravity.codes/agent-skills/devops/helm-chart-scaffolding

## AI Worker Instructions
When the user requests functionality related to helm-chart-scaffolding, follow these guidelines and utilize this context.

## Scraped Content

# helm-chart-scaffolding
```
helm create my-app
```
```
helm create my-app
```
```
my-app/├── Chart.yaml           # Chart metadata├── values.yaml          # Default configuration values├── charts/              # Chart dependencies├── templates/           # Kubernetes manifest templates│   ├── NOTES.txt       # Post-install notes│   ├── _helpers.tpl    # Template helpers│   ├── deployment.yaml│   ├── service.yaml│   ├── ingress.yaml│   ├── serviceaccount.yaml│   ├── hpa.yaml│   └── tests/│       └── test-connection.yaml└── .helmignore         # Files to ignore
```
```
my-app/├── Chart.yaml           # Chart metadata├── values.yaml          # Default configuration values├── charts/              # Chart dependencies├── templates/           # Kubernetes manifest templates│   ├── NOTES.txt       # Post-install notes│   ├── _helpers.tpl    # Template helpers│   ├── deployment.yaml│   ├── service.yaml│   ├── ingress.yaml│   ├── serviceaccount.yaml│   ├── hpa.yaml│   └── tests/│       └── test-connection.yaml└── .helmignore         # Files to ignore
```
```
apiVersion: v2name: my-appdescription: A Helm chart for My Applicationtype: applicationversion: 1.0.0 # Chart versionappVersion: "2.1.0" # Application version# Keywords for chart discoverykeywords:  - web  - api  - backend# Maintainer informationmaintainers:  - name: DevOps Team    email: devops@example.com    url: https://github.com/example/my-app# Source code repositorysources:  - https://github.com/example/my-app# Homepagehome: https://example.com# Chart iconicon: https://example.com/icon.png# Dependenciesdependencies:  - name: postgresql    version: "12.0.0"    repository: "https://charts.bitnami.com/bitnami"    condition: postgresql.enabled  - name: redis    version: "17.0.0"    repository: "https://charts.bitnami.com/bitnami"    condition: redis.enabled
```
```
apiVersion: v2name: my-appdescription: A Helm chart for My Applicationtype: applicationversion: 1.0.0 # Chart versionappVersion: "2.1.0" # Application version# Keywords for chart discoverykeywords:  - web  - api  - backend# Maintainer informationmaintainers:  - name: DevOps Team    email: devops@example.com    url: https://github.com/example/my-app# Source code repositorysources:  - https://github.com/example/my-app# Homepagehome: https://example.com# Chart iconicon: https://example.com/icon.png# Dependenciesdependencies:  - name: postgresql    version: "12.0.0"    repository: "https://charts.bitnami.com/bitnami"    condition: postgresql.enabled  - name: redis    version: "17.0.0"    repository: "https://charts.bitnami.com/bitnami"    condition: redis.enabled
```
```
assets/Chart.yaml.template
```
```
# Image configurationimage:  repository: myapp  tag: "1.0.0"  pullPolicy: IfNotPresent# Number of replicasreplicaCount: 3# Service configurationservice:  type: ClusterIP  port: 80  targetPort: 8080# Ingress configurationingress:  enabled: false  className: nginx  hosts:    - host: app.example.com      paths:        - path: /          pathType: Prefix# Resourcesresources:  requests:    memory: "256Mi"    cpu: "250m"  limits:    memory: "512Mi"    cpu: "500m"# Autoscalingautoscaling:  enabled: false  minReplicas: 2  maxReplicas: 10  targetCPUUtilizationPercentage: 80# Environment variablesenv:  - name: LOG_LEVEL    value: "info"# ConfigMap dataconfigMap:  data:    APP_MODE: production# Dependenciespostgresql:  enabled: true  auth:    database: myapp    username: myappredis:  enabled: false
```
```
# Image configurationimage:  repository: myapp  tag: "1.0.0"  pullPolicy: IfNotPresent# Number of replicasreplicaCount: 3# Service configurationservice:  type: ClusterIP  port: 80  targetPort: 8080# Ingress configurationingress:  enabled: false  className: nginx  hosts:    - host: app.example.com      paths:        - path: /          pathType: Prefix# Resourcesresources:  requests:    memory: "256Mi"    cpu: "250m"  limits:    memory: "512Mi"    cpu: "500m"# Autoscalingautoscaling:  enabled: false  minReplicas: 2  maxReplicas: 10  targetCPUUtilizationPercentage: 80# Environment variablesenv:  - name: LOG_LEVEL    value: "info"# ConfigMap dataconfigMap:  data:    APP_MODE: production# Dependenciespostgresql:  enabled: true  auth:    database: myapp    username: myappredis:  enabled: false
```
```
assets/values.yaml.template
```
```
apiVersion: apps/v1kind: Deploymentmetadata:  name: {{ include "my-app.fullname" . }}  labels:    {{- include "my-app.labels" . | nindent 4 }}spec:  {{- if not .Values.autoscaling.enabled }}  replicas: {{ .Values.replicaCount }}  {{- end }}  selector:    matchLabels:      {{- include "my-app.selectorLabels" . | nindent 6 }}  template:    metadata:      labels:        {{- include "my-app.selectorLabels" . | nindent 8 }}    spec:      containers:      - name: {{ .Chart.Name }}        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"        imagePullPolicy: {{ .Values.image.pullPolicy }}        ports:        - name: http          containerPort: {{ .Values.service.targetPort }}        resources:          {{- toYaml .Values.resources | nindent 12 }}        env:          {{- toYaml .Values.env | nindent 12 }}
```
```
apiVersion: apps/v1kind: Deploymentmetadata:  name: {{ include "my-app.fullname" . }}  labels:    {{- include "my-app.labels" . | nindent 4 }}spec:  {{- if not .Values.autoscaling.enabled }}  replicas: {{ .Values.replicaCount }}  {{- end }}  selector:    matchLabels:      {{- include "my-app.selectorLabels" . | nindent 6 }}  template:    metadata:      labels:        {{- include "my-app.selectorLabels" . | nindent 8 }}    spec:      containers:      - name: {{ .Chart.Name }}        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"        imagePullPolicy: {{ .Values.image.pullPolicy }}        ports:        - name: http          containerPort: {{ .Values.service.targetPort }}        resources:          {{- toYaml .Values.resources | nindent 12 }}        env:          {{- toYaml .Values.env | nindent 12 }}
```
```
{{/*Expand the name of the chart.*/}}{{- define "my-app.name" -}}{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}{{- end }}{{/*Create a default fully qualified app name.*/}}{{- define "my-app.fullname" -}}{{- if .Values.fullnameOverride }}{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}{{- else }}{{- $name := default .Chart.Name .Values.nameOverride }}{{- if contains $name .Release.Name }}{{- .Release.Name | trunc 63 | trimSuffix "-" }}{{- else }}{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}{{- end }}{{- end }}{{- end }}{{/*Common labels*/}}{{- define "my-app.labels" -}}helm.sh/chart: {{ include "my-app.chart" . }}{{ include "my-app.selectorLabels" . }}{{- if .Chart.AppVersion }}app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}{{- end }}app.kubernetes.io/managed-by: {{ .Release.Service }}{{- end }}{{/*Selector labels*/}}{{- define "my-app.selectorLabels" -}}app.kubernetes.io/name: {{ include "my-app.name" . }}app.kubernetes.io/instance: {{ .Release.Name }}{{- end }}
```
```
{{/*Expand the name of the chart.*/}}{{- define "my-app.name" -}}{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}{{- end }}{{/*Create a default fully qualified app name.*/}}{{- define "my-app.fullname" -}}{{- if .Values.fullnameOverride }}{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}{{- else }}{{- $name := default .Chart.Name .Values.nameOverride }}{{- if contains $name .Release.Name }}{{- .Release.Name | trunc 63 | trimSuffix "-" }}{{- else }}{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}{{- end }}{{- end }}{{- end }}{{/*Common labels*/}}{{- define "my-app.labels" -}}helm.sh/chart: {{ include "my-app.chart" . }}{{ include "my-app.selectorLabels" . }}{{- if .Chart.AppVersion }}app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}{{- end }}app.kubernetes.io/managed-by: {{ .Release.Service }}{{- end }}{{/*Selector labels*/}}{{- define "my-app.selectorLabels" -}}app.kubernetes.io/name: {{ include "my-app.name" . }}app.kubernetes.io/instance: {{ .Release.Name }}{{- end }}
```
```
dependencies:  - name: postgresql    version: "12.0.0"    repository: "https://charts.bitnami.com/bitnami"    condition: postgresql.enabled
```
```
dependencies:  - name: postgresql    version: "12.0.0"    repository: "https://charts.bitnami.com/bitnami"    condition: postgresql.enabled
```
```
helm dependency updatehelm dependency build
```
```
helm dependency updatehelm dependency build
```
```
# values.yamlpostgresql:  enabled: true  auth:    database: myapp    username: myapp    password: changeme  primary:    persistence:      enabled: true      size: 10Gi
```
```
# values.yamlpostgresql:  enabled: true  auth:    database: myapp    username: myapp    password: changeme  primary:    persistence:      enabled: true      size: 10Gi
```
```
# Lint the charthelm lint my-app/# Dry-run installationhelm install my-app ./my-app --dry-run --debug# Template renderinghelm template my-app ./my-app# Template with valueshelm template my-app ./my-app -f values-prod.yaml# Show computed valueshelm show values ./my-app
```
```
# Lint the charthelm lint my-app/# Dry-run installationhelm install my-app ./my-app --dry-run --debug# Template renderinghelm template my-app ./my-app# Template with valueshelm template my-app ./my-app -f values-prod.yaml# Show computed valueshelm show values ./my-app
```
```
#!/bin/bashset -eecho "Linting chart..."helm lint .echo "Testing template rendering..."helm template test-release . --dry-runecho "Checking for required values..."helm template test-release . --validateecho "All validations passed!"
```
```
#!/bin/bashset -eecho "Linting chart..."helm lint .echo "Testing template rendering..."helm template test-release . --dry-runecho "Checking for required values..."helm template test-release . --validateecho "All validations passed!"
```
```
scripts/validate-chart.sh
```
```
helm package my-app/# Creates: my-app-1.0.0.tgz
```
```
helm package my-app/# Creates: my-app-1.0.0.tgz
```
```
# Create indexhelm repo index .# Upload to repository# AWS S3 exampleaws s3 sync . s3://my-helm-charts/ --exclude "*" --include "*.tgz" --include "index.yaml"
```
```
# Create indexhelm repo index .# Upload to repository# AWS S3 exampleaws s3 sync . s3://my-helm-charts/ --exclude "*" --include "*.tgz" --include "index.yaml"
```
```
helm repo add my-repo https://charts.example.comhelm repo updatehelm install my-app my-repo/my-app
```
```
helm repo add my-repo https://charts.example.comhelm repo updatehelm install my-app my-repo/my-app
```
```
my-app/├── values.yaml          # Defaults├── values-dev.yaml      # Development├── values-staging.yaml  # Staging└── values-prod.yaml     # Production
```
```
my-app/├── values.yaml          # Defaults├── values-dev.yaml      # Development├── values-staging.yaml  # Staging└── values-prod.yaml     # Production
```
```
replicaCount: 5image:  tag: "2.1.0"resources:  requests:    memory: "512Mi"    cpu: "500m"  limits:    memory: "1Gi"    cpu: "1000m"autoscaling:  enabled: true  minReplicas: 3  maxReplicas: 20ingress:  enabled: true  hosts:    - host: app.example.com      paths:        - path: /          pathType: Prefixpostgresql:  enabled: true  primary:    persistence:      size: 100Gi
```
```
replicaCount: 5image:  tag: "2.1.0"resources:  requests:    memory: "512Mi"    cpu: "500m"  limits:    memory: "1Gi"    cpu: "1000m"autoscaling:  enabled: true  minReplicas: 3  maxReplicas: 20ingress:  enabled: true  hosts:    - host: app.example.com      paths:        - path: /          pathType: Prefixpostgresql:  enabled: true  primary:    persistence:      size: 100Gi
```
```
helm install my-app ./my-app -f values-prod.yaml --namespace production
```
```
helm install my-app ./my-app -f values-prod.yaml --namespace production
```
```
# templates/pre-install-job.yamlapiVersion: batch/v1kind: Jobmetadata:  name: {{ include "my-app.fullname" . }}-db-setup  annotations:    "helm.sh/hook": pre-install    "helm.sh/hook-weight": "-5"    "helm.sh/hook-delete-policy": hook-succeededspec:  template:    spec:      containers:      - name: db-setup        image: postgres:15        command: ["psql", "-c", "CREATE DATABASE myapp"]      restartPolicy: Never
```
```
# templates/pre-install-job.yamlapiVersion: batch/v1kind: Jobmetadata:  name: {{ include "my-app.fullname" . }}-db-setup  annotations:    "helm.sh/hook": pre-install    "helm.sh/hook-weight": "-5"    "helm.sh/hook-delete-policy": hook-succeededspec:  template:    spec:      containers:      - name: db-setup        image: postgres:15        command: ["psql", "-c", "CREATE DATABASE myapp"]      restartPolicy: Never
```
```
# templates/tests/test-connection.yamlapiVersion: v1kind: Podmetadata:  name: "{{ include "my-app.fullname" . }}-test-connection"  annotations:    "helm.sh/hook": testspec:  containers:  - name: wget    image: busybox    command: ['wget']    args: ['{{ include "my-app.fullname" . }}:{{ .Values.service.port }}']  restartPolicy: Never
```
```
# templates/tests/test-connection.yamlapiVersion: v1kind: Podmetadata:  name: "{{ include "my-app.fullname" . }}-test-connection"  annotations:    "helm.sh/hook": testspec:  containers:  - name: wget    image: busybox    command: ['wget']    args: ['{{ include "my-app.fullname" . }}:{{ .Values.service.port }}']  restartPolicy: Never
```
```
helm test my-app
```
```
helm test my-app
```
```
{{- if .Values.ingress.enabled }}apiVersion: networking.k8s.io/v1kind: Ingressmetadata:  name: {{ include "my-app.fullname" . }}spec:  # ...{{- end }}
```
```
{{- if .Values.ingress.enabled }}apiVersion: networking.k8s.io/v1kind: Ingressmetadata:  name: {{ include "my-app.fullname" . }}spec:  # ...{{- end }}
```
```
env:{{- range .Values.env }}- name: {{ .name }}  value: {{ .value | quote }}{{- end }}
```
```
env:{{- range .Values.env }}- name: {{ .name }}  value: {{ .value | quote }}{{- end }}
```
```
data:  config.yaml: |    {{- .Files.Get "config/application.yaml" | nindent 4 }}
```
```
data:  config.yaml: |    {{- .Files.Get "config/application.yaml" | nindent 4 }}
```
```
global:  imageRegistry: docker.io  imagePullSecrets:    - name: regcred# Use in templates:image: {{ .Values.global.imageRegistry }}/{{ .Values.image.repository }}
```
```
global:  imageRegistry: docker.io  imagePullSecrets:    - name: regcred# Use in templates:image: {{ .Values.global.imageRegistry }}/{{ .Values.image.repository }}
```
```
helm template my-app ./my-app --debug
```
```
helm template my-app ./my-app --debug
```
```
helm dependency updatehelm dependency list
```
```
helm dependency updatehelm dependency list
```
```
helm install my-app ./my-app --dry-run --debugkubectl get events --sort-by='.lastTimestamp'
```
```
helm install my-app ./my-app --dry-run --debugkubectl get events --sort-by='.lastTimestamp'
```
```
assets/Chart.yaml.template
```
```
assets/values.yaml.template
```
```
scripts/validate-chart.sh
```
```
references/chart-structure.md
```
```
k8s-manifest-generator
```
```
gitops-workflow
```
Navigating the complexities of Kubernetes deployments can be streamlined significantly with robust tools. This specialized AI Agent Skill is engineered to empower developers and DevOps engineers in creating and managing Helm charts with unparalleled precision and adherence to best practices. From initial chart scaffolding to advanced templating and values management, it provides comprehensive guidance. Leverage this skill to standardize your application packaging, ensure consistent deployments across environments, and accelerate your development workflow by automating the intricate details of Kubernetes manifest generation. It's your expert companion for mastering Helm and deploying resilient, scalable applications.

# When to Use This Skill
- •Scaffolding a new Helm chart for a microservice application.
- •Packaging an existing Kubernetes application for distribution via a Helm repository.
- •Standardizing configurations and deployments across development, staging, and production environments using Helm.
- •Refactoring existing Kubernetes manifests into reusable Helm templates with dynamic values.

# Pro Tips
- 💡Always version your Helm charts semantically (e.g., `1.0.0`) and ensure your `Chart.yaml` dependencies are explicitly managed for reliable deployments.
- 💡Utilize `_helpers.tpl` for common templates and partials to keep your main templates clean and promote reusability across your chart.
- 💡Implement `values.schema.json` to enforce strict validation for chart values, preventing common configuration errors and improving chart usability.

