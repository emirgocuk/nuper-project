# fuzzing-dictionary
Source: https://antigravity.codes/agent-skills/security/fuzzing-dictionary

## AI Worker Instructions
When the user requests functionality related to fuzzing-dictionary, follow these guidelines and utilize this context.

## Scraped Content

# fuzzing-dictionary
```
"keyword"
```
```
kw="value"
```
```
"\xF7\xF8"
```
```
./fuzz -dict=./dictionary.dict ...
```
```
afl-fuzz -x ./dictionary.dict ...
```
```
cargo fuzz run fuzz_target -- -dict=./dictionary.dict
```
```
grep -o '".*"' header.h > header.dict
```
```
strings ./binary \| sed 's/^/"&/; s/$/&"/' > strings.dict
```
```
#
```
```
# Lines starting with '#' and empty lines are ignored.# Adds "blah" (w/o quotes) to the dictionary.kw1="blah"# Use \\ for backslash and \" for quotes.kw2="\"ac\\dc\""# Use \xAB for hex valueskw3="\xF7\xF8"# the name of the keyword followed by '=' may be omitted:"foo\x0Abar"
```
```
# Lines starting with '#' and empty lines are ignored.# Adds "blah" (w/o quotes) to the dictionary.kw1="blah"# Use \\ for backslash and \" for quotes.kw2="\"ac\\dc\""# Use \xAB for hex valueskw3="\xF7\xF8"# the name of the keyword followed by '=' may be omitted:"foo\x0Abar"
```
```
A dictionary can be used to guide the fuzzer. Write me a dictionary file for fuzzing a <PNG parser>. Each line should be a quoted string or key-value pair like kw="value". Include magic bytes, chunk types, and common header values. Use hex escapes like "\xF7\xF8" for binary values.
```
```
A dictionary can be used to guide the fuzzer. Write me a dictionary file for fuzzing a <PNG parser>. Each line should be a quoted string or key-value pair like kw="value". Include magic bytes, chunk types, and common header values. Use hex escapes like "\xF7\xF8" for binary values.
```
```
grep -o '".*"' header.h > header.dict
```
```
grep -o '".*"' header.h > header.dict
```
```
man curl | grep -oP '^\s*(--|-)\K\S+' | sed 's/[,.]$//' | sed 's/^/"&/; s/$/&"/' | sort -u > man.dict
```
```
man curl | grep -oP '^\s*(--|-)\K\S+' | sed 's/[,.]$//' | sed 's/^/"&/; s/$/&"/' | sort -u > man.dict
```
```
strings ./binary | sed 's/^/"&/; s/$/&"/' > strings.dict
```
```
strings ./binary | sed 's/^/"&/; s/$/&"/' > strings.dict
```
```
# HTTP methods"GET""POST""PUT""DELETE""HEAD"# Headers"Content-Type""Authorization""Host"# Protocol markers"HTTP/1.1""HTTP/2.0"
```
```
# HTTP methods"GET""POST""PUT""DELETE""HEAD"# Headers"Content-Type""Authorization""Host"# Protocol markers"HTTP/1.1""HTTP/2.0"
```
```
# PNG magic bytes and chunkspng_magic="\x89PNG\r\n\x1a\n"ihdr="IHDR"plte="PLTE"idat="IDAT"iend="IEND"# JPEG markersjpeg_soi="\xFF\xD8"jpeg_eoi="\xFF\xD9"
```
```
# PNG magic bytes and chunkspng_magic="\x89PNG\r\n\x1a\n"ihdr="IHDR"plte="PLTE"idat="IDAT"iend="IEND"# JPEG markersjpeg_soi="\xFF\xD8"jpeg_eoi="\xFF\xD9"
```
```
# Common config keywords"true""false""null""version""enabled""disabled"# Section headers"[general]""[network]""[security]"
```
```
# Common config keywords"true""false""null""version""enabled""disabled"# Section headers"[general]""[network]""[security]"
```
```
"0"
```
```
"-1"
```
```
"2147483647"
```
```
:
```
```
=
```
```
{
```
```
}
```
```
afl-clang-lto
```
```
export AFL_LLVM_DICT2FILE=auto.dictafl-clang-lto++ target.cc -o target# Dictionary saved to auto.dictafl-fuzz -x auto.dict -i in -o out -- ./target
```
```
export AFL_LLVM_DICT2FILE=auto.dictafl-clang-lto++ target.cc -o target# Dictionary saved to auto.dictafl-fuzz -x auto.dict -i in -o out -- ./target
```
```
# AFL++ with multiple dictionariesafl-fuzz -x keywords.dict -x formats.dict -i in -o out -- ./target
```
```
# AFL++ with multiple dictionariesafl-fuzz -x keywords.dict -x formats.dict -i in -o out -- ./target
```
```
sort -u
```
```
\xXX
```
```
#
```
```
clang++ -fsanitize=fuzzer,address harness.cc -o fuzz./fuzz -dict=./dictionary.dict corpus/
```
```
clang++ -fsanitize=fuzzer,address harness.cc -o fuzz./fuzz -dict=./dictionary.dict corpus/
```
```
-max_len
```
```
-print_final_stats=1
```
```
-max_len
```
```
afl-fuzz -x ./dictionary.dict -i input/ -o output/ -- ./target @@
```
```
afl-fuzz -x ./dictionary.dict -i input/ -o output/ -- ./target @@
```
```
-x
```
```
AFL_LLVM_DICT2FILE
```
```
afl-clang-lto
```
```
cargo fuzz run fuzz_target -- -dict=./dictionary.dict
```
```
cargo fuzz run fuzz_target -- -dict=./dictionary.dict
```
```
fuzz/
```
```
cargo fuzz run target -- -dict=../dictionary.dict
```
```
# Convert dictionary to corpus filesgrep -o '".*"' dict.txt | while read line; do    echo -n "$line" | base64 > corpus/$(echo "$line" | md5sum | cut -d' ' -f1)donego-fuzz -bin=./target-fuzz.zip -workdir=.
```
```
# Convert dictionary to corpus filesgrep -o '".*"' dict.txt | while read line; do    echo -n "$line" | base64 > corpus/$(echo "$line" | md5sum | cut -d' ' -f1)donego-fuzz -bin=./target-fuzz.zip -workdir=.
```
```
\\
```
```
\"
```
```
-max_len
```
```
-max_len
```
```
-dict=
```
```
-x
```
```
-dict=
```
```
*.dict
```
The Fuzzing Dictionary skill empowers AI agents to significantly enhance the effectiveness of security testing by providing targeted, intelligent inputs to fuzzing engines. Instead of relying solely on random mutations, this skill leverages curated dictionaries of known keywords, magic numbers, and protocol commands. This strategic approach dramatically increases the chances of reaching complex code paths and uncovering latent vulnerabilities in parsers, communication protocols, and file format handlers. By guiding the fuzzer towards 'interesting' inputs, developers can achieve more comprehensive and efficient security assessments, ultimately leading to more robust and secure applications.

# When to Use This Skill
- •Improving the effectiveness of fuzzing for custom network protocols by supplying known command sequences and malformed headers.
- •Enhancing vulnerability detection in file format parsers (e.g., image, document, archive) by providing common delimiters, headers, and invalid structures.
- •Accelerating the discovery of edge cases and security flaws in configuration file interpreters by feeding them valid and subtly invalid syntax.
- •Testing API endpoints that consume complex data structures like JSON or XML by including common keys, values, and injection attempts.

# Pro Tips
- 💡Regularly update your fuzzing dictionaries with newly discovered edge cases, common vulnerabilities, and domain-specific keywords relevant to your evolving codebase.
- 💡Combine dictionary-based fuzzing with structural fuzzing (grammar-based) for highly complex inputs, allowing the fuzzer to both understand the format and inject meaningful tokens.
- 💡Prioritize creating dictionaries for the most critical or attack-surface-exposed components of your application, such as external APIs, network services, or file processing modules.

