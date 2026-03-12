# shellcheck-configuration
Source: https://antigravity.codes/agent-skills/devops/shellcheck-configuration

## AI Worker Instructions
When the user requests functionality related to shellcheck-configuration, follow these guidelines and utilize this context.

## Scraped Content

# shellcheck-configuration
```
# macOS with Homebrewbrew install shellcheck# Ubuntu/Debianapt-get install shellcheck# From sourcegit clone https://github.com/koalaman/shellcheck.gitcd shellcheckmake buildmake install# Verify installationshellcheck --version
```
```
# macOS with Homebrewbrew install shellcheck# Ubuntu/Debianapt-get install shellcheck# From sourcegit clone https://github.com/koalaman/shellcheck.gitcd shellcheckmake buildmake install# Verify installationshellcheck --version
```
```
.shellcheckrc
```
```
# Specify target shellshell=bash# Enable optional checksenable=avoid-nullary-conditionsenable=require-variable-braces# Disable specific warningsdisable=SC1091disable=SC2086
```
```
# Specify target shellshell=bash# Enable optional checksenable=avoid-nullary-conditionsenable=require-variable-braces# Disable specific warningsdisable=SC1091disable=SC2086
```
```
# Set default shell targetexport SHELLCHECK_SHELL=bash# Enable strict modeexport SHELLCHECK_STRICT=true# Specify configuration file locationexport SHELLCHECK_CONFIG=~/.shellcheckrc
```
```
# Set default shell targetexport SHELLCHECK_SHELL=bash# Enable strict modeexport SHELLCHECK_STRICT=true# Specify configuration file locationexport SHELLCHECK_CONFIG=~/.shellcheckrc
```
```
# SC1004: Backslash continuation not followed by newlineecho hello\world  # Error - needs line continuation# SC1008: Invalid data for operator =='if [[ $var =  "value" ]]; then  # Space before ==    truefi
```
```
# SC1004: Backslash continuation not followed by newlineecho hello\world  # Error - needs line continuation# SC1008: Invalid data for operator =='if [[ $var =  "value" ]]; then  # Space before ==    truefi
```
```
=='if [[ $var =  "value" ]]; then  # Space before ==    truefi
```
```
# SC2009: Consider using pgrep or pidof instead of grep|grepps aux | grep -v grep | grep myprocess  # Use pgrep instead# SC2012: Use ls only for viewing. Use find for reliable outputfor file in $(ls -la)  # Better: use find or globbing# SC2015: Avoid using && and || instead of if-then-else[[ -f "$file" ]] && echo "found" || echo "not found"  # Less clear# SC2016: Expressions don't expand in single quotesecho '$VAR'  # Literal $VAR, not variable expansion# SC2026: This word is non-standard. Set POSIXLY_CORRECT# when using with scripts for other shells
```
```
# SC2009: Consider using pgrep or pidof instead of grep|grepps aux | grep -v grep | grep myprocess  # Use pgrep instead# SC2012: Use
```
```
only for viewing. Use
```
```
for reliable outputfor file in $(ls -la)  # Better: use find or globbing# SC2015: Avoid using && and || instead of if-then-else[[ -f "$file" ]] && echo "found" || echo "not found"  # Less clear# SC2016: Expressions don't expand in single quotesecho '$VAR'  # Literal $VAR, not variable expansion# SC2026: This word is non-standard. Set POSIXLY_CORRECT# when using with scripts for other shells
```
```
# SC2086: Double quote to prevent globbing and word splittingfor i in $list; do  # Should be: for i in $list or for i in "$list"    echo "$i"done# SC2115: Literal tilde in path not expanded. Use $HOME instead~/.bashrc  # In strings, use "$HOME/.bashrc"# SC2181: Check exit code directly with if, not indirectly in a listsome_commandif [ $? -eq 0 ]; then  # Better: if some_command; then# SC2206: Quote to prevent word splitting or set IFSarray=( $items )  # Should use: array=( $items )
```
```
# SC2086: Double quote to prevent globbing and word splittingfor i in $list; do  # Should be: for i in $list or for i in "$list"    echo "$i"done# SC2115: Literal tilde in path not expanded. Use $HOME instead~/.bashrc  # In strings, use "$HOME/.bashrc"# SC2181: Check exit code directly with
```
```
, not indirectly in a listsome_commandif [ $? -eq 0 ]; then  # Better: if some_command; then# SC2206: Quote to prevent word splitting or set IFSarray=( $items )  # Should use: array=( $items )
```
```
# SC3010: In POSIX sh, use 'case' instead of 'cond && foo'[[ $var == "value" ]] && do_something  # Not POSIX# SC3043: In POSIX sh, use 'local' is undefinedfunction my_func() {    local var=value  # Not POSIX in some shells}
```
```
# SC3010: In POSIX sh, use 'case' instead of 'cond && foo'[[ $var == "value" ]] && do_something  # Not POSIX# SC3043: In POSIX sh, use 'local' is undefinedfunction my_func() {    local var=value  # Not POSIX in some shells}
```
```
#!/bin/bash# Configure for maximum portabilityshellcheck \  --shell=sh \  --external-sources \  --check-sourced \  script.sh
```
```
#!/bin/bash# Configure for maximum portabilityshellcheck \  --shell=sh \  --external-sources \  --check-sourced \  script.sh
```
```
#!/bin/bash# Configure for Bash developmentshellcheck \  --shell=bash \  --exclude=SC1091,SC2119 \  --enable=all \  script.sh
```
```
#!/bin/bash# Configure for Bash developmentshellcheck \  --shell=bash \  --exclude=SC1091,SC2119 \  --enable=all \  script.sh
```
```
#!/bin/bashset -Eeuo pipefail# Analyze all shell scripts and fail on issuesfind . -type f -name "*.sh" | while read -r script; do    echo "Checking: $script"    shellcheck \        --shell=bash \        --format=gcc \        --exclude=SC1091 \        "$script" || exit 1done
```
```
#!/bin/bashset -Eeuo pipefail# Analyze all shell scripts and fail on issuesfind . -type f -name "*.sh" | while read -r script; do    echo "Checking: $script"    shellcheck \        --shell=bash \        --format=gcc \        --exclude=SC1091 \        "$script" || exit 1done
```
```
# Shell dialect to analyze againstshell=bash# Enable optional checksenable=avoid-nullary-conditions,require-variable-braces,check-unassigned-uppercase# Disable specific warnings# SC1091: Not following sourced files (many false positives)disable=SC1091# SC2119: Use function_name instead of function_name -- (arguments)disable=SC2119# External files to source for contextexternal-sources=true
```
```
# Shell dialect to analyze againstshell=bash# Enable optional checksenable=avoid-nullary-conditions,require-variable-braces,check-unassigned-uppercase# Disable specific warnings# SC1091: Not following sourced files (many false positives)disable=SC1091# SC2119: Use function_name instead of function_name -- (arguments)disable=SC2119# External files to source for contextexternal-sources=true
```
```
#!/bin/bash# .git/hooks/pre-commit#!/bin/bashset -e# Find all shell scripts changed in this commitgit diff --cached --name-only | grep '\.sh$' | while read -r script; do    echo "Linting: $script"    if ! shellcheck "$script"; then        echo "ShellCheck failed on $script"        exit 1    fidone
```
```
#!/bin/bash# .git/hooks/pre-commit#!/bin/bashset -e# Find all shell scripts changed in this commitgit diff --cached --name-only | grep '\.sh$' | while read -r script; do    echo "Linting: $script"    if ! shellcheck "$script"; then        echo "ShellCheck failed on $script"        exit 1    fidone
```
```
name: ShellCheckon: [push, pull_request]jobs:  shellcheck:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v3      - name: Run ShellCheck        run: |          sudo apt-get install shellcheck          find . -type f -name "*.sh" -exec shellcheck {} \;
```
```
name: ShellCheckon: [push, pull_request]jobs:  shellcheck:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v3      - name: Run ShellCheck        run: |          sudo apt-get install shellcheck          find . -type f -name "*.sh" -exec shellcheck {} \;
```
```
shellcheck:  stage: lint  image: koalaman/shellcheck-alpine  script:    - find . -type f -name "*.sh" -exec shellcheck {} \;  allow_failure: false
```
```
shellcheck:  stage: lint  image: koalaman/shellcheck-alpine  script:    - find . -type f -name "*.sh" -exec shellcheck {} \;  allow_failure: false
```
```
#!/bin/bash# Disable warning for entire line# shellcheck disable=SC2086for file in $(ls -la); do    echo "$file"done# Disable for entire script# shellcheck disable=SC1091,SC2119# Disable multiple warnings (format varies)command_that_fails() {    # shellcheck disable=SC2015    [ -f "$1" ] && echo "found" || echo "not found"}# Disable specific check for source directive# shellcheck source=./helper.shsource helper.sh
```
```
#!/bin/bash# Disable warning for entire line# shellcheck disable=SC2086for file in $(ls -la); do    echo "$file"done# Disable for entire script# shellcheck disable=SC1091,SC2119# Disable multiple warnings (format varies)command_that_fails() {    # shellcheck disable=SC2015    [ -f "$1" ] && echo "found" || echo "not found"}# Disable specific check for source directive# shellcheck source=./helper.shsource helper.sh
```
```
# Problemfor i in $list; do done# Solutionfor i in $list; do done  # If $list is already quoted, orfor i in "${list[@]}"; do done  # If list is an array
```
```
# Problemfor i in $list; do done# Solutionfor i in $list; do done  # If $list is already quoted, orfor i in "${list[@]}"; do done  # If list is an array
```
```
# Problemsome_commandif [ $? -eq 0 ]; then    echo "success"fi# Solutionif some_command; then    echo "success"fi
```
```
# Problemsome_commandif [ $? -eq 0 ]; then    echo "success"fi# Solutionif some_command; then    echo "success"fi
```
```
# Problem[ -f "$file" ] && echo "exists" || echo "not found"# Solution - clearer intentif [ -f "$file" ]; then    echo "exists"else    echo "not found"fi
```
```
# Problem[ -f "$file" ] && echo "exists" || echo "not found"# Solution - clearer intentif [ -f "$file" ]; then    echo "exists"else    echo "not found"fi
```
```
# Problemecho 'Variable value: $VAR'# Solutionecho "Variable value: $VAR"
```
```
# Problemecho 'Variable value: $VAR'# Solutionecho "Variable value: $VAR"
```
```
# Problemps aux | grep -v grep | grep myprocess# Solutionpgrep -f myprocess
```
```
# Problemps aux | grep -v grep | grep myprocess# Solutionpgrep -f myprocess
```
```
#!/bin/bash# Sequential checkingfor script in *.sh; do    shellcheck "$script"done# Parallel checking (faster)find . -name "*.sh" -print0 | \    xargs -0 -P 4 -n 1 shellcheck
```
```
#!/bin/bash# Sequential checkingfor script in *.sh; do    shellcheck "$script"done# Parallel checking (faster)find . -name "*.sh" -print0 | \    xargs -0 -P 4 -n 1 shellcheck
```
```
#!/bin/bashCACHE_DIR=".shellcheck_cache"mkdir -p "$CACHE_DIR"check_script() {    local script="$1"    local hash    local cache_file    hash=$(sha256sum "$script" | cut -d' ' -f1)    cache_file="$CACHE_DIR/$hash"    if [[ ! -f "$cache_file" ]]; then        if shellcheck "$script" > "$cache_file" 2>&1; then            touch "$cache_file.ok"        else            return 1        fi    fi    [[ -f "$cache_file.ok" ]]}find . -name "*.sh" | while read -r script; do    check_script "$script" || exit 1done
```
```
#!/bin/bashCACHE_DIR=".shellcheck_cache"mkdir -p "$CACHE_DIR"check_script() {    local script="$1"    local hash    local cache_file    hash=$(sha256sum "$script" | cut -d' ' -f1)    cache_file="$CACHE_DIR/$hash"    if [[ ! -f "$cache_file" ]]; then        if shellcheck "$script" > "$cache_file" 2>&1; then            touch "$cache_file.ok"        else            return 1        fi    fi    [[ -f "$cache_file.ok" ]]}find . -name "*.sh" | while read -r script; do    check_script "$script" || exit 1done
```
```
shellcheck script.sh# Output:# script.sh:1:3: warning: foo is referenced but not assigned. [SC2154]
```
```
shellcheck script.sh# Output:# script.sh:1:3: warning: foo is referenced but not assigned. [SC2154]
```
```
shellcheck --format=gcc script.sh# Output:# script.sh:1:3: warning: foo is referenced but not assigned.
```
```
shellcheck --format=gcc script.sh# Output:# script.sh:1:3: warning: foo is referenced but not assigned.
```
```
shellcheck --format=json script.sh# Output:# [{"file": "script.sh", "line": 1, "column": 3, "level": "warning", "code": 2154, "message": "..."}]
```
```
shellcheck --format=json script.sh# Output:# [{"file": "script.sh", "line": 1, "column": 3, "level": "warning", "code": 2154, "message": "..."}]
```
```
shellcheck --format=quiet script.sh# Returns non-zero if issues found, no output otherwise
```
```
shellcheck --format=quiet script.sh# Returns non-zero if issues found, no output otherwise
```
Elevate your shell scripting prowess with this comprehensive AI Agent Skill focused on ShellCheck. Designed for developers and DevOps engineers, it guides you through configuring robust static analysis to ensure your scripts are not just functional, but also robust, portable, and free from common errors. Leverage the power of AI to integrate linting seamlessly into your development workflow, automate quality checks, and maintain high standards across all your shell-based projects. This skill empowers you to preemptively identify issues, enforce coding guidelines, and build more reliable automation scripts, enhancing overall system stability and developer productivity.

# When to Use This Skill
- •Automating shell script quality checks in CI/CD pipelines
- •Refactoring legacy shell scripts to meet modern best practices
- •Tailoring ShellCheck rulesets for specific project coding standards
- •Debugging complex shell errors identified by static analysis

# Pro Tips
- 💡Always integrate ShellCheck into your pre-commit hooks or CI/CD pipelines to catch issues early and maintain a clean codebase.
- 💡When suppressing warnings with `SC2xxx`, add a brief comment explaining *why* the suppression is necessary for future maintainability.
- 💡Utilize ShellCheck's `--shell` option to accurately target your script's intended interpreter (e.g., `bash`, `sh`) to avoid false positives or missed warnings.

