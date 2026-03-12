# nuxt-ui
Source: https://antigravity.codes/agent-skills/nuxt/nuxt-ui

## AI Worker Instructions
When the user requests functionality related to nuxt-ui, follow these guidelines and utilize this context.

## Scraped Content

# nuxt-ui
```
vue
```
```
nuxt
```
```
// nuxt.config.tsexport default defineNuxtConfig({  modules: ['@nuxt/ui'],  css: ['~/assets/css/main.css']})
```
```
// nuxt.config.tsexport default defineNuxtConfig({  modules: ['@nuxt/ui'],  css: ['~/assets/css/main.css']})
```
```
/* assets/css/main.css */@import 'tailwindcss';@import '@nuxt/ui';
```
```
/* assets/css/main.css */@import 'tailwindcss';@import '@nuxt/ui';
```
```
<!-- app.vue - UApp wrapper required --><template>  <UApp>    <NuxtPage />  </UApp></template>
```
```
<!-- app.vue - UApp wrapper required --><template>  <UApp>    <NuxtPage />  </UApp></template>
```
Unlock the full potential of `@nuxt/ui` v4 with this dedicated Agent Skill, designed to streamline your UI development process in Nuxt 4+ applications. Leveraging the power of Reka UI headless primitives, Tailwind CSS v4, and Tailwind Variants, this skill provides comprehensive guidance for building elegant and highly customizable user interfaces. From initial setup and advanced theming to form validation and interactive overlays like Modals and Toasts, it empowers developers to create polished, production-ready UIs with remarkable efficiency. Accelerate your front-end workflow and deliver exceptional user experiences by harnessing this expert knowledge base.

# When to Use This Skill
- •Rapidly prototyping a Nuxt 4 application requiring pre-built, styled UI components.
- •Implementing complex forms with integrated validation and user feedback using `@nuxt/ui`'s capabilities.
- •Customizing the visual theme of your Nuxt project with semantic colors and Tailwind Variants.
- •Integrating interactive overlays such as Modals, Toasts, or Command Palettes into your application.

# Pro Tips
- 💡Utilize `app.config.ts` for deep theme customization to maintain a clean separation from component logic and enable dynamic theme switching.
- 💡Combine `@nuxt/ui` with the `vue` skill to understand underlying component patterns when extending or creating custom components that align with `nuxt-ui`'s design system.
- 💡Leverage the provided composables like `useToast` or `useOverlay` to manage UI state efficiently and ensure a consistent, reactive user experience.

