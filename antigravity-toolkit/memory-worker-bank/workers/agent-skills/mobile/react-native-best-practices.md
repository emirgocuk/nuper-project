# react-native-best-practices
Source: https://antigravity.codes/agent-skills/mobile/react-native-best-practices

## AI Worker Instructions
When the user requests functionality related to react-native-best-practices, follow these guidelines and utilize this context.

## Scraped Content

# react-native-best-practices
```
js-*
```
```
bundle-*
```
```
native-*
```
```
bundle-*
```
```
native-*
```
```
js-*
```
```
native-*
```
```
js-*
```
```
# Open React Native DevTools# Press 'j' in Metro, or shake device → "Open DevTools"
```
```
# Open React Native DevTools# Press 'j' in Metro, or shake device → "Open DevTools"
```
```
useDeferredValue
```
```
npx react-native bundle \  --entry-file index.js \  --bundle-output output.js \  --platform ios \  --sourcemap-output output.js.map \  --dev false --minify truenpx source-map-explorer output.js --no-border-checks
```
```
npx react-native bundle \  --entry-file index.js \  --bundle-output output.js \  --platform ios \  --sourcemap-output output.js.map \  --dev false --minify truenpx source-map-explorer output.js --no-border-checks
```
```
react-native-performance
```
```
InteractionManager
```
```
references/
```
```
js-*
```
```
js-lists-flatlist-flashlist.md
```
```
js-profile-react.md
```
```
js-measure-fps.md
```
```
js-memory-leaks.md
```
```
js-atomic-state.md
```
```
js-concurrent-react.md
```
```
js-react-compiler.md
```
```
js-animations-reanimated.md
```
```
js-uncontrolled-components.md
```
```
native-*
```
```
native-turbo-modules.md
```
```
native-sdks-over-polyfills.md
```
```
native-measure-tti.md
```
```
native-threading-model.md
```
```
native-profiling.md
```
```
native-platform-setup.md
```
```
native-view-flattening.md
```
```
native-memory-patterns.md
```
```
native-memory-leaks.md
```
```
native-android-16kb-alignment.md
```
```
bundle-*
```
```
bundle-barrel-exports.md
```
```
bundle-analyze-js.md
```
```
bundle-tree-shaking.md
```
```
bundle-analyze-app.md
```
```
bundle-r8-android.md
```
```
bundle-hermes-mmap.md
```
```
bundle-native-assets.md
```
```
bundle-library-size.md
```
```
bundle-code-splitting.md
```
```
# Find patterns by keywordgrep -l "reanimated" references/grep -l "flatlist" references/grep -l "memory" references/grep -l "profil" references/grep -l "tti" references/grep -l "bundle" references/
```
```
# Find patterns by keywordgrep -l "reanimated" references/grep -l "flatlist" references/grep -l "memory" references/grep -l "profil" references/grep -l "tti" references/grep -l "bundle" references/
```
```
js-measure-fps.md
```
```
js-profile-react.md
```
```
js-profile-react.md
```
```
js-react-compiler.md
```
```
native-measure-tti.md
```
```
bundle-analyze-js.md
```
```
bundle-analyze-app.md
```
```
bundle-r8-android.md
```
```
js-memory-leaks.md
```
```
native-memory-leaks.md
```
```
js-animations-reanimated.md
```
```
js-lists-flatlist-flashlist.md
```
```
js-uncontrolled-components.md
```
```
native-turbo-modules.md
```
```
native-threading-model.md
```
```
native-android-16kb-alignment.md
```
Building high-performing React Native applications is crucial for user retention and a seamless experience. This specialized agent skill provides expert-level guidance to address common bottlenecks that plague mobile apps, from sluggish UIs to excessive battery drain. Leverage its comprehensive insights to proactively identify and resolve performance issues, ensuring your React Native projects deliver exceptional speed and responsiveness. Whether you're a seasoned developer or new to the ecosystem, this skill helps you build robust, optimized applications that delight users with their fluid performance and efficient resource usage.

# When to Use This Skill
- •Debugging persistent frame drops or janky animations in your React Native UI.
- •Optimizing app startup time (TTI) and reducing the overall bundle size of your application.
- •Investigating and resolving memory leaks in either the JavaScript or native layers of your app.
- •Applying Hermes optimization, addressing JavaScript thread blocking, or enhancing native module efficiency.

# Pro Tips
- 💡Combine this skill with a profiling tool (e.g., Flipper, Xcode Instruments, Android Studio Profiler) to accurately pinpoint bottlenecks before applying solutions.
- 💡Implement suggestions incrementally, measuring performance after each change to isolate the impact and avoid introducing new issues.
- 💡Prioritize optimizations marked as 'CRITICAL' or 'HIGH' impact by the skill first, as these often yield the most significant performance gains.
- 💡Regularly review your component re-renders using React DevTools to proactively identify unnecessary updates before they become performance problems.

