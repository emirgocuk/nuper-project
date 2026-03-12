# cargo-fuzz
Source: https://antigravity.codes/agent-skills/security/cargo-fuzz

## AI Worker Instructions
When the user requests functionality related to cargo-fuzz, follow these guidelines and utilize this context.

## Scraped Content

# cargo-fuzz
```
#![no_main]use libfuzzer_sys::fuzz_target;fn harness(data: &[u8]) {    your_project::check_buf(data);}fuzz_target!(|data: &[u8]| {    harness(data);});
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fn harness(data: &[u8]) {    your_project::check_buf(data);}fuzz_target!(|data: &[u8]| {    harness(data);});
```
```
cargo fuzz init# Edit fuzz/fuzz_targets/fuzz_target_1.rs with your harnesscargo +nightly fuzz run fuzz_target_1
```
```
cargo fuzz init# Edit fuzz/fuzz_targets/fuzz_target_1.rs with your harnesscargo +nightly fuzz run fuzz_target_1
```
```
# Install nightly toolchainrustup install nightly# Install cargo-fuzzcargo install cargo-fuzz
```
```
# Install nightly toolchainrustup install nightly# Install cargo-fuzzcargo install cargo-fuzz
```
```
cargo +nightly --versioncargo fuzz --version
```
```
cargo +nightly --versioncargo fuzz --version
```
```
main.rs
```
```
src/main.rs  # Entry point (main function)src/lib.rs   # Code to fuzz (public functions)Cargo.toml
```
```
src/main.rs  # Entry point (main function)src/lib.rs   # Code to fuzz (public functions)Cargo.toml
```
```
cargo fuzz init
```
```
cargo fuzz init
```
```
fuzz/├── Cargo.toml└── fuzz_targets/    └── fuzz_target_1.rs
```
```
fuzz/├── Cargo.toml└── fuzz_targets/    └── fuzz_target_1.rs
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fn harness(data: &[u8]) {    // 1. Validate input size if needed    if data.is_empty() {        return;    }    // 2. Call target function with fuzz data    your_project::target_function(data);}fuzz_target!(|data: &[u8]| {    harness(data);});
```
```
#![no_main]use libfuzzer_sys::fuzz_target;fn harness(data: &[u8]) {    // 1. Validate input size if needed    if data.is_empty() {        return;    }    // 2. Call target function with fuzz data    your_project::target_function(data);}fuzz_target!(|data: &[u8]| {    harness(data);});
```
```
fuzz_target!
```
```
Result::Err
```
```
arbitrary
```
```
// In your library crateuse arbitrary::Arbitrary;#[derive(Debug, Arbitrary)]pub struct Name {    data: String}
```
```
// In your library crateuse arbitrary::Arbitrary;#[derive(Debug, Arbitrary)]pub struct Name {    data: String}
```
```
// In your fuzz target#![no_main]use libfuzzer_sys::fuzz_target;fuzz_target!(|data: your_project::Name| {    data.check_buf();});
```
```
// In your fuzz target#![no_main]use libfuzzer_sys::fuzz_target;fuzz_target!(|data: your_project::Name| {    data.check_buf();});
```
```
Cargo.toml
```
```
[dependencies]arbitrary = { version = "1", features = ["derive"] }
```
```
[dependencies]arbitrary = { version = "1", features = ["derive"] }
```
```
cargo +nightly fuzz run fuzz_target_1
```
```
cargo +nightly fuzz run fuzz_target_1
```
```
cargo +nightly fuzz run --sanitizer none fuzz_target_1
```
```
cargo +nightly fuzz run --sanitizer none fuzz_target_1
```
```
cargo install cargo-geigercargo geiger
```
```
cargo install cargo-geigercargo geiger
```
```
# Run a specific test case (e.g., a crash)cargo +nightly fuzz run fuzz_target_1 fuzz/artifacts/fuzz_target_1/crash-<hash># Run all corpus entries without fuzzingcargo +nightly fuzz run fuzz_target_1 fuzz/corpus/fuzz_target_1 -- -runs=0
```
```
# Run a specific test case (e.g., a crash)cargo +nightly fuzz run fuzz_target_1 fuzz/artifacts/fuzz_target_1/crash-<hash># Run all corpus entries without fuzzingcargo +nightly fuzz run fuzz_target_1 fuzz/corpus/fuzz_target_1 -- -runs=0
```
```
cargo +nightly fuzz run fuzz_target_1 -- -dict=./dict.dict
```
```
cargo +nightly fuzz run fuzz_target_1 -- -dict=./dict.dict
```
```
NEW
```
```
pulse
```
```
INITED
```
```
fuzz/artifacts/
```
```
fuzz/corpus/fuzz_target_1/
```
```
fuzz/artifacts/fuzz_target_1/
```
```
cargo +nightly fuzz run fuzz_target_1
```
```
cargo +nightly fuzz run fuzz_target_1
```
```
cargo +nightly fuzz run --sanitizer none fuzz_target_1
```
```
cargo +nightly fuzz run --sanitizer none fuzz_target_1
```
```
cargo install cargo-geigercargo geiger
```
```
cargo install cargo-geigercargo geiger
```
```
rustup toolchain install nightly --component llvm-tools-previewcargo install cargo-binutilscargo install rustfilt
```
```
rustup toolchain install nightly --component llvm-tools-previewcargo install cargo-binutilscargo install rustfilt
```
```
# Generate coverage data from corpuscargo +nightly fuzz coverage fuzz_target_1
```
```
# Generate coverage data from corpuscargo +nightly fuzz coverage fuzz_target_1
```
```
cat <<'EOF' > ./generate_html#!/bin/shif [ $# -lt 1 ]; then    echo "Error: Name of fuzz target is required."    echo "Usage: $0 fuzz_target [sources...]"    exit 1fiFUZZ_TARGET="$1"shiftSRC_FILTER="$@"TARGET=$(rustc -vV | sed -n 's|host: ||p')cargo +nightly cov -- show -Xdemangler=rustfilt \  "target/$TARGET/coverage/$TARGET/release/$FUZZ_TARGET" \  -instr-profile="fuzz/coverage/$FUZZ_TARGET/coverage.profdata"  \  -show-line-counts-or-regions -show-instantiations  \  -format=html -o fuzz_html/ $SRC_FILTEREOFchmod +x ./generate_html
```
```
cat <<'EOF' > ./generate_html#!/bin/shif [ $# -lt 1 ]; then    echo "Error: Name of fuzz target is required."    echo "Usage: $0 fuzz_target [sources...]"    exit 1fiFUZZ_TARGET="$1"shiftSRC_FILTER="$@"TARGET=$(rustc -vV | sed -n 's|host: ||p')cargo +nightly cov -- show -Xdemangler=rustfilt \  "target/$TARGET/coverage/$TARGET/release/$FUZZ_TARGET" \  -instr-profile="fuzz/coverage/$FUZZ_TARGET/coverage.profdata"  \  -show-line-counts-or-regions -show-instantiations  \  -format=html -o fuzz_html/ $SRC_FILTEREOFchmod +x ./generate_html
```
```
./generate_html fuzz_target_1 src/lib.rs
```
```
./generate_html fuzz_target_1 src/lib.rs
```
```
fuzz_html/
```
```
--sanitizer none
```
```
--
```
```
# See all optionscargo +nightly fuzz run fuzz_target_1 -- -help=1# Set timeout per runcargo +nightly fuzz run fuzz_target_1 -- -timeout=10# Use dictionarycargo +nightly fuzz run fuzz_target_1 -- -dict=dict.dict# Limit maximum input sizecargo +nightly fuzz run fuzz_target_1 -- -max_len=1024
```
```
# See all optionscargo +nightly fuzz run fuzz_target_1 -- -help=1# Set timeout per runcargo +nightly fuzz run fuzz_target_1 -- -timeout=10# Use dictionarycargo +nightly fuzz run fuzz_target_1 -- -dict=dict.dict# Limit maximum input sizecargo +nightly fuzz run fuzz_target_1 -- -max_len=1024
```
```
# Experimental forking support (not recommended)cargo +nightly fuzz run --jobs 1 fuzz_target_1
```
```
# Experimental forking support (not recommended)cargo +nightly fuzz run --jobs 1 fuzz_target_1
```
```
# Clone and initializegit clone https://github.com/RustAudio/ogg.gitcd ogg/cargo fuzz init
```
```
# Clone and initializegit clone https://github.com/RustAudio/ogg.gitcd ogg/cargo fuzz init
```
```
fuzz/fuzz_targets/fuzz_target_1.rs
```
```
#![no_main]use ogg::{PacketReader, PacketWriter};use ogg::writing::PacketWriteEndInfo;use std::io::Cursor;use libfuzzer_sys::fuzz_target;fn harness(data: &[u8]) {    let mut pck_rdr = PacketReader::new(Cursor::new(data.to_vec()));    pck_rdr.delete_unread_packets();    let output = Vec::new();    let mut pck_wtr = PacketWriter::new(Cursor::new(output));    if let Ok(_) = pck_rdr.read_packet() {        if let Ok(r) = pck_rdr.read_packet() {            match r {                Some(pck) => {                    let inf = if pck.last_in_stream() {                        PacketWriteEndInfo::EndStream                    } else if pck.last_in_page() {                        PacketWriteEndInfo::EndPage                    } else {                        PacketWriteEndInfo::NormalPacket                    };                    let stream_serial = pck.stream_serial();                    let absgp_page = pck.absgp_page();                    let _ = pck_wtr.write_packet(                        pck.data, stream_serial, inf, absgp_page                    );                }                None => return,            }        }    }}fuzz_target!(|data: &[u8]| {    harness(data);});
```
```
#![no_main]use ogg::{PacketReader, PacketWriter};use ogg::writing::PacketWriteEndInfo;use std::io::Cursor;use libfuzzer_sys::fuzz_target;fn harness(data: &[u8]) {    let mut pck_rdr = PacketReader::new(Cursor::new(data.to_vec()));    pck_rdr.delete_unread_packets();    let output = Vec::new();    let mut pck_wtr = PacketWriter::new(Cursor::new(output));    if let Ok(_) = pck_rdr.read_packet() {        if let Ok(r) = pck_rdr.read_packet() {            match r {                Some(pck) => {                    let inf = if pck.last_in_stream() {                        PacketWriteEndInfo::EndStream                    } else if pck.last_in_page() {                        PacketWriteEndInfo::EndPage                    } else {                        PacketWriteEndInfo::NormalPacket                    };                    let stream_serial = pck.stream_serial();                    let absgp_page = pck.absgp_page();                    let _ = pck_wtr.write_packet(                        pck.data, stream_serial, inf, absgp_page                    );                }                None => return,            }        }    }}fuzz_target!(|data: &[u8]| {    harness(data);});
```
```
mkdir fuzz/corpus/fuzz_target_1/curl -o fuzz/corpus/fuzz_target_1/320x240.ogg \  https://commons.wikimedia.org/wiki/File:320x240.ogg
```
```
mkdir fuzz/corpus/fuzz_target_1/curl -o fuzz/corpus/fuzz_target_1/320x240.ogg \  https://commons.wikimedia.org/wiki/File:320x240.ogg
```
```
cargo +nightly fuzz run fuzz_target_1
```
```
cargo +nightly fuzz run fuzz_target_1
```
```
cargo +nightly fuzz coverage fuzz_target_1./generate_html fuzz_target_1 src/lib.rs
```
```
cargo +nightly fuzz coverage fuzz_target_1./generate_html fuzz_target_1 src/lib.rs
```
```
cargo +nightly fuzz
```
```
--sanitizer none
```
```
main.rs
```
```
lib.rs
```
```
rustup install nightly-2024-01-01
```
```
fuzz/corpus/fuzz_target_1/
```
```
arbitrary
```
The `cargo-fuzz` agent skill empowers AI coding assistants to proficiently integrate advanced security testing into Rust projects. By leveraging the industry-standard `cargo-fuzz` tool, AI can assist developers in proactively identifying bugs and vulnerabilities through automated fuzzing. This skill enables seamless setup of fuzz targets, configuration of sanitizers like AddressSanitizer, and execution of comprehensive test campaigns, ensuring the robustness and reliability of Rust applications. It's an indispensable asset for AI agents tasked with enhancing code quality and preventing security exploits in complex Rust ecosystems.

# When to Use This Skill
- •Setting up an initial fuzzing infrastructure for a new Rust library or application.
- •Debugging intermittent crashes or unexpected behavior by generating diverse inputs to trigger edge cases.
- •Proactively finding memory safety issues and undefined behavior in `unsafe` Rust code with integrated sanitizers.
- •Integrating automated security and reliability checks into a CI/CD pipeline for Rust-based projects.

# Pro Tips
- 💡Always start with simple fuzz targets focusing on critical components, then incrementally expand complexity as your understanding of the target code and fuzzing needs evolve.
- 💡Leverage sanitizers like AddressSanitizer (`-Zsanitizer=address`) extensively, especially when dealing with FFI or `unsafe` blocks, to catch memory-related issues early.
- 💡Integrate `cargo-fuzz` execution into your continuous integration pipeline to ensure ongoing vulnerability detection and maintain code robustness against new changes.

