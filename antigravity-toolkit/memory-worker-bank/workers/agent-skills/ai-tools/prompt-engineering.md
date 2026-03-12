# prompt-engineering
Source: https://antigravity.codes/agent-skills/ai-tools/prompt-engineering

## AI Worker Instructions
When the user requests functionality related to prompt-engineering, follow these guidelines and utilize this context.

## Scraped Content

# prompt-engineering
```
references/few-shot-patterns.md
```
```
Example 1 (Basic case):Input: {representative_input}Output: {expected_output}Example 2 (Edge case):Input: {challenging_input}Output: {robust_output}Example 3 (Error case):Input: {problematic_input}Output: {corrected_output}Now handle: {target_input}
```
```
Example 1 (Basic case):Input: {representative_input}Output: {expected_output}Example 2 (Edge case):Input: {challenging_input}Output: {robust_output}Example 3 (Error case):Input: {problematic_input}Output: {corrected_output}Now handle: {target_input}
```
```
references/cot-patterns.md
```
```
Let's approach this step-by-step:Step 1: {break_down_the_problem}Analysis: {detailed_reasoning}Step 2: {identify_key_components}Analysis: {component_analysis}Step 3: {synthesize_solution}Analysis: {solution_justification}Final Answer: {conclusion_with_confidence}
```
```
Let's approach this step-by-step:Step 1: {break_down_the_problem}Analysis: {detailed_reasoning}Step 2: {identify_key_components}Analysis: {component_analysis}Step 3: {synthesize_solution}Analysis: {solution_justification}Final Answer: {conclusion_with_confidence}
```
```
references/optimization-frameworks.md
```
```
references/template-systems.md
```
```
{user_input}
```
```
{context}
```
```
# System ContextYou are a {role} with {expertise_level} expertise in {domain}.# Task Context{if background_information}Background: {background_information}{endif}# Instructions{task_instructions}# Examples{example_count}# Output Format{output_specification}# Input{user_query}
```
```
# System ContextYou are a {role} with {expertise_level} expertise in {domain}.# Task Context{if background_information}Background: {background_information}{endif}# Instructions{task_instructions}# Examples{example_count}# Output Format{output_specification}# Input{user_query}
```
```
references/system-prompt-design.md
```
```
You are an expert {role} specializing in {domain} with {experience_level} of experience.## Core Capabilities- List specific capabilities and expertise areas- Define scope of knowledge and limitations## Behavioral Guidelines- Specify interaction style and communication approach- Define error handling and uncertainty protocols- Establish quality standards and verification requirements## Output Requirements- Specify format expectations and structural requirements- Define content inclusion and exclusion criteria- Establish consistency and validation requirements## Safety and Ethics- Include content policy adherence- Specify bias mitigation requirements- Define harm prevention protocols
```
```
You are an expert {role} specializing in {domain} with {experience_level} of experience.## Core Capabilities- List specific capabilities and expertise areas- Define scope of knowledge and limitations## Behavioral Guidelines- Specify interaction style and communication approach- Define error handling and uncertainty protocols- Establish quality standards and verification requirements## Output Requirements- Specify format expectations and structural requirements- Define content inclusion and exclusion criteria- Establish consistency and validation requirements## Safety and Ethics- Include content policy adherence- Specify bias mitigation requirements- Define harm prevention protocols
```
```
references/few-shot-patterns.md
```
```
references/cot-patterns.md
```
```
references/optimization-frameworks.md
```
```
references/template-systems.md
```
```
references/system-prompt-design.md
```
```
Classify customer feedback into categories using semantic similarity for example selection and diversity sampling for edge case coverage.
```
```
Classify customer feedback into categories using semantic similarity for example selection and diversity sampling for edge case coverage.
```
```
Implement step-by-step reasoning for financial analysis with verification steps and confidence scoring.
```
```
Implement step-by-step reasoning for financial analysis with verification steps and confidence scoring.
```
```
Create modular templates with role-based components and conditional sections for different inquiry types.
```
```
Create modular templates with role-based components and conditional sections for different inquiry types.
```
```
Design comprehensive system prompt with behavioral guidelines, output requirements, and safety constraints.
```
```
Design comprehensive system prompt with behavioral guidelines, output requirements, and safety constraints.
```
Unlock the full potential of your AI coding assistant with the Prompt Engineering skill. This essential toolkit empowers developers to craft highly effective prompts, transforming raw queries into precise, actionable instructions for large language models. Move beyond basic interactions to leverage advanced techniques like strategic example selection and structured reasoning, ensuring your AI generates more accurate, relevant, and efficient code or solutions. Elevate your development workflow by mastering the art of guiding AI, leading to significant improvements in productivity and code quality.

# When to Use This Skill
- •Creating new prompts for complex reasoning or analytical tasks with multi-step logic.
- •Optimizing existing prompts to achieve higher accuracy, reduce hallucinations, or improve efficiency.
- •Implementing few-shot learning by strategically selecting and presenting examples within context.
- •Designing robust system prompts to establish consistent model behavior and persona across interactions.

# Pro Tips
- 💡Always iterate and A/B test your prompt variations using clear performance metrics to identify the most effective patterns.
- 💡Combine few-shot examples with chain-of-thought reasoning for complex problems that require both context and step-by-step logic.
- 💡Leverage negative examples or explicit constraints within your system prompts to guide the LLM away from undesired outputs or behaviors.

