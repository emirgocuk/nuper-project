# k8s-manifest-generator
Source: https://antigravity.codes/agent-skills/devops/k8s-manifest-generator

## AI Worker Instructions
When the user requests functionality related to k8s-manifest-generator, follow these guidelines and utilize this context.

## Scraped Content

# k8s-manifest-generator
```
apiVersion: apps/v1kind: Deploymentmetadata:  name: <app-name>  namespace: <namespace>  labels:    app: <app-name>    version: <version>spec:  replicas: 3  selector:    matchLabels:      app: <app-name>  template:    metadata:      labels:        app: <app-name>        version: <version>    spec:      containers:        - name: <container-name>          image: <image>:<tag>          ports:            - containerPort: <port>              name: http          resources:            requests:              memory: "256Mi"              cpu: "250m"            limits:              memory: "512Mi"              cpu: "500m"          livenessProbe:            httpGet:              path: /health              port: http            initialDelaySeconds: 30            periodSeconds: 10          readinessProbe:            httpGet:              path: /ready              port: http            initialDelaySeconds: 5            periodSeconds: 5          env:            - name: ENV_VAR              value: "value"          envFrom:            - configMapRef:                name: <app-name>-config            - secretRef:                name: <app-name>-secret
```
```
apiVersion: apps/v1kind: Deploymentmetadata:  name: <app-name>  namespace: <namespace>  labels:    app: <app-name>    version: <version>spec:  replicas: 3  selector:    matchLabels:      app: <app-name>  template:    metadata:      labels:        app: <app-name>        version: <version>    spec:      containers:        - name: <container-name>          image: <image>:<tag>          ports:            - containerPort: <port>              name: http          resources:            requests:              memory: "256Mi"              cpu: "250m"            limits:              memory: "512Mi"              cpu: "500m"          livenessProbe:            httpGet:              path: /health              port: http            initialDelaySeconds: 30            periodSeconds: 10          readinessProbe:            httpGet:              path: /ready              port: http            initialDelaySeconds: 5            periodSeconds: 5          env:            - name: ENV_VAR              value: "value"          envFrom:            - configMapRef:                name: <app-name>-config            - secretRef:                name: <app-name>-secret
```
```
:latest
```
```
references/deployment-spec.md
```
```
apiVersion: v1kind: Servicemetadata:  name: <app-name>  namespace: <namespace>  labels:    app: <app-name>spec:  type: ClusterIP  selector:    app: <app-name>  ports:    - name: http      port: 80      targetPort: 8080      protocol: TCP
```
```
apiVersion: v1kind: Servicemetadata:  name: <app-name>  namespace: <namespace>  labels:    app: <app-name>spec:  type: ClusterIP  selector:    app: <app-name>  ports:    - name: http      port: 80      targetPort: 8080      protocol: TCP
```
```
apiVersion: v1kind: Servicemetadata:  name: <app-name>  namespace: <namespace>  labels:    app: <app-name>  annotations:    service.beta.kubernetes.io/aws-load-balancer-type: nlbspec:  type: LoadBalancer  selector:    app: <app-name>  ports:    - name: http      port: 80      targetPort: 8080      protocol: TCP
```
```
apiVersion: v1kind: Servicemetadata:  name: <app-name>  namespace: <namespace>  labels:    app: <app-name>  annotations:    service.beta.kubernetes.io/aws-load-balancer-type: nlbspec:  type: LoadBalancer  selector:    app: <app-name>  ports:    - name: http      port: 80      targetPort: 8080      protocol: TCP
```
```
references/service-spec.md
```
```
apiVersion: v1kind: ConfigMapmetadata:  name: <app-name>-config  namespace: <namespace>data:  APP_MODE: production  LOG_LEVEL: info  DATABASE_HOST: db.example.com  # For config files  app.properties: |    server.port=8080    server.host=0.0.0.0    logging.level=INFO
```
```
apiVersion: v1kind: ConfigMapmetadata:  name: <app-name>-config  namespace: <namespace>data:  APP_MODE: production  LOG_LEVEL: info  DATABASE_HOST: db.example.com  # For config files  app.properties: |    server.port=8080    server.host=0.0.0.0    logging.level=INFO
```
```
assets/configmap-template.yaml
```
```
apiVersion: v1kind: Secretmetadata:  name: <app-name>-secret  namespace: <namespace>type: OpaquestringData:  DATABASE_PASSWORD: "changeme"  API_KEY: "secret-api-key"  # For certificate files  tls.crt: |    -----BEGIN CERTIFICATE-----    ...    -----END CERTIFICATE-----  tls.key: |    -----BEGIN PRIVATE KEY-----    ...    -----END PRIVATE KEY-----
```
```
apiVersion: v1kind: Secretmetadata:  name: <app-name>-secret  namespace: <namespace>type: OpaquestringData:  DATABASE_PASSWORD: "changeme"  API_KEY: "secret-api-key"  # For certificate files  tls.crt: |    -----BEGIN CERTIFICATE-----    ...    -----END CERTIFICATE-----  tls.key: |    -----BEGIN PRIVATE KEY-----    ...    -----END PRIVATE KEY-----
```
```
kubernetes.io/tls
```
```
apiVersion: v1kind: PersistentVolumeClaimmetadata:  name: <app-name>-data  namespace: <namespace>spec:  accessModes:    - ReadWriteOnce  storageClassName: gp3  resources:    requests:      storage: 10Gi
```
```
apiVersion: v1kind: PersistentVolumeClaimmetadata:  name: <app-name>-data  namespace: <namespace>spec:  accessModes:    - ReadWriteOnce  storageClassName: gp3  resources:    requests:      storage: 10Gi
```
```
spec:  template:    spec:      containers:        - name: app          volumeMounts:            - name: data              mountPath: /var/lib/app      volumes:        - name: data          persistentVolumeClaim:            claimName: <app-name>-data
```
```
spec:  template:    spec:      containers:        - name: app          volumeMounts:            - name: data              mountPath: /var/lib/app      volumes:        - name: data          persistentVolumeClaim:            claimName: <app-name>-data
```
```
spec:  template:    spec:      securityContext:        runAsNonRoot: true        runAsUser: 1000        fsGroup: 1000        seccompProfile:          type: RuntimeDefault      containers:        - name: app          securityContext:            allowPrivilegeEscalation: false            readOnlyRootFilesystem: true            capabilities:              drop:                - ALL
```
```
spec:  template:    spec:      securityContext:        runAsNonRoot: true        runAsUser: 1000        fsGroup: 1000        seccompProfile:          type: RuntimeDefault      containers:        - name: app          securityContext:            allowPrivilegeEscalation: false            readOnlyRootFilesystem: true            capabilities:              drop:                - ALL
```
```
metadata:  labels:    app.kubernetes.io/name: <app-name>    app.kubernetes.io/instance: <instance-name>    app.kubernetes.io/version: "1.0.0"    app.kubernetes.io/component: backend    app.kubernetes.io/part-of: <system-name>    app.kubernetes.io/managed-by: kubectl
```
```
metadata:  labels:    app.kubernetes.io/name: <app-name>    app.kubernetes.io/instance: <instance-name>    app.kubernetes.io/version: "1.0.0"    app.kubernetes.io/component: backend    app.kubernetes.io/part-of: <system-name>    app.kubernetes.io/managed-by: kubectl
```
```
metadata:  annotations:    description: "Application description"    contact: "team@example.com"    prometheus.io/scrape: "true"    prometheus.io/port: "9090"    prometheus.io/path: "/metrics"
```
```
metadata:  annotations:    description: "Application description"    contact: "team@example.com"    prometheus.io/scrape: "true"    prometheus.io/port: "9090"    prometheus.io/path: "/metrics"
```
```
---
```
```
# app-name.yaml---apiVersion: v1kind: ConfigMap...---apiVersion: v1kind: Secret...---apiVersion: apps/v1kind: Deployment...---apiVersion: v1kind: Service...
```
```
# app-name.yaml---apiVersion: v1kind: ConfigMap...---apiVersion: v1kind: Secret...---apiVersion: apps/v1kind: Deployment...---apiVersion: v1kind: Service...
```
```
manifests/├── configmap.yaml├── secret.yaml├── deployment.yaml├── service.yaml└── pvc.yaml
```
```
manifests/├── configmap.yaml├── secret.yaml├── deployment.yaml├── service.yaml└── pvc.yaml
```
```
base/├── kustomization.yaml├── deployment.yaml├── service.yaml└── configmap.yamloverlays/├── dev/│   └── kustomization.yaml└── prod/    └── kustomization.yaml
```
```
base/├── kustomization.yaml├── deployment.yaml├── service.yaml└── configmap.yamloverlays/├── dev/│   └── kustomization.yaml└── prod/    └── kustomization.yaml
```
```
# Dry-run validationkubectl apply -f manifest.yaml --dry-run=client# Server-side validationkubectl apply -f manifest.yaml --dry-run=server# Validate with kubevalkubeval manifest.yaml# Validate with kube-scorekube-score score manifest.yaml# Check with kube-linterkube-linter lint manifest.yaml
```
```
# Dry-run validationkubectl apply -f manifest.yaml --dry-run=client# Server-side validationkubectl apply -f manifest.yaml --dry-run=server# Validate with kubevalkubeval manifest.yaml# Validate with kube-scorekube-score score manifest.yaml# Check with kube-linterkube-linter lint manifest.yaml
```
```
assets/deployment-template.yaml
```
```
assets/
```
```
deployment-template.yaml
```
```
service-template.yaml
```
```
configmap-template.yaml
```
```
secret-template.yaml
```
```
pvc-template.yaml
```
```
references/deployment-spec.md
```
```
references/service-spec.md
```
```
kubectl describe pod <pod-name>
```
```
kubectl get nodes
```
```
kubectl get events --sort-by='.lastTimestamp'
```
```
kubectl get endpoints <service-name>
```
```
kubectl run debug --rm -it --image=busybox -- sh
```
```
kubectl get configmap,secret
```
```
helm-chart-scaffolding
```
```
gitops-workflow
```
```
k8s-security-policies
```
Elevate your Kubernetes deployment strategy with this specialized AI agent skill designed for precision and best practices. Developers and DevOps engineers can leverage this tool to swiftly scaffold robust K8s manifests, from Deployments and Services to ConfigMaps and Secrets. It streamlines the creation process, embedding critical security standards and cloud-native conventions directly into your YAML files. This ensures not only functional but also highly maintainable and secure infrastructure code, accelerating your path to production-grade deployments without manual oversight of every detail. Experience a new level of efficiency in managing your containerized applications.

# When to Use This Skill
- •Rapidly provision new applications or microservices on Kubernetes by generating all necessary manifest types.
- •Ensure consistent security and best practices are applied across all K8s resources within a project.
- •Automate the creation of environment-specific configurations using ConfigMaps and Secrets for staging and production.
- •Refactor existing monolithic applications into containerized, stateful, or stateless services on Kubernetes.

# Pro Tips
- 💡Always specify clear resource requests and limits to prevent noisy neighbor issues and ensure QoS within your cluster.
- 💡Leverage GitOps principles by version-controlling the generated manifests and applying them via CI/CD pipelines.
- 💡After generation, review the manifests with tools like `kubeval` or `conftest` to validate schema and policy adherence before deployment.

