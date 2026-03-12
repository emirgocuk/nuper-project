# property-based-testing
Source: https://antigravity.codes/agent-skills/testing/property-based-testing

## AI Worker Instructions
When the user requests functionality related to property-based-testing, follow these guidelines and utilize this context.

## Scraped Content

# property-based-testing
```
encode
```
```
decode
```
```
serialize
```
```
deserialize
```
```
toJSON
```
```
fromJSON
```
```
pack
```
```
unpack
```
```
normalize
```
```
sanitize
```
```
clean
```
```
canonicalize
```
```
format
```
```
is_valid
```
```
validate
```
```
check_*
```
```
add
```
```
remove
```
```
get
```
```
decode(encode(x)) == x
```
```
f(f(x)) == f(x)
```
```
f(a, b) == f(b, a)
```
```
f(f(a,b), c) == f(a, f(b,c))
```
```
f(x, identity) == x
```
```
f(g(x)) == x
```
```
new_impl(x) == reference(x)
```
```
is_sorted(sort(x))
```
```
TASK: Writing new tests  → Read [{baseDir}/references/generating.md]({baseDir}/references/generating.md) (test generation patterns and examples)  → Then [{baseDir}/references/strategies.md]({baseDir}/references/strategies.md) if input generation is complexTASK: Designing a new feature  → Read [{baseDir}/references/design.md]({baseDir}/references/design.md) (Property-Driven Development approach)TASK: Code is difficult to test (mixed I/O, missing inverses)  → Read [{baseDir}/references/refactoring.md]({baseDir}/references/refactoring.md) (refactoring patterns for testability)TASK: Reviewing existing PBT tests  → Read [{baseDir}/references/reviewing.md]({baseDir}/references/reviewing.md) (quality checklist and anti-patterns)TASK: Need library reference  → Read [{baseDir}/references/libraries.md]({baseDir}/references/libraries.md) (PBT libraries by language, includes smart contract tools)
```
```
TASK: Writing new tests  → Read [{baseDir}/references/generating.md]({baseDir}/references/generating.md) (test generation patterns and examples)  → Then [{baseDir}/references/strategies.md]({baseDir}/references/strategies.md) if input generation is complexTASK: Designing a new feature  → Read [{baseDir}/references/design.md]({baseDir}/references/design.md) (Property-Driven Development approach)TASK: Code is difficult to test (mixed I/O, missing inverses)  → Read [{baseDir}/references/refactoring.md]({baseDir}/references/refactoring.md) (refactoring patterns for testability)TASK: Reviewing existing PBT tests  → Read [{baseDir}/references/reviewing.md]({baseDir}/references/reviewing.md) (quality checklist and anti-patterns)TASK: Need library reference  → Read [{baseDir}/references/libraries.md]({baseDir}/references/libraries.md) (PBT libraries by language, includes smart contract tools)
```
```
encode_message
```
```
decode_message
```
Property-Based Testing (PBT) represents a paradigm shift from example-based testing, empowering developers to uncover subtle edge cases and improve software robustness dramatically. This AI Agent Skill serves as your comprehensive guide, illuminating how to effectively apply PBT principles across diverse coding challenges, from intricate data serialization to critical smart contract logic. By leveraging its insights, you can move beyond mere 'what-if' scenarios to systematically explore input spaces, ensuring your applications are resilient and reliable under unforeseen conditions. Embrace this advanced testing methodology to elevate your code quality and security standards.

# When to Use This Skill
- •When designing new features that involve data serialization or parsing logic, to ensure robust roundtrip properties.
- •When reviewing or refactoring existing code, especially for validation or normalization functions, to confirm behavior across edge cases.
- •During the development of smart contracts, to verify state invariants, access control, and token operation integrity.
- •When traditional example-based tests feel insufficient for complex algorithmic or mathematical functions, requiring stronger coverage.

# Pro Tips
- 💡Start by identifying the simplest properties of your code's behavior, then gradually add more complex invariants. This iterative approach makes property definition more manageable.
- 💡Combine property-based tests with traditional example-based unit tests. PBT excels at finding unexpected inputs, while example tests ensure specific, known-good scenarios are handled correctly.
- 💡When a property-based test fails, leverage the 'shrinking' mechanism provided by PBT frameworks. This feature automatically finds the smallest input that causes the failure, significantly speeding up debugging.
- 💡Focus on pure functions and idempotent operations first. Their predictable nature makes defining properties straightforward, providing immediate value and building confidence in PBT.

