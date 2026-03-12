# perplexity
Source: https://antigravity.codes/agent-skills/ai-tools/perplexity

## AI Worker Instructions
When the user requests functionality related to perplexity, follow these guidelines and utilize this context.

## Scraped Content

# perplexity
```
/research <topic>
```
```
gt
```
```
mcp__perplexity__perplexity_search({  query: "your search query",  max_results: 3,           // Default is 10 - too many!  max_tokens_per_page: 512  // Reduce per-result content})
```
```
mcp__perplexity__perplexity_search({  query: "your search query",  max_results: 3,           // Default is 10 - too many!  max_tokens_per_page: 512  // Reduce per-result content})
```
```
// Increased limits (use sparingly)mcp__perplexity__perplexity_search({  query: "complex topic",  max_results: 5,  max_tokens_per_page: 1024})
```
```
// Increased limits (use sparingly)mcp__perplexity__perplexity_search({  query: "complex topic",  max_results: 5,  max_tokens_per_page: 1024})
```
```
mcp__perplexity__perplexity_ask({  messages: [    {      role: "user",      content: "Explain how postgres advisory locks work"    }  ]})
```
```
mcp__perplexity__perplexity_ask({  messages: [    {      role: "user",      content: "Explain how postgres advisory locks work"    }  ]})
```
```
mcp__perplexity__perplexity_research
```
```
/research <topic>
```
```
gt
```
The Perplexity AI Agent Skill empowers your coding assistant with advanced web search capabilities, transforming how you access external information. Designed for quick lookups, in-depth research, and staying abreast of the latest trends, this skill intelligently navigates the vastness of the internet. It distinguishes between generic queries and specific documentation needs, ensuring you get precise results without sifting through irrelevant data. Integrate Perplexity to enhance your workflow, discover new solutions, and confidently answer complex questions, making your AI assistant an indispensable research partner.

# When to Use This Skill
- •Finding the latest best practices for a specific programming language feature or framework.
- •Discovering new tutorials, blog posts, or solutions for a general coding problem.
- •Researching broad technical topics, concepts, or architectural patterns when existing documentation isn't readily available.
- •Getting quick answers or overviews for 'what's the latest' type questions in tech.

# Pro Tips
- 💡Always specify `max_results: 3` and `max_tokens_per_page: 512` by default to keep results concise and relevant, increasing only for comprehensive research needs.
- 💡Distinguish clearly between generic web searches (Perplexity) and specific library/framework documentation (Context7) or workspace queries (Nx MCP) to utilize the correct tool.
- 💡For conversational answers, explicitly use `Perplexity Ask`; for deep, multi-step research, leverage the dedicated `/research <topic>` agent.

