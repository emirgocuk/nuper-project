# tailwind-v4-shadcn
Source: https://antigravity.codes/agent-skills/ui-design/tailwind-v4-shadcn

## AI Worker Instructions
When the user requests functionality related to tailwind-v4-shadcn, follow these guidelines and utilize this context.

## Scraped Content

# tailwind-v4-shadcn
```
# 1. Install dependenciespnpm add tailwindcss @tailwindcss/vitepnpm add -D @types/node tw-animate-csspnpm dlx shadcn@latest init# 2. Delete v3 config if existsrm tailwind.config.ts  # v4 doesn't use this file
```
```
# 1. Install dependenciespnpm add tailwindcss @tailwindcss/vitepnpm add -D @types/node tw-animate-csspnpm dlx shadcn@latest init# 2. Delete v3 config if existsrm tailwind.config.ts  # v4 doesn't use this file
```
```
import { defineConfig } from 'vite'import react from '@vitejs/plugin-react'import tailwindcss from '@tailwindcss/vite'import path from 'path'export default defineConfig({  plugins: [react(), tailwindcss()],  resolve: { alias: { '@': path.resolve(__dirname, './src') } }})
```
```
import { defineConfig } from 'vite'import react from '@vitejs/plugin-react'import tailwindcss from '@tailwindcss/vite'import path from 'path'export default defineConfig({  plugins: [react(), tailwindcss()],  resolve: { alias: { '@': path.resolve(__dirname, './src') } }})
```
```
{  "tailwind": {    "config": "",              // ← Empty for v4    "css": "src/index.css",    "baseColor": "slate",    "cssVariables": true  }}
```
```
{  "tailwind": {    "config": "",              // ← Empty for v4    "css": "src/index.css",    "baseColor": "slate",    "cssVariables": true  }}
```
```
/* src/index.css */@import "tailwindcss";@import "tw-animate-css";  /* Required for shadcn/ui animations */:root {  --background: hsl(0 0% 100%);      /* ← hsl() wrapper required */  --foreground: hsl(222.2 84% 4.9%);  --primary: hsl(221.2 83.2% 53.3%);  /* ... all light mode colors */}.dark {  --background: hsl(222.2 84% 4.9%);  --foreground: hsl(210 40% 98%);  --primary: hsl(217.2 91.2% 59.8%);  /* ... all dark mode colors */}
```
```
/* src/index.css */@import "tailwindcss";@import "tw-animate-css";  /* Required for shadcn/ui animations */:root {  --background: hsl(0 0% 100%);      /* ← hsl() wrapper required */  --foreground: hsl(222.2 84% 4.9%);  --primary: hsl(221.2 83.2% 53.3%);  /* ... all light mode colors */}.dark {  --background: hsl(222.2 84% 4.9%);  --foreground: hsl(210 40% 98%);  --primary: hsl(217.2 91.2% 59.8%);  /* ... all dark mode colors */}
```
```
@layer base
```
```
hsl()
```
```
@theme inline {  --color-background: var(--background);  --color-foreground: var(--foreground);  --color-primary: var(--primary);  /* ... map ALL CSS variables */}
```
```
@theme inline {  --color-background: var(--background);  --color-foreground: var(--foreground);  --color-primary: var(--primary);  /* ... map ALL CSS variables */}
```
```
bg-background
```
```
text-primary
```
```
@layer base {  body {    background-color: var(--background);  /* NO hsl() wrapper here */    color: var(--foreground);  }}
```
```
@layer base {  body {    background-color: var(--background);  /* NO hsl() wrapper here */    color: var(--foreground);  }}
```
```
hsl(var(--background))
```
```
<div className="bg-background text-foreground">  {/* No dark: variants needed - theme switches automatically */}</div>
```
```
<div className="bg-background text-foreground">  {/* No dark: variants needed - theme switches automatically */}</div>
```
```
templates/theme-provider.tsx
```
```
// src/main.tsximport { ThemeProvider } from '@/components/theme-provider'ReactDOM.createRoot(document.getElementById('root')!).render(  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">    <App />  </ThemeProvider>)
```
```
// src/main.tsximport { ThemeProvider } from '@/components/theme-provider'ReactDOM.createRoot(document.getElementById('root')!).render(  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">    <App />  </ThemeProvider>)
```
```
pnpm dlx shadcn@latest add dropdown-menu
```
```
pnpm dlx shadcn@latest add dropdown-menu
```
```
reference/dark-mode.md
```
```
hsl()
```
```
:root
```
```
.dark
```
```
--bg: hsl(0 0% 100%);
```
```
@theme inline
```
```
"tailwind.config": ""
```
```
tailwind.config.ts
```
```
@tailwindcss/vite
```
```
:root
```
```
.dark
```
```
@layer base
```
```
.dark { @theme { } }
```
```
hsl(var(--background))
```
```
tailwind.config.ts
```
```
@apply
```
```
dark:
```
```
@apply
```
```
@layer base
```
```
@layer components
```
```
@utility
```
```
@layer base
```
```
tailwindcss-animate
```
```
# ✅ DOpnpm add -D tw-animate-css# Add to src/index.css:@import "tailwindcss";@import "tw-animate-css";# ❌ DON'Tnpm install tailwindcss-animate  # v3 only
```
```
# ✅ DOpnpm add -D tw-animate-css# Add to src/index.css:@import "tailwindcss";@import "tw-animate-css";# ❌ DON'Tnpm install tailwindcss-animate  # v3 only
```
```
bg-primary
```
```
@theme inline
```
```
@theme inline {  --color-background: var(--background);  --color-foreground: var(--foreground);  --color-primary: var(--primary);  /* ... map ALL CSS variables */}
```
```
@theme inline {  --color-background: var(--background);  --color-foreground: var(--foreground);  --color-primary: var(--primary);  /* ... map ALL CSS variables */}
```
```
templates/theme-provider.tsx
```
```
main.tsx
```
```
.dark
```
```
<html>
```
```
@layer base
```
```
/* ✅ Correct - single @layer base */@import "tailwindcss";:root { --background: hsl(0 0% 100%); }@theme inline { --color-background: var(--background); }@layer base { body { background-color: var(--background); } }
```
```
/* ✅ Correct - single @layer base */@import "tailwindcss";:root { --background: hsl(0 0% 100%); }@theme inline { --color-background: var(--background); }@layer base { body { background-color: var(--background); } }
```
```
tailwind.config.ts
```
```
rm tailwind.config.ts
```
```
rm tailwind.config.ts
```
```
src/index.css
```
```
@theme
```
```
@theme inline
```
```
data-mode="dark"
```
```
@theme inline
```
```
@theme inline
```
```
bg-primary
```
```
background-color: oklch(...)
```
```
@theme
```
```
/* ✅ CORRECT - Use @theme without inline */@custom-variant dark (&:where([data-mode=dark], [data-mode=dark] *));@theme {  --color-text-primary: var(--color-slate-900);  --color-bg-primary: var(--color-white);}@layer theme {  [data-mode="dark"] {    --color-text-primary: var(--color-white);    --color-bg-primary: var(--color-slate-900);  }}
```
```
/* ✅ CORRECT - Use @theme without inline */@custom-variant dark (&:where([data-mode=dark], [data-mode=dark] *));@theme {  --color-text-primary: var(--color-slate-900);  --color-bg-primary: var(--color-white);}@layer theme {  [data-mode="dark"] {    --color-text-primary: var(--color-white);    --color-bg-primary: var(--color-slate-900);  }}
```
```
Cannot apply unknown utility class: custom-button
```
```
@layer base
```
```
@layer components
```
```
@apply
```
```
@layer
```
```
@utility
```
```
@apply
```
```
/* ❌ v3 pattern (worked) */@layer components {  .custom-button {    @apply px-4 py-2 bg-blue-500;  }}/* ✅ v4 pattern (required) */@utility custom-button {  @apply px-4 py-2 bg-blue-500;}/* OR use native CSS */@layer base {  .custom-button {    padding: 1rem 0.5rem;    background-color: theme(colors.blue.500);  }}
```
```
/* ❌ v3 pattern (worked) */@layer components {  .custom-button {    @apply px-4 py-2 bg-blue-500;  }}/* ✅ v4 pattern (required) */@utility custom-button {  @apply px-4 py-2 bg-blue-500;}/* OR use native CSS */@layer base {  .custom-button {    padding: 1rem 0.5rem;    background-color: theme(colors.blue.500);  }}
```
```
@apply
```
```
@layer base
```
```
@layer base/components/utilities
```
```
@import "tailwindcss/theme.css" layer(theme);@import "tailwindcss/base.css" layer(base);@import "tailwindcss/components.css" layer(components);@import "tailwindcss/utilities.css" layer(utilities);@layer base {  body {    background-color: var(--background);  }}
```
```
@import "tailwindcss/theme.css" layer(theme);@import "tailwindcss/base.css" layer(base);@import "tailwindcss/components.css" layer(components);@import "tailwindcss/utilities.css" layer(utilities);@layer base {  body {    background-color: var(--background);  }}
```
```
@layer base
```
```
@import "tailwindcss";:root {  --background: hsl(0 0% 100%);}body {  background-color: var(--background); /* No @layer needed */}
```
```
@import "tailwindcss";:root {  --background: hsl(0 0% 100%);}body {  background-color: var(--background); /* No @layer needed */}
```
```
@layer base
```
```
bg-primary
```
```
@theme inline
```
```
@theme inline
```
```
hsl()
```
```
var(--color)
```
```
hsl(var(--color))
```
```
<ThemeProvider>
```
```
tailwind.config.ts
```
```
tailwindcss-animate
```
```
tw-animate-css
```
```
.bg-blue-500 {  background-color: #3b82f6; /* sRGB fallback */  background-color: oklch(0.6 0.24 264); /* Modern browsers */}
```
```
.bg-blue-500 {  background-color: #3b82f6; /* sRGB fallback */  background-color: oklch(0.6 0.24 264); /* Modern browsers */}
```
```
@theme {  /* Modern approach (preferred) */  --color-brand: oklch(0.7 0.15 250);  /* Legacy approach (still works) */  --color-brand: hsl(240 80% 60%);}
```
```
@theme {  /* Modern approach (preferred) */  --color-brand: oklch(0.7 0.15 250);  /* Legacy approach (still works) */  --color-brand: hsl(240 80% 60%);}
```
```
<div className="@container">  <div className="@md:text-lg @lg:grid-cols-2">    Content responds to container width, not viewport  </div></div>
```
```
<div className="@container">  <div className="@md:text-lg @lg:grid-cols-2">    Content responds to container width, not viewport  </div></div>
```
```
<p className="line-clamp-3">Truncate to 3 lines with ellipsis...</p><p className="line-clamp-[8]">Arbitrary values supported</p><p className="line-clamp-(--teaser-lines)">CSS variable support</p>
```
```
<p className="line-clamp-3">Truncate to 3 lines with ellipsis...</p><p className="line-clamp-[8]">Arbitrary values supported</p><p className="line-clamp-(--teaser-lines)">CSS variable support</p>
```
```
@tailwindcss/container-queries
```
```
@tailwindcss/line-clamp
```
```
@plugin
```
```
require()
```
```
@import
```
```
pnpm add -D @tailwindcss/typography
```
```
pnpm add -D @tailwindcss/typography
```
```
@import "tailwindcss";@plugin "@tailwindcss/typography";
```
```
@import "tailwindcss";@plugin "@tailwindcss/typography";
```
```
<article class="prose dark:prose-invert">{{ content }}</article>
```
```
<article class="prose dark:prose-invert">{{ content }}</article>
```
```
pnpm add -D @tailwindcss/forms
```
```
pnpm add -D @tailwindcss/forms
```
```
@import "tailwindcss";@plugin "@tailwindcss/forms";
```
```
@import "tailwindcss";@plugin "@tailwindcss/forms";
```
```
<div className="@container">  <div className="@md:text-lg">Responds to container width</div></div>
```
```
<div className="@container">  <div className="@md:text-lg">Responds to container width</div></div>
```
```
/* ❌ WRONG - v3 syntax */@import "@tailwindcss/typography";/* ✅ CORRECT - v4 syntax */@plugin "@tailwindcss/typography";
```
```
/* ❌ WRONG - v3 syntax */@import "@tailwindcss/typography";/* ✅ CORRECT - v4 syntax */@plugin "@tailwindcss/typography";
```
```
@tailwindcss/vite
```
```
vite.config.ts
```
```
tailwindcss()
```
```
components.json
```
```
"config": ""
```
```
tailwind.config.ts
```
```
src/index.css
```
```
:root
```
```
.dark
```
```
hsl()
```
```
@theme inline
```
```
@layer base
```
```
templates/
```
```
cn()
```
```
reference/migration-guide.md
```
```
tailwind.config.ts
```
```
@theme inline
```
```
@tailwindcss/line-clamp
```
```
line-clamp-*
```
```
tailwindcss-animate
```
```
tw-animate-css
```
```
require()
```
```
@plugin
```
```
@tailwindcss/upgrade
```
```
<h1>
```
```
<h6>
```
```
pnpm add -D @tailwindcss/typography
```
```
pnpm add -D @tailwindcss/typography
```
```
@import "tailwindcss";@plugin "@tailwindcss/typography";
```
```
@import "tailwindcss";@plugin "@tailwindcss/typography";
```
```
<article className="prose dark:prose-invert">  {/* All elements styled automatically */}</article>
```
```
<article className="prose dark:prose-invert">  {/* All elements styled automatically */}</article>
```
```
@layer base {  h1 { @apply text-4xl font-bold mb-4; }  h2 { @apply text-3xl font-bold mb-3; }  h3 { @apply text-2xl font-bold mb-2; }  ul { @apply list-disc pl-6 mb-4; }  ol { @apply list-decimal pl-6 mb-4; }}
```
```
@layer base {  h1 { @apply text-4xl font-bold mb-4; }  h2 { @apply text-3xl font-bold mb-3; }  h3 { @apply text-2xl font-bold mb-2; }  ul { @apply list-disc pl-6 mb-4; }  ol { @apply list-decimal pl-6 mb-4; }}
```
```
@tailwindcss/vite
```
```
// ✅ Vite Plugin - One line, no PostCSS configimport tailwindcss from '@tailwindcss/vite'export default defineConfig({  plugins: [react(), tailwindcss()],})// ❌ PostCSS - Multiple steps, plugin compatibility issues// 1. Install @tailwindcss/postcss// 2. Configure postcss.config.js// 3. Manage plugin order// 4. Debug plugin conflicts
```
```
// ✅ Vite Plugin - One line, no PostCSS configimport tailwindcss from '@tailwindcss/vite'export default defineConfig({  plugins: [react(), tailwindcss()],})// ❌ PostCSS - Multiple steps, plugin compatibility issues// 1. Install @tailwindcss/postcss// 2. Configure postcss.config.js// 3. Manage plugin order// 4. Debug plugin conflicts
```
```
postcss-import
```
```
postcss-advanced-variables
```
```
tailwindcss/nesting
```
```
@tailwindcss/postcss
```
```
ring
```
```
ring-3
```
```
// v3: 3px ring<button className="ring">Button</button>// v4: 1px ring (thinner)<button className="ring">Button</button>// Match v3 appearance<button className="ring-3">Button</button>
```
```
// v3: 3px ring<button className="ring">Button</button>// v4: 1px ring (thinner)<button className="ring">Button</button>// Match v3 appearance<button className="ring-3">Button</button>
```
```
tailwind.config.ts
```
```
@theme
```
```
@tailwindcss/vite
```
```
components.json
```
```
"config": ""
```
```
/* ❌ v3 (Claude may suggest this) */@tailwind base;@tailwind components;@tailwind utilities;/* ✅ v4 (use this) */@import "tailwindcss";
```
```
/* ❌ v3 (Claude may suggest this) */@tailwind base;@tailwind components;@tailwind utilities;/* ✅ v4 (use this) */@import "tailwindcss";
```
```
/* ❌ v3 - tailwind.config.ts */theme: { colors: { primary: '#3b82f6' } }/* ✅ v4 - in CSS file */@theme inline {  --color-primary: var(--primary);  --color-background: var(--background);}
```
```
/* ❌ v3 - tailwind.config.ts */theme: { colors: { primary: '#3b82f6' } }/* ✅ v4 - in CSS file */@theme inline {  --color-primary: var(--primary);  --color-background: var(--background);}
```
```
# ❌ v3 package (deprecated for v4)pnpm add tailwindcss-animate# ✅ v4 packagepnpm add -D tw-animate-css
```
```
# ❌ v3 package (deprecated for v4)pnpm add tailwindcss-animate# ✅ v4 packagepnpm add -D tw-animate-css
```
```
/* ✅ v4 import */@import "tailwindcss";@import "tw-animate-css";
```
```
/* ✅ v4 import */@import "tailwindcss";@import "tw-animate-css";
```
```
/* ❌ v3 - require() in config */plugins: [require('@tailwindcss/typography')]/* ✅ v4 - @plugin directive in CSS */@plugin "@tailwindcss/typography";
```
```
/* ❌ v3 - require() in config */plugins: [require('@tailwindcss/typography')]/* ✅ v4 - @plugin directive in CSS */@plugin "@tailwindcss/typography";
```
```
/* ❌ Deprecated in v4 */.btn { @apply px-4 py-2 bg-primary; }/* ✅ Use direct classes or CSS */.btn { padding: 0.5rem 1rem; background-color: var(--primary); }
```
```
/* ❌ Deprecated in v4 */.btn { @apply px-4 py-2 bg-primary; }/* ✅ Use direct classes or CSS */.btn { padding: 0.5rem 1rem; background-color: var(--primary); }
```
```
/* 1. Define at root (NOT inside @layer base) */:root {  --background: hsl(0 0% 100%);  /* hsl() wrapper required */  --primary: hsl(221.2 83.2% 53.3%);}.dark {  --background: hsl(222.2 84% 4.9%);  --primary: hsl(217.2 91.2% 59.8%);}/* 2. Map to Tailwind utilities */@theme inline {  --color-background: var(--background);  --color-primary: var(--primary);}/* 3. Apply base styles (NO hsl wrapper here) */@layer base {  body {    background-color: var(--background);    color: var(--foreground);  }}
```
```
/* 1. Define at root (NOT inside @layer base) */:root {  --background: hsl(0 0% 100%);  /* hsl() wrapper required */  --primary: hsl(221.2 83.2% 53.3%);}.dark {  --background: hsl(222.2 84% 4.9%);  --primary: hsl(217.2 91.2% 59.8%);}/* 2. Map to Tailwind utilities */@theme inline {  --color-background: var(--background);  --color-primary: var(--primary);}/* 3. Apply base styles (NO hsl wrapper here) */@layer base {  body {    background-color: var(--background);    color: var(--foreground);  }}
```
```
dark:
```
```
bg-background
```
```
text-foreground
```
```
.dark
```
```
<html>
```
```
@tailwind base
```
```
@import "tailwindcss"
```
```
tailwind.config.ts
```
```
@theme inline
```
```
tailwindcss-animate
```
```
tw-animate-css
```
```
require('@plugin')
```
```
@plugin "@plugin"
```
```
@apply
```
```
hsl(var(--color))
```
```
var(--color)
```
For developers aiming to leverage the latest in modern UI frameworks, this skill provides a streamlined, production-tested approach to integrating Tailwind CSS v4 with shadcn/ui. It distills complex setup into an actionable, step-by-step guide, ensuring your project benefits from a highly performant and aesthetically pleasing design system. This skill is invaluable for quickly bootstrapping new projects or upgrading existing ones to the cutting-edge of frontend development, focusing on efficiency and best practices.

# When to Use This Skill
- •Setting up a new React project with Tailwind CSS v4 and shadcn/ui.
- •Migrating an existing project to Tailwind CSS v4 for performance improvements.
- •Ensuring a consistent and production-ready UI component library in a web application.
- •Rapidly prototyping UIs with pre-built, customizable components from shadcn/ui.

# Pro Tips
- 💡Always follow the "Four-Step Architecture" precisely to avoid theme breakage and ensure correct variable application.
- 💡Regularly check `shadcn@latest` documentation for updates, as `components.json` configurations can evolve.
- 💡Utilize the `@` alias in `vite.config.ts` for cleaner imports, especially with shadcn/ui components.

