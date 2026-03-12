# vue-best-practices
Source: https://antigravity.codes/agent-skills/vue/vue-best-practices

## AI Worker Instructions
When the user requests functionality related to vue-best-practices, follow these guidelines and utilize this context.

## Scraped Content

# vue-best-practices
```
// .vscode/settings.json{  "vue.codeActions.enabled": false}
```
```
// .vscode/settings.json{  "vue.codeActions.enabled": false}
```
```
// .vscode/settings.json{  "vue.codeActions.savingTimeLimit": 1000}
```
```
// .vscode/settings.json{  "vue.codeActions.savingTimeLimit": 1000}
```
```
// .vscode/settings.json{  "vue.codeActions.enabled": true,  "editor.codeActionsOnSave": {    "source.organizeImports": "never"  }}
```
```
// .vscode/settings.json{  "vue.codeActions.enabled": true,  "editor.codeActionsOnSave": {    "source.organizeImports": "never"  }}
```
```
// .vscode/settings.json{  "vue.codeActions.enabled": false,  "editor.formatOnSave": true,  "editor.codeActionsOnSave": {},  "[vue]": {    "editor.formatOnSave": true,    "editor.defaultFormatter": "Vue.volar"  }}
```
```
// .vscode/settings.json{  "vue.codeActions.enabled": false,  "editor.formatOnSave": true,  "editor.codeActionsOnSave": {},  "[vue]": {    "editor.formatOnSave": true,    "editor.defaultFormatter": "Vue.volar"  }}
```
```
strictTemplates
```
```
data-*
```
```
dataAttributes
```
```
<template>  <!-- Error: Property 'data-testid' does not exist on type... -->  <MyComponent data-testid="submit-button" />  <!-- Error: Property 'data-cy' does not exist on type... -->  <MyComponent data-cy="login-form" /></template>
```
```
<template>  <!-- Error: Property 'data-testid' does not exist on type... -->  <MyComponent data-testid="submit-button" />  <!-- Error: Property 'data-cy' does not exist on type... -->  <MyComponent data-cy="login-form" /></template>
```
```
dataAttributes
```
```
// tsconfig.json or tsconfig.app.json{  "vueCompilerOptions": {    "strictTemplates": true,    "dataAttributes": ["data-*"]  }}
```
```
// tsconfig.json or tsconfig.app.json{  "vueCompilerOptions": {    "strictTemplates": true,    "dataAttributes": ["data-*"]  }}
```
```
data-*
```
```
{  "vueCompilerOptions": {    "dataAttributes": [      "data-testid",      "data-cy",      "data-test-*"    ]  }}
```
```
{  "vueCompilerOptions": {    "dataAttributes": [      "data-testid",      "data-cy",      "data-test-*"    ]  }}
```
```
data-testid
```
```
"data-testid"
```
```
data-cy
```
```
"data-cy"
```
```
data-testid
```
```
"data-testid"
```
```
"data-*"
```
```
deep: number
```
```
deep
```
```
// Vue 3.5+ onlywatch(items, (newVal) => {  // Triggered on array mutations (push, pop, splice, etc.)}, { deep: 1 })
```
```
// Vue 3.5+ onlywatch(items, (newVal) => {  // Triggered on array mutations (push, pop, splice, etc.)}, { deep: 1 })
```
```
true
```
```
false
```
```
1
```
```
2
```
```
n
```
```
npm install vue@^3.5.0
```
```
npm install vue@^3.5.0
```
```
import { watch, ref } from 'vue'const items = ref([{ id: 1, data: { nested: 'value' } }])// Watch array mutations only (push, pop, etc.)watch(items, (newItems) => {  console.log('Array mutated')}, { deep: 1 })// Won't trigger on: items.value[0].data.nested = 'new'// Will trigger on: items.value.push(newItem)
```
```
import { watch, ref } from 'vue'const items = ref([{ id: 1, data: { nested: 'value' } }])// Watch array mutations only (push, pop, etc.)watch(items, (newItems) => {  console.log('Array mutated')}, { deep: 1 })// Won't trigger on: items.value[0].data.nested = 'new'// Will trigger on: items.value.push(newItem)
```
```
const largeNestedData = ref({ /* deeply nested structure */ })// SLOW - traverses entire structurewatch(largeNestedData, handler, { deep: true })// FAST - only watches top-level changeswatch(largeNestedData, handler, { deep: 1 })// FASTEST - only reference changeswatch(largeNestedData, handler, { deep: false })
```
```
const largeNestedData = ref({ /* deeply nested structure */ })// SLOW - traverses entire structurewatch(largeNestedData, handler, { deep: true })// FAST - only watches top-level changeswatch(largeNestedData, handler, { deep: 1 })// FASTEST - only reference changeswatch(largeNestedData, handler, { deep: false })
```
```
// Only tracks properties actually accessedwatchEffect(() => {  // Only re-runs when items.value.length or first item changes  console.log(items.value.length, items.value[0]?.id)})
```
```
// Only tracks properties actually accessedwatchEffect(() => {  // Only re-runs when items.value.length or first item changes  console.log(items.value.length, items.value[0]?.id)})
```
```
vue
```
```
undefined
```
```
defineModel
```
```
@update:model-value
```
```
undefined
```
```
undefined
```
```
T
```
```
T | undefined
```
```
defineModel
```
```
Ref<T | undefined>
```
```
T
```
```
undefined
```
```
// Returns Ref<Item> instead of Ref<Item | undefined>const model = defineModel<Item>({ required: true })
```
```
// Returns Ref<Item> instead of Ref<Item | undefined>const model = defineModel<Item>({ required: true })
```
```
<template>  <MyComponent    v-model="item"    @update:model-value="handleUpdate"  /></template><script setup lang="ts">// Handle both value and undefinedconst handleUpdate = (value: Item | undefined) => {  if (value !== undefined) {    item.value = value  }}</script>
```
```
<template>  <MyComponent    v-model="item"    @update:model-value="handleUpdate"  /></template><script setup lang="ts">// Handle both value and undefinedconst handleUpdate = (value: Item | undefined) => {  if (value !== undefined) {    item.value = value  }}</script>
```
```
const model = defineModel<string>({ default: '' })
```
```
const model = defineModel<string>({ default: '' })
```
```
// In child componentinterface Props {  modelValue: Item}const model = defineModel<Item>({ required: true })// Emits will be typed as (value: Item) not (value: Item | undefined)
```
```
// In child componentinterface Props {  modelValue: Item}const model = defineModel<Item>({ required: true })// Emits will be typed as (value: Item) not (value: Item | undefined)
```
```
vite.config.js
```
```
inlineConfig
```
```
import { build } from 'vite'import vue from '@vitejs/plugin-vue'await build({  configFile: false,  // Don't load vite.config.js  plugins: [vue()],  // ... rest of config})
```
```
import { build } from 'vite'import vue from '@vitejs/plugin-vue'await build({  configFile: false,  // Don't load vite.config.js  plugins: [vue()],  // ... rest of config})
```
```
// vite.config.js already has vue pluginimport { build } from 'vite'await build({  // Don't add vue plugin here - it's in vite.config.js  root: './src',  build: { outDir: '../dist' }})
```
```
// vite.config.js already has vue pluginimport { build } from 'vite'await build({  // Don't add vue plugin here - it's in vite.config.js  root: './src',  build: { outDir: '../dist' }})
```
```
import { build, loadConfigFromFile } from 'vite'import vue from '@vitejs/plugin-vue'const { config } = await loadConfigFromFile({ command: 'build', mode: 'production' })// Remove existing Vue pluginconst filteredPlugins = config.plugins?.filter(  p => !p || (Array.isArray(p) ? false : p.name !== 'vite:vue')) || []await build({  ...config,  plugins: [...filteredPlugins, vue({ /* your options */ })]})
```
```
import { build, loadConfigFromFile } from 'vite'import vue from '@vitejs/plugin-vue'const { config } = await loadConfigFromFile({ command: 'build', mode: 'production' })// Remove existing Vue pluginconst filteredPlugins = config.plugins?.filter(  p => !p || (Array.isArray(p) ? false : p.name !== 'vite:vue')) || []await build({  ...config,  plugins: [...filteredPlugins, vue({ /* your options */ })]})
```
```
// vite.config.tsexport default defineConfig({  plugins: [    vue(),    {      name: 'debug-plugins',      configResolved(config) {        const vuePlugins = config.plugins.filter(p => p.name?.includes('vue'))        if (vuePlugins.length > 1) {          console.warn('WARNING: Multiple Vue plugins detected:', vuePlugins.map(p => p.name))        }      }    }  ]})
```
```
// vite.config.tsexport default defineConfig({  plugins: [    vue(),    {      name: 'debug-plugins',      configResolved(config) {        const vuePlugins = config.plugins.filter(p => p.name?.includes('vue'))        if (vuePlugins.length > 1) {          console.warn('WARNING: Multiple Vue plugins detected:', vuePlugins.map(p => p.name))        }      }    }  ]})
```
```
vite.createServer()
```
```
configFile: false
```
```
vue-component-type-helpers
```
```
.vue
```
```
npm install -D vue-component-type-helpers
```
```
npm install -D vue-component-type-helpers
```
```
import type { ComponentProps, ComponentEmit, ComponentSlots, ComponentExposed } from 'vue-component-type-helpers'import MyButton from './MyButton.vue'type Props = ComponentProps<typeof MyButton>type Emits = ComponentEmit<typeof MyButton>type Slots = ComponentSlots<typeof MyButton>type Exposed = ComponentExposed<typeof MyButton>
```
```
import type { ComponentProps, ComponentEmit, ComponentSlots, ComponentExposed } from 'vue-component-type-helpers'import MyButton from './MyButton.vue'type Props = ComponentProps<typeof MyButton>type Emits = ComponentEmit<typeof MyButton>type Slots = ComponentSlots<typeof MyButton>type Exposed = ComponentExposed<typeof MyButton>
```
```
import type { ComponentProps } from 'vue-component-type-helpers'import BaseButton from './BaseButton.vue'type BaseProps = ComponentProps<typeof BaseButton>interface Props extends BaseProps {  size: 'sm' | 'md' | 'lg'}defineProps<Props>()
```
```
import type { ComponentProps } from 'vue-component-type-helpers'import BaseButton from './BaseButton.vue'type BaseProps = ComponentProps<typeof BaseButton>interface Props extends BaseProps {  size: 'sm' | 'md' | 'lg'}defineProps<Props>()
```
```
// ❌ Includes Vue internal properties (onUpdate:*, class, style, etc.)type Props = InstanceType<typeof MyButton>['$props']
```
```
// ❌ Includes Vue internal properties (onUpdate:*, class, style, etc.)type Props = InstanceType<typeof MyButton>['$props']
```
```
ExtractPropTypes
```
```
props: { foo: String }
```
```
.vue
```
```
fallthroughAttributes
```
```
<!-- MyButton.vue - wrapper around native button --><template>  <button v-bind="$attrs"><slot /></button></template>
```
```
<!-- MyButton.vue - wrapper around native button --><template>  <button v-bind="$attrs"><slot /></button></template>
```
```
fallthroughAttributes
```
```
// tsconfig.json or tsconfig.app.json{  "vueCompilerOptions": {    "fallthroughAttributes": true  }}
```
```
// tsconfig.json or tsconfig.app.json{  "vueCompilerOptions": {    "fallthroughAttributes": true  }}
```
```
fallthroughAttributes: true
```
```
$attrs
```
```
strictTemplates
```
```
{  "vueCompilerOptions": {    "strictTemplates": true,    "fallthroughAttributes": true  }}
```
```
{  "vueCompilerOptions": {    "strictTemplates": true,    "fallthroughAttributes": true  }}
```
```
<script setup>
```
```
<template>
```
```
<script setup>
```
```
// vite.config.tsimport { defineConfig } from 'vite'import vue from '@vitejs/plugin-vue'export default defineConfig({  plugins: [vue()],  ssr: {    // Don't externalize these for HMR to work    noExternal: ['vue', '@vue/runtime-core', '@vue/runtime-dom']  }})
```
```
// vite.config.tsimport { defineConfig } from 'vite'import vue from '@vitejs/plugin-vue'export default defineConfig({  plugins: [vue()],  ssr: {    // Don't externalize these for HMR to work    noExternal: ['vue', '@vue/runtime-core', '@vue/runtime-dom']  }})
```
```
// server.tsimport { createServer } from 'vite'const vite = await createServer({  server: { middlewareMode: true },  appType: 'custom'})// Use vite.ssrLoadModule for server-side importsconst { render } = await vite.ssrLoadModule('/src/entry-server.ts')// Handle HMRvite.watcher.on('change', async (file) => {  if (file.endsWith('.vue')) {    // Invalidate the module    const mod = vite.moduleGraph.getModuleById(file)    if (mod) {      vite.moduleGraph.invalidateModule(mod)    }  }})
```
```
// server.tsimport { createServer } from 'vite'const vite = await createServer({  server: { middlewareMode: true },  appType: 'custom'})// Use vite.ssrLoadModule for server-side importsconst { render } = await vite.ssrLoadModule('/src/entry-server.ts')// Handle HMRvite.watcher.on('change', async (file) => {  if (file.endsWith('.vue')) {    // Invalidate the module    const mod = vite.moduleGraph.getModuleById(file)    if (mod) {      vite.moduleGraph.invalidateModule(mod)    }  }})
```
```
// entry-server.tsimport { createApp } from './main'export async function render(url: string) {  const app = createApp()  // ... render logic}// Accept HMR updatesif (import.meta.hot) {  import.meta.hot.accept()}
```
```
// entry-server.tsimport { createApp } from './main'export async function render(url: string) {  const app = createApp()  // ... render logic}// Accept HMR updatesif (import.meta.hot) {  import.meta.hot.accept()}
```
```
rm -rf .nuxt node_modules/.vitenpm installnpm run dev
```
```
rm -rf .nuxt node_modules/.vitenpm installnpm run dev
```
```
@vitejs/plugin-vue
```
```
npm install @vitejs/plugin-vue@latest
```
```
npm install @vitejs/plugin-vue@latest
```
```
// vite.config.tsexport default defineConfig({  server: {    hmr: {      overlay: true    }  },  logLevel: 'info'  // Shows HMR updates})
```
```
// vite.config.tsexport default defineConfig({  server: {    hmr: {      overlay: true    }  },  logLevel: 'info'  // Shows HMR updates})
```
```
<script>
```
```
<script setup>
```
```
@vue/tsconfig
```
```
moduleResolution
```
```
"node"
```
```
"bundler"
```
```
resolveJsonModule
```
```
Cannot find module 'vue'
```
```
Option '--resolveJsonModule' cannot be specified without 'node' module resolution
```
```
@vue/tsconfig
```
```
moduleResolution: "bundler"
```
```
exports
```
```
npm install -D typescript@^5.0.0
```
```
npm install -D typescript@^5.0.0
```
```
{  "compilerOptions": {    "module": "ESNext",    "moduleResolution": "bundler",    "resolvePackageJsonExports": false  }}
```
```
{  "compilerOptions": {    "module": "ESNext",    "moduleResolution": "bundler",    "resolvePackageJsonExports": false  }}
```
```
resolvePackageJsonExports: false
```
```
{  "compilerOptions": {    "moduleResolution": "node"  }}
```
```
{  "compilerOptions": {    "moduleResolution": "node"  }}
```
```
exports
```
```
exports
```
```
# Check which resolution is being usedcat tsconfig.json | grep moduleResolution# Test if a specific module resolvesnpx tsc --traceResolution 2>&1 | grep "module-name"
```
```
# Check which resolution is being usedcat tsconfig.json | grep moduleResolution# Test if a specific module resolvesnpx tsc --traceResolution 2>&1 | grep "module-name"
```
```
createTestingPinia
```
```
createSpy
```
```
createSpy
```
```
createSpy
```
```
createSpy
```
```
import { mount } from '@vue/test-utils'import { createTestingPinia } from '@pinia/testing'import { vi } from 'vitest'import MyComponent from './MyComponent.vue'import { useCounterStore } from '@/stores/counter'test('component uses store', async () => {  const wrapper = mount(MyComponent, {    global: {      plugins: [        createTestingPinia({          createSpy: vi.fn,  // REQUIRED in @pinia/testing 1.0+          initialState: {            counter: { count: 10 }  // Set initial state          }        })      ]    }  })  // Get the store instance AFTER mounting  const store = useCounterStore()  // Actions are automatically stubbed  await wrapper.find('button').trigger('click')  expect(store.increment).toHaveBeenCalled()})
```
```
import { mount } from '@vue/test-utils'import { createTestingPinia } from '@pinia/testing'import { vi } from 'vitest'import MyComponent from './MyComponent.vue'import { useCounterStore } from '@/stores/counter'test('component uses store', async () => {  const wrapper = mount(MyComponent, {    global: {      plugins: [        createTestingPinia({          createSpy: vi.fn,  // REQUIRED in @pinia/testing 1.0+          initialState: {            counter: { count: 10 }  // Set initial state          }        })      ]    }  })  // Get the store instance AFTER mounting  const store = useCounterStore()  // Actions are automatically stubbed  await wrapper.find('button').trigger('click')  expect(store.increment).toHaveBeenCalled()})
```
```
test('component handles async action', async () => {  const wrapper = mount(MyComponent, {    global: {      plugins: [        createTestingPinia({          createSpy: vi.fn,          stubActions: false  // Don't stub, use real actions        })      ]    }  })  const store = useCounterStore()  // Override specific action  store.fetchData = vi.fn().mockResolvedValue({ items: [] })  await wrapper.find('.load-button').trigger('click')  expect(store.fetchData).toHaveBeenCalled()})
```
```
test('component handles async action', async () => {  const wrapper = mount(MyComponent, {    global: {      plugins: [        createTestingPinia({          createSpy: vi.fn,          stubActions: false  // Don't stub, use real actions        })      ]    }  })  const store = useCounterStore()  // Override specific action  store.fetchData = vi.fn().mockResolvedValue({ items: [] })  await wrapper.find('.load-button').trigger('click')  expect(store.fetchData).toHaveBeenCalled()})
```
```
import { setActivePinia, createPinia } from 'pinia'import { useCounterStore } from '@/stores/counter'describe('Counter Store', () => {  beforeEach(() => {    setActivePinia(createPinia())  })  test('increments count', () => {    const store = useCounterStore()    expect(store.count).toBe(0)    store.increment()    expect(store.count).toBe(1)  })})
```
```
import { setActivePinia, createPinia } from 'pinia'import { useCounterStore } from '@/stores/counter'describe('Counter Store', () => {  beforeEach(() => {    setActivePinia(createPinia())  })  test('increments count', () => {    const store = useCounterStore()    expect(store.count).toBe(0)    store.increment()    expect(store.count).toBe(1)  })})
```
```
// stores/counter.ts - Setup store syntaxexport const useCounterStore = defineStore('counter', () => {  const count = ref(0)  const doubleCount = computed(() => count.value * 2)  function increment() {    count.value++  }  return { count, doubleCount, increment }})// Test filetest('setup store works', async () => {  const pinia = createTestingPinia({    createSpy: vi.fn,    initialState: {      counter: { count: 5 }    }  })  const wrapper = mount(MyComponent, {    global: { plugins: [pinia] }  })  const store = useCounterStore()  expect(store.count).toBe(5)  expect(store.doubleCount).toBe(10)})
```
```
// stores/counter.ts - Setup store syntaxexport const useCounterStore = defineStore('counter', () => {  const count = ref(0)  const doubleCount = computed(() => count.value * 2)  function increment() {    count.value++  }  return { count, doubleCount, increment }})// Test filetest('setup store works', async () => {  const pinia = createTestingPinia({    createSpy: vi.fn,    initialState: {      counter: { count: 5 }    }  })  const wrapper = mount(MyComponent, {    global: { plugins: [pinia] }  })  const store = useCounterStore()  expect(store.count).toBe(5)  expect(store.doubleCount).toBe(10)})
```
```
describe('Store Tests', () => {  let pinia: Pinia  beforeEach(() => {    pinia = createTestingPinia({      createSpy: vi.fn    })  })  afterEach(() => {    vi.clearAllMocks()  })  test('test 1', () => { /* ... */ })  test('test 2', () => { /* ... */ })})
```
```
describe('Store Tests', () => {  let pinia: Pinia  beforeEach(() => {    pinia = createTestingPinia({      createSpy: vi.fn    })  })  afterEach(() => {    vi.clearAllMocks()  })  test('test 1', () => { /* ... */ })  test('test 2', () => { /* ... */ })})
```
```
<script setup>
```
```
<script setup lang="ts">/** * This comment doesn't appear in IDE hover or docs * @component */import { ref } from 'vue'const count = ref(0)</script>
```
```
<script setup lang="ts">/** * This comment doesn't appear in IDE hover or docs * @component */import { ref } from 'vue'const count = ref(0)</script>
```
```
<script setup>
```
```
<script>
```
```
<script setup>
```
```
<script lang="ts">/** * A counter component that displays and increments a value. * * @example *
```
```
<script lang="ts">/** * A counter component that displays and increments a value. * * @example *
```
```
* * @component */export default {}</script><script setup lang="ts">import { ref } from 'vue'const props = defineProps<{  /** Starting value for the counter */  initial?: number}>()const emit = defineEmits<{  /** Emitted when counter value changes */  update: [value: number]}>()const count = ref(props.initial ?? 0)</script>
```
```
* * @component */export default {}</script><script setup lang="ts">import { ref } from 'vue'const props = defineProps<{  /** Starting value for the counter */  initial?: number}>()const emit = defineEmits<{  /** Emitted when counter value changes */  update: [value: number]}>()const count = ref(props.initial ?? 0)</script>
```
```
<script>
```
```
<script setup>
```
```
export default {}
```
```
<script setup>
```
```
export default {}
```
```
defineProps
```
```
defineEmits
```
```
<style module>
```
```
strictCssModules
```
```
<script setup lang="ts">// No error for typo in class name</script><template>  <div :class="$style.buttn">Click me</div></template><style module>.button {  background: blue;}</style>
```
```
<script setup lang="ts">// No error for typo in class name</script><template>  <div :class="$style.buttn">Click me</div></template><style module>.button {  background: blue;}</style>
```
```
buttn
```
```
button
```
```
strictCssModules
```
```
// tsconfig.json or tsconfig.app.json{  "vueCompilerOptions": {    "strictCssModules": true  }}
```
```
// tsconfig.json or tsconfig.app.json{  "vueCompilerOptions": {    "strictCssModules": true  }}
```
```
$style.buttn
```
```
buttn
```
```
$style.validClass
```
```
$style.typo
```
```
$style['dynamic']
```
```
$style.className
```
```
$style[variable]
```
```
<style module>
```
```
vue_ls doesn't work with ts_ls
```
```
-- Replace ts_ls/tsserver with vtslsrequire('lspconfig').vtsls.setup({})require('lspconfig').volar.setup({})
```
```
-- Replace ts_ls/tsserver with vtslsrequire('lspconfig').vtsls.setup({})require('lspconfig').volar.setup({})
```
```
npm install -g @vue/language-server@2.1.10
```
```
npm install -g @vue/language-server@2.1.10
```
```
npm install -g @vue/language-server@^2.0.0
```
```
npm install -g @vue/language-server@^2.0.0
```
```
<template>  <!-- @vue-ignore -->  <Component :prop="valueWithTypeError" /></template>
```
```
<template>  <!-- @vue-ignore -->  <Component :prop="valueWithTypeError" /></template>
```
```
<template>  <!-- @vue-expect-error -->  <Component :invalid-prop="value" /></template>
```
```
<template>  <!-- @vue-expect-error -->  <Component :invalid-prop="value" /></template>
```
```
<template>  <!-- @vue-skip -->  <div>    <!-- Everything in here is not type-checked -->    <LegacyComponent :any="props" :go="here" />  </div></template>
```
```
<template>  <!-- @vue-skip -->  <div>    <!-- Everything in here is not type-checked -->    <LegacyComponent :any="props" :go="here" />  </div></template>
```
```
<template>  <!-- @vue-generic {T extends string} -->  <GenericList :items="items as T[]" /></template>
```
```
<template>  <!-- @vue-generic {T extends string} -->  <GenericList :items="items as T[]" /></template>
```
```
unplugin-vue-router
```
```
route.params
```
```
Record<never, never> | { id: string }
```
```
route.params.id
```
```
string | undefined
```
```
if (route.name === 'users-id')
```
```
unplugin-vue-router
```
```
// pages/users/[id].vueimport { useRoute } from 'vue-router/auto'// Specify the route path for proper typingconst route = useRoute('/users/[id]')// Now properly typed as { id: string }console.log(route.params.id)  // string, not string | undefined
```
```
// pages/users/[id].vueimport { useRoute } from 'vue-router/auto'// Specify the route path for proper typingconst route = useRoute('/users/[id]')// Now properly typed as { id: string }console.log(route.params.id)  // string, not string | undefined
```
```
import { useRoute } from 'vue-router'import type { RouteLocationNormalized } from 'vue-router/auto-routes'const route = useRoute() as RouteLocationNormalized<'/users/[id]'>route.params.id  // Properly typed
```
```
import { useRoute } from 'vue-router'import type { RouteLocationNormalized } from 'vue-router/auto-routes'const route = useRoute() as RouteLocationNormalized<'/users/[id]'>route.params.id  // Properly typed
```
```
// In your page componentinterface UserRouteParams {  id: string}const route = useRoute()const { id } = route.params as UserRouteParams
```
```
// In your page componentinterface UserRouteParams {  id: string}const route = useRoute()const { id } = route.params as UserRouteParams
```
```
moduleResolution: "bundler"
```
```
{  "compilerOptions": {    "moduleResolution": "bundler"  }}
```
```
{  "compilerOptions": {    "moduleResolution": "bundler"  }}
```
```
pages/users/[id].vue
```
```
/users/[id]
```
```
pages/posts/[slug]/comments.vue
```
```
/posts/[slug]/comments
```
```
strictTemplates
```
```
vueCompilerOptions
```
```
create-vue
```
```
tsconfig.app.json
```
```
tsconfig.json
```
```
tsconfig.node.json
```
```
{  "compilerOptions": {    "strict": true  }  // vueCompilerOptions not configured - undefined components won't error}
```
```
{  "compilerOptions": {    "strict": true  }  // vueCompilerOptions not configured - undefined components won't error}
```
```
{  "compilerOptions": {    "strict": true  },  "vueCompilerOptions": {    "strictTemplates": true  }}
```
```
{  "compilerOptions": {    "strict": true  },  "vueCompilerOptions": {    "strictTemplates": true  }}
```
```
strictTemplates
```
```
false
```
```
checkUnknownComponents
```
```
false
```
```
checkUnknownProps
```
```
false
```
```
checkUnknownEvents
```
```
false
```
```
defineEmits
```
```
checkUnknownDirectives
```
```
false
```
```
strictTemplates
```
```
{  "vueCompilerOptions": {    "checkUnknownComponents": true,    "checkUnknownProps": false  }}
```
```
{  "vueCompilerOptions": {    "checkUnknownComponents": true,    "checkUnknownProps": false  }}
```
```
withDefaults
```
```
false | string
```
```
false | string
```
```
// This produces a spurious warning (but works at runtime)interface Props {  value: false | string  // Union type}const props = withDefaults(defineProps<Props>(), {  value: 'default'  // Runtime value IS correct, but Vue warns about missing prop})
```
```
// This produces a spurious warning (but works at runtime)interface Props {  value: false | string  // Union type}const props = withDefaults(defineProps<Props>(), {  value: 'default'  // Runtime value IS correct, but Vue warns about missing prop})
```
```
<script setup lang="ts">interface Props {  value: false | string}// Preferred in Vue 3.5+const { value = 'default' } = defineProps<Props>()</script>
```
```
<script setup lang="ts">interface Props {  value: false | string}// Preferred in Vue 3.5+const { value = 'default' } = defineProps<Props>()</script>
```
```
<script setup lang="ts">const props = defineProps({  value: {    type: [Boolean, String] as PropType<false | string>,    default: 'default'  }})</script>
```
```
<script setup lang="ts">const props = defineProps({  value: {    type: [Boolean, String] as PropType<false | string>,    default: 'default'  }})</script>
```
```
interface Props {  enabled: boolean  customValue?: string}const props = withDefaults(defineProps<Props>(), {  enabled: false,  customValue: 'default'})
```
```
interface Props {  enabled: boolean  customValue?: string}const props = withDefaults(defineProps<Props>(), {  enabled: false,  customValue: 'default'})
```
```
withDefaults
```
```
// The default is applied during destructuring, not type inferenceconst { prop = 'default' } = defineProps<{ prop?: string }>()
```
```
// The default is applied during destructuring, not type inferenceconst { prop = 'default' } = defineProps<{ prop?: string }>()
```
```
// vite.config.jsexport default {  plugins: [    vue({      script: {        propsDestructure: true      }    })  ]}
```
```
// vite.config.jsexport default {  plugins: [    vue({      script: {        propsDestructure: true      }    })  ]}
```
Elevate your Vue 3 development workflow with this specialized AI Agent Skill. Designed to instill robust best practices, it guides developers in writing clean, type-safe Vue components, particularly when integrating TypeScript, vue-tsc, and Volar. This skill acts as an intelligent assistant, ensuring your projects adhere to modern Vue standards, preventing common pitfalls related to reactivity, component composition, and template type checking. Leverage its expertise to build more maintainable, scalable, and error-resistant Vue.js applications, fostering a consistent codebase across your team.

# When to Use This Skill
- •When writing new Vue 3 components, ensuring correct TypeScript typing for props, events, and slots.
- •Reviewing existing Vue component code to identify areas for improved type safety and adherence to best practices.
- •Refactoring legacy Vue components or migrating to new features like `defineModel` while maintaining type integrity.
- •Troubleshooting complex template type checking errors or Volar configuration issues in Vue projects.

# Pro Tips
- 💡Always apply this skill during the initial component scaffolding phase to embed correct typing patterns from the outset, reducing future refactoring.
- 💡Utilize the `extract-component-props` rule when creating wrapper components to ensure accurate type inheritance and avoid manual prop re-declaration.
- 💡Regularly run a codebase-wide check with this skill after major library updates (e.g., Vue, Volar, TypeScript) to catch potential breaking changes or new best practice recommendations.

