# mobile-ios-design
Source: https://antigravity.codes/agent-skills/mobile/mobile-ios-design

## AI Worker Instructions
When the user requests functionality related to mobile-ios-design, follow these guidelines and utilize this context.

## Scraped Content

# mobile-ios-design
```
// Vertical stack with alignmentVStack(alignment: .leading, spacing: 12) {    Text("Title")        .font(.headline)    Text("Subtitle")        .font(.subheadline)        .foregroundStyle(.secondary)}// Horizontal stack with flexible spacingHStack {    Image(systemName: "star.fill")    Text("Featured")    Spacer()    Text("View All")        .foregroundStyle(.blue)}
```
```
// Vertical stack with alignmentVStack(alignment: .leading, spacing: 12) {    Text("Title")        .font(.headline)    Text("Subtitle")        .font(.subheadline)        .foregroundStyle(.secondary)}// Horizontal stack with flexible spacingHStack {    Image(systemName: "star.fill")    Text("Featured")    Spacer()    Text("View All")        .foregroundStyle(.blue)}
```
```
// Adaptive grid that fills available widthLazyVGrid(columns: [    GridItem(.adaptive(minimum: 150, maximum: 200))], spacing: 16) {    ForEach(items) { item in        ItemCard(item: item)    }}// Fixed column gridLazyVGrid(columns: [    GridItem(.flexible()),    GridItem(.flexible()),    GridItem(.flexible())], spacing: 12) {    ForEach(items) { item in        ItemThumbnail(item: item)    }}
```
```
// Adaptive grid that fills available widthLazyVGrid(columns: [    GridItem(.adaptive(minimum: 150, maximum: 200))], spacing: 16) {    ForEach(items) { item in        ItemCard(item: item)    }}// Fixed column gridLazyVGrid(columns: [    GridItem(.flexible()),    GridItem(.flexible()),    GridItem(.flexible())], spacing: 12) {    ForEach(items) { item in        ItemThumbnail(item: item)    }}
```
```
struct ContentView: View {    @State private var path = NavigationPath()    var body: some View {        NavigationStack(path: $path) {            List(items) { item in                NavigationLink(value: item) {                    ItemRow(item: item)                }            }            .navigationTitle("Items")            .navigationDestination(for: Item.self) { item in                ItemDetailView(item: item)            }        }    }}
```
```
struct ContentView: View {    @State private var path = NavigationPath()    var body: some View {        NavigationStack(path: $path) {            List(items) { item in                NavigationLink(value: item) {                    ItemRow(item: item)                }            }            .navigationTitle("Items")            .navigationDestination(for: Item.self) { item in                ItemDetailView(item: item)            }        }    }}
```
```
struct MainTabView: View {    @State private var selectedTab = 0    var body: some View {        TabView(selection: $selectedTab) {            HomeView()                .tabItem {                    Label("Home", systemImage: "house")                }                .tag(0)            SearchView()                .tabItem {                    Label("Search", systemImage: "magnifyingglass")                }                .tag(1)            ProfileView()                .tabItem {                    Label("Profile", systemImage: "person")                }                .tag(2)        }    }}
```
```
struct MainTabView: View {    @State private var selectedTab = 0    var body: some View {        TabView(selection: $selectedTab) {            HomeView()                .tabItem {                    Label("Home", systemImage: "house")                }                .tag(0)            SearchView()                .tabItem {                    Label("Search", systemImage: "magnifyingglass")                }                .tag(1)            ProfileView()                .tabItem {                    Label("Profile", systemImage: "person")                }                .tag(2)        }    }}
```
```
// Basic symbolImage(systemName: "heart.fill")    .foregroundStyle(.red)// Symbol with rendering modeImage(systemName: "cloud.sun.fill")    .symbolRenderingMode(.multicolor)// Variable symbol (iOS 16+)Image(systemName: "speaker.wave.3.fill", variableValue: volume)// Symbol effect (iOS 17+)Image(systemName: "bell.fill")    .symbolEffect(.bounce, value: notificationCount)
```
```
// Basic symbolImage(systemName: "heart.fill")    .foregroundStyle(.red)// Symbol with rendering modeImage(systemName: "cloud.sun.fill")    .symbolRenderingMode(.multicolor)// Variable symbol (iOS 16+)Image(systemName: "speaker.wave.3.fill", variableValue: volume)// Symbol effect (iOS 17+)Image(systemName: "bell.fill")    .symbolEffect(.bounce, value: notificationCount)
```
```
// Use semantic fontsText("Headline")    .font(.headline)Text("Body text that scales with user preferences")    .font(.body)// Custom font that respects Dynamic TypeText("Custom")    .font(.custom("Avenir", size: 17, relativeTo: .body))
```
```
// Use semantic fontsText("Headline")    .font(.headline)Text("Body text that scales with user preferences")    .font(.body)// Custom font that respects Dynamic TypeText("Custom")    .font(.custom("Avenir", size: 17, relativeTo: .body))
```
```
// Semantic colors that adapt to light/dark modeText("Primary")    .foregroundStyle(.primary)Text("Secondary")    .foregroundStyle(.secondary)// System materials for blur effectsRectangle()    .fill(.ultraThinMaterial)    .frame(height: 100)// Vibrant materials for overlaysText("Overlay")    .padding()    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
```
```
// Semantic colors that adapt to light/dark modeText("Primary")    .foregroundStyle(.primary)Text("Secondary")    .foregroundStyle(.secondary)// System materials for blur effectsRectangle()    .fill(.ultraThinMaterial)    .frame(height: 100)// Vibrant materials for overlaysText("Overlay")    .padding()    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
```
```
// Standard card shadowRoundedRectangle(cornerRadius: 16)    .fill(.background)    .shadow(color: .black.opacity(0.1), radius: 8, y: 4)// Elevated appearance.shadow(radius: 2, y: 1).shadow(radius: 8, y: 4)
```
```
// Standard card shadowRoundedRectangle(cornerRadius: 16)    .fill(.background)    .shadow(color: .black.opacity(0.1), radius: 8, y: 4)// Elevated appearance.shadow(radius: 2, y: 1).shadow(radius: 8, y: 4)
```
```
import SwiftUIstruct FeatureCard: View {    let title: String    let description: String    let systemImage: String    var body: some View {        HStack(spacing: 16) {            Image(systemName: systemImage)                .font(.title)                .foregroundStyle(.blue)                .frame(width: 44, height: 44)                .background(.blue.opacity(0.1), in: Circle())            VStack(alignment: .leading, spacing: 4) {                Text(title)                    .font(.headline)                Text(description)                    .font(.subheadline)                    .foregroundStyle(.secondary)                    .lineLimit(2)            }            Spacer()            Image(systemName: "chevron.right")                .foregroundStyle(.tertiary)        }        .padding()        .background(.background, in: RoundedRectangle(cornerRadius: 12))        .shadow(color: .black.opacity(0.05), radius: 4, y: 2)    }}
```
```
import SwiftUIstruct FeatureCard: View {    let title: String    let description: String    let systemImage: String    var body: some View {        HStack(spacing: 16) {            Image(systemName: systemImage)                .font(.title)                .foregroundStyle(.blue)                .frame(width: 44, height: 44)                .background(.blue.opacity(0.1), in: Circle())            VStack(alignment: .leading, spacing: 4) {                Text(title)                    .font(.headline)                Text(description)                    .font(.subheadline)                    .foregroundStyle(.secondary)                    .lineLimit(2)            }            Spacer()            Image(systemName: "chevron.right")                .foregroundStyle(.tertiary)        }        .padding()        .background(.background, in: RoundedRectangle(cornerRadius: 12))        .shadow(color: .black.opacity(0.05), radius: 4, y: 2)    }}
```
```
.primary
```
```
.secondary
```
```
.background
```
```
.body
```
```
.headline
```
```
.accessibilityLabel()
```
```
.accessibilityHint()
```
```
safeAreaInset
```
```
@SceneStorage
```
```
.fixedSize()
```
```
LazyVStack
```
```
LazyHStack
```
```
NavigationLink
```
```
Hashable
```
Unlock the power of pristine iOS application development with this specialized agent skill. It equips you with the fundamental knowledge and practical techniques to craft user interfaces that are not just functional but also inherently intuitive and visually harmonious with Apple's ecosystem. By internalizing the Human Interface Guidelines and mastering SwiftUI's declarative syntax, you can build apps that resonate deeply with users, offering a seamless and delightful experience. Leverage this skill to elevate your mobile projects, ensuring every interaction feels natural and every pixel perfectly placed within the iOS design paradigm.

# When to Use This Skill
- •When starting a new iOS project, to establish a design language that strictly adheres to Apple's Human Interface Guidelines.
- •For converting a conceptual UI sketch into functional SwiftUI code, including responsive layouts and system components.
- •When debugging or refining existing iOS UI code to ensure it follows best practices for navigation, accessibility, and dynamic typing.
- •To implement complex iOS-specific interactions or animations that feel native and polished.

# Pro Tips
- 💡Always prioritize clarity and user context; the HIG isn't just a style guide, it's about user experience and user delight.
- 💡Leverage Xcode's Previews extensively with different device sizes, accessibility settings, and dark/light modes to ensure your SwiftUI views are truly adaptive.
- 💡Don't just copy-paste; understand *why* Apple recommends certain patterns. This allows you to adapt them effectively to unique app requirements while maintaining a native feel.

