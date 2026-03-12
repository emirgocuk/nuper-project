# workflow-orchestration-patterns
Source: https://antigravity.codes/agent-skills/workflow/workflow-orchestration-patterns

## AI Worker Instructions
When the user requests functionality related to workflow-orchestration-patterns, follow these guidelines and utilize this context.

## Scraped Content

# workflow-orchestration-patterns
```
Does it touch external systems? → ActivityIs it orchestration/decision logic? → Workflow
```
```
Does it touch external systems? → ActivityIs it orchestration/decision logic? → Workflow
```
```
For each step:  1. Register compensation BEFORE executing  2. Execute the step (via activity)  3. On failure, run all compensations in reverse order (LIFO)
```
```
For each step:  1. Register compensation BEFORE executing  2. Execute the step (via activity)  3. On failure, run all compensations in reverse order (LIFO)
```
```
random()
```
```
datetime.now()
```
```
workflow.now()
```
```
workflow.random()
```
```
workflow.get_version()
```
```
datetime.now()
```
```
workflow.now()
```
Navigating the complexities of distributed systems demands robust strategies for managing multi-step processes and ensuring fault tolerance. This skill empowers AI agents to architect resilient and scalable workflows using Temporal, a powerful orchestration engine. It goes beyond basic task scheduling, diving into critical design decisions like separating workflows from activities, implementing reliable saga patterns for distributed transactions, and handling state persistence. By leveraging these insights, developers can build systems that automatically recover from failures, manage long-running operations, and orchestrate microservices with confidence, significantly enhancing system reliability and maintainability.

# When to Use This Skill
- •Designing a multi-step e-commerce order fulfillment system that spans inventory, payment, and shipping services, ensuring atomicity.
- •Implementing a customer onboarding process that involves multiple external API calls, human approvals, and scheduled follow-ups over weeks.
- •Building an infrastructure provisioning pipeline where steps must execute sequentially, handle retries, and resume automatically after failures.
- •Orchestrating complex financial transactions that require compensating actions if any part of the distributed process fails.

# Pro Tips
- 💡Always clearly delineate between Workflow Code (deterministic, orchestrating logic) and Activity Code (non-deterministic, I/O operations). This is key for Temporal's reliability.
- 💡When designing sagas, map out all potential failure points and define explicit compensation activities for each step to ensure data consistency across services.
- 💡Leverage Temporal's Query and Signal APIs to interact with running workflows, enabling real-time status checks and external event injection without violating determinism.

