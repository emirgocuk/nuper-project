# gitops-workflow
Source: https://antigravity.codes/agent-skills/devops/gitops-workflow

## AI Worker Instructions
When the user requests functionality related to gitops-workflow, follow these guidelines and utilize this context.

## Scraped Content

# gitops-workflow
```
# Create namespacekubectl create namespace argocd# Install ArgoCDkubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml# Get admin passwordkubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```
```
# Create namespacekubectl create namespace argocd# Install ArgoCDkubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml# Get admin passwordkubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```
```
references/argocd-setup.md
```
```
gitops-repo/├── apps/│   ├── production/│   │   ├── app1/│   │   │   ├── kustomization.yaml│   │   │   └── deployment.yaml│   │   └── app2/│   └── staging/├── infrastructure/│   ├── ingress-nginx/│   ├── cert-manager/│   └── monitoring/└── argocd/    ├── applications/    └── projects/
```
```
gitops-repo/├── apps/│   ├── production/│   │   ├── app1/│   │   │   ├── kustomization.yaml│   │   │   └── deployment.yaml│   │   └── app2/│   └── staging/├── infrastructure/│   ├── ingress-nginx/│   ├── cert-manager/│   └── monitoring/└── argocd/    ├── applications/    └── projects/
```
```
# argocd/applications/my-app.yamlapiVersion: argoproj.io/v1alpha1kind: Applicationmetadata:  name: my-app  namespace: argocdspec:  project: default  source:    repoURL: https://github.com/org/gitops-repo    targetRevision: main    path: apps/production/my-app  destination:    server: https://kubernetes.default.svc    namespace: production  syncPolicy:    automated:      prune: true      selfHeal: true    syncOptions:      - CreateNamespace=true
```
```
# argocd/applications/my-app.yamlapiVersion: argoproj.io/v1alpha1kind: Applicationmetadata:  name: my-app  namespace: argocdspec:  project: default  source:    repoURL: https://github.com/org/gitops-repo    targetRevision: main    path: apps/production/my-app  destination:    server: https://kubernetes.default.svc    namespace: production  syncPolicy:    automated:      prune: true      selfHeal: true    syncOptions:      - CreateNamespace=true
```
```
apiVersion: argoproj.io/v1alpha1kind: Applicationmetadata:  name: applications  namespace: argocdspec:  project: default  source:    repoURL: https://github.com/org/gitops-repo    targetRevision: main    path: argocd/applications  destination:    server: https://kubernetes.default.svc    namespace: argocd  syncPolicy:    automated: {}
```
```
apiVersion: argoproj.io/v1alpha1kind: Applicationmetadata:  name: applications  namespace: argocdspec:  project: default  source:    repoURL: https://github.com/org/gitops-repo    targetRevision: main    path: argocd/applications  destination:    server: https://kubernetes.default.svc    namespace: argocd  syncPolicy:    automated: {}
```
```
# Install Flux CLIcurl -s https://fluxcd.io/install.sh | sudo bash# Bootstrap Fluxflux bootstrap github \  --owner=org \  --repository=gitops-repo \  --branch=main \  --path=clusters/production \  --personal
```
```
# Install Flux CLIcurl -s https://fluxcd.io/install.sh | sudo bash# Bootstrap Fluxflux bootstrap github \  --owner=org \  --repository=gitops-repo \  --branch=main \  --path=clusters/production \  --personal
```
```
apiVersion: source.toolkit.fluxcd.io/v1kind: GitRepositorymetadata:  name: my-app  namespace: flux-systemspec:  interval: 1m  url: https://github.com/org/my-app  ref:    branch: main
```
```
apiVersion: source.toolkit.fluxcd.io/v1kind: GitRepositorymetadata:  name: my-app  namespace: flux-systemspec:  interval: 1m  url: https://github.com/org/my-app  ref:    branch: main
```
```
apiVersion: kustomize.toolkit.fluxcd.io/v1kind: Kustomizationmetadata:  name: my-app  namespace: flux-systemspec:  interval: 5m  path: ./deploy  prune: true  sourceRef:    kind: GitRepository    name: my-app
```
```
apiVersion: kustomize.toolkit.fluxcd.io/v1kind: Kustomizationmetadata:  name: my-app  namespace: flux-systemspec:  interval: 5m  path: ./deploy  prune: true  sourceRef:    kind: GitRepository    name: my-app
```
```
syncPolicy:  automated:    prune: true # Delete resources not in Git    selfHeal: true # Reconcile manual changes    allowEmpty: false  retry:    limit: 5    backoff:      duration: 5s      factor: 2      maxDuration: 3m
```
```
syncPolicy:  automated:    prune: true # Delete resources not in Git    selfHeal: true # Reconcile manual changes    allowEmpty: false  retry:    limit: 5    backoff:      duration: 5s      factor: 2      maxDuration: 3m
```
```
spec:  interval: 1m  prune: true  wait: true  timeout: 5m
```
```
spec:  interval: 1m  prune: true  wait: true  timeout: 5m
```
```
references/sync-policies.md
```
```
apiVersion: argoproj.io/v1alpha1kind: Rolloutmetadata:  name: my-appspec:  replicas: 5  strategy:    canary:      steps:        - setWeight: 20        - pause: { duration: 1m }        - setWeight: 50        - pause: { duration: 2m }        - setWeight: 100
```
```
apiVersion: argoproj.io/v1alpha1kind: Rolloutmetadata:  name: my-appspec:  replicas: 5  strategy:    canary:      steps:        - setWeight: 20        - pause: { duration: 1m }        - setWeight: 50        - pause: { duration: 2m }        - setWeight: 100
```
```
strategy:  blueGreen:    activeService: my-app    previewService: my-app-preview    autoPromotionEnabled: false
```
```
strategy:  blueGreen:    activeService: my-app    previewService: my-app-preview    autoPromotionEnabled: false
```
```
apiVersion: external-secrets.io/v1beta1kind: ExternalSecretmetadata:  name: db-credentialsspec:  refreshInterval: 1h  secretStoreRef:    name: aws-secrets-manager    kind: SecretStore  target:    name: db-credentials  data:    - secretKey: password      remoteRef:        key: prod/db/password
```
```
apiVersion: external-secrets.io/v1beta1kind: ExternalSecretmetadata:  name: db-credentialsspec:  refreshInterval: 1h  secretStoreRef:    name: aws-secrets-manager    kind: SecretStore  target:    name: db-credentials  data:    - secretKey: password      remoteRef:        key: prod/db/password
```
```
# Encrypt secretkubeseal --format yaml < secret.yaml > sealed-secret.yaml# Commit sealed-secret.yaml to Git
```
```
# Encrypt secretkubeseal --format yaml < secret.yaml > sealed-secret.yaml# Commit sealed-secret.yaml to Git
```
```
argocd app get my-appargocd app sync my-app --prune
```
```
argocd app get my-appargocd app sync my-app --prune
```
```
argocd app diff my-appargocd app sync my-app --force
```
```
argocd app diff my-appargocd app sync my-app --force
```
```
k8s-manifest-generator
```
```
helm-chart-scaffolding
```
In modern cloud-native environments, reliable and automated deployments are paramount. This Agent Skill provides a comprehensive guide to implementing robust GitOps workflows, enabling developers and operations teams to manage Kubernetes deployments with unprecedented consistency and efficiency. By leveraging leading tools like ArgoCD and Flux, you can transform your deployment pipeline into a declarative, Git-driven process. This ensures that your infrastructure's desired state is always version-controlled and automatically reconciled, significantly reducing manual errors and accelerating your release cycles for any coding assistant user.

# When to Use This Skill
- •Establishing a new GitOps-based CI/CD pipeline for Kubernetes applications.
- •Migrating existing imperative deployment scripts to a declarative GitOps model.
- •Implementing multi-cluster management and consistent application rollouts across environments.
- •Enabling progressive delivery methods like canary deployments or blue/green deployments.

# Pro Tips
- 💡Always use separate Git repositories for application manifests and infrastructure configuration to maintain clear separation of concerns.
- 💡Implement robust secret management solutions (e.g., Sealed Secrets, External Secrets Operator) to keep sensitive data encrypted in your Git repositories.
- 💡Start with a single application or environment to refine your GitOps workflow before scaling to more complex deployments.

