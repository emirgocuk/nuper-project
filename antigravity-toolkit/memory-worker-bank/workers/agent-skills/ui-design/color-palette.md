# color-palette
Source: https://antigravity.codes/agent-skills/ui-design/color-palette

## AI Worker Instructions
When the user requests functionality related to color-palette, follow these guidelines and utilize this context.

## Scraped Content

# color-palette
```
// Input: Brand hexconst brandColor = "#0D9488" // Teal-600// Output: 11-shade scale + semantic tokens + dark modeprimary-50:  #F0FDFA (lightest)primary-500: #14B8A6 (brand)primary-950: #042F2E (darkest)background: #FFFFFFforeground: #0F172Aprimary: #14B8A6
```
```
// Input: Brand hexconst brandColor = "#0D9488" // Teal-600// Output: 11-shade scale + semantic tokens + dark modeprimary-50:  #F0FDFA (lightest)primary-500: #14B8A6 (brand)primary-950: #042F2E (darkest)background: #FFFFFFforeground: #0F172Aprimary: #14B8A6
```
```
// Example: #0D9488 → hsl(174, 84%, 29%)// H (Hue): 174deg// S (Saturation): 84%// L (Lightness): 29%
```
```
// Example: #0D9488 → hsl(174, 84%, 29%)// H (Hue): 174deg// S (Saturation): 84%// L (Lightness): 29%
```
```
references/shade-generation.md
```
```
--background: white--foreground: primary-950--card: white--card-foreground: primary-900--muted: primary-50--muted-foreground: primary-600--border: primary-200--primary: primary-600--primary-foreground: white
```
```
--background: white--foreground: primary-950--card: white--card-foreground: primary-900--muted: primary-50--muted-foreground: primary-600--border: primary-200--primary: primary-600--primary-foreground: white
```
```
--background: primary-950--foreground: primary-50--card: primary-900--card-foreground: primary-50--muted: primary-800--muted-foreground: primary-400--border: primary-800--primary: primary-500--primary-foreground: white
```
```
--background: primary-950--foreground: primary-50--card: primary-900--card-foreground: primary-50--muted: primary-800--muted-foreground: primary-400--border: primary-800--primary: primary-500--primary-foreground: white
```
```
references/semantic-mapping.md
```
```
:root {  --background: white;  --foreground: hsl(var(--primary-950));}.dark {  --background: hsl(var(--primary-950));  --foreground: hsl(var(--primary-50));}
```
```
:root {  --background: white;  --foreground: hsl(var(--primary-950));}.dark {  --background: hsl(var(--primary-950));  --foreground: hsl(var(--primary-50));}
```
```
primary-600
```
```
white
```
```
white
```
```
primary-600
```
```
primary-900
```
```
primary-50
```
```
contrast = (lighter + 0.05) / (darker + 0.05)// Where lighter/darker are relative luminance values
```
```
contrast = (lighter + 0.05) / (darker + 0.05)// Where lighter/darker are relative luminance values
```
```
references/contrast-checking.md
```
```
@theme
```
```
@theme {  --color-primary-50: #F0FDFA;  --color-primary-500: #14B8A6;  --color-primary-950: #042F2E;  --color-background: #FFFFFF;  --color-foreground: var(--color-primary-950);}
```
```
@theme {  --color-primary-50: #F0FDFA;  --color-primary-500: #14B8A6;  --color-primary-950: #042F2E;  --color-background: #FFFFFF;  --color-foreground: var(--color-primary-950);}
```
```
references/shade-generation.md
```
```
references/semantic-mapping.md
```
```
references/dark-mode-palette.md
```
```
references/contrast-checking.md
```
```
templates/tailwind-colors.css
```
```
rules/color-palette.md
```
```
@theme {  /* Shade scale */  --color-primary-50: #F0FDFA;  --color-primary-100: #CCFBF1;  --color-primary-200: #99F6E4;  --color-primary-300: #5EEAD4;  --color-primary-400: #2DD4BF;  --color-primary-500: #14B8A6;  --color-primary-600: #0D9488;  --color-primary-700: #0F766E;  --color-primary-800: #115E59;  --color-primary-900: #134E4A;  --color-primary-950: #042F2E;  /* Light mode semantics */  --color-background: #FFFFFF;  --color-foreground: var(--color-primary-950);  --color-primary: var(--color-primary-600);  --color-primary-foreground: #FFFFFF;}.dark {  /* Dark mode overrides */  --color-background: var(--color-primary-950);  --color-foreground: var(--color-primary-50);  --color-primary: var(--color-primary-500);}
```
```
@theme {  /* Shade scale */  --color-primary-50: #F0FDFA;  --color-primary-100: #CCFBF1;  --color-primary-200: #99F6E4;  --color-primary-300: #5EEAD4;  --color-primary-400: #2DD4BF;  --color-primary-500: #14B8A6;  --color-primary-600: #0D9488;  --color-primary-700: #0F766E;  --color-primary-800: #115E59;  --color-primary-900: #134E4A;  --color-primary-950: #042F2E;  /* Light mode semantics */  --color-background: #FFFFFF;  --color-foreground: var(--color-primary-950);  --color-primary: var(--color-primary-600);  --color-primary-foreground: #FFFFFF;}.dark {  /* Dark mode overrides */  --color-background: var(--color-primary-950);  --color-foreground: var(--color-primary-50);  --color-primary: var(--color-primary-500);}
```
```
@theme {  --color-primary-50: #FAF5FF;  --color-primary-500: #A855F7;  --color-primary-950: #3B0764;  --color-background: #FFFFFF;  --color-foreground: var(--color-primary-950);  --color-primary: var(--color-primary-600);}
```
```
@theme {  --color-primary-50: #FAF5FF;  --color-primary-500: #A855F7;  --color-primary-950: #3B0764;  --color-background: #FFFFFF;  --color-foreground: var(--color-primary-950);  --color-primary: var(--color-primary-600);}
```
```
references/shade-generation.md
```
```
bg-blue-500
```
```
bg-primary
```
```
text-gray-600
```
```
text-muted-foreground
```
```
border-slate-200
```
```
border-border
```
```
bg-green-600
```
```
--color-success
```
```
/* Don't hardcode Tailwind colors */.button { background: #3B82F6; }/* Use semantic tokens */.button { background: hsl(var(--color-primary)); }
```
```
/* Don't hardcode Tailwind colors */.button { background: #3B82F6; }/* Use semantic tokens */.button { background: hsl(var(--color-primary)); }
```
```
--color-card
```
```
--color-card
```
```
--color-card-foreground
```
```
bg-primary
```
```
text-secondary
```
```
bg-primary
```
```
text-primary-foreground
```
```
:root {  --color-card: #FFFFFF;  --color-card-foreground: #1E293B; /* Dark text */}.dark {  --color-card: #1E293B; /* Now dark background */  /* BUG: card-foreground still #1E293B - invisible text! */}
```
```
:root {  --color-card: #FFFFFF;  --color-card-foreground: #1E293B; /* Dark text */}.dark {  --color-card: #1E293B; /* Now dark background */  /* BUG: card-foreground still #1E293B - invisible text! */}
```
```
.dark {  --color-card: #1E293B;  --color-card-foreground: #F1F5F9; /* Light text on dark background */}
```
```
.dark {  --color-card: #1E293B;  --color-card-foreground: #F1F5F9; /* Light text on dark background */}
```
```
/* Fails AA (3.9:1) */--color-primary: var(--color-primary-500);--color-primary-foreground: #FFFFFF;/* Passes AA (5.7:1) */--color-primary: var(--color-primary-600);--color-primary-foreground: #FFFFFF;
```
```
/* Fails AA (3.9:1) */--color-primary: var(--color-primary-500);--color-primary-foreground: #FFFFFF;/* Passes AA (5.7:1) */--color-primary: var(--color-primary-600);--color-primary-foreground: #FFFFFF;
```
```
.dark
```
```
@theme {  /* Light mode */  --color-background: #FFFFFF;  --color-foreground: var(--color-primary-950);  --color-primary: var(--color-primary-600);}.dark {  /* Dark mode - inverted */  --color-background: var(--color-primary-950);  --color-foreground: var(--color-primary-50);  --color-primary: var(--color-primary-500); /* Brighter for visibility */}
```
```
@theme {  /* Light mode */  --color-background: #FFFFFF;  --color-foreground: var(--color-primary-950);  --color-primary: var(--color-primary-600);}.dark {  /* Dark mode - inverted */  --color-background: var(--color-primary-950);  --color-foreground: var(--color-primary-50);  --color-primary: var(--color-primary-500); /* Brighter for visibility */}
```
```
// Don't mix hex valuesconst shade100 = averageHex('#0D9488', '#FFFFFF'); // ❌ Hue shifts// Use HSL with fixed hueconst brand = { h: 174, s: 84, l: 40 }; // #0D9488const shade100 = { h: 174, s: 67, l: 94 }; // ✅ Same hue, lighter
```
```
// Don't mix hex valuesconst shade100 = averageHex('#0D9488', '#FFFFFF'); // ❌ Hue shifts// Use HSL with fixed hueconst brand = { h: 174, s: 84, l: 40 }; // #0D9488const shade100 = { h: 174, s: 67, l: 94 }; // ✅ Same hue, lighter
```
```
--color-background: #000000
```
```
--color-background: var(--color-primary-950)
```
```
--color-foreground: #FFFFFF
```
```
--color-foreground: var(--color-primary-50)
```
```
/* ❌ Wrong - hue shifts */--color-primary-50: hsl(180, 70%, 97%);  /* Shifted to blue-green */--color-primary-600: hsl(174, 84%, 40%); /* Original teal *//* ✅ Correct - constant hue */--color-primary-50: hsl(174, 67%, 97%);  /* Same 174deg hue */--color-primary-600: hsl(174, 84%, 40%);
```
```
/* ❌ Wrong - hue shifts */--color-primary-50: hsl(180, 70%, 97%);  /* Shifted to blue-green */--color-primary-600: hsl(174, 84%, 40%); /* Original teal *//* ✅ Correct - constant hue */--color-primary-50: hsl(174, 67%, 97%);  /* Same 174deg hue */--color-primary-600: hsl(174, 84%, 40%);
```
```
const baseSaturation = 84; // Brand color saturation// Shade 50 (97% lightness)const shade50Saturation = baseSaturation * 0.8; // 67%// Shade 600 (40% lightness)const shade600Saturation = baseSaturation; // 84% (full)
```
```
const baseSaturation = 84; // Brand color saturation// Shade 50 (97% lightness)const shade50Saturation = baseSaturation * 0.8; // 67%// Shade 600 (40% lightness)const shade600Saturation = baseSaturation; // 84% (full)
```
```
.card { --color-primary: #123456; }
```
```
@theme {  --color-primary: var(--color-primary-600);  --color-accent: var(--color-accent-500); /* For special components */}
```
```
@theme {  --color-primary: var(--color-primary-600);  --color-accent: var(--color-accent-500); /* For special components */}
```
```
--color-light-gray
```
```
--color-muted
```
```
--color-dark-teal
```
```
--color-primary
```
```
--color-bright-blue
```
```
--color-accent
```
```
oklch()
```
```
hsl()
```
```
oklch()
```
This skill empowers developers and designers to effortlessly create comprehensive and harmonious color palettes. By simply providing a brand hex code, the agent generates an 11-shade scale, semantic tokens, and dark mode variations, all while adhering to industry standards like Tailwind v4. It streamlines the design process, ensuring visual consistency and accessibility across web and application interfaces. This tool is invaluable for quickly establishing or refining a project's visual identity, saving significant time in manual color selection and verification.

# When to Use This Skill
- •Initializing a new web project with a cohesive and professional color scheme.
- •Refining an existing application's UI/UX to ensure better color consistency and accessibility.
- •Quickly generating dark mode variations for an existing light theme.
- •Creating a design system where consistent and scalable color definitions are crucial.

# Pro Tips
- 💡Always start with your primary brand color (shade 500) to ensure the generated palette aligns with your core identity.
- 💡Utilize the semantic tokens output to name colors based on their purpose (e.g., `primary`, `background`, `foreground`), rather than just their shade number, for better maintainability.
- 💡Cross-reference generated colors with accessibility guidelines (WCAG) for contrast ratios, especially for text and interactive elements.

