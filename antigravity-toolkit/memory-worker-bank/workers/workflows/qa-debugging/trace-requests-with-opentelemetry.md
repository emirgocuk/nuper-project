# Trace Requests with OpenTelemetry
Source: https://antigravity.codes/workflows/qa-debugging/trace-distributed-requests-opentelemetry-jaeger

## AI Worker Instructions
When the user requests functionality related to Trace Requests with OpenTelemetry, follow these guidelines and utilize this context.

## Scraped Content

# Trace Requests with OpenTelemetry
```
npm install @opentelemetry/api
```
```
import { trace } from '@opentelemetry/api';   const traceId = trace.getActiveSpan()?.spanContext().traceId;
```
```
import { trace } from '@opentelemetry/api';   const traceId = trace.getActiveSpan()?.spanContext().traceId;
```
```
docker run -d -p 16686:16686 jaegertracing/all-in-one
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as trace-distributed-requests-opentelemetry-jaeger.md
```
trace-distributed-requests-opentelemetry-jaeger.md
```
- In Antigravity, type /trace_distributed_requests_opentelemetry_jaeger or just describe what you want to do
```
/trace_distributed_requests_opentelemetry_jaeger
```
Learn more about workflows →

# Related Workflows

# React Performance Profiling

# Simulate Slow Network

# Debug Memory Leaks in React

