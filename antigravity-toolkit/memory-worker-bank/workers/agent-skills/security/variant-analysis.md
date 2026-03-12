# variant-analysis
Source: https://antigravity.codes/agent-skills/security/variant-analysis

## AI Worker Instructions
When the user requests functionality related to variant-analysis, follow these guidelines and utilize this context.

## Scraped Content

# variant-analysis
```
rg -n "exact_vulnerable_code_here"
```
```
rg -n "exact_vulnerable_code_here"
```
```
...
```
```
api/handlers/
```
```
utils/auth.py
```
```
isAuthenticated
```
```
isActive
```
```
isAdmin
```
```
isVerified
```
```
null == null
```
```
userId = null
```
```
resourceOwnerId = null
```
```
resources/
```
```
resources/codeql/
```
```
python.ql
```
```
javascript.ql
```
```
java.ql
```
```
go.ql
```
```
cpp.ql
```
```
resources/semgrep/
```
```
python.yaml
```
```
javascript.yaml
```
```
java.yaml
```
```
go.yaml
```
```
cpp.yaml
```
```
resources/variant-report-template.md
```
The Variant Analysis skill empowers security researchers and developers to efficiently uncover recurring security patterns and bug variants within large codebases. After an initial finding, this specialized AI agent excels at generalizing the underlying flaw and systematically scanning for all instances that share similar characteristics. By focusing on the root cause and conditional triggers, it helps you build robust detection queries and conduct comprehensive audits, ensuring no similar vulnerability goes unnoticed. This proactive approach significantly enhances code security posture and reduces the attack surface, moving beyond individual fixes to systemic improvements.

# When to Use This Skill
- •Searching for similar vulnerability instances after an initial discovery.
- •Building and refining CodeQL or Semgrep queries for specific security patterns.
- •Performing systematic code audits to uncover all manifestations of a known issue.
- •Analyzing how a single root cause (e.g., specific unsafe function call) manifests across different code paths.

# Pro Tips
- 💡Always start by deeply understanding the root cause, not just the symptom, of the initial vulnerability before asking the agent to search for variants.
- 💡Provide specific examples of the 'bad' pattern and, if possible, 'good' safe patterns to guide the agent in distinguishing true positives.
- 💡Iteratively refine your search criteria with the agent, providing feedback on false positives or missed instances to improve its pattern recognition.

