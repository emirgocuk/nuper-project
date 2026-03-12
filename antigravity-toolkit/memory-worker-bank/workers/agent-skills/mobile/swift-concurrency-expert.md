# swift-concurrency-expert
Source: https://antigravity.codes/agent-skills/mobile/swift-concurrency-expert

## AI Worker Instructions
When the user requests functionality related to swift-concurrency-expert, follow these guidelines and utilize this context.

## Scraped Content

# swift-concurrency-expert
```
@MainActor
```
```
actor
```
```
nonisolated
```
```
@MainActor
```
```
extension Foo: @MainActor SomeProtocol
```
```
@MainActor
```
```
@concurrent
```
```
nonisolated
```
```
actor
```
```
Sendable
```
```
@unchecked Sendable
```
```
references/swift-6-2-concurrency.md
```
```
references/approachable-concurrency.md
```
```
references/swiftui-concurrency-tour-wwdc.md
```
Navigating the complexities of modern Swift Concurrency, especially with Swift 6.2 and beyond, can be challenging. Data races, actor isolation violations, and `Sendable` compliance are common pitfalls that can lead to subtle bugs or compiler errors. This dedicated AI agent skill is engineered to simplify that process, providing expert analysis and precise recommendations. It helps developers ensure their Swift applications leverage the power of structured concurrency safely and efficiently, transforming error-ridden code into robust, performant, and compliant Swift. By focusing on minimal, impactful changes, it safeguards your existing logic while bringing your codebase up to modern concurrency standards.

# When to Use This Skill
- •Resolving `Sendable` conformance warnings and errors in complex data structures.
- •Migrating legacy asynchronous Swift code to use modern `async`/`await` and actor patterns.
- •Identifying and fixing data races or incorrect actor isolation issues flagged by the Swift compiler.
- •Optimizing the use of `@MainActor` and other actors to improve UI responsiveness and background task management.

# Pro Tips
- 💡Always provide the exact compiler error messages and line numbers for the most precise fixes.
- 💡Clearly indicate whether the code is part of a UI-bound component (e.g., `UIView`, `UIViewController`) or background processing.
- 💡Mention your project's Swift language version and strict concurrency checking level for tailored advice.

