# address-sanitizer
Source: https://antigravity.codes/agent-skills/security/address-sanitizer

## AI Worker Instructions
When the user requests functionality related to address-sanitizer, follow these guidelines and utilize this context.

## Scraped Content

# address-sanitizer
```
-fsanitize=address
```
```
ASAN_OPTIONS=verbosity=1
```
```
ASAN_OPTIONS=detect_leaks=0
```
```
ASAN_OPTIONS=abort_on_error=1
```
```
ASAN_OPTIONS=verbosity=1:abort_on_error=1
```
```
-fsanitize=address
```
```
clang -fsanitize=address -g -o my_program my_program.c
```
```
clang -fsanitize=address -g -o my_program my_program.c
```
```
-g
```
```
ASAN_OPTIONS
```
```
export ASAN_OPTIONS=verbosity=1:abort_on_error=1:detect_leaks=0
```
```
export ASAN_OPTIONS=verbosity=1:abort_on_error=1:detect_leaks=0
```
```
./my_program
```
```
./my_program
```
```
-rss_limit_mb=0
```
```
-m none
```
```
clang -o fuzz_target fuzz_target.c./fuzz_target
```
```
clang -o fuzz_target fuzz_target.c./fuzz_target
```
```
clang -fsanitize=address -g -o fuzz_target fuzz_target.cASAN_OPTIONS=verbosity=1:abort_on_error=1 ./fuzz_target
```
```
clang -fsanitize=address -g -o fuzz_target fuzz_target.cASAN_OPTIONS=verbosity=1:abort_on_error=1 ./fuzz_target
```
```
gcc -o test_suite test_suite.c -lcheck./test_suite
```
```
gcc -o test_suite test_suite.c -lcheck./test_suite
```
```
gcc -fsanitize=address -g -o test_suite test_suite.c -lcheckASAN_OPTIONS=detect_leaks=1 ./test_suite
```
```
gcc -fsanitize=address -g -o test_suite test_suite.c -lcheckASAN_OPTIONS=detect_leaks=1 ./test_suite
```
```
-g
```
```
verbosity=1
```
```
abort_on_error=1
```
```
abort()
```
```
_exit()
```
```
==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x60300000eff4 at pc 0x00000048e6a3READ of size 4 at 0x60300000eff4 thread T0    #0 0x48e6a2 in main /path/to/file.c:42
```
```
==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x60300000eff4 at pc 0x00000048e6a3READ of size 4 at 0x60300000eff4 thread T0    #0 0x48e6a2 in main /path/to/file.c:42
```
```
clang -fsanitize=address,undefined -g -o fuzz_target fuzz_target.c
```
```
clang -fsanitize=address,undefined -g -o fuzz_target fuzz_target.c
```
```
-rss_limit_mb=0
```
```
-m none
```
```
clang++ -fsanitize=fuzzer,address -g harness.cc -o fuzz
```
```
clang++ -fsanitize=fuzzer,address -g harness.cc -o fuzz
```
```
./fuzz -rss_limit_mb=0
```
```
./fuzz -rss_limit_mb=0
```
```
-fsanitize=fuzzer
```
```
-fsanitize=address
```
```
-g
```
```
ASAN_OPTIONS=abort_on_error=1
```
```
AFL_USE_ASAN
```
```
AFL_USE_ASAN=1 afl-clang-fast++ -g harness.cc -o fuzz
```
```
AFL_USE_ASAN=1 afl-clang-fast++ -g harness.cc -o fuzz
```
```
afl-fuzz -m none -i input_dir -o output_dir ./fuzz
```
```
afl-fuzz -m none -i input_dir -o output_dir ./fuzz
```
```
AFL_USE_ASAN=1
```
```
-m none
```
```
AFL_MAP_SIZE
```
```
--sanitizer=address
```
```
cargo fuzz run fuzz_target --sanitizer=address
```
```
cargo fuzz run fuzz_target --sanitizer=address
```
```
fuzz/Cargo.toml
```
```
[profile.release]opt-level = 3debug = true
```
```
[profile.release]opt-level = 3debug = true
```
```
honggfuzz -i input_dir -o output_dir -- ./fuzz_target_asan
```
```
honggfuzz -i input_dir -o output_dir -- ./fuzz_target_asan
```
```
hfuzz-clang -fsanitize=address -g target.c -o fuzz_target_asan
```
```
hfuzz-clang -fsanitize=address -g target.c -o fuzz_target_asan
```
```
-rss_limit_mb=0
```
```
-m none
```
```
-fsanitize=address
```
```
ASAN_OPTIONS=detect_leaks=0
```
```
-O2
```
```
-O3
```
```
-fsanitize=address
```
```
ASAN_OPTIONS=verbosity=1
```
```
-fsanitize=fuzzer,address
```
```
AFL_USE_ASAN=1
```
```
--sanitizer=address
```
```
-fsanitize=address
```
```
verbosity
```
```
log_path
```
```
symbolize
```
```
external_symbolizer_path
```
```
detect_leaks
```
```
abort_on_error
```
```
abort()
```
```
_exit()
```
```
detect_stack_use_after_return
```
```
check_initialization_order
```
Memory corruption bugs are a notorious source of vulnerabilities and crashes in native codebases. The AddressSanitizer (ASan) agent skill provides a robust framework to proactively identify and mitigate these critical issues before they impact your users. Leveraging advanced instrumentation techniques, ASan integrates seamlessly into your build process, acting as a vigilant guardian against common pitfalls like buffer overflows, use-after-free errors, and memory leaks. This skill empowers developers to write more secure and stable software by making memory safety a first-class citizen in their testing and debugging workflows, leading to higher quality and more reliable applications.

# When to Use This Skill
- •Fuzzing C/C++ applications to uncover hidden memory safety vulnerabilities.
- •Validating memory safety within `unsafe` blocks in Rust codebases.
- •Diagnosing the root cause of crashes related to memory corruption during development.
- •Integrating automated memory error detection into continuous integration (CI) pipelines.

# Pro Tips
- 💡Combine ASan with other sanitizers like UndefinedBehaviorSanitizer (UBSan) for a more comprehensive suite of error detections.
- 💡Utilize ASan primarily in development and testing environments due to its performance overhead, which can be 2-4x slower than uninstrumented code.
- 💡Leverage `ASAN_OPTIONS` environment variables to fine-tune runtime behavior, such as suppressing known issues or customizing error reporting.

