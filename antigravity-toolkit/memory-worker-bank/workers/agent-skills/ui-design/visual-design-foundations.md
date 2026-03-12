# visual-design-foundations
Source: https://antigravity.codes/agent-skills/ui-design/visual-design-foundations

## AI Worker Instructions
When the user requests functionality related to visual-design-foundations, follow these guidelines and utilize this context.

## Scraped Content

# visual-design-foundations
```
:root {  --font-size-xs: 0.75rem; /* 12px */  --font-size-sm: 0.875rem; /* 14px */  --font-size-base: 1rem; /* 16px */  --font-size-lg: 1.125rem; /* 18px */  --font-size-xl: 1.25rem; /* 20px */  --font-size-2xl: 1.5rem; /* 24px */  --font-size-3xl: 1.875rem; /* 30px */  --font-size-4xl: 2.25rem; /* 36px */  --font-size-5xl: 3rem; /* 48px */}
```
```
:root {  --font-size-xs: 0.75rem; /* 12px */  --font-size-sm: 0.875rem; /* 14px */  --font-size-base: 1rem; /* 16px */  --font-size-lg: 1.125rem; /* 18px */  --font-size-xl: 1.25rem; /* 20px */  --font-size-2xl: 1.5rem; /* 24px */  --font-size-3xl: 1.875rem; /* 30px */  --font-size-4xl: 2.25rem; /* 36px */  --font-size-5xl: 3rem; /* 48px */}
```
```
:root {  --space-1: 0.25rem; /* 4px */  --space-2: 0.5rem; /* 8px */  --space-3: 0.75rem; /* 12px */  --space-4: 1rem; /* 16px */  --space-5: 1.25rem; /* 20px */  --space-6: 1.5rem; /* 24px */  --space-8: 2rem; /* 32px */  --space-10: 2.5rem; /* 40px */  --space-12: 3rem; /* 48px */  --space-16: 4rem; /* 64px */}
```
```
:root {  --space-1: 0.25rem; /* 4px */  --space-2: 0.5rem; /* 8px */  --space-3: 0.75rem; /* 12px */  --space-4: 1rem; /* 16px */  --space-5: 1.25rem; /* 20px */  --space-6: 1.5rem; /* 24px */  --space-8: 2rem; /* 32px */  --space-10: 2.5rem; /* 40px */  --space-12: 3rem; /* 48px */  --space-16: 4rem; /* 64px */}
```
```
:root {  /* Brand */  --color-primary: #2563eb;  --color-primary-hover: #1d4ed8;  --color-primary-active: #1e40af;  /* Semantic */  --color-success: #16a34a;  --color-warning: #ca8a04;  --color-error: #dc2626;  --color-info: #0891b2;  /* Neutral */  --color-gray-50: #f9fafb;  --color-gray-100: #f3f4f6;  --color-gray-200: #e5e7eb;  --color-gray-300: #d1d5db;  --color-gray-400: #9ca3af;  --color-gray-500: #6b7280;  --color-gray-600: #4b5563;  --color-gray-700: #374151;  --color-gray-800: #1f2937;  --color-gray-900: #111827;}
```
```
:root {  /* Brand */  --color-primary: #2563eb;  --color-primary-hover: #1d4ed8;  --color-primary-active: #1e40af;  /* Semantic */  --color-success: #16a34a;  --color-warning: #ca8a04;  --color-error: #dc2626;  --color-info: #0891b2;  /* Neutral */  --color-gray-50: #f9fafb;  --color-gray-100: #f3f4f6;  --color-gray-200: #e5e7eb;  --color-gray-300: #d1d5db;  --color-gray-400: #9ca3af;  --color-gray-500: #6b7280;  --color-gray-600: #4b5563;  --color-gray-700: #374151;  --color-gray-800: #1f2937;  --color-gray-900: #111827;}
```
```
// tailwind.config.jsmodule.exports = {  theme: {    extend: {      fontFamily: {        sans: ["Inter", "system-ui", "sans-serif"],        mono: ["JetBrains Mono", "monospace"],      },      fontSize: {        xs: ["0.75rem", { lineHeight: "1rem" }],        sm: ["0.875rem", { lineHeight: "1.25rem" }],        base: ["1rem", { lineHeight: "1.5rem" }],        lg: ["1.125rem", { lineHeight: "1.75rem" }],        xl: ["1.25rem", { lineHeight: "1.75rem" }],        "2xl": ["1.5rem", { lineHeight: "2rem" }],      },      colors: {        brand: {          50: "#eff6ff",          500: "#3b82f6",          600: "#2563eb",          700: "#1d4ed8",        },      },      spacing: {        // Extends default with custom values        18: "4.5rem",        88: "22rem",      },    },  },};
```
```
// tailwind.config.jsmodule.exports = {  theme: {    extend: {      fontFamily: {        sans: ["Inter", "system-ui", "sans-serif"],        mono: ["JetBrains Mono", "monospace"],      },      fontSize: {        xs: ["0.75rem", { lineHeight: "1rem" }],        sm: ["0.875rem", { lineHeight: "1.25rem" }],        base: ["1rem", { lineHeight: "1.5rem" }],        lg: ["1.125rem", { lineHeight: "1.75rem" }],        xl: ["1.25rem", { lineHeight: "1.75rem" }],        "2xl": ["1.5rem", { lineHeight: "2rem" }],      },      colors: {        brand: {          50: "#eff6ff",          500: "#3b82f6",          600: "#2563eb",          700: "#1d4ed8",        },      },      spacing: {        // Extends default with custom values        18: "4.5rem",        88: "22rem",      },    },  },};
```
```
/* Fluid typography using clamp() */h1 {  font-size: clamp(2rem, 5vw + 1rem, 3.5rem);  line-height: 1.1;}p {  font-size: clamp(1rem, 2vw + 0.5rem, 1.125rem);  line-height: 1.6;  max-width: 65ch; /* Optimal reading width */}
```
```
/* Fluid typography using clamp() */h1 {  font-size: clamp(2rem, 5vw + 1rem, 3.5rem);  line-height: 1.1;}p {  font-size: clamp(1rem, 2vw + 0.5rem, 1.125rem);  line-height: 1.6;  max-width: 65ch; /* Optimal reading width */}
```
```
/* Prevent layout shift */@font-face {  font-family: "Inter";  src: url("/fonts/Inter.woff2") format("woff2");  font-display: swap;  font-weight: 400 700;}
```
```
/* Prevent layout shift */@font-face {  font-family: "Inter";  src: url("/fonts/Inter.woff2") format("woff2");  font-display: swap;  font-weight: 400 700;}
```
```
:root {  --bg-primary: #ffffff;  --bg-secondary: #f9fafb;  --text-primary: #111827;  --text-secondary: #6b7280;  --border: #e5e7eb;}[data-theme="dark"] {  --bg-primary: #111827;  --bg-secondary: #1f2937;  --text-primary: #f9fafb;  --text-secondary: #9ca3af;  --border: #374151;}
```
```
:root {  --bg-primary: #ffffff;  --bg-secondary: #f9fafb;  --text-primary: #111827;  --text-secondary: #6b7280;  --border: #e5e7eb;}[data-theme="dark"] {  --bg-primary: #111827;  --bg-secondary: #1f2937;  --text-primary: #f9fafb;  --text-secondary: #9ca3af;  --border: #374151;}
```
```
// Check contrast programmaticallyfunction getContrastRatio(foreground: string, background: string): number {  const getLuminance = (hex: string) => {    const rgb = hexToRgb(hex);    const [r, g, b] = rgb.map((c) => {      c = c / 255;      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);    });    return 0.2126 * r + 0.7152 * g + 0.0722 * b;  };  const l1 = getLuminance(foreground);  const l2 = getLuminance(background);  const lighter = Math.max(l1, l2);  const darker = Math.min(l1, l2);  return (lighter + 0.05) / (darker + 0.05);}
```
```
// Check contrast programmaticallyfunction getContrastRatio(foreground: string, background: string): number {  const getLuminance = (hex: string) => {    const rgb = hexToRgb(hex);    const [r, g, b] = rgb.map((c) => {      c = c / 255;      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);    });    return 0.2126 * r + 0.7152 * g + 0.0722 * b;  };  const l1 = getLuminance(foreground);  const l2 = getLuminance(background);  const lighter = Math.max(l1, l2);  const darker = Math.min(l1, l2);  return (lighter + 0.05) / (darker + 0.05);}
```
```
Card padding:      16-24px (--space-4 to --space-6)Section gap:       32-64px (--space-8 to --space-16)Form field gap:    16-24px (--space-4 to --space-6)Button padding:    8-16px vertical, 16-24px horizontalIcon-text gap:     8px (--space-2)
```
```
Card padding:      16-24px (--space-4 to --space-6)Section gap:       32-64px (--space-8 to --space-16)Form field gap:    16-24px (--space-4 to --space-6)Button padding:    8-16px vertical, 16-24px horizontalIcon-text gap:     8px (--space-2)
```
```
/* Consistent vertical rhythm */.prose > * + * {  margin-top: var(--space-4);}.prose > h2 + * {  margin-top: var(--space-2);}.prose > * + h2 {  margin-top: var(--space-8);}
```
```
/* Consistent vertical rhythm */.prose > * + * {  margin-top: var(--space-4);}.prose > h2 + * {  margin-top: var(--space-2);}.prose > * + h2 {  margin-top: var(--space-8);}
```
```
:root {  --icon-xs: 12px;  --icon-sm: 16px;  --icon-md: 20px;  --icon-lg: 24px;  --icon-xl: 32px;}
```
```
:root {  --icon-xs: 12px;  --icon-sm: 16px;  --icon-md: 20px;  --icon-lg: 24px;  --icon-xl: 32px;}
```
```
interface IconProps {  name: string;  size?: "xs" | "sm" | "md" | "lg" | "xl";  className?: string;}const sizeMap = {  xs: 12,  sm: 16,  md: 20,  lg: 24,  xl: 32,};export function Icon({ name, size = "md", className }: IconProps) {  return (    <svg      width={sizeMap[size]}      height={sizeMap[size]}      className={cn("inline-block flex-shrink-0", className)}      aria-hidden="true"    >      <use href={/icons.svg#${name}} />    </svg>  );}
```
```
interface IconProps {  name: string;  size?: "xs" | "sm" | "md" | "lg" | "xl";  className?: string;}const sizeMap = {  xs: 12,  sm: 16,  md: 20,  lg: 24,  xl: 32,};export function Icon({ name, size = "md", className }: IconProps) {  return (    <svg      width={sizeMap[size]}      height={sizeMap[size]}      className={cn("inline-block flex-shrink-0", className)}      aria-hidden="true"    >      <use href={/icons.svg#${name}} />    </svg>  );}
```
```
/icons.svg#${name}
```
Unlock the power of coherent aesthetics in your projects with this Visual Design Foundations agent skill. Designed for developers and designers alike, it streamlines the application of core principles such as typography, color theory, spacing, and iconography. This skill empowers you to build robust, scalable design systems, ensuring consistency and accessibility across all interfaces. Whether you're starting a new project or refining an existing one, leverage its guidance to establish foundational design tokens and enhance overall visual harmony, making your user interfaces intuitive and engaging.

# When to Use This Skill
- •Establishing foundational design tokens for new web or mobile projects.
- •Refining existing user interfaces to improve visual consistency and hierarchy.
- •Creating comprehensive style guides and design system documentation.
- •Developing accessible color palettes and icon systems for better user experience.

# Pro Tips
- 💡Always validate color palettes with accessibility checkers (e.g., WCAG contrast ratio) to ensure inclusivity.
- 💡Combine modular typography scales with a consistent 8-point spacing grid for harmonious and predictable layouts.
- 💡Iteratively test your design tokens across different components and screen sizes to catch inconsistencies early in the development cycle.

