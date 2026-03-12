# react-native-design
Source: https://antigravity.codes/agent-skills/mobile/react-native-design

## AI Worker Instructions
When the user requests functionality related to react-native-design, follow these guidelines and utilize this context.

## Scraped Content

# react-native-design
```
import { StyleSheet, View, Text } from 'react-native';const styles = StyleSheet.create({  container: {    flex: 1,    padding: 16,    backgroundColor: '#ffffff',  },  title: {    fontSize: 24,    fontWeight: '600',    color: '#1a1a1a',    marginBottom: 8,  },  subtitle: {    fontSize: 16,    color: '#666666',    lineHeight: 24,  },});function Card() {  return (    <View style={styles.container}>      <Text style={styles.title}>Title</Text>      <Text style={styles.subtitle}>Subtitle text</Text>    </View>  );}
```
```
import { StyleSheet, View, Text } from 'react-native';const styles = StyleSheet.create({  container: {    flex: 1,    padding: 16,    backgroundColor: '#ffffff',  },  title: {    fontSize: 24,    fontWeight: '600',    color: '#1a1a1a',    marginBottom: 8,  },  subtitle: {    fontSize: 16,    color: '#666666',    lineHeight: 24,  },});function Card() {  return (    <View style={styles.container}>      <Text style={styles.title}>Title</Text>      <Text style={styles.subtitle}>Subtitle text</Text>    </View>  );}
```
```
interface CardProps {  variant: 'primary' | 'secondary';  disabled?: boolean;}function Card({ variant, disabled }: CardProps) {  return (    <View style={[      styles.card,      variant === 'primary' ? styles.primary : styles.secondary,      disabled && styles.disabled,    ]}>      <Text style={styles.text}>Content</Text>    </View>  );}const styles = StyleSheet.create({  card: {    padding: 16,    borderRadius: 12,  },  primary: {    backgroundColor: '#6366f1',  },  secondary: {    backgroundColor: '#f3f4f6',    borderWidth: 1,    borderColor: '#e5e7eb',  },  disabled: {    opacity: 0.5,  },  text: {    fontSize: 16,  },});
```
```
interface CardProps {  variant: 'primary' | 'secondary';  disabled?: boolean;}function Card({ variant, disabled }: CardProps) {  return (    <View style={[      styles.card,      variant === 'primary' ? styles.primary : styles.secondary,      disabled && styles.disabled,    ]}>      <Text style={styles.text}>Content</Text>    </View>  );}const styles = StyleSheet.create({  card: {    padding: 16,    borderRadius: 12,  },  primary: {    backgroundColor: '#6366f1',  },  secondary: {    backgroundColor: '#f3f4f6',    borderWidth: 1,    borderColor: '#e5e7eb',  },  disabled: {    opacity: 0.5,  },  text: {    fontSize: 16,  },});
```
```
const styles = StyleSheet.create({  // Vertical stack (column)  column: {    flexDirection: "column",    gap: 12,  },  // Horizontal stack (row)  row: {    flexDirection: "row",    alignItems: "center",    gap: 8,  },  // Space between items  spaceBetween: {    flexDirection: "row",    justifyContent: "space-between",    alignItems: "center",  },  // Centered content  centered: {    flex: 1,    justifyContent: "center",    alignItems: "center",  },  // Fill remaining space  fill: {    flex: 1,  },});
```
```
const styles = StyleSheet.create({  // Vertical stack (column)  column: {    flexDirection: "column",    gap: 12,  },  // Horizontal stack (row)  row: {    flexDirection: "row",    alignItems: "center",    gap: 8,  },  // Space between items  spaceBetween: {    flexDirection: "row",    justifyContent: "space-between",    alignItems: "center",  },  // Centered content  centered: {    flex: 1,    justifyContent: "center",    alignItems: "center",  },  // Fill remaining space  fill: {    flex: 1,  },});
```
```
import { NavigationContainer } from '@react-navigation/native';import { createNativeStackNavigator } from '@react-navigation/native-stack';type RootStackParamList = {  Home: undefined;  Detail: { itemId: string };  Settings: undefined;};const Stack = createNativeStackNavigator<RootStackParamList>();function AppNavigator() {  return (    <NavigationContainer>      <Stack.Navigator        initialRouteName="Home"        screenOptions={{          headerStyle: { backgroundColor: '#6366f1' },          headerTintColor: '#ffffff',          headerTitleStyle: { fontWeight: '600' },        }}      >        <Stack.Screen          name="Home"          component={HomeScreen}          options={{ title: 'Home' }}        />        <Stack.Screen          name="Detail"          component={DetailScreen}          options={({ route }) => ({            title: Item ${route.params.itemId},          })}        />        <Stack.Screen name="Settings" component={SettingsScreen} />      </Stack.Navigator>    </NavigationContainer>  );}
```
```
import { NavigationContainer } from '@react-navigation/native';import { createNativeStackNavigator } from '@react-navigation/native-stack';type RootStackParamList = {  Home: undefined;  Detail: { itemId: string };  Settings: undefined;};const Stack = createNativeStackNavigator<RootStackParamList>();function AppNavigator() {  return (    <NavigationContainer>      <Stack.Navigator        initialRouteName="Home"        screenOptions={{          headerStyle: { backgroundColor: '#6366f1' },          headerTintColor: '#ffffff',          headerTitleStyle: { fontWeight: '600' },        }}      >        <Stack.Screen          name="Home"          component={HomeScreen}          options={{ title: 'Home' }}        />        <Stack.Screen          name="Detail"          component={DetailScreen}          options={({ route }) => ({            title: Item ${route.params.itemId},          })}        />        <Stack.Screen name="Settings" component={SettingsScreen} />      </Stack.Navigator>    </NavigationContainer>  );}
```
```
Item ${route.params.itemId}
```
```
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';import { Ionicons } from '@expo/vector-icons';type TabParamList = {  Home: undefined;  Search: undefined;  Profile: undefined;};const Tab = createBottomTabNavigator<TabParamList>();function TabNavigator() {  return (    <Tab.Navigator      screenOptions={({ route }) => ({        tabBarIcon: ({ focused, color, size }) => {          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {            Home: focused ? 'home' : 'home-outline',            Search: focused ? 'search' : 'search-outline',            Profile: focused ? 'person' : 'person-outline',          };          return <Ionicons name={icons[route.name]} size={size} color={color} />;        },        tabBarActiveTintColor: '#6366f1',        tabBarInactiveTintColor: '#9ca3af',      })}    >      <Tab.Screen name="Home" component={HomeScreen} />      <Tab.Screen name="Search" component={SearchScreen} />      <Tab.Screen name="Profile" component={ProfileScreen} />    </Tab.Navigator>  );}
```
```
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';import { Ionicons } from '@expo/vector-icons';type TabParamList = {  Home: undefined;  Search: undefined;  Profile: undefined;};const Tab = createBottomTabNavigator<TabParamList>();function TabNavigator() {  return (    <Tab.Navigator      screenOptions={({ route }) => ({        tabBarIcon: ({ focused, color, size }) => {          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {            Home: focused ? 'home' : 'home-outline',            Search: focused ? 'search' : 'search-outline',            Profile: focused ? 'person' : 'person-outline',          };          return <Ionicons name={icons[route.name]} size={size} color={color} />;        },        tabBarActiveTintColor: '#6366f1',        tabBarInactiveTintColor: '#9ca3af',      })}    >      <Tab.Screen name="Home" component={HomeScreen} />      <Tab.Screen name="Search" component={SearchScreen} />      <Tab.Screen name="Profile" component={ProfileScreen} />    </Tab.Navigator>  );}
```
```
import Animated, {  useSharedValue,  useAnimatedStyle,  withSpring,  withTiming,} from 'react-native-reanimated';function AnimatedBox() {  const scale = useSharedValue(1);  const opacity = useSharedValue(1);  const animatedStyle = useAnimatedStyle(() => ({    transform: [{ scale: scale.value }],    opacity: opacity.value,  }));  const handlePress = () => {    scale.value = withSpring(1.2, {}, () => {      scale.value = withSpring(1);    });  };  return (    <Pressable onPress={handlePress}>      <Animated.View style={[styles.box, animatedStyle]} />    </Pressable>  );}
```
```
import Animated, {  useSharedValue,  useAnimatedStyle,  withSpring,  withTiming,} from 'react-native-reanimated';function AnimatedBox() {  const scale = useSharedValue(1);  const opacity = useSharedValue(1);  const animatedStyle = useAnimatedStyle(() => ({    transform: [{ scale: scale.value }],    opacity: opacity.value,  }));  const handlePress = () => {    scale.value = withSpring(1.2, {}, () => {      scale.value = withSpring(1);    });  };  return (    <Pressable onPress={handlePress}>      <Animated.View style={[styles.box, animatedStyle]} />    </Pressable>  );}
```
```
import { Gesture, GestureDetector } from 'react-native-gesture-handler';import Animated, {  useSharedValue,  useAnimatedStyle,  withSpring,} from 'react-native-reanimated';function DraggableCard() {  const translateX = useSharedValue(0);  const translateY = useSharedValue(0);  const gesture = Gesture.Pan()    .onUpdate((event) => {      translateX.value = event.translationX;      translateY.value = event.translationY;    })    .onEnd(() => {      translateX.value = withSpring(0);      translateY.value = withSpring(0);    });  const animatedStyle = useAnimatedStyle(() => ({    transform: [      { translateX: translateX.value },      { translateY: translateY.value },    ],  }));  return (    <GestureDetector gesture={gesture}>      <Animated.View style={[styles.card, animatedStyle]}>        <Text>Drag me!</Text>      </Animated.View>    </GestureDetector>  );}
```
```
import { Gesture, GestureDetector } from 'react-native-gesture-handler';import Animated, {  useSharedValue,  useAnimatedStyle,  withSpring,} from 'react-native-reanimated';function DraggableCard() {  const translateX = useSharedValue(0);  const translateY = useSharedValue(0);  const gesture = Gesture.Pan()    .onUpdate((event) => {      translateX.value = event.translationX;      translateY.value = event.translationY;    })    .onEnd(() => {      translateX.value = withSpring(0);      translateY.value = withSpring(0);    });  const animatedStyle = useAnimatedStyle(() => ({    transform: [      { translateX: translateX.value },      { translateY: translateY.value },    ],  }));  return (    <GestureDetector gesture={gesture}>      <Animated.View style={[styles.card, animatedStyle]}>        <Text>Drag me!</Text>      </Animated.View>    </GestureDetector>  );}
```
```
import { Platform, StyleSheet } from "react-native";const styles = StyleSheet.create({  container: {    padding: 16,    ...Platform.select({      ios: {        shadowColor: "#000",        shadowOffset: { width: 0, height: 2 },        shadowOpacity: 0.1,        shadowRadius: 4,      },      android: {        elevation: 4,      },    }),  },  text: {    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",    fontSize: 16,  },});// Platform-specific componentsimport { Platform } from "react-native";const StatusBarHeight = Platform.OS === "ios" ? 44 : 0;
```
```
import { Platform, StyleSheet } from "react-native";const styles = StyleSheet.create({  container: {    padding: 16,    ...Platform.select({      ios: {        shadowColor: "#000",        shadowOffset: { width: 0, height: 2 },        shadowOpacity: 0.1,        shadowRadius: 4,      },      android: {        elevation: 4,      },    }),  },  text: {    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",    fontSize: 16,  },});// Platform-specific componentsimport { Platform } from "react-native";const StatusBarHeight = Platform.OS === "ios" ? 44 : 0;
```
```
import React from 'react';import {  View,  Text,  StyleSheet,  Pressable,  Image,} from 'react-native';import Animated, {  useSharedValue,  useAnimatedStyle,  withSpring,} from 'react-native-reanimated';interface ItemCardProps {  title: string;  subtitle: string;  imageUrl: string;  onPress: () => void;}const AnimatedPressable = Animated.createAnimatedComponent(Pressable);export function ItemCard({ title, subtitle, imageUrl, onPress }: ItemCardProps) {  const scale = useSharedValue(1);  const animatedStyle = useAnimatedStyle(() => ({    transform: [{ scale: scale.value }],  }));  return (    <AnimatedPressable      style={[styles.card, animatedStyle]}      onPress={onPress}      onPressIn={() => { scale.value = withSpring(0.97); }}      onPressOut={() => { scale.value = withSpring(1); }}    >      <Image source={{ uri: imageUrl }} style={styles.image} />      <View style={styles.content}>        <Text style={styles.title} numberOfLines={1}>          {title}        </Text>        <Text style={styles.subtitle} numberOfLines={2}>          {subtitle}        </Text>      </View>    </AnimatedPressable>  );}const styles = StyleSheet.create({  card: {    backgroundColor: '#ffffff',    borderRadius: 16,    overflow: 'hidden',    shadowColor: '#000',    shadowOffset: { width: 0, height: 2 },    shadowOpacity: 0.1,    shadowRadius: 8,    elevation: 4,  },  image: {    width: '100%',    height: 160,    backgroundColor: '#f3f4f6',  },  content: {    padding: 16,    gap: 4,  },  title: {    fontSize: 18,    fontWeight: '600',    color: '#1f2937',  },  subtitle: {    fontSize: 14,    color: '#6b7280',    lineHeight: 20,  },});
```
```
import React from 'react';import {  View,  Text,  StyleSheet,  Pressable,  Image,} from 'react-native';import Animated, {  useSharedValue,  useAnimatedStyle,  withSpring,} from 'react-native-reanimated';interface ItemCardProps {  title: string;  subtitle: string;  imageUrl: string;  onPress: () => void;}const AnimatedPressable = Animated.createAnimatedComponent(Pressable);export function ItemCard({ title, subtitle, imageUrl, onPress }: ItemCardProps) {  const scale = useSharedValue(1);  const animatedStyle = useAnimatedStyle(() => ({    transform: [{ scale: scale.value }],  }));  return (    <AnimatedPressable      style={[styles.card, animatedStyle]}      onPress={onPress}      onPressIn={() => { scale.value = withSpring(0.97); }}      onPressOut={() => { scale.value = withSpring(1); }}    >      <Image source={{ uri: imageUrl }} style={styles.image} />      <View style={styles.content}>        <Text style={styles.title} numberOfLines={1}>          {title}        </Text>        <Text style={styles.subtitle} numberOfLines={2}>          {subtitle}        </Text>      </View>    </AnimatedPressable>  );}const styles = StyleSheet.create({  card: {    backgroundColor: '#ffffff',    borderRadius: 16,    overflow: 'hidden',    shadowColor: '#000',    shadowOffset: { width: 0, height: 2 },    shadowOpacity: 0.1,    shadowRadius: 8,    elevation: 4,  },  image: {    width: '100%',    height: 160,    backgroundColor: '#f3f4f6',  },  content: {    padding: 16,    gap: 4,  },  title: {    fontSize: 18,    fontWeight: '600',    color: '#1f2937',  },  subtitle: {    fontSize: 14,    color: '#6b7280',    lineHeight: 20,  },});
```
```
React.memo
```
```
useCallback
```
```
SafeAreaView
```
```
useSafeAreaInsets
```
```
GestureDetector
```
```
simultaneousHandlers
```
```
ParamList
```
```
runOnUI
```
```
expo-font
```
```
react-native-asset
```
Unlock the full potential of cross-platform mobile development with the React Native Design skill. This agent provides expert guidance on crafting beautiful, high-performance user interfaces using industry-standard tools. Learn to implement seamless navigation, create fluid animations, and apply robust styling techniques that ensure your applications deliver a native-quality experience on both iOS and Android. Whether you're building a new app from scratch or enhancing an existing project, this skill empowers you to create responsive, visually appealing, and optimized mobile solutions that stand out.

# When to Use This Skill
- •Developing new cross-platform mobile applications using React Native.
- •Implementing complex navigation flows and routing patterns with React Navigation.
- •Creating sophisticated and performant UI animations with Reanimated 3.
- •Designing responsive and platform-adaptive user interfaces for iOS and Android.

# Pro Tips
- 💡Prioritize `StyleSheet.create` for static styles and performance, reserving `styled-components` for dynamic, theme-driven styling or specific component encapsulation.
- 💡Always use `useNativeDriver: true` for animations with `Animated` or leverage `Reanimated` directly to ensure animations run on the native UI thread, preventing frame drops.
- 💡Organize your navigation structure logically using nested navigators in React Navigation, and make sure to lazy-load screens to optimize initial bundle size and startup time.

