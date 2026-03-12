# nuxt-modules
Source: https://antigravity.codes/agent-skills/nuxt/nuxt-modules

## AI Worker Instructions
When the user requests functionality related to nuxt-modules, follow these guidelines and utilize this context.

## Scraped Content

# nuxt-modules
```
nuxt
```
```
vue
```
```
npx nuxi init -t module my-modulecd my-module && npm installnpm run dev        # Start playgroundnpm run dev:build  # Build in watch modenpm run test       # Run tests
```
```
npx nuxi init -t module my-modulecd my-module && npm installnpm run dev        # Start playgroundnpm run dev:build  # Build in watch modenpm run test       # Run tests
```
```
@nuxtjs/
```
```
nuxt-
```
```
modules/
```
```
nuxt.config.ts
```
```
my-module/├── src/│   ├── module.ts           # Entry point│   └── runtime/            # Injected into user's app│       ├── components/│       ├── composables/│       ├── plugins/│       └── server/├── playground/             # Dev testing└── test/fixtures/          # E2E tests
```
```
my-module/├── src/│   ├── module.ts           # Entry point│   └── runtime/            # Injected into user's app│       ├── components/│       ├── composables/│       ├── plugins/│       └── server/├── playground/             # Dev testing└── test/fixtures/          # E2E tests
```
This specialized skill empowers AI agents to expertly guide developers through the intricate world of Nuxt module creation. Designed for extending Nuxt.js beyond its core capabilities, it covers everything from initial setup and API integration to robust testing and seamless deployment. Whether you're building reusable components, custom server routes, or complex plugins, this skill ensures best practices are followed. It bridges the gap between conceptual module design and practical implementation, enabling efficient and scalable Nuxt ecosystems for both published and private projects. Harness its knowledge to streamline your development workflow and elevate your Nuxt applications.

# When to Use This Skill
- •Developing a new Nuxt module to abstract common functionality across multiple projects.
- •Integrating custom runtime extensions like components, composables, or plugins into a Nuxt application.
- •Setting up robust CI/CD pipelines for automated testing and publishing of a Nuxt module to npm.
- •Creating server-side extensions such as API routes or middleware within a Nuxt module structure.

# Pro Tips
- 💡Always leverage `defineNuxtModule` and Nuxt Kit utilities for consistent API and future-proof compatibility.
- 💡Implement comprehensive E2E tests for your modules to ensure stability across different Nuxt versions and configurations, especially when extending core features.
- 💡Consider integrating with Nuxt DevTools to provide better debugging capabilities and enhance the developer experience for users of your module.

