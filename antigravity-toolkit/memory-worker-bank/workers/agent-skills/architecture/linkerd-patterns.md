# linkerd-patterns
Source: https://antigravity.codes/agent-skills/architecture/linkerd-patterns

## AI Worker Instructions
When the user requests functionality related to linkerd-patterns, follow these guidelines and utilize this context.

## Scraped Content

# linkerd-patterns
```
┌─────────────────────────────────────────────┐│                Control Plane                 ││  ┌─────────┐ ┌──────────┐ ┌──────────────┐ ││  │ destiny │ │ identity │ │ proxy-inject │ ││  └─────────┘ └──────────┘ └──────────────┘ │└─────────────────────────────────────────────┘                      │┌─────────────────────────────────────────────┐│                 Data Plane                   ││  ┌─────┐    ┌─────┐    ┌─────┐             ││  │proxy│────│proxy│────│proxy│             ││  └─────┘    └─────┘    └─────┘             ││     │           │           │               ││  ┌──┴──┐    ┌──┴──┐    ┌──┴──┐            ││  │ app │    │ app │    │ app │            ││  └─────┘    └─────┘    └─────┘            │└─────────────────────────────────────────────┘
```
```
┌─────────────────────────────────────────────┐│                Control Plane                 ││  ┌─────────┐ ┌──────────┐ ┌──────────────┐ ││  │ destiny │ │ identity │ │ proxy-inject │ ││  └─────────┘ └──────────┘ └──────────────┘ │└─────────────────────────────────────────────┘                      │┌─────────────────────────────────────────────┐│                 Data Plane                   ││  ┌─────┐    ┌─────┐    ┌─────┐             ││  │proxy│────│proxy│────│proxy│             ││  └─────┘    └─────┘    └─────┘             ││     │           │           │               ││  ┌──┴──┐    ┌──┴──┐    ┌──┴──┐            ││  │ app │    │ app │    │ app │            ││  └─────┘    └─────┘    └─────┘            │└─────────────────────────────────────────────┘
```
```
# Install CLIcurl --proto '=https' --tlsv1.2 -sSfL https://run.linkerd.io/install | sh# Validate clusterlinkerd check --pre# Install CRDslinkerd install --crds | kubectl apply -f -# Install control planelinkerd install | kubectl apply -f -# Verify installationlinkerd check# Install viz extension (optional)linkerd viz install | kubectl apply -f -
```
```
# Install CLIcurl --proto '=https' --tlsv1.2 -sSfL https://run.linkerd.io/install | sh# Validate clusterlinkerd check --pre# Install CRDslinkerd install --crds | kubectl apply -f -# Install control planelinkerd install | kubectl apply -f -# Verify installationlinkerd check# Install viz extension (optional)linkerd viz install | kubectl apply -f -
```
```
# Automatic injection for namespaceapiVersion: v1kind: Namespacemetadata:  name: my-app  annotations:    linkerd.io/inject: enabled---# Or inject specific deploymentapiVersion: apps/v1kind: Deploymentmetadata:  name: my-app  annotations:    linkerd.io/inject: enabledspec:  template:    metadata:      annotations:        linkerd.io/inject: enabled
```
```
# Automatic injection for namespaceapiVersion: v1kind: Namespacemetadata:  name: my-app  annotations:    linkerd.io/inject: enabled---# Or inject specific deploymentapiVersion: apps/v1kind: Deploymentmetadata:  name: my-app  annotations:    linkerd.io/inject: enabledspec:  template:    metadata:      annotations:        linkerd.io/inject: enabled
```
```
apiVersion: linkerd.io/v1alpha2kind: ServiceProfilemetadata:  name: my-service.my-namespace.svc.cluster.local  namespace: my-namespacespec:  routes:    - name: GET /api/users      condition:        method: GET        pathRegex: /api/users      responseClasses:        - condition:            status:              min: 500              max: 599          isFailure: true      isRetryable: true    - name: POST /api/users      condition:        method: POST        pathRegex: /api/users      # POST not retryable by default      isRetryable: false    - name: GET /api/users/{id}      condition:        method: GET        pathRegex: /api/users/[^/]+      timeout: 5s      isRetryable: true  retryBudget:    retryRatio: 0.2    minRetriesPerSecond: 10    ttl: 10s
```
```
apiVersion: linkerd.io/v1alpha2kind: ServiceProfilemetadata:  name: my-service.my-namespace.svc.cluster.local  namespace: my-namespacespec:  routes:    - name: GET /api/users      condition:        method: GET        pathRegex: /api/users      responseClasses:        - condition:            status:              min: 500              max: 599          isFailure: true      isRetryable: true    - name: POST /api/users      condition:        method: POST        pathRegex: /api/users      # POST not retryable by default      isRetryable: false    - name: GET /api/users/{id}      condition:        method: GET        pathRegex: /api/users/[^/]+      timeout: 5s      isRetryable: true  retryBudget:    retryRatio: 0.2    minRetriesPerSecond: 10    ttl: 10s
```
```
apiVersion: split.smi-spec.io/v1alpha1kind: TrafficSplitmetadata:  name: my-service-canary  namespace: my-namespacespec:  service: my-service  backends:    - service: my-service-stable      weight: 900m # 90%    - service: my-service-canary      weight: 100m # 10%
```
```
apiVersion: split.smi-spec.io/v1alpha1kind: TrafficSplitmetadata:  name: my-service-canary  namespace: my-namespacespec:  service: my-service  backends:    - service: my-service-stable      weight: 900m # 90%    - service: my-service-canary      weight: 100m # 10%
```
```
# Define the serverapiVersion: policy.linkerd.io/v1beta1kind: Servermetadata:  name: my-service-http  namespace: my-namespacespec:  podSelector:    matchLabels:      app: my-service  port: http  proxyProtocol: HTTP/1---# Allow traffic from specific clientsapiVersion: policy.linkerd.io/v1beta1kind: ServerAuthorizationmetadata:  name: allow-frontend  namespace: my-namespacespec:  server:    name: my-service-http  client:    meshTLS:      serviceAccounts:        - name: frontend          namespace: my-namespace---# Allow unauthenticated traffic (e.g., from ingress)apiVersion: policy.linkerd.io/v1beta1kind: ServerAuthorizationmetadata:  name: allow-ingress  namespace: my-namespacespec:  server:    name: my-service-http  client:    unauthenticated: true    networks:      - cidr: 10.0.0.0/8
```
```
# Define the serverapiVersion: policy.linkerd.io/v1beta1kind: Servermetadata:  name: my-service-http  namespace: my-namespacespec:  podSelector:    matchLabels:      app: my-service  port: http  proxyProtocol: HTTP/1---# Allow traffic from specific clientsapiVersion: policy.linkerd.io/v1beta1kind: ServerAuthorizationmetadata:  name: allow-frontend  namespace: my-namespacespec:  server:    name: my-service-http  client:    meshTLS:      serviceAccounts:        - name: frontend          namespace: my-namespace---# Allow unauthenticated traffic (e.g., from ingress)apiVersion: policy.linkerd.io/v1beta1kind: ServerAuthorizationmetadata:  name: allow-ingress  namespace: my-namespacespec:  server:    name: my-service-http  client:    unauthenticated: true    networks:      - cidr: 10.0.0.0/8
```
```
apiVersion: policy.linkerd.io/v1beta2kind: HTTPRoutemetadata:  name: my-route  namespace: my-namespacespec:  parentRefs:    - name: my-service      kind: Service      group: core      port: 8080  rules:    - matches:        - path:            type: PathPrefix            value: /api/v2        - headers:            - name: x-api-version              value: v2      backendRefs:        - name: my-service-v2          port: 8080    - matches:        - path:            type: PathPrefix            value: /api      backendRefs:        - name: my-service-v1          port: 8080
```
```
apiVersion: policy.linkerd.io/v1beta2kind: HTTPRoutemetadata:  name: my-route  namespace: my-namespacespec:  parentRefs:    - name: my-service      kind: Service      group: core      port: 8080  rules:    - matches:        - path:            type: PathPrefix            value: /api/v2        - headers:            - name: x-api-version              value: v2      backendRefs:        - name: my-service-v2          port: 8080    - matches:        - path:            type: PathPrefix            value: /api      backendRefs:        - name: my-service-v1          port: 8080
```
```
# On each cluster, install with cluster credentialslinkerd multicluster install | kubectl apply -f -# Link clusterslinkerd multicluster link --cluster-name west \  --api-server-address https://west.example.com:6443 \  | kubectl apply -f -# Export a service to other clusterskubectl label svc/my-service mirror.linkerd.io/exported=true# Verify cross-cluster connectivitylinkerd multicluster checklinkerd multicluster gateways
```
```
# On each cluster, install with cluster credentialslinkerd multicluster install | kubectl apply -f -# Link clusterslinkerd multicluster link --cluster-name west \  --api-server-address https://west.example.com:6443 \  | kubectl apply -f -# Export a service to other clusterskubectl label svc/my-service mirror.linkerd.io/exported=true# Verify cross-cluster connectivitylinkerd multicluster checklinkerd multicluster gateways
```
```
# Live traffic viewlinkerd viz top deploy/my-app# Per-route metricslinkerd viz routes deploy/my-app# Check proxy statuslinkerd viz stat deploy -n my-namespace# View service dependencieslinkerd viz edges deploy -n my-namespace# Dashboardlinkerd viz dashboard
```
```
# Live traffic viewlinkerd viz top deploy/my-app# Per-route metricslinkerd viz routes deploy/my-app# Check proxy statuslinkerd viz stat deploy -n my-namespace# View service dependencieslinkerd viz edges deploy -n my-namespace# Dashboardlinkerd viz dashboard
```
```
# Check injection statuslinkerd check --proxy -n my-namespace# View proxy logskubectl logs deploy/my-app -c linkerd-proxy# Debug identity/TLSlinkerd identity -n my-namespace# Tap traffic (live)linkerd viz tap deploy/my-app --to deploy/my-backend
```
```
# Check injection statuslinkerd check --proxy -n my-namespace# View proxy logskubectl logs deploy/my-app -c linkerd-proxy# Debug identity/TLSlinkerd identity -n my-namespace# Tap traffic (live)linkerd viz tap deploy/my-app --to deploy/my-backend
```
```
linkerd check
```
Unlock the full potential of Linkerd, the ultra-lightweight and security-first service mesh, for your Kubernetes deployments. This comprehensive agent skill provides ready-to-use patterns and best practices to streamline your microservices architecture. Dive into essential concepts like automatic mutual TLS, advanced traffic management for canary deployments, robust retries and timeouts, and multi-cluster configurations. Whether you're enhancing reliability, boosting security, or simplifying observability, this skill empowers you to implement production-grade Linkerd features with expert guidance, ensuring your applications are resilient and secure.

# When to Use This Skill
- •Deploying Linkerd for new Kubernetes microservices.
- •Enforcing automatic mTLS across services for enhanced security.
- •Managing traffic with canary deployments and blue/green strategies.
- •Setting up service profiles for granular per-route metrics and control.

# Pro Tips
- 💡Always define `ServiceProfile` resources for critical services to gain per-route metrics and apply granular policies like retries/timeouts.
- 💡Start with injecting Linkerd into a non-production namespace to understand its impact before rolling out broadly.
- 💡Leverage Linkerd's built-in `tap` and `stat` commands for real-time traffic debugging and service health monitoring.

