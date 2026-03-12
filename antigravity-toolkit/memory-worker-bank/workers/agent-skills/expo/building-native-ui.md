# building-native-ui
Source: https://antigravity.codes/agent-skills/expo/building-native-ui

## AI Worker Instructions
When the user requests functionality related to building-native-ui, follow these guidelines and utilize this context.

## Scraped Content

# building-native-ui
```
npx expo run:ios
```
```
npx expo run:android
```
```
npx expo start
```
```
npx expo run:ios/android
```
```
eas build
```
```
modules/
```
```
@bacons/apple-targets
```
```
app.json
```
```
expo-*
```
```
comment-card.tsx
```
```
./references/route-structure.md
```
```
app
```
```
expo-audio
```
```
expo-av
```
```
expo-video
```
```
expo-av
```
```
expo-symbols
```
```
@expo/vector-icons
```
```
react-native-safe-area-context
```
```
process.env.EXPO_OS
```
```
Platform.OS
```
```
React.use
```
```
React.useContext
```
```
expo-image
```
```
img
```
```
expo-glass-effect
```
```
<ScrollView contentInsetAdjustmentBehavior="automatic" />
```
```
<SafeAreaView>
```
```
contentInsetAdjustmentBehavior="automatic"
```
```
useWindowDimensions
```
```
Dimensions.get()
```
```
<Switch />
```
```
@react-native-community/datetimepicker
```
```
contentInsetAdjustmentBehavior="automatic"
```
```
headerSearchBarOptions
```
```
<Text selectable />
```
```
contentInsetAdjustmentBehavior="automatic"
```
```
{ borderCurve: 'continuous' }
```
```
contentContainerStyle
```
```
selectable
```
```
<Text/>
```
```
{ fontVariant: 'tabular-nums' }
```
```
boxShadow
```
```
<View style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }} />
```
```
<View style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }} />
```
```
<Link href="/path" />
```
```
import { Link } from 'expo-router';// Basic link<Link href="/path" />// Wrapping custom components<Link href="/path" asChild>  <Pressable>...</Pressable></Link>
```
```
import { Link } from 'expo-router';// Basic link<Link href="/path" />// Wrapping custom components<Link href="/path" asChild>  <Pressable>...</Pressable></Link>
```
```
<Link.Preview>
```
```
_layout.tsx
```
```
<Stack.Screen options={{ title: "Home" }} />
```
```
<Stack.Screen options={{ title: "Home" }} />
```
```
import { Link } from "expo-router";<Link href="/settings" asChild>  <Link.Trigger>    <Pressable>      <Card />    </Pressable>  </Link.Trigger>  <Link.Menu>    <Link.MenuAction      title="Share"      icon="square.and.arrow.up"      onPress={handleSharePress}    />    <Link.MenuAction      title="Block"      icon="nosign"      destructive      onPress={handleBlockPress}    />    <Link.Menu title="More" icon="ellipsis">      <Link.MenuAction title="Copy" icon="doc.on.doc" onPress={() => {}} />      <Link.MenuAction        title="Delete"        icon="trash"        destructive        onPress={() => {}}      />    </Link.Menu>  </Link.Menu></Link>;
```
```
import { Link } from "expo-router";<Link href="/settings" asChild>  <Link.Trigger>    <Pressable>      <Card />    </Pressable>  </Link.Trigger>  <Link.Menu>    <Link.MenuAction      title="Share"      icon="square.and.arrow.up"      onPress={handleSharePress}    />    <Link.MenuAction      title="Block"      icon="nosign"      destructive      onPress={handleBlockPress}    />    <Link.Menu title="More" icon="ellipsis">      <Link.MenuAction title="Copy" icon="doc.on.doc" onPress={() => {}} />      <Link.MenuAction        title="Delete"        icon="trash"        destructive        onPress={() => {}}      />    </Link.Menu>  </Link.Menu></Link>;
```
```
<Link href="/settings">  <Link.Trigger>    <Pressable>      <Card />    </Pressable>  </Link.Trigger>  <Link.Preview /></Link>
```
```
<Link href="/settings">  <Link.Trigger>    <Pressable>      <Card />    </Pressable>  </Link.Trigger>  <Link.Preview /></Link>
```
```
<Stack.Screen name="modal" options={{ presentation: "modal" }} />
```
```
<Stack.Screen name="modal" options={{ presentation: "modal" }} />
```
```
<Stack.Screen  name="sheet"  options={{    presentation: "formSheet",    sheetGrabberVisible: true,    sheetAllowedDetents: [0.5, 1.0],    contentStyle: { backgroundColor: "transparent" },  }}/>
```
```
<Stack.Screen  name="sheet"  options={{    presentation: "formSheet",    sheetGrabberVisible: true,    sheetAllowedDetents: [0.5, 1.0],    contentStyle: { backgroundColor: "transparent" },  }}/>
```
```
contentStyle: { backgroundColor: "transparent" }
```
```
app/  _layout.tsx — <NativeTabs />  (index,search)/    _layout.tsx — <Stack />    index.tsx — Main list    search.tsx — Search view
```
```
app/  _layout.tsx — <NativeTabs />  (index,search)/    _layout.tsx — <Stack />    index.tsx — Main list    search.tsx — Search view
```
```
// app/_layout.tsximport { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";import { Theme } from "../components/theme";export default function Layout() {  return (    <Theme>      <NativeTabs>        <NativeTabs.Trigger name="(index)">          <Icon sf="list.dash" />          <Label>Items</Label>        </NativeTabs.Trigger>        <NativeTabs.Trigger name="(search)" role="search" />      </NativeTabs>    </Theme>  );}
```
```
// app/_layout.tsximport { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";import { Theme } from "../components/theme";export default function Layout() {  return (    <Theme>      <NativeTabs>        <NativeTabs.Trigger name="(index)">          <Icon sf="list.dash" />          <Label>Items</Label>        </NativeTabs.Trigger>        <NativeTabs.Trigger name="(search)" role="search" />      </NativeTabs>    </Theme>  );}
```
```
// app/(index,search)/_layout.tsximport { Stack } from "expo-router/stack";import { PlatformColor } from "react-native";export default function Layout({ segment }) {  const screen = segment.match(/\((.*)\)/)?.[1]!;  const titles: Record<string, string> = { index: "Items", search: "Search" };  return (    <Stack      screenOptions={{        headerTransparent: true,        headerShadowVisible: false,        headerLargeTitleShadowVisible: false,        headerLargeStyle: { backgroundColor: "transparent" },        headerTitleStyle: { color: PlatformColor("label") },        headerLargeTitle: true,        headerBlurEffect: "none",        headerBackButtonDisplayMode: "minimal",      }}    >      <Stack.Screen name={screen} options={{ title: titles[screen] }} />      <Stack.Screen name="i/[id]" options={{ headerLargeTitle: false }} />    </Stack>  );}
```
```
// app/(index,search)/_layout.tsximport { Stack } from "expo-router/stack";import { PlatformColor } from "react-native";export default function Layout({ segment }) {  const screen = segment.match(/\((.*)\)/)?.[1]!;  const titles: Record<string, string> = { index: "Items", search: "Search" };  return (    <Stack      screenOptions={{        headerTransparent: true,        headerShadowVisible: false,        headerLargeTitleShadowVisible: false,        headerLargeStyle: { backgroundColor: "transparent" },        headerTitleStyle: { color: PlatformColor("label") },        headerLargeTitle: true,        headerBlurEffect: "none",        headerBackButtonDisplayMode: "minimal",      }}    >      <Stack.Screen name={screen} options={{ title: titles[screen] }} />      <Stack.Screen name="i/[id]" options={{ headerLargeTitle: false }} />    </Stack>  );}
```
This skill empowers developers to craft stunning, performant native user interfaces using Expo Router, leveraging the full potential of React Native. Dive deep into creating pixel-perfect designs, implementing smooth navigation flows, and integrating rich multimedia experiences. From foundational UI concepts to advanced animation techniques and efficient data handling, this guide provides a structured approach. It emphasizes best practices for optimizing app performance and user engagement, ensuring your applications stand out with a truly native feel across platforms. Explore powerful tools like Expo-blur, Reanimated, and native controls to elevate your mobile development projects.

# When to Use This Skill
- •Developing a new cross-platform mobile application from scratch with native UI elements.
- •Migrating an existing Expo project to leverage Expo Router for advanced navigation and native features.
- •Implementing complex UI animations, search functionalities, or visual effects within an Expo app.
- •Optimizing an Expo application's UI for better performance and a more native user experience.

# Pro Tips
- 💡Always prioritize native modules (like NativeTabs, `expo-symbols`) over JavaScript alternatives for better performance and a truly native feel.
- 💡Master `react-native-reanimated` early for creating fluid, gesture-driven animations that enhance user engagement without sacrificing performance.
- 💡Leverage Expo Router's dynamic routes and groups effectively to organize your application's navigation structure for scalability and maintainability.

