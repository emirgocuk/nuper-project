# context7
Source: https://antigravity.codes/agent-skills/documentation/context7

## AI Worker Instructions
When the user requests functionality related to context7, follow these guidelines and utilize this context.

## Scraped Content

# context7
```
curl -s "https://context7.com/api/v2/libs/search?libraryName=LIBRARY_NAME&query=TOPIC" | jq '.results[0]'
```
```
curl -s "https://context7.com/api/v2/libs/search?libraryName=LIBRARY_NAME&query=TOPIC" | jq '.results[0]'
```
```
libraryName
```
```
query
```
```
id
```
```
/websites/react_dev_reference
```
```
title
```
```
description
```
```
totalSnippets
```
```
curl -s "https://context7.com/api/v2/context?libraryId=LIBRARY_ID&query=TOPIC&type=txt"
```
```
curl -s "https://context7.com/api/v2/context?libraryId=LIBRARY_ID&query=TOPIC&type=txt"
```
```
libraryId
```
```
query
```
```
type
```
```
json
```
```
txt
```
```
# Find React library IDcurl -s "https://context7.com/api/v2/libs/search?libraryName=react&query=hooks" | jq '.results[0].id'# Returns: "/websites/react_dev_reference"# Fetch useState documentationcurl -s "https://context7.com/api/v2/context?libraryId=/websites/react_dev_reference&query=useState&type=txt"
```
```
# Find React library IDcurl -s "https://context7.com/api/v2/libs/search?libraryName=react&query=hooks" | jq '.results[0].id'# Returns: "/websites/react_dev_reference"# Fetch useState documentationcurl -s "https://context7.com/api/v2/context?libraryId=/websites/react_dev_reference&query=useState&type=txt"
```
```
# Find Next.js library IDcurl -s "https://context7.com/api/v2/libs/search?libraryName=nextjs&query=routing" | jq '.results[0].id'# Fetch app router documentationcurl -s "https://context7.com/api/v2/context?libraryId=/vercel/next.js&query=app+router&type=txt"
```
```
# Find Next.js library IDcurl -s "https://context7.com/api/v2/libs/search?libraryName=nextjs&query=routing" | jq '.results[0].id'# Fetch app router documentationcurl -s "https://context7.com/api/v2/context?libraryId=/vercel/next.js&query=app+router&type=txt"
```
```
# Find FastAPI library IDcurl -s "https://context7.com/api/v2/libs/search?libraryName=fastapi&query=dependencies" | jq '.results[0].id'# Fetch dependency injection documentationcurl -s "https://context7.com/api/v2/context?libraryId=/fastapi/fastapi&query=dependency+injection&type=txt"
```
```
# Find FastAPI library IDcurl -s "https://context7.com/api/v2/libs/search?libraryName=fastapi&query=dependencies" | jq '.results[0].id'# Fetch dependency injection documentationcurl -s "https://context7.com/api/v2/context?libraryId=/fastapi/fastapi&query=dependency+injection&type=txt"
```
```
type=txt
```
```
jq
```
```
query
```
```
+
```
```
%20
```
In the rapidly evolving world of software development, relying on potentially stale training data for library documentation can lead to significant issues. The Context7 Agent Skill provides a crucial solution, empowering AI coding assistants to fetch the absolute latest documentation for any software library, framework, or component directly from the Context7 API. This ensures developers always have access to the most current APIs, usage guidelines, and code examples, drastically reducing debugging time and improving code quality. This skill transforms your assistant into a real-time knowledge base, keeping your projects aligned with contemporary best practices and preventing compatibility headaches.

# When to Use This Skill
- •When a developer needs to look up the latest API methods and parameters for a specific software library like React or FastAPI.
- •To find relevant code examples demonstrating the correct usage of a library function or a framework feature.
- •When troubleshooting an error related to library usage and needing to verify current function signatures or data structures.
- •To obtain up-to-date information on an API that may have undergone changes or deprecations since the AI model's last training cut-off.

# Pro Tips
- 💡For precise results, use both `libraryName` and a descriptive `query` in Step 1 to identify the most relevant library ID.
- 💡Always include a focused `query` parameter in Step 2 (Fetch Documentation) to narrow down the retrieved information to exactly what you need.
- 💡Consider piping the output of the Context7 documentation retrieval into another AI skill for summarization or reformatting to quickly digest complex information.

