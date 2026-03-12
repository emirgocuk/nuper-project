# istio-traffic-management
Source: https://antigravity.codes/agent-skills/devops/istio-traffic-management

## AI Worker Instructions
When the user requests functionality related to istio-traffic-management, follow these guidelines and utilize this context.

## Scraped Content

# istio-traffic-management
```
Client → Gateway → VirtualService → DestinationRule → Service                   (routing)        (policies)        (pods)
```
```
Client → Gateway → VirtualService → DestinationRule → Service                   (routing)        (policies)        (pods)
```
```
apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: reviews-route  namespace: bookinfospec:  hosts:    - reviews  http:    - match:        - headers:            end-user:              exact: jason      route:        - destination:            host: reviews            subset: v2    - route:        - destination:            host: reviews            subset: v1---apiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: reviews-destination  namespace: bookinfospec:  host: reviews  subsets:    - name: v1      labels:        version: v1    - name: v2      labels:        version: v2    - name: v3      labels:        version: v3
```
```
apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: reviews-route  namespace: bookinfospec:  hosts:    - reviews  http:    - match:        - headers:            end-user:              exact: jason      route:        - destination:            host: reviews            subset: v2    - route:        - destination:            host: reviews            subset: v1---apiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: reviews-destination  namespace: bookinfospec:  host: reviews  subsets:    - name: v1      labels:        version: v1    - name: v2      labels:        version: v2    - name: v3      labels:        version: v3
```
```
apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: my-service-canaryspec:  hosts:    - my-service  http:    - route:        - destination:            host: my-service            subset: stable          weight: 90        - destination:            host: my-service            subset: canary          weight: 10---apiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: my-service-drspec:  host: my-service  trafficPolicy:    connectionPool:      tcp:        maxConnections: 100      http:        h2UpgradePolicy: UPGRADE        http1MaxPendingRequests: 100        http2MaxRequests: 1000  subsets:    - name: stable      labels:        version: stable    - name: canary      labels:        version: canary
```
```
apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: my-service-canaryspec:  hosts:    - my-service  http:    - route:        - destination:            host: my-service            subset: stable          weight: 90        - destination:            host: my-service            subset: canary          weight: 10---apiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: my-service-drspec:  host: my-service  trafficPolicy:    connectionPool:      tcp:        maxConnections: 100      http:        h2UpgradePolicy: UPGRADE        http1MaxPendingRequests: 100        http2MaxRequests: 1000  subsets:    - name: stable      labels:        version: stable    - name: canary      labels:        version: canary
```
```
apiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: circuit-breakerspec:  host: my-service  trafficPolicy:    connectionPool:      tcp:        maxConnections: 100      http:        http1MaxPendingRequests: 100        http2MaxRequests: 1000        maxRequestsPerConnection: 10        maxRetries: 3    outlierDetection:      consecutive5xxErrors: 5      interval: 30s      baseEjectionTime: 30s      maxEjectionPercent: 50      minHealthPercent: 30
```
```
apiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: circuit-breakerspec:  host: my-service  trafficPolicy:    connectionPool:      tcp:        maxConnections: 100      http:        http1MaxPendingRequests: 100        http2MaxRequests: 1000        maxRequestsPerConnection: 10        maxRetries: 3    outlierDetection:      consecutive5xxErrors: 5      interval: 30s      baseEjectionTime: 30s      maxEjectionPercent: 50      minHealthPercent: 30
```
```
apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: ratings-retryspec:  hosts:    - ratings  http:    - route:        - destination:            host: ratings      timeout: 10s      retries:        attempts: 3        perTryTimeout: 3s        retryOn: connect-failure,refused-stream,unavailable,cancelled,retriable-4xx,503        retryRemoteLocalities: true
```
```
apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: ratings-retryspec:  hosts:    - ratings  http:    - route:        - destination:            host: ratings      timeout: 10s      retries:        attempts: 3        perTryTimeout: 3s        retryOn: connect-failure,refused-stream,unavailable,cancelled,retriable-4xx,503        retryRemoteLocalities: true
```
```
apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: mirror-trafficspec:  hosts:    - my-service  http:    - route:        - destination:            host: my-service            subset: v1      mirror:        host: my-service        subset: v2      mirrorPercentage:        value: 100.0
```
```
apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: mirror-trafficspec:  hosts:    - my-service  http:    - route:        - destination:            host: my-service            subset: v1      mirror:        host: my-service        subset: v2      mirrorPercentage:        value: 100.0
```
```
apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: fault-injectionspec:  hosts:    - ratings  http:    - fault:        delay:          percentage:            value: 10          fixedDelay: 5s        abort:          percentage:            value: 5          httpStatus: 503      route:        - destination:            host: ratings
```
```
apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: fault-injectionspec:  hosts:    - ratings  http:    - fault:        delay:          percentage:            value: 10          fixedDelay: 5s        abort:          percentage:            value: 5          httpStatus: 503      route:        - destination:            host: ratings
```
```
apiVersion: networking.istio.io/v1beta1kind: Gatewaymetadata:  name: my-gatewayspec:  selector:    istio: ingressgateway  servers:    - port:        number: 443        name: https        protocol: HTTPS      tls:        mode: SIMPLE        credentialName: my-tls-secret      hosts:        - "*.example.com"---apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: my-vsspec:  hosts:    - "api.example.com"  gateways:    - my-gateway  http:    - match:        - uri:            prefix: /api/v1      route:        - destination:            host: api-service            port:              number: 8080
```
```
apiVersion: networking.istio.io/v1beta1kind: Gatewaymetadata:  name: my-gatewayspec:  selector:    istio: ingressgateway  servers:    - port:        number: 443        name: https        protocol: HTTPS      tls:        mode: SIMPLE        credentialName: my-tls-secret      hosts:        - "*.example.com"---apiVersion: networking.istio.io/v1beta1kind: VirtualServicemetadata:  name: my-vsspec:  hosts:    - "api.example.com"  gateways:    - my-gateway  http:    - match:        - uri:            prefix: /api/v1      route:        - destination:            host: api-service            port:              number: 8080
```
```
apiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: load-balancingspec:  host: my-service  trafficPolicy:    loadBalancer:      simple: ROUND_ROBIN # or LEAST_CONN, RANDOM, PASSTHROUGH---# Consistent hashing for sticky sessionsapiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: sticky-sessionsspec:  host: my-service  trafficPolicy:    loadBalancer:      consistentHash:        httpHeaderName: x-user-id        # or: httpCookie, useSourceIp, httpQueryParameterName
```
```
apiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: load-balancingspec:  host: my-service  trafficPolicy:    loadBalancer:      simple: ROUND_ROBIN # or LEAST_CONN, RANDOM, PASSTHROUGH---# Consistent hashing for sticky sessionsapiVersion: networking.istio.io/v1beta1kind: DestinationRulemetadata:  name: sticky-sessionsspec:  host: my-service  trafficPolicy:    loadBalancer:      consistentHash:        httpHeaderName: x-user-id        # or: httpCookie, useSourceIp, httpQueryParameterName
```
```
# Check VirtualService configurationistioctl analyze# View effective routesistioctl proxy-config routes deploy/my-app -o json# Check endpoint discoveryistioctl proxy-config endpoints deploy/my-app# Debug trafficistioctl proxy-config log deploy/my-app --level debug
```
```
# Check VirtualService configurationistioctl analyze# View effective routesistioctl proxy-config routes deploy/my-app -o json# Check endpoint discoveryistioctl proxy-config endpoints deploy/my-app# Debug trafficistioctl proxy-config log deploy/my-app --level debug
```
Unlock the full potential of your microservices architecture with this Istio Traffic Management Agent Skill. Designed for developers and DevOps engineers, it provides comprehensive guidance and practical examples to configure advanced traffic policies within your service mesh. Learn to orchestrate complex routing, implement resilient patterns like circuit breakers, and execute progressive delivery strategies such as canary and blue-green deployments. This skill empowers you to enhance application reliability, control service interactions, and optimize performance across your distributed systems with confidence.

# When to Use This Skill
- •Implementing progressive delivery strategies like canary deployments or blue-green rollouts.
- •Enhancing microservice resilience by configuring circuit breakers, retries, and timeouts.
- •Configuring intelligent load balancing and traffic splitting across different service versions.
- •Setting up ingress/egress rules and security policies at the service mesh edge.

# Pro Tips
- 💡Always test your Istio configurations in a staging environment before applying to production, especially for critical routing rules.
- 💡Utilize `istioctl analyze` to validate your Istio resource YAMLs for common configuration errors and best practices before deployment.
- 💡Combine VirtualServices and DestinationRules effectively to separate routing logic from policy enforcement, improving clarity and maintainability for complex traffic patterns.

