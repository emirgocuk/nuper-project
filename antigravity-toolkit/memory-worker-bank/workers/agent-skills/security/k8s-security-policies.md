# k8s-security-policies
Source: https://antigravity.codes/agent-skills/security/k8s-security-policies

## AI Worker Instructions
When the user requests functionality related to k8s-security-policies, follow these guidelines and utilize this context.

## Scraped Content

# k8s-security-policies
```
apiVersion: v1kind: Namespacemetadata:  name: privileged-ns  labels:    pod-security.kubernetes.io/enforce: privileged    pod-security.kubernetes.io/audit: privileged    pod-security.kubernetes.io/warn: privileged
```
```
apiVersion: v1kind: Namespacemetadata:  name: privileged-ns  labels:    pod-security.kubernetes.io/enforce: privileged    pod-security.kubernetes.io/audit: privileged    pod-security.kubernetes.io/warn: privileged
```
```
apiVersion: v1kind: Namespacemetadata:  name: baseline-ns  labels:    pod-security.kubernetes.io/enforce: baseline    pod-security.kubernetes.io/audit: baseline    pod-security.kubernetes.io/warn: baseline
```
```
apiVersion: v1kind: Namespacemetadata:  name: baseline-ns  labels:    pod-security.kubernetes.io/enforce: baseline    pod-security.kubernetes.io/audit: baseline    pod-security.kubernetes.io/warn: baseline
```
```
apiVersion: v1kind: Namespacemetadata:  name: restricted-ns  labels:    pod-security.kubernetes.io/enforce: restricted    pod-security.kubernetes.io/audit: restricted    pod-security.kubernetes.io/warn: restricted
```
```
apiVersion: v1kind: Namespacemetadata:  name: restricted-ns  labels:    pod-security.kubernetes.io/enforce: restricted    pod-security.kubernetes.io/audit: restricted    pod-security.kubernetes.io/warn: restricted
```
```
apiVersion: networking.k8s.io/v1kind: NetworkPolicymetadata:  name: default-deny-all  namespace: productionspec:  podSelector: {}  policyTypes:    - Ingress    - Egress
```
```
apiVersion: networking.k8s.io/v1kind: NetworkPolicymetadata:  name: default-deny-all  namespace: productionspec:  podSelector: {}  policyTypes:    - Ingress    - Egress
```
```
apiVersion: networking.k8s.io/v1kind: NetworkPolicymetadata:  name: allow-frontend-to-backend  namespace: productionspec:  podSelector:    matchLabels:      app: backend  policyTypes:    - Ingress  ingress:    - from:        - podSelector:            matchLabels:              app: frontend      ports:        - protocol: TCP          port: 8080
```
```
apiVersion: networking.k8s.io/v1kind: NetworkPolicymetadata:  name: allow-frontend-to-backend  namespace: productionspec:  podSelector:    matchLabels:      app: backend  policyTypes:    - Ingress  ingress:    - from:        - podSelector:            matchLabels:              app: frontend      ports:        - protocol: TCP          port: 8080
```
```
apiVersion: networking.k8s.io/v1kind: NetworkPolicymetadata:  name: allow-dns  namespace: productionspec:  podSelector: {}  policyTypes:    - Egress  egress:    - to:        - namespaceSelector:            matchLabels:              name: kube-system      ports:        - protocol: UDP          port: 53
```
```
apiVersion: networking.k8s.io/v1kind: NetworkPolicymetadata:  name: allow-dns  namespace: productionspec:  podSelector: {}  policyTypes:    - Egress  egress:    - to:        - namespaceSelector:            matchLabels:              name: kube-system      ports:        - protocol: UDP          port: 53
```
```
assets/network-policy-template.yaml
```
```
apiVersion: rbac.authorization.k8s.io/v1kind: Rolemetadata:  name: pod-reader  namespace: productionrules:  - apiGroups: [""]    resources: ["pods"]    verbs: ["get", "watch", "list"]
```
```
apiVersion: rbac.authorization.k8s.io/v1kind: Rolemetadata:  name: pod-reader  namespace: productionrules:  - apiGroups: [""]    resources: ["pods"]    verbs: ["get", "watch", "list"]
```
```
apiVersion: rbac.authorization.k8s.io/v1kind: ClusterRolemetadata:  name: secret-readerrules:  - apiGroups: [""]    resources: ["secrets"]    verbs: ["get", "watch", "list"]
```
```
apiVersion: rbac.authorization.k8s.io/v1kind: ClusterRolemetadata:  name: secret-readerrules:  - apiGroups: [""]    resources: ["secrets"]    verbs: ["get", "watch", "list"]
```
```
apiVersion: rbac.authorization.k8s.io/v1kind: RoleBindingmetadata:  name: read-pods  namespace: productionsubjects:  - kind: User    name: jane    apiGroup: rbac.authorization.k8s.io  - kind: ServiceAccount    name: default    namespace: productionroleRef:  kind: Role  name: pod-reader  apiGroup: rbac.authorization.k8s.io
```
```
apiVersion: rbac.authorization.k8s.io/v1kind: RoleBindingmetadata:  name: read-pods  namespace: productionsubjects:  - kind: User    name: jane    apiGroup: rbac.authorization.k8s.io  - kind: ServiceAccount    name: default    namespace: productionroleRef:  kind: Role  name: pod-reader  apiGroup: rbac.authorization.k8s.io
```
```
references/rbac-patterns.md
```
```
apiVersion: v1kind: Podmetadata:  name: secure-podspec:  securityContext:    runAsNonRoot: true    runAsUser: 1000    fsGroup: 1000    seccompProfile:      type: RuntimeDefault  containers:    - name: app      image: myapp:1.0      securityContext:        allowPrivilegeEscalation: false        readOnlyRootFilesystem: true        capabilities:          drop:            - ALL
```
```
apiVersion: v1kind: Podmetadata:  name: secure-podspec:  securityContext:    runAsNonRoot: true    runAsUser: 1000    fsGroup: 1000    seccompProfile:      type: RuntimeDefault  containers:    - name: app      image: myapp:1.0      securityContext:        allowPrivilegeEscalation: false        readOnlyRootFilesystem: true        capabilities:          drop:            - ALL
```
```
apiVersion: templates.gatekeeper.sh/v1kind: ConstraintTemplatemetadata:  name: k8srequiredlabelsspec:  crd:    spec:      names:        kind: K8sRequiredLabels      validation:        openAPIV3Schema:          type: object          properties:            labels:              type: array              items:                type: string  targets:    - target: admission.k8s.gatekeeper.sh      rego: |        package k8srequiredlabels        violation[{"msg": msg, "details": {"missing_labels": missing}}] {          provided := {label | input.review.object.metadata.labels[label]}          required := {label | label := input.parameters.labels[_]}          missing := required - provided          count(missing) > 0          msg := sprintf("missing required labels: %v", [missing])        }
```
```
apiVersion: templates.gatekeeper.sh/v1kind: ConstraintTemplatemetadata:  name: k8srequiredlabelsspec:  crd:    spec:      names:        kind: K8sRequiredLabels      validation:        openAPIV3Schema:          type: object          properties:            labels:              type: array              items:                type: string  targets:    - target: admission.k8s.gatekeeper.sh      rego: |        package k8srequiredlabels        violation[{"msg": msg, "details": {"missing_labels": missing}}] {          provided := {label | input.review.object.metadata.labels[label]}          required := {label | label := input.parameters.labels[_]}          missing := required - provided          count(missing) > 0          msg := sprintf("missing required labels: %v", [missing])        }
```
```
apiVersion: constraints.gatekeeper.sh/v1beta1kind: K8sRequiredLabelsmetadata:  name: require-app-labelspec:  match:    kinds:      - apiGroups: ["apps"]        kinds: ["Deployment"]  parameters:    labels: ["app", "environment"]
```
```
apiVersion: constraints.gatekeeper.sh/v1beta1kind: K8sRequiredLabelsmetadata:  name: require-app-labelspec:  match:    kinds:      - apiGroups: ["apps"]        kinds: ["Deployment"]  parameters:    labels: ["app", "environment"]
```
```
apiVersion: security.istio.io/v1beta1kind: PeerAuthenticationmetadata:  name: default  namespace: productionspec:  mtls:    mode: STRICT
```
```
apiVersion: security.istio.io/v1beta1kind: PeerAuthenticationmetadata:  name: default  namespace: productionspec:  mtls:    mode: STRICT
```
```
apiVersion: security.istio.io/v1beta1kind: AuthorizationPolicymetadata:  name: allow-frontend  namespace: productionspec:  selector:    matchLabels:      app: backend  action: ALLOW  rules:    - from:        - source:            principals: ["cluster.local/ns/production/sa/frontend"]
```
```
apiVersion: security.istio.io/v1beta1kind: AuthorizationPolicymetadata:  name: allow-frontend  namespace: productionspec:  selector:    matchLabels:      app: backend  action: ALLOW  rules:    - from:        - source:            principals: ["cluster.local/ns/production/sa/frontend"]
```
```
# Check if CNI supports NetworkPolicykubectl get nodes -o widekubectl describe networkpolicy <name>
```
```
# Check if CNI supports NetworkPolicykubectl get nodes -o widekubectl describe networkpolicy <name>
```
```
# Check effective permissionskubectl auth can-i list pods --as system:serviceaccount:default:my-sakubectl auth can-i '*' '*' --as system:serviceaccount:default:my-sa
```
```
# Check effective permissionskubectl auth can-i list pods --as system:serviceaccount:default:my-sakubectl auth can-i '*' '*' --as system:serviceaccount:default:my-sa
```
```
assets/network-policy-template.yaml
```
```
assets/pod-security-template.yaml
```
```
references/rbac-patterns.md
```
```
k8s-manifest-generator
```
```
gitops-workflow
```
This AI agent skill provides a comprehensive framework for fortifying Kubernetes environments against potential threats. It meticulously guides users through the implementation of critical security measures, including network segmentation via NetworkPolicy, granular access control with RBAC, and enforcing robust Pod Security Standards. By leveraging these best practices, developers and operations teams can establish a resilient defense-in-depth strategy, ensuring the integrity and confidentiality of applications deployed within their clusters. This skill is indispensable for anyone aiming to elevate their Kubernetes security posture to a production-grade level, minimizing vulnerabilities and adhering to compliance requirements.

# When to Use This Skill
- •Implementing network isolation between namespaces and pods within a Kubernetes cluster.
- •Enforcing pod security standards (Privileged, Baseline, Restricted) across different workloads.
- •Configuring Role-Based Access Control (RBAC) to ensure least-privilege access for users and service accounts.
- •Securing multi-tenant Kubernetes clusters with effective admission control policies.

# Pro Tips
- 💡Always start with a 'Restricted' Pod Security Standard and only escalate privileges when absolutely necessary, documenting all exceptions clearly.
- 💡Regularly audit your NetworkPolicies and RBAC configurations to ensure they align with the principle of least privilege and prevent unintended access.
- 💡Integrate these security policies into your CI/CD pipeline using policy-as-code tools to ensure consistent enforcement and prevent configuration drift across environments.

