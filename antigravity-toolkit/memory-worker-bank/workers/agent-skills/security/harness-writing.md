# harness-writing
Source: https://antigravity.codes/agent-skills/security/harness-writing

## AI Worker Instructions
When the user requests functionality related to harness-writing, follow these guidelines and utilize this context.

## Scraped Content

# harness-writing
```
LLVMFuzzerTestOneInput
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)
```
```
fuzz_target!(|data: &[u8]| { ... })
```
```
if (size < MIN_SIZE) return 0;
```
```
uint32_t val = *(uint32_t*)(data);
```
```
FuzzedDataProvider fuzzed_data(data, size);
```
```
auto val = fuzzed_data.ConsumeIntegral<uint32_t>();
```
```
auto str = fuzzed_data.ConsumeBytesWithTerminator<char>(32, 0xFF);
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    target_function(data, size);    return 0;}
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    target_function(data, size);    return 0;}
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fuzz_target!(|data: &[u8]| {    target_function(data);});
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fuzz_target!(|data: &[u8]| {    target_function(data);});
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Ensure minimum size for meaningful input    if (size < MIN_INPUT_SIZE || size > MAX_INPUT_SIZE) {        return 0;    }    target_function(data, size);    return 0;}
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Ensure minimum size for meaningful input    if (size < MIN_INPUT_SIZE || size > MAX_INPUT_SIZE) {        return 0;    }    target_function(data, size);    return 0;}
```
```
FuzzedDataProvider
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    if (size != 2 * sizeof(uint32_t)) {        return 0;    }    uint32_t numerator = *(uint32_t*)(data);    uint32_t denominator = *(uint32_t*)(data + sizeof(uint32_t));    divide(numerator, denominator);    return 0;}
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    if (size != 2 * sizeof(uint32_t)) {        return 0;    }    uint32_t numerator = *(uint32_t*)(data);    uint32_t denominator = *(uint32_t*)(data + sizeof(uint32_t));    divide(numerator, denominator);    return 0;}
```
```
#include "FuzzedDataProvider.h"extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    FuzzedDataProvider fuzzed_data(data, size);    size_t allocation_size = fuzzed_data.ConsumeIntegral<size_t>();    std::vector<char> str1 = fuzzed_data.ConsumeBytesWithTerminator<char>(32, 0xFF);    std::vector<char> str2 = fuzzed_data.ConsumeBytesWithTerminator<char>(32, 0xFF);    concat(&str1[0], str1.size(), &str2[0], str2.size(), allocation_size);    return 0;}
```
```
#include "FuzzedDataProvider.h"extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    FuzzedDataProvider fuzzed_data(data, size);    size_t allocation_size = fuzzed_data.ConsumeIntegral<size_t>();    std::vector<char> str1 = fuzzed_data.ConsumeBytesWithTerminator<char>(32, 0xFF);    std::vector<char> str2 = fuzzed_data.ConsumeBytesWithTerminator<char>(32, 0xFF);    concat(&str1[0], str1.size(), &str2[0], str2.size(), allocation_size);    return 0;}
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Ensure exactly 2 4-byte numbers    if (size != 2 * sizeof(uint32_t)) {        return 0;    }    // Split input into two integers    uint32_t numerator = *(uint32_t*)(data);    uint32_t denominator = *(uint32_t*)(data + sizeof(uint32_t));    divide(numerator, denominator);    return 0;}
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Ensure exactly 2 4-byte numbers    if (size != 2 * sizeof(uint32_t)) {        return 0;    }    // Split input into two integers    uint32_t numerator = *(uint32_t*)(data);    uint32_t denominator = *(uint32_t*)(data + sizeof(uint32_t));    divide(numerator, denominator);    return 0;}
```
```
fuzz_target!(|data: &[u8]| {    if data.len() != 2 * std::mem::size_of::<i32>() {        return;    }    let numerator = i32::from_ne_bytes([data[0], data[1], data[2], data[3]]);    let denominator = i32::from_ne_bytes([data[4], data[5], data[6], data[7]]);    divide(numerator, denominator);});
```
```
fuzz_target!(|data: &[u8]| {    if data.len() != 2 * std::mem::size_of::<i32>() {        return;    }    let numerator = i32::from_ne_bytes([data[0], data[1], data[2], data[3]]);    let denominator = i32::from_ne_bytes([data[4], data[5], data[6], data[7]]);    divide(numerator, denominator);});
```
```
#include "FuzzedDataProvider.h"extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    FuzzedDataProvider fuzzed_data(data, size);    // Extract different types of data    size_t allocation_size = fuzzed_data.ConsumeIntegral<size_t>();    // Consume variable-length strings with terminator    std::vector<char> str1 = fuzzed_data.ConsumeBytesWithTerminator<char>(32, 0xFF);    std::vector<char> str2 = fuzzed_data.ConsumeBytesWithTerminator<char>(32, 0xFF);    char* result = concat(&str1[0], str1.size(), &str2[0], str2.size(), allocation_size);    if (result != NULL) {        free(result);    }    return 0;}
```
```
#include "FuzzedDataProvider.h"extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    FuzzedDataProvider fuzzed_data(data, size);    // Extract different types of data    size_t allocation_size = fuzzed_data.ConsumeIntegral<size_t>();    // Consume variable-length strings with terminator    std::vector<char> str1 = fuzzed_data.ConsumeBytesWithTerminator<char>(32, 0xFF);    std::vector<char> str2 = fuzzed_data.ConsumeBytesWithTerminator<char>(32, 0xFF);    char* result = concat(&str1[0], str1.size(), &str2[0], str2.size(), allocation_size);    if (result != NULL) {        free(result);    }    return 0;}
```
```
FuzzedDataProvider
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    if (size < 1 + 2 * sizeof(int32_t)) {        return 0;    }    // First byte selects operation    uint8_t mode = data[0];    // Next bytes are operands    int32_t numbers[2];    memcpy(numbers, data + 1, 2 * sizeof(int32_t));    int32_t result = 0;    switch (mode % 4) {        case 0:            result = add(numbers[0], numbers[1]);            break;        case 1:            result = subtract(numbers[0], numbers[1]);            break;        case 2:            result = multiply(numbers[0], numbers[1]);            break;        case 3:            result = divide(numbers[0], numbers[1]);            break;    }    // Prevent compiler from optimizing away the calls    printf("%d", result);    return 0;}
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    if (size < 1 + 2 * sizeof(int32_t)) {        return 0;    }    // First byte selects operation    uint8_t mode = data[0];    // Next bytes are operands    int32_t numbers[2];    memcpy(numbers, data + 1, 2 * sizeof(int32_t));    int32_t result = 0;    switch (mode % 4) {        case 0:            result = add(numbers[0], numbers[1]);            break;        case 1:            result = subtract(numbers[0], numbers[1]);            break;        case 2:            result = multiply(numbers[0], numbers[1]);            break;        case 3:            result = divide(numbers[0], numbers[1]);            break;    }    // Prevent compiler from optimizing away the calls    printf("%d", result);    return 0;}
```
```
use arbitrary::Arbitrary;#[derive(Debug, Arbitrary)]pub struct Name {    data: String}impl Name {    pub fn check_buf(&self) {        let data = self.data.as_bytes();        if data.len() > 0 && data[0] == b'a' {            if data.len() > 1 && data[1] == b'b' {                if data.len() > 2 && data[2] == b'c' {                    process::abort();                }            }        }    }}
```
```
use arbitrary::Arbitrary;#[derive(Debug, Arbitrary)]pub struct Name {    data: String}impl Name {    pub fn check_buf(&self) {        let data = self.data.as_bytes();        if data.len() > 0 && data[0] == b'a' {            if data.len() > 1 && data[1] == b'b' {                if data.len() > 2 && data[2] == b'c' {                    process::abort();                }            }        }    }}
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fuzz_target!(|data: your_project::Name| {    data.check_buf();});
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fuzz_target!(|data: your_project::Name| {    data.check_buf();});
```
```
[dependencies]arbitrary = { version = "1", features = ["derive"] }
```
```
[dependencies]arbitrary = { version = "1", features = ["derive"] }
```
```
arbitrary
```
```
// Define your input format in .proto file// Use libprotobuf-mutator to generate valid mutations// This ensures fuzzer mutates message contents, not the protobuf encoding itself
```
```
// Define your input format in .proto file// Use libprotobuf-mutator to generate valid mutations// This ensures fuzzer mutates message contents, not the protobuf encoding itself
```
```
rand()
```
```
uint32_t seed = fuzzed_data.ConsumeIntegral<uint32_t>();  srand(seed);
```
```
uint32_t seed = fuzzed_data.ConsumeIntegral<uint32_t>();  srand(seed);
```
```
/dev/random
```
```
/dev/urandom
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Reset global state before each iteration    global_reset();    target_function(data, size);    // Clean up resources    global_cleanup();    return 0;}
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Reset global state before each iteration    global_reset();    target_function(data, size);    // Clean up resources    global_cleanup();    return 0;}
```
```
exit()
```
```
exit()
```
```
abort()
```
```
exit()
```
```
abort()
```
```
size
```
```
data
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Your code here    return 0;  // Non-zero return is reserved for future use}
```
```
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Your code here    return 0;  // Non-zero return is reserved for future use}
```
```
clang++ -fsanitize=fuzzer,address -g harness.cc -o fuzz_target
```
```
clang++ -fsanitize=fuzzer,address -g harness.cc -o fuzz_target
```
```
FuzzedDataProvider.h
```
```
-fsanitize=fuzzer
```
```
-fsanitize=address,undefined
```
```
-g
```
```
./fuzz_target corpus_dir/
```
```
./fuzz_target corpus_dir/
```
```
#include <unistd.h>int main(int argc, char **argv) {    #ifdef __AFL_HAVE_MANUAL_CONTROL        __AFL_INIT();    #endif    unsigned char buf[MAX_SIZE];    while (__AFL_LOOP(10000)) {        // Read input from stdin        ssize_t len = read(0, buf, sizeof(buf));        if (len <= 0) break;        // Call target function        target_function(buf, len);    }    return 0;}
```
```
#include <unistd.h>int main(int argc, char **argv) {    #ifdef __AFL_HAVE_MANUAL_CONTROL        __AFL_INIT();    #endif    unsigned char buf[MAX_SIZE];    while (__AFL_LOOP(10000)) {        // Read input from stdin        ssize_t len = read(0, buf, sizeof(buf));        if (len <= 0) break;        // Call target function        target_function(buf, len);    }    return 0;}
```
```
afl-clang-fast++ -g harness.cc -o fuzz_target
```
```
afl-clang-fast++ -g harness.cc -o fuzz_target
```
```
__AFL_LOOP
```
```
__AFL_INIT()
```
```
AFL_USE_ASAN=1
```
```
AFL_USE_UBSAN=1
```
```
afl-fuzz -i seeds/ -o findings/ -- ./fuzz_target
```
```
afl-fuzz -i seeds/ -o findings/ -- ./fuzz_target
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fuzz_target!(|data: &[u8]| {    // Your code here});
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fuzz_target!(|data: &[u8]| {    // Your code here});
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fuzz_target!(|data: YourStruct| {    data.check();});
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fuzz_target!(|data: YourStruct| {    data.check();});
```
```
cargo fuzz initcargo fuzz add my_target
```
```
cargo fuzz initcargo fuzz add my_target
```
```
arbitrary
```
```
fuzz/fuzz_targets/
```
```
cargo +nightly fuzz run my_target
```
```
cargo +nightly fuzz run my_target
```
```
// +build gofuzzpackage mypackagefunc Fuzz(data []byte) int {    // Call target function    target(data)    // Return codes:    // -1 if input is invalid    //  0 if input is valid but not interesting    //  1 if input is interesting (e.g., added new coverage)    return 0}
```
```
// +build gofuzzpackage mypackagefunc Fuzz(data []byte) int {    // Call target function    target(data)    // Return codes:    // -1 if input is invalid    //  0 if input is valid but not interesting    //  1 if input is interesting (e.g., added new coverage)    return 0}
```
```
go-fuzz-build
```
```
go-fuzz-build
```
```
go-fuzz -bin=./mypackage-fuzz.zip -workdir=fuzz
```
```
go-fuzz -bin=./mypackage-fuzz.zip -workdir=fuzz
```
```
exit()
```
```
exit()
```
```
abort()
```
```
if (size < MIN_SIZE) return 0;
```
```
LLVMFuzzerTestOneInput
```
```
__AFL_LOOP
```
```
fuzz_target!
```
Crafting robust fuzzing harnesses is a critical skill for any developer serious about software security and quality. These specialized functions act as the vital bridge between a fuzzer's random input and your application's core logic, enabling systematic exploration of edge cases and hidden vulnerabilities. A well-designed harness significantly boosts code coverage, ensuring that even obscure paths are exercised, while a poorly constructed one can leave entire subsystems unchecked. This skill empowers you to develop harnesses that effectively drive your system under test, transforming raw bytes into meaningful interactions and maximizing your chances of uncovering critical bugs before they reach production.

# When to Use This Skill
- •Developing New Features: Integrate fuzzing harness creation early in the development lifecycle to proactively identify flaws in new code.
- •Auditing Existing Codebases: Create harnesses for legacy code or complex libraries to discover latent vulnerabilities that traditional testing might miss.
- •Improving Test Coverage: Extend unit and integration test suites by adding fuzzing harnesses to explore edge cases and unusual inputs automatically.
- •Security Bug Bounties/Pen-testing: Quickly set up fuzzing environments for target applications to efficiently uncover exploitable vulnerabilities.

# Pro Tips
- 💡Simplify Input Parsing: Prioritize FuzzedDataProvider or similar helper classes to simplify extracting structured data from raw fuzzer bytes, making harnesses cleaner and more effective.
- 💡Isolate the SUT: Ensure your harness calls the System Under Test (SUT) in as isolated an environment as possible to avoid false positives and make bug reproduction easier.
- 💡Handle State Carefully: Reset application state between fuzzer iterations if the SUT maintains internal state, preventing dependencies between runs and ensuring determinism.

