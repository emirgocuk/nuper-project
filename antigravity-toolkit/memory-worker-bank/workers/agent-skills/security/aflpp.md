# aflpp
Source: https://antigravity.codes/agent-skills/security/aflpp

## AI Worker Instructions
When the user requests functionality related to aflpp, follow these guidelines and utilize this context.

## Scraped Content

# aflpp
```
c++extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Call your code with fuzzer-provided data    check_buf((char*)data, size);    return 0;}Compile and run:bash# Setup AFL++ wrapper script first (see Installation)./afl++ docker afl-clang-fast++ -DNO_MAIN=1 -O2 -fsanitize=fuzzer harness.cc main.cc -o fuzzmkdir seeds && echo "aaaa" > seeds/minimal_seed./afl++ docker afl-fuzz -i seeds -o out -- ./fuzz## InstallationAFL++ has many dependencies including LLVM, Python, and Rust. We recommend using a current Debian or Ubuntu distribution for fuzzing with AFL++.| Method | When to Use | Supported Compilers ||--------|-------------|---------------------|| Ubuntu/Debian repos | Recent Ubuntu, basic features only | Ubuntu 23.10: Clang 14 & GCC 13<br>Debian 12: Clang 14 & GCC 12 || Docker (from Docker Hub) | Specific AFL++ version, Apple Silicon support | As of 4.35c: Clang 19 & GCC 11 || Docker (from source) | Test unreleased features, apply patches | Configurable in Dockerfile || From source | Avoid Docker, need specific patches | Adjustable via LLVM_CONFIG env var |### Ubuntu/DebianPrior to installing afl++, check the clang version dependency of the packge with apt-cache show afl++, and install the matching lld version (e.g., lld-17).bashapt install afl++ lld-17### Docker (from Docker Hub)bashdocker pull aflplusplus/aflplusplus:stable### Docker (from source)bashgit clone --depth 1 --branch stable https://github.com/AFLplusplus/AFLpluspluscd AFLplusplusdocker build -t aflplusplus .### From sourceRefer to the [Dockerfile](https://github.com/AFLplusplus/AFLplusplus/blob/stable/Dockerfile) for Ubuntu version requirements and dependencies. Set LLVM_CONFIG to specify Clang version (e.g., llvm-config-18).### Wrapper Script SetupCreate a wrapper script to run AFL++ on host or Docker:bashcat <<'EOF' > ./afl++#!/bin/shAFL_VERSION="${AFL_VERSION:-"stable"}"case "$1" in   host)        shift        bash -c "$*"        ;;    docker)        shift        /usr/bin/env docker run -ti \            --privileged \            -v ./:/src \            --rm \            --name afl_fuzzing \            "aflplusplus/aflplusplus:$AFL_VERSION" \            bash -c "cd /src && bash -c \"$*\""        ;;    *)        echo "Usage: $0 {host|docker}"        exit 1        ;;esacEOFchmod +x ./afl++**Security Warning:** The afl-system-config and afl-persistent-config scripts require root privileges and disable OS security features. Do not fuzz on production systems or your development environment. Use a dedicated VM instead.### System ConfigurationRun after each reboot for up to 15% more executions per second:bash./afl++ <host/docker> afl-system-configFor maximum performance, disable kernel security mitigations (requires grub bootloader, not supported in Docker):bash./afl++ host afl-persistent-configupdate-grubreboot./afl++ <host/docker> afl-system-configVerify with cat /proc/cmdline - output should include mitigations=off.## Writing a Harness### Harness StructureAFL++ supports libFuzzer-style harnesses:c++#include <stdint.h>#include <stddef.h>extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // 1. Validate input size if needed    if (size < MIN_SIZE || size > MAX_SIZE) return 0;    // 2. Call target function with fuzz data    target_function(data, size);    // 3. Return 0 (non-zero reserved for future use)    return 0;}### Harness Rules| Do | Don't ||----|-------|| Reset global state between runs | Rely on state from previous runs || Handle edge cases gracefully | Exit on invalid input || Keep harness deterministic | Use random number generators || Free allocated memory | Create memory leaks || Validate input sizes | Process unbounded input |> **See Also:** For detailed harness writing techniques, patterns for handling complex inputs,> and advanced strategies, see the **fuzz-harness-writing** technique skill.## CompilationAFL++ offers multiple compilation modes with different trade-offs.### Compilation Mode Decision TreeChoose your compilation mode:- **LTO mode** (afl-clang-lto): Best performance and instrumentation. Try this first.- **LLVM mode** (afl-clang-fast): Fall back if LTO fails to compile.- **GCC plugin** (afl-gcc-fast): For projects requiring GCC.### Basic Compilation (LLVM mode)bash./afl++ <host/docker> afl-clang-fast++ -DNO_MAIN=1 -O2 -fsanitize=fuzzer harness.cc main.cc -o fuzz### GCC Compilationbash./afl++ <host/docker> afl-g++-fast -DNO_MAIN=1 -O2 -fsanitize=fuzzer harness.cc main.cc -o fuzz**Important:** GCC version must match the version used to compile the AFL++ GCC plugin.### With Sanitizersbash./afl++ <host/docker> AFL_USE_ASAN=1 afl-clang-fast++ -DNO_MAIN=1 -O2 -fsanitize=fuzzer harness.cc main.cc -o fuzz> **See Also:** For detailed sanitizer configuration, common issues, and advanced flags,> see the **address-sanitizer** and **undefined-behavior-sanitizer** technique skills.### Build FlagsNote that -g is not necessary, it is added by default by the AFL++ compilers.| Flag | Purpose ||------|---------|| -DNO_MAIN=1 | Skip main function when using libFuzzer harness || -O2 | Production optimization level (recommended for fuzzing) || -fsanitize=fuzzer | Enable libFuzzer compatibility mode and adds the fuzzer runtime when linking executable || -fsanitize=fuzzer-no-link | Instrument without linking fuzzer runtime (for static libraries and object files) |## Corpus Management### Creating Initial CorpusAFL++ requires at least one non-empty seed file:bashmkdir seedsecho "aaaa" > seeds/minimal_seedFor real projects, gather representative inputs:- Download example files for the format you're fuzzing- Extract test cases from the project's test suite- Use minimal valid inputs for your file format### Corpus MinimizationAfter a campaign, minimize the corpus to keep only unique coverage:bash./afl++ <host/docker> afl-cmin -i out/default/queue -o minimized_corpus -- ./fuzz> **See Also:** For corpus creation strategies, dictionaries, and seed selection,> see the **fuzzing-corpus** technique skill.## Running Campaigns### Basic Runbash./afl++ <host/docker> afl-fuzz -i seeds -o out -- ./fuzz### Setting Environment Variablesbash./afl++ <host/docker> AFL_FAST_CAL=1 afl-fuzz -i seeds -o out -- ./fuzz### Interpreting OutputThe AFL++ UI shows real-time fuzzing statistics:| Output | Meaning ||--------|---------|| **execs/sec** | Execution speed - higher is better || **cycles done** | Number of queue passes completed || **corpus count** | Number of unique test cases in queue || **saved crashes** | Number of unique crashes found || **stability** | % of stable edges (should be near 100%) |### Output Directory Structuretextout/default/├── cmdline          # How was the SUT invoked?├── crashes/         # Inputs that crash the SUT│   └── id:000000,sig:06,src:000002,time:286,execs:13105,op:havoc,rep:4├── hangs/           # Inputs that hang the SUT├── queue/           # Test cases reproducing final fuzzer state│   ├── id:000000,time:0,execs:0,orig:minimal_seed│   └── id:000001,src:000000,time:0,execs:8,op:havoc,rep:6,+cov├── fuzzer_stats     # Campaign statistics└── plot_data        # Data for plotting### Analyzing ResultsView live campaign statistics:bash./afl++ <host/docker> afl-whatsup outCreate coverage plots:bashapt install gnuplot./afl++ <host/docker> afl-plot out/default out_graph/### Re-executing Test Casesbash./afl++ <host/docker> ./fuzz out/default/crashes/<test_case>### Fuzzer Options| Option | Purpose ||--------|---------|| -G 4000 | Maximum test input length (default: 1048576 bytes) || -t 1000 | Timeout in milliseconds for each test case (default: 1000ms) || -m 1000 | Memory limit in megabytes (default: 0 = unlimited) || -x ./dict.dict | Use dictionary file to guide mutations |## Multi-Core FuzzingAFL++ excels at multi-core fuzzing with two major advantages:1. More executions per second (scales linearly with physical cores)2. Asymmetrical fuzzing (e.g., one ASan job, rest without sanitizers)### Starting a CampaignStart the primary fuzzer (in background):bash./afl++ <host/docker> afl-fuzz -M primary -i seeds -o state -- ./fuzz 1>primary.log 2>primary.error &Start secondary fuzzers (as many as you have cores):bash./afl++ <host/docker> afl-fuzz -S secondary01 -i seeds -o state -- ./fuzz 1>secondary01.log 2>secondary01.error &./afl++ <host/docker> afl-fuzz -S secondary02 -i seeds -o state -- ./fuzz 1>secondary02.log 2>secondary02.error &### Monitoring Multi-Core CampaignsList all running jobs:bashjobsView live statistics (updates every second):bash./afl++ <host/docker> watch -n1 --color afl-whatsup state/### Stopping All Fuzzersbashkill $(jobs -p)## Coverage AnalysisAFL++ automatically tracks coverage through edge instrumentation. Coverage information is stored in fuzzer_stats and plot_data.### Measuring CoverageUse afl-plot to visualize coverage over time:bash./afl++ <host/docker> afl-plot out/default out_graph/### Improving Coverage- Use dictionaries for format-aware fuzzing- Run longer campaigns (cycles_wo_finds indicates plateau)- Try different mutation strategies with multi-core fuzzing- Analyze coverage gaps and add targeted seed inputs> **See Also:** For detailed coverage analysis techniques, identifying coverage gaps,> and systematic coverage improvement, see the **coverage-analysis** technique skill.## CMPLOGCMPLOG/RedQueen is the best path constraint solving mechanism available in any fuzzer.To enable it, the fuzz target needs to be instrumented for it.Before building the fuzzing target set the environment variable:bash./afl++ <host/docker> AFL_LLVM_CMPLOG=1 makeNo special action is needed for compiling and linking the harness.To run a fuzzer instance with a CMPLOG instrumented fuzzing target, add -c0 to the command like arguments:bash./afl++ <host/docker> afl-fuzz -c0 -S cmplog -i seeds -o state -- ./fuzz 1>secondary02.log 2>secondary02.error &## Sanitizer IntegrationSanitizers are essential for finding memory corruption bugs that don't cause immediate crashes.### AddressSanitizer (ASan)bash./afl++ <host/docker> AFL_USE_ASAN=1 afl-clang-fast++ -DNO_MAIN=1 -O2 -fsanitize=fuzzer harness.cc main.cc -o fuzz**Note:** Memory limit (-m) is not supported with ASan due to 20TB virtual memory reservation.### UndefinedBehaviorSanitizer (UBSan)bash./afl++ <host/docker> AFL_USE_UBSAN=1 afl-clang-fast++ -DNO_MAIN=1 -O2 -fsanitize=fuzzer,undefined harness.cc main.cc -o fuzz### Common Sanitizer Issues| Issue | Solution ||-------|----------|| ASan slows fuzzing | Use only 1 ASan job in multi-core setup || Stack exhaustion | Increase stack with ASAN_OPTIONS=stack_size=... || GCC version mismatch | Ensure system GCC matches AFL++ plugin version |> **See Also:** For comprehensive sanitizer configuration and troubleshooting,> see the **address-sanitizer** technique skill.## Advanced Usage### Tips and Tricks| Tip | Why It Helps ||-----|--------------|| Use LLVMFuzzerTestOneInput harnesses where possible | If a fuzzing campaign has at least 85% stability then this is the most efficient fuzzing style. If not then try standard input or file input fuzzing || Use dictionaries | Helps fuzzer discover format-specific keywords and magic bytes || Set realistic timeouts | Prevents false positives from system load || Limit input size | Larger inputs don't necessarily explore more space || Monitor stability | Low stability indicates non-deterministic behavior |### Standard Input FuzzingAFL++ can fuzz programs reading from stdin without a libFuzzer harness:bash./afl++ <host/docker> afl-clang-fast++ -O2 main_stdin.c -o fuzz_stdin./afl++ <host/docker> afl-fuzz -i seeds -o out -- ./fuzz_stdinThis is slower than persistent mode but requires no harness code.### File Input FuzzingFor programs that read files, use @@ placeholder:bash./afl++ <host/docker> afl-clang-fast++ -O2 main_file.c -o fuzz_file./afl++ <host/docker> afl-fuzz -i seeds -o out -- ./fuzz_file @@For better performance, use fmemopen to create file descriptors from memory.### Argument FuzzingFuzz command-line arguments using argv-fuzz-inl.h:c++#include <stdio.h>#include <stdlib.h>#include <string.h>#ifdef __AFL_COMPILER#include "argv-fuzz-inl.h"#endifvoid check_buf(char *buf, size_t buf_len) {    if(buf_len > 0 && buf[0] == 'a') {        if(buf_len > 1 && buf[1] == 'b') {            if(buf_len > 2 && buf[2] == 'c') {                abort();            }        }    }}int main(int argc, char *argv[]) {#ifdef __AFL_COMPILER    AFL_INIT_ARGV();#endif    if (argc < 2) {        fprintf(stderr, "Usage: %s <input_string>\n", argv[0]);        return 1;    }    char *input_buf = argv[1];    size_t len = strlen(input_buf);    check_buf(input_buf, len);    return 0;}Download the header:bashcurl -O https://raw.githubusercontent.com/AFLplusplus/AFLplusplus/stable/utils/argv_fuzzing/argv-fuzz-inl.hCompile and run:bash./afl++ <host/docker> afl-clang-fast++ -O2 main_arg.c -o fuzz_arg./afl++ <host/docker> afl-fuzz -i seeds -o out -- ./fuzz_arg### Performance Tuning| Setting | Impact ||---------|--------|| CPU core count | Linear scaling with physical cores || Persistent mode | 10-20x faster than fork server || -G input size limit | Smaller = faster, but may miss bugs || ASan ratio | 1 ASan job per 4-8 non-ASan jobs |## Real-World Examples### Example: libpngFuzzing libpng demonstrates fuzzing a C project with static libraries:bash# Get sourcecurl -L -O https://downloads.sourceforge.net/project/libpng/libpng16/1.6.37/libpng-1.6.37.tar.xztar xf libpng-1.6.37.tar.xzcd libpng-1.6.37/# Install dependenciesapt install zlib1g-dev# Configure and build static libraryexport CC=afl-clang-fast CFLAGS=-fsanitize=fuzzer-no-linkexport CXX=afl-clang-fast++ CXXFLAGS="$CFLAGS"./configure --enable-shared=noexport AFL_LLVM_CMPLOG=1export AFL_USE_ASAN=1make# Download harnesscurl -O https://raw.githubusercontent.com/glennrp/libpng/f8e5fa92b0e37ab597616f554bee254157998227/contrib/oss-fuzz/libpng_read_fuzzer.cc# Link fuzzerexport AFL_USE_ASAN=1$CXX -fsanitize=fuzzer libpng_read_fuzzer.cc .libs/libpng16.a -lz -o fuzz# Prepare seeds and dictionarymkdir seeds/curl -o seeds/input.png https://raw.githubusercontent.com/glennrp/libpng/acfd50ae0ba3198ad734e5d4dec2b05341e50924/contrib/pngsuite/iftp1n3p08.pngcurl -O https://raw.githubusercontent.com/glennrp/libpng/2fff013a6935967960a5ae626fc21432807933dd/contrib/oss-fuzz/png.dict# Start fuzzing./afl++ <host/docker> afl-fuzz -i seeds -o out -- ./fuzz### Example: CMake-based Projectcmakeproject(BuggyProgram)cmake_minimum_required(VERSION 3.0)add_executable(buggy_program main.cc)add_executable(fuzz main.cc harness.cc)target_compile_definitions(fuzz PRIVATE NO_MAIN=1)target_compile_options(fuzz PRIVATE -O2 -fsanitize=fuzzer-no-link)target_link_libraries(fuzz -fsanitize=fuzzer)Build and fuzz:bash# Build non-instrumented binary./afl++ <host/docker> cmake -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ ../afl++ <host/docker> cmake --build . --target buggy_program# Build fuzzer./afl++ <host/docker> cmake -DCMAKE_C_COMPILER=afl-clang-fast -DCMAKE_CXX_COMPILER=afl-clang-fast++ ../afl++ <host/docker> cmake --build . --target fuzz# Fuzz./afl++ <host/docker> afl-fuzz -i seeds -o out -- ./fuzz
```
```
Compile and run:
```
```
Compile and run:
```
```
## InstallationAFL++ has many dependencies including LLVM, Python, and Rust. We recommend using a current Debian or Ubuntu distribution for fuzzing with AFL++.| Method | When to Use | Supported Compilers ||--------|-------------|---------------------|| Ubuntu/Debian repos | Recent Ubuntu, basic features only | Ubuntu 23.10: Clang 14 & GCC 13<br>Debian 12: Clang 14 & GCC 12 || Docker (from Docker Hub) | Specific AFL++ version, Apple Silicon support | As of 4.35c: Clang 19 & GCC 11 || Docker (from source) | Test unreleased features, apply patches | Configurable in Dockerfile || From source | Avoid Docker, need specific patches | Adjustable via LLVM_CONFIG env var |### Ubuntu/DebianPrior to installing afl++, check the clang version dependency of the packge with apt-cache show afl++, and install the matching lld version (e.g., lld-17).
```
```
## InstallationAFL++ has many dependencies including LLVM, Python, and Rust. We recommend using a current Debian or Ubuntu distribution for fuzzing with AFL++.| Method | When to Use | Supported Compilers ||--------|-------------|---------------------|| Ubuntu/Debian repos | Recent Ubuntu, basic features only | Ubuntu 23.10: Clang 14 & GCC 13<br>Debian 12: Clang 14 & GCC 12 || Docker (from Docker Hub) | Specific AFL++ version, Apple Silicon support | As of 4.35c: Clang 19 & GCC 11 || Docker (from source) | Test unreleased features, apply patches | Configurable in Dockerfile || From source | Avoid Docker, need specific patches | Adjustable via
```
```
env var |### Ubuntu/DebianPrior to installing afl++, check the clang version dependency of the packge with
```
```
, and install the matching
```
```
version (e.g.,
```
```
).
```
```
### Docker (from Docker Hub)
```
```
### Docker (from Docker Hub)
```
```
### Docker (from source)
```
```
### Docker (from source)
```
```
### From sourceRefer to the [Dockerfile](https://github.com/AFLplusplus/AFLplusplus/blob/stable/Dockerfile) for Ubuntu version requirements and dependencies. Set LLVM_CONFIG to specify Clang version (e.g., llvm-config-18).### Wrapper Script SetupCreate a wrapper script to run AFL++ on host or Docker:
```
```
### From sourceRefer to the [Dockerfile](https://github.com/AFLplusplus/AFLplusplus/blob/stable/Dockerfile) for Ubuntu version requirements and dependencies. Set
```
```
to specify Clang version (e.g.,
```
```
).### Wrapper Script SetupCreate a wrapper script to run AFL++ on host or Docker:
```
```
**Security Warning:** The afl-system-config and afl-persistent-config scripts require root privileges and disable OS security features. Do not fuzz on production systems or your development environment. Use a dedicated VM instead.### System ConfigurationRun after each reboot for up to 15% more executions per second:
```
```
**Security Warning:** The
```
```
and
```
```
scripts require root privileges and disable OS security features. Do not fuzz on production systems or your development environment. Use a dedicated VM instead.### System ConfigurationRun after each reboot for up to 15% more executions per second:
```
```
For maximum performance, disable kernel security mitigations (requires grub bootloader, not supported in Docker):
```
```
For maximum performance, disable kernel security mitigations (requires grub bootloader, not supported in Docker):
```
```
Verify with cat /proc/cmdline - output should include mitigations=off.## Writing a Harness### Harness StructureAFL++ supports libFuzzer-style harnesses:
```
```
Verify with
```
```
- output should include
```
```
.## Writing a Harness### Harness StructureAFL++ supports libFuzzer-style harnesses:
```
```
### Harness Rules| Do | Don't ||----|-------|| Reset global state between runs | Rely on state from previous runs || Handle edge cases gracefully | Exit on invalid input || Keep harness deterministic | Use random number generators || Free allocated memory | Create memory leaks || Validate input sizes | Process unbounded input |> **See Also:** For detailed harness writing techniques, patterns for handling complex inputs,> and advanced strategies, see the **fuzz-harness-writing** technique skill.## CompilationAFL++ offers multiple compilation modes with different trade-offs.### Compilation Mode Decision TreeChoose your compilation mode:- **LTO mode** (afl-clang-lto): Best performance and instrumentation. Try this first.- **LLVM mode** (afl-clang-fast): Fall back if LTO fails to compile.- **GCC plugin** (afl-gcc-fast): For projects requiring GCC.### Basic Compilation (LLVM mode)
```
```
### Harness Rules| Do | Don't ||----|-------|| Reset global state between runs | Rely on state from previous runs || Handle edge cases gracefully | Exit on invalid input || Keep harness deterministic | Use random number generators || Free allocated memory | Create memory leaks || Validate input sizes | Process unbounded input |> **See Also:** For detailed harness writing techniques, patterns for handling complex inputs,> and advanced strategies, see the **fuzz-harness-writing** technique skill.## CompilationAFL++ offers multiple compilation modes with different trade-offs.### Compilation Mode Decision TreeChoose your compilation mode:- **LTO mode** (
```
```
): Best performance and instrumentation. Try this first.- **LLVM mode** (
```
```
): Fall back if LTO fails to compile.- **GCC plugin** (
```
```
): For projects requiring GCC.### Basic Compilation (LLVM mode)
```
```
### GCC Compilation
```
```
### GCC Compilation
```
```
**Important:** GCC version must match the version used to compile the AFL++ GCC plugin.### With Sanitizers
```
```
**Important:** GCC version must match the version used to compile the AFL++ GCC plugin.### With Sanitizers
```
```
> **See Also:** For detailed sanitizer configuration, common issues, and advanced flags,> see the **address-sanitizer** and **undefined-behavior-sanitizer** technique skills.### Build FlagsNote that -g is not necessary, it is added by default by the AFL++ compilers.| Flag | Purpose ||------|---------|| -DNO_MAIN=1 | Skip main function when using libFuzzer harness || -O2 | Production optimization level (recommended for fuzzing) || -fsanitize=fuzzer | Enable libFuzzer compatibility mode and adds the fuzzer runtime when linking executable || -fsanitize=fuzzer-no-link | Instrument without linking fuzzer runtime (for static libraries and object files) |## Corpus Management### Creating Initial CorpusAFL++ requires at least one non-empty seed file:
```
```
> **See Also:** For detailed sanitizer configuration, common issues, and advanced flags,> see the **address-sanitizer** and **undefined-behavior-sanitizer** technique skills.### Build FlagsNote that
```
```
is not necessary, it is added by default by the AFL++ compilers.| Flag | Purpose ||------|---------||
```
```
| Skip main function when using libFuzzer harness ||
```
```
| Production optimization level (recommended for fuzzing) ||
```
```
| Enable libFuzzer compatibility mode and adds the fuzzer runtime when linking executable ||
```
```
| Instrument without linking fuzzer runtime (for static libraries and object files) |## Corpus Management### Creating Initial CorpusAFL++ requires at least one non-empty seed file:
```
```
For real projects, gather representative inputs:- Download example files for the format you're fuzzing- Extract test cases from the project's test suite- Use minimal valid inputs for your file format### Corpus MinimizationAfter a campaign, minimize the corpus to keep only unique coverage:
```
```
For real projects, gather representative inputs:- Download example files for the format you're fuzzing- Extract test cases from the project's test suite- Use minimal valid inputs for your file format### Corpus MinimizationAfter a campaign, minimize the corpus to keep only unique coverage:
```
```
> **See Also:** For corpus creation strategies, dictionaries, and seed selection,> see the **fuzzing-corpus** technique skill.## Running Campaigns### Basic Run
```
```
> **See Also:** For corpus creation strategies, dictionaries, and seed selection,> see the **fuzzing-corpus** technique skill.## Running Campaigns### Basic Run
```
```
### Setting Environment Variables
```
```
### Setting Environment Variables
```
```
### Interpreting OutputThe AFL++ UI shows real-time fuzzing statistics:| Output | Meaning ||--------|---------|| **execs/sec** | Execution speed - higher is better || **cycles done** | Number of queue passes completed || **corpus count** | Number of unique test cases in queue || **saved crashes** | Number of unique crashes found || **stability** | % of stable edges (should be near 100%) |### Output Directory Structure
```
```
### Interpreting OutputThe AFL++ UI shows real-time fuzzing statistics:| Output | Meaning ||--------|---------|| **execs/sec** | Execution speed - higher is better || **cycles done** | Number of queue passes completed || **corpus count** | Number of unique test cases in queue || **saved crashes** | Number of unique crashes found || **stability** | % of stable edges (should be near 100%) |### Output Directory Structure
```
```
### Analyzing ResultsView live campaign statistics:
```
```
### Analyzing ResultsView live campaign statistics:
```
```
Create coverage plots:
```
```
Create coverage plots:
```
```
### Re-executing Test Cases
```
```
### Re-executing Test Cases
```
```
### Fuzzer Options| Option | Purpose ||--------|---------|| -G 4000 | Maximum test input length (default: 1048576 bytes) || -t 1000 | Timeout in milliseconds for each test case (default: 1000ms) || -m 1000 | Memory limit in megabytes (default: 0 = unlimited) || -x ./dict.dict | Use dictionary file to guide mutations |## Multi-Core FuzzingAFL++ excels at multi-core fuzzing with two major advantages:1. More executions per second (scales linearly with physical cores)2. Asymmetrical fuzzing (e.g., one ASan job, rest without sanitizers)### Starting a CampaignStart the primary fuzzer (in background):
```
```
### Fuzzer Options| Option | Purpose ||--------|---------||
```
```
| Maximum test input length (default: 1048576 bytes) ||
```
```
| Timeout in milliseconds for each test case (default: 1000ms) ||
```
```
| Memory limit in megabytes (default: 0 = unlimited) ||
```
```
| Use dictionary file to guide mutations |## Multi-Core FuzzingAFL++ excels at multi-core fuzzing with two major advantages:1. More executions per second (scales linearly with physical cores)2. Asymmetrical fuzzing (e.g., one ASan job, rest without sanitizers)### Starting a CampaignStart the primary fuzzer (in background):
```
```
Start secondary fuzzers (as many as you have cores):
```
```
Start secondary fuzzers (as many as you have cores):
```
```
### Monitoring Multi-Core CampaignsList all running jobs:
```
```
### Monitoring Multi-Core CampaignsList all running jobs:
```
```
View live statistics (updates every second):
```
```
View live statistics (updates every second):
```
```
### Stopping All Fuzzers
```
```
### Stopping All Fuzzers
```
```
## Coverage AnalysisAFL++ automatically tracks coverage through edge instrumentation. Coverage information is stored in fuzzer_stats and plot_data.### Measuring CoverageUse afl-plot to visualize coverage over time:
```
```
## Coverage AnalysisAFL++ automatically tracks coverage through edge instrumentation. Coverage information is stored in
```
```
and
```
```
.### Measuring CoverageUse
```
```
to visualize coverage over time:
```
```
### Improving Coverage- Use dictionaries for format-aware fuzzing- Run longer campaigns (cycles_wo_finds indicates plateau)- Try different mutation strategies with multi-core fuzzing- Analyze coverage gaps and add targeted seed inputs> **See Also:** For detailed coverage analysis techniques, identifying coverage gaps,> and systematic coverage improvement, see the **coverage-analysis** technique skill.## CMPLOGCMPLOG/RedQueen is the best path constraint solving mechanism available in any fuzzer.To enable it, the fuzz target needs to be instrumented for it.Before building the fuzzing target set the environment variable:
```
```
### Improving Coverage- Use dictionaries for format-aware fuzzing- Run longer campaigns (cycles_wo_finds indicates plateau)- Try different mutation strategies with multi-core fuzzing- Analyze coverage gaps and add targeted seed inputs> **See Also:** For detailed coverage analysis techniques, identifying coverage gaps,> and systematic coverage improvement, see the **coverage-analysis** technique skill.## CMPLOGCMPLOG/RedQueen is the best path constraint solving mechanism available in any fuzzer.To enable it, the fuzz target needs to be instrumented for it.Before building the fuzzing target set the environment variable:
```
```
No special action is needed for compiling and linking the harness.To run a fuzzer instance with a CMPLOG instrumented fuzzing target, add -c0 to the command like arguments:
```
```
No special action is needed for compiling and linking the harness.To run a fuzzer instance with a CMPLOG instrumented fuzzing target, add
```
```
to the command like arguments:
```
```
## Sanitizer IntegrationSanitizers are essential for finding memory corruption bugs that don't cause immediate crashes.### AddressSanitizer (ASan)
```
```
## Sanitizer IntegrationSanitizers are essential for finding memory corruption bugs that don't cause immediate crashes.### AddressSanitizer (ASan)
```
```
**Note:** Memory limit (-m) is not supported with ASan due to 20TB virtual memory reservation.### UndefinedBehaviorSanitizer (UBSan)
```
```
**Note:** Memory limit (
```
```
) is not supported with ASan due to 20TB virtual memory reservation.### UndefinedBehaviorSanitizer (UBSan)
```
```
### Common Sanitizer Issues| Issue | Solution ||-------|----------|| ASan slows fuzzing | Use only 1 ASan job in multi-core setup || Stack exhaustion | Increase stack with ASAN_OPTIONS=stack_size=... || GCC version mismatch | Ensure system GCC matches AFL++ plugin version |> **See Also:** For comprehensive sanitizer configuration and troubleshooting,> see the **address-sanitizer** technique skill.## Advanced Usage### Tips and Tricks| Tip | Why It Helps ||-----|--------------|| Use LLVMFuzzerTestOneInput harnesses where possible | If a fuzzing campaign has at least 85% stability then this is the most efficient fuzzing style. If not then try standard input or file input fuzzing || Use dictionaries | Helps fuzzer discover format-specific keywords and magic bytes || Set realistic timeouts | Prevents false positives from system load || Limit input size | Larger inputs don't necessarily explore more space || Monitor stability | Low stability indicates non-deterministic behavior |### Standard Input FuzzingAFL++ can fuzz programs reading from stdin without a libFuzzer harness:
```
```
### Common Sanitizer Issues| Issue | Solution ||-------|----------|| ASan slows fuzzing | Use only 1 ASan job in multi-core setup || Stack exhaustion | Increase stack with
```
```
|| GCC version mismatch | Ensure system GCC matches AFL++ plugin version |> **See Also:** For comprehensive sanitizer configuration and troubleshooting,> see the **address-sanitizer** technique skill.## Advanced Usage### Tips and Tricks| Tip | Why It Helps ||-----|--------------|| Use LLVMFuzzerTestOneInput harnesses where possible | If a fuzzing campaign has at least 85% stability then this is the most efficient fuzzing style. If not then try standard input or file input fuzzing || Use dictionaries | Helps fuzzer discover format-specific keywords and magic bytes || Set realistic timeouts | Prevents false positives from system load || Limit input size | Larger inputs don't necessarily explore more space || Monitor stability | Low stability indicates non-deterministic behavior |### Standard Input FuzzingAFL++ can fuzz programs reading from stdin without a libFuzzer harness:
```
```
This is slower than persistent mode but requires no harness code.### File Input FuzzingFor programs that read files, use @@ placeholder:
```
```
This is slower than persistent mode but requires no harness code.### File Input FuzzingFor programs that read files, use
```
```
placeholder:
```
```
For better performance, use fmemopen to create file descriptors from memory.### Argument FuzzingFuzz command-line arguments using argv-fuzz-inl.h:
```
```
For better performance, use
```
```
to create file descriptors from memory.### Argument FuzzingFuzz command-line arguments using
```
```
:
```
```
Download the header:
```
```
Download the header:
```
```
Compile and run:
```
```
Compile and run:
```
```
### Performance Tuning| Setting | Impact ||---------|--------|| CPU core count | Linear scaling with physical cores || Persistent mode | 10-20x faster than fork server || -G input size limit | Smaller = faster, but may miss bugs || ASan ratio | 1 ASan job per 4-8 non-ASan jobs |## Real-World Examples### Example: libpngFuzzing libpng demonstrates fuzzing a C project with static libraries:
```
```
### Performance Tuning| Setting | Impact ||---------|--------|| CPU core count | Linear scaling with physical cores || Persistent mode | 10-20x faster than fork server ||
```
```
input size limit | Smaller = faster, but may miss bugs || ASan ratio | 1 ASan job per 4-8 non-ASan jobs |## Real-World Examples### Example: libpngFuzzing libpng demonstrates fuzzing a C project with static libraries:
```
```
### Example: CMake-based Project
```
```
### Example: CMake-based Project
```
```
Build and fuzz:
```
```
Build and fuzz:
```
```
## Troubleshooting| Problem | Cause | Solution ||---------|-------|----------|| Low exec/sec (<1k) | Not using persistent mode | Create a LLVMFuzzerTestOneInput style harness || Low stability (<85%) | Non-deterministic code | Fuzz a program via stdin or file inputs, or create such a harness || GCC plugin error | GCC version mismatch | Ensure system GCC matches AFL++ build and install gcc-$GCC_VERSION-plugin-dev || No crashes found | Need sanitizers | Recompile with
```
```
|| Memory limit exceeded | ASan uses 20TB virtual | Remove
```
The AFL++ Agent Skill empowers developers and security engineers to conduct highly efficient and deep vulnerability discovery. As an advanced fork of the original AFL fuzzer, AFL++ excels in finding elusive bugs and security flaws in C/C++ applications. It's particularly renowned for its robust multi-core support, allowing for parallel execution and significantly faster exploration of program states. This skill provides access to a mature, stable, and feature-rich fuzzing environment, making it an indispensable tool for enhancing the security posture of critical software projects and ensuring code resilience against sophisticated attacks.

# When to Use This Skill
- •Performing multi-core fuzzing campaigns on large-scale C/C++ applications to maximize vulnerability discovery throughput.
- •Improving test coverage and finding deeper bugs when other fuzzers like libFuzzer have plateaued.
- •Fuzzing production-grade codebases that require parallel execution for comprehensive security audits.
- •Integrating advanced mutation strategies to uncover diverse classes of vulnerabilities in complex software.

# Pro Tips
- 💡Always start with a clean and minimal seed corpus that represents valid, interesting inputs to guide the fuzzer towards deeper paths efficiently.
- 💡Leverage AFL++'s persistent mode for targets where initialization is expensive, as it significantly reduces overhead and boosts fuzzing speed.
- 💡Combine AFL++ with sanitizers (ASan, UBSan, MSan) during compilation to detect a wider array of memory and undefined behavior issues that might otherwise be missed.

