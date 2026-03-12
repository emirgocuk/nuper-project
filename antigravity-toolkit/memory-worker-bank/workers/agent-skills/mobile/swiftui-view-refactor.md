# swiftui-view-refactor
Source: https://antigravity.codes/agent-skills/mobile/swiftui-view-refactor

## AI Worker Instructions
When the user requests functionality related to swiftui-view-refactor, follow these guidelines and utilize this context.

## Scraped Content

# swiftui-view-refactor
```
private
```
```
public
```
```
let
```
```
@State
```
```
var
```
```
init
```
```
body
```
```
@State
```
```
@Environment
```
```
@Query
```
```
task
```
```
onChange
```
```
@Environment
```
```
body
```
```
var header: some View { ... }
```
```
View
```
```
View
```
```
var body: some View {    VStack(alignment: .leading, spacing: 16) {        HeaderSection(title: title, isPinned: isPinned)        DetailsSection(details: details)        ActionsSection(onSave: onSave, onCancel: onCancel)    }}
```
```
var body: some View {    VStack(alignment: .leading, spacing: 16) {        HeaderSection(title: title, isPinned: isPinned)        DetailsSection(details: details)        ActionsSection(onSave: onSave, onCancel: onCancel)    }}
```
```
var body: some View {    List {        header        filters        results        footer    }}private var header: some View {    VStack(alignment: .leading, spacing: 6) {        Text(title).font(.title2)        Text(subtitle).font(.subheadline)    }}private var filters: some View {    ScrollView(.horizontal, showsIndicators: false) {        HStack {            ForEach(filterOptions, id: \.self) { option in                FilterChip(option: option, isSelected: option == selectedFilter)                    .onTapGesture { selectedFilter = option }            }        }    }}
```
```
var body: some View {    List {        header        filters        results        footer    }}private var header: some View {    VStack(alignment: .leading, spacing: 6) {        Text(title).font(.title2)        Text(subtitle).font(.subheadline)    }}private var filters: some View {    ScrollView(.horizontal, showsIndicators: false) {        HStack {            ForEach(filterOptions, id: \.self) { option in                FilterChip(option: option, isSelected: option == selectedFilter)                    .onTapGesture { selectedFilter = option }            }        }    }}
```
```
private var header: some View {    HeaderSection(title: title, subtitle: subtitle, status: status)}private struct HeaderSection: View {    let title: String    let subtitle: String?    let status: Status    var body: some View {        VStack(alignment: .leading, spacing: 4) {            Text(title).font(.headline)            if let subtitle { Text(subtitle).font(.subheadline) }            StatusBadge(status: status)        }    }}
```
```
private var header: some View {    HeaderSection(title: title, subtitle: subtitle, status: status)}private struct HeaderSection: View {    let title: String    let subtitle: String?    let status: Status    var body: some View {        VStack(alignment: .leading, spacing: 4) {            Text(title).font(.headline)            if let subtitle { Text(subtitle).font(.subheadline) }            StatusBadge(status: status)        }    }}
```
```
init
```
```
init
```
```
bootstrapIfNeeded
```
```
@State private var viewModel: SomeViewModelinit(dependency: Dependency) {    _viewModel = State(initialValue: SomeViewModel(dependency: dependency))}
```
```
@State private var viewModel: SomeViewModelinit(dependency: Dependency) {    _viewModel = State(initialValue: SomeViewModel(dependency: dependency))}
```
```
@Observable
```
```
@State
```
```
@State
```
```
@Environment
```
```
@Query
```
```
task
```
```
onChange
```
```
@State
```
```
init
```
```
@State
```
```
@Observable
```
```
body
```
```
init
```
```
references/mv-patterns.md
```
```
private
```
```
// MARK: -
```
```
// MARK: - Actions
```
```
// MARK: - Subviews
```
```
// MARK: - Helpers
```
```
struct
```
```
body
```
Unlock superior maintainability and readability for your SwiftUI projects with this specialized AI agent skill. Designed to meticulously review and restructure your view files, it ensures adherence to modern SwiftUI paradigms. From consistent view ordering to robust dependency injection and optimal `@Observable` usage, this skill elevates your codebase. Developers can rely on it to automate the enforcement of architectural patterns, significantly reducing technical debt and improving collaboration across teams. Integrate it to streamline your development workflow and build more resilient, scalable iOS applications.

# When to Use This Skill
- •Refactoring a large, complex SwiftUI `body` into smaller, manageable subviews.
- •Standardizing the initialization and passing of `@Environment` objects and `@Observable` state.
- •Enforcing consistent view property ordering (Environment, @State, computed vars, init, body) within new or existing SwiftUI files.
- •Applying the Model-View (MV) pattern by ensuring views are lightweight and logic resides in models/services.

# Pro Tips
- 💡Always run this skill after initial view development to catch structural inconsistencies early, before they become deeply ingrained.
- 💡Combine this skill with a Swift linter to enforce both structural best practices and granular Swift style guidelines simultaneously.
- 💡Prioritize injecting shared models and services via `@Environment` or direct parameters to keep views small and highly composable, strictly adhering to the MV pattern.

