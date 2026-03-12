# receiving-code-review
Source: https://antigravity.codes/agent-skills/workflow/receiving-code-review

## AI Worker Instructions
When the user requests functionality related to receiving-code-review, follow these guidelines and utilize this context.

## Scraped Content

# receiving-code-review
```
WHEN receiving code review feedback:1. READ: Complete feedback without reacting2. UNDERSTAND: Restate requirement in own words (or ask)3. VERIFY: Check against codebase reality4. EVALUATE: Technically sound for THIS codebase?5. RESPOND: Technical acknowledgment or reasoned pushback6. IMPLEMENT: One item at a time, test each
```
```
WHEN receiving code review feedback:1. READ: Complete feedback without reacting2. UNDERSTAND: Restate requirement in own words (or ask)3. VERIFY: Check against codebase reality4. EVALUATE: Technically sound for THIS codebase?5. RESPOND: Technical acknowledgment or reasoned pushback6. IMPLEMENT: One item at a time, test each
```
```
IF any item is unclear:  STOP - do not implement anything yet  ASK for clarification on unclear itemsWHY: Items may be related. Partial understanding = wrong implementation.
```
```
IF any item is unclear:  STOP - do not implement anything yet  ASK for clarification on unclear itemsWHY: Items may be related. Partial understanding = wrong implementation.
```
```
your human partner: "Fix 1-6"You understand 1,2,3,6. Unclear on 4,5.❌ WRONG: Implement 1,2,3,6 now, ask about 4,5 later✅ RIGHT: "I understand items 1,2,3,6. Need clarification on 4 and 5 before proceeding."
```
```
your human partner: "Fix 1-6"You understand 1,2,3,6. Unclear on 4,5.❌ WRONG: Implement 1,2,3,6 now, ask about 4,5 later✅ RIGHT: "I understand items 1,2,3,6. Need clarification on 4 and 5 before proceeding."
```
```
BEFORE implementing:  1. Check: Technically correct for THIS codebase?  2. Check: Breaks existing functionality?  3. Check: Reason for current implementation?  4. Check: Works on all platforms/versions?  5. Check: Does reviewer understand full context?IF suggestion seems wrong:  Push back with technical reasoningIF can't easily verify:  Say so: "I can't verify this without [X]. Should I [investigate/ask/proceed]?"IF conflicts with your human partner's prior decisions:  Stop and discuss with your human partner first
```
```
BEFORE implementing:  1. Check: Technically correct for THIS codebase?  2. Check: Breaks existing functionality?  3. Check: Reason for current implementation?  4. Check: Works on all platforms/versions?  5. Check: Does reviewer understand full context?IF suggestion seems wrong:  Push back with technical reasoningIF can't easily verify:  Say so: "I can't verify this without [X]. Should I [investigate/ask/proceed]?"IF conflicts with your human partner's prior decisions:  Stop and discuss with your human partner first
```
```
IF reviewer suggests "implementing properly":  grep codebase for actual usage  IF unused: "This endpoint isn't called. Remove it (YAGNI)?"  IF used: Then implement properly
```
```
IF reviewer suggests "implementing properly":  grep codebase for actual usage  IF unused: "This endpoint isn't called. Remove it (YAGNI)?"  IF used: Then implement properly
```
```
FOR multi-item feedback:  1. Clarify anything unclear FIRST  2. Then implement in this order:     - Blocking issues (breaks, security)     - Simple fixes (typos, imports)     - Complex fixes (refactoring, logic)  3. Test each fix individually  4. Verify no regressions
```
```
FOR multi-item feedback:  1. Clarify anything unclear FIRST  2. Then implement in this order:     - Blocking issues (breaks, security)     - Simple fixes (typos, imports)     - Complex fixes (refactoring, logic)  3. Test each fix individually  4. Verify no regressions
```
```
✅ "Fixed. [Brief description of what changed]"✅ "Good catch - [specific issue]. Fixed in [location]."✅ [Just fix it and show in the code]❌ "You're absolutely right!"❌ "Great point!"❌ "Thanks for catching that!"❌ "Thanks for [anything]"❌ ANY gratitude expression
```
```
✅ "Fixed. [Brief description of what changed]"✅ "Good catch - [specific issue]. Fixed in [location]."✅ [Just fix it and show in the code]❌ "You're absolutely right!"❌ "Great point!"❌ "Thanks for catching that!"❌ "Thanks for [anything]"❌ ANY gratitude expression
```
```
✅ "You were right - I checked [X] and it does [Y]. Implementing now."✅ "Verified this and you're correct. My initial understanding was wrong because [reason]. Fixing."❌ Long apology❌ Defending why you pushed back❌ Over-explaining
```
```
✅ "You were right - I checked [X] and it does [Y]. Implementing now."✅ "Verified this and you're correct. My initial understanding was wrong because [reason]. Fixing."❌ Long apology❌ Defending why you pushed back❌ Over-explaining
```
```
Reviewer: "Remove legacy code"❌ "You're absolutely right! Let me remove that..."
```
```
Reviewer: "Remove legacy code"❌ "You're absolutely right! Let me remove that..."
```
```
Reviewer: "Remove legacy code"✅ "Checking... build target is 10.15+, this API needs 13+. Need legacy for backward compat. Current impl has wrong bundle ID - fix it or drop pre-13 support?"
```
```
Reviewer: "Remove legacy code"✅ "Checking... build target is 10.15+, this API needs 13+. Need legacy for backward compat. Current impl has wrong bundle ID - fix it or drop pre-13 support?"
```
```
Reviewer: "Implement proper metrics tracking with database, date filters, CSV export"✅ "Grepped codebase - nothing calls this endpoint. Remove it (YAGNI)? Or is there usage I'm missing?"
```
```
Reviewer: "Implement proper metrics tracking with database, date filters, CSV export"✅ "Grepped codebase - nothing calls this endpoint. Remove it (YAGNI)? Or is there usage I'm missing?"
```
```
your human partner: "Fix items 1-6"You understand 1,2,3,6. Unclear on 4,5.✅ "Understand 1,2,3,6. Need clarification on 4 and 5 before implementing."
```
```
your human partner: "Fix items 1-6"You understand 1,2,3,6. Unclear on 4,5.✅ "Understand 1,2,3,6. Need clarification on 4 and 5 before implementing."
```
```
gh api repos/{owner}/{repo}/pulls/{pr}/comments/{id}/replies
```
Navigating code review feedback is a critical skill for any AI coding assistant. This superpower equips agents with a systematic, technically rigorous approach to processing suggestions, ensuring every proposed change is evaluated against the codebase reality before implementation. It emphasizes clear understanding, objective verification, and the ability to engage in reasoned technical dialogue, rather than merely agreeing. By adopting this pattern, AI agents can significantly elevate the quality and reliability of their code contributions, fostering a culture of precision and technical integrity in collaborative development environments.

# When to Use This Skill
- •When a human developer provides feedback on your pull request or code changes.
- •When feedback received is vague, ambiguous, or lacks sufficient technical detail.
- •When a code review suggestion appears technically questionable or may introduce new issues.
- •When needing to systematically process and prioritize multiple feedback items on a complex change.

# Pro Tips
- 💡Always restate the reviewer's suggestion in your own words to confirm understanding before proceeding.
- 💡Don't hesitate to ask clarifying questions; incomplete information leads to incorrect implementations.
- 💡When pushing back, always provide concrete technical reasoning or link to relevant code sections/documentation.
- 💡Implement and test each verified suggestion individually to isolate potential regressions.

