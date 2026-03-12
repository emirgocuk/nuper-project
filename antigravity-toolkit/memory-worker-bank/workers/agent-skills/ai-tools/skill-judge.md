# skill-judge
Source: https://antigravity.codes/agent-skills/ai-tools/skill-judge

## AI Worker Instructions
When the user requests functionality related to skill-judge, follow these guidelines and utilize this context.

## Scraped Content

# skill-judge
```
Traditional: Collect data → GPU cluster → Train → Deploy new versionCost: $10,000 - $1,000,000+Timeline: Weeks to months
```
```
Traditional: Collect data → GPU cluster → Train → Deploy new versionCost: $10,000 - $1,000,000+Timeline: Weeks to months
```
```
Skill: Edit SKILL.md → Save → Takes effect on next invocationCost: $0Timeline: Instant
```
```
Skill: Edit SKILL.md → Save → Takes effect on next invocationCost: $0Timeline: Instant
```
```
General Agent + Excellent Skill = Domain Expert Agent
```
```
General Agent + Excellent Skill = Domain Expert Agent
```
```
Before [action], ask yourself:- **Purpose**: What problem does this solve? Who uses it?- **Constraints**: What are the hidden requirements?- **Differentiation**: What makes this solution memorable?
```
```
Before [action], ask yourself:- **Purpose**: What problem does this solve? Who uses it?- **Constraints**: What are the hidden requirements?- **Differentiation**: What makes this solution memorable?
```
```
### Redlining Workflow (Claude wouldn't know this sequence)1. Convert to markdown: pandoc --track-changes=all2. Map text to XML: grep for text in document.xml3. Implement changes in batches of 3-104. Pack and verify: check ALL changes were applied
```
```
### Redlining Workflow (Claude wouldn't know this sequence)1. Convert to markdown: pandoc --track-changes=all2. Map text to XML: grep for text in document.xml3. Implement changes in batches of 3-104. Pack and verify: check ALL changes were applied
```
```
pandoc --track-changes=all
```
```
Step 1: Open the fileStep 2: Find the sectionStep 3: Make the changeStep 4: Save and test
```
```
Step 1: Open the fileStep 2: Find the sectionStep 3: Make the changeStep 4: Save and test
```
```
NEVER use generic AI-generated aesthetics like:- Overused font families (Inter, Roboto, Arial)- Cliched color schemes (particularly purple gradients on white backgrounds)- Predictable layouts and component patterns- Default border-radius on everything
```
```
NEVER use generic AI-generated aesthetics like:- Overused font families (Inter, Roboto, Arial)- Cliched color schemes (particularly purple gradients on white backgrounds)- Predictable layouts and component patterns- Default border-radius on everything
```
```
Avoid making mistakes.Be careful with edge cases.Don't write bad code.
```
```
Avoid making mistakes.Be careful with edge cases.Don't write bad code.
```
```
name
```
```
description
```
```
┌─────────────────────────────────────────────────────────────────────┐│  SKILL ACTIVATION FLOW                                              ││                                                                     ││  User Request → Agent sees ALL skill descriptions → Decides which  ││                 (only descriptions, not bodies!)     to activate    ││                                                                     ││  If description doesn't match → Skill NEVER gets loaded            ││  If description is vague → Skill might not trigger when it should  ││  If description lacks keywords → Skill is invisible to the Agent   │└─────────────────────────────────────────────────────────────────────┘
```
```
┌─────────────────────────────────────────────────────────────────────┐│  SKILL ACTIVATION FLOW                                              ││                                                                     ││  User Request → Agent sees ALL skill descriptions → Decides which  ││                 (only descriptions, not bodies!)     to activate    ││                                                                     ││  If description doesn't match → Skill NEVER gets loaded            ││  If description is vague → Skill might not trigger when it should  ││  If description lacks keywords → Skill is invisible to the Agent   │└─────────────────────────────────────────────────────────────────────┘
```
```
description: "Comprehensive document creation, editing, and analysis with supportfor tracked changes, comments, formatting preservation, and text extraction.When Claude needs to work with professional documents (.docx files) for:(1) Creating new documents, (2) Modifying or editing content,(3) Working with tracked changes, (4) Adding comments, or any other document tasks"
```
```
description: "Comprehensive document creation, editing, and analysis with supportfor tracked changes, comments, formatting preservation, and text extraction.When Claude needs to work with professional documents (.docx files) for:(1) Creating new documents, (2) Modifying or editing content,(3) Working with tracked changes, (4) Adding comments, or any other document tasks"
```
```
description: "处理文档相关功能"
```
```
description: "处理文档相关功能"
```
```
description: "A helpful skill for various tasks"
```
```
description: "A helpful skill for various tasks"
```
```
Layer 1: Metadata (always in memory)         Only name + description         ~100 tokens per skillLayer 2: SKILL.md Body (loaded after triggering)         Detailed guidelines, code examples, decision trees         Ideal: < 500 linesLayer 3: Resources (loaded on demand)         scripts/, references/, assets/         No limit
```
```
Layer 1: Metadata (always in memory)         Only name + description         ~100 tokens per skillLayer 2: SKILL.md Body (loaded after triggering)         Detailed guidelines, code examples, decision trees         Ideal: < 500 linesLayer 3: Resources (loaded on demand)         scripts/, references/, assets/         No limit
```
```
Loading too little ◄─────────────────────────────────► Loading too much- References sit unused                    - Wastes context space- Agent doesn't know when to load          - Irrelevant info dilutes key content- Knowledge is there but never accessed    - Unnecessary token overhead
```
```
Loading too little ◄─────────────────────────────────► Loading too much- References sit unused                    - Wastes context space- Agent doesn't know when to load          - Irrelevant info dilutes key content- Knowledge is there but never accessed    - Unnecessary token overhead
```
```
### Creating New Document**MANDATORY - READ ENTIRE FILE**: Before proceeding, you MUST read[docx-js.md](docx-js.md) (~500 lines) completely from start to finish.**NEVER set any range limits when reading this file.****Do NOT load** ooxml.md or redlining.md for this task.
```
```
### Creating New Document**MANDATORY - READ ENTIRE FILE**: Before proceeding, you MUST read[docx-js.md](docx-js.md) (~500 lines) completely from start to finish.**NEVER set any range limits when reading this file.****Do NOT load** ooxml.md or redlining.md for this task.
```
```
docx-js.md
```
```
ooxml.md
```
```
redlining.md
```
```
## References- docx-js.md - for creating documents- ooxml.md - for editing- redlining.md - for tracking changes
```
```
## References- docx-js.md - for creating documents- ooxml.md - for editing- redlining.md - for tracking changes
```
```
Commit to a BOLD aesthetic direction. Pick an extreme: brutally minimal,maximalist chaos, retro-futuristic, organic natural...
```
```
Commit to a BOLD aesthetic direction. Pick an extreme: brutally minimal,maximalist chaos, retro-futuristic, organic natural...
```
```
Review priority:1. Security vulnerabilities (must fix)2. Logic errors (must fix)3. Performance issues (should fix)4. Maintainability (optional)
```
```
Review priority:1. Security vulnerabilities (must fix)2. Logic errors (must fix)3. Performance issues (should fix)4. Maintainability (optional)
```
```
**MANDATORY**: Use exact script in scripts/create-doc.pyParameters: --title "X" --author "Y"Do NOT modify the script.
```
```
**MANDATORY**: Use exact script in scripts/create-doc.pyParameters: --title "X" --author "Y"Do NOT modify the script.
```
```
scripts/create-doc.py
```
```
| Task | Primary Tool | Fallback | When to Use Fallback ||------|-------------|----------|----------------------|| Read text | pdftotext | PyMuPDF | Need layout info || Extract tables | camelot-py | tabula-py | camelot fails |**Common issues**:- Scanned PDF: pdftotext returns blank → Use OCR first- Encrypted PDF: Permission error → Use PyMuPDF with password
```
```
| Task | Primary Tool | Fallback | When to Use Fallback ||------|-------------|----------|----------------------|| Read text | pdftotext | PyMuPDF | Need layout info || Extract tables | camelot-py | tabula-py | camelot fails |**Common issues**:- Scanned PDF: pdftotext returns blank → Use OCR first- Encrypted PDF: Permission error → Use PyMuPDF with password
```
```
Use appropriate tools for PDF processing.Handle errors properly.Consider edge cases.
```
```
Use appropriate tools for PDF processing.Handle errors properly.Consider edge cases.
```
```
[ ] Check frontmatter validity[ ] Count total lines in SKILL.md[ ] List all reference files and their sizes[ ] Identify which pattern the Skill follows[ ] Check for loading triggers (if references exist)
```
```
[ ] Check frontmatter validity[ ] Count total lines in SKILL.md[ ] List all reference files and their sizes[ ] Identify which pattern the Skill follows[ ] Check for loading triggers (if references exist)
```
```
Total = D1 + D2 + D3 + D4 + D5 + D6 + D7 + D8Max = 120 points
```
```
Total = D1 + D2 + D3 + D4 + D5 + D6 + D7 + D8Max = 120 points
```
```
# Skill Evaluation Report: [Skill Name]## Summary- **Total Score**: X/120 (X%)- **Grade**: [A/B/C/D/F]- **Pattern**: [Mindset/Navigation/Philosophy/Process/Tool]- **Knowledge Ratio**: E:A:R = X:Y:Z- **Verdict**: [One sentence assessment]## Dimension Scores| Dimension | Score | Max | Notes ||-----------|-------|-----|-------|| D1: Knowledge Delta | X | 20 | || D2: Mindset vs Mechanics | X | 15 | || D3: Anti-Pattern Quality | X | 15 | || D4: Specification Compliance | X | 15 | || D5: Progressive Disclosure | X | 15 | || D6: Freedom Calibration | X | 15 | || D7: Pattern Recognition | X | 10 | || D8: Practical Usability | X | 15 | |## Critical Issues[List must-fix problems that significantly impact the Skill's effectiveness]## Top 3 Improvements1. [Highest impact improvement with specific guidance]2. [Second priority improvement]3. [Third priority improvement]## Detailed Analysis[For each dimension scoring below 80%, provide:- What's missing or problematic- Specific examples from the Skill- Concrete suggestions for improvement]
```
```
# Skill Evaluation Report: [Skill Name]## Summary- **Total Score**: X/120 (X%)- **Grade**: [A/B/C/D/F]- **Pattern**: [Mindset/Navigation/Philosophy/Process/Tool]- **Knowledge Ratio**: E:A:R = X:Y:Z- **Verdict**: [One sentence assessment]## Dimension Scores| Dimension | Score | Max | Notes ||-----------|-------|-----|-------|| D1: Knowledge Delta | X | 20 | || D2: Mindset vs Mechanics | X | 15 | || D3: Anti-Pattern Quality | X | 15 | || D4: Specification Compliance | X | 15 | || D5: Progressive Disclosure | X | 15 | || D6: Freedom Calibration | X | 15 | || D7: Pattern Recognition | X | 10 | || D8: Practical Usability | X | 15 | |## Critical Issues[List must-fix problems that significantly impact the Skill's effectiveness]## Top 3 Improvements1. [Highest impact improvement with specific guidance]2. [Second priority improvement]3. [Third priority improvement]## Detailed Analysis[For each dimension scoring below 80%, provide:- What's missing or problematic- Specific examples from the Skill- Concrete suggestions for improvement]
```
```
Symptom: Explains what PDF is, how Python works, basic library usageRoot cause: Author assumes Skill should "teach" the modelFix: Claude already knows this. Delete all basic explanations.     Focus on expert decisions, trade-offs, and anti-patterns.
```
```
Symptom: Explains what PDF is, how Python works, basic library usageRoot cause: Author assumes Skill should "teach" the modelFix: Claude already knows this. Delete all basic explanations.     Focus on expert decisions, trade-offs, and anti-patterns.
```
```
Symptom: SKILL.md is 800+ lines with everything includedRoot cause: No progressive disclosure designFix: Core routing and decision trees in SKILL.md (<300 lines ideal)     Detailed content in references/, loaded on-demand
```
```
Symptom: SKILL.md is 800+ lines with everything includedRoot cause: No progressive disclosure designFix: Core routing and decision trees in SKILL.md (<300 lines ideal)     Detailed content in references/, loaded on-demand
```
```
Symptom: References directory exists but files are never loadedRoot cause: No explicit loading triggersFix: Add "MANDATORY - READ ENTIRE FILE" at workflow decision points     Add "Do NOT Load" to prevent over-loading
```
```
Symptom: References directory exists but files are never loadedRoot cause: No explicit loading triggersFix: Add "MANDATORY - READ ENTIRE FILE" at workflow decision points     Add "Do NOT Load" to prevent over-loading
```
```
Symptom: Step 1, Step 2, Step 3... mechanical proceduresRoot cause: Author thinks in procedures, not thinking frameworksFix: Transform into "Before doing X, ask yourself..."     Focus on decision principles, not operation sequences
```
```
Symptom: Step 1, Step 2, Step 3... mechanical proceduresRoot cause: Author thinks in procedures, not thinking frameworksFix: Transform into "Before doing X, ask yourself..."     Focus on decision principles, not operation sequences
```
```
Symptom: "Be careful", "avoid errors", "consider edge cases"Root cause: Author knows things can go wrong but hasn't articulated specificsFix: Specific NEVER list with concrete examples and non-obvious reasons     "NEVER use X because [specific problem that takes experience to learn]"
```
```
Symptom: "Be careful", "avoid errors", "consider edge cases"Root cause: Author knows things can go wrong but hasn't articulated specificsFix: Specific NEVER list with concrete examples and non-obvious reasons     "NEVER use X because [specific problem that takes experience to learn]"
```
```
Symptom: Great content but skill rarely gets activatedRoot cause: Description is vague, missing keywords, or lacks trigger scenariosFix: Description must answer WHAT, WHEN, and include KEYWORDS     "Use when..." + specific scenarios + searchable termsExample fix:BAD:  "Helps with document tasks"GOOD: "Create, edit, and analyze .docx files. Use when working with       Word documents, tracked changes, or professional document formatting."
```
```
Symptom: Great content but skill rarely gets activatedRoot cause: Description is vague, missing keywords, or lacks trigger scenariosFix: Description must answer WHAT, WHEN, and include KEYWORDS     "Use when..." + specific scenarios + searchable termsExample fix:BAD:  "Helps with document tasks"GOOD: "Create, edit, and analyze .docx files. Use when working with       Word documents, tracked changes, or professional document formatting."
```
```
Symptom: "When to use this Skill" section in body, not in descriptionRoot cause: Misunderstanding of three-layer loadingFix: Move all triggering information to description field     Body is only loaded AFTER triggering decision is made
```
```
Symptom: "When to use this Skill" section in body, not in descriptionRoot cause: Misunderstanding of three-layer loadingFix: Move all triggering information to description field     Body is only loaded AFTER triggering decision is made
```
```
Symptom: README.md, CHANGELOG.md, INSTALLATION_GUIDE.md, CONTRIBUTING.mdRoot cause: Treating Skill like a software projectFix: Delete all auxiliary files. Only include what Agent needs for the task.     No documentation about the Skill itself.
```
```
Symptom: README.md, CHANGELOG.md, INSTALLATION_GUIDE.md, CONTRIBUTING.mdRoot cause: Treating Skill like a software projectFix: Delete all auxiliary files. Only include what Agent needs for the task.     No documentation about the Skill itself.
```
```
Symptom: Rigid scripts for creative tasks, vague guidance for fragile operationsRoot cause: Not considering task fragilityFix: High freedom for creative (principles, not steps)     Low freedom for fragile (exact scripts, no parameters)
```
```
Symptom: Rigid scripts for creative tasks, vague guidance for fragile operationsRoot cause: Not considering task fragilityFix: High freedom for creative (principles, not steps)     Low freedom for fragile (exact scripts, no parameters)
```
```
┌─────────────────────────────────────────────────────────────────────────┐│  SKILL EVALUATION QUICK CHECK                                           │├─────────────────────────────────────────────────────────────────────────┤│                                                                         ││  KNOWLEDGE DELTA (most important):                                      ││    [ ] No "What is X" explanations for basic concepts                   ││    [ ] No step-by-step tutorials for standard operations                ││    [ ] Has decision trees for non-obvious choices                       ││    [ ] Has trade-offs only experts would know                           ││    [ ] Has edge cases from real-world experience                        ││                                                                         ││  MINDSET + PROCEDURES:                                                  ││    [ ] Transfers thinking patterns (how to think about problems)        ││    [ ] Has "Before doing X, ask yourself..." frameworks                 ││    [ ] Includes domain-specific procedures Claude wouldn't know         ││    [ ] Distinguishes valuable procedures from generic ones              ││                                                                         ││  ANTI-PATTERNS:                                                         ││    [ ] Has explicit NEVER list                                          ││    [ ] Anti-patterns are specific, not vague                            ││    [ ] Includes WHY (non-obvious reasons)                               ││                                                                         ││  SPECIFICATION (description is critical!):                              ││    [ ] Valid YAML frontmatter                                           ││    [ ] name: lowercase, ≤64 chars                                       ││    [ ] description answers: WHAT does it do?                            ││    [ ] description answers: WHEN should it be used?                     ││    [ ] description contains trigger KEYWORDS                            ││    [ ] description is specific enough for Agent to know when to use     ││                                                                         ││  STRUCTURE:                                                             ││    [ ] SKILL.md < 500 lines (ideal < 300)                               ││    [ ] Heavy content in references/                                     ││    [ ] Loading triggers embedded in workflow                            ││    [ ] Has "Do NOT Load" for preventing over-loading                    ││                                                                         ││  FREEDOM:                                                               ││    [ ] Creative tasks → High freedom (principles)                       ││    [ ] Fragile operations → Low freedom (exact scripts)                 ││                                                                         ││  USABILITY:                                                             ││    [ ] Decision trees for multi-path scenarios                          ││    [ ] Working code examples                                            ││    [ ] Error handling and fallbacks                                     ││    [ ] Edge cases covered                                               ││                                                                         │└─────────────────────────────────────────────────────────────────────────┘
```
```
┌─────────────────────────────────────────────────────────────────────────┐│  SKILL EVALUATION QUICK CHECK                                           │├─────────────────────────────────────────────────────────────────────────┤│                                                                         ││  KNOWLEDGE DELTA (most important):                                      ││    [ ] No "What is X" explanations for basic concepts                   ││    [ ] No step-by-step tutorials for standard operations                ││    [ ] Has decision trees for non-obvious choices                       ││    [ ] Has trade-offs only experts would know                           ││    [ ] Has edge cases from real-world experience                        ││                                                                         ││  MINDSET + PROCEDURES:                                                  ││    [ ] Transfers thinking patterns (how to think about problems)        ││    [ ] Has "Before doing X, ask yourself..." frameworks                 ││    [ ] Includes domain-specific procedures Claude wouldn't know         ││    [ ] Distinguishes valuable procedures from generic ones              ││                                                                         ││  ANTI-PATTERNS:                                                         ││    [ ] Has explicit NEVER list                                          ││    [ ] Anti-patterns are specific, not vague                            ││    [ ] Includes WHY (non-obvious reasons)                               ││                                                                         ││  SPECIFICATION (description is critical!):                              ││    [ ] Valid YAML frontmatter                                           ││    [ ] name: lowercase, ≤64 chars                                       ││    [ ] description answers: WHAT does it do?                            ││    [ ] description answers: WHEN should it be used?                     ││    [ ] description contains trigger KEYWORDS                            ││    [ ] description is specific enough for Agent to know when to use     ││                                                                         ││  STRUCTURE:                                                             ││    [ ] SKILL.md < 500 lines (ideal < 300)                               ││    [ ] Heavy content in references/                                     ││    [ ] Loading triggers embedded in workflow                            ││    [ ] Has "Do NOT Load" for preventing over-loading                    ││                                                                         ││  FREEDOM:                                                               ││    [ ] Creative tasks → High freedom (principles)                       ││    [ ] Fragile operations → Low freedom (exact scripts)                 ││                                                                         ││  USABILITY:                                                             ││    [ ] Decision trees for multi-path scenarios                          ││    [ ] Working code examples                                            ││    [ ] Error handling and fallbacks                                     ││    [ ] Edge cases covered                                               ││                                                                         │└─────────────────────────────────────────────────────────────────────────┘
```
This skill provides a critical lens for refining the design of your AI agents' capabilities. By analyzing your SKILL.md files against established specifications and a comprehensive set of best practices, it ensures your skills are robust, efficient, and aligned with optimal AI interaction patterns. Leverage this tool to not only identify areas for improvement but also to understand the underlying principles of effective skill creation, transforming your conceptual ideas into high-performing, deployable agent functionalities. It's an indispensable resource for developers aiming to build truly expert-level AI assistants.

# When to Use This Skill
- •Reviewing a newly designed SKILL.md before deployment to ensure quality and compliance.
- •Auditing existing agent skills for performance bottlenecks, non-compliance, or opportunities for refinement.
- •Educating new team members on the fundamental principles and best practices of agent skill design.
- •Iteratively improving an agent's capabilities by applying detailed, multi-dimensional feedback from the skill evaluation.

# Pro Tips
- 💡Integrate Skill Judge into your CI/CD pipeline or as a pre-commit hook for skill packages to catch design issues early.
- 💡Always focus on the 'knowledge delta' principle: ensure your skill provides truly expert-only, non-obvious information that Claude doesn't inherently know.
- 💡Prioritize improvements based on the skill's scores and suggestions, focusing first on critical specification violations and then on enhancements that boost clarity and conciseness.

