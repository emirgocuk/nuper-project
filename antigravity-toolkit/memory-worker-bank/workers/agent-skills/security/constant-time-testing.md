# constant-time-testing
Source: https://antigravity.codes/agent-skills/security/constant-time-testing

## AI Worker Instructions
When the user requests functionality related to constant-time-testing, follow these guidelines and utilize this context.

## Scraped Content

# constant-time-testing
```
// 1. Conditional jumps - most severe timing differencesif(secret == 1) { ... }while(secret > 0) { ... }// 2. Array access - cache-timing attackslookup_table[secret];// 3. Integer division (processor dependent)data = secret / m;// 4. Shift operation (processor dependent)data = a << secret;
```
```
// 1. Conditional jumps - most severe timing differencesif(secret == 1) { ... }while(secret > 0) { ... }// 2. Array access - cache-timing attackslookup_table[secret];// 3. Integer division (processor dependent)data = secret / m;// 4. Shift operation (processor dependent)data = a << secret;
```
```
Phase 1: Static Analysis        Phase 2: Statistical Testing┌─────────────────┐            ┌─────────────────┐│ Identify secret │      →     │ Detect timing   ││ data flow       │            │ differences     ││ Tool: ct-verif  │            │ Tool: dudect    │└─────────────────┘            └─────────────────┘         ↓                              ↓Phase 4: Root Cause             Phase 3: Dynamic Tracing┌─────────────────┐            ┌─────────────────┐│ Pinpoint leak   │      ←     │ Track secret    ││ location        │            │ propagation     ││ Tool: Timecop   │            │ Tool: Timecop   │└─────────────────┘            └─────────────────┘
```
```
Phase 1: Static Analysis        Phase 2: Statistical Testing┌─────────────────┐            ┌─────────────────┐│ Identify secret │      →     │ Detect timing   ││ data flow       │            │ differences     ││ Tool: ct-verif  │            │ Tool: dudect    │└─────────────────┘            └─────────────────┘         ↓                              ↓Phase 4: Root Cause             Phase 3: Dynamic Tracing┌─────────────────┐            ┌─────────────────┐│ Pinpoint leak   │      ←     │ Track secret    ││ location        │            │ propagation     ││ Tool: Timecop   │            │ Tool: Timecop   │└─────────────────┘            └─────────────────┘
```
```
#define DUDECT_IMPLEMENTATION#include "dudect.h"uint8_t do_one_computation(uint8_t *data) {    // Code to measure goes here}void prepare_inputs(dudect_config_t *c, uint8_t *input_data, uint8_t *classes) {    for (size_t i = 0; i < c->number_measurements; i++) {        classes[i] = randombit();        uint8_t *input = input_data + (size_t)i * c->chunk_size;        if (classes[i] == 0) {            // Fixed input class        } else {            // Random input class        }    }}
```
```
#define DUDECT_IMPLEMENTATION#include "dudect.h"uint8_t do_one_computation(uint8_t *data) {    // Code to measure goes here}void prepare_inputs(dudect_config_t *c, uint8_t *input_data, uint8_t *classes) {    for (size_t i = 0; i < c->number_measurements; i++) {        classes[i] = randombit();        uint8_t *input = input_data + (size_t)i * c->chunk_size;        if (classes[i] == 0) {            // Fixed input class        } else {            // Random input class        }    }}
```
```
#include "valgrind/memcheck.h"#define poison(addr, len) VALGRIND_MAKE_MEM_UNDEFINED(addr, len)#define unpoison(addr, len) VALGRIND_MAKE_MEM_DEFINED(addr, len)int main() {    unsigned long long secret_key = 0x12345678;    // Mark secret as poisoned    poison(&secret_key, sizeof(secret_key));    // Any branching or memory access dependent on secret_key    // will be reported by Valgrind    crypto_operation(secret_key);    unpoison(&secret_key, sizeof(secret_key));}
```
```
#include "valgrind/memcheck.h"#define poison(addr, len) VALGRIND_MAKE_MEM_UNDEFINED(addr, len)#define unpoison(addr, len) VALGRIND_MAKE_MEM_DEFINED(addr, len)int main() {    unsigned long long secret_key = 0x12345678;    // Mark secret as poisoned    poison(&secret_key, sizeof(secret_key));    // Any branching or memory access dependent on secret_key    // will be reported by Valgrind    crypto_operation(secret_key);    unpoison(&secret_key, sizeof(secret_key));}
```
```
valgrind --leak-check=full --track-origins=yes ./binary
```
```
valgrind --leak-check=full --track-origins=yes ./binary
```
```
timeout 600 ./ct_test
```
```
poison()
```
```
objdump -d
```
```
if (secret_bit) { ... }
```
```
table[secret_index]
```
```
result = x / secret
```
```
result = x << secret
```
```
uint8_t do_one_computation(uint8_t *data) {    uint64_t base = ((uint64_t*)data)[0];    uint64_t exponent = ((uint64_t*)data)[1]; // Secret!    return mod_exp(base, exponent, MODULUS);}void prepare_inputs(dudect_config_t *c, uint8_t *input_data, uint8_t *classes) {    for (size_t i = 0; i < c->number_measurements; i++) {        classes[i] = randombit();        uint64_t *input = (uint64_t*)(input_data + i * c->chunk_size);        input[0] = rand(); // Random base        input[1] = (classes[i] == 0) ? FIXED_EXPONENT : rand(); // Fixed vs random    }}
```
```
uint8_t do_one_computation(uint8_t *data) {    uint64_t base = ((uint64_t*)data)[0];    uint64_t exponent = ((uint64_t*)data)[1]; // Secret!    return mod_exp(base, exponent, MODULUS);}void prepare_inputs(dudect_config_t *c, uint8_t *input_data, uint8_t *classes) {    for (size_t i = 0; i < c->number_measurements; i++) {        classes[i] = randombit();        uint64_t *input = (uint64_t*)(input_data + i * c->chunk_size);        input[0] = rand(); // Random base        input[1] = (classes[i] == 0) ? FIXED_EXPONENT : rand(); // Fixed vs random    }}
```
```
poison(&exponent, sizeof(exponent));result = mod_exp(base, exponent, modulus);unpoison(&exponent, sizeof(exponent));
```
```
poison(&exponent, sizeof(exponent));result = mod_exp(base, exponent, modulus);unpoison(&exponent, sizeof(exponent));
```
```
Conditional jump or move depends on uninitialised value(s)  at 0x40115D: mod_exp (example.c:14)
```
```
Conditional jump or move depends on uninitialised value(s)  at 0x40115D: mod_exp (example.c:14)
```
```
taskset -c 2
```
```
objdump -d
```
```
-O3 -march=native
```
```
-O0
```
```
-O3
```
```
┌─────────────────────────┐                    │  constant-time-analysis │                    │     (this skill)        │                    └───────────┬─────────────┘                                │                ┌───────────────┴───────────────┐                │                               │                ▼                               ▼    ┌───────────────────┐           ┌───────────────────┐    │      dudect       │           │     timecop       │    │  (statistical)    │           │    (dynamic)      │    └────────┬──────────┘           └────────┬──────────┘             │                               │             └───────────────┬───────────────┘                             │                             ▼              ┌──────────────────────────────┐              │   Supporting Techniques      │              │ coverage, CI integration     │              └──────────────────────────────┘
```
```
┌─────────────────────────┐                    │  constant-time-analysis │                    │     (this skill)        │                    └───────────┬─────────────┘                                │                ┌───────────────┴───────────────┐                │                               │                ▼                               ▼    ┌───────────────────┐           ┌───────────────────┐    │      dudect       │           │     timecop       │    │  (statistical)    │           │    (dynamic)      │    └────────┬──────────┘           └────────┬──────────┘             │                               │             └───────────────┬───────────────┘                             │                             ▼              ┌──────────────────────────────┐              │   Supporting Techniques      │              │ coverage, CI integration     │              └──────────────────────────────┘
```
In the realm of cybersecurity, even seemingly innocuous execution time differences can pose significant risks. This Agent Skill dives deep into 'Constant-Time Testing,' a critical methodology for fortifying cryptographic implementations against timing attacks. By understanding and applying constant-time principles, developers can ensure that sensitive operations execute in a predictable duration, regardless of the secret data being processed. It's not about breaking the math, but rather about preventing subtle, observable side-channels that attackers can exploit to extract confidential information. This skill empowers you to build more resilient and trustworthy secure systems.

# When to Use This Skill
- •Auditing existing cryptographic libraries and primitives for timing leakage.
- •Developing new security-sensitive algorithms and functions that require constant-time execution.
- •Integrating cryptographic modules into applications where side-channel resistance is paramount.
- •Training developers on secure coding practices specifically for cryptographic operations.

# Pro Tips
- 💡Always profile your code on diverse inputs, including edge cases and randomly generated secrets, to catch subtle timing differences that might not be obvious during development.
- 💡Utilize dedicated constant-time testing tools and frameworks (e.g., from BearSSL, libsodium) which can automate the detection of timing variations and simplify the auditing process.
- 💡Prioritize constant-time implementations for any operation involving secret keys, passwords, or other confidential data, even in seemingly unrelated parts of your application, as leakage can compound.

