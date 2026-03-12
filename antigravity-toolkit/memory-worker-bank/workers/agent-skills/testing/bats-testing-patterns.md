# bats-testing-patterns
Source: https://antigravity.codes/agent-skills/testing/bats-testing-patterns

## AI Worker Instructions
When the user requests functionality related to bats-testing-patterns, follow these guidelines and utilize this context.

## Scraped Content

# bats-testing-patterns
```
# macOS with Homebrewbrew install bats-core# Ubuntu/Debiangit clone https://github.com/bats-core/bats-core.gitcd bats-core./install.sh /usr/local# From npm (Node.js)npm install --global bats# Verify installationbats --version
```
```
# macOS with Homebrewbrew install bats-core# Ubuntu/Debiangit clone https://github.com/bats-core/bats-core.gitcd bats-core./install.sh /usr/local# From npm (Node.js)npm install --global bats# Verify installationbats --version
```
```
project/├── bin/│   ├── script.sh│   └── helper.sh├── tests/│   ├── test_script.bats│   ├── test_helper.sh│   ├── fixtures/│   │   ├── input.txt│   │   └── expected_output.txt│   └── helpers/│       └── mocks.bash└── README.md
```
```
project/├── bin/│   ├── script.sh│   └── helper.sh├── tests/│   ├── test_script.bats│   ├── test_helper.sh│   ├── fixtures/│   │   ├── input.txt│   │   └── expected_output.txt│   └── helpers/│       └── mocks.bash└── README.md
```
```
#!/usr/bin/env bats# Load test helper if presentload test_helper# Setup runs before each testsetup() {    export TMPDIR=$(mktemp -d)}# Teardown runs after each testteardown() {    rm -rf "$TMPDIR"}# Test: simple assertion@test "Function returns 0 on success" {    run my_function "input"    [ "$status" -eq 0 ]}# Test: output verification@test "Function outputs correct result" {    run my_function "test"    [ "$output" = "expected output" ]}# Test: error handling@test "Function returns 1 on missing argument" {    run my_function    [ "$status" -eq 1 ]}
```
```
#!/usr/bin/env bats# Load test helper if presentload test_helper# Setup runs before each testsetup() {    export TMPDIR=$(mktemp -d)}# Teardown runs after each testteardown() {    rm -rf "$TMPDIR"}# Test: simple assertion@test "Function returns 0 on success" {    run my_function "input"    [ "$status" -eq 0 ]}# Test: output verification@test "Function outputs correct result" {    run my_function "test"    [ "$output" = "expected output" ]}# Test: error handling@test "Function returns 1 on missing argument" {    run my_function    [ "$status" -eq 1 ]}
```
```
#!/usr/bin/env bats@test "Command succeeds" {    run true    [ "$status" -eq 0 ]}@test "Command fails as expected" {    run false    [ "$status" -ne 0 ]}@test "Command returns specific exit code" {    run my_function --invalid    [ "$status" -eq 127 ]}@test "Can capture command result" {    run echo "hello"    [ $status -eq 0 ]    [ "$output" = "hello" ]}
```
```
#!/usr/bin/env bats@test "Command succeeds" {    run true    [ "$status" -eq 0 ]}@test "Command fails as expected" {    run false    [ "$status" -ne 0 ]}@test "Command returns specific exit code" {    run my_function --invalid    [ "$status" -eq 127 ]}@test "Can capture command result" {    run echo "hello"    [ $status -eq 0 ]    [ "$output" = "hello" ]}
```
```
#!/usr/bin/env bats@test "Output matches string" {    result=$(echo "hello world")    [ "$result" = "hello world" ]}@test "Output contains substring" {    result=$(echo "hello world")    [[ "$result" == *"world"* ]]}@test "Output matches pattern" {    result=$(date +%Y)    [[ "$result" =~ ^[0-9]{4}$ ]]}@test "Multi-line output" {    run printf "line1\nline2\nline3"    [ "$output" = "line1line2line3" ]}@test "Lines variable contains output" {    run printf "line1\nline2\nline3"    [ "${lines[0]}" = "line1" ]    [ "${lines[1]}" = "line2" ]    [ "${lines[2]}" = "line3" ]}
```
```
#!/usr/bin/env bats@test "Output matches string" {    result=$(echo "hello world")    [ "$result" = "hello world" ]}@test "Output contains substring" {    result=$(echo "hello world")    [[ "$result" == *"world"* ]]}@test "Output matches pattern" {    result=$(date +%Y)    [[ "$result" =~ ^[0-9]{4}$ ]]}@test "Multi-line output" {    run printf "line1\nline2\nline3"    [ "$output" = "line1line2line3" ]}@test "Lines variable contains output" {    run printf "line1\nline2\nline3"    [ "${lines[0]}" = "line1" ]    [ "${lines[1]}" = "line2" ]    [ "${lines[2]}" = "line3" ]}
```
```
#!/usr/bin/env bats@test "File is created" {    [ ! -f "$TMPDIR/output.txt" ]    my_function > "$TMPDIR/output.txt"    [ -f "$TMPDIR/output.txt" ]}@test "File contents match expected" {    my_function > "$TMPDIR/output.txt"    [ "$(cat "$TMPDIR/output.txt")" = "expected content" ]}@test "File is readable" {    touch "$TMPDIR/test.txt"    [ -r "$TMPDIR/test.txt" ]}@test "File has correct permissions" {    touch "$TMPDIR/test.txt"    chmod 644 "$TMPDIR/test.txt"    [ "$(stat -f %OLp "$TMPDIR/test.txt")" = "644" ]}@test "File size is correct" {    echo -n "12345" > "$TMPDIR/test.txt"    [ "$(wc -c < "$TMPDIR/test.txt")" -eq 5 ]}
```
```
#!/usr/bin/env bats@test "File is created" {    [ ! -f "$TMPDIR/output.txt" ]    my_function > "$TMPDIR/output.txt"    [ -f "$TMPDIR/output.txt" ]}@test "File contents match expected" {    my_function > "$TMPDIR/output.txt"    [ "$(cat "$TMPDIR/output.txt")" = "expected content" ]}@test "File is readable" {    touch "$TMPDIR/test.txt"    [ -r "$TMPDIR/test.txt" ]}@test "File has correct permissions" {    touch "$TMPDIR/test.txt"    chmod 644 "$TMPDIR/test.txt"    [ "$(stat -f %OLp "$TMPDIR/test.txt")" = "644" ]}@test "File size is correct" {    echo -n "12345" > "$TMPDIR/test.txt"    [ "$(wc -c < "$TMPDIR/test.txt")" -eq 5 ]}
```
```
#!/usr/bin/env batssetup() {    # Create test directory    TEST_DIR=$(mktemp -d)    export TEST_DIR    # Source script under test    source "${BATS_TEST_DIRNAME}/../bin/script.sh"}teardown() {    # Clean up temporary directory    rm -rf "$TEST_DIR"}@test "Test using TEST_DIR" {    touch "$TEST_DIR/file.txt"    [ -f "$TEST_DIR/file.txt" ]}
```
```
#!/usr/bin/env batssetup() {    # Create test directory    TEST_DIR=$(mktemp -d)    export TEST_DIR    # Source script under test    source "${BATS_TEST_DIRNAME}/../bin/script.sh"}teardown() {    # Clean up temporary directory    rm -rf "$TEST_DIR"}@test "Test using TEST_DIR" {    touch "$TEST_DIR/file.txt"    [ -f "$TEST_DIR/file.txt" ]}
```
```
#!/usr/bin/env batssetup() {    # Create directory structure    mkdir -p "$TMPDIR/data/input"    mkdir -p "$TMPDIR/data/output"    # Create test fixtures    echo "line1" > "$TMPDIR/data/input/file1.txt"    echo "line2" > "$TMPDIR/data/input/file2.txt"    # Initialize environment    export DATA_DIR="$TMPDIR/data"    export INPUT_DIR="$DATA_DIR/input"    export OUTPUT_DIR="$DATA_DIR/output"}teardown() {    rm -rf "$TMPDIR/data"}@test "Processes input files" {    run my_process_script "$INPUT_DIR" "$OUTPUT_DIR"    [ "$status" -eq 0 ]    [ -f "$OUTPUT_DIR/file1.txt" ]}
```
```
#!/usr/bin/env batssetup() {    # Create directory structure    mkdir -p "$TMPDIR/data/input"    mkdir -p "$TMPDIR/data/output"    # Create test fixtures    echo "line1" > "$TMPDIR/data/input/file1.txt"    echo "line2" > "$TMPDIR/data/input/file2.txt"    # Initialize environment    export DATA_DIR="$TMPDIR/data"    export INPUT_DIR="$DATA_DIR/input"    export OUTPUT_DIR="$DATA_DIR/output"}teardown() {    rm -rf "$TMPDIR/data"}@test "Processes input files" {    run my_process_script "$INPUT_DIR" "$OUTPUT_DIR"    [ "$status" -eq 0 ]    [ -f "$OUTPUT_DIR/file1.txt" ]}
```
```
#!/usr/bin/env bats# Load shared setup from test_helper.shload test_helper# setup_file runs once before all testssetup_file() {    export SHARED_RESOURCE=$(mktemp -d)    echo "Expensive setup" > "$SHARED_RESOURCE/data.txt"}# teardown_file runs once after all teststeardown_file() {    rm -rf "$SHARED_RESOURCE"}@test "First test uses shared resource" {    [ -f "$SHARED_RESOURCE/data.txt" ]}@test "Second test uses shared resource" {    [ -d "$SHARED_RESOURCE" ]}
```
```
#!/usr/bin/env bats# Load shared setup from test_helper.shload test_helper# setup_file runs once before all testssetup_file() {    export SHARED_RESOURCE=$(mktemp -d)    echo "Expensive setup" > "$SHARED_RESOURCE/data.txt"}# teardown_file runs once after all teststeardown_file() {    rm -rf "$SHARED_RESOURCE"}@test "First test uses shared resource" {    [ -f "$SHARED_RESOURCE/data.txt" ]}@test "Second test uses shared resource" {    [ -d "$SHARED_RESOURCE" ]}
```
```
#!/usr/bin/env bats# Mock external commandmy_external_tool() {    echo "mocked output"    return 0}@test "Function uses mocked tool" {    export -f my_external_tool    run my_function    [[ "$output" == *"mocked output"* ]]}
```
```
#!/usr/bin/env bats# Mock external commandmy_external_tool() {    echo "mocked output"    return 0}@test "Function uses mocked tool" {    export -f my_external_tool    run my_function    [[ "$output" == *"mocked output"* ]]}
```
```
#!/usr/bin/env batssetup() {    # Create stub directory    STUBS_DIR="$TMPDIR/stubs"    mkdir -p "$STUBS_DIR"    # Add to PATH    export PATH="$STUBS_DIR:$PATH"}create_stub() {    local cmd="$1"    local output="$2"    local code="${3:-0}"    cat > "$STUBS_DIR/$cmd" <<EOF#!/bin/bashecho "$output"exit $codeEOF    chmod +x "$STUBS_DIR/$cmd"}@test "Function works with stubbed curl" {    create_stub curl "{ \"status\": \"ok\" }" 0    run my_api_function    [ "$status" -eq 0 ]}
```
```
#!/usr/bin/env batssetup() {    # Create stub directory    STUBS_DIR="$TMPDIR/stubs"    mkdir -p "$STUBS_DIR"    # Add to PATH    export PATH="$STUBS_DIR:$PATH"}create_stub() {    local cmd="$1"    local output="$2"    local code="${3:-0}"    cat > "$STUBS_DIR/$cmd" <<EOF#!/bin/bashecho "$output"exit $codeEOF    chmod +x "$STUBS_DIR/$cmd"}@test "Function works with stubbed curl" {    create_stub curl "{ \"status\": \"ok\" }" 0    run my_api_function    [ "$status" -eq 0 ]}
```
```
#!/usr/bin/env bats@test "Function handles environment override" {    export MY_SETTING="override_value"    run my_function    [ "$status" -eq 0 ]    [[ "$output" == *"override_value"* ]]}@test "Function uses default when var unset" {    unset MY_SETTING    run my_function    [ "$status" -eq 0 ]    [[ "$output" == *"default"* ]]}
```
```
#!/usr/bin/env bats@test "Function handles environment override" {    export MY_SETTING="override_value"    run my_function    [ "$status" -eq 0 ]    [[ "$output" == *"override_value"* ]]}@test "Function uses default when var unset" {    unset MY_SETTING    run my_function    [ "$status" -eq 0 ]    [[ "$output" == *"default"* ]]}
```
```
#!/usr/bin/env bats# Fixture directory: tests/fixtures/setup() {    FIXTURES_DIR="${BATS_TEST_DIRNAME}/fixtures"    WORK_DIR=$(mktemp -d)    export WORK_DIR}teardown() {    rm -rf "$WORK_DIR"}@test "Process fixture file" {    # Copy fixture to work directory    cp "$FIXTURES_DIR/input.txt" "$WORK_DIR/input.txt"    # Run function    run my_process_function "$WORK_DIR/input.txt"    # Compare output    diff "$WORK_DIR/output.txt" "$FIXTURES_DIR/expected_output.txt"}
```
```
#!/usr/bin/env bats# Fixture directory: tests/fixtures/setup() {    FIXTURES_DIR="${BATS_TEST_DIRNAME}/fixtures"    WORK_DIR=$(mktemp -d)    export WORK_DIR}teardown() {    rm -rf "$WORK_DIR"}@test "Process fixture file" {    # Copy fixture to work directory    cp "$FIXTURES_DIR/input.txt" "$WORK_DIR/input.txt"    # Run function    run my_process_function "$WORK_DIR/input.txt"    # Compare output    diff "$WORK_DIR/output.txt" "$FIXTURES_DIR/expected_output.txt"}
```
```
#!/usr/bin/env batsgenerate_fixture() {    local lines="$1"    local file="$2"    for i in $(seq 1 "$lines"); do        echo "Line $i content" >> "$file"    done}@test "Handle large input file" {    generate_fixture 1000 "$TMPDIR/large.txt"    run my_function "$TMPDIR/large.txt"    [ "$status" -eq 0 ]    [ "$(wc -l < "$TMPDIR/large.txt")" -eq 1000 ]}
```
```
#!/usr/bin/env batsgenerate_fixture() {    local lines="$1"    local file="$2"    for i in $(seq 1 "$lines"); do        echo "Line $i content" >> "$file"    done}@test "Handle large input file" {    generate_fixture 1000 "$TMPDIR/large.txt"    run my_function "$TMPDIR/large.txt"    [ "$status" -eq 0 ]    [ "$(wc -l < "$TMPDIR/large.txt")" -eq 1000 ]}
```
```
#!/usr/bin/env bats@test "Function fails with missing file" {    run my_function "/nonexistent/file.txt"    [ "$status" -ne 0 ]    [[ "$output" == *"not found"* ]]}@test "Function fails with invalid input" {    run my_function ""    [ "$status" -ne 0 ]}@test "Function fails with permission denied" {    touch "$TMPDIR/readonly.txt"    chmod 000 "$TMPDIR/readonly.txt"    run my_function "$TMPDIR/readonly.txt"    [ "$status" -ne 0 ]    chmod 644 "$TMPDIR/readonly.txt"  # Cleanup}@test "Function provides helpful error message" {    run my_function --invalid-option    [ "$status" -ne 0 ]    [[ "$output" == *"Usage:"* ]]}
```
```
#!/usr/bin/env bats@test "Function fails with missing file" {    run my_function "/nonexistent/file.txt"    [ "$status" -ne 0 ]    [[ "$output" == *"not found"* ]]}@test "Function fails with invalid input" {    run my_function ""    [ "$status" -ne 0 ]}@test "Function fails with permission denied" {    touch "$TMPDIR/readonly.txt"    chmod 000 "$TMPDIR/readonly.txt"    run my_function "$TMPDIR/readonly.txt"    [ "$status" -ne 0 ]    chmod 644 "$TMPDIR/readonly.txt"  # Cleanup}@test "Function provides helpful error message" {    run my_function --invalid-option    [ "$status" -ne 0 ]    [[ "$output" == *"Usage:"* ]]}
```
```
#!/usr/bin/env batssetup() {    # Check for required tools    if ! command -v jq &>/dev/null; then        skip "jq is not installed"    fi    export SCRIPT="${BATS_TEST_DIRNAME}/../bin/script.sh"}@test "JSON parsing works" {    skip_if ! command -v jq &>/dev/null    run my_json_parser '{"key": "value"}'    [ "$status" -eq 0 ]}
```
```
#!/usr/bin/env batssetup() {    # Check for required tools    if ! command -v jq &>/dev/null; then        skip "jq is not installed"    fi    export SCRIPT="${BATS_TEST_DIRNAME}/../bin/script.sh"}@test "JSON parsing works" {    skip_if ! command -v jq &>/dev/null    run my_json_parser '{"key": "value"}'    [ "$status" -eq 0 ]}
```
```
#!/usr/bin/env bats@test "Script works in bash" {    bash "${BATS_TEST_DIRNAME}/../bin/script.sh" arg1}@test "Script works in sh (POSIX)" {    sh "${BATS_TEST_DIRNAME}/../bin/script.sh" arg1}@test "Script works in dash" {    if command -v dash &>/dev/null; then        dash "${BATS_TEST_DIRNAME}/../bin/script.sh" arg1    else        skip "dash not installed"    fi}
```
```
#!/usr/bin/env bats@test "Script works in bash" {    bash "${BATS_TEST_DIRNAME}/../bin/script.sh" arg1}@test "Script works in sh (POSIX)" {    sh "${BATS_TEST_DIRNAME}/../bin/script.sh" arg1}@test "Script works in dash" {    if command -v dash &>/dev/null; then        dash "${BATS_TEST_DIRNAME}/../bin/script.sh" arg1    else        skip "dash not installed"    fi}
```
```
#!/usr/bin/env bats@test "Multiple independent operations" {    run bash -c 'for i in {1..10}; do        my_operation "$i" &    done    wait'    [ "$status" -eq 0 ]}@test "Concurrent file operations" {    for i in {1..5}; do        my_function "$TMPDIR/file$i" &    done    wait    [ -f "$TMPDIR/file1" ]    [ -f "$TMPDIR/file5" ]}
```
```
#!/usr/bin/env bats@test "Multiple independent operations" {    run bash -c 'for i in {1..10}; do        my_operation "$i" &    done    wait'    [ "$status" -eq 0 ]}@test "Concurrent file operations" {    for i in {1..5}; do        my_function "$TMPDIR/file$i" &    done    wait    [ -f "$TMPDIR/file1" ]    [ -f "$TMPDIR/file5" ]}
```
```
#!/usr/bin/env bash# Source script under testexport SCRIPT_DIR="${BATS_TEST_DIRNAME%/*}/bin"# Common test utilitiesassert_file_exists() {    if [ ! -f "$1" ]; then        echo "Expected file to exist: $1"        return 1    fi}assert_file_equals() {    local file="$1"    local expected="$2"    if [ ! -f "$file" ]; then        echo "File does not exist: $file"        return 1    fi    local actual=$(cat "$file")    if [ "$actual" != "$expected" ]; then        echo "File contents do not match"        echo "Expected: $expected"        echo "Actual: $actual"        return 1    fi}# Create temporary test directorysetup_test_dir() {    export TEST_DIR=$(mktemp -d)}cleanup_test_dir() {    rm -rf "$TEST_DIR"}
```
```
#!/usr/bin/env bash# Source script under testexport SCRIPT_DIR="${BATS_TEST_DIRNAME%/*}/bin"# Common test utilitiesassert_file_exists() {    if [ ! -f "$1" ]; then        echo "Expected file to exist: $1"        return 1    fi}assert_file_equals() {    local file="$1"    local expected="$2"    if [ ! -f "$file" ]; then        echo "File does not exist: $file"        return 1    fi    local actual=$(cat "$file")    if [ "$actual" != "$expected" ]; then        echo "File contents do not match"        echo "Expected: $expected"        echo "Actual: $actual"        return 1    fi}# Create temporary test directorysetup_test_dir() {    export TEST_DIR=$(mktemp -d)}cleanup_test_dir() {    rm -rf "$TEST_DIR"}
```
```
name: Testson: [push, pull_request]jobs:  test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v3      - name: Install Bats        run: |          npm install --global bats      - name: Run Tests        run: |          bats tests/*.bats      - name: Run Tests with Tap Reporter        run: |          bats tests/*.bats --tap | tee test_output.tap
```
```
name: Testson: [push, pull_request]jobs:  test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v3      - name: Install Bats        run: |          npm install --global bats      - name: Run Tests        run: |          bats tests/*.bats      - name: Run Tests with Tap Reporter        run: |          bats tests/*.bats --tap | tee test_output.tap
```
```
.PHONY: test test-verbose test-taptest:	bats tests/*.batstest-verbose:	bats tests/*.bats --verbosetest-tap:	bats tests/*.bats --taptest-parallel:	bats tests/*.bats --parallel 4coverage: test	# Optional: Generate coverage reports
```
```
.PHONY: test test-verbose test-taptest:	bats tests/*.batstest-verbose:	bats tests/*.bats --verbosetest-tap:	bats tests/*.bats --taptest-parallel:	bats tests/*.bats --parallel 4coverage: test	# Optional: Generate coverage reports
```
Elevate the reliability of your shell scripts from simple utilities to complex CI/CD pipelines with this comprehensive Bats Testing Patterns skill. It provides the essential knowledge to implement robust unit tests, embrace test-driven development (TDD) for shell scripting, and ensure your automation is rock-solid. Learn how to craft maintainable test suites, handle edge cases, and integrate automated testing seamlessly into your development workflow, making your scripts more resilient and trustworthy across various environments. This skill is your blueprint for achieving production-grade quality in all your Bash-driven projects.

# When to Use This Skill
- •Developing a new shell script and wanting to ensure its correctness from the start using TDD.
- •Refactoring an existing, complex shell script and needing a safety net of tests to prevent regressions.
- •Setting up automated quality checks for shell scripts within a CI/CD pipeline to guarantee reliability before deployment.
- •Validating the behavior of shell utilities across different Bash versions or Linux distributions.

# Pro Tips
- 💡Always use `setup` and `teardown` functions in Bats to create a clean environment for each test, ensuring test isolation and preventing side effects.
- 💡Structure your Bats test files to mirror your script's modularity; one test file per script or logical component simplifies maintenance and debugging.
- 💡Leverage Bats' `run` command to capture stdout, stderr, and exit codes, then use `assert_success`, `assert_failure`, `assert_output`, and `assert_line` for precise assertions.

