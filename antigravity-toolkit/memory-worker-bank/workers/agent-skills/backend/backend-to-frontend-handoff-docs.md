# backend-to-frontend-handoff-docs
Source: https://antigravity.codes/agent-skills/backend/backend-to-frontend-handoff-docs

## AI Worker Instructions
When the user requests functionality related to backend-to-frontend-handoff-docs, follow these guidelines and utilize this context.

## Scraped Content

# backend-to-frontend-handoff-docs
```
.claude/docs/ai/<feature-name>/api-handoff.md
```
```
-v2
```
```
-v3
```
```
# API Handoff: [Feature Name]## Business Context[2-4 sentences: What problem does this solve? Who uses it? Why does it matter? Include any domain terms the frontend needs to understand.]## Endpoints### [METHOD] /path/to/endpoint- **Purpose**: [1 line: what it does]- **Auth**: [required role/permission, or "public"]- **Request**:
```
```
# API Handoff: [Feature Name]## Business Context[2-4 sentences: What problem does this solve? Who uses it? Why does it matter? Include any domain terms the frontend needs to understand.]## Endpoints### [METHOD] /path/to/endpoint- **Purpose**: [1 line: what it does]- **Auth**: [required role/permission, or "public"]- **Request**:
```
```
- **Response** (success):
```
```
- **Response** (success):
```
```
- **Response** (error): [HTTP codes and shapes, e.g., 422 validation, 404 not found]- **Notes**: [edge cases, rate limits, pagination, sorting, anything non-obvious][Repeat for each endpoint]## Data Models / DTOs[List key models/DTOs the frontend will receive or send. Include field types, nullability, enums, and business meaning.]
```
```
- **Response** (error): [HTTP codes and shapes, e.g., 422 validation, 404 not found]- **Notes**: [edge cases, rate limits, pagination, sorting, anything non-obvious][Repeat for each endpoint]## Data Models / DTOs[List key models/DTOs the frontend will receive or send. Include field types, nullability, enums, and business meaning.]
```
```
## Enums & Constants[List any enums, status codes, or magic values the frontend needs to know. Include display labels if relevant.]| Value | Meaning | Display Label ||-------|---------|---------------|| pending | Awaiting review | Pending |## Validation Rules[Summarize key validation rules the frontend should mirror for UX—required fields, min/max, formats, conditional rules.]## Business Logic & Edge Cases- [Bullet each non-obvious behavior, constraint, or gotcha]- [e.g., "User can only submit once per day", "Soft-deleted items excluded by default"]## Integration Notes- **Recommended flow**: [e.g., "Fetch list → select item → submit form → poll for status"]- **Optimistic UI**: [safe or not, why]- **Caching**: [any cache headers, invalidation triggers]- **Real-time**: [websocket events, polling intervals if applicable]## Test Scenarios[Key scenarios frontend should handle—happy path, errors, edge cases. Use as acceptance criteria or test cases.]1. **Happy path**: [brief description]2. **Validation error**: [what triggers it, expected response]3. **Not found**: [when 404 is returned]4. **Permission denied**: [when 403 is returned]## Open Questions / TODOs[Anything unresolved, pending PM decision, or needs frontend input. If none, omit section.]
```
```
## Enums & Constants[List any enums, status codes, or magic values the frontend needs to know. Include display labels if relevant.]| Value | Meaning | Display Label ||-------|---------|---------------|| pending | Awaiting review | Pending |## Validation Rules[Summarize key validation rules the frontend should mirror for UX—required fields, min/max, formats, conditional rules.]## Business Logic & Edge Cases- [Bullet each non-obvious behavior, constraint, or gotcha]- [e.g., "User can only submit once per day", "Soft-deleted items excluded by default"]## Integration Notes- **Recommended flow**: [e.g., "Fetch list → select item → submit form → poll for status"]- **Optimistic UI**: [safe or not, why]- **Caching**: [any cache headers, invalidation triggers]- **Real-time**: [websocket events, polling intervals if applicable]## Test Scenarios[Key scenarios frontend should handle—happy path, errors, edge cases. Use as acceptance criteria or test cases.]1. **Happy path**: [brief description]2. **Validation error**: [what triggers it, expected response]3. **Not found**: [when 404 is returned]4. **Permission denied**: [when 403 is returned]## Open Questions / TODOs[Anything unresolved, pending PM decision, or needs frontend input. If none, omit section.]
```
```
pending
```
Efficient collaboration between backend and frontend teams is crucial for rapid development cycles. This AI Agent Skill specializes in generating meticulously structured API handoff documentation, ensuring frontend developers have all necessary business and technical context without needing constant clarification. By automating this vital step, it accelerates UI and integration work, minimizes communication overhead, and prevents common integration pitfalls. It's designed to provide crystal-clear instructions, making the transition from backend completion to frontend implementation smooth and error-free, ultimately boosting overall team productivity.

# When to Use This Skill
- •After completing a new REST API for a feature, use this skill to create the official handoff document for the frontend team.
- •When an existing API needs major modifications, generate updated documentation to reflect changes in endpoints, DTOs, or validation rules.
- •To onboard new frontend developers by providing them with a complete, structured overview of backend APIs they'll be integrating.
- •As a final step in the backend development workflow, ensuring all API details are captured and easily consumable before marking a task as 'done'.

# Pro Tips
- 💡Always review the generated document for any nuances or specific edge cases that might not have been explicitly covered by the AI, adding them manually for ultimate clarity.
- 💡Provide the AI with the most comprehensive code context and business requirements upfront to ensure the most accurate and detailed handoff documentation.
- 💡Integrate this skill into your CI/CD pipeline or pull request workflow to automatically generate or update API documentation whenever backend changes are merged.

