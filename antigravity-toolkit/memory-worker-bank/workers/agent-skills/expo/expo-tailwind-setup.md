# expo-tailwind-setup
Source: https://antigravity.codes/agent-skills/expo/expo-tailwind-setup

## AI Worker Instructions
When the user requests functionality related to expo-tailwind-setup, follow these guidelines and utilize this context.

## Scraped Content

# expo-tailwind-setup
```
# Install dependenciesnpx expo install tailwindcss@^4 nativewind@5.0.0-preview.2 react-native-css@0.0.0-nightly.5ce6396 @tailwindcss/postcss tailwind-merge clsx
```
```
# Install dependenciesnpx expo install tailwindcss@^4 nativewind@5.0.0-preview.2 react-native-css@0.0.0-nightly.5ce6396 @tailwindcss/postcss tailwind-merge clsx
```
```
// package.json{  "resolutions": {    "lightningcss": "1.30.1"  }}
```
```
// package.json{  "resolutions": {    "lightningcss": "1.30.1"  }}
```
```
metro.config.js
```
```
// metro.config.jsconst { getDefaultConfig } = require("expo/metro-config");const { withNativewind } = require("nativewind/metro");/** @type {import('expo/metro-config').MetroConfig} */const config = getDefaultConfig(__dirname);module.exports = withNativewind(config, {  // inline variables break PlatformColor in CSS variables  inlineVariables: false,  // We add className support manually  globalClassNamePolyfill: false,});
```
```
// metro.config.jsconst { getDefaultConfig } = require("expo/metro-config");const { withNativewind } = require("nativewind/metro");/** @type {import('expo/metro-config').MetroConfig} */const config = getDefaultConfig(__dirname);module.exports = withNativewind(config, {  // inline variables break PlatformColor in CSS variables  inlineVariables: false,  // We add className support manually  globalClassNamePolyfill: false,});
```
```
postcss.config.mjs
```
```
// postcss.config.mjsexport default {  plugins: {    "@tailwindcss/postcss": {},  },};
```
```
// postcss.config.mjsexport default {  plugins: {    "@tailwindcss/postcss": {},  },};
```
```
src/global.css
```
```
@import "tailwindcss/theme.css" layer(theme);@import "tailwindcss/preflight.css" layer(base);@import "tailwindcss/utilities.css";/* Platform-specific font families */@media android {  :root {    --font-mono: monospace;    --font-rounded: normal;    --font-serif: serif;    --font-sans: normal;  }}@media ios {  :root {    --font-mono: ui-monospace;    --font-serif: ui-serif;    --font-sans: system-ui;    --font-rounded: ui-rounded;  }}
```
```
@import "tailwindcss/theme.css" layer(theme);@import "tailwindcss/preflight.css" layer(base);@import "tailwindcss/utilities.css";/* Platform-specific font families */@media android {  :root {    --font-mono: monospace;    --font-rounded: normal;    --font-serif: serif;    --font-sans: normal;  }}@media ios {  :root {    --font-mono: ui-monospace;    --font-serif: ui-serif;    --font-sans: system-ui;    --font-rounded: ui-rounded;  }}
```
```
// DELETE babel.config.js if it only contains NativeWind config// The following is NO LONGER needed:// module.exports = function (api) {//   api.cache(true);//   return {//     presets: [//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],//       "nativewind/babel",//     ],//   };// };
```
```
// DELETE babel.config.js if it only contains NativeWind config// The following is NO LONGER needed:// module.exports = function (api) {//   api.cache(true);//   return {//     presets: [//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],//       "nativewind/babel",//     ],//   };// };
```
```
src/tw/index.tsx
```
```
import {  useCssElement,  useNativeVariable as useFunctionalVariable,} from "react-native-css";import { Link as RouterLink } from "expo-router";import Animated from "react-native-reanimated";import React from "react";import {  View as RNView,  Text as RNText,  Pressable as RNPressable,  ScrollView as RNScrollView,  TouchableHighlight as RNTouchableHighlight,  TextInput as RNTextInput,  StyleSheet,} from "react-native";// CSS-enabled Linkexport const Link = (  props: React.ComponentProps<typeof RouterLink> & { className?: string }) => {  return useCssElement(RouterLink, props, { className: "style" });};Link.Trigger = RouterLink.Trigger;Link.Menu = RouterLink.Menu;Link.MenuAction = RouterLink.MenuAction;Link.Preview = RouterLink.Preview;// CSS Variable hookexport const useCSSVariable =  process.env.EXPO_OS !== "web"    ? useFunctionalVariable    : (variable: string) => var(${variable});// Viewexport type ViewProps = React.ComponentProps<typeof RNView> & {  className?: string;};export const View = (props: ViewProps) => {  return useCssElement(RNView, props, { className: "style" });};View.displayName = "CSS(View)";// Textexport const Text = (  props: React.ComponentProps<typeof RNText> & { className?: string }) => {  return useCssElement(RNText, props, { className: "style" });};Text.displayName = "CSS(Text)";// ScrollViewexport const ScrollView = (  props: React.ComponentProps<typeof RNScrollView> & {    className?: string;    contentContainerClassName?: string;  }) => {  return useCssElement(RNScrollView, props, {    className: "style",    contentContainerClassName: "contentContainerStyle",  });};ScrollView.displayName = "CSS(ScrollView)";// Pressableexport const Pressable = (  props: React.ComponentProps<typeof RNPressable> & { className?: string }) => {  return useCssElement(RNPressable, props, { className: "style" });};Pressable.displayName = "CSS(Pressable)";// TextInputexport const TextInput = (  props: React.ComponentProps<typeof RNTextInput> & { className?: string }) => {  return useCssElement(RNTextInput, props, { className: "style" });};TextInput.displayName = "CSS(TextInput)";// AnimatedScrollViewexport const AnimatedScrollView = (  props: React.ComponentProps<typeof Animated.ScrollView> & {    className?: string;    contentClassName?: string;    contentContainerClassName?: string;  }) => {  return useCssElement(Animated.ScrollView, props, {    className: "style",    contentClassName: "contentContainerStyle",    contentContainerClassName: "contentContainerStyle",  });};// TouchableHighlight with underlayColor extractionfunction XXTouchableHighlight(  props: React.ComponentProps<typeof RNTouchableHighlight>) {  const { underlayColor, ...style } = StyleSheet.flatten(props.style) || {};  return (    <RNTouchableHighlight      underlayColor={underlayColor}      {...props}      style={style}    />  );}export const TouchableHighlight = (  props: React.ComponentProps<typeof RNTouchableHighlight>) => {  return useCssElement(XXTouchableHighlight, props, { className: "style" });};TouchableHighlight.displayName = "CSS(TouchableHighlight)";
```
```
import {  useCssElement,  useNativeVariable as useFunctionalVariable,} from "react-native-css";import { Link as RouterLink } from "expo-router";import Animated from "react-native-reanimated";import React from "react";import {  View as RNView,  Text as RNText,  Pressable as RNPressable,  ScrollView as RNScrollView,  TouchableHighlight as RNTouchableHighlight,  TextInput as RNTextInput,  StyleSheet,} from "react-native";// CSS-enabled Linkexport const Link = (  props: React.ComponentProps<typeof RouterLink> & { className?: string }) => {  return useCssElement(RouterLink, props, { className: "style" });};Link.Trigger = RouterLink.Trigger;Link.Menu = RouterLink.Menu;Link.MenuAction = RouterLink.MenuAction;Link.Preview = RouterLink.Preview;// CSS Variable hookexport const useCSSVariable =  process.env.EXPO_OS !== "web"    ? useFunctionalVariable    : (variable: string) => var(${variable});// Viewexport type ViewProps = React.ComponentProps<typeof RNView> & {  className?: string;};export const View = (props: ViewProps) => {  return useCssElement(RNView, props, { className: "style" });};View.displayName = "CSS(View)";// Textexport const Text = (  props: React.ComponentProps<typeof RNText> & { className?: string }) => {  return useCssElement(RNText, props, { className: "style" });};Text.displayName = "CSS(Text)";// ScrollViewexport const ScrollView = (  props: React.ComponentProps<typeof RNScrollView> & {    className?: string;    contentContainerClassName?: string;  }) => {  return useCssElement(RNScrollView, props, {    className: "style",    contentContainerClassName: "contentContainerStyle",  });};ScrollView.displayName = "CSS(ScrollView)";// Pressableexport const Pressable = (  props: React.ComponentProps<typeof RNPressable> & { className?: string }) => {  return useCssElement(RNPressable, props, { className: "style" });};Pressable.displayName = "CSS(Pressable)";// TextInputexport const TextInput = (  props: React.ComponentProps<typeof RNTextInput> & { className?: string }) => {  return useCssElement(RNTextInput, props, { className: "style" });};TextInput.displayName = "CSS(TextInput)";// AnimatedScrollViewexport const AnimatedScrollView = (  props: React.ComponentProps<typeof Animated.ScrollView> & {    className?: string;    contentClassName?: string;    contentContainerClassName?: string;  }) => {  return useCssElement(Animated.ScrollView, props, {    className: "style",    contentClassName: "contentContainerStyle",    contentContainerClassName: "contentContainerStyle",  });};// TouchableHighlight with underlayColor extractionfunction XXTouchableHighlight(  props: React.ComponentProps<typeof RNTouchableHighlight>) {  const { underlayColor, ...style } = StyleSheet.flatten(props.style) || {};  return (    <RNTouchableHighlight      underlayColor={underlayColor}      {...props}      style={style}    />  );}export const TouchableHighlight = (  props: React.ComponentProps<typeof RNTouchableHighlight>) => {  return useCssElement(XXTouchableHighlight, props, { className: "style" });};TouchableHighlight.displayName = "CSS(TouchableHighlight)";
```
```
var(${variable})
```
```
src/tw/image.tsx
```
```
import { useCssElement } from "react-native-css";import React from "react";import { StyleSheet } from "react-native";import Animated from "react-native-reanimated";import { Image as RNImage } from "expo-image";const AnimatedExpoImage = Animated.createAnimatedComponent(RNImage);export type ImageProps = React.ComponentProps<typeof Image>;function CSSImage(props: React.ComponentProps<typeof AnimatedExpoImage>) {  // @ts-expect-error: Remap objectFit style to contentFit property  const { objectFit, objectPosition, ...style } =    StyleSheet.flatten(props.style) || {};  return (    <AnimatedExpoImage      contentFit={objectFit}      contentPosition={objectPosition}      {...props}      source={        typeof props.source === "string" ? { uri: props.source } : props.source      }      // @ts-expect-error: Style is remapped above      style={style}    />  );}export const Image = (  props: React.ComponentProps<typeof CSSImage> & { className?: string }) => {  return useCssElement(CSSImage, props, { className: "style" });};Image.displayName = "CSS(Image)";
```
```
import { useCssElement } from "react-native-css";import React from "react";import { StyleSheet } from "react-native";import Animated from "react-native-reanimated";import { Image as RNImage } from "expo-image";const AnimatedExpoImage = Animated.createAnimatedComponent(RNImage);export type ImageProps = React.ComponentProps<typeof Image>;function CSSImage(props: React.ComponentProps<typeof AnimatedExpoImage>) {  // @ts-expect-error: Remap objectFit style to contentFit property  const { objectFit, objectPosition, ...style } =    StyleSheet.flatten(props.style) || {};  return (    <AnimatedExpoImage      contentFit={objectFit}      contentPosition={objectPosition}      {...props}      source={        typeof props.source === "string" ? { uri: props.source } : props.source      }      // @ts-expect-error: Style is remapped above      style={style}    />  );}export const Image = (  props: React.ComponentProps<typeof CSSImage> & { className?: string }) => {  return useCssElement(CSSImage, props, { className: "style" });};Image.displayName = "CSS(Image)";
```
```
src/tw/animated.tsx
```
```
import * as TW from "./index";import RNAnimated from "react-native-reanimated";export const Animated = {  ...RNAnimated,  View: RNAnimated.createAnimatedComponent(TW.View),};
```
```
import * as TW from "./index";import RNAnimated from "react-native-reanimated";export const Animated = {  ...RNAnimated,  View: RNAnimated.createAnimatedComponent(TW.View),};
```
```
import { View, Text, ScrollView, Image } from "@/tw";export default function MyScreen() {  return (    <ScrollView className="flex-1 bg-white">      <View className="p-4 gap-4">        <Text className="text-xl font-bold text-gray-900">Hello Tailwind!</Text>        <Image          className="w-full h-48 rounded-lg object-cover"          source={{ uri: "https://example.com/image.jpg" }}        />      </View>    </ScrollView>  );}
```
```
import { View, Text, ScrollView, Image } from "@/tw";export default function MyScreen() {  return (    <ScrollView className="flex-1 bg-white">      <View className="p-4 gap-4">        <Text className="text-xl font-bold text-gray-900">Hello Tailwind!</Text>        <Image          className="w-full h-48 rounded-lg object-cover"          source={{ uri: "https://example.com/image.jpg" }}        />      </View>    </ScrollView>  );}
```
```
@theme
```
```
@layer theme {  @theme {    /* Custom fonts */    --font-rounded: "SF Pro Rounded", sans-serif;    /* Custom line heights */    --text-xs--line-height: calc(1em / 0.75);    --text-sm--line-height: calc(1.25em / 0.875);    --text-base--line-height: calc(1.5em / 1);    /* Custom leading scales */    --leading-tight: 1.25em;    --leading-snug: 1.375em;    --leading-normal: 1.5em;  }}
```
```
@layer theme {  @theme {    /* Custom fonts */    --font-rounded: "SF Pro Rounded", sans-serif;    /* Custom line heights */    --text-xs--line-height: calc(1em / 0.75);    --text-sm--line-height: calc(1.25em / 0.875);    --text-base--line-height: calc(1.5em / 1);    /* Custom leading scales */    --leading-tight: 1.25em;    --leading-snug: 1.375em;    --leading-normal: 1.5em;  }}
```
```
@media ios {  :root {    --font-sans: system-ui;    --font-rounded: ui-rounded;  }}@media android {  :root {    --font-sans: normal;    --font-rounded: normal;  }}
```
```
@media ios {  :root {    --font-sans: system-ui;    --font-rounded: ui-rounded;  }}@media android {  :root {    --font-sans: normal;    --font-rounded: normal;  }}
```
```
/* src/css/sf.css */@layer base {  html {    color-scheme: light;  }}:root {  /* Accent colors with light/dark mode */  --sf-blue: light-dark(rgb(0 122 255), rgb(10 132 255));  --sf-green: light-dark(rgb(52 199 89), rgb(48 209 89));  --sf-red: light-dark(rgb(255 59 48), rgb(255 69 58));  /* Gray scales */  --sf-gray: light-dark(rgb(142 142 147), rgb(142 142 147));  --sf-gray-2: light-dark(rgb(174 174 178), rgb(99 99 102));  /* Text colors */  --sf-text: light-dark(rgb(0 0 0), rgb(255 255 255));  --sf-text-2: light-dark(rgb(60 60 67 / 0.6), rgb(235 235 245 / 0.6));  /* Background colors */  --sf-bg: light-dark(rgb(255 255 255), rgb(0 0 0));  --sf-bg-2: light-dark(rgb(242 242 247), rgb(28 28 30));}/* iOS native colors via platformColor */@media ios {  :root {    --sf-blue: platformColor(systemBlue);    --sf-green: platformColor(systemGreen);    --sf-red: platformColor(systemRed);    --sf-gray: platformColor(systemGray);    --sf-text: platformColor(label);    --sf-text-2: platformColor(secondaryLabel);    --sf-bg: platformColor(systemBackground);    --sf-bg-2: platformColor(secondarySystemBackground);  }}/* Register as Tailwind theme colors */@layer theme {  @theme {    --color-sf-blue: var(--sf-blue);    --color-sf-green: var(--sf-green);    --color-sf-red: var(--sf-red);    --color-sf-gray: var(--sf-gray);    --color-sf-text: var(--sf-text);    --color-sf-text-2: var(--sf-text-2);    --color-sf-bg: var(--sf-bg);    --color-sf-bg-2: var(--sf-bg-2);  }}
```
```
/* src/css/sf.css */@layer base {  html {    color-scheme: light;  }}:root {  /* Accent colors with light/dark mode */  --sf-blue: light-dark(rgb(0 122 255), rgb(10 132 255));  --sf-green: light-dark(rgb(52 199 89), rgb(48 209 89));  --sf-red: light-dark(rgb(255 59 48), rgb(255 69 58));  /* Gray scales */  --sf-gray: light-dark(rgb(142 142 147), rgb(142 142 147));  --sf-gray-2: light-dark(rgb(174 174 178), rgb(99 99 102));  /* Text colors */  --sf-text: light-dark(rgb(0 0 0), rgb(255 255 255));  --sf-text-2: light-dark(rgb(60 60 67 / 0.6), rgb(235 235 245 / 0.6));  /* Background colors */  --sf-bg: light-dark(rgb(255 255 255), rgb(0 0 0));  --sf-bg-2: light-dark(rgb(242 242 247), rgb(28 28 30));}/* iOS native colors via platformColor */@media ios {  :root {    --sf-blue: platformColor(systemBlue);    --sf-green: platformColor(systemGreen);    --sf-red: platformColor(systemRed);    --sf-gray: platformColor(systemGray);    --sf-text: platformColor(label);    --sf-text-2: platformColor(secondaryLabel);    --sf-bg: platformColor(systemBackground);    --sf-bg-2: platformColor(secondarySystemBackground);  }}/* Register as Tailwind theme colors */@layer theme {  @theme {    --color-sf-blue: var(--sf-blue);    --color-sf-green: var(--sf-green);    --color-sf-red: var(--sf-red);    --color-sf-gray: var(--sf-gray);    --color-sf-text: var(--sf-text);    --color-sf-text-2: var(--sf-text-2);    --color-sf-bg: var(--sf-bg);    --color-sf-bg-2: var(--sf-bg-2);  }}
```
```
<Text className="text-sf-text">Primary text</Text><Text className="text-sf-text-2">Secondary text</Text><View className="bg-sf-bg">...</View>
```
```
<Text className="text-sf-text">Primary text</Text><Text className="text-sf-text-2">Secondary text</Text><View className="bg-sf-bg">...</View>
```
```
useCSSVariable
```
```
import { useCSSVariable } from "@/tw";function MyComponent() {  const blue = useCSSVariable("--sf-blue");  return <View style={{ borderColor: blue }} />;}
```
```
import { useCSSVariable } from "@/tw";function MyComponent() {  const blue = useCSSVariable("--sf-blue");  return <View style={{ borderColor: blue }} />;}
```
```
@tailwindcss/postcss
```
```
tailwindcss
```
```
@import "tailwindcss/..."
```
```
@tailwind
```
```
@theme
```
```
tailwind.config.js
```
```
useCssElement
```
```
withNativewind
```
```
inlineVariables: false
```
```
useCssElement
```
```
withNativewind
```
```
platformColor()
```
```
@media ios
```
```
light-dark()
```
```
type Props = React.ComponentProps<typeof RNView> & { className?: string };
```
```
type Props = React.ComponentProps<typeof RNView> & { className?: string };
```
For developers navigating the complexities of cross-platform UI, this agent skill provides an indispensable guide to integrating modern styling techniques. It demystifies the setup of Tailwind CSS v4 within Expo projects, leveraging `react-native-css` and `NativeWind v5` to deliver a cohesive and efficient styling workflow. Embrace the power of utility-first CSS for universal applications, ensuring consistent designs across iOS, Android, and Web with minimal configuration overhead. This skill empowers you to build beautiful, responsive interfaces faster, making advanced styling accessible and straightforward for any project.

# When to Use This Skill
- •Starting a new Expo project that requires a robust, utility-first styling solution for cross-platform UI.
- •Migrating an existing React Native (Expo) project to use Tailwind CSS for improved developer experience and maintainability.
- •Building sophisticated cross-platform applications where consistent UI/UX across web and native environments is critical.
- •Developing reusable component libraries that need to be styled universally using modern CSS methodologies.

# Pro Tips
- 💡Leverage `tailwind-merge` and `clsx` for dynamic class concatenation, preventing style conflicts and improving readability in components with conditional styling.
- 💡Explore NativeWind's theming capabilities to define consistent design tokens (colors, spacing, fonts) that seamlessly integrate with Tailwind's utility classes and custom variants.
- 💡Familiarize yourself with `react-native-css`'s runtime features and debugging tools for advanced styling scenarios or when incorporating custom CSS properties not directly covered by Tailwind utilities.

