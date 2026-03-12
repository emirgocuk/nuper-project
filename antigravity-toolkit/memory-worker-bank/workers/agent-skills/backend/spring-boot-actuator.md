# spring-boot-actuator
Source: https://antigravity.codes/agent-skills/backend/spring-boot-actuator

## AI Worker Instructions
When the user requests functionality related to spring-boot-actuator, follow these guidelines and utilize this context.

## Scraped Content

# spring-boot-actuator
```
references/
```
```
<!-- Maven -->   <dependency>       <groupId>org.springframework.boot</groupId>       <artifactId>spring-boot-starter-actuator</artifactId>   </dependency>
```
```
<!-- Maven -->   <dependency>       <groupId>org.springframework.boot</groupId>       <artifactId>spring-boot-starter-actuator</artifactId>   </dependency>
```
```
// Gradle   dependencies {       implementation "org.springframework.boot:spring-boot-starter-actuator"   }
```
```
// Gradle   dependencies {       implementation "org.springframework.boot:spring-boot-starter-actuator"   }
```
```
/actuator/health
```
```
/actuator/info
```
```
200 OK
```
```
management.endpoints.web.exposure.include
```
```
"*"
```
```
management.endpoints.web.base-path
```
```
/management
```
```
/actuator
```
```
references/endpoint-reference.md
```
```
SecurityFilterChain
```
```
EndpointRequest.toAnyEndpoint()
```
```
management.server.port
```
```
/actuator/health/**
```
```
management.endpoint.health.probes.enabled=true
```
```
/health/liveness
```
```
/health/readiness
```
```
management.endpoint.health.group.*
```
```
HealthIndicator
```
```
ReactiveHealthContributor
```
```
references/examples.md#custom-health-indicator
```
```
management.metrics.export.*
```
```
MeterRegistryCustomizer
```
```
application
```
```
environment
```
```
server.observation.*
```
```
/actuator/startup
```
```
/actuator/conditions
```
```
HttpExchangeRepository
```
```
InMemoryHttpExchangeRepository
```
```
/actuator/httpexchanges
```
```
references/official-actuator-docs.md
```
```
management:  endpoints:    web:      exposure:        include: "health,info"  endpoint:    health:      show-details: never
```
```
management:  endpoints:    web:      exposure:        include: "health,info"  endpoint:    health:      show-details: never
```
```
@Componentpublic class PaymentsGatewayHealth implements HealthIndicator {    private final PaymentsClient client;    public PaymentsGatewayHealth(PaymentsClient client) {        this.client = client;    }    @Override    public Health health() {        boolean reachable = client.ping();        return reachable ? Health.up().withDetail("latencyMs", client.latency()).build()                         : Health.down().withDetail("error", "Gateway timeout").build();    }}
```
```
@Componentpublic class PaymentsGatewayHealth implements HealthIndicator {    private final PaymentsClient client;    public PaymentsGatewayHealth(PaymentsClient client) {        this.client = client;    }    @Override    public Health health() {        boolean reachable = client.ping();        return reachable ? Health.up().withDetail("latencyMs", client.latency()).build()                         : Health.down().withDetail("error", "Gateway timeout").build();    }}
```
```
management:  endpoint:    health:      probes:        enabled: true      group:        readiness:          include: "readinessState,db,paymentsGateway"          show-details: always
```
```
management:  endpoint:    health:      probes:        enabled: true      group:        readiness:          include: "readinessState,db,paymentsGateway"          show-details: always
```
```
management:  server:    port: 9091    ssl:      enabled: true  endpoints:    web:      exposure:        include: "health,info,metrics,prometheus"      base-path: "/management"  metrics:    export:      prometheus:        descriptions: true        step: 30s  endpoint:    health:      show-details: when-authorized      roles: "ENDPOINT_ADMIN"
```
```
management:  server:    port: 9091    ssl:      enabled: true  endpoints:    web:      exposure:        include: "health,info,metrics,prometheus"      base-path: "/management"  metrics:    export:      prometheus:        descriptions: true        step: 30s  endpoint:    health:      show-details: when-authorized      roles: "ENDPOINT_ADMIN"
```
```
@Configurationpublic class ActuatorSecurityConfig {    @Bean    SecurityFilterChain actuatorChain(HttpSecurity http) throws Exception {        http.securityMatcher(EndpointRequest.toAnyEndpoint())            .authorizeHttpRequests(c -> c                .requestMatchers(EndpointRequest.to("health")).permitAll()                .anyRequest().hasRole("ENDPOINT_ADMIN"))            .httpBasic(Customizer.withDefaults());        return http.build();    }}
```
```
@Configurationpublic class ActuatorSecurityConfig {    @Bean    SecurityFilterChain actuatorChain(HttpSecurity http) throws Exception {        http.securityMatcher(EndpointRequest.toAnyEndpoint())            .authorizeHttpRequests(c -> c                .requestMatchers(EndpointRequest.to("health")).permitAll()                .anyRequest().hasRole("ENDPOINT_ADMIN"))            .httpBasic(Customizer.withDefaults());        return http.build();    }}
```
```
references/examples.md
```
```
references/
```
```
curl
```
```
/actuator/env
```
```
/actuator/configprops
```
```
/actuator/logfile
```
```
/actuator/heapdump
```
```
scripts/
```
```
mvn spring-boot:run
```
```
./gradlew bootRun
```
```
/actuator
```
```
/actuator/health/readiness
```
```
UP
```
```
/actuator/metrics
```
```
/actuator/prometheus
```
```
http.server.requests
```
```
jvm.memory.used
```
Spring Boot Actuator is an essential tool for bringing production-readiness to your applications. This agent skill streamlines the process of integrating Actuator, enabling comprehensive observability and operational insights. From setting up crucial health endpoints for orchestration platforms to exposing detailed metrics via Micrometer, it guides you through best practices. Leverage this skill to secure management interfaces, debug startup issues, and ensure your Spring Boot services are robust, observable, and ready for any production environment, significantly boosting maintainability and diagnostic capabilities.

# When to Use This Skill
- •Bootstrap Actuator for a new or existing Spring Boot service to enable basic monitoring.
- •Apply Spring Security policies to protect management traffic to Actuator endpoints.
- •Define readiness and liveness groups for orchestrators like Kubernetes.
- •Wire Micrometer registries and tune metric exposure for tools like Prometheus.

# Pro Tips
- 💡Always customize `management.endpoints.web.base-path` to a non-default, obscure path for enhanced security, making it harder for attackers to discover Actuator endpoints.
- 💡Leverage the `/startup` endpoint to diagnose slow application startup times and identify problematic beans during initialization.
- 💡Integrate Actuator with a centralized log management system to correlate health checks and metrics with application logs for quicker incident resolution.

