# multi-cloud-architecture
Source: https://antigravity.codes/agent-skills/architecture/multi-cloud-architecture

## AI Worker Instructions
When the user requests functionality related to multi-cloud-architecture, follow these guidelines and utilize this context.

## Scraped Content

# multi-cloud-architecture
```
references/service-comparison.md
```
```
Application Layer    ↓Infrastructure Abstraction (Terraform)    ↓Cloud Provider APIs    ↓AWS / Azure / GCP
```
```
Application Layer    ↓Infrastructure Abstraction (Terraform)    ↓Cloud Provider APIs    ↓AWS / Azure / GCP
```
```
references/multi-cloud-patterns.md
```
```
references/service-comparison.md
```
```
references/multi-cloud-patterns.md
```
```
terraform-module-library
```
```
cost-optimization
```
```
hybrid-cloud-networking
```
Navigating the complex landscape of cloud providers can be challenging, but designing a resilient multi-cloud strategy empowers organizations to harness the strengths of AWS, Azure, and GCP simultaneously. This AI Agent Skill provides an invaluable framework for architects and developers aiming to build cloud-agnostic systems. It guides users through critical decisions, comparing essential services like compute, storage, and serverless functions across major platforms. Leverage this skill to make informed choices, optimize costs, enhance reliability, and strategically avoid vendor lock-in, ensuring your infrastructure is future-proof and highly adaptable.

# When to Use This Skill
- •Designing a new application for deployment across multiple cloud providers.
- •Migrating an existing monolithic application to a cloud-agnostic microservices architecture.
- •Evaluating and selecting the most cost-effective or performant service (e.g., database, compute) from AWS, Azure, or GCP for a specific workload.
- •Building a disaster recovery strategy that spans across different cloud environments to enhance resilience.

# Pro Tips
- 💡Always account for data egress costs when designing multi-cloud data strategies; these can quickly erode cost savings from leveraging multiple providers.
- 💡Prioritize common services and open standards (e.g., Kubernetes, serverless functions, PostgreSQL) that have similar patterns across clouds, making your architecture more portable.
- 💡Implement a unified identity and access management (IAM) strategy across all cloud providers using tools like Okta or Azure AD to simplify governance and security.

