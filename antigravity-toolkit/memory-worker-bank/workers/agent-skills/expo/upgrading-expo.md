# upgrading-expo
Source: https://antigravity.codes/agent-skills/expo/upgrading-expo

## AI Worker Instructions
When the user requests functionality related to upgrading-expo, follow these guidelines and utilize this context.

## Scraped Content

# upgrading-expo
```
npx expo install expo@latestnpx expo install --fix
```
```
npx expo install expo@latestnpx expo install --fix
```
```
npx expo-doctor
```
```
npx expo export -p ios --clearrm -rf node_modules .expowatchman watch-del-all
```
```
npx expo export -p ios --clearrm -rf node_modules .expowatchman watch-del-all
```
```
npx expo prebuild --clean
```
```
npx expo prebuild --clean
```
```
ios
```
```
android
```
```
cd ios && pod install --repo-update
```
```
npx expo run:ios --no-build-cache
```
```
cd android && ./gradlew clean
```
```
"experiments": { "reactCompiler": true }
```
```
app.json
```
```
package.json
```
```
@babel/core
```
```
babel-preset-expo
```
```
expo-constants
```
```
expo-av
```
```
expo-audio
```
```
expo-video
```
```
expo-permissions
```
```
@expo/vector-icons
```
```
expo-symbols
```
```
AsyncStorage
```
```
expo-sqlite/localStorage/install
```
```
expo-app-loading
```
```
expo-splash-screen
```
```
patches/
```
```
autoprefixer
```
```
postcss.config.mjs
```
```
experimentalImportSupport
```
```
EXPO_USE_FAST_RESOLVER=1
```
```
"newArchEnabled": true
```
Navigating the complexities of SDK upgrades and dependency conflicts can often be a significant hurdle in mobile development. This specialized AI agent skill is meticulously designed to streamline the process of updating your Expo projects. It provides a structured approach, from initial dependency upgrades and diagnostic checks to addressing breaking changes and managing native module modifications. By leveraging this skill, developers can minimize downtime, prevent common pitfalls, and ensure a smooth, stable transition to newer Expo SDK versions, ultimately enhancing project maintainability and performance. It's your indispensable guide for keeping Expo applications current and robust.

# When to Use This Skill
- •Upgrading an existing Expo project to the latest SDK version to access new features and performance improvements.
- •Troubleshooting `expo-doctor` errors and resolving common dependency conflicts after an upgrade attempt.
- •Migrating an Expo project that utilizes native modules, requiring a `prebuild` step.
- •Preparing an Expo project for major changes like React 19 or the New Architecture by understanding breaking changes.

# Pro Tips
- 💡Before initiating any major upgrade, always commit your current working changes and consider creating a dedicated Git branch. This provides a safe rollback point if unexpected issues arise.
- 💡Thoroughly review the official Expo release notes for your target SDK version beforehand, paying close attention to 'Breaking Changes' and 'Known Issues' sections.
- 💡When using `npx expo prebuild --clean`, be mindful. If your project contains custom native code in the `ios` or `android` directories not managed by Expo config plugins, ensure you back it up first.

