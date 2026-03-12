# vueuse
Source: https://antigravity.codes/agent-skills/vue/vueuse

## AI Worker Instructions
When the user requests functionality related to vueuse, follow these guidelines and utilize this context.

## Scraped Content

# vueuse
```
pnpm add @vueuse/core
```
```
pnpm add @vueuse/core
```
```
pnpm add @vueuse/nuxt @vueuse/core
```
```
pnpm add @vueuse/nuxt @vueuse/core
```
```
// nuxt.config.tsexport default defineNuxtConfig({  modules: ['@vueuse/nuxt'],})
```
```
// nuxt.config.tsexport default defineNuxtConfig({  modules: ['@vueuse/nuxt'],})
```
```
composables/<name>.md
```
```
composables/use-mouse.md
```
```
composables/use-local-storage.md
```
```
const state = useLocalStorage('my-key', { count: 0 })
```
```
const state = useLocalStorage('my-key', { count: 0 })
```
```
const { x, y } = useMouse()
```
```
const { x, y } = useMouse()
```
```
const search = ref('')const debouncedSearch = refDebounced(search, 300)
```
```
const search = ref('')const debouncedSearch = refDebounced(search, 300)
```
```
const useSharedMouse = createSharedComposable(useMouse)
```
```
const useSharedMouse = createSharedComposable(useMouse)
```
```
isClient
```
```
import { isClient } from '@vueuse/core'if (isClient) {  // Browser-only code  const { width } = useWindowSize()}
```
```
import { isClient } from '@vueuse/core'if (isClient) {  // Browser-only code  const { width } = useWindowSize()}
```
```
const width = ref(0)onMounted(() => {  // Only runs in browser  const { width: w } = useWindowSize()  width.value = w.value})
```
```
const width = ref(0)onMounted(() => {  // Only runs in browser  const { width: w } = useWindowSize()  width.value = w.value})
```
```
// These check isClient internallyconst mouse = useMouse() // Returns {x: 0, y: 0} on serverconst storage = useLocalStorage('key', 'default') // Uses default on server
```
```
// These check isClient internallyconst mouse = useMouse() // Returns {x: 0, y: 0} on serverconst storage = useLocalStorage('key', 'default') // Uses default on server
```
```
@vueuse/nuxt
```
```
import type { MaybeElementRef } from '@vueuse/core'// Component ref needs .$el to get DOM elementconst compRef = ref<ComponentInstance>()const { width } = useElementSize(compRef) // ❌ Won't work// Use MaybeElementRef patternimport { unrefElement } from '@vueuse/core'const el = computed(() => unrefElement(compRef)) // Gets .$elconst { width } = useElementSize(el) // ✅ Works
```
```
import type { MaybeElementRef } from '@vueuse/core'// Component ref needs .$el to get DOM elementconst compRef = ref<ComponentInstance>()const { width } = useElementSize(compRef) // ❌ Won't work// Use MaybeElementRef patternimport { unrefElement } from '@vueuse/core'const el = computed(() => unrefElement(compRef)) // Gets .$elconst { width } = useElementSize(el) // ✅ Works
```
```
$el
```
```
const compRef = ref<ComponentInstance>()onMounted(() => {  const el = compRef.value?.$el as HTMLElement  const { width } = useElementSize(el)})
```
```
const compRef = ref<ComponentInstance>()onMounted(() => {  const el = compRef.value?.$el as HTMLElement  const { width } = useElementSize(el)})
```
Leverage the VueUse Agent Skill to significantly boost your productivity in Vue.js and Nuxt.js projects. This powerful skill integrates directly with the vast collection of VueUse composables, providing reactive solutions for almost any common development scenario. From managing component state and interacting with browser APIs to handling animations and network requests, VueUse offers pre-built, optimized functions. It empowers developers to write cleaner, more efficient code by abstracting complex reactive logic, allowing you to focus on application features rather than utility implementation. Discover how to build robust, performant Vue applications with less effort.

# When to Use This Skill
- •Managing local storage for user preferences and application settings with `useLocalStorage`.
- •Building dynamic forms that react to user input, debouncing changes with `watchDebounced`.
- •Implementing responsive UI components based on viewport changes using `useMediaQuery` and `useElementSize`.
- •Integrating real-time features by consuming WebSocket data with `useWebSocket`.

# Pro Tips
- 💡Always check the comprehensive VueUse documentation first; a composable likely exists for your specific use case, saving significant development time.
- 💡Combine multiple VueUse composables for complex scenarios, such as `useFetch` with `useIntervalFn` for efficient data polling.
- 💡Utilize the Nuxt module for automatic composable imports, simplifying your component code and reducing boilerplate.

