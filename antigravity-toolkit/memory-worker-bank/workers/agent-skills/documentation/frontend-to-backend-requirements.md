# frontend-to-backend-requirements
Source: https://antigravity.codes/agent-skills/documentation/frontend-to-backend-requirements

## AI Worker Instructions
When the user requests functionality related to frontend-to-backend-requirements, follow these guidelines and utilize this context.

## Scraped Content

# frontend-to-backend-requirements
```
.claude/docs/ai/<feature-name>/backend-requirements.md
```
```
.claude/docs/ai/<feature-name>/backend-requirements.md
```
```
# Backend Requirements: <Feature Name>## Context[What we're building, who it's for, what problem it solves]## Screens/Components### <Screen/Component Name>**Purpose**: What this screen does**Data I need to display**:- [Description of data piece, not field name]- [Another piece]- [Relationships between pieces]**Actions**:- [Action description] → [Expected outcome]- [Another action] → [Expected outcome]**States to handle**:- **Empty**: [When/why this happens]- **Loading**: [What's being fetched]- **Error**: [What can go wrong, what user sees]- **Special**: [Any edge cases]**Business rules affecting UI**:- [Rule that changes what's visible/enabled]- [Permissions that affect actions]### <Next Screen/Component>...## Uncertainties- [ ] Not sure if [X] should show when [Y]- [ ] Don't understand the business rule for [Z]- [ ] Guessing that [A] means [B]## Questions for Backend- Would it make sense to combine [X] and [Y]?- Should I expect [Z] to always be present?- Is there existing data I can reuse for [W]?## Discussion Log[Backend responses, decisions made, changes to requirements]
```
```
# Backend Requirements: <Feature Name>## Context[What we're building, who it's for, what problem it solves]## Screens/Components### <Screen/Component Name>**Purpose**: What this screen does**Data I need to display**:- [Description of data piece, not field name]- [Another piece]- [Relationships between pieces]**Actions**:- [Action description] → [Expected outcome]- [Another action] → [Expected outcome]**States to handle**:- **Empty**: [When/why this happens]- **Loading**: [What's being fetched]- **Error**: [What can go wrong, what user sees]- **Special**: [Any edge cases]**Business rules affecting UI**:- [Rule that changes what's visible/enabled]- [Permissions that affect actions]### <Next Screen/Component>...## Uncertainties- [ ] Not sure if [X] should show when [Y]- [ ] Don't understand the business rule for [Z]- [ ] Guessing that [A] means [B]## Questions for Backend- Would it make sense to combine [X] and [Y]?- Should I expect [Z] to always be present?- Is there existing data I can reuse for [W]?## Discussion Log[Backend responses, decisions made, changes to requirements]
```
Bridge the communication gap between frontend and backend teams with this specialized Agent Skill. Designed to articulate frontend data needs clearly and concisely, it helps prevent miscommunications and ensures backend developers build exactly what the UI requires. By focusing on 'what' data is needed rather than 'how' it's implemented, this skill empowers frontend engineers to define their requirements effectively, leading to smoother development cycles and better-aligned features. Leverage this tool to create comprehensive API requirement documents that foster collaboration and accelerate project delivery, ensuring all stakeholders are on the same page from the start.

# When to Use This Skill
- •When a frontend developer needs to formally request specific data structures or actions from the backend for a new UI component or page.
- •During the planning phase of a feature, to outline all necessary API interactions and data points required to support the user experience.
- •To create a clear, documented source of truth for API requirements, reducing ad-hoc communication and potential misunderstandings.
- •When updating an existing UI and needing to communicate changes or new data requirements to the backend team.

# Pro Tips
- 💡Before generating the requirements, ensure you have a clear understanding of the UI's functionality, user interactions, and business rules to provide the most comprehensive input.
- 💡Use real-world user stories or scenarios when describing actions and data needs to give backend developers context and help them understand the 'why'.
- 💡Leverage the 'What Backend Owns' table as a mental checklist to ensure you're not overstepping into implementation details, maintaining a clear separation of concerns.

