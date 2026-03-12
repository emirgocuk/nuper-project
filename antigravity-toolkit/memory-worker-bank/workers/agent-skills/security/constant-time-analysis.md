# constant-time-analysis
Source: https://antigravity.codes/agent-skills/security/constant-time-analysis

## AI Worker Instructions
When the user requests functionality related to constant-time-analysis, follow these guidelines and utilize this context.

## Scraped Content

# constant-time-analysis
```
User writing crypto code? ──yes──> Use this skill         │         no         │         vUser asking about timing attacks? ──yes──> Use this skill         │         no         │         vCode handles secret keys/tokens? ──yes──> Use this skill         │         no         │         vSkip this skill
```
```
User writing crypto code? ──yes──> Use this skill         │         no         │         vUser asking about timing attacks? ──yes──> Use this skill         │         no         │         vCode handles secret keys/tokens? ──yes──> Use this skill         │         no         │         vSkip this skill
```
```
/
```
```
%
```
```
sign
```
```
verify
```
```
encrypt
```
```
decrypt
```
```
derive_key
```
```
.c
```
```
.h
```
```
.cpp
```
```
.cc
```
```
.hpp
```
```
.go
```
```
.rs
```
```
.swift
```
```
.java
```
```
.kt
```
```
.kts
```
```
.cs
```
```
.php
```
```
.js
```
```
.mjs
```
```
.cjs
```
```
.ts
```
```
.tsx
```
```
.py
```
```
.rb
```
```
# Analyze any supported file typeuv run {baseDir}/ct_analyzer/analyzer.py <source_file># Include conditional branch warningsuv run {baseDir}/ct_analyzer/analyzer.py --warnings <source_file># Filter to specific functionsuv run {baseDir}/ct_analyzer/analyzer.py --func 'sign|verify' <source_file># JSON output for CIuv run {baseDir}/ct_analyzer/analyzer.py --json <source_file>
```
```
# Analyze any supported file typeuv run {baseDir}/ct_analyzer/analyzer.py <source_file># Include conditional branch warningsuv run {baseDir}/ct_analyzer/analyzer.py --warnings <source_file># Filter to specific functionsuv run {baseDir}/ct_analyzer/analyzer.py --func 'sign|verify' <source_file># JSON output for CIuv run {baseDir}/ct_analyzer/analyzer.py --json <source_file>
```
```
# Cross-architecture testing (RECOMMENDED)uv run {baseDir}/ct_analyzer/analyzer.py --arch x86_64 crypto.cuv run {baseDir}/ct_analyzer/analyzer.py --arch arm64 crypto.c# Multiple optimization levelsuv run {baseDir}/ct_analyzer/analyzer.py --opt-level O0 crypto.cuv run {baseDir}/ct_analyzer/analyzer.py --opt-level O3 crypto.c
```
```
# Cross-architecture testing (RECOMMENDED)uv run {baseDir}/ct_analyzer/analyzer.py --arch x86_64 crypto.cuv run {baseDir}/ct_analyzer/analyzer.py --arch arm64 crypto.c# Multiple optimization levelsuv run {baseDir}/ct_analyzer/analyzer.py --opt-level O0 crypto.cuv run {baseDir}/ct_analyzer/analyzer.py --opt-level O3 crypto.c
```
```
# Analyze Java bytecodeuv run {baseDir}/ct_analyzer/analyzer.py CryptoUtils.java# Analyze Kotlin bytecode (Android/JVM)uv run {baseDir}/ct_analyzer/analyzer.py CryptoUtils.kt# Analyze C# ILuv run {baseDir}/ct_analyzer/analyzer.py CryptoUtils.cs
```
```
# Analyze Java bytecodeuv run {baseDir}/ct_analyzer/analyzer.py CryptoUtils.java# Analyze Kotlin bytecode (Android/JVM)uv run {baseDir}/ct_analyzer/analyzer.py CryptoUtils.kt# Analyze C# ILuv run {baseDir}/ct_analyzer/analyzer.py CryptoUtils.cs
```
```
--arch
```
```
--opt-level
```
```
# Analyze Swift for native architectureuv run {baseDir}/ct_analyzer/analyzer.py crypto.swift# Analyze for specific architecture (iOS devices)uv run {baseDir}/ct_analyzer/analyzer.py --arch arm64 crypto.swift# Analyze with different optimization levelsuv run {baseDir}/ct_analyzer/analyzer.py --opt-level O0 crypto.swift
```
```
# Analyze Swift for native architectureuv run {baseDir}/ct_analyzer/analyzer.py crypto.swift# Analyze for specific architecture (iOS devices)uv run {baseDir}/ct_analyzer/analyzer.py --arch arm64 crypto.swift# Analyze with different optimization levelsuv run {baseDir}/ct_analyzer/analyzer.py --opt-level O0 crypto.swift
```
```
--arch
```
```
--opt-level
```
```
gcc
```
```
clang
```
```
go
```
```
rustc
```
```
swiftc
```
```
javac
```
```
javap
```
```
kotlinc
```
```
javap
```
```
ilspycmd
```
```
dotnet tool install -g ilspycmd
```
```
--dump=insns
```
```
# For Java (add to ~/.zshrc)export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"# For .NET tools (add to ~/.zshrc)export PATH="$HOME/.dotnet/tools:$PATH"
```
```
# For Java (add to ~/.zshrc)export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"# For .NET tools (add to ~/.zshrc)export PATH="$HOME/.dotnet/tools:$PATH"
```
```
crypto/subtle
```
```
[ERROR] SDIV  Function: decompose_vulnerable  Reason: SDIV has early termination optimization; execution time depends on operand values
```
```
[ERROR] SDIV  Function: decompose_vulnerable  Reason: SDIV has early termination optimization; execution time depends on operand values
```
```
// FALSE POSITIVE: Division uses public constant, not secret   int num_blocks = data_len / 16;  // data_len is length, not content   // TRUE POSITIVE: Division involves secret-derived value   int32_t q = secret_coef / GAMMA2;  // secret_coef from private key
```
```
// FALSE POSITIVE: Division uses public constant, not secret   int num_blocks = data_len / 16;  // data_len is length, not content   // TRUE POSITIVE: Division involves secret-derived value   int32_t q = secret_coef / GAMMA2;  // secret_coef from private key
```
This skill specializes in identifying a subtle yet critical class of vulnerabilities known as timing side-channel attacks within cryptographic implementations. Even seemingly innocuous operations can inadvertently leak sensitive information, such as secret keys, through variations in execution time. Developers working with encryption, digital signatures, or key derivation algorithms require robust mechanisms to ensure their code executes in a constant time, regardless of the secret values being processed. This agent skill acts as a vigilant assistant, meticulously scanning your code for patterns that could expose secrets, helping you build more resilient and secure cryptographic systems against advanced adversaries. It’s an essential tool for securing sensitive operations and upholding data confidentiality.

# When to Use This Skill
- •Implementing new cryptographic primitives like encryption, hashing, or digital signatures.
- •Reviewing existing security-sensitive code for secret-dependent branches or division operations.
- •Debugging or auditing code suspected of having timing side-channel vulnerabilities.
- •Preparing for security audits or compliance checks on cryptographic modules.

# Pro Tips
- 💡Run this skill early and often during cryptographic development to catch issues before they compound.
- 💡Combine with other security analysis skills (e.g., input validation, memory safety) for comprehensive code hardening.
- 💡Provide specific code snippets or function names (e.g., `sign`, `encrypt`) when prompting for focused analysis.

