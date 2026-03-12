# codeql
Source: https://antigravity.codes/agent-skills/security/codeql

## AI Worker Instructions
When the user requests functionality related to codeql, follow these guidelines and utilize this context.

## Scraped Content

# codeql
```
codeql database create codeql.db --language=cpp --command='make -j8'
```
```
codeql database create codeql.db --language=go
```
```
codeql database create codeql.db --language=java
```
```
codeql database create codeql.db --language=javascript
```
```
codeql database create codeql.db --language=python
```
```
codeql database analyze codeql.db --format=sarif-latest --output=results.sarif -- codeql/cpp-queries
```
```
codeql resolve qlpacks
```
```
codeql pack download trailofbits/cpp-queries
```
```
codeql query run --database codeql.db -- path/to/Query.ql
```
```
codeql test run -- path/to/test/pack/
```
```
codeql
```
```
brew install --cask codeql
```
```
brew install --cask codeql
```
```
brew upgrade codeql
```
```
brew upgrade codeql
```
```
codeql --version
```
```
codeql --version
```
```
make clean
```
```
go clean
```
```
codeql database create codeql.db --language=cpp --command='make -j8'
```
```
codeql database create codeql.db --language=cpp --command='make -j8'
```
```
--source-root
```
```
codeql database create codeql.db --language=cpp --source-root=/path/to/source --command='cmake --build build'
```
```
codeql database create codeql.db --language=cpp --source-root=/path/to/source --command='cmake --build build'
```
```
codeql database create codeql.db --language=python
```
```
codeql database create codeql.db --language=python
```
```
codeql database create codeql.db --language=go
```
```
codeql database create codeql.db --language=go
```
```
--command
```
```
codeql database analyze codeql.db --format=sarif-latest --output=results.sarif -- codeql/cpp-queries
```
```
codeql database analyze codeql.db --format=sarif-latest --output=results.sarif -- codeql/cpp-queries
```
```
codeql pack download trailofbits/cpp-queries trailofbits/go-queries
```
```
codeql pack download trailofbits/cpp-queries trailofbits/go-queries
```
```
import cppfrom FunctionCall callwhere call.getTarget().getName() = "memcpy"select call.getLocation(), call.getArgument(0)
```
```
import cppfrom FunctionCall callwhere call.getTarget().getName() = "memcpy"select call.getLocation(), call.getArgument(0)
```
```
memcpy
```
```
import cppclass MemcpyCall extends FunctionCall {  MemcpyCall() {    this.getTarget().getName() = "memcpy"  }  Expr getDestination() {    result = this.getArgument(0)  }  Expr getSource() {    result = this.getArgument(1)  }  Expr getSize() {    result = this.getArgument(2)  }}from MemcpyCall callselect call.getLocation(), call.getDestination()
```
```
import cppclass MemcpyCall extends FunctionCall {  MemcpyCall() {    this.getTarget().getName() = "memcpy"  }  Expr getDestination() {    result = this.getArgument(0)  }  Expr getSource() {    result = this.getArgument(1)  }  Expr getSize() {    result = this.getArgument(2)  }}from MemcpyCall callselect call.getLocation(), call.getDestination()
```
```
from Type x where P(x) select f(x)
```
```
from FunctionCall call where call.getTarget().getName() = "memcpy" select call
```
```
exists(...)
```
```
exists(FunctionCall call \| call.getTarget() = fun)
```
```
forall(...)
```
```
forall(Expr e \| e = arg.getAChild() \| e.isConstant())
```
```
+
```
```
start.getASuccessor+()
```
```
*
```
```
start.getASuccessor*()
```
```
result
```
```
result = this.getArgument(0)
```
```
import cpp/** * @name Unhandled error return value * @id custom/unhandled-error * @description Function calls that return error codes that are not checked * @kind problem * @problem.severity warning * @precision medium */predicate isErrorReturningFunction(Function f) {  f.getName().matches("%error%") or  f.getName().matches("%Error%")}from FunctionCall callwhere  isErrorReturningFunction(call.getTarget()) and  not exists(Expr parent |    parent = call.getParent*() and    (parent instanceof IfStmt or parent instanceof SwitchStmt)  )select call, "Error return value not checked"
```
```
import cpp/** * @name Unhandled error return value * @id custom/unhandled-error * @description Function calls that return error codes that are not checked * @kind problem * @problem.severity warning * @precision medium */predicate isErrorReturningFunction(Function f) {  f.getName().matches("%error%") or  f.getName().matches("%Error%")}from FunctionCall callwhere  isErrorReturningFunction(call.getTarget()) and  not exists(Expr parent |    parent = call.getParent*() and    (parent instanceof IfStmt or parent instanceof SwitchStmt)  )select call, "Error return value not checked"
```
```
/** * @name Short name for the issue * @id scope/query-name * @description Longer description of the issue * @kind problem * @tags security external/cwe/cwe-123 * @problem.severity error * @precision high */
```
```
/** * @name Short name for the issue * @id scope/query-name * @description Longer description of the issue * @kind problem * @tags security external/cwe/cwe-123 * @problem.severity error * @precision high */
```
```
name
```
```
id
```
```
/
```
```
-
```
```
description
```
```
kind
```
```
problem
```
```
path-problem
```
```
problem.severity
```
```
error
```
```
warning
```
```
recommendation
```
```
precision
```
```
low
```
```
medium
```
```
high
```
```
very-high
```
```
problem
```
```
(Location, string)
```
```
path-problem
```
```
(DataFlow::Node, DataFlow::PathNode, DataFlow::PathNode, string)
```
```
qlpack.yml
```
```
name: scope/name-testversion: 0.0.1dependencies:  codeql-query-pack-to-test: "*"extractor: cpp
```
```
name: scope/name-testversion: 0.0.1dependencies:  codeql-query-pack-to-test: "*"extractor: cpp
```
```
MemcpyCall/
```
```
test.c
```
```
MemcpyCall.qlref
```
```
MemcpyCall.expected
```
```
codeql test run -- path/to/test/pack/
```
```
codeql test run -- path/to/test/pack/
```
```
MemcpyCall.expected
```
```
MemcpyCall.actual
```
```
MemcpyCall.expected
```
```
codeql pack init <scope>/<name>
```
```
codeql pack init <scope>/<name>
```
```
qlpack.yml
```
```
---library: falsewarnOnImplicitThis: falsename: <scope>/<name>version: 0.0.1
```
```
---library: falsewarnOnImplicitThis: falsename: <scope>/<name>version: 0.0.1
```
```
codeql pack add codeql/cpp-all
```
```
codeql pack add codeql/cpp-all
```
```
codeql-workspace.yml
```
```
codeql pack install
```
```
codeql pack install
```
```
~/.config/codeql/config
```
```
--search-path /full/path/to/your/codeql/root/directory
```
```
--search-path /full/path/to/your/codeql/root/directory
```
```
.├── codeql-workspace.yml├── cpp│   ├── lib│   │   ├── qlpack.yml│   │   └── scope│   │       └── security│   │           └── someLibrary.qll│   ├── src│   │   ├── qlpack.yml│   │   ├── suites│   │   │   ├── scope-cpp-code-scanning.qls│   │   │   └── scope-cpp-security.qls│   │   └── security│   │       └── AppSecAnalysis│   │           ├── AppSecAnalysis.c│   │           ├── AppSecAnalysis.qhelp│   │           └── AppSecAnalysis.ql│   └── test│       ├── qlpack.yml│       └── query-tests│           └── security│               └── AppSecAnalysis│                   ├── AppSecAnalysis.c│                   ├── AppSecAnalysis.expected│                   └── AppSecAnalysis.qlref
```
```
.├── codeql-workspace.yml├── cpp│   ├── lib│   │   ├── qlpack.yml│   │   └── scope│   │       └── security│   │           └── someLibrary.qll│   ├── src│   │   ├── qlpack.yml│   │   ├── suites│   │   │   ├── scope-cpp-code-scanning.qls│   │   │   └── scope-cpp-security.qls│   │   └── security│   │       └── AppSecAnalysis│   │           ├── AppSecAnalysis.c│   │           ├── AppSecAnalysis.qhelp│   │           └── AppSecAnalysis.ql│   └── test│       ├── qlpack.yml│       └── query-tests│           └── security│               └── AppSecAnalysis│                   ├── AppSecAnalysis.c│                   ├── AppSecAnalysis.expected│                   └── AppSecAnalysis.qlref
```
```
predicate isReachableFrom(BasicBlock start, BasicBlock end) {  start = end or isReachableFrom(start.getASuccessor(), end)}
```
```
predicate isReachableFrom(BasicBlock start, BasicBlock end) {  start = end or isReachableFrom(start.getASuccessor(), end)}
```
```
predicate isReachableFrom(BasicBlock start, BasicBlock end) {  end = start.getASuccessor*()}
```
```
predicate isReachableFrom(BasicBlock start, BasicBlock end) {  end = start.getASuccessor*()}
```
```
*
```
```
+
```
```
name: "CodeQL"on:  push:    branches: [ "main" ]  pull_request:    branches: [ "main" ]  schedule:    - cron: '34 10 * * 6'jobs:  analyze:    name: Analyze    runs-on: ${{ (matrix.language == 'swift' && 'macos-latest') || 'ubuntu-latest' }}    timeout-minutes: ${{ (matrix.language == 'swift' && 120) || 360 }}    permissions:      actions: read      contents: read      security-events: write    strategy:      fail-fast: false      matrix:        language: [ 'cpp' ]    steps:    - name: Checkout repository      uses: actions/checkout@v4    - name: Initialize CodeQL      uses: github/codeql-action/init@v3      with:        languages: ${{ matrix.language }}    - name: Autobuild      uses: github/codeql-action/autobuild@v3    - name: Perform CodeQL Analysis      uses: github/codeql-action/analyze@v3      with:        category: "/language:${{matrix.language}}"
```
```
name: "CodeQL"on:  push:    branches: [ "main" ]  pull_request:    branches: [ "main" ]  schedule:    - cron: '34 10 * * 6'jobs:  analyze:    name: Analyze    runs-on: ${{ (matrix.language == 'swift' && 'macos-latest') || 'ubuntu-latest' }}    timeout-minutes: ${{ (matrix.language == 'swift' && 120) || 360 }}    permissions:      actions: read      contents: read      security-events: write    strategy:      fail-fast: false      matrix:        language: [ 'cpp' ]    steps:    - name: Checkout repository      uses: actions/checkout@v4    - name: Initialize CodeQL      uses: github/codeql-action/init@v3      with:        languages: ${{ matrix.language }}    - name: Autobuild      uses: github/codeql-action/autobuild@v3    - name: Perform CodeQL Analysis      uses: github/codeql-action/analyze@v3      with:        category: "/language:${{matrix.language}}"
```
```
```
```
```
```
- uses: github/codeql-action/init@v3  with:    queries: security-extended,security-and-quality    packs: trailofbits/cpp-queries
```
```
- uses: github/codeql-action/init@v3  with:    queries: security-extended,security-and-quality    packs: trailofbits/cpp-queries
```
```
- uses: github/codeql-action/init@v3  with:    queries: ./codeql/UnhandledError.ql    packs: trailofbits/cpp-queries
```
```
- uses: github/codeql-action/init@v3  with:    queries: ./codeql/UnhandledError.ql    packs: trailofbits/cpp-queries
```
```
.
```
```
qlpack.yml
```
```
name: Test CodeQL querieson: [push, pull_request]jobs:  codeql-test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - id: init        uses: github/codeql-action/init@v3      - uses: actions/cache@v4        with:          path: ~/.codeql          key: ${{ runner.os }}-${{ runner.arch }}-${{ steps.init.outputs.codeql-version }}      - name: Run tests        run: |          ${{ steps.init.outputs.codeql-path }} test run ./path/to/query/tests/
```
```
name: Test CodeQL querieson: [push, pull_request]jobs:  codeql-test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - id: init        uses: github/codeql-action/init@v3      - uses: actions/cache@v4        with:          path: ~/.codeql          key: ${{ runner.os }}-${{ runner.arch }}-${{ steps.init.outputs.codeql-version }}      - name: Run tests        run: |          ${{ steps.init.outputs.codeql-path }} test run ./path/to/query/tests/
```
```
make clean
```
```
codeql-workspace.yml
```
The CodeQL agent skill empowers AI coding assistants to leverage one of the most sophisticated static analysis frameworks available. Designed for developers and security researchers tackling complex codebases, CodeQL excels at uncovering deep-seated vulnerabilities and architectural flaws that simpler pattern matching might miss. While it presents a steep learning curve, integrating CodeQL through an AI agent streamlines its application, making its powerful interprocedural control and data flow analysis capabilities more accessible for proactive bug detection and robust security posture enhancement across a project's entire lifecycle.

# When to Use This Skill
- •Performing deep security audits to uncover subtle data flow vulnerabilities across an entire application.
- •Enforcing coding standards and preventing the re-introduction of known bug patterns in large, evolving codebases.
- •Analyzing complex dependencies and library usage for potential security risks or performance bottlenecks.
- •Refactoring critical modules and ensuring no new vulnerabilities are introduced during the process.

# Pro Tips
- 💡Leverage the agent to help generate initial CodeQL queries. Describe the vulnerability pattern or code structure you're looking for, and let the AI draft a starting point.
- 💡For compiled languages, ensure your build process is robust and reproducible; CodeQL's effectiveness hinges on a correctly generated database.
- 💡Integrate CodeQL scans into your CI/CD pipeline using the agent to automate early detection of new vulnerabilities introduced in pull requests.

