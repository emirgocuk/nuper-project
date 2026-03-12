# semgrep
Source: https://antigravity.codes/agent-skills/security/semgrep

## AI Worker Instructions
When the user requests functionality related to semgrep, follow these guidelines and utilize this context.

## Scraped Content

# semgrep
```
semgrep --config auto
```
```
semgrep --config="p/trailofbits"
```
```
semgrep -f /path/to/rules
```
```
semgrep -c p/default --sarif --output scan.sarif
```
```
semgrep --test
```
```
semgrep --metrics=off --config=auto
```
```
semgrep --config=auto --severity ERROR
```
```
semgrep --dataflow-traces -f rule.yml
```
```
python3 -m pip install semgrep
```
```
python3 -m pip install semgrep
```
```
brew install semgrep
```
```
brew install semgrep
```
```
docker pull returntocorp/semgrep
```
```
docker pull returntocorp/semgrep
```
```
# Check current versionsemgrep --version# Update via pippython3 -m pip install --upgrade semgrep# Update via Homebrewbrew upgrade semgrep
```
```
# Check current versionsemgrep --version# Update via pippython3 -m pip install --upgrade semgrep# Update via Homebrewbrew upgrade semgrep
```
```
semgrep --version
```
```
semgrep --version
```
```
semgrep --config auto
```
```
semgrep --config auto
```
```
export SEMGREP_SEND_METRICS=off# ORsemgrep --metrics=off --config auto
```
```
export SEMGREP_SEND_METRICS=off# ORsemgrep --metrics=off --config auto
```
```
# Security-focused rulesetssemgrep --config="p/trailofbits"semgrep --config="p/cwe-top-25"semgrep --config="p/owasp-top-ten"# Language-specificsemgrep --config="p/javascript"# Multiple rulesetssemgrep --config="p/trailofbits" --config="p/r2c-security-audit"
```
```
# Security-focused rulesetssemgrep --config="p/trailofbits"semgrep --config="p/cwe-top-25"semgrep --config="p/owasp-top-ten"# Language-specificsemgrep --config="p/javascript"# Multiple rulesetssemgrep --config="p/trailofbits" --config="p/r2c-security-audit"
```
```
semgrep --config=auto --severity ERROR
```
```
semgrep --config=auto --severity ERROR
```
```
# SARIF for VS Code SARIF Explorersemgrep -c p/default --sarif --output scan.sarif# JSON for automationsemgrep -c p/default --json --output scan.json
```
```
# SARIF for VS Code SARIF Explorersemgrep -c p/default --sarif --output scan.sarif# JSON for automationsemgrep -c p/default --json --output scan.json
```
```
.semgrepignore
```
```
# Ignore specific files/directoriespath/to/ignore/file.extpath_to_ignore/# Ignore by extension*.ext# Include .gitignore patterns:include .gitignore
```
```
# Ignore specific files/directoriespath/to/ignore/file.extpath_to_ignore/# Ignore by extension*.ext# Include .gitignore patterns:include .gitignore
```
```
/tests
```
```
/test
```
```
/vendors
```
```
rules:  - id: rule-id    languages: [go]    message: Some message    severity: ERROR # INFO / WARNING / ERROR    pattern: test(...)
```
```
rules:  - id: rule-id    languages: [go]    message: Some message    severity: ERROR # INFO / WARNING / ERROR    pattern: test(...)
```
```
# Single filesemgrep --config custom_rule.yaml# Directory of rulessemgrep --config path/to/rules/
```
```
# Single filesemgrep --config custom_rule.yaml# Directory of rulessemgrep --config path/to/rules/
```
```
...
```
```
func(..., arg=value, ...)
```
```
$X
```
```
$VAR
```
```
$FUNC($INPUT)
```
```
<... ...>
```
```
if <... user.is_admin() ...>:
```
```
pattern-inside
```
```
pattern-not
```
```
pattern-either
```
```
patterns
```
```
metavariable-pattern
```
```
metavariable-comparison
```
```
$X > 1337
```
```
rules:  - id: requests-verify-false    languages: [python]    message: requests.get with verify=False disables SSL verification    severity: WARNING    pattern: requests.get(..., verify=False, ...)
```
```
rules:  - id: requests-verify-false    languages: [python]    message: requests.get with verify=False disables SSL verification    severity: WARNING    pattern: requests.get(..., verify=False, ...)
```
```
rules:  - id: sql-injection    mode: taint    pattern-sources:      - pattern: request.args.get(...)    pattern-sinks:      - pattern: cursor.execute($QUERY)    pattern-sanitizers:      - pattern: int(...)    message: Potential SQL injection with unsanitized user input    languages: [python]    severity: ERROR
```
```
rules:  - id: sql-injection    mode: taint    pattern-sources:      - pattern: request.args.get(...)    pattern-sinks:      - pattern: cursor.execute($QUERY)    pattern-sanitizers:      - pattern: int(...)    message: Potential SQL injection with unsanitized user input    languages: [python]    severity: ERROR
```
```
# ruleid: requests-verify-falserequests.get(url, verify=False)# ok: requests-verify-falserequests.get(url, verify=True)
```
```
# ruleid: requests-verify-falserequests.get(url, verify=False)# ok: requests-verify-falserequests.get(url, verify=True)
```
```
semgrep --test ./path/to/rules/
```
```
semgrep --test ./path/to/rules/
```
```
.fixed
```
```
test.py
```
```
test.fixed.py
```
```
semgrep --test# Output: 1/1: ✓ All tests passed#         1/1: ✓ All fix tests passed
```
```
semgrep --test# Output: 1/1: ✓ All tests passed#         1/1: ✓ All fix tests passed
```
```
.semgrepignore
```
```
.semgrepignore
```
```
# Ignore directoriestests/vendor/node_modules/# Ignore file types*.min.js*.generated.go# Include .gitignore patterns:include .gitignore
```
```
# Ignore directoriestests/vendor/node_modules/# Ignore file types*.min.js*.generated.go# Include .gitignore patterns:include .gitignore
```
```
# nosemgrep: rule-idrisky_function()
```
```
# nosemgrep: rule-idrisky_function()
```
```
# nosemgrep
```
```
rules:  - id: example-rule    metadata:      cwe: "CWE-89"      confidence: HIGH      likelihood: MEDIUM      impact: HIGH      subcategory: vuln    # ... rest of rule
```
```
rules:  - id: example-rule    metadata:      cwe: "CWE-89"      confidence: HIGH      likelihood: MEDIUM      impact: HIGH      subcategory: vuln    # ... rest of rule
```
```
--time
```
```
pattern-inside
```
```
focus-metavariable
```
```
semgrep --config=/path/to/config --lang python --scan-unknown-extensions /path/to/file.xyz
```
```
semgrep --config=/path/to/config --lang python --scan-unknown-extensions /path/to/file.xyz
```
```
--dataflow-traces
```
```
semgrep --dataflow-traces -f taint_rule.yml test.py
```
```
semgrep --dataflow-traces -f taint_rule.yml test.py
```
```
Taint comes from:  test.py    2┆ data = get_user_input()This is how taint reaches the sink:  test.py    3┆ return output(data)
```
```
Taint comes from:  test.py    2┆ data = get_user_input()This is how taint reaches the sink:  test.py    3┆ return output(data)
```
```
rules:  - id: eval-in-html    languages: [html]    message: eval in JavaScript    patterns:      - pattern: <script ...>$Y</script>      - metavariable-pattern:          metavariable: $Y          language: javascript          patterns:            - pattern: eval(...)    severity: WARNING
```
```
rules:  - id: eval-in-html    languages: [html]    message: eval in JavaScript    patterns:      - pattern: <script ...>$Y</script>      - metavariable-pattern:          metavariable: $Y          language: javascript          patterns:            - pattern: eval(...)    severity: WARNING
```
```
rules:  - id: high-value-check    languages: [python]    message: $X is higher than 1337    patterns:      - pattern: function($X)      - metavariable-comparison:          metavariable: $X          comparison: $X > 1337    severity: WARNING
```
```
rules:  - id: high-value-check    languages: [python]    message: $X is higher than 1337    patterns:      - pattern: function($X)      - metavariable-comparison:          metavariable: $X          comparison: $X > 1337    severity: WARNING
```
```
rules:  - id: ioutil-readdir-deprecated    languages: [golang]    message: ioutil.ReadDir is deprecated. Use os.ReadDir instead.    severity: WARNING    pattern: ioutil.ReadDir($X)    fix: os.ReadDir($X)
```
```
rules:  - id: ioutil-readdir-deprecated    languages: [golang]    message: ioutil.ReadDir is deprecated. Use os.ReadDir instead.    severity: WARNING    pattern: ioutil.ReadDir($X)    fix: os.ReadDir($X)
```
```
semgrep -f rule.yaml --dryrun --autofix
```
```
semgrep -f rule.yaml --dryrun --autofix
```
```
semgrep -f rule.yaml --autofix
```
```
semgrep -f rule.yaml --autofix
```
```
semgrep --config=auto --time
```
```
semgrep --config=auto --time
```
```
paths
```
```
pattern-inside
```
```
pip install semgrep-rules-managermkdir -p $HOME/custom-semgrep-rulessemgrep-rules-manager --dir $HOME/custom-semgrep-rules downloadsemgrep -f $HOME/custom-semgrep-rules
```
```
pip install semgrep-rules-managermkdir -p $HOME/custom-semgrep-rulessemgrep-rules-manager --dir $HOME/custom-semgrep-rules downloadsemgrep -f $HOME/custom-semgrep-rules
```
```
name: Semgrepon:  pull_request: {}  push:    branches: ["master", "main"]  schedule:    - cron: '0 0 1 * *' # Monthlyjobs:  semgrep-schedule:    if: ((github.event_name == 'schedule' || github.event_name == 'push' || github.event.pull_request.merged == true)        && github.actor != 'dependabot[bot]')    name: Semgrep default scan    runs-on: ubuntu-latest    container:      image: returntocorp/semgrep    steps:      - name: Checkout main repository        uses: actions/checkout@v4      - run: semgrep ci        env:          SEMGREP_RULES: p/default  semgrep-pr:    if: (github.event_name == 'pull_request' && github.actor != 'dependabot[bot]')    name: Semgrep PR scan    runs-on: ubuntu-latest    container:      image: returntocorp/semgrep    steps:      - uses: actions/checkout@v4      - run: semgrep ci        env:          SEMGREP_RULES: >            p/cwe-top-25            p/owasp-top-ten            p/r2c-security-audit            p/trailofbits
```
```
name: Semgrepon:  pull_request: {}  push:    branches: ["master", "main"]  schedule:    - cron: '0 0 1 * *' # Monthlyjobs:  semgrep-schedule:    if: ((github.event_name == 'schedule' || github.event_name == 'push' || github.event.pull_request.merged == true)        && github.actor != 'dependabot[bot]')    name: Semgrep default scan    runs-on: ubuntu-latest    container:      image: returntocorp/semgrep    steps:      - name: Checkout main repository        uses: actions/checkout@v4      - run: semgrep ci        env:          SEMGREP_RULES: p/default  semgrep-pr:    if: (github.event_name == 'pull_request' && github.actor != 'dependabot[bot]')    name: Semgrep PR scan    runs-on: ubuntu-latest    container:      image: returntocorp/semgrep    steps:      - uses: actions/checkout@v4      - run: semgrep ci        env:          SEMGREP_RULES: >            p/cwe-top-25            p/owasp-top-ten            p/r2c-security-audit            p/trailofbits
```
```
env:  SEMGREP_RULES: p/default custom-semgrep-rules-dir/
```
```
env:  SEMGREP_RULES: p/default custom-semgrep-rules-dir/
```
```
env:  SEMGREP_PRIVATE_RULES_REPO: semgrep-private-rulessteps:  - name: Checkout main repository    uses: actions/checkout@v4  - name: Checkout private custom Semgrep rules    uses: actions/checkout@v4    with:      repository: ${{ github.repository_owner }}/${{ env.SEMGREP_PRIVATE_RULES_REPO }}      token: ${{ secrets.SEMGREP_RULES_TOKEN }}      path: ${{ env.SEMGREP_PRIVATE_RULES_REPO }}  - run: semgrep ci    env:      SEMGREP_RULES: ${{ env.SEMGREP_PRIVATE_RULES_REPO }}
```
```
env:  SEMGREP_PRIVATE_RULES_REPO: semgrep-private-rulessteps:  - name: Checkout main repository    uses: actions/checkout@v4  - name: Checkout private custom Semgrep rules    uses: actions/checkout@v4    with:      repository: ${{ github.repository_owner }}/${{ env.SEMGREP_PRIVATE_RULES_REPO }}      token: ${{ secrets.SEMGREP_RULES_TOKEN }}      path: ${{ env.SEMGREP_PRIVATE_RULES_REPO }}  - run: semgrep ci    env:      SEMGREP_RULES: ${{ env.SEMGREP_PRIVATE_RULES_REPO }}
```
```
name: Test Semgrep ruleson: [push, pull_request]jobs:  semgrep-test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - uses: actions/setup-python@v4        with:          python-version: "3.11"          cache: "pip"      - run: python -m pip install -r requirements.txt      - run: semgrep --test --test-ignore-todo ./path/to/rules/
```
```
name: Test Semgrep ruleson: [push, pull_request]jobs:  semgrep-test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - uses: actions/setup-python@v4        with:          python-version: "3.11"          cache: "pip"      - run: python -m pip install -r requirements.txt      - run: semgrep --test --test-ignore-todo ./path/to/rules/
```
```
--config auto
```
```
--metrics=off
```
```
.semgrepignore
```
```
/vendor
```
```
.semgrepignore
```
```
# ok:
```
```
# nosemgrep
```
```
# nosemgrep: rule-id
```
```
...
```
Integrating the Semgrep Agent Skill empowers your AI coding assistant to become a proactive partner in maintaining code quality and security. This skill allows the AI to swiftly identify potential issues, enforce best practices, and even suggest refactoring opportunities by leveraging Semgrep's powerful pattern matching capabilities. It transforms your assistant into an on-demand security auditor and code maintainer, providing instant insights without the need for complex build processes. With this skill, developers can iterate faster, confident that common pitfalls and known vulnerabilities are being caught early, significantly streamlining the development lifecycle.

# When to Use This Skill
- •Identifying common low-complexity bugs and specific anti-patterns across a codebase.
- •Conducting rapid initial security assessments on new or modified code segments.
- •Ensuring adherence to internal coding standards and secure coding practices.
- •Assisting in large-scale code refactoring by identifying deprecated APIs or consistent patterns for update.

# Pro Tips
- 💡Leverage custom Semgrep rules to mimic your project's specific security policies and coding conventions, ensuring highly relevant findings.
- 💡Integrate Semgrep scans directly into your CI/CD pipeline for automated, early detection of issues before they reach production.
- 💡Start with a curated set of community rules, then incrementally add custom rules tailored to your unique codebase and threat model.

