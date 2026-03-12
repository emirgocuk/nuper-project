# ruzzy
Source: https://antigravity.codes/agent-skills/security/ruzzy

## AI Worker Instructions
When the user requests functionality related to ruzzy, follow these guidelines and utilize this context.

## Scraped Content

# ruzzy
```
export ASAN_OPTIONS="allocator_may_return_null=1:detect_leaks=0:use_sigaltstack=0"
```
```
export ASAN_OPTIONS="allocator_may_return_null=1:detect_leaks=0:use_sigaltstack=0"
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby -e 'require "ruzzy"; Ruzzy.dummy'
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby -e 'require "ruzzy"; Ruzzy.dummy'
```
```
MAKE="make --environment-overrides V=1" \CC="/path/to/clang" \CXX="/path/to/clang++" \LDSHARED="/path/to/clang -shared" \LDSHAREDXX="/path/to/clang++ -shared" \    gem install ruzzy
```
```
MAKE="make --environment-overrides V=1" \CC="/path/to/clang" \CXX="/path/to/clang++" \LDSHARED="/path/to/clang -shared" \LDSHAREDXX="/path/to/clang++ -shared" \    gem install ruzzy
```
```
MAKE
```
```
CC
```
```
CXX
```
```
LDSHARED
```
```
LDSHAREDXX
```
```
RUZZY_DEBUG=1 gem install --verbose ruzzy
```
```
RUZZY_DEBUG=1 gem install --verbose ruzzy
```
```
test_tracer.rb
```
```
# frozen_string_literal: truerequire 'ruzzy'Ruzzy.trace('test_harness.rb')
```
```
# frozen_string_literal: truerequire 'ruzzy'Ruzzy.trace('test_harness.rb')
```
```
test_harness.rb
```
```
# frozen_string_literal: truerequire 'ruzzy'def fuzzing_target(input)  # Your code to fuzz here  if input.length == 4    if input[0] == 'F'      if input[1] == 'U'        if input[2] == 'Z'          if input[3] == 'Z'            raise          end        end      end    end  endendtest_one_input = lambda do |data|  fuzzing_target(data)  return 0endRuzzy.fuzz(test_one_input)
```
```
# frozen_string_literal: truerequire 'ruzzy'def fuzzing_target(input)  # Your code to fuzz here  if input.length == 4    if input[0] == 'F'      if input[1] == 'U'        if input[2] == 'Z'          if input[3] == 'Z'            raise          end        end      end    end  endendtest_one_input = lambda do |data|  fuzzing_target(data)  return 0endRuzzy.fuzz(test_one_input)
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby test_tracer.rb
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby test_tracer.rb
```
```
fuzz_msgpack.rb
```
```
# frozen_string_literal: truerequire 'msgpack'require 'ruzzy'test_one_input = lambda do |data|  begin    MessagePack.unpack(data)  rescue Exception    # We're looking for memory corruption, not Ruby exceptions  end  return 0endRuzzy.fuzz(test_one_input)
```
```
# frozen_string_literal: truerequire 'msgpack'require 'ruzzy'test_one_input = lambda do |data|  begin    MessagePack.unpack(data)  rescue Exception    # We're looking for memory corruption, not Ruby exceptions  end  return 0endRuzzy.fuzz(test_one_input)
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby fuzz_msgpack.rb
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby fuzz_msgpack.rb
```
```
MAKE="make --environment-overrides V=1" \CC="/path/to/clang" \CXX="/path/to/clang++" \LDSHARED="/path/to/clang -shared" \LDSHAREDXX="/path/to/clang++ -shared" \CFLAGS="-fsanitize=address,fuzzer-no-link -fno-omit-frame-pointer -fno-common -fPIC -g" \CXXFLAGS="-fsanitize=address,fuzzer-no-link -fno-omit-frame-pointer -fno-common -fPIC -g" \    gem install <gem-name>
```
```
MAKE="make --environment-overrides V=1" \CC="/path/to/clang" \CXX="/path/to/clang++" \LDSHARED="/path/to/clang -shared" \LDSHAREDXX="/path/to/clang++ -shared" \CFLAGS="-fsanitize=address,fuzzer-no-link -fno-omit-frame-pointer -fno-common -fPIC -g" \CXXFLAGS="-fsanitize=address,fuzzer-no-link -fno-omit-frame-pointer -fno-common -fPIC -g" \    gem install <gem-name>
```
```
-fsanitize=address,fuzzer-no-link
```
```
-fno-omit-frame-pointer
```
```
-fno-common
```
```
-fPIC
```
```
-g
```
```
export ASAN_OPTIONS="allocator_may_return_null=1:detect_leaks=0:use_sigaltstack=0"
```
```
export ASAN_OPTIONS="allocator_may_return_null=1:detect_leaks=0:use_sigaltstack=0"
```
```
allocator_may_return_null=1
```
```
detect_leaks=0
```
```
use_sigaltstack=0
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby harness.rb
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby harness.rb
```
```
LD_PRELOAD
```
```
ASAN_OPTIONS
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby harness.rb /path/to/corpus
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby harness.rb /path/to/corpus
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby harness.rb /path/to/corpus -max_len=1024 -timeout=10
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby harness.rb /path/to/corpus -max_len=1024 -timeout=10
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby harness.rb ./crash-253420c1158bc6382093d409ce2e9cff5806e980
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby harness.rb ./crash-253420c1158bc6382093d409ce2e9cff5806e980
```
```
INFO: Running with entropic power schedule
```
```
ERROR: AddressSanitizer: heap-use-after-free
```
```
SUMMARY: libFuzzer: fuzz target exited
```
```
artifact_prefix='./'; Test unit written to ./crash-*
```
```
Base64: ...
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby harness.rb
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby harness.rb
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::UBSAN_PATH') \    ruby harness.rb
```
```
LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::UBSAN_PATH') \    ruby harness.rb
```
```
ASAN_OPTIONS=detect_leaks=0
```
```
ASAN_OPTIONS=use_sigaltstack=0
```
```
ASAN_OPTIONS=allocator_may_return_null=1
```
```
MAKE="make --environment-overrides V=1" \CC="/path/to/clang" \CXX="/path/to/clang++" \LDSHARED="/path/to/clang -shared" \LDSHAREDXX="/path/to/clang++ -shared" \CFLAGS="-fsanitize=address,fuzzer-no-link -fno-omit-frame-pointer -fno-common -fPIC -g" \CXXFLAGS="-fsanitize=address,fuzzer-no-link -fno-omit-frame-pointer -fno-common -fPIC -g" \    gem install msgpack
```
```
MAKE="make --environment-overrides V=1" \CC="/path/to/clang" \CXX="/path/to/clang++" \LDSHARED="/path/to/clang -shared" \LDSHAREDXX="/path/to/clang++ -shared" \CFLAGS="-fsanitize=address,fuzzer-no-link -fno-omit-frame-pointer -fno-common -fPIC -g" \CXXFLAGS="-fsanitize=address,fuzzer-no-link -fno-omit-frame-pointer -fno-common -fPIC -g" \    gem install msgpack
```
```
fuzz_msgpack.rb
```
```
# frozen_string_literal: truerequire 'msgpack'require 'ruzzy'test_one_input = lambda do |data|  begin    MessagePack.unpack(data)  rescue Exception    # We're looking for memory corruption, not Ruby exceptions  end  return 0endRuzzy.fuzz(test_one_input)
```
```
# frozen_string_literal: truerequire 'msgpack'require 'ruzzy'test_one_input = lambda do |data|  begin    MessagePack.unpack(data)  rescue Exception    # We're looking for memory corruption, not Ruby exceptions  end  return 0endRuzzy.fuzz(test_one_input)
```
```
export ASAN_OPTIONS="allocator_may_return_null=1:detect_leaks=0:use_sigaltstack=0"LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby fuzz_msgpack.rb
```
```
export ASAN_OPTIONS="allocator_may_return_null=1:detect_leaks=0:use_sigaltstack=0"LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby fuzz_msgpack.rb
```
```
test_tracer.rb
```
```
# frozen_string_literal: truerequire 'ruzzy'Ruzzy.trace('test_harness.rb')
```
```
# frozen_string_literal: truerequire 'ruzzy'Ruzzy.trace('test_harness.rb')
```
```
test_harness.rb
```
```
# frozen_string_literal: truerequire 'ruzzy'require_relative 'my_parser'test_one_input = lambda do |data|  begin    MyParser.parse(data)  rescue StandardError    # Expected exceptions from malformed input  end  return 0endRuzzy.fuzz(test_one_input)
```
```
# frozen_string_literal: truerequire 'ruzzy'require_relative 'my_parser'test_one_input = lambda do |data|  begin    MyParser.parse(data)  rescue StandardError    # Expected exceptions from malformed input  end  return 0endRuzzy.fuzz(test_one_input)
```
```
export ASAN_OPTIONS="allocator_may_return_null=1:detect_leaks=0:use_sigaltstack=0"LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby test_tracer.rb
```
```
export ASAN_OPTIONS="allocator_may_return_null=1:detect_leaks=0:use_sigaltstack=0"LD_PRELOAD=$(ruby -e 'require "ruzzy"; print Ruzzy::ASAN_PATH') \    ruby test_tracer.rb
```
```
cannot open shared object file
```
```
ASAN_OPTIONS=detect_leaks=0
```
```
RUZZY_DEBUG=1 gem install --verbose ruzzy
```
Fuzzing is a powerful automated software testing technique that involves feeding invalid, unexpected, or random data to a computer program to discover software bugs, security vulnerabilities, and other issues. For Ruby developers, especially those working with critical applications or C extensions, ensuring robustness and security is paramount. The Ruzzy Agent Skill provides a dedicated, coverage-guided fuzzer for Ruby, leveraging the robust `libFuzzer` engine. It's designed to methodically explore your codebase, uncovering hidden defects and bolstering the reliability and safety of your Ruby projects, making it an indispensable tool for proactive code quality assurance.

# When to Use This Skill
- •Fuzzing Ruby applications and libraries to find hidden bugs.
- •Testing Ruby C extensions for memory safety issues and undefined behavior.
- •Achieving comprehensive coverage-guided fuzzing for critical Ruby codebases.
- •Enhancing the security and stability of Ruby gems with native extensions.

# Pro Tips
- 💡Integrate Ruzzy into your CI/CD pipeline for continuous security testing of your Ruby projects.
- 💡Prioritize fuzzing efforts on critical or high-risk components, particularly Ruby C extensions, to maximize impact.
- 💡Combine Ruzzy with other security tools like static analysis for a multi-layered approach to vulnerability detection.

