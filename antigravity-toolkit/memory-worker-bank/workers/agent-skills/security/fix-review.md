# fix-review
Source: https://antigravity.codes/agent-skills/security/fix-review

## AI Worker Instructions
When the user requests functionality related to fix-review, follow these guidelines and utilize this context.

## Scraped Content

# fix-review
```
Source commit:  [hash/ref before fixes]Target commit:  [hash/ref to analyze]Report:         [optional: path, URL, or "none"]
```
```
Source commit:  [hash/ref before fixes]Target commit:  [hash/ref to analyze]Report:         [optional: path, URL, or "none"]
```
```
references/report-parsing.md
```
```
gdrive
```
```
TOB-[A-Z]+-[0-9]+
```
```
findings
```
```
references/report-parsing.md
```
```
# Get commit list from source to targetgit log <source>..<target> --oneline# Get full diffgit diff <source>..<target># Get changed filesgit diff <source>..<target> --name-only
```
```
# Get commit list from source to targetgit log <source>..<target> --oneline# Get full diffgit diff <source>..<target># Get changed filesgit diff <source>..<target> --name-only
```
```
references/bug-detection.md
```
```
references/finding-matching.md
```
```
FIX_REVIEW_REPORT.md
```
```
# Fix Review Report**Source:** <commit>**Target:** <commit>**Report:** <path or "none">**Date:** <date>## Executive Summary[Brief overview: X findings reviewed, Y fixed, Z concerns]## Finding Status| ID | Title | Severity | Status | Evidence ||----|-------|----------|--------|----------|| TOB-XXX-1 | Finding title | High | FIXED | abc123 || TOB-XXX-2 | Another finding | Medium | NOT_ADDRESSED | - |## Bug Introduction Concerns[Any potential bugs or regressions detected in the changes]## Per-Commit Analysis### Commit abc123: "Fix reentrancy in withdraw()"**Files changed:** contracts/Vault.sol**Findings addressed:** TOB-XXX-1**Concerns:** None[Detailed analysis]## Recommendations[Any follow-up actions needed]
```
```
# Fix Review Report**Source:** <commit>**Target:** <commit>**Report:** <path or "none">**Date:** <date>## Executive Summary[Brief overview: X findings reviewed, Y fixed, Z concerns]## Finding Status| ID | Title | Severity | Status | Evidence ||----|-------|----------|--------|----------|| TOB-XXX-1 | Finding title | High | FIXED | abc123 || TOB-XXX-2 | Another finding | Medium | NOT_ADDRESSED | - |## Bug Introduction Concerns[Any potential bugs or regressions detected in the changes]## Per-Commit Analysis### Commit abc123: "Fix reentrancy in withdraw()"**Files changed:** contracts/Vault.sol**Findings addressed:** TOB-XXX-1**Concerns:** None[Detailed analysis]## Recommendations[Any follow-up actions needed]
```
```
references/bug-detection.md
```
```
references/finding-matching.md
```
```
references/bug-detection.md
```
```
references/report-parsing.md
```
This AI Agent Skill is engineered to provide a crucial layer of scrutiny for code changes following a security audit. It goes beyond mere commit messages, delving deep into the actual code to verify that reported findings are genuinely addressed and no new regressions are introduced. Ideal for development teams committed to robust security postures, this skill helps bridge the gap between identifying vulnerabilities and confidently deploying their fixes. By focusing on differential analysis, it ensures every remediation commit meets the highest standards of security and quality.

# When to Use This Skill
- •Validating a developer's fix branch against a detailed security audit report.
- •Confirming that a specific vulnerability (e.g., TOB-XXX) has been correctly mitigated in the codebase.
- •Analyzing a range of commits to proactively identify potential new bugs introduced during a fix cycle.
- •Cross-referencing implemented code changes with the precise recommendations from a security assessment.

# Pro Tips
- 💡Automate Baseline Comparisons: Always run this skill with a clear, audited baseline to ensure differential analysis is accurate and catches subtle regressions.
- 💡Integrate into CI/CD: Incorporate 'fix-review' into your continuous integration pipeline to automatically flag insufficient fixes or new vulnerabilities before merging.
- 💡Combine with 'audit-context-building': For complex audits, first use 'audit-context-building' to establish a comprehensive understanding, then apply 'fix-review' for targeted remediation validation.

