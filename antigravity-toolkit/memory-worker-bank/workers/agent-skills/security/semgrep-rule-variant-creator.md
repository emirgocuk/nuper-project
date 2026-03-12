# semgrep-rule-variant-creator
Source: https://antigravity.codes/agent-skills/security/semgrep-rule-variant-creator

## AI Worker Instructions
When the user requests functionality related to semgrep-rule-variant-creator, follow these guidelines and utilize this context.

## Scraped Content

# semgrep-rule-variant-creator
```
semgrep-rule-creator
```
```
<original-rule-id>-<language>/├── <original-rule-id>-<language>.yaml     # Ported Semgrep rule└── <original-rule-id>-<language>.<ext>    # Test file with annotations
```
```
<original-rule-id>-<language>/├── <original-rule-id>-<language>.yaml     # Ported Semgrep rule└── <original-rule-id>-<language>.<ext>    # Test file with annotations
```
```
sql-injection
```
```
sql-injection-golang/├── sql-injection-golang.yaml└── sql-injection-golang.gosql-injection-java/├── sql-injection-java.yaml└── sql-injection-java.java
```
```
sql-injection-golang/├── sql-injection-golang.yaml└── sql-injection-golang.gosql-injection-java/├── sql-injection-java.yaml└── sql-injection-java.java
```
```
FOR EACH target language:  Phase 1: Applicability Analysis → Verdict  Phase 2: Test Creation (Test-First)  Phase 3: Rule Creation  Phase 4: Validation  (Complete full cycle before moving to next language)
```
```
FOR EACH target language:  Phase 1: Applicability Analysis → Verdict  Phase 2: Test Creation (Test-First)  Phase 3: Rule Creation  Phase 4: Validation  (Complete full cycle before moving to next language)
```
```
semgrep-rule-creator
```
```
semgrep-rule-creator
```
```
semgrep-rule-creator
```
```
APPLICABLE
```
```
APPLICABLE_WITH_ADAPTATION
```
```
NOT_APPLICABLE
```
```
ruleid:
```
```
ok:
```
```
// ruleid: sql-injection-golangdb.Query("SELECT * FROM users WHERE id = " + userInput)// ok: sql-injection-golangdb.Query("SELECT * FROM users WHERE id = ?", userInput)
```
```
// ruleid: sql-injection-golangdb.Query("SELECT * FROM users WHERE id = " + userInput)// ok: sql-injection-golangdb.Query("SELECT * FROM users WHERE id = ?", userInput)
```
```
semgrep --dump-ast -l <lang> test-file
```
```
# Validate YAMLsemgrep --validate --config rule.yaml# Run testssemgrep --test --config rule.yaml test-file
```
```
# Validate YAMLsemgrep --validate --config rule.yaml# Run testssemgrep --test --config rule.yaml test-file
```
```
All tests passed
```
```
semgrep --dataflow-traces -f rule.yaml test-file
```
```
semgrep --dataflow-traces -f rule.yaml test-file
```
```
semgrep --test --config rule.yaml test-file
```
```
semgrep --validate --config rule.yaml
```
```
semgrep --dump-ast -l <lang> <file>
```
```
semgrep --dataflow-traces -f rule.yaml file
```
Maintaining consistent code security and quality across a polyglot codebase presents a significant challenge. The Semgrep Rule Variant Creator Agent Skill streamlines this complex task by intelligently porting your existing Semgrep rules to new programming languages. It ensures that security patterns, coding standards, or bug detection logic are accurately translated and validated for each target language, complete with tailored test cases. This skill empowers developers to expand their static analysis coverage efficiently, fostering robust and consistent code integrity throughout their diverse projects without manual, error-prone translations.

# When to Use This Skill
- •Adapting a critical security vulnerability rule (e.g., insecure deserialization) from Python to Java.
- •Expanding static analysis coverage for a microservice architecture built with multiple programming languages.
- •Translating an internal coding standard rule developed for JavaScript to ensure compliance in Go.
- •Generating language-specific variants of a common anti-pattern detection rule for a multi-language monorepo.

# Pro Tips
- 💡Before porting, thoroughly assess if the vulnerability pattern or coding standard is truly applicable and has equivalent constructs in the target language.
- 💡Always review the generated test cases and expand them with language-specific edge cases to ensure robust validation of the new rule variant.
- 💡Combine this skill with `semgrep-rule-creator` when you need to build a new rule from scratch before generating its language-specific variants.
- 💡Provide clear and concise rule YAML content or a precise file path to ensure the skill accurately parses the original rule.

