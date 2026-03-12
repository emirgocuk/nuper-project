# gemini
Source: https://antigravity.codes/agent-skills/ai-tools/gemini

## AI Worker Instructions
When the user requests functionality related to gemini, follow these guidelines and utilize this context.

## Scraped Content

# gemini
```
--approval-mode default
```
```
--approval-mode yolo
```
```
timeout 300 gemini ...
```
```
--approval-mode default
```
```
# Check if hungps aux | grep gemini | grep -v grep# Kill if necessarypkill -9 -f "gemini.*gemini-3-pro-preview"
```
```
# Check if hungps aux | grep gemini | grep -v grep# Kill if necessarypkill -9 -f "gemini.*gemini-3-pro-preview"
```
```
AskUserQuestion
```
```
gemini-3-pro-preview
```
```
gemini-3-flash
```
```
gemini-2.5-pro
```
```
gemini-2.5-flash
```
```
gemini-2.5-flash-lite
```
```
default
```
```
auto_edit
```
```
yolo
```
```
-m, --model <MODEL>
```
```
--approval-mode <default|auto_edit|yolo>
```
```
-y, --yolo
```
```
--approval-mode yolo
```
```
-i, --prompt-interactive "prompt"
```
```
--include-directories <DIR>
```
```
-s, --sandbox
```
```
--approval-mode yolo
```
```
default
```
```
# Recommended: Use yolo for background tasks   gemini -m gemini-3-pro-preview --approval-mode yolo "Review this codebase for security issues"   # Or with timeout (5 min limit)   timeout 300 gemini -m gemini-3-pro-preview --approval-mode yolo "Review this codebase"
```
```
# Recommended: Use yolo for background tasks   gemini -m gemini-3-pro-preview --approval-mode yolo "Review this codebase for security issues"   # Or with timeout (5 min limit)   timeout 300 gemini -m gemini-3-pro-preview --approval-mode yolo "Review this codebase"
```
```
gemini -m gemini-3-pro-preview -i "Review the authentication system" --approval-mode auto_edit
```
```
gemini -m gemini-3-pro-preview -i "Review the authentication system" --approval-mode auto_edit
```
```
yolo
```
```
-m gemini-3-pro-preview --approval-mode yolo
```
```
yolo
```
```
-m gemini-3-pro-preview --approval-mode yolo
```
```
yolo
```
```
timeout 300 gemini -m gemini-3-pro-preview --approval-mode yolo
```
```
default
```
```
-m gemini-3-pro-preview --approval-mode default
```
```
auto_edit
```
```
-m gemini-3-pro-preview --approval-mode auto_edit
```
```
yolo
```
```
-m gemini-3-pro-preview --approval-mode yolo
```
```
yolo
```
```
-m gemini-3-flash --approval-mode yolo
```
```
yolo
```
```
-m gemini-2.5-flash --approval-mode yolo
```
```
yolo
```
```
--include-directories <DIR1> --include-directories <DIR2>
```
```
auto_edit
```
```
default
```
```
-i "prompt" --approval-mode <mode>
```
```
gemini-3-pro-preview
```
```
gemini-3-flash
```
```
gemini-2.5-pro
```
```
gemini-2.5-flash
```
```
gemini-2.5-flash-lite
```
```
gemini-3-deep-think
```
```
# For background execution (Claude Code, CI/CD, etc.)gemini -m gemini-3-pro-preview --approval-mode yolo \  "Perform a comprehensive code review focusing on:   1. Security vulnerabilities   2. Performance issues   3. Code quality and maintainability   4. Best practices violations"# With timeout safety (5 minutes)timeout 300 gemini -m gemini-3-pro-preview --approval-mode yolo \  "Perform a comprehensive code review..."
```
```
# For background execution (Claude Code, CI/CD, etc.)gemini -m gemini-3-pro-preview --approval-mode yolo \  "Perform a comprehensive code review focusing on:   1. Security vulnerabilities   2. Performance issues   3. Code quality and maintainability   4. Best practices violations"# With timeout safety (5 minutes)timeout 300 gemini -m gemini-3-pro-preview --approval-mode yolo \  "Perform a comprehensive code review..."
```
```
# For background executiongemini -m gemini-3-pro-preview --approval-mode yolo \  "Review this architectural plan for:   1. Scalability concerns   2. Missing components   3. Integration challenges   4. Alternative approaches"
```
```
# For background executiongemini -m gemini-3-pro-preview --approval-mode yolo \  "Review this architectural plan for:   1. Scalability concerns   2. Missing components   3. Integration challenges   4. Alternative approaches"
```
```
# For background executiongemini -m gemini-3-pro-preview --approval-mode yolo \  "Analyze the entire codebase to understand:   1. Overall architecture   2. Key patterns and conventions   3. Potential technical debt   4. Refactoring opportunities"
```
```
# For background executiongemini -m gemini-3-pro-preview --approval-mode yolo \  "Analyze the entire codebase to understand:   1. Overall architecture   2. Key patterns and conventions   3. Potential technical debt   4. Refactoring opportunities"
```
```
# ONLY use default mode in interactive terminalgemini -m gemini-3-pro-preview --approval-mode default \  "Review the authentication flow for security issues"
```
```
# ONLY use default mode in interactive terminalgemini -m gemini-3-pro-preview --approval-mode default \  "Review the authentication flow for security issues"
```
```
AskUserQuestion
```
```
gemini --version
```
```
--approval-mode yolo
```
```
-y
```
```
--sandbox
```
```
AskUserQuestion
```
```
AskUserQuestion
```
```
# Check for hung processesps aux | grep -E "gemini.*gemini-3" | grep -v grep# Look for these symptoms:# - Process running 20+ minutes# - CPU usage at 0%# - Process state 'S' (sleeping)# - No network connections
```
```
# Check for hung processesps aux | grep -E "gemini.*gemini-3" | grep -v grep# Look for these symptoms:# - Process running 20+ minutes# - CPU usage at 0%# - Process state 'S' (sleeping)# - No network connections
```
```
# Get detailed process infops -o pid,etime,pcpu,stat,command -p <PID># Check network activitylsof -p <PID> 2>/dev/null | grep -E "(TCP|ESTABLISHED)" | wc -l# If result is 0, process is hung
```
```
# Get detailed process infops -o pid,etime,pcpu,stat,command -p <PID># Check network activitylsof -p <PID> 2>/dev/null | grep -E "(TCP|ESTABLISHED)" | wc -l# If result is 0, process is hung
```
```
# Kill hung Gemini processespkill -9 -f "gemini.*gemini-3-pro-preview"# Or kill specific PIDkill -9 <PID># Verify cleanupps aux | grep gemini | grep -v grep
```
```
# Kill hung Gemini processespkill -9 -f "gemini.*gemini-3-pro-preview"# Or kill specific PIDkill -9 <PID># Verify cleanupps aux | grep gemini | grep -v grep
```
```
--approval-mode yolo
```
```
timeout 300 gemini ...
```
```
--approval-mode default
```
```
ps
```
```
gemini-3-pro-preview
```
```
gemini-3-flash
```
```
gemini-2.5-flash
```
```
gemini --version
```
Unlock unparalleled analytical power with the Gemini Agent Skill, specifically engineered for demanding coding and architectural review tasks. This skill empowers your AI assistant to interface directly with the Gemini CLI, leveraging Gemini 3 Pro's advanced reasoning to process immense context windows, exceeding 200,000 tokens. Perfect for dissecting entire codebases, comprehensive technical specifications, or intricate project plans, it provides state-of-the-art insights essential for complex development workflows. Integrate this skill to elevate your AI's ability to offer precise, context-aware feedback and accelerate decision-making on large-scale projects.

# When to Use This Skill
- •Conducting a full codebase audit for security vulnerabilities or architectural inconsistencies across multiple files.
- •Analyzing a multi-document technical specification or architectural plan to identify design flaws or missing requirements.
- •Summarizing a large repository's documentation and generating new examples based on existing patterns and conventions.
- •Performing a detailed comparison of two large feature branches, highlighting changes and potential merge conflicts within a broad context.

# Pro Tips
- 💡Always use `--approval-mode yolo` for automated or non-interactive environments (like Claude Code tool calls) to prevent indefinite hangs.
- 💡For critical or long-running tasks, wrap `gemini` calls with `timeout` to ensure graceful termination if an unexpected issue arises.
- 💡Even with Gemini's large context windows, providing clear, specific prompts helps Gemini focus its analysis and deliver more precise, targeted feedback.

