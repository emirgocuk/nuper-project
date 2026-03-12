# react-native-expo
Source: https://antigravity.codes/agent-skills/expo/react-native-expo

## AI Worker Instructions
When the user requests functionality related to react-native-expo, follow these guidelines and utilize this context.

## Scraped Content

# react-native-expo
```
# Create new Expo app with React Native 0.76+npx create-expo-app@latest my-appcd my-app# Install latest dependenciesnpx expo install react-native@latest expo@latest
```
```
# Create new Expo app with React Native 0.76+npx create-expo-app@latest my-appcd my-app# Install latest dependenciesnpx expo install react-native@latest expo@latest
```
```
# Check if New Architecture is enabled (should be true by default)npx expo config --type introspect | grep newArchEnabled
```
```
# Check if New Architecture is enabled (should be true by default)npx expo config --type introspect | grep newArchEnabled
```
```
# Start Expo dev servernpx expo start# Press 'i' for iOS simulator# Press 'a' for Android emulator# Press 'j' to open React Native DevTools (NOT Chrome debugger!)
```
```
# Start Expo dev servernpx expo start# Press 'i' for iOS simulator# Press 'a' for Android emulator# Press 'j' to open React Native DevTools (NOT Chrome debugger!)
```
```
console.log()
```
```
# This will FAIL in 0.82+ / SDK 55+:# gradle.properties (Android)newArchEnabled=false  # ❌ Ignored, build fails# iOSRCT_NEW_ARCH_ENABLED=0  # ❌ Ignored, build fails
```
```
# This will FAIL in 0.82+ / SDK 55+:# gradle.properties (Android)newArchEnabled=false  # ❌ Ignored, build fails# iOSRCT_NEW_ARCH_ENABLED=0  # ❌ Ignored, build fails
```
```
propTypes
```
```
import PropTypes from 'prop-types';function MyComponent({ name, age }) {  return <Text>{name} is {age}</Text>;}MyComponent.propTypes = {  // ❌ Silently ignored in React 19  name: PropTypes.string.isRequired,  age: PropTypes.number};
```
```
import PropTypes from 'prop-types';function MyComponent({ name, age }) {  return <Text>{name} is {age}</Text>;}MyComponent.propTypes = {  // ❌ Silently ignored in React 19  name: PropTypes.string.isRequired,  age: PropTypes.number};
```
```
type MyComponentProps = {  name: string;  age?: number;};function MyComponent({ name, age }: MyComponentProps) {  return <Text>{name} is {age}</Text>;}
```
```
type MyComponentProps = {  name: string;  age?: number;};function MyComponent({ name, age }: MyComponentProps) {  return <Text>{name} is {age}</Text>;}
```
```
# Use React 19 codemod to remove propTypesnpx @codemod/react-19 upgrade
```
```
# Use React 19 codemod to remove propTypesnpx @codemod/react-19 upgrade
```
```
forwardRef
```
```
ref
```
```
import { forwardRef } from 'react';const MyInput = forwardRef((props, ref) => {  // ❌ Deprecated  return <TextInput ref={ref} {...props} />;});
```
```
import { forwardRef } from 'react';const MyInput = forwardRef((props, ref) => {  // ❌ Deprecated  return <TextInput ref={ref} {...props} />;});
```
```
function MyInput({ ref, ...props }) {  // ✅ ref is a regular prop  return <TextInput ref={ref} {...props} />;}
```
```
function MyInput({ ref, ...props }) {  // ✅ ref is a regular prop  return <TextInput ref={ref} {...props} />;}
```
```
AppDelegate.swift
```
```
AppDelegate.mm
```
```
ios/MyApp/├── main.m              # ❌ Removed├── AppDelegate.h       # ❌ Removed└── AppDelegate.mm      # ❌ Removed
```
```
ios/MyApp/├── main.m              # ❌ Removed├── AppDelegate.h       # ❌ Removed└── AppDelegate.mm      # ❌ Removed
```
```
// ios/MyApp/AppDelegate.swift ✅import UIKitimport React@mainclass AppDelegate: UIResponder, UIApplicationDelegate {  func application(_ application: UIApplication, ...) -> Bool {    // App initialization    return true  }}
```
```
// ios/MyApp/AppDelegate.swift ✅import UIKitimport React@mainclass AppDelegate: UIResponder, UIApplicationDelegate {  func application(_ application: UIApplication, ...) -> Bool {    // App initialization    return true  }}
```
```
// Add to AppDelegate.swift during migrationimport Reactimport ReactCoreModulesRCTAppDependencyProvider.sharedInstance()  // ⚠️ CRITICAL: Must add this!
```
```
// Add to AppDelegate.swift during migrationimport Reactimport ReactCoreModulesRCTAppDependencyProvider.sharedInstance()  // ⚠️ CRITICAL: Must add this!
```
```
console.log()
```
```
# console.log() appeared in Metro terminal$ npx expo start> LOG  Hello from app!  # ✅ Appeared here
```
```
# console.log() appeared in Metro terminal$ npx expo start> LOG  Hello from app!  # ✅ Appeared here
```
```
# console.log() does NOT appear in Metro terminal$ npx expo start# (no logs shown)  # ❌ Removed# Workaround (temporary, will be removed):$ npx expo start --client-logs  # Shows logs, deprecated
```
```
# console.log() does NOT appear in Metro terminal$ npx expo start# (no logs shown)  # ❌ Removed# Workaround (temporary, will be removed):$ npx expo start --client-logs  # Shows logs, deprecated
```
```
chrome://inspect
```
```
# ❌ This no longer works:# Open Dev Menu → "Debug" → Chrome DevTools opens
```
```
# ❌ This no longer works:# Open Dev Menu → "Debug" → Chrome DevTools opens
```
```
# Press 'j' in CLI or Dev Menu → "Open React Native DevTools"# ✅ Uses Chrome DevTools Protocol (CDP)# ✅ Reliable breakpoints, watch values, stack inspection# ✅ JS Console (replaces Metro logs)
```
```
# Press 'j' in CLI or Dev Menu → "Open React Native DevTools"# ✅ Uses Chrome DevTools Protocol (CDP)# ✅ Reliable breakpoints, watch values, stack inspection# ✅ JS Console (replaces Metro logs)
```
```
# JSC removed from React Native core# If you still need JSC (rare):npm install @react-native-community/javascriptcore
```
```
# JSC removed from React Native core# If you still need JSC (rare):npm install @react-native-community/javascriptcore
```
```
// ❌ Deep imports deprecatedimport Button from 'react-native/Libraries/Components/Button';import Platform from 'react-native/Libraries/Utilities/Platform';
```
```
// ❌ Deep imports deprecatedimport Button from 'react-native/Libraries/Components/Button';import Platform from 'react-native/Libraries/Utilities/Platform';
```
```
// ✅ Import only from 'react-native'import { Button, Platform } from 'react-native';
```
```
// ✅ Import only from 'react-native'import { Button, Platform } from 'react-native';
```
```
// app.json or app.config.js{  "expo": {    "android": {      // This setting is now IGNORED - edge-to-edge always enabled      "edgeToEdgeEnabled": false  // ❌ No effect in SDK 54+    }  }}
```
```
// app.json or app.config.js{  "expo": {    "android": {      // This setting is now IGNORED - edge-to-edge always enabled      "edgeToEdgeEnabled": false  // ❌ No effect in SDK 54+    }  }}
```
```
react-native-safe-area-context
```
```
import { SafeAreaView } from 'react-native-safe-area-context';function App() {  return (    <SafeAreaView style={{ flex: 1 }}>      {/* Content respects system bars */}    </SafeAreaView>  );}
```
```
import { SafeAreaView } from 'react-native-safe-area-context';function App() {  return (    <SafeAreaView style={{ flex: 1 }}>      {/* Content respects system bars */}    </SafeAreaView>  );}
```
```
display: contents
```
```
<View style={{ display: 'contents' }}>  {/* This View disappears, but Text still renders */}  <Text>I'm still here!</Text></View>
```
```
<View style={{ display: 'contents' }}>  {/* This View disappears, but Text still renders */}  <Text>I'm still here!</Text></View>
```
```
boxSizing
```
```
// Default: padding/border inside box<View style={{  boxSizing: 'border-box',  // Default  width: 100,  padding: 10,  borderWidth: 2  // Total width: 100 (padding/border inside)}} />// Content-box: padding/border outside<View style={{  boxSizing: 'content-box',  width: 100,  padding: 10,  borderWidth: 2  // Total width: 124 (100 + 20 padding + 4 border)}} />
```
```
// Default: padding/border inside box<View style={{  boxSizing: 'border-box',  // Default  width: 100,  padding: 10,  borderWidth: 2  // Total width: 100 (padding/border inside)}} />// Content-box: padding/border outside<View style={{  boxSizing: 'content-box',  width: 100,  padding: 10,  borderWidth: 2  // Total width: 124 (100 + 20 padding + 4 border)}} />
```
```
mixBlendMode
```
```
isolation
```
```
<View style={{ backgroundColor: 'red' }}>  <View style={{    mixBlendMode: 'multiply',  // 16 modes available    backgroundColor: 'blue'    // Result: purple (red × blue)  }} /></View>// Prevent unwanted blending:<View style={{ isolation: 'isolate' }}>  {/* Blending contained within this view */}</View>
```
```
<View style={{ backgroundColor: 'red' }}>  <View style={{    mixBlendMode: 'multiply',  // 16 modes available    backgroundColor: 'blue'    // Result: purple (red × blue)  }} /></View>// Prevent unwanted blending:<View style={{ isolation: 'isolate' }}>  {/* Blending contained within this view */}</View>
```
```
multiply
```
```
screen
```
```
overlay
```
```
darken
```
```
lighten
```
```
color-dodge
```
```
color-burn
```
```
hard-light
```
```
soft-light
```
```
difference
```
```
exclusion
```
```
hue
```
```
saturation
```
```
color
```
```
luminosity
```
```
outline
```
```
border
```
```
<View style={{  outlineWidth: 2,  outlineStyle: 'solid',      // solid | dashed | dotted  outlineColor: 'blue',  outlineOffset: 4,           // Space between element and outline  outlineSpread: 2            // Expand outline beyond offset}} />
```
```
<View style={{  outlineWidth: 2,  outlineStyle: 'solid',      // solid | dashed | dotted  outlineColor: 'blue',  outlineOffset: 4,           // Space between element and outline  outlineSpread: 2            // Expand outline beyond offset}} />
```
```
// Load XML drawable at build timeimport MyIcon from './assets/my_icon.xml';<Image  source={MyIcon}  style={{ width: 40, height: 40 }}/>// Or with require:<Image  source={require('./assets/my_icon.xml')}  style={{ width: 40, height: 40 }}/>
```
```
// Load XML drawable at build timeimport MyIcon from './assets/my_icon.xml';<Image  source={MyIcon}  style={{ width: 40, height: 40 }}/>// Or with require:<Image  source={require('./assets/my_icon.xml')}  style={{ width: 40, height: 40 }}/>
```
```
useActionState
```
```
import { useActionState } from 'react';function MyForm() {  const [state, submitAction, isPending] = useActionState(    async (prevState, formData) => {      // Async form submission      const result = await api.submit(formData);      return result;    },    { message: '' }  // Initial state  );  return (    <form action={submitAction}>      <TextInput name="email" />      <Button disabled={isPending}>        {isPending ? 'Submitting...' : 'Submit'}      </Button>      {state.message && <Text>{state.message}</Text>}    </form>  );}
```
```
import { useActionState } from 'react';function MyForm() {  const [state, submitAction, isPending] = useActionState(    async (prevState, formData) => {      // Async form submission      const result = await api.submit(formData);      return result;    },    { message: '' }  // Initial state  );  return (    <form action={submitAction}>      <TextInput name="email" />      <Button disabled={isPending}>        {isPending ? 'Submitting...' : 'Submit'}      </Button>      {state.message && <Text>{state.message}</Text>}    </form>  );}
```
```
useOptimistic
```
```
import { useOptimistic } from 'react';function LikeButton({ postId, initialLikes }) {  const [optimisticLikes, addOptimisticLike] = useOptimistic(    initialLikes,    (currentLikes, amount) => currentLikes + amount  );  async function handleLike() {    addOptimisticLike(1);  // Update UI immediately    await api.like(postId);  // Then update server  }  return (    <Button onPress={handleLike}>      ❤️ {optimisticLikes}    </Button>  );}
```
```
import { useOptimistic } from 'react';function LikeButton({ postId, initialLikes }) {  const [optimisticLikes, addOptimisticLike] = useOptimistic(    initialLikes,    (currentLikes, amount) => currentLikes + amount  );  async function handleLike() {    addOptimisticLike(1);  // Update UI immediately    await api.like(postId);  // Then update server  }  return (    <Button onPress={handleLike}>      ❤️ {optimisticLikes}    </Button>  );}
```
```
use
```
```
import { use } from 'react';function UserProfile({ userPromise }) {  // Read promise directly during render (suspends if pending)  const user = use(userPromise);  return <Text>{user.name}</Text>;}
```
```
import { use } from 'react';function UserProfile({ userPromise }) {  // Read promise directly during render (suspends if pending)  const user = use(userPromise);  return <Text>{user.name}</Text>;}
```
```
j
```
```
propTypes
```
```
npx @codemod/react-19 upgrade
```
```
Warning: forwardRef is deprecated
```
```
ref
```
```
forwardRef
```
```
ref
```
```
newArchEnabled=false
```
```
Fabric component descriptor provider not found for component
```
```
TurboModule '[ModuleName]' not found
```
```
RCTAppDependencyProvider not found
```
```
RCTAppDependencyProvider.sharedInstance()
```
```
console.log()
```
```
--client-logs
```
```
Module not found: react-native/Libraries/...
```
```
'react-native'
```
```
redux
```
```
redux-thunk
```
```
@reduxjs/toolkit
```
```
i18n-js
```
```
react-i18next
```
```
null
```
```
Module not found: expo-file-system/legacy
```
```
expo-file-system
```
```
expo-file-system/legacy
```
```
expo-file-system
```
```
import * as FileSystem from 'expo-file-system/legacy';await FileSystem.writeAsStringAsync(uri, content);
```
```
import * as FileSystem from 'expo-file-system/legacy';await FileSystem.writeAsStringAsync(uri, content);
```
```
import { File } from 'expo-file-system';const file = new File(uri);await file.writeString(content);
```
```
import { File } from 'expo-file-system';const file = new File(uri);await file.writeString(content);
```
```
Module not found: expo-av
```
```
expo-video
```
```
expo-audio
```
```
expo-av
```
```
expo-av
```
```
expo-av
```
```
// OLD: expo-avimport { Audio } from 'expo-av';const { sound } = await Audio.Sound.createAsync(require('./audio.mp3'));await sound.playAsync();// NEW: expo-audioimport { useAudioPlayer } from 'expo-audio';const player = useAudioPlayer(require('./audio.mp3'));player.play();
```
```
// OLD: expo-avimport { Audio } from 'expo-av';const { sound } = await Audio.Sound.createAsync(require('./audio.mp3'));await sound.playAsync();// NEW: expo-audioimport { useAudioPlayer } from 'expo-audio';const player = useAudioPlayer(require('./audio.mp3'));player.play();
```
```
// OLD: expo-avimport { Video } from 'expo-av';<Video source={require('./video.mp4')} />// NEW: expo-videoimport { VideoView } from 'expo-video';<VideoView source={require('./video.mp4')} />
```
```
// OLD: expo-avimport { Video } from 'expo-av';<Video source={require('./video.mp4')} />// NEW: expo-videoimport { VideoView } from 'expo-video';<VideoView source={require('./video.mp4')} />
```
```
# NativeWind does not support Reanimated v4 yet (as of Jan 2026)# If using NativeWind, must stay on Reanimated v3npm install react-native-reanimated@^3
```
```
# NativeWind does not support Reanimated v4 yet (as of Jan 2026)# If using NativeWind, must stay on Reanimated v3npm install react-native-reanimated@^3
```
```
react-native-worklets
```
```
babel-preset-expo
```
```
hermes::vm::JSObject::putComputed_RJShermes::vm::arrayPrototypePush
```
```
hermes::vm::JSObject::putComputed_RJShermes::vm::arrayPrototypePush
```
```
:hermes_enabled
```
```
expo-updates
```
```
# ios/Podfileuse_frameworks! :linkage => :staticENV['HERMES_ENABLED'] = '1'  # ⚠️ CRITICAL: Must be explicit with New Arch + expo-updates
```
```
# ios/Podfileuse_frameworks! :linkage => :staticENV['HERMES_ENABLED'] = '1'  # ⚠️ CRITICAL: Must be explicit with New Arch + expo-updates
```
```
# Check current versionnpx react-native --version# Upgrade to 0.81 first (last version with interop layer)npm install react-native@0.81npx expo install --fix
```
```
# Check current versionnpx react-native --version# Upgrade to 0.81 first (last version with interop layer)npm install react-native@0.81npx expo install --fix
```
```
# Android (gradle.properties)newArchEnabled=true# iOSRCT_NEW_ARCH_ENABLED=1 bundle exec pod install# Rebuildnpm run iosnpm run android
```
```
# Android (gradle.properties)newArchEnabled=true# iOSRCT_NEW_ARCH_ENABLED=1 bundle exec pod install# Rebuildnpm run iosnpm run android
```
```
# Replace Redux with Redux Toolkitnpm uninstall redux redux-thunknpm install @reduxjs/toolkit react-redux# Replace i18n-js with react-i18nextnpm uninstall i18n-jsnpm install react-i18next i18next# Update React Navigation (if old version)npm install @react-navigation/native@latest
```
```
# Replace Redux with Redux Toolkitnpm uninstall redux redux-thunknpm install @reduxjs/toolkit react-redux# Replace i18n-js with react-i18nextnpm uninstall i18n-jsnpm install react-i18next i18next# Update React Navigation (if old version)npm install @react-navigation/native@latest
```
```
# Run on both platformsnpm run iosnpm run android# Test all features:# - Navigation# - State management (Redux)# - API calls# - Deep linking# - Push notifications
```
```
# Run on both platformsnpm run iosnpm run android# Test all features:# - Navigation# - State management (Redux)# - API calls# - Deep linking# - Push notifications
```
```
# Run React 19 codemodnpx @codemod/react-19 upgrade# Manually verify:# - Remove all propTypes declarations# - Remove forwardRef wrappers# - Update to new hooks (useActionState, useOptimistic)
```
```
# Run React 19 codemodnpx @codemod/react-19 upgrade# Manually verify:# - Remove all propTypes declarations# - Remove forwardRef wrappers# - Update to new hooks (useActionState, useOptimistic)
```
```
# Only after testing with New Architecture enabled!npm install react-native@0.82npx expo install --fix# Rebuildnpm run iosnpm run android
```
```
# Only after testing with New Architecture enabled!npm install react-native@0.82npx expo install --fix# Rebuildnpm run iosnpm run android
```
```
# Follow upgrade helper# https://react-native-community.github.io/upgrade-helper/# Select: 0.76 → 0.77# CRITICAL: Add this line to AppDelegate.swiftRCTAppDependencyProvider.sharedInstance()
```
```
# Follow upgrade helper# https://react-native-community.github.io/upgrade-helper/# Select: 0.76 → 0.77# CRITICAL: Add this line to AppDelegate.swiftRCTAppDependencyProvider.sharedInstance()
```
```
import { useActionState } from 'react';function LoginForm() {  const [state, loginAction, isPending] = useActionState(    async (prevState, formData) => {      try {        const user = await api.login(formData);        return { success: true, user };      } catch (error) {        return { success: false, error: error.message };      }    },    { success: false }  );  return (    <View>      <form action={loginAction}>        <TextInput name="email" placeholder="Email" />        <TextInput name="password" secureTextEntry />        <Button disabled={isPending}>          {isPending ? 'Logging in...' : 'Login'}        </Button>      </form>      {!state.success && state.error && (        <Text style={{ color: 'red' }}>{state.error}</Text>      )}    </View>  );}
```
```
import { useActionState } from 'react';function LoginForm() {  const [state, loginAction, isPending] = useActionState(    async (prevState, formData) => {      try {        const user = await api.login(formData);        return { success: true, user };      } catch (error) {        return { success: false, error: error.message };      }    },    { success: false }  );  return (    <View>      <form action={loginAction}>        <TextInput name="email" placeholder="Email" />        <TextInput name="password" secureTextEntry />        <Button disabled={isPending}>          {isPending ? 'Logging in...' : 'Login'}        </Button>      </form>      {!state.success && state.error && (        <Text style={{ color: 'red' }}>{state.error}</Text>      )}    </View>  );}
```
```
// Define prop types with TypeScripttype ButtonProps = {  title: string;  onPress: () => void;  disabled?: boolean;  variant?: 'primary' | 'secondary';};function Button({ title, onPress, disabled = false, variant = 'primary' }: ButtonProps) {  return (    <Pressable      onPress={onPress}      disabled={disabled}      style={[styles.button, styles[variant]]}    >      <Text style={styles.text}>{title}</Text>    </Pressable>  );}
```
```
// Define prop types with TypeScripttype ButtonProps = {  title: string;  onPress: () => void;  disabled?: boolean;  variant?: 'primary' | 'secondary';};function Button({ title, onPress, disabled = false, variant = 'primary' }: ButtonProps) {  return (    <Pressable      onPress={onPress}      disabled={disabled}      style={[styles.button, styles[variant]]}    >      <Text style={styles.text}>{title}</Text>    </Pressable>  );}
```
```
// Glowing button with outline and blend modefunction GlowButton({ title, onPress }) {  return (    <Pressable      onPress={onPress}      style={{        backgroundColor: '#3b82f6',        padding: 16,        borderRadius: 8,        // Outline doesn't affect layout        outlineWidth: 2,        outlineColor: '#60a5fa',        outlineOffset: 4,        // Blend with background        mixBlendMode: 'screen',        isolation: 'isolate'      }}    >      <Text style={{ color: 'white', fontWeight: 'bold' }}>        {title}      </Text>    </Pressable>  );}
```
```
// Glowing button with outline and blend modefunction GlowButton({ title, onPress }) {  return (    <Pressable      onPress={onPress}      style={{        backgroundColor: '#3b82f6',        padding: 16,        borderRadius: 8,        // Outline doesn't affect layout        outlineWidth: 2,        outlineColor: '#60a5fa',        outlineOffset: 4,        // Blend with background        mixBlendMode: 'screen',        isolation: 'isolate'      }}    >      <Text style={{ color: 'white', fontWeight: 'bold' }}>        {title}      </Text>    </Pressable>  );}
```
```
./scripts/check-rn-version.sh# Output: ✅ React Native 0.82 - New Architecture mandatory# Output: ⚠️ React Native 0.75 - Upgrade to 0.76+ recommended
```
```
./scripts/check-rn-version.sh# Output: ✅ React Native 0.82 - New Architecture mandatory# Output: ⚠️ React Native 0.75 - Upgrade to 0.76+ recommended
```
```
// This no longer works in Expo Go (SDK 52+):{  "jsEngine": "jsc"  // ❌ Ignored, Hermes only}
```
```
// This no longer works in Expo Go (SDK 52+):{  "jsEngine": "jsc"  // ❌ Ignored, Hermes only}
```
```
# Must use custom dev client for Google Mapsnpx expo install expo-dev-clientnpx expo run:android
```
```
# Must use custom dev client for Google Mapsnpx expo install expo-dev-clientnpx expo run:android
```
```
import { fetch } from 'expo/fetch';// Standards-compliant fetch for Workers/Edge runtimesconst response = await fetch('https://api.example.com/data');
```
```
import { fetch } from 'expo/fetch';// Standards-compliant fetch for Workers/Edge runtimesconst response = await fetch('https://api.example.com/data');
```
```
npm install @react-navigation/native@^7.0.0
```
```
npm install @react-navigation/native@^7.0.0
```
```
{  "dependencies": {    "react": "^19.2.3",    "react-native": "^0.81.5",    "expo": "~54.0.31",    "@react-navigation/native": "^7.0.0",    "@reduxjs/toolkit": "^2.0.0",    "react-i18next": "^15.0.0"  },  "devDependencies": {    "@types/react": "^19.0.0",    "typescript": "^5.7.0"  }}
```
```
{  "dependencies": {    "react": "^19.2.3",    "react-native": "^0.81.5",    "expo": "~54.0.31",    "@react-navigation/native": "^7.0.0",    "@reduxjs/toolkit": "^2.0.0",    "react-i18next": "^15.0.0"  },  "devDependencies": {    "@types/react": "^19.0.0",    "typescript": "^5.7.0"  }}
```
```
npx @codemod/react-19 upgrade
```
```
npx expo start --client-logs
```
```
RCTAppDependencyProvider.sharedInstance()
```
```
redux
```
```
redux-thunk
```
```
@reduxjs/toolkit
```
```
react-native/Libraries/*
```
```
references/new-architecture-errors.md
```
```
references/react-19-migration.md
```
This specialized AI agent skill empowers developers working with React Native Expo, particularly focusing on versions 0.76 and higher and SDK 52+. It provides critical insights and guidance for leveraging the New Architecture, which is becoming increasingly central to React Native development, especially mandatory in 0.82+. Whether you're starting a new project or migrating an existing one, this skill helps streamline complex setup procedures, ensure proper dependency management, and navigate the evolving landscape of mobile app development with Expo, making your coding journey smoother and more efficient.

# When to Use This Skill
- •Setting up a new React Native Expo project from scratch, ensuring correct configurations for SDK 52+.
- •Migrating an existing React Native app to a newer Expo SDK version, especially when transitioning to the New Architecture.
- •Debugging build issues related to React Native versions, Expo SDK, or New Architecture setup and enabling.
- •Understanding and implementing best practices for dependency management and project updates in an Expo environment.

# Pro Tips
- 💡Always verify `newArchEnabled` in your Expo config, especially when dealing with RN 0.82+, as the New Architecture is strictly enforced and cannot be disabled.
- 💡Embrace Hermes as your sole JavaScript engine for Expo Go and bare workflow projects, as JSC is no longer supported with modern SDKs (52+).
- 💡For migrations from RN 0.75 or earlier, leverage the 0.76-0.81 interop layer to smoothly transition to the New Architecture, avoiding direct upgrades to 0.82+ which lacks the interop layer.

