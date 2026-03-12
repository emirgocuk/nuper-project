# verification-before-completion
Source: https://antigravity.codes/agent-skills/workflow/verification-before-completion

## AI Worker Instructions
When the user requests functionality related to verification-before-completion, follow these guidelines and utilize this context.

## Scraped Content

# verification-before-completion
```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```
```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```
```
BEFORE claiming any status or expressing satisfaction:1. IDENTIFY: What command proves this claim?2. RUN: Execute the FULL command (fresh, complete)3. READ: Full output, check exit code, count failures4. VERIFY: Does output confirm the claim?   - If NO: State actual status with evidence   - If YES: State claim WITH evidence5. ONLY THEN: Make the claimSkip any step = lying, not verifying
```
```
BEFORE claiming any status or expressing satisfaction:1. IDENTIFY: What command proves this claim?2. RUN: Execute the FULL command (fresh, complete)3. READ: Full output, check exit code, count failures4. VERIFY: Does output confirm the claim?   - If NO: State actual status with evidence   - If YES: State claim WITH evidence5. ONLY THEN: Make the claimSkip any step = lying, not verifying
```
```
✅ [Run test command] [See: 34/34 pass] "All tests pass"❌ "Should pass now" / "Looks correct"
```
```
✅ [Run test command] [See: 34/34 pass] "All tests pass"❌ "Should pass now" / "Looks correct"
```
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)❌ "I've written a regression test" (without red-green verification)
```
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)❌ "I've written a regression test" (without red-green verification)
```
```
✅ [Run build] [See: exit 0] "Build passes"❌ "Linter passed" (linter doesn't check compilation)
```
```
✅ [Run build] [See: exit 0] "Build passes"❌ "Linter passed" (linter doesn't check compilation)
```
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion❌ "Tests pass, phase complete"
```
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion❌ "Tests pass, phase complete"
```
```
✅ Agent reports success → Check VCS diff → Verify changes → Report actual state❌ Trust agent report
```
```
✅ Agent reports success → Check VCS diff → Verify changes → Report actual state❌ Trust agent report
```
In the fast-paced world of software development, trust and accuracy are paramount. This AI Agent Skill empowers your coding assistant to act as a diligent guardian, instilling a culture of evidence-based assertions. It ensures that every 'complete' or 'fixed' claim is backed by fresh, undeniable verification, significantly reducing technical debt and fostering a higher standard of code integrity. By integrating this discipline, teams can avoid costly rework and build a more reliable, robust codebase from the outset, enhancing overall project efficiency and developer confidence.

# When to Use This Skill
- •Before declaring a bug fix complete, ensuring all relevant tests pass and produce clean output.
- •When preparing a pull request for a new feature, confirming all linting, build, and unit tests are clean and verified.
- •As a final check after an AI agent has made significant code changes, to confirm all verification steps are green and explicitly stated.
- •In CI/CD pipelines, to provide an explicit, automated step that halts progress if verification commands fail, requiring human oversight or AI re-evaluation.

# Pro Tips
- 💡Integrate specific verification commands into your project's pre-commit hooks to catch issues before they even reach version control.
- 💡Standardize verification commands in your project's `package.json` scripts or `Makefile` for easy, consistent execution across team members and agents.
- 💡Encourage your AI agent to not just run, but also interpret and summarize the output of verification commands, specifically highlighting failures or warnings rather than just stating pass/fail.

