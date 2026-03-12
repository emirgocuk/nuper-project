# excalidraw
Source: https://antigravity.codes/agent-skills/architecture/excalidraw

## AI Worker Instructions
When the user requests functionality related to excalidraw, follow these guidelines and utilize this context.

## Scraped Content

# excalidraw
```
.excalidraw
```
```
.excalidraw.json
```
```
Task: Extract and explain the components in [file.excalidraw.json]Approach:1. Read the Excalidraw JSON2. Extract only text elements (ignore positioning/styling)3. Identify relationships between components4. Summarize architecture/flowReturn:- List of components/services with descriptions- Connection/dependency relationships- Key insights about the architecture- DO NOT return raw JSON or verbose element details
```
```
Task: Extract and explain the components in [file.excalidraw.json]Approach:1. Read the Excalidraw JSON2. Extract only text elements (ignore positioning/styling)3. Identify relationships between components4. Summarize architecture/flowReturn:- List of components/services with descriptions- Connection/dependency relationships- Key insights about the architecture- DO NOT return raw JSON or verbose element details
```
```
Task: Add [component] to [file.excalidraw.json], connected to [existing-component]Approach:1. Read file to identify existing elements2. Find [existing-component] and its position3. Create new element JSON for [component]4. Add arrow elements for connections5. Write updated fileReturn:- Confirmation of changes made- Position of new element- IDs of created elements
```
```
Task: Add [component] to [file.excalidraw.json], connected to [existing-component]Approach:1. Read file to identify existing elements2. Find [existing-component] and its position3. Create new element JSON for [component]4. Add arrow elements for connections5. Write updated fileReturn:- Confirmation of changes made- Position of new element- IDs of created elements
```
```
Task: Create new Excalidraw diagram showing [description]Approach:1. Design layout for [number] components2. Create rectangle elements with text labels3. Add arrows showing relationships4. Use consistent styling (colors, fonts)5. Write to [file.excalidraw.json]Return:- Confirmation of file created- Summary of components included- File location
```
```
Task: Create new Excalidraw diagram showing [description]Approach:1. Design layout for [number] components2. Create rectangle elements with text labels3. Add arrows showing relationships4. Use consistent styling (colors, fonts)5. Write to [file.excalidraw.json]Return:- Confirmation of file created- Summary of components included- File location
```
```
Task: Compare architecture approaches in [file1] vs [file2]Approach:1. Read both files2. Extract text labels from each3. Identify structural differences4. Compare component relationshipsReturn:- Key differences in architecture- Components unique to each approach- Relationship/flow differences- DO NOT return full element details from both files
```
```
Task: Compare architecture approaches in [file1] vs [file2]Approach:1. Read both files2. Extract text labels from each3. Identify structural differences4. Compare component relationshipsReturn:- Key differences in architecture- Components unique to each approach- Relationship/flow differences- DO NOT return full element details from both files
```
```
User: "What architecture is shown in detailed-architecture.excalidraw.json?"Agent: Let me read that file... [reads 22k tokens into main context]
```
```
User: "What architecture is shown in detailed-architecture.excalidraw.json?"Agent: Let me read that file... [reads 22k tokens into main context]
```
```
User: "What architecture is shown in detailed-architecture.excalidraw.json?"Agent: I'll use a subagent to extract the architecture details.[Dispatches Task tool with general-purpose subagent]Task: Extract and explain components in .ryanquinn3/ticketing/detailed-architecture.excalidraw.json[Receives ~500 token summary with component list and relationships][Responds to user with architecture explanation, main context preserved]
```
```
User: "What architecture is shown in detailed-architecture.excalidraw.json?"Agent: I'll use a subagent to extract the architecture details.[Dispatches Task tool with general-purpose subagent]Task: Extract and explain components in .ryanquinn3/ticketing/detailed-architecture.excalidraw.json[Receives ~500 token summary with component list and relationships][Responds to user with architecture explanation, main context preserved]
```
Navigating complex Excalidraw diagrams with AI models can quickly become a bottleneck due to their verbose JSON structure. This specialized skill addresses the challenge by intelligently delegating Excalidraw file operations to subagents. Instead of overwhelming the main AI with low signal-to-noise visual metadata, it extracts key information efficiently. This approach ensures your coding assistant remains agile, avoiding context exhaustion while still enabling sophisticated understanding and manipulation of your architectural and flowchart visualizations without direct, token-costly parsing.

# When to Use This Skill
- •Explaining an existing system architecture or data flow diagram presented in an Excalidraw file.
- •Updating a flowchart in an Excalidraw file based on new requirements or refactorings.
- •Generating a new architecture visualization from a high-level description, directly into an Excalidraw format.
- •Analyzing relationships between elements in a series of Excalidraw diagrams to identify dependencies.

# Pro Tips
- 💡When requesting changes, be as specific as possible about the textual content or key relationships, rather than visual styling, to guide the subagent efficiently.
- 💡Leverage this skill for large, multi-file Excalidraw projects; the delegation prevents your main agent from exceeding token limits across numerous diagrams.
- 💡Combine with documentation generation skills to automatically embed diagram explanations alongside your code documentation.

