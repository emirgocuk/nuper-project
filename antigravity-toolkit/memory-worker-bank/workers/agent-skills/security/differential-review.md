# differential-review
Source: https://antigravity.codes/agent-skills/security/differential-review

## AI Worker Instructions
When the user requests functionality related to differential-review, follow these guidelines and utilize this context.

## Scraped Content

# differential-review
```
Pre-Analysis → Phase 0: Triage → Phase 1: Code Analysis → Phase 2: Test Coverage    ↓              ↓                    ↓                        ↓Phase 3: Blast Radius → Phase 4: Deep Context → Phase 5: Adversarial → Phase 6: Report
```
```
Pre-Analysis → Phase 0: Triage → Phase 1: Code Analysis → Phase 2: Test Coverage    ↓              ↓                    ↓                        ↓Phase 3: Blast Radius → Phase 4: Deep Context → Phase 5: Adversarial → Phase 6: Report
```
```
├─ Need detailed phase-by-phase methodology?│  └─ Read: methodology.md│     (Pre-Analysis + Phases 0-4: triage, code analysis, test coverage, blast radius)│├─ Analyzing HIGH RISK change?│  └─ Read: adversarial.md│     (Phase 5: Attacker modeling, exploit scenarios, exploitability rating)│├─ Writing the final report?│  └─ Read: reporting.md│     (Phase 6: Report structure, templates, formatting guidelines)│├─ Looking for specific vulnerability patterns?│  └─ Read: patterns.md│     (Regressions, reentrancy, access control, overflow, etc.)│└─ Quick triage only?   └─ Use Quick Reference above, skip detailed docs
```
```
├─ Need detailed phase-by-phase methodology?│  └─ Read: methodology.md│     (Pre-Analysis + Phases 0-4: triage, code analysis, test coverage, blast radius)│├─ Analyzing HIGH RISK change?│  └─ Read: adversarial.md│     (Phase 5: Attacker modeling, exploit scenarios, exploitability rating)│├─ Writing the final report?│  └─ Read: reporting.md│     (Phase 6: Report structure, templates, formatting guidelines)│├─ Looking for specific vulnerability patterns?│  └─ Read: patterns.md│     (Regressions, reentrancy, access control, overflow, etc.)│└─ Quick triage only?   └─ Use Quick Reference above, skip detailed docs
```
```
issue-writer --input DIFFERENTIAL_REVIEW_REPORT.md --format audit-report
```
```
Input: 5 file PR, 2 HIGH RISK filesStrategy: Use Quick Reference1. Classify risk level per file (2 HIGH, 3 LOW)2. Focus on 2 HIGH files only3. Git blame removed code4. Generate minimal reportTime: ~30 minutes
```
```
Input: 5 file PR, 2 HIGH RISK filesStrategy: Use Quick Reference1. Classify risk level per file (2 HIGH, 3 LOW)2. Focus on 2 HIGH files only3. Git blame removed code4. Generate minimal reportTime: ~30 minutes
```
```
Input: 80 files, 12 HIGH RISK changesStrategy: FOCUSED (see methodology.md)1. Full workflow on HIGH RISK files2. Surface scan on MEDIUM3. Skip LOW risk files4. Complete report with all sectionsTime: ~3-4 hours
```
```
Input: 80 files, 12 HIGH RISK changesStrategy: FOCUSED (see methodology.md)1. Full workflow on HIGH RISK files2. Surface scan on MEDIUM3. Skip LOW risk files4. Complete report with all sectionsTime: ~3-4 hours
```
```
Input: 450 files, auth system rewriteStrategy: SURGICAL + audit-context-building1. Baseline context with audit-context-building2. Deep analysis on auth changes only3. Blast radius analysis4. Adversarial modeling5. Comprehensive reportTime: ~6-8 hours
```
```
Input: 450 files, auth system rewriteStrategy: SURGICAL + audit-context-building1. Baseline context with audit-context-building2. Deep analysis on auth changes only3. Blast radius analysis4. Adversarial modeling5. Comprehensive reportTime: ~6-8 hours
```
Elevate your software development lifecycle with the Differential Security Review Agent Skill. Designed for meticulous code analysis, this skill empowers AI agents to perform targeted security assessments on pull requests, commits, and diffs. It instills a 'risk-first' mindset, prioritizing areas like authentication, cryptography, and value transfer. By automating a rigorous, evidence-based review, development teams can proactively identify and mitigate vulnerabilities, ensuring higher code quality and reducing the attack surface. This skill acts as an indispensable virtual security expert, providing actionable insights without human oversight bias, crucial for maintaining robust and secure applications.

# When to Use This Skill
- •Automated security review of pull requests before merging.
- •Targeted analysis of specific commits or diffs for security regressions.
- •Quick security assessment of critical code sections during a refactor.
- •Pre-deployment security audit for new features or major updates.

# Pro Tips
- 💡Ensure your prompt includes comprehensive context, such as prior git history or baseline code, for the most accurate differential analysis.
- 💡Combine this skill with broader SAST tools to catch both granular diff-based issues and wider architectural vulnerabilities.
- 💡Even for seemingly minor changes, leverage this skill to identify subtle security implications, as it's designed to classify by risk, not just code size.

