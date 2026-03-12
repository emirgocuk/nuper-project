# atheris
Source: https://antigravity.codes/agent-skills/security/atheris

## AI Worker Instructions
When the user requests functionality related to atheris, follow these guidelines and utilize this context.

## Scraped Content

# atheris
```
import sysimport atheris@atheris.instrument_funcdef test_one_input(data: bytes):    if len(data) == 4:        if data[0] == 0x46:  # "F"            if data[1] == 0x55:  # "U"                if data[2] == 0x5A:  # "Z"                    if data[3] == 0x5A:  # "Z"                        raise RuntimeError("You caught me")def main():    atheris.Setup(sys.argv, test_one_input)    atheris.Fuzz()if __name__ == "__main__":    main()
```
```
import sysimport atheris@atheris.instrument_funcdef test_one_input(data: bytes):    if len(data) == 4:        if data[0] == 0x46:  # "F"            if data[1] == 0x55:  # "U"                if data[2] == 0x5A:  # "Z"                    if data[3] == 0x5A:  # "Z"                        raise RuntimeError("You caught me")def main():    atheris.Setup(sys.argv, test_one_input)    atheris.Fuzz()if __name__ == "__main__":    main()
```
```
python fuzz.py
```
```
python fuzz.py
```
```
uv pip install atheris
```
```
uv pip install atheris
```
```
# https://hub.docker.com/_/pythonARG PYTHON_VERSION=3.11FROM python:$PYTHON_VERSION-slim-bookwormRUN python --versionRUN apt update && apt install -y \    ca-certificates \    wget \    && rm -rf /var/lib/apt/lists/*# LLVM builds version 15-19 for Debian 12 (Bookworm)# https://apt.llvm.org/bookworm/dists/ARG LLVM_VERSION=19RUN echo "deb http://apt.llvm.org/bookworm/ llvm-toolchain-bookworm-$LLVM_VERSION main" > /etc/apt/sources.list.d/llvm.listRUN echo "deb-src http://apt.llvm.org/bookworm/ llvm-toolchain-bookworm-$LLVM_VERSION main" >> /etc/apt/sources.list.d/llvm.listRUN wget -qO- https://apt.llvm.org/llvm-snapshot.gpg.key > /etc/apt/trusted.gpg.d/apt.llvm.org.ascRUN apt update && apt install -y \    build-essential \    clang-$LLVM_VERSION \    && rm -rf /var/lib/apt/lists/*ENV APP_DIR "/app"RUN mkdir $APP_DIRWORKDIR $APP_DIRENV VIRTUAL_ENV "/opt/venv"RUN python -m venv $VIRTUAL_ENVENV PATH "$VIRTUAL_ENV/bin:$PATH"# https://github.com/google/atheris/blob/master/native_extension_fuzzing.md#step-1-compiling-your-extensionENV CC="clang-$LLVM_VERSION"ENV CFLAGS "-fsanitize=address,fuzzer-no-link"ENV CXX="clang++-$LLVM_VERSION"ENV CXXFLAGS "-fsanitize=address,fuzzer-no-link"ENV LDSHARED="clang-$LLVM_VERSION -shared"ENV LDSHAREDXX="clang++-$LLVM_VERSION -shared"ENV ASAN_SYMBOLIZER_PATH="/usr/bin/llvm-symbolizer-$LLVM_VERSION"# Allow Atheris to find fuzzer sanitizer shared libs# https://github.com/google/atheris#building-from-sourceRUN LIBFUZZER_LIB=$($CC -print-file-name=libclang_rt.fuzzer_no_main-$(uname -m).a) \    python -m pip install --no-binary atheris atheris# https://github.com/google/atheris/blob/master/native_extension_fuzzing.md#option-a-sanitizerlibfuzzer-preloadsENV LD_PRELOAD "$VIRTUAL_ENV/lib/python3.11/site-packages/asan_with_fuzzer.so"# 1. Skip memory allocation failures for now, they are common, and low impact (DoS)# 2. https://github.com/google/atheris/blob/master/native_extension_fuzzing.md#leak-detectionENV ASAN_OPTIONS "allocator_may_return_null=1,detect_leaks=0"CMD ["/bin/bash"]
```
```
# https://hub.docker.com/_/pythonARG PYTHON_VERSION=3.11FROM python:$PYTHON_VERSION-slim-bookwormRUN python --versionRUN apt update && apt install -y \    ca-certificates \    wget \    && rm -rf /var/lib/apt/lists/*# LLVM builds version 15-19 for Debian 12 (Bookworm)# https://apt.llvm.org/bookworm/dists/ARG LLVM_VERSION=19RUN echo "deb http://apt.llvm.org/bookworm/ llvm-toolchain-bookworm-$LLVM_VERSION main" > /etc/apt/sources.list.d/llvm.listRUN echo "deb-src http://apt.llvm.org/bookworm/ llvm-toolchain-bookworm-$LLVM_VERSION main" >> /etc/apt/sources.list.d/llvm.listRUN wget -qO- https://apt.llvm.org/llvm-snapshot.gpg.key > /etc/apt/trusted.gpg.d/apt.llvm.org.ascRUN apt update && apt install -y \    build-essential \    clang-$LLVM_VERSION \    && rm -rf /var/lib/apt/lists/*ENV APP_DIR "/app"RUN mkdir $APP_DIRWORKDIR $APP_DIRENV VIRTUAL_ENV "/opt/venv"RUN python -m venv $VIRTUAL_ENVENV PATH "$VIRTUAL_ENV/bin:$PATH"# https://github.com/google/atheris/blob/master/native_extension_fuzzing.md#step-1-compiling-your-extensionENV CC="clang-$LLVM_VERSION"ENV CFLAGS "-fsanitize=address,fuzzer-no-link"ENV CXX="clang++-$LLVM_VERSION"ENV CXXFLAGS "-fsanitize=address,fuzzer-no-link"ENV LDSHARED="clang-$LLVM_VERSION -shared"ENV LDSHAREDXX="clang++-$LLVM_VERSION -shared"ENV ASAN_SYMBOLIZER_PATH="/usr/bin/llvm-symbolizer-$LLVM_VERSION"# Allow Atheris to find fuzzer sanitizer shared libs# https://github.com/google/atheris#building-from-sourceRUN LIBFUZZER_LIB=$($CC -print-file-name=libclang_rt.fuzzer_no_main-$(uname -m).a) \    python -m pip install --no-binary atheris atheris# https://github.com/google/atheris/blob/master/native_extension_fuzzing.md#option-a-sanitizerlibfuzzer-preloadsENV LD_PRELOAD "$VIRTUAL_ENV/lib/python3.11/site-packages/asan_with_fuzzer.so"# 1. Skip memory allocation failures for now, they are common, and low impact (DoS)# 2. https://github.com/google/atheris/blob/master/native_extension_fuzzing.md#leak-detectionENV ASAN_OPTIONS "allocator_may_return_null=1,detect_leaks=0"CMD ["/bin/bash"]
```
```
docker build -t atheris .docker run -it atheris
```
```
docker build -t atheris .docker run -it atheris
```
```
python -c "import atheris; print(atheris.__version__)"
```
```
python -c "import atheris; print(atheris.__version__)"
```
```
import sysimport atheris@atheris.instrument_funcdef test_one_input(data: bytes):    """    Fuzzing entry point. Called with random byte sequences.    Args:        data: Random bytes generated by the fuzzer    """    # Add input validation if needed    if len(data) < 1:        return    # Call your target function    try:        your_target_function(data)    except ValueError:        # Expected exceptions should be caught        pass    # Let unexpected exceptions crash (that's what we're looking for!)def main():    atheris.Setup(sys.argv, test_one_input)    atheris.Fuzz()if __name__ == "__main__":    main()
```
```
import sysimport atheris@atheris.instrument_funcdef test_one_input(data: bytes):    """    Fuzzing entry point. Called with random byte sequences.    Args:        data: Random bytes generated by the fuzzer    """    # Add input validation if needed    if len(data) < 1:        return    # Call your target function    try:        your_target_function(data)    except ValueError:        # Expected exceptions should be caught        pass    # Let unexpected exceptions crash (that's what we're looking for!)def main():    atheris.Setup(sys.argv, test_one_input)    atheris.Fuzz()if __name__ == "__main__":    main()
```
```
@atheris.instrument_func
```
```
atheris.instrument_imports()
```
```
atheris.Setup()
```
```
import atheriswith atheris.instrument_imports():    import your_module    from another_module import target_functiondef test_one_input(data: bytes):    target_function(data)atheris.Setup(sys.argv, test_one_input)atheris.Fuzz()
```
```
import atheriswith atheris.instrument_imports():    import your_module    from another_module import target_functiondef test_one_input(data: bytes):    target_function(data)atheris.Setup(sys.argv, test_one_input)atheris.Fuzz()
```
```
atheris.instrument_func
```
```
atheris.instrument_imports()
```
```
atheris.instrument_all()
```
```
export CC="clang"export CFLAGS="-fsanitize=address,fuzzer-no-link"export CXX="clang++"export CXXFLAGS="-fsanitize=address,fuzzer-no-link"export LDSHARED="clang -shared"
```
```
export CC="clang"export CFLAGS="-fsanitize=address,fuzzer-no-link"export CXX="clang++"export CXXFLAGS="-fsanitize=address,fuzzer-no-link"export LDSHARED="clang -shared"
```
```
CBOR2_BUILD_C_EXTENSION=1 python -m pip install --no-binary cbor2 cbor2==5.6.4
```
```
CBOR2_BUILD_C_EXTENSION=1 python -m pip install --no-binary cbor2 cbor2==5.6.4
```
```
--no-binary
```
```
cbor2-fuzz.py
```
```
import sysimport atheris# _cbor2 ensures the C library is importedfrom _cbor2 import loadsdef test_one_input(data: bytes):    try:        loads(data)    except Exception:        # We're searching for memory corruption, not Python exceptions        passdef main():    atheris.Setup(sys.argv, test_one_input)    atheris.Fuzz()if __name__ == "__main__":    main()
```
```
import sysimport atheris# _cbor2 ensures the C library is importedfrom _cbor2 import loadsdef test_one_input(data: bytes):    try:        loads(data)    except Exception:        # We're searching for memory corruption, not Python exceptions        passdef main():    atheris.Setup(sys.argv, test_one_input)    atheris.Fuzz()if __name__ == "__main__":    main()
```
```
python cbor2-fuzz.py
```
```
python cbor2-fuzz.py
```
```
LD_PRELOAD
```
```
mkdir corpus# Add seed inputsecho "test data" > corpus/seed1echo '{"key": "value"}' > corpus/seed2
```
```
mkdir corpus# Add seed inputsecho "test data" > corpus/seed1echo '{"key": "value"}' > corpus/seed2
```
```
python fuzz.py corpus/
```
```
python fuzz.py corpus/
```
```
python fuzz.py -merge=1 new_corpus/ old_corpus/
```
```
python fuzz.py -merge=1 new_corpus/ old_corpus/
```
```
python fuzz.py
```
```
python fuzz.py
```
```
python fuzz.py corpus/
```
```
python fuzz.py corpus/
```
```
# Run for 10 minutespython fuzz.py -max_total_time=600# Limit input sizepython fuzz.py -max_len=1024# Run with multiple workerspython fuzz.py -workers=4 -jobs=4
```
```
# Run for 10 minutespython fuzz.py -max_total_time=600# Limit input sizepython fuzz.py -max_len=1024# Run with multiple workerspython fuzz.py -workers=4 -jobs=4
```
```
NEW    cov: X
```
```
pulse  cov: X
```
```
exec/s: X
```
```
corp: X/Yb
```
```
ERROR: libFuzzer
```
```
export CFLAGS="-fsanitize=address,fuzzer-no-link"export CXXFLAGS="-fsanitize=address,fuzzer-no-link"
```
```
export CFLAGS="-fsanitize=address,fuzzer-no-link"export CXXFLAGS="-fsanitize=address,fuzzer-no-link"
```
```
export ASAN_OPTIONS="allocator_may_return_null=1,detect_leaks=0"
```
```
export ASAN_OPTIONS="allocator_may_return_null=1,detect_leaks=0"
```
```
export LD_PRELOAD="$(python -c 'import atheris; import os; print(os.path.join(os.path.dirname(atheris.__file__), "asan_with_fuzzer.so"))')"
```
```
export LD_PRELOAD="$(python -c 'import atheris; import os; print(os.path.join(os.path.dirname(atheris.__file__), "asan_with_fuzzer.so"))')"
```
```
LD_PRELOAD
```
```
LD_PRELOAD
```
```
asan_with_fuzzer.so
```
```
ASAN_OPTIONS=allocator_may_return_null=1
```
```
ASAN_OPTIONS=detect_leaks=0
```
```
ASAN_SYMBOLIZER_PATH
```
```
llvm-symbolizer
```
```
atheris.instrument_imports()
```
```
max_len
```
```
import atheris# Instrument only specific moduleswith atheris.instrument_imports():    import target_module# Don't instrument test harness codedef test_one_input(data: bytes):    target_module.parse(data)
```
```
import atheris# Instrument only specific moduleswith atheris.instrument_imports():    import target_module# Don't instrument test harness codedef test_one_input(data: bytes):    target_module.parse(data)
```
```
-max_len=N
```
```
-workers=N -jobs=N
```
```
ASAN_OPTIONS=fast_unwind_on_malloc=0
```
```
export CFLAGS="-fsanitize=address,undefined,fuzzer-no-link"export CXXFLAGS="-fsanitize=address,undefined,fuzzer-no-link"
```
```
export CFLAGS="-fsanitize=address,undefined,fuzzer-no-link"export CXXFLAGS="-fsanitize=address,undefined,fuzzer-no-link"
```
```
import sysimport atherisimport json@atheris.instrument_funcdef test_one_input(data: bytes):    try:        # Fuzz Python's JSON parser        json.loads(data.decode('utf-8', errors='ignore'))    except (ValueError, UnicodeDecodeError):        passdef main():    atheris.Setup(sys.argv, test_one_input)    atheris.Fuzz()if __name__ == "__main__":    main()
```
```
import sysimport atherisimport json@atheris.instrument_funcdef test_one_input(data: bytes):    try:        # Fuzz Python's JSON parser        json.loads(data.decode('utf-8', errors='ignore'))    except (ValueError, UnicodeDecodeError):        passdef main():    atheris.Setup(sys.argv, test_one_input)    atheris.Fuzz()if __name__ == "__main__":    main()
```
```
import sysimport atheriswith atheris.instrument_imports():    from urllib3 import HTTPResponse    from io import BytesIOdef test_one_input(data: bytes):    try:        # Fuzz HTTP response parsing        fake_response = HTTPResponse(            body=BytesIO(data),            headers={},            preload_content=False        )        fake_response.read()    except Exception:        passdef main():    atheris.Setup(sys.argv, test_one_input)    atheris.Fuzz()if __name__ == "__main__":    main()
```
```
import sysimport atheriswith atheris.instrument_imports():    from urllib3 import HTTPResponse    from io import BytesIOdef test_one_input(data: bytes):    try:        # Fuzz HTTP response parsing        fake_response = HTTPResponse(            body=BytesIO(data),            headers={},            preload_content=False        )        fake_response.read()    except Exception:        passdef main():    atheris.Setup(sys.argv, test_one_input)    atheris.Fuzz()if __name__ == "__main__":    main()
```
```
instrument_imports()
```
```
max_len
```
```
ASAN_OPTIONS=fast_unwind_on_malloc=1
```
```
instrument_imports()
```
```
LD_PRELOAD
```
```
LD_PRELOAD
```
```
asan_with_fuzzer.so
```
```
CC
```
```
CFLAGS
```
The Atheris skill equips your AI coding assistant with advanced fuzzing capabilities, allowing it to proactively uncover vulnerabilities in Python applications. Built upon the robust libFuzzer framework, Atheris provides intelligent, coverage-guided input generation to stress-test your code, including complex Python C extensions. This skill is invaluable for identifying hard-to-find bugs, memory corruption issues via AddressSanitizer integration, and ensuring the overall resilience and security of your codebase. By automating sophisticated testing, the agent helps developers maintain high-quality, secure software, accelerating the discovery and remediation of critical flaws before deployment.

# When to Use This Skill
- •Fuzzing pure Python applications to uncover hidden bugs and edge cases.
- •Detecting memory corruption vulnerabilities in Python C extensions using AddressSanitizer.
- •Integrating automated, coverage-guided fuzz testing into CI/CD pipelines.
- •Assessing the robustness of new Python libraries or APIs against unexpected inputs.

# Pro Tips
- 💡Focus fuzzer efforts on critical or newly developed modules to maximize the impact of bug discovery.
- 💡Combine Atheris with other static analysis tools for a more comprehensive security audit of your Python projects.
- 💡For complex input formats, consider implementing custom mutators to guide the fuzzer more effectively and improve coverage.

