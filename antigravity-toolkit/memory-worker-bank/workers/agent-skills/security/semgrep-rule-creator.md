# semgrep-rule-creator
Source: https://antigravity.codes/agent-skills/security/semgrep-rule-creator

## AI Worker Instructions
When the user requests functionality related to semgrep-rule-creator, follow these guidelines and utilize this context.

## Scraped Content

# semgrep-rule-creator
```
static-analysis
```
```
semgrep --test --config rule.yaml test-file
```
```
# BAD: Matches any function callpattern: $FUNC(...)# GOOD: Specific dangerous functionpattern: eval(...)
```
```
# BAD: Matches any function callpattern: $FUNC(...)# GOOD: Specific dangerous functionpattern: eval(...)
```
```
# BAD: Only tests vulnerable case# ruleid: my-ruledangerous(user_input)# GOOD: Include safe cases to verify no false positives# ruleid: my-ruledangerous(user_input)# ok: my-ruledangerous(sanitize(user_input))# ok: my-ruledangerous("hardcoded_safe_value")
```
```
# BAD: Only tests vulnerable case# ruleid: my-ruledangerous(user_input)# GOOD: Include safe cases to verify no false positives# ruleid: my-ruledangerous(user_input)# ok: my-ruledangerous(sanitize(user_input))# ok: my-ruledangerous("hardcoded_safe_value")
```
```
# BAD: Only matches exact formatpattern: os.system("rm " + $VAR)# GOOD: Matches all os.system calls with taint trackingmode: taintpattern-sinks:  - pattern: os.system(...)
```
```
# BAD: Only matches exact formatpattern: os.system("rm " + $VAR)# GOOD: Matches all os.system calls with taint trackingmode: taintpattern-sinks:  - pattern: os.system(...)
```
```
eval($X)
```
```
eval(user_input)
```
```
eval("safe_literal")
```
```
<rule-id>/├── <rule-id>.yaml     # Semgrep rule└── <rule-id>.<ext>    # Test file with ruleid/ok annotations
```
```
<rule-id>/├── <rule-id>.yaml     # Semgrep rule└── <rule-id>.<ext>    # Test file with ruleid/ok annotations
```
```
rules:  - id: insecure-eval    languages: [python]    severity: HIGH    message: User input passed to eval() allows code execution    mode: taint    pattern-sources:      - pattern: request.args.get(...)    pattern-sinks:      - pattern: eval(...)
```
```
rules:  - id: insecure-eval    languages: [python]    severity: HIGH    message: User input passed to eval() allows code execution    mode: taint    pattern-sources:      - pattern: request.args.get(...)    pattern-sinks:      - pattern: eval(...)
```
```
insecure-eval.py
```
```
# ruleid: insecure-evaleval(request.args.get('code'))# ok: insecure-evaleval("print('safe')")
```
```
# ruleid: insecure-evaleval(request.args.get('code'))# ok: insecure-evaleval("print('safe')")
```
```
semgrep --test --config rule.yaml test-file
```
```
cd <rule-dir> && semgrep --test --config rule.yaml test-file
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
```
semgrep -f rule.yaml <file>
```
```
pattern
```
```
patterns
```
```
pattern-either
```
```
pattern-not
```
```
pattern-inside
```
```
metavariable-regex
```
```
focus-metavariable
```
```
pattern-sources
```
```
pattern-sinks
```
```
pattern-sanitizers
```
```
pattern-propagators
```
```
<comment> ruleid: <id>
```
```
#
```
```
//
```
```
<comment> ok: <id>
```
```
# ruleid: my-rule
```
```
foo.bar()
```
```
foo().bar
```
```
semgrep --dump-ast -l <language> <test-file>
```
```
semgrep --dump-ast -l <language> <test-file>
```
```
semgrep --test --config rule.yaml test-file
```
```
semgrep --test --config rule.yaml test-file
```
```
semgrep --dataflow-traces -f rule.yaml test-file
```
```
semgrep --dataflow-traces -f rule.yaml test-file
```
```
func(...)
```
```
func()
```
```
func($X, ...)
```
```
func($X)
```
```
pattern-either:  - pattern: hashlib.md5(...)  - pattern: md5(...)  - pattern: hashlib.new("md5", ...)  - pattern: hashlib.new('md5', ...)    # Redundant - quotes equivalent in Python  - pattern: hashlib.new("md5")         # Redundant - covered by ... variant  - pattern: hashlib.new('md5')         # Redundant - quotes + covered
```
```
pattern-either:  - pattern: hashlib.md5(...)  - pattern: md5(...)  - pattern: hashlib.new("md5", ...)  - pattern: hashlib.new('md5', ...)    # Redundant - quotes equivalent in Python  - pattern: hashlib.new("md5")         # Redundant - covered by ... variant  - pattern: hashlib.new('md5')         # Redundant - quotes + covered
```
```
pattern-either:  - pattern: hashlib.md5(...)  - pattern: md5(...)  - pattern: hashlib.new("md5", ...)    # Covers all quote/argument variants
```
```
pattern-either:  - pattern: hashlib.md5(...)  - pattern: md5(...)  - pattern: hashlib.new("md5", ...)    # Covers all quote/argument variants
```
```
"
```
```
'
```
```
...
```
```
semgrep --test --config rule.yaml test-file
```
```
semgrep --test --config rule.yaml test-file
```
```
ruleid:
```
Empower your development workflow with the ability to precisely define and detect code patterns specific to your project's needs. This agent skill transcends generic static analysis by enabling you to craft bespoke Semgrep rules, ensuring early identification of custom bug patterns and critical security vulnerabilities. Leverage its power to enforce unique coding standards or build sophisticated taint-mode rules for robust data flow analysis, transforming how you secure and maintain code quality proactively. It's an essential tool for developers aiming for tailored and highly effective code auditing.

# When to Use This Skill
- •Developing a custom Semgrep rule to detect a specific business logic bug unique to your application.
- •Crafting a taint-mode rule to track sensitive user data flow from input to potential insecure sinks.
- •Enforcing internal coding standards or architectural patterns by creating rules that flag non-compliant code.
- •Building a new security vulnerability detector for a recently discovered zero-day specific to your tech stack.

# Pro Tips
- 💡Always validate new rules with `semgrep --test` and comprehensive test cases, including edge cases and non-matching safe code, to avoid false positives and negatives.
- 💡Prioritize taint mode for data flow analysis involving user input to sinks, as it provides superior precision for security vulnerabilities like XSS or SQL injection.
- 💡Develop a suite of positive (vulnerable) and negative (safe) examples for each rule to ensure it's both effective and accurate before deployment.

