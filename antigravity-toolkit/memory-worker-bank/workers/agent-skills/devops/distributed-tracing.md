# distributed-tracing
Source: https://antigravity.codes/agent-skills/devops/distributed-tracing

## AI Worker Instructions
When the user requests functionality related to distributed-tracing, follow these guidelines and utilize this context.

## Scraped Content

# distributed-tracing
```
Trace (Request ID: abc123)  ↓Span (frontend) [100ms]  ↓Span (api-gateway) [80ms]  ├→ Span (auth-service) [10ms]  └→ Span (user-service) [60ms]      └→ Span (database) [40ms]
```
```
Trace (Request ID: abc123)  ↓Span (frontend) [100ms]  ↓Span (api-gateway) [80ms]  ├→ Span (auth-service) [10ms]  └→ Span (user-service) [60ms]      └→ Span (database) [40ms]
```
```
# Deploy Jaeger Operatorkubectl create namespace observabilitykubectl create -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.51.0/jaeger-operator.yaml -n observability# Deploy Jaeger instancekubectl apply -f - <<EOFapiVersion: jaegertracing.io/v1kind: Jaegermetadata:  name: jaeger  namespace: observabilityspec:  strategy: production  storage:    type: elasticsearch    options:      es:        server-urls: http://elasticsearch:9200  ingress:    enabled: trueEOF
```
```
# Deploy Jaeger Operatorkubectl create namespace observabilitykubectl create -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.51.0/jaeger-operator.yaml -n observability# Deploy Jaeger instancekubectl apply -f - <<EOFapiVersion: jaegertracing.io/v1kind: Jaegermetadata:  name: jaeger  namespace: observabilityspec:  strategy: production  storage:    type: elasticsearch    options:      es:        server-urls: http://elasticsearch:9200  ingress:    enabled: trueEOF
```
```
version: "3.8"services:  jaeger:    image: jaegertracing/all-in-one:latest    ports:      - "5775:5775/udp"      - "6831:6831/udp"      - "6832:6832/udp"      - "5778:5778"      - "16686:16686" # UI      - "14268:14268" # Collector      - "14250:14250" # gRPC      - "9411:9411" # Zipkin    environment:      - COLLECTOR_ZIPKIN_HOST_PORT=:9411
```
```
version: "3.8"services:  jaeger:    image: jaegertracing/all-in-one:latest    ports:      - "5775:5775/udp"      - "6831:6831/udp"      - "6832:6832/udp"      - "5778:5778"      - "16686:16686" # UI      - "14268:14268" # Collector      - "14250:14250" # gRPC      - "9411:9411" # Zipkin    environment:      - COLLECTOR_ZIPKIN_HOST_PORT=:9411
```
```
references/jaeger-setup.md
```
```
from opentelemetry import tracefrom opentelemetry.exporter.jaeger.thrift import JaegerExporterfrom opentelemetry.sdk.resources import SERVICE_NAME, Resourcefrom opentelemetry.sdk.trace import TracerProviderfrom opentelemetry.sdk.trace.export import BatchSpanProcessorfrom opentelemetry.instrumentation.flask import FlaskInstrumentorfrom flask import Flask# Initialize tracerresource = Resource(attributes={SERVICE_NAME: "my-service"})provider = TracerProvider(resource=resource)processor = BatchSpanProcessor(JaegerExporter(    agent_host_name="jaeger",    agent_port=6831,))provider.add_span_processor(processor)trace.set_tracer_provider(provider)# Instrument Flaskapp = Flask(__name__)FlaskInstrumentor().instrument_app(app)@app.route('/api/users')def get_users():    tracer = trace.get_tracer(__name__)    with tracer.start_as_current_span("get_users") as span:        span.set_attribute("user.count", 100)        # Business logic        users = fetch_users_from_db()        return {"users": users}def fetch_users_from_db():    tracer = trace.get_tracer(__name__)    with tracer.start_as_current_span("database_query") as span:        span.set_attribute("db.system", "postgresql")        span.set_attribute("db.statement", "SELECT * FROM users")        # Database query        return query_database()
```
```
from opentelemetry import tracefrom opentelemetry.exporter.jaeger.thrift import JaegerExporterfrom opentelemetry.sdk.resources import SERVICE_NAME, Resourcefrom opentelemetry.sdk.trace import TracerProviderfrom opentelemetry.sdk.trace.export import BatchSpanProcessorfrom opentelemetry.instrumentation.flask import FlaskInstrumentorfrom flask import Flask# Initialize tracerresource = Resource(attributes={SERVICE_NAME: "my-service"})provider = TracerProvider(resource=resource)processor = BatchSpanProcessor(JaegerExporter(    agent_host_name="jaeger",    agent_port=6831,))provider.add_span_processor(processor)trace.set_tracer_provider(provider)# Instrument Flaskapp = Flask(__name__)FlaskInstrumentor().instrument_app(app)@app.route('/api/users')def get_users():    tracer = trace.get_tracer(__name__)    with tracer.start_as_current_span("get_users") as span:        span.set_attribute("user.count", 100)        # Business logic        users = fetch_users_from_db()        return {"users": users}def fetch_users_from_db():    tracer = trace.get_tracer(__name__)    with tracer.start_as_current_span("database_query") as span:        span.set_attribute("db.system", "postgresql")        span.set_attribute("db.statement", "SELECT * FROM users")        # Database query        return query_database()
```
```
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");const { registerInstrumentations } = require("@opentelemetry/instrumentation");const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");const {  ExpressInstrumentation,} = require("@opentelemetry/instrumentation-express");// Initialize tracerconst provider = new NodeTracerProvider({  resource: { attributes: { "service.name": "my-service" } },});const exporter = new JaegerExporter({  endpoint: "http://jaeger:14268/api/traces",});provider.addSpanProcessor(new BatchSpanProcessor(exporter));provider.register();// Instrument librariesregisterInstrumentations({  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],});const express = require("express");const app = express();app.get("/api/users", async (req, res) => {  const tracer = trace.getTracer("my-service");  const span = tracer.startSpan("get_users");  try {    const users = await fetchUsers();    span.setAttributes({ "user.count": users.length });    res.json({ users });  } finally {    span.end();  }});
```
```
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");const { registerInstrumentations } = require("@opentelemetry/instrumentation");const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");const {  ExpressInstrumentation,} = require("@opentelemetry/instrumentation-express");// Initialize tracerconst provider = new NodeTracerProvider({  resource: { attributes: { "service.name": "my-service" } },});const exporter = new JaegerExporter({  endpoint: "http://jaeger:14268/api/traces",});provider.addSpanProcessor(new BatchSpanProcessor(exporter));provider.register();// Instrument librariesregisterInstrumentations({  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],});const express = require("express");const app = express();app.get("/api/users", async (req, res) => {  const tracer = trace.getTracer("my-service");  const span = tracer.startSpan("get_users");  try {    const users = await fetchUsers();    span.setAttributes({ "user.count": users.length });    res.json({ users });  } finally {    span.end();  }});
```
```
package mainimport (    "context"    "go.opentelemetry.io/otel"    "go.opentelemetry.io/otel/exporters/jaeger"    "go.opentelemetry.io/otel/sdk/resource"    sdktrace "go.opentelemetry.io/otel/sdk/trace"    semconv "go.opentelemetry.io/otel/semconv/v1.4.0")func initTracer() (*sdktrace.TracerProvider, error) {    exporter, err := jaeger.New(jaeger.WithCollectorEndpoint(        jaeger.WithEndpoint("http://jaeger:14268/api/traces"),    ))    if err != nil {        return nil, err    }    tp := sdktrace.NewTracerProvider(        sdktrace.WithBatcher(exporter),        sdktrace.WithResource(resource.NewWithAttributes(            semconv.SchemaURL,            semconv.ServiceNameKey.String("my-service"),        )),    )    otel.SetTracerProvider(tp)    return tp, nil}func getUsers(ctx context.Context) ([]User, error) {    tracer := otel.Tracer("my-service")    ctx, span := tracer.Start(ctx, "get_users")    defer span.End()    span.SetAttributes(attribute.String("user.filter", "active"))    users, err := fetchUsersFromDB(ctx)    if err != nil {        span.RecordError(err)        return nil, err    }    span.SetAttributes(attribute.Int("user.count", len(users)))    return users, nil}
```
```
package mainimport (    "context"    "go.opentelemetry.io/otel"    "go.opentelemetry.io/otel/exporters/jaeger"    "go.opentelemetry.io/otel/sdk/resource"    sdktrace "go.opentelemetry.io/otel/sdk/trace"    semconv "go.opentelemetry.io/otel/semconv/v1.4.0")func initTracer() (*sdktrace.TracerProvider, error) {    exporter, err := jaeger.New(jaeger.WithCollectorEndpoint(        jaeger.WithEndpoint("http://jaeger:14268/api/traces"),    ))    if err != nil {        return nil, err    }    tp := sdktrace.NewTracerProvider(        sdktrace.WithBatcher(exporter),        sdktrace.WithResource(resource.NewWithAttributes(            semconv.SchemaURL,            semconv.ServiceNameKey.String("my-service"),        )),    )    otel.SetTracerProvider(tp)    return tp, nil}func getUsers(ctx context.Context) ([]User, error) {    tracer := otel.Tracer("my-service")    ctx, span := tracer.Start(ctx, "get_users")    defer span.End()    span.SetAttributes(attribute.String("user.filter", "active"))    users, err := fetchUsersFromDB(ctx)    if err != nil {        span.RecordError(err)        return nil, err    }    span.SetAttributes(attribute.Int("user.count", len(users)))    return users, nil}
```
```
references/instrumentation.md
```
```
traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01tracestate: congo=t61rcWkgMzE
```
```
traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01tracestate: congo=t61rcWkgMzE
```
```
from opentelemetry.propagate import injectheaders = {}inject(headers)  # Injects trace contextresponse = requests.get('http://downstream-service/api', headers=headers)
```
```
from opentelemetry.propagate import injectheaders = {}inject(headers)  # Injects trace contextresponse = requests.get('http://downstream-service/api', headers=headers)
```
```
const { propagation } = require("@opentelemetry/api");const headers = {};propagation.inject(context.active(), headers);axios.get("http://downstream-service/api", { headers });
```
```
const { propagation } = require("@opentelemetry/api");const headers = {};propagation.inject(context.active(), headers);axios.get("http://downstream-service/api", { headers });
```
```
apiVersion: v1kind: ConfigMapmetadata:  name: tempo-configdata:  tempo.yaml: |    server:      http_listen_port: 3200    distributor:      receivers:        jaeger:          protocols:            thrift_http:            grpc:        otlp:          protocols:            http:            grpc:    storage:      trace:        backend: s3        s3:          bucket: tempo-traces          endpoint: s3.amazonaws.com    querier:      frontend_worker:        frontend_address: tempo-query-frontend:9095---apiVersion: apps/v1kind: Deploymentmetadata:  name: tempospec:  replicas: 1  template:    spec:      containers:        - name: tempo          image: grafana/tempo:latest          args:            - -config.file=/etc/tempo/tempo.yaml          volumeMounts:            - name: config              mountPath: /etc/tempo      volumes:        - name: config          configMap:            name: tempo-config
```
```
apiVersion: v1kind: ConfigMapmetadata:  name: tempo-configdata:  tempo.yaml: |    server:      http_listen_port: 3200    distributor:      receivers:        jaeger:          protocols:            thrift_http:            grpc:        otlp:          protocols:            http:            grpc:    storage:      trace:        backend: s3        s3:          bucket: tempo-traces          endpoint: s3.amazonaws.com    querier:      frontend_worker:        frontend_address: tempo-query-frontend:9095---apiVersion: apps/v1kind: Deploymentmetadata:  name: tempospec:  replicas: 1  template:    spec:      containers:        - name: tempo          image: grafana/tempo:latest          args:            - -config.file=/etc/tempo/tempo.yaml          volumeMounts:            - name: config              mountPath: /etc/tempo      volumes:        - name: config          configMap:            name: tempo-config
```
```
assets/jaeger-config.yaml.template
```
```
# Sample 1% of tracessampler:  type: probabilistic  param: 0.01
```
```
# Sample 1% of tracessampler:  type: probabilistic  param: 0.01
```
```
# Sample max 100 traces per secondsampler:  type: ratelimiting  param: 100
```
```
# Sample max 100 traces per secondsampler:  type: ratelimiting  param: 100
```
```
from opentelemetry.sdk.trace.sampling import ParentBased, TraceIdRatioBased# Sample based on trace ID (deterministic)sampler = ParentBased(root=TraceIdRatioBased(0.01))
```
```
from opentelemetry.sdk.trace.sampling import ParentBased, TraceIdRatioBased# Sample based on trace ID (deterministic)sampler = ParentBased(root=TraceIdRatioBased(0.01))
```
```
service=my-serviceduration > 1s
```
```
service=my-serviceduration > 1s
```
```
service=my-serviceerror=truetags.http.status_code >= 500
```
```
service=my-serviceerror=truetags.http.status_code >= 500
```
```
import loggingfrom opentelemetry import tracelogger = logging.getLogger(__name__)def process_request():    span = trace.get_current_span()    trace_id = span.get_span_context().trace_id    logger.info(        "Processing request",        extra={"trace_id": format(trace_id, '032x')}    )
```
```
import loggingfrom opentelemetry import tracelogger = logging.getLogger(__name__)def process_request():    span = trace.get_current_span()    trace_id = span.get_span_context().trace_id    logger.info(        "Processing request",        extra={"trace_id": format(trace_id, '032x')}    )
```
```
references/jaeger-setup.md
```
```
references/instrumentation.md
```
```
assets/jaeger-config.yaml.template
```
```
prometheus-configuration
```
```
grafana-dashboards
```
```
slo-implementation
```
Navigating the complexities of modern microservices architectures requires powerful tools. This agent skill empowers your coding assistant to implement and leverage distributed tracing, providing unparalleled visibility into your system's request flows. By integrating Jaeger and Tempo, it helps pinpoint performance bottlenecks, understand intricate service dependencies, and rapidly debug issues across your distributed applications. Gain deeper insights into latency, errors, and the overall health of your services, transforming your approach to system observability and troubleshooting.

# When to Use This Skill
- •Debugging a performance bottleneck in a multi-service transaction across a microservices architecture.
- •Understanding the end-to-end path a user request takes across various distributed services.
- •Troubleshooting intermittent errors that propagate through several interconnected microservices.
- •Setting up comprehensive observability for a new distributed application to monitor its health and performance.

# Pro Tips
- 💡Ensure consistent context propagation (e.g., HTTP headers) across ALL services, even non-instrumented ones, to maintain trace integrity.
- 💡Utilize meaningful tags and structured logs within spans to enrich trace data, making filtering and debugging more effective.
- 💡Regularly review your distributed traces to identify common patterns, recurring bottlenecks, or unexpected service dependencies for proactive optimization.

