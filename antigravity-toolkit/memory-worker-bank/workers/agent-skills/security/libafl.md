# libafl
Source: https://antigravity.codes/agent-skills/security/libafl

## AI Worker Instructions
When the user requests functionality related to libafl, follow these guidelines and utilize this context.

## Scraped Content

# libafl
```
c++extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Call your code with fuzzer-provided data    my_function(data, size);    return 0;}Build LibAFL's libFuzzer compatibility layer:bashgit clone https://github.com/AFLplusplus/LibAFLcd LibAFL/libafl_libfuzzer_runtime./build.shCompile and run:bashclang++ -DNO_MAIN -g -O2 -fsanitize=fuzzer-no-link libFuzzer.a harness.cc main.cc -o fuzz./fuzz corpus/## Installation### Prerequisites- Clang/LLVM 15-18- Rust (via rustup)- Additional system dependencies### Linux/macOSInstall Clang:bashapt install clangOr install a specific version via apt.llvm.org:bashwget https://apt.llvm.org/llvm.shchmod +x llvm.shsudo ./llvm.sh 15Configure environment for Rust:bashexport RUSTFLAGS="-C linker=/usr/bin/clang-15"export CC="clang-15"export CXX="clang++-15"Install Rust:bashcurl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | shInstall additional dependencies:bashapt install libssl-dev pkg-configFor libFuzzer compatibility mode, install nightly Rust:bashrustup toolchain install nightly --component llvm-tools### VerificationBuild LibAFL to verify installation:bashcd LibAFL/libafl_libfuzzer_runtime./build.sh# Should produce libFuzzer.a## Writing a HarnessLibAFL harnesses follow the same pattern as libFuzzer when using drop-in replacement mode:c++extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {    // Your fuzzing target code here    return 0;}When building custom fuzzers with LibAFL as a Rust library, harness logic is integrated directly into the fuzzer. See the "Writing a Custom Fuzzer" section below for the full pattern.> **See Also:** For detailed harness writing techniques, see the **harness-writing** technique skill.## Usage ModesLibAFL supports two primary usage modes:### 1. libFuzzer Drop-in ReplacementUse LibAFL as a replacement for libFuzzer with existing harnesses.**Compilation:**bashclang++ -DNO_MAIN -g -O2 -fsanitize=fuzzer-no-link libFuzzer.a harness.cc main.cc -o fuzz**Running:**bash./fuzz corpus/**Recommended for long campaigns:**bash./fuzz -fork=1 -ignore_crashes=1 corpus/### 2. Custom Fuzzer as Rust LibraryBuild a fully customized fuzzer using LibAFL components.**Create project:**bashcargo init --lib my_fuzzercd my_fuzzercargo add libafl@0.13 libafl_targets@0.13 libafl_bolts@0.13 libafl_cc@0.13 \  --features "libafl_targets@0.13/libfuzzer,libafl_targets@0.13/sancov_pcguard_hitcounts"**Configure Cargo.toml:**toml[lib]crate-type = ["staticlib"]## Writing a Custom Fuzzer> **See Also:** For detailed harness writing techniques, patterns for handling complex inputs,> and advanced strategies, see the **fuzz-harness-writing** technique skill.### Fuzzer ComponentsA LibAFL fuzzer consists of modular components:1. **Observers** - Collect execution feedback (coverage, timing)2. **Feedback** - Determine if inputs are interesting3. **Objective** - Define fuzzing goals (crashes, timeouts)4. **State** - Maintain corpus and metadata5. **Mutators** - Generate new inputs6. **Scheduler** - Select which inputs to mutate7. **Executor** - Run the target with inputs### Basic Fuzzer Structurerustuse libafl::prelude::*;use libafl_bolts::prelude::*;use libafl_targets::{libfuzzer_test_one_input, std_edges_map_observer};#[no_mangle]pub extern "C" fn libafl_main() {    let mut run_client = |state: Option<_>, mut restarting_mgr, _core_id| {        // 1. Setup observers        let edges_observer = HitcountsMapObserver::new(            unsafe { std_edges_map_observer("edges") }        ).track_indices();        let time_observer = TimeObserver::new("time");        // 2. Define feedback        let mut feedback = feedback_or!(            MaxMapFeedback::new(&edges_observer),            TimeFeedback::new(&time_observer)        );        // 3. Define objective        let mut objective = feedback_or_fast!(            CrashFeedback::new(),            TimeoutFeedback::new()        );        // 4. Create or restore state        let mut state = state.unwrap_or_else(|| {            StdState::new(                StdRand::new(),                InMemoryCorpus::new(),                OnDiskCorpus::new(&output_dir).unwrap(),                &mut feedback,                &mut objective,            ).unwrap()        });        // 5. Setup mutator        let mutator = StdScheduledMutator::new(havoc_mutations());        let mut stages = tuple_list!(StdMutationalStage::new(mutator));        // 6. Setup scheduler        let scheduler = IndexesLenTimeMinimizerScheduler::new(            &edges_observer,            QueueScheduler::new()        );        // 7. Create fuzzer        let mut fuzzer = StdFuzzer::new(scheduler, feedback, objective);        // 8. Define harness        let mut harness = |input: &BytesInput| {            let buf = input.target_bytes().as_slice();            libfuzzer_test_one_input(buf);            ExitKind::Ok        };        // 9. Setup executor        let mut executor = InProcessExecutor::with_timeout(            &mut harness,            tuple_list!(edges_observer, time_observer),            &mut fuzzer,            &mut state,            &mut restarting_mgr,            timeout,        )?;        // 10. Load initial inputs        if state.must_load_initial_inputs() {            state.load_initial_inputs(                &mut fuzzer,                &mut executor,                &mut restarting_mgr,                &input_dir            )?;        }        // 11. Start fuzzing        fuzzer.fuzz_loop(&mut stages, &mut executor, &mut state, &mut restarting_mgr)?;        Ok(())    };    // Launch fuzzer    Launcher::builder()        .run_client(&mut run_client)        .cores(&cores)        .build()        .launch()        .unwrap();}## Compilation### Verbose ModeManually specify all instrumentation flags:bashclang++-15 -DNO_MAIN -g -O2 \  -fsanitize-coverage=trace-pc-guard \  -fsanitize=address \  -Wl,--whole-archive target/release/libmy_fuzzer.a -Wl,--no-whole-archive \  main.cc harness.cc -o fuzz### Compiler Wrapper (Recommended)Create a LibAFL compiler wrapper to handle instrumentation automatically.**Create src/bin/libafl_cc.rs:**rustuse libafl_cc::{ClangWrapper, CompilerWrapper, Configuration, ToolWrapper};pub fn main() {    let args: Vec<String> = env::args().collect();    let mut cc = ClangWrapper::new();    cc.cpp(is_cpp)      .parse_args(&args)      .link_staticlib(&dir, "my_fuzzer")      .add_args(&Configuration::GenerateCoverageMap.to_flags().unwrap())      .add_args(&Configuration::AddressSanitizer.to_flags().unwrap())      .run()      .unwrap();}**Compile and use:**bashcargo build --releasetarget/release/libafl_cxx -DNO_MAIN -g -O2 main.cc harness.cc -o fuzz> **See Also:** For detailed sanitizer configuration, common issues, and advanced flags,> see the **address-sanitizer** and **undefined-behavior-sanitizer** technique skills.## Running Campaigns### Basic Runbash./fuzz --cores 0 --input corpus/### Multi-Core Fuzzingbash./fuzz --cores 0,8-15 --input corpus/This runs 9 clients: one on core 0, and 8 on cores 8-15.### With Optionsbash./fuzz --cores 0-7 --input corpus/ --output crashes/ --timeout 1000### Text User Interface (TUI)Enable graphical statistics view:bash./fuzz -tui=1 corpus/### Interpreting Output| Output | Meaning ||--------|---------|| corpus: N | Number of interesting test cases found || objectives: N | Number of crashes/timeouts found || executions: N | Total number of target invocations || exec/sec: N | Current execution throughput || edges: X% | Code coverage percentage || clients: N | Number of parallel fuzzing processes |The fuzzer emits two main event types:- **UserStats** - Regular heartbeat with current statistics- **Testcase** - New interesting input discovered## Advanced Usage### Tips and Tricks| Tip | Why It Helps ||-----|--------------|| Use -fork=1 -ignore_crashes=1 | Continue fuzzing after first crash || Use InMemoryOnDiskCorpus | Persist corpus across restarts || Enable TUI with -tui=1 | Better visualization of progress || Use specific LLVM version | Avoid compatibility issues || Set RUSTFLAGS correctly | Prevent linking errors |### Crash DeduplicationAvoid storing duplicate crashes from the same bug:**Add backtrace observer:**rustlet backtrace_observer = BacktraceObserver::owned(    "BacktraceObserver",    libafl::observers::HarnessType::InProcess);**Update executor:**rustlet mut executor = InProcessExecutor::with_timeout(    &mut harness,    tuple_list!(edges_observer, time_observer, backtrace_observer),    &mut fuzzer,    &mut state,    &mut restarting_mgr,    timeout,)?;**Update objective with hash feedback:**rustlet mut objective = feedback_and!(    feedback_or_fast!(CrashFeedback::new(), TimeoutFeedback::new()),    NewHashFeedback::new(&backtrace_observer));This ensures only crashes with unique backtraces are saved.### Dictionary FuzzingUse dictionaries to guide fuzzing toward specific tokens:**Add tokens from file:**rustlet mut tokens = Tokens::new();if let Some(tokenfile) = &tokenfile {    tokens.add_from_file(tokenfile)?;}state.add_metadata(tokens);**Update mutator:**rustlet mutator = StdScheduledMutator::new(    havoc_mutations().merge(tokens_mutations()));**Hard-coded tokens example (PNG):**ruststate.add_metadata(Tokens::from([    vec![137, 80, 78, 71, 13, 10, 26, 10], // PNG header    "IHDR".as_bytes().to_vec(),    "IDAT".as_bytes().to_vec(),    "PLTE".as_bytes().to_vec(),    "IEND".as_bytes().to_vec(),]));> **See Also:** For detailed dictionary creation strategies and format-specific dictionaries,> see the **fuzzing-dictionaries** technique skill.### Auto TokensAutomatically extract magic values and checksums from the program:**Enable in compiler wrapper:**rustcc.add_pass(LLVMPasses::AutoTokens)**Load auto tokens in fuzzer:**rusttokens += libafl_targets::autotokens()?;**Verify tokens section:**bashecho "p (uint8_t *)__token_start" | gdb fuzz### Performance Tuning| Setting | Impact ||---------|--------|| Multi-core fuzzing | Linear speedup with cores || InMemoryCorpus | Faster but non-persistent || InMemoryOnDiskCorpus | Balanced speed and persistence || Sanitizers | 2-5x slowdown, essential for bugs || Optimization level -O2 | Balance between speed and coverage |### Debugging FuzzerRun fuzzer in single-process mode for easier debugging:rust// Replace launcher with direct callrun_client(None, SimpleEventManager::new(monitor), 0).unwrap();// Comment out:// Launcher::builder()//     .run_client(&mut run_client)//     ...//     .launch()Then debug with GDB:bashgdb --args ./fuzz --cores 0 --input corpus/## Real-World Examples### Example: libpngFuzzing libpng using LibAFL:**1. Get source code:**bashcurl -L -O https://downloads.sourceforge.net/project/libpng/libpng16/1.6.37/libpng-1.6.37.tar.xztar xf libpng-1.6.37.tar.xzcd libpng-1.6.37/apt install zlib1g-dev**2. Set compiler wrapper:**bashexport FUZZER_CARGO_DIR="/path/to/libafl/project"export CC=$FUZZER_CARGO_DIR/target/release/libafl_ccexport CXX=$FUZZER_CARGO_DIR/target/release/libafl_cxx**3. Build static library:**bash./configure --enable-shared=nomake**4. Get harness:**bashcurl -O https://raw.githubusercontent.com/glennrp/libpng/f8e5fa92b0e37ab597616f554bee254157998227/contrib/oss-fuzz/libpng_read_fuzzer.cc**5. Link fuzzer:**bash$CXX libpng_read_fuzzer.cc .libs/libpng16.a -lz -o fuzz**6. Prepare seeds:**bashmkdir seeds/curl -o seeds/input.png https://raw.githubusercontent.com/glennrp/libpng/acfd50ae0ba3198ad734e5d4dec2b05341e50924/contrib/pngsuite/iftp1n3p08.png**7. Get dictionary (optional):**bashcurl -O https://raw.githubusercontent.com/glennrp/libpng/2fff013a6935967960a5ae626fc21432807933dd/contrib/oss-fuzz/png.dict**8. Start fuzzing:**bash./fuzz --input seeds/ --cores 0 -x png.dict### Example: CMake ProjectIntegrate LibAFL with CMake build system:**CMakeLists.txt:**cmakeproject(BuggyProgram)cmake_minimum_required(VERSION 3.0)add_executable(buggy_program main.cc)add_executable(fuzz main.cc harness.cc)target_compile_definitions(fuzz PRIVATE NO_MAIN=1)target_compile_options(fuzz PRIVATE -g -O2)**Build non-instrumented binary:**bashcmake -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ .cmake --build . --target buggy_program**Build fuzzer:**bashexport FUZZER_CARGO_DIR="/path/to/libafl/project"cmake -DCMAKE_C_COMPILER=$FUZZER_CARGO_DIR/target/release/libafl_cc \      -DCMAKE_CXX_COMPILER=$FUZZER_CARGO_DIR/target/release/libafl_cxx .cmake --build . --target fuzz**Run fuzzing:**bash./fuzz --input seeds/ --cores 0
```
```
Build LibAFL's libFuzzer compatibility layer:
```
```
Build LibAFL's libFuzzer compatibility layer:
```
```
Compile and run:
```
```
Compile and run:
```
```
## Installation### Prerequisites- Clang/LLVM 15-18- Rust (via rustup)- Additional system dependencies### Linux/macOSInstall Clang:
```
```
## Installation### Prerequisites- Clang/LLVM 15-18- Rust (via rustup)- Additional system dependencies### Linux/macOSInstall Clang:
```
```
Or install a specific version via apt.llvm.org:
```
```
Or install a specific version via apt.llvm.org:
```
```
Configure environment for Rust:
```
```
Configure environment for Rust:
```
```
Install Rust:
```
```
Install Rust:
```
```
Install additional dependencies:
```
```
Install additional dependencies:
```
```
For libFuzzer compatibility mode, install nightly Rust:
```
```
For libFuzzer compatibility mode, install nightly Rust:
```
```
### VerificationBuild LibAFL to verify installation:
```
```
### VerificationBuild LibAFL to verify installation:
```
```
## Writing a HarnessLibAFL harnesses follow the same pattern as libFuzzer when using drop-in replacement mode:
```
```
## Writing a HarnessLibAFL harnesses follow the same pattern as libFuzzer when using drop-in replacement mode:
```
```
When building custom fuzzers with LibAFL as a Rust library, harness logic is integrated directly into the fuzzer. See the "Writing a Custom Fuzzer" section below for the full pattern.> **See Also:** For detailed harness writing techniques, see the **harness-writing** technique skill.## Usage ModesLibAFL supports two primary usage modes:### 1. libFuzzer Drop-in ReplacementUse LibAFL as a replacement for libFuzzer with existing harnesses.**Compilation:**
```
```
When building custom fuzzers with LibAFL as a Rust library, harness logic is integrated directly into the fuzzer. See the "Writing a Custom Fuzzer" section below for the full pattern.> **See Also:** For detailed harness writing techniques, see the **harness-writing** technique skill.## Usage ModesLibAFL supports two primary usage modes:### 1. libFuzzer Drop-in ReplacementUse LibAFL as a replacement for libFuzzer with existing harnesses.**Compilation:**
```
```
**Running:**
```
```
**Running:**
```
```
**Recommended for long campaigns:**
```
```
**Recommended for long campaigns:**
```
```
### 2. Custom Fuzzer as Rust LibraryBuild a fully customized fuzzer using LibAFL components.**Create project:**
```
```
### 2. Custom Fuzzer as Rust LibraryBuild a fully customized fuzzer using LibAFL components.**Create project:**
```
```
**Configure Cargo.toml:**
```
```
**Configure Cargo.toml:**
```
```
## Writing a Custom Fuzzer> **See Also:** For detailed harness writing techniques, patterns for handling complex inputs,> and advanced strategies, see the **fuzz-harness-writing** technique skill.### Fuzzer ComponentsA LibAFL fuzzer consists of modular components:1. **Observers** - Collect execution feedback (coverage, timing)2. **Feedback** - Determine if inputs are interesting3. **Objective** - Define fuzzing goals (crashes, timeouts)4. **State** - Maintain corpus and metadata5. **Mutators** - Generate new inputs6. **Scheduler** - Select which inputs to mutate7. **Executor** - Run the target with inputs### Basic Fuzzer Structure
```
```
## Writing a Custom Fuzzer> **See Also:** For detailed harness writing techniques, patterns for handling complex inputs,> and advanced strategies, see the **fuzz-harness-writing** technique skill.### Fuzzer ComponentsA LibAFL fuzzer consists of modular components:1. **Observers** - Collect execution feedback (coverage, timing)2. **Feedback** - Determine if inputs are interesting3. **Objective** - Define fuzzing goals (crashes, timeouts)4. **State** - Maintain corpus and metadata5. **Mutators** - Generate new inputs6. **Scheduler** - Select which inputs to mutate7. **Executor** - Run the target with inputs### Basic Fuzzer Structure
```
```
## Compilation### Verbose ModeManually specify all instrumentation flags:
```
```
## Compilation### Verbose ModeManually specify all instrumentation flags:
```
```
### Compiler Wrapper (Recommended)Create a LibAFL compiler wrapper to handle instrumentation automatically.**Create src/bin/libafl_cc.rs:**
```
```
### Compiler Wrapper (Recommended)Create a LibAFL compiler wrapper to handle instrumentation automatically.**Create
```
```
:**
```
```
**Compile and use:**
```
```
**Compile and use:**
```
```
> **See Also:** For detailed sanitizer configuration, common issues, and advanced flags,> see the **address-sanitizer** and **undefined-behavior-sanitizer** technique skills.## Running Campaigns### Basic Run
```
```
> **See Also:** For detailed sanitizer configuration, common issues, and advanced flags,> see the **address-sanitizer** and **undefined-behavior-sanitizer** technique skills.## Running Campaigns### Basic Run
```
```
### Multi-Core Fuzzing
```
```
### Multi-Core Fuzzing
```
```
This runs 9 clients: one on core 0, and 8 on cores 8-15.### With Options
```
```
This runs 9 clients: one on core 0, and 8 on cores 8-15.### With Options
```
```
### Text User Interface (TUI)Enable graphical statistics view:
```
```
### Text User Interface (TUI)Enable graphical statistics view:
```
```
### Interpreting Output| Output | Meaning ||--------|---------|| corpus: N | Number of interesting test cases found || objectives: N | Number of crashes/timeouts found || executions: N | Total number of target invocations || exec/sec: N | Current execution throughput || edges: X% | Code coverage percentage || clients: N | Number of parallel fuzzing processes |The fuzzer emits two main event types:- **UserStats** - Regular heartbeat with current statistics- **Testcase** - New interesting input discovered## Advanced Usage### Tips and Tricks| Tip | Why It Helps ||-----|--------------|| Use -fork=1 -ignore_crashes=1 | Continue fuzzing after first crash || Use InMemoryOnDiskCorpus | Persist corpus across restarts || Enable TUI with -tui=1 | Better visualization of progress || Use specific LLVM version | Avoid compatibility issues || Set RUSTFLAGS correctly | Prevent linking errors |### Crash DeduplicationAvoid storing duplicate crashes from the same bug:**Add backtrace observer:**
```
```
### Interpreting Output| Output | Meaning ||--------|---------||
```
```
| Number of interesting test cases found ||
```
```
| Number of crashes/timeouts found ||
```
```
| Total number of target invocations ||
```
```
| Current execution throughput ||
```
```
| Code coverage percentage ||
```
```
| Number of parallel fuzzing processes |The fuzzer emits two main event types:- **UserStats** - Regular heartbeat with current statistics- **Testcase** - New interesting input discovered## Advanced Usage### Tips and Tricks| Tip | Why It Helps ||-----|--------------|| Use
```
```
| Continue fuzzing after first crash || Use
```
```
| Persist corpus across restarts || Enable TUI with
```
```
| Better visualization of progress || Use specific LLVM version | Avoid compatibility issues || Set
```
```
correctly | Prevent linking errors |### Crash DeduplicationAvoid storing duplicate crashes from the same bug:**Add backtrace observer:**
```
```
**Update executor:**
```
```
**Update executor:**
```
```
**Update objective with hash feedback:**
```
```
**Update objective with hash feedback:**
```
```
This ensures only crashes with unique backtraces are saved.### Dictionary FuzzingUse dictionaries to guide fuzzing toward specific tokens:**Add tokens from file:**
```
```
This ensures only crashes with unique backtraces are saved.### Dictionary FuzzingUse dictionaries to guide fuzzing toward specific tokens:**Add tokens from file:**
```
```
**Update mutator:**
```
```
**Update mutator:**
```
```
**Hard-coded tokens example (PNG):**
```
```
**Hard-coded tokens example (PNG):**
```
```
> **See Also:** For detailed dictionary creation strategies and format-specific dictionaries,> see the **fuzzing-dictionaries** technique skill.### Auto TokensAutomatically extract magic values and checksums from the program:**Enable in compiler wrapper:**
```
```
> **See Also:** For detailed dictionary creation strategies and format-specific dictionaries,> see the **fuzzing-dictionaries** technique skill.### Auto TokensAutomatically extract magic values and checksums from the program:**Enable in compiler wrapper:**
```
```
**Load auto tokens in fuzzer:**
```
```
**Load auto tokens in fuzzer:**
```
```
**Verify tokens section:**
```
```
**Verify tokens section:**
```
```
### Performance Tuning| Setting | Impact ||---------|--------|| Multi-core fuzzing | Linear speedup with cores || InMemoryCorpus | Faster but non-persistent || InMemoryOnDiskCorpus | Balanced speed and persistence || Sanitizers | 2-5x slowdown, essential for bugs || Optimization level -O2 | Balance between speed and coverage |### Debugging FuzzerRun fuzzer in single-process mode for easier debugging:
```
```
### Performance Tuning| Setting | Impact ||---------|--------|| Multi-core fuzzing | Linear speedup with cores ||
```
```
| Faster but non-persistent ||
```
```
| Balanced speed and persistence || Sanitizers | 2-5x slowdown, essential for bugs || Optimization level
```
```
| Balance between speed and coverage |### Debugging FuzzerRun fuzzer in single-process mode for easier debugging:
```
```
Then debug with GDB:
```
```
Then debug with GDB:
```
```
## Real-World Examples### Example: libpngFuzzing libpng using LibAFL:**1. Get source code:**
```
```
## Real-World Examples### Example: libpngFuzzing libpng using LibAFL:**1. Get source code:**
```
```
**2. Set compiler wrapper:**
```
```
**2. Set compiler wrapper:**
```
```
**3. Build static library:**
```
```
**3. Build static library:**
```
```
**4. Get harness:**
```
```
**4. Get harness:**
```
```
**5. Link fuzzer:**
```
```
**5. Link fuzzer:**
```
```
**6. Prepare seeds:**
```
```
**6. Prepare seeds:**
```
```
**7. Get dictionary (optional):**
```
```
**7. Get dictionary (optional):**
```
```
**8. Start fuzzing:**
```
```
**8. Start fuzzing:**
```
```
### Example: CMake ProjectIntegrate LibAFL with CMake build system:**CMakeLists.txt:**
```
```
### Example: CMake ProjectIntegrate LibAFL with CMake build system:**CMakeLists.txt:**
```
```
**Build non-instrumented binary:**
```
```
**Build non-instrumented binary:**
```
```
**Build fuzzer:**
```
```
**Build fuzzer:**
```
```
**Run fuzzing:**
```
```
**Run fuzzing:**
```
```
## Troubleshooting| Problem | Cause | Solution ||---------|-------|----------|| No coverage increases | Instrumentation failed | Verify compiler wrapper used, check for
```
```
|| Fuzzer won't start | Empty corpus with no interesting inputs | Provide seed inputs that trigger code paths || Linker errors with
```
```
| Runtime not linked | Use
```
```
or
```
```
|| LLVM version mismatch | LibAFL requires LLVM 15-18 | Install compatible LLVM version, set environment variables || Rust compilation fails | Outdated Rust or Cargo | Update Rust with
```
```
|| Slow fuzzing | Sanitizers enabled | Expected 2-5x slowdown, necessary for finding bugs || Environment variable interference |
```
```
,
```
```
,
```
This LibAFL Agent Skill empowers AI coding assistants to delve into advanced software security testing, moving beyond conventional fuzzing limits. By leveraging LibAFL's modular Rust-based framework, the AI can assist in crafting highly customized fuzzing strategies, exploring novel vulnerability discovery techniques, and targeting specialized architectures. It transforms the AI into an expert collaborator for deep security research, enabling the development of bespoke testing harnesses tailored to unique project requirements and fostering proactive identification of complex bugs often missed by standard tools.

# When to Use This Skill
- •Implementing novel fuzzing techniques for discovering vulnerabilities in custom protocols or file formats.
- •Developing custom mutation strategies for specific data structures or input requirements that standard fuzzers cannot handle effectively.
- •Targeting non-standard or embedded architectures for vulnerability research where traditional fuzzers lack support.
- •Building highly customized fuzzers for specific components within a larger system, requiring fine-grained control over the fuzzing process.

# Pro Tips
- 💡Gradual Customization: Begin with LibAFL's libFuzzer compatibility layer for rapid setup, then progressively introduce custom mutators and feedback mechanisms as your understanding of the target deepens.
- 💡Leverage Rust Ecosystem: Utilize Rust's robust type system and tooling to build secure and efficient custom components for LibAFL, minimizing errors in your fuzzing harness itself.
- 💡Integrate with CI/CD: Automate LibAFL execution within your continuous integration/continuous deployment pipelines to ensure ongoing security validation against new code changes, catching regressions early.

