# coverage-analysis
Source: https://antigravity.codes/agent-skills/security/coverage-analysis

## AI Worker Instructions
When the user requests functionality related to coverage-analysis, follow these guidelines and utilize this context.

## Scraped Content

# coverage-analysis
```
-fprofile-instr-generate -fcoverage-mapping
```
```
-ftest-coverage -fprofile-arcs
```
```
cargo +nightly fuzz coverage <target>
```
```
llvm-profdata merge -sparse file.profraw -o file.profdata
```
```
llvm-cov report ./binary -instr-profile=file.profdata
```
```
llvm-cov show ./binary -instr-profile=file.profdata -format=html -output-dir html/
```
```
gcovr --html-details -o coverage.html
```
```
[Fuzzing Campaign]       |       v[Generate Corpus]       |       v[Coverage Analysis]       |       +---> Coverage Increased? --> Continue fuzzing with larger corpus       |       +---> Coverage Decreased? --> Fix harness or investigate SUT changes       |       +---> Coverage Plateaued? --> Add dictionary entries or seed inputs
```
```
[Fuzzing Campaign]       |       v[Generate Corpus]       |       v[Coverage Analysis]       |       +---> Coverage Increased? --> Continue fuzzing with larger corpus       |       +---> Coverage Decreased? --> Fix harness or investigate SUT changes       |       +---> Coverage Plateaued? --> Add dictionary entries or seed inputs
```
```
clang++ -fprofile-instr-generate -fcoverage-mapping \  -O2 -DNO_MAIN \  main.cc harness.cc execute-rt.cc -o fuzz_exec
```
```
clang++ -fprofile-instr-generate -fcoverage-mapping \  -O2 -DNO_MAIN \  main.cc harness.cc execute-rt.cc -o fuzz_exec
```
```
g++ -ftest-coverage -fprofile-arcs \  -O2 -DNO_MAIN \  main.cc harness.cc execute-rt.cc -o fuzz_exec_gcov
```
```
g++ -ftest-coverage -fprofile-arcs \  -O2 -DNO_MAIN \  main.cc harness.cc execute-rt.cc -o fuzz_exec_gcov
```
```
rustup toolchain install nightly --component llvm-tools-previewcargo +nightly fuzz coverage fuzz_target_1
```
```
rustup toolchain install nightly --component llvm-tools-previewcargo +nightly fuzz coverage fuzz_target_1
```
```
// execute-rt.cc#include <stdio.h>#include <stdlib.h>#include <dirent.h>#include <stdint.h>extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size);void load_file_and_test(const char *filename) {    FILE *file = fopen(filename, "rb");    if (file == NULL) {        printf("Failed to open file: %s\n", filename);        return;    }    fseek(file, 0, SEEK_END);    long filesize = ftell(file);    rewind(file);    uint8_t *buffer = (uint8_t*) malloc(filesize);    if (buffer == NULL) {        printf("Failed to allocate memory for file: %s\n", filename);        fclose(file);        return;    }    long read_size = (long) fread(buffer, 1, filesize, file);    if (read_size != filesize) {        printf("Failed to read file: %s\n", filename);        free(buffer);        fclose(file);        return;    }    LLVMFuzzerTestOneInput(buffer, filesize);    free(buffer);    fclose(file);}int main(int argc, char **argv) {    if (argc != 2) {        printf("Usage: %s <directory>\n", argv[0]);        return 1;    }    DIR *dir = opendir(argv[1]);    if (dir == NULL) {        printf("Failed to open directory: %s\n", argv[1]);        return 1;    }    struct dirent *entry;    while ((entry = readdir(dir)) != NULL) {        if (entry->d_type == DT_REG) {            char filepath[1024];            snprintf(filepath, sizeof(filepath), "%s/%s", argv[1], entry->d_name);            load_file_and_test(filepath);        }    }    closedir(dir);    return 0;}
```
```
// execute-rt.cc#include <stdio.h>#include <stdlib.h>#include <dirent.h>#include <stdint.h>extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size);void load_file_and_test(const char *filename) {    FILE *file = fopen(filename, "rb");    if (file == NULL) {        printf("Failed to open file: %s\n", filename);        return;    }    fseek(file, 0, SEEK_END);    long filesize = ftell(file);    rewind(file);    uint8_t *buffer = (uint8_t*) malloc(filesize);    if (buffer == NULL) {        printf("Failed to allocate memory for file: %s\n", filename);        fclose(file);        return;    }    long read_size = (long) fread(buffer, 1, filesize, file);    if (read_size != filesize) {        printf("Failed to read file: %s\n", filename);        free(buffer);        fclose(file);        return;    }    LLVMFuzzerTestOneInput(buffer, filesize);    free(buffer);    fclose(file);}int main(int argc, char **argv) {    if (argc != 2) {        printf("Usage: %s <directory>\n", argv[0]);        return 1;    }    DIR *dir = opendir(argv[1]);    if (dir == NULL) {        printf("Failed to open directory: %s\n", argv[1]);        return 1;    }    struct dirent *entry;    while ((entry = readdir(dir)) != NULL) {        if (entry->d_type == DT_REG) {            char filepath[1024];            snprintf(filepath, sizeof(filepath), "%s/%s", argv[1], entry->d_name);            load_file_and_test(filepath);        }    }    closedir(dir);    return 0;}
```
```
LLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec corpus/
```
```
LLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec corpus/
```
```
./fuzz_exec_gcov corpus/
```
```
./fuzz_exec_gcov corpus/
```
```
cargo fuzz coverage
```
```
# Merge raw profile datallvm-profdata merge -sparse fuzz.profraw -o fuzz.profdata# Generate text reportllvm-cov report ./fuzz_exec \  -instr-profile=fuzz.profdata \  -ignore-filename-regex='harness.cc|execute-rt.cc'# Generate HTML reportllvm-cov show ./fuzz_exec \  -instr-profile=fuzz.profdata \  -ignore-filename-regex='harness.cc|execute-rt.cc' \  -format=html -output-dir fuzz_html/
```
```
# Merge raw profile datallvm-profdata merge -sparse fuzz.profraw -o fuzz.profdata# Generate text reportllvm-cov report ./fuzz_exec \  -instr-profile=fuzz.profdata \  -ignore-filename-regex='harness.cc|execute-rt.cc'# Generate HTML reportllvm-cov show ./fuzz_exec \  -instr-profile=fuzz.profdata \  -ignore-filename-regex='harness.cc|execute-rt.cc' \  -format=html -output-dir fuzz_html/
```
```
# Install gcovr (via pip for latest version)python3 -m venv venvsource venv/bin/activatepip3 install gcovr# Generate reportgcovr --gcov-executable "llvm-cov gcov" \  --exclude harness.cc --exclude execute-rt.cc \  --root . --html-details -o coverage.html
```
```
# Install gcovr (via pip for latest version)python3 -m venv venvsource venv/bin/activatepip3 install gcovr# Generate reportgcovr --gcov-executable "llvm-cov gcov" \  --exclude harness.cc --exclude execute-rt.cc \  --root . --html-details -o coverage.html
```
```
# Install required toolscargo install cargo-binutils rustfilt# Create HTML generation scriptcat <<'EOF' > ./generate_html#!/bin/shif [ $# -lt 1 ]; then    echo "Error: Name of fuzz target is required."    echo "Usage: $0 fuzz_target [sources...]"    exit 1fiFUZZ_TARGET="$1"shiftSRC_FILTER="$@"TARGET=$(rustc -vV | sed -n 's|host: ||p')cargo +nightly cov -- show -Xdemangler=rustfilt \  "target/$TARGET/coverage/$TARGET/release/$FUZZ_TARGET" \  -instr-profile="fuzz/coverage/$FUZZ_TARGET/coverage.profdata" \  -show-line-counts-or-regions -show-instantiations \  -format=html -o fuzz_html/ $SRC_FILTEREOFchmod +x ./generate_html# Generate HTML report./generate_html fuzz_target_1 src/lib.rs
```
```
# Install required toolscargo install cargo-binutils rustfilt# Create HTML generation scriptcat <<'EOF' > ./generate_html#!/bin/shif [ $# -lt 1 ]; then    echo "Error: Name of fuzz target is required."    echo "Usage: $0 fuzz_target [sources...]"    exit 1fiFUZZ_TARGET="$1"shiftSRC_FILTER="$@"TARGET=$(rustc -vV | sed -n 's|host: ||p')cargo +nightly cov -- show -Xdemangler=rustfilt \  "target/$TARGET/coverage/$TARGET/release/$FUZZ_TARGET" \  -instr-profile="fuzz/coverage/$FUZZ_TARGET/coverage.profdata" \  -show-line-counts-or-regions -show-instantiations \  -format=html -o fuzz_html/ $SRC_FILTEREOFchmod +x ./generate_html# Generate HTML report./generate_html fuzz_target_1 src/lib.rs
```
```
// Coverage shows this block is never executedif (buf == 0x7F454C46) {  // ELF magic number    // start parsing buf}
```
```
// Coverage shows this block is never executedif (buf == 0x7F454C46) {  // ELF magic number    // start parsing buf}
```
```
# magic.dict"\x7F\x45\x4C\x46"
```
```
# magic.dict"\x7F\x45\x4C\x46"
```
```
./fuzz_exec corpus/  # Crashes on bad input, no coverage generated
```
```
./fuzz_exec corpus/  # Crashes on bad input, no coverage generated
```
```
// Fork before executing to isolate crashesint main(int argc, char **argv) {    // ... directory opening code ...    while ((entry = readdir(dir)) != NULL) {        if (entry->d_type == DT_REG) {            pid_t pid = fork();            if (pid == 0) {                // Child process - crash won't affect parent                char filepath[1024];                snprintf(filepath, sizeof(filepath), "%s/%s", argv[1], entry->d_name);                load_file_and_test(filepath);                exit(0);            } else {                // Parent waits for child                waitpid(pid, NULL, 0);            }        }    }}
```
```
// Fork before executing to isolate crashesint main(int argc, char **argv) {    // ... directory opening code ...    while ((entry = readdir(dir)) != NULL) {        if (entry->d_type == DT_REG) {            pid_t pid = fork();            if (pid == 0) {                // Child process - crash won't affect parent                char filepath[1024];                snprintf(filepath, sizeof(filepath), "%s/%s", argv[1], entry->d_name);                load_file_and_test(filepath);                exit(0);            } else {                // Parent waits for child                waitpid(pid, NULL, 0);            }        }    }}
```
```
project(FuzzingProject)cmake_minimum_required(VERSION 3.0)# Main binaryadd_executable(program main.cc)# Fuzzing binaryadd_executable(fuzz main.cc harness.cc)target_compile_definitions(fuzz PRIVATE NO_MAIN=1)target_compile_options(fuzz PRIVATE -g -O2 -fsanitize=fuzzer)target_link_libraries(fuzz -fsanitize=fuzzer)# Coverage execution binaryadd_executable(fuzz_exec main.cc harness.cc execute-rt.cc)target_compile_definitions(fuzz_exec PRIVATE NO_MAIN)target_compile_options(fuzz_exec PRIVATE -O2 -fprofile-instr-generate -fcoverage-mapping)target_link_libraries(fuzz_exec -fprofile-instr-generate)
```
```
project(FuzzingProject)cmake_minimum_required(VERSION 3.0)# Main binaryadd_executable(program main.cc)# Fuzzing binaryadd_executable(fuzz main.cc harness.cc)target_compile_definitions(fuzz PRIVATE NO_MAIN=1)target_compile_options(fuzz PRIVATE -g -O2 -fsanitize=fuzzer)target_link_libraries(fuzz -fsanitize=fuzzer)# Coverage execution binaryadd_executable(fuzz_exec main.cc harness.cc execute-rt.cc)target_compile_definitions(fuzz_exec PRIVATE NO_MAIN)target_compile_options(fuzz_exec PRIVATE -O2 -fprofile-instr-generate -fcoverage-mapping)target_link_libraries(fuzz_exec -fprofile-instr-generate)
```
```
cmake -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ .cmake --build . --target fuzz_exec
```
```
cmake -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ .cmake --build . --target fuzz_exec
```
```
-show-directory-coverage
```
```
llvm-cov export -format=lcov
```
```
genhtml
```
```
.profdata
```
```
-ignore-filename-regex
```
```
.gcda
```
```
# First run./fuzz_exec_gcov corpus_batch_1/gcovr --html coverage_v1.html# Second run (adds to existing coverage)./fuzz_exec_gcov corpus_batch_2/gcovr --html coverage_v2.html# Start freshgcovr --delete  # Remove .gcda files./fuzz_exec_gcov corpus/
```
```
# First run./fuzz_exec_gcov corpus_batch_1/gcovr --html coverage_v1.html# Second run (adds to existing coverage)./fuzz_exec_gcov corpus_batch_2/gcovr --html coverage_v2.html# Start freshgcovr --delete  # Remove .gcda files./fuzz_exec_gcov corpus/
```
```
llvm-cov show ./fuzz_exec -instr-profile=fuzz.profdata /path/to/src/
```
```
llvm-cov show ./fuzz_exec -instr-profile=fuzz.profdata /path/to/src/
```
```
llvm-cov show -show-directory-coverage -format=html -output-dir html/
```
```
llvm-cov show -show-directory-coverage -format=html -output-dir html/
```
```
llvm-cov export -format=lcov > coverage.json
```
```
llvm-cov export -format=lcov > coverage.json
```
```
# Campaign 1LLVM_PROFILE_FILE=campaign1.profraw ./fuzz_exec corpus1/llvm-profdata merge -sparse campaign1.profraw -o campaign1.profdata# Campaign 2LLVM_PROFILE_FILE=campaign2.profraw ./fuzz_exec corpus2/llvm-profdata merge -sparse campaign2.profraw -o campaign2.profdata# Comparellvm-cov show ./fuzz_exec \  -instr-profile=campaign2.profdata \  -instr-profile=campaign1.profdata \  -show-line-counts-or-regions
```
```
# Campaign 1LLVM_PROFILE_FILE=campaign1.profraw ./fuzz_exec corpus1/llvm-profdata merge -sparse campaign1.profraw -o campaign1.profdata# Campaign 2LLVM_PROFILE_FILE=campaign2.profraw ./fuzz_exec corpus2/llvm-profdata merge -sparse campaign2.profraw -o campaign2.profdata# Comparellvm-cov show ./fuzz_exec \  -instr-profile=campaign2.profdata \  -instr-profile=campaign1.profdata \  -show-line-counts-or-regions
```
```
-O3
```
```
-O2
```
```
-O0
```
```
-ignore-filename-regex
```
```
--exclude
```
```
clang++ -fprofile-instr-generate -fcoverage-mapping \  -O2 -DNO_MAIN \  main.cc harness.cc execute-rt.cc -o fuzz_exec
```
```
clang++ -fprofile-instr-generate -fcoverage-mapping \  -O2 -DNO_MAIN \  main.cc harness.cc execute-rt.cc -o fuzz_exec
```
```
LLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec corpus/llvm-profdata merge -sparse fuzz.profraw -o fuzz.profdatallvm-cov show ./fuzz_exec -instr-profile=fuzz.profdata -format=html -output-dir html/
```
```
LLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec corpus/llvm-profdata merge -sparse fuzz.profraw -o fuzz.profdatallvm-cov show ./fuzz_exec -instr-profile=fuzz.profdata -format=html -output-dir html/
```
```
-fsanitize=fuzzer
```
```
LLVMFuzzerTestOneInput
```
```
-ignore-filename-regex
```
```
-show-instantiation
```
```
clang++ -fprofile-instr-generate -fcoverage-mapping \  -O2 main.cc harness.cc execute-rt.cc -o fuzz_exec
```
```
clang++ -fprofile-instr-generate -fcoverage-mapping \  -O2 main.cc harness.cc execute-rt.cc -o fuzz_exec
```
```
AFL_USE_ASAN=0 afl-gcc -ftest-coverage -fprofile-arcs \  main.cc harness.cc execute-rt.cc -o fuzz_exec_gcov
```
```
AFL_USE_ASAN=0 afl-gcc -ftest-coverage -fprofile-arcs \  main.cc harness.cc execute-rt.cc -o fuzz_exec_gcov
```
```
# LLVM approachLLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec afl_output/queue/llvm-profdata merge -sparse fuzz.profraw -o fuzz.profdatallvm-cov report ./fuzz_exec -instr-profile=fuzz.profdata# GCC approach./fuzz_exec_gcov afl_output/queue/gcovr --html-details -o coverage.html
```
```
# LLVM approachLLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec afl_output/queue/llvm-profdata merge -sparse fuzz.profraw -o fuzz.profdatallvm-cov report ./fuzz_exec -instr-profile=fuzz.profdata# GCC approach./fuzz_exec_gcov afl_output/queue/gcovr --html-details -o coverage.html
```
```
afl-clang-fast
```
```
queue/
```
```
rustup toolchain install nightly --component llvm-tools-previewcargo install cargo-binutils rustfilt
```
```
rustup toolchain install nightly --component llvm-tools-previewcargo install cargo-binutils rustfilt
```
```
cargo +nightly fuzz coverage fuzz_target_1
```
```
cargo +nightly fuzz coverage fuzz_target_1
```
```
cat <<'EOF' > ./generate_html#!/bin/shFUZZ_TARGET="$1"shiftSRC_FILTER="$@"TARGET=$(rustc -vV | sed -n 's|host: ||p')cargo +nightly cov -- show -Xdemangler=rustfilt \  "target/$TARGET/coverage/$TARGET/release/$FUZZ_TARGET" \  -instr-profile="fuzz/coverage/$FUZZ_TARGET/coverage.profdata" \  -show-line-counts-or-regions -show-instantiations \  -format=html -o fuzz_html/ $SRC_FILTEREOFchmod +x ./generate_html
```
```
cat <<'EOF' > ./generate_html#!/bin/shFUZZ_TARGET="$1"shiftSRC_FILTER="$@"TARGET=$(rustc -vV | sed -n 's|host: ||p')cargo +nightly cov -- show -Xdemangler=rustfilt \  "target/$TARGET/coverage/$TARGET/release/$FUZZ_TARGET" \  -instr-profile="fuzz/coverage/$FUZZ_TARGET/coverage.profdata" \  -show-line-counts-or-regions -show-instantiations \  -format=html -o fuzz_html/ $SRC_FILTEREOFchmod +x ./generate_html
```
```
./generate_html fuzz_target_1 src/lib.rs
```
```
./generate_html fuzz_target_1 src/lib.rs
```
```
-Xdemangler=rustfilt
```
```
src/lib.rs
```
```
-show-line-counts-or-regions
```
```
-show-instantiations
```
```
fuzz/corpus/<target>/
```
```
# Use standard compiler, not honggfuzz compilerclang -fprofile-instr-generate -fcoverage-mapping \  -O2 harness.c execute-rt.c -o fuzz_exec
```
```
# Use standard compiler, not honggfuzz compilerclang -fprofile-instr-generate -fcoverage-mapping \  -O2 harness.c execute-rt.c -o fuzz_exec
```
```
LLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec honggfuzz_workspace/
```
```
LLVM_PROFILE_FILE=fuzz.profraw ./fuzz_exec honggfuzz_workspace/
```
```
hfuzz-clang
```
```
error: no profile data available
```
```
LLVM_PROFILE_FILE
```
```
.profraw
```
```
Failed to load coverage
```
```
no_working_dir_found
```
```
.gcda
```
```
--gcov-ignore-errors=no_working_dir_found
```
```
-show-directory-coverage
```
```
incompatible instrumentation
```
```
cargo fuzz coverage
```
```
show
```
```
report
```
```
export
```
For developers focused on robust and secure software, understanding code coverage during testing is paramount. This AI agent skill for coverage analysis empowers you to pinpoint exactly which parts of your application are being exercised by your fuzzing efforts. Beyond simply tracking execution, it helps identify hard-to-reach code paths, potential logic gaps, and "magic value" checks that hinder comprehensive testing. By leveraging this skill, teams can gain invaluable insights into their test effectiveness, optimize their fuzzing strategies, and ultimately fortify their codebase against vulnerabilities before deployment.

# When to Use This Skill
- •Evaluating the effectiveness of new fuzzing harnesses and test cases.
- •Identifying untested code paths to guide further security audits or targeted test generation.
- •Monitoring coverage trends over time to assess the impact of code changes or fuzzer updates.
- •Pinpointing "magic value" checks that prevent fuzzers from exploring deeper logic and potential vulnerabilities.

# Pro Tips
- 💡Integrate with CI/CD: Automate coverage analysis in your continuous integration pipeline to get immediate feedback on harness efficacy and coverage regressions.
- 💡Prioritize Low-Coverage Areas: Use detailed coverage reports to strategically focus manual review or targeted fuzzing efforts on code sections with minimal or no coverage.
- 💡Visualize Coverage: Leverage tools that offer visual representations of coverage (e.g., source code highlighting) to quickly grasp complex execution flows and identify unexplored branches.

