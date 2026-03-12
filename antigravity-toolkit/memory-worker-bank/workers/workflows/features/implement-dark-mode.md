# Implement Dark Mode
Source: https://antigravity.codes/workflows/features/implement-dark-mode-next-themes-tailwind

## AI Worker Instructions
When the user requests functionality related to Implement Dark Mode, follow these guidelines and utilize this context.

## Scraped Content

# Implement Dark Mode
```
npm install next-themes
```
```
app/layout.tsx
```
```
import { ThemeProvider } from 'next-themes';      export default function RootLayout({ children }: { children: React.ReactNode }) {     return (       <html lang="en" suppressHydrationWarning>         <body>           <ThemeProvider attribute="class" defaultTheme="system" enableSystem>             {children}           </ThemeProvider>         </body>       </html>     );   }
```
```
import { ThemeProvider } from 'next-themes';      export default function RootLayout({ children }: { children: React.ReactNode }) {     return (       <html lang="en" suppressHydrationWarning>         <body>           <ThemeProvider attribute="class" defaultTheme="system" enableSystem>             {children}           </ThemeProvider>         </body>       </html>     );   }
```
```
darkMode: 'class'
```
```
tailwind.config.ts
```
```
export default {     darkMode: 'class',     // ... rest of config   }
```
```
export default {     darkMode: 'class',     // ... rest of config   }
```
```
'use client'   import { useTheme } from 'next-themes';   import { useEffect, useState } from 'react';      export function ThemeToggle() {     const [mounted, setMounted] = useState(false);     const { theme, setTheme } = useTheme();          useEffect(() => setMounted(true), []);     if (!mounted) return null;          return (       <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>         {theme === 'dark' ? '🌞' : '🌙'}       </button>     );   }
```
```
'use client'   import { useTheme } from 'next-themes';   import { useEffect, useState } from 'react';      export function ThemeToggle() {     const [mounted, setMounted] = useState(false);     const { theme, setTheme } = useTheme();          useEffect(() => setMounted(true), []);     if (!mounted) return null;          return (       <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>         {theme === 'dark' ? '🌞' : '🌙'}       </button>     );   }
```
```
suppressHydrationWarning
```
```
<html>
```
```
useEffect
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as implement-dark-mode-next-themes-tailwind.md
```
implement-dark-mode-next-themes-tailwind.md
```
- In Antigravity, type /implement_dark_mode_next_themes_tailwind or just describe what you want to do
```
/implement_dark_mode_next_themes_tailwind
```
Learn more about workflows →

# Related Workflows

# Scaffold New Component

# Setup Internationalization (i18n)

# Handle File Uploads (S3)

