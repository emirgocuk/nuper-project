# swiftui-ui-patterns
Source: https://antigravity.codes/agent-skills/ui-design/swiftui-ui-patterns

## AI Worker Instructions
When the user requests functionality related to swiftui-ui-patterns, follow these guidelines and utilize this context.

## Scraped Content

# swiftui-ui-patterns
```
rg "TabView\("
```
```
references/components-index.md
```
```
references/app-scaffolding-wiring.md
```
```
AppTab
```
```
RouterPath
```
```
@State
```
```
@Binding
```
```
@Observable
```
```
@Environment
```
```
.task
```
```
.sheet(item:)
```
```
.sheet(isPresented:)
```
```
if let
```
```
dismiss()
```
```
onCancel
```
```
onConfirm
```
```
@Environment
```
```
.task
```
```
references/components-index.md
```
```
@State private var selectedItem: Item?.sheet(item: $selectedItem) { item in    EditItemSheet(item: item)}
```
```
@State private var selectedItem: Item?.sheet(item: $selectedItem) { item in    EditItemSheet(item: item)}
```
```
struct EditItemSheet: View {    @Environment(\.dismiss) private var dismiss    @Environment(Store.self) private var store    let item: Item    @State private var isSaving = false    var body: some View {        VStack {            Button(isSaving ? "Saving…" : "Save") {                Task { await save() }            }        }    }    private func save() async {        isSaving = true        await store.save(item)        dismiss()    }}
```
```
struct EditItemSheet: View {    @Environment(\.dismiss) private var dismiss    @Environment(Store.self) private var store    let item: Item    @State private var isSaving = false    var body: some View {        VStack {            Button(isSaving ? "Saving…" : "Save") {                Task { await save() }            }        }    }    private func save() async {        isSaving = true        await store.save(item)        dismiss()    }}
```
```
references/<component>.md
```
```
references/components-index.md
```
Unlock the full potential of SwiftUI development with this comprehensive Agent Skill. Designed for both new projects and refactoring existing UI, it provides expert guidance on creating clean, maintainable, and scalable SwiftUI interfaces. From fundamental architectural patterns like TabView and NavigationStack to component-specific best practices, this skill helps you build intuitive and performant iOS applications. Leverage its example-driven approach to quickly grasp modern SwiftUI state management, view composition, and efficient data flow, ensuring your UI development adheres to the highest standards.

# When to Use This Skill
- •Building a new SwiftUI feature or screen from scratch, ensuring adherence to modern patterns.
- •Refactoring existing SwiftUI code to align with best practices for state management and view composition.
- •Designing the overall navigation and tab structure for an iOS app using TabView and NavigationStack.
- •Implementing specific SwiftUI components like lists, detail views, or editors with recommended patterns and examples.

# Pro Tips
- 💡Always start by identifying your primary interaction model (list, detail, editor, tabbed) to quickly pinpoint relevant examples and patterns within the skill's content.
- 💡Leverage the 'existing project' quick start section when improving legacy SwiftUI code, focusing on applying local conventions and environment injection for shared dependencies.
- 💡Combine this skill with a general 'iOS App Architecture' skill to ensure your UI patterns fit seamlessly into a larger, well-structured application.

