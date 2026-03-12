# nuxt-content
Source: https://antigravity.codes/agent-skills/nuxt/nuxt-content

## AI Worker Instructions
When the user requests functionality related to nuxt-content, follow these guidelines and utilize this context.

## Scraped Content

# nuxt-content
```
content.config.ts
```
```
defineCollection
```
```
defineCollectionSource
```
```
queryCollection
```
```
<ContentRenderer>
```
```
content:file:beforeParse
```
```
content:file:afterParse
```
```
nuxt-llms
```
```
document-writer
```
```
nuxt
```
```
nuxthub
```
```
content.config.ts
```
```
queryCollection()
```
```
<ContentRenderer>
```
```
page
```
```
data
```
```
source.repository
```
```
defineCollectionSource
```
```
project/├── content/                    # Content files│   ├── blog/                   # Maps to 'blog' collection│   └── .navigation.yml         # Navigation metadata├── components/content/         # MDC components└── content.config.ts           # Collection definitions
```
```
project/├── content/                    # Content files│   ├── blog/                   # Maps to 'blog' collection│   └── .navigation.yml         # Navigation metadata├── components/content/         # MDC components└── content.config.ts           # Collection definitions
```
This specialized AI agent skill empowers developers to efficiently navigate the complexities of Nuxt Content v3. Designed for building dynamic, content-rich applications, it provides expert assistance across the entire content lifecycle. From structuring diverse data sources with collections and schemas to performing advanced queries and rendering engaging Markdown-based content, this skill streamlines development. It also offers insights into database integrations, internationalization strategies, and leveraging LLMs, ensuring a comprehensive and productive coding experience for Nuxt developers.

# When to Use This Skill
- •Defining and managing content collections, schemas, and remote sources using `defineCollection` and `content.config.ts`.
- •Efficiently querying content for navigation, search, and related articles through the `queryCollection` API.
- •Rendering rich, interactive content with `<ContentRenderer>`, utilizing MDC syntax and prose components.
- •Configuring and integrating various database solutions like SQLite, PostgreSQL, and D1 for content storage.
- •Implementing internationalization (i18n) patterns for multi-language content and integrating with NuxtStudio.

# Pro Tips
- 💡Always define clear schemas for your content collections using Zod within `defineCollection` to ensure data integrity and leverage full TypeScript type inference.
- 💡For complex queries, chain multiple `queryCollection` methods like `.where()`, `.sort()`, and `.limit()` for precise content retrieval, optimizing performance by only fetching necessary data.
- 💡Integrate `nuxt-llms` with your content workflow to dynamically generate content, summaries, or translations, significantly speeding up content creation and localization efforts.

