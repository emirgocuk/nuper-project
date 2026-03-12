# ossfuzz
Source: https://antigravity.codes/agent-skills/security/ossfuzz

## AI Worker Instructions
When the user requests functionality related to ossfuzz, follow these guidelines and utilize this context.

## Scraped Content

# ossfuzz
```
git clone https://github.com/google/oss-fuzz
```
```
python3 infra/helper.py build_image --pull <project>
```
```
python3 infra/helper.py build_fuzzers --sanitizer=address <project>
```
```
python3 infra/helper.py run_fuzzer <project> <harness>
```
```
python3 infra/helper.py coverage <project>
```
```
python3 infra/helper.py --help
```
```
git clone https://github.com/google/oss-fuzzcd oss-fuzzpython3 infra/helper.py --help
```
```
git clone https://github.com/google/oss-fuzzcd oss-fuzzpython3 infra/helper.py --help
```
```
python3 infra/helper.py build_image --pull <project-name>
```
```
python3 infra/helper.py build_image --pull <project-name>
```
```
python3 infra/helper.py build_fuzzers --sanitizer=address <project-name>
```
```
python3 infra/helper.py build_fuzzers --sanitizer=address <project-name>
```
```
--sanitizer=address
```
```
/build/out/<project-name>/
```
```
python3 infra/helper.py run_fuzzer <project-name> <harness-name> [<fuzzer-args>]
```
```
python3 infra/helper.py run_fuzzer <project-name> <harness-name> [<fuzzer-args>]
```
```
python3 infra/helper.py build_fuzzers --sanitizer=coverage <project-name>python3 infra/helper.py coverage <project-name>
```
```
python3 infra/helper.py build_fuzzers --sanitizer=coverage <project-name>python3 infra/helper.py coverage <project-name>
```
```
--no-corpus-download
```
```
# Clone and navigate to OSS-Fuzzgit clone https://github.com/google/oss-fuzzcd oss-fuzz# Build and run irssi fuzzerpython3 infra/helper.py build_image --pull irssipython3 infra/helper.py build_fuzzers --sanitizer=address irssipython3 infra/helper.py run_fuzzer irssi irssi-fuzz
```
```
# Clone and navigate to OSS-Fuzzgit clone https://github.com/google/oss-fuzzcd oss-fuzz# Build and run irssi fuzzerpython3 infra/helper.py build_image --pull irssipython3 infra/helper.py build_fuzzers --sanitizer=address irssipython3 infra/helper.py run_fuzzer irssi irssi-fuzz
```
```
INFO:__main__:Running: docker run --rm --privileged --shm-size=2g --platform linux/amd64 -i -e FUZZING_ENGINE=libfuzzer -e SANITIZER=address -e RUN_FUZZER_MODE=interactive -e HELPER=True -v /private/tmp/oss-fuzz/build/out/irssi:/out -t gcr.io/oss-fuzz-base/base-runner run_fuzzer irssi-fuzz.Using seed corpus: irssi-fuzz_seed_corpus.zip/out/irssi-fuzz -rss_limit_mb=2560 -timeout=25 /tmp/irssi-fuzz_corpus -max_len=2048 < /dev/nullINFO: Running with entropic power schedule (0xFF, 100).INFO: Seed: 1531341664INFO: Loaded 1 modules   (95687 inline 8-bit counters): 95687 [0x1096c80, 0x10ae247),INFO: Loaded 1 PC tables (95687 PCs): 95687 [0x10ae248,0x1223eb8),INFO:      719 files found in /tmp/irssi-fuzz_corpusINFO: seed corpus: files: 719 min: 1b max: 170106b total: 367969b rss: 48Mb#720        INITED cov: 409 ft: 1738 corp: 640/163Kb exec/s: 0 rss: 62Mb#762        REDUCE cov: 409 ft: 1738 corp: 640/163Kb lim: 2048 exec/s: 0 rss: 63Mb L: 236/2048 MS: 2 ShuffleBytes-EraseBytes-
```
```
INFO:__main__:Running: docker run --rm --privileged --shm-size=2g --platform linux/amd64 -i -e FUZZING_ENGINE=libfuzzer -e SANITIZER=address -e RUN_FUZZER_MODE=interactive -e HELPER=True -v /private/tmp/oss-fuzz/build/out/irssi:/out -t gcr.io/oss-fuzz-base/base-runner run_fuzzer irssi-fuzz.Using seed corpus: irssi-fuzz_seed_corpus.zip/out/irssi-fuzz -rss_limit_mb=2560 -timeout=25 /tmp/irssi-fuzz_corpus -max_len=2048 < /dev/nullINFO: Running with entropic power schedule (0xFF, 100).INFO: Seed: 1531341664INFO: Loaded 1 modules   (95687 inline 8-bit counters): 95687 [0x1096c80, 0x10ae247),INFO: Loaded 1 PC tables (95687 PCs): 95687 [0x10ae248,0x1223eb8),INFO:      719 files found in /tmp/irssi-fuzz_corpusINFO: seed corpus: files: 719 min: 1b max: 170106b total: 367969b rss: 48Mb#720        INITED cov: 409 ft: 1738 corp: 640/163Kb exec/s: 0 rss: 62Mb#762        REDUCE cov: 409 ft: 1738 corp: 640/163Kb lim: 2048 exec/s: 0 rss: 63Mb L: 236/2048 MS: 2 ShuffleBytes-EraseBytes-
```
```
projects/<your-project>/
```
```
homepage: "https://github.com/yourorg/yourproject"language: c++primary_contact: "your-email@example.com"main_repo: "https://github.com/yourorg/yourproject"fuzzing_engines:  - libfuzzersanitizers:  - address  - undefined
```
```
homepage: "https://github.com/yourorg/yourproject"language: c++primary_contact: "your-email@example.com"main_repo: "https://github.com/yourorg/yourproject"fuzzing_engines:  - libfuzzersanitizers:  - address  - undefined
```
```
FROM gcr.io/oss-fuzz-base/base-builderRUN apt-get update && apt-get install -y \    autoconf \    automake \    libtool \    pkg-configRUN git clone --depth 1 https://github.com/yourorg/yourprojectWORKDIR yourprojectCOPY build.sh $SRC/
```
```
FROM gcr.io/oss-fuzz-base/base-builderRUN apt-get update && apt-get install -y \    autoconf \    automake \    libtool \    pkg-configRUN git clone --depth 1 https://github.com/yourorg/yourprojectWORKDIR yourprojectCOPY build.sh $SRC/
```
```
#!/bin/bash -eu./autogen.sh./configure --disable-sharedmake -j$(nproc)# Build harnesses$CXX $CXXFLAGS -std=c++11 -I. \    $SRC/yourproject/fuzz/harness.cc -o $OUT/harness \    $LIB_FUZZING_ENGINE ./libyourproject.a# Copy corpus and dictionary if availablecp $SRC/yourproject/fuzz/corpus.zip $OUT/harness_seed_corpus.zipcp $SRC/yourproject/fuzz/dictionary.dict $OUT/harness.dict
```
```
#!/bin/bash -eu./autogen.sh./configure --disable-sharedmake -j$(nproc)# Build harnesses$CXX $CXXFLAGS -std=c++11 -I. \    $SRC/yourproject/fuzz/harness.cc -o $OUT/harness \    $LIB_FUZZING_ENGINE ./libyourproject.a# Copy corpus and dictionary if availablecp $SRC/yourproject/fuzz/corpus.zip $OUT/harness_seed_corpus.zipcp $SRC/yourproject/fuzz/dictionary.dict $OUT/harness.dict
```
```
base_image
```
```
base_clang
```
```
base_builder_go
```
```
base_builder
```
```
base_clang
```
```
base_runner
```
```
c++extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Your fuzzing logic    return 0;}**Build in build.sh:**bash$CXX $CXXFLAGS -std=c++11 -I. \    harness.cc -o $OUT/harness \    $LIB_FUZZING_ENGINE ./libproject.a**Integration tips:**- Use $LIB_FUZZING_ENGINE variable provided by OSS-Fuzz- Include -fsanitize=fuzzer is handled automatically- Link against static libraries when possible### AFL++OSS-Fuzz supports AFL++ as an alternative fuzzing engine.**Enable in project.yaml:**yamlfuzzing_engines:  - afl  - libfuzzer**Integration tips:**- AFL++ harnesses work alongside libFuzzer harnesses- Use persistent mode for better performance- OSS-Fuzz handles engine-specific compilation flags### Atheris (Python)For Python projects with C extensions.**Example from [cbor2 integration](https://github.com/google/oss-fuzz/pull/11444):****Harness:**pythonimport atherisimport sysimport cbor2@atheris.instrument_funcdef TestOneInput(data):    fdp = atheris.FuzzedDataProvider(data)    try:        cbor2.loads(data)    except (cbor2.CBORDecodeError, ValueError):        passdef main():    atheris.Setup(sys.argv, TestOneInput)    atheris.Fuzz()if __name__ == "__main__":    main()**Build in build.sh:**bashpip3 install .for fuzzer in $(find $SRC -name 'fuzz_*.py'); do  compile_python_fuzzer $fuzzerdone**Integration tips:**- Use compile_python_fuzzer helper provided by OSS-Fuzz- See [Continuously Fuzzing Python C Extensions](https://blog.trailofbits.com/2024/02/23/continuously-fuzzing-python-c-extensions/) blog post### Rust Projects**Enable in project.yaml:**yamllanguage: rustfuzzing_engines:  - libfuzzersanitizers:  - address  # Only AddressSanitizer supported for Rust**Build in build.sh:**bashcargo fuzz build -O --debug-assertionscp fuzz/target/x86_64-unknown-linux-gnu/release/fuzz_target_1 $OUT/
```
```
**Build in build.sh:**
```
```
**Build in build.sh:**
```
```
**Integration tips:**- Use $LIB_FUZZING_ENGINE variable provided by OSS-Fuzz- Include -fsanitize=fuzzer is handled automatically- Link against static libraries when possible### AFL++OSS-Fuzz supports AFL++ as an alternative fuzzing engine.**Enable in project.yaml:**
```
```
**Integration tips:**- Use
```
```
variable provided by OSS-Fuzz- Include
```
```
is handled automatically- Link against static libraries when possible### AFL++OSS-Fuzz supports AFL++ as an alternative fuzzing engine.**Enable in project.yaml:**
```
```
**Integration tips:**- AFL++ harnesses work alongside libFuzzer harnesses- Use persistent mode for better performance- OSS-Fuzz handles engine-specific compilation flags### Atheris (Python)For Python projects with C extensions.**Example from [cbor2 integration](https://github.com/google/oss-fuzz/pull/11444):****Harness:**
```
```
**Integration tips:**- AFL++ harnesses work alongside libFuzzer harnesses- Use persistent mode for better performance- OSS-Fuzz handles engine-specific compilation flags### Atheris (Python)For Python projects with C extensions.**Example from [cbor2 integration](https://github.com/google/oss-fuzz/pull/11444):****Harness:**
```
```
**Build in build.sh:**
```
```
**Build in build.sh:**
```
```
**Integration tips:**- Use compile_python_fuzzer helper provided by OSS-Fuzz- See [Continuously Fuzzing Python C Extensions](https://blog.trailofbits.com/2024/02/23/continuously-fuzzing-python-c-extensions/) blog post### Rust Projects**Enable in project.yaml:**
```
```
**Integration tips:**- Use
```
```
helper provided by OSS-Fuzz- See [Continuously Fuzzing Python C Extensions](https://blog.trailofbits.com/2024/02/23/continuously-fuzzing-python-c-extensions/) blog post### Rust Projects**Enable in project.yaml:**
```
```
**Build in build.sh:**
```
```
**Build in build.sh:**
```
```
**Integration tips:**- [Rust supports only AddressSanitizer with libfuzzer](https://google.github.io/oss-fuzz/getting-started/new-project-guide/rust-lang/#projectyaml)- Use cargo-fuzz for local development- OSS-Fuzz handles Rust-specific compilation## Troubleshooting| Issue | Cause | Solution ||-------|-------|----------|| **Build fails with missing dependencies** | Dependencies not in Dockerfile | Add
```
Dive into the world of proactive software security with the OSS-Fuzz Agent Skill. This powerful tool empowers developers to integrate continuous fuzz testing into their workflows, identifying critical vulnerabilities before they impact users. Whether you're setting up new fuzzing harnesses, interpreting coverage reports, or optimizing your project for OSS-Fuzz enrollment, this skill provides expert guidance. It demystifies the complexities of distributed fuzzing infrastructure, helping you leverage Google's robust framework to build more resilient and secure applications with greater efficiency.

# When to Use This Skill
- •Automating the setup and configuration of new fuzzing harnesses for a project.
- •Interpreting and summarizing coverage reports generated by OSS-Fuzz for quick security insights.
- •Troubleshooting build issues when integrating a new project with the OSS-Fuzz infrastructure.
- •Generating `project.yaml` and `Dockerfile` templates for OSS-Fuzz enrollment guidance.

# Pro Tips
- 💡Always specify the target fuzzer and project when using helper.py commands to ensure accuracy and prevent errors.
- 💡Combine this skill with code review skills to cross-reference identified fuzzing issues with potential code weaknesses.
- 💡Use the skill to generate explanations for OSS-Fuzz concepts like Base Images or Criticality Score when onboarding new team members.

