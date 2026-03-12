# swiftui-performance-audit
Source: https://antigravity.codes/agent-skills/debugging/swiftui-performance-audit

## AI Worker Instructions
When the user requests functionality related to swiftui-performance-audit, follow these guidelines and utilize this context.

## Scraped Content

# swiftui-performance-audit
```
id
```
```
UUID()
```
```
body
```
```
GeometryReader
```
```
id
```
```
UUID()
```
```
body
```
```
GeometryReader
```
```
@State
```
```
@Observable
```
```
ForEach
```
```
body
```
```
@State
```
```
equatable()
```
```
body
```
```
var body: some View {    let number = NumberFormatter() // slow allocation    let measure = MeasurementFormatter() // slow allocation    Text(measure.string(from: .init(value: meters, unit: .meters)))}
```
```
var body: some View {    let number = NumberFormatter() // slow allocation    let measure = MeasurementFormatter() // slow allocation    Text(measure.string(from: .init(value: meters, unit: .meters)))}
```
```
final class DistanceFormatter {    static let shared = DistanceFormatter()    let number = NumberFormatter()    let measure = MeasurementFormatter()}
```
```
final class DistanceFormatter {    static let shared = DistanceFormatter()    let number = NumberFormatter()    let measure = MeasurementFormatter()}
```
```
var filtered: [Item] {    items.filter { $0.isEnabled } // runs on every body eval}
```
```
var filtered: [Item] {    items.filter { $0.isEnabled } // runs on every body eval}
```
```
@State private var filtered: [Item] = []// update filtered when inputs change
```
```
@State private var filtered: [Item] = []// update filtered when inputs change
```
```
body
```
```
ForEach
```
```
List {    ForEach(items.sorted(by: sortRule)) { item in        Row(item)    }}
```
```
List {    ForEach(items.sorted(by: sortRule)) { item in        Row(item)    }}
```
```
let sortedItems = items.sorted(by: sortRule)
```
```
let sortedItems = items.sorted(by: sortRule)
```
```
ForEach
```
```
ForEach(items.filter { $0.isEnabled }) { item in    Row(item)}
```
```
ForEach(items.filter { $0.isEnabled }) { item in    Row(item)}
```
```
ForEach(items, id: \.self) { item in    Row(item)}
```
```
ForEach(items, id: \.self) { item in    Row(item)}
```
```
id: \.self
```
```
Image(uiImage: UIImage(data: data)!)
```
```
Image(uiImage: UIImage(data: data)!)
```
```
@Observable class Model {    var items: [Item] = []}var body: some View {    Row(isFavorite: model.items.contains(item))}
```
```
@Observable class Model {    var items: [Item] = []}var body: some View {    Row(isFavorite: model.items.contains(item))}
```
```
references/
```
```
references/optimizing-swiftui-performance-instruments.md
```
```
references/understanding-improving-swiftui-performance.md
```
```
references/understanding-hangs-in-your-app.md
```
```
references/demystify-swiftui-performance-wwdc23.md
```
This skill empowers your coding assistant to act as a seasoned SwiftUI performance expert. It goes beyond basic debugging, diving deep into architectural patterns and common pitfalls that lead to sluggish user interfaces. Leverage this skill to identify the root causes of performance bottlenecks, from inefficient view updates to layout thrashing, and receive actionable, code-level recommendations. It's designed to streamline the optimization process, helping you deliver smooth, responsive SwiftUI applications without extensive manual profiling initially.

# When to Use This Skill
- •Diagnosing why a specific SwiftUI list or scroll view is exhibiting janky scrolling or stuttering animations.
- •Identifying the cause of high CPU or memory usage reported by users in a SwiftUI application.
- •Receiving expert code review feedback specifically focused on optimizing a new SwiftUI feature for performance.
- •Getting guidance on how to effectively use Apple Instruments to profile a SwiftUI app when code review isn't sufficient.

# Pro Tips
- 💡Provide the complete `body` of the suspected slow view and any relevant data sources or state management code for the most accurate review.
- 💡Clearly describe the exact performance symptoms (e.g., 'lag when scrolling past item 20', 'takes 3 seconds to load view') and precise reproduction steps.
- 💡If initial code review is inconclusive, be prepared to share screenshots of Instruments traces or specific performance metrics for deeper analysis.

