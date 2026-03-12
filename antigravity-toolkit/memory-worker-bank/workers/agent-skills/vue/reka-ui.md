# reka-ui
Source: https://antigravity.codes/agent-skills/vue/reka-ui

## AI Worker Instructions
When the user requests functionality related to reka-ui, follow these guidelines and utilize this context.

## Scraped Content

# reka-ui
```
vue
```
```
asChild
```
```
v-model
```
```
default*
```
```
forceMount
```
```
// nuxt.config.ts (auto-imports all components)export default defineNuxtConfig({  modules: ['reka-ui/nuxt']})
```
```
// nuxt.config.ts (auto-imports all components)export default defineNuxtConfig({  modules: ['reka-ui/nuxt']})
```
```
import { RekaResolver } from 'reka-ui/resolver'// vite.config.ts (with auto-import resolver)import Components from 'unplugin-vue-components/vite'export default defineConfig({  plugins: [    vue(),    Components({ resolvers: [RekaResolver()] })  ]})
```
```
import { RekaResolver } from 'reka-ui/resolver'// vite.config.ts (with auto-import resolver)import Components from 'unplugin-vue-components/vite'export default defineConfig({  plugins: [    vue(),    Components({ resolvers: [RekaResolver()] })  ]})
```
```
<!-- Dialog with controlled state --><script setup>import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'reka-ui'const open = ref(false)</script><template>  <DialogRoot v-model:open="open">    <DialogTrigger>Open</DialogTrigger>    <DialogPortal>      <DialogOverlay class="fixed inset-0 bg-black/50" />      <DialogContent class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded">        <DialogTitle>Title</DialogTitle>        <DialogDescription>Description</DialogDescription>        <DialogClose>Close</DialogClose>      </DialogContent>    </DialogPortal>  </DialogRoot></template>
```
```
<!-- Dialog with controlled state --><script setup>import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'reka-ui'const open = ref(false)</script><template>  <DialogRoot v-model:open="open">    <DialogTrigger>Open</DialogTrigger>    <DialogPortal>      <DialogOverlay class="fixed inset-0 bg-black/50" />      <DialogContent class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded">        <DialogTitle>Title</DialogTitle>        <DialogDescription>Description</DialogDescription>        <DialogClose>Close</DialogClose>      </DialogContent>    </DialogPortal>  </DialogRoot></template>
```
```
<!-- Select with uncontrolled default --><SelectRoot default-value="apple">  <SelectTrigger>    <SelectValue placeholder="Pick fruit" />  </SelectTrigger>  <SelectPortal>    <SelectContent>      <SelectViewport>        <SelectItem value="apple"><SelectItemText>Apple</SelectItemText></SelectItem>        <SelectItem value="banana"><SelectItemText>Banana</SelectItemText></SelectItem>      </SelectViewport>    </SelectContent>  </SelectPortal></SelectRoot>
```
```
<!-- Select with uncontrolled default --><SelectRoot default-value="apple">  <SelectTrigger>    <SelectValue placeholder="Pick fruit" />  </SelectTrigger>  <SelectPortal>    <SelectContent>      <SelectViewport>        <SelectItem value="apple"><SelectItemText>Apple</SelectItemText></SelectItem>        <SelectItem value="banana"><SelectItemText>Banana</SelectItemText></SelectItem>      </SelectViewport>    </SelectContent>  </SelectPortal></SelectRoot>
```
```
<!-- asChild for custom trigger element --><DialogTrigger as-child>  <button class="my-custom-button">Open</button></DialogTrigger>
```
```
<!-- asChild for custom trigger element --><DialogTrigger as-child>  <button class="my-custom-button">Open</button></DialogTrigger>
```
```
useLocale
```
```
useDirection
```
```
disableOutsidePointerEvents
```
```
disableSwipe
```
```
closeOnSelect
```
```
pressOpenDelay
```
```
estimateSize
```
This specialized agent skill empowers developers building robust and accessible user interfaces with Reka UI. Leverage its deep understanding of headless Vue 3 component primitives, WAI-ARIA compliance, and composition patterns to accelerate your development workflow. Whether you're crafting custom component libraries, integrating with frameworks like Nuxt UI, or ensuring top-tier accessibility, this skill provides precise, context-aware guidance. It streamlines complex UI challenges, offering expert insights into state management, virtualization, and styling integrations, ultimately helping you deliver high-quality, maintainable front-end solutions with greater efficiency.

# When to Use This Skill
- •Building completely unstyled, accessible custom component libraries from scratch.
- •Integrating WAI-ARIA compliant components within existing Vue 3 or Nuxt 3 projects.
- •Developing complex UI features like accessible forms, dialogs, menus, or popovers using headless primitives.
- •Extending or working with libraries built on Reka UI such as Nuxt UI or shadcn-vue.

# Pro Tips
- 💡Always consult the `references/components.md` for a quick overview of available primitives before diving into specific component guides.
- 💡Pay close attention to the `asChild` prop for seamless composition and prop forwarding when nesting Reka UI components with your custom elements.
- 💡For advanced scenarios, thoroughly review the 'Controlled State' and 'Virtualization' guides to optimize performance and state management in complex UIs.

