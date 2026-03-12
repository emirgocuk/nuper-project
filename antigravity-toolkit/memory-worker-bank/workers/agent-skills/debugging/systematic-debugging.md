# systematic-debugging
Source: https://antigravity.codes/agent-skills/debugging/systematic-debugging

## AI Worker Instructions
When the user requests functionality related to systematic-debugging, follow these guidelines and utilize this context.

## Scraped Content

# systematic-debugging
```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```
```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```
```
For EACH component boundary:     - Log what data enters component     - Log what data exits component     - Verify environment/config propagation     - Check state at each layer   Run once to gather evidence showing WHERE it breaks   THEN analyze evidence to identify failing component   THEN investigate that specific component
```
```
For EACH component boundary:     - Log what data enters component     - Log what data exits component     - Verify environment/config propagation     - Check state at each layer   Run once to gather evidence showing WHERE it breaks   THEN analyze evidence to identify failing component   THEN investigate that specific component
```
```
# Layer 1: Workflow   echo "=== Secrets available in workflow: ==="   echo "IDENTITY: ${IDENTITY:+SET}${IDENTITY:-UNSET}"   # Layer 2: Build script   echo "=== Env vars in build script: ==="   env | grep IDENTITY || echo "IDENTITY not in environment"   # Layer 3: Signing script   echo "=== Keychain state: ==="   security list-keychains   security find-identity -v   # Layer 4: Actual signing   codesign --sign "$IDENTITY" --verbose=4 "$APP"
```
```
# Layer 1: Workflow   echo "=== Secrets available in workflow: ==="   echo "IDENTITY: ${IDENTITY:+SET}${IDENTITY:-UNSET}"   # Layer 2: Build script   echo "=== Env vars in build script: ==="   env | grep IDENTITY || echo "IDENTITY not in environment"   # Layer 3: Signing script   echo "=== Keychain state: ==="   security list-keychains   security find-identity -v   # Layer 4: Actual signing   codesign --sign "$IDENTITY" --verbose=4 "$APP"
```
```
root-cause-tracing.md
```
```
superpowers:test-driven-development
```
```
root-cause-tracing.md
```
```
defense-in-depth.md
```
```
condition-based-waiting.md
```
In the complex world of software development, encountering bugs, test failures, or unexpected behavior is inevitable. The 'Systematic Debugging' skill equips AI agents and developers with a disciplined, phase-based approach to problem-solving. Instead of resorting to quick, often ineffective, 'trial and error' fixes, this methodology emphasizes uncovering the fundamental root cause of an issue. By strictly following investigative steps before proposing any solutions, you dramatically reduce rework, prevent the introduction of new bugs, and ultimately deliver more stable, reliable code. Embrace this skill to transform chaotic debugging sessions into structured, efficient resolutions.

# When to Use This Skill
- •Analyzing a CI/CD pipeline failure due to an obscure dependency issue.
- •Investigating intermittent production bugs reported by users that are hard to reproduce.
- •Debugging a unit or integration test that unexpectedly starts failing after a code merge.
- •Troubleshooting performance bottlenecks in an application, even without clear error messages.

# Pro Tips
- 💡Always verify your assumptions: The most obvious 'fix' is often a distraction from the true root cause. Use logging and breakpoint debugging extensively.
- 💡Isolate the problem: Systematically narrow down the scope by eliminating variables or components until the issue's origin becomes clear.
- 💡Document your investigation: Keep a log of what you tried, what you observed, and your hypotheses. This prevents repetition and helps if you need to hand off the issue.

