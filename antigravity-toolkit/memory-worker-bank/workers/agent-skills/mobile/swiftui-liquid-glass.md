# swiftui-liquid-glass
Source: https://antigravity.codes/agent-skills/mobile/swiftui-liquid-glass

## AI Worker Instructions
When the user requests functionality related to swiftui-liquid-glass, follow these guidelines and utilize this context.

## Scraped Content

# swiftui-liquid-glass
```
glassEffect
```
```
GlassEffectContainer
```
```
GlassEffectContainer
```
```
GlassEffectContainer
```
```
.glassEffect(...)
```
```
.interactive()
```
```
#available(iOS 26, *)
```
```
#available(iOS 26, *)
```
```
GlassEffectContainer
```
```
glassEffect
```
```
interactive()
```
```
glassEffectID
```
```
@Namespace
```
```
GlassEffectContainer
```
```
.glassEffect(.regular.tint(...).interactive(), in: .rect(cornerRadius: ...))
```
```
.buttonStyle(.glass)
```
```
.buttonStyle(.glassProminent)
```
```
glassEffectID
```
```
if #available(iOS 26, *) {    Text("Hello")        .padding()        .glassEffect(.regular.interactive(), in: .rect(cornerRadius: 16))} else {    Text("Hello")        .padding()        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))}
```
```
if #available(iOS 26, *) {    Text("Hello")        .padding()        .glassEffect(.regular.interactive(), in: .rect(cornerRadius: 16))} else {    Text("Hello")        .padding()        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))}
```
```
GlassEffectContainer(spacing: 24) {    HStack(spacing: 24) {        Image(systemName: "scribble.variable")            .frame(width: 72, height: 72)            .font(.system(size: 32))            .glassEffect()        Image(systemName: "eraser.fill")            .frame(width: 72, height: 72)            .font(.system(size: 32))            .glassEffect()    }}
```
```
GlassEffectContainer(spacing: 24) {    HStack(spacing: 24) {        Image(systemName: "scribble.variable")            .frame(width: 72, height: 72)            .font(.system(size: 32))            .glassEffect()        Image(systemName: "eraser.fill")            .frame(width: 72, height: 72)            .font(.system(size: 32))            .glassEffect()    }}
```
```
Button("Confirm") { }    .buttonStyle(.glassProminent)
```
```
Button("Confirm") { }    .buttonStyle(.glassProminent)
```
```
references/liquid-glass.md
```
This powerful AI Agent Skill acts as your dedicated expert for integrating Apple's innovative Liquid Glass API into SwiftUI applications. Designed for developers targeting iOS 26+, it guides you through best practices for creating stunning, performant, and native-feeling user interfaces. From initial implementation to critical review and performance optimization, this skill ensures your app adheres to Apple's design language, leverages native modifiers like `glassEffect` and `GlassEffectContainer`, and provides a seamless, immersive user experience. Elevate your SwiftUI projects with sophisticated, interactive glass effects, all while maintaining code quality and efficiency.

# When to Use This Skill
- •Adopting the Liquid Glass API in a new SwiftUI feature for iOS 26+.
- •Refactoring an existing SwiftUI UI component to incorporate Liquid Glass effects.
- •Reviewing a SwiftUI implementation for correct, performant, and design-aligned Liquid Glass usage.
- •Implementing interactive glass effects for tappable or focusable SwiftUI elements.

# Pro Tips
- 💡Always prioritize native Liquid Glass APIs (`glassEffect`, `GlassEffectContainer`, glass button styles) and strictly follow Apple's Human Interface Guidelines for consistency and optimal user experience.
- 💡Introduce interactive glass effects only for tappable or focusable elements to maintain clarity, prevent visual clutter, and optimize performance.
- 💡Ensure proper iOS 26+ availability checks are in place and provide sensible fallbacks for older OS versions or clearly define the minimum supported target.

