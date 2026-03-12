# design-system-starter
Source: https://antigravity.codes/agent-skills/ui-design/design-system-starter

## AI Worker Instructions
When the user requests functionality related to design-system-starter, follow these guidelines and utilize this context.

## Scraped Content

# design-system-starter
```
Create a design system for my React app with dark mode support
```
```
Create a design system for my React app with dark mode support
```
```
references/component-examples.md
```
```
templates/design-tokens-template.json
```
```
templates/component-template.tsx
```
```
checklists/design-system-checklist.md
```
```
{  "color": {    "primitive": {      "blue": {        "50": "#eff6ff",        "100": "#dbeafe",        "200": "#bfdbfe",        "300": "#93c5fd",        "400": "#60a5fa",        "500": "#3b82f6",        "600": "#2563eb",        "700": "#1d4ed8",        "800": "#1e40af",        "900": "#1e3a8a",        "950": "#172554"      }    }  }}
```
```
{  "color": {    "primitive": {      "blue": {        "50": "#eff6ff",        "100": "#dbeafe",        "200": "#bfdbfe",        "300": "#93c5fd",        "400": "#60a5fa",        "500": "#3b82f6",        "600": "#2563eb",        "700": "#1d4ed8",        "800": "#1e40af",        "900": "#1e3a8a",        "950": "#172554"      }    }  }}
```
```
{  "color": {    "semantic": {      "brand": {        "primary": "{color.primitive.blue.600}",        "primary-hover": "{color.primitive.blue.700}",        "primary-active": "{color.primitive.blue.800}"      },      "text": {        "primary": "{color.primitive.gray.900}",        "secondary": "{color.primitive.gray.600}",        "tertiary": "{color.primitive.gray.500}",        "disabled": "{color.primitive.gray.400}",        "inverse": "{color.primitive.white}"      },      "background": {        "primary": "{color.primitive.white}",        "secondary": "{color.primitive.gray.50}",        "tertiary": "{color.primitive.gray.100}"      },      "feedback": {        "success": "{color.primitive.green.600}",        "warning": "{color.primitive.yellow.600}",        "error": "{color.primitive.red.600}",        "info": "{color.primitive.blue.600}"      }    }  }}
```
```
{  "color": {    "semantic": {      "brand": {        "primary": "{color.primitive.blue.600}",        "primary-hover": "{color.primitive.blue.700}",        "primary-active": "{color.primitive.blue.800}"      },      "text": {        "primary": "{color.primitive.gray.900}",        "secondary": "{color.primitive.gray.600}",        "tertiary": "{color.primitive.gray.500}",        "disabled": "{color.primitive.gray.400}",        "inverse": "{color.primitive.white}"      },      "background": {        "primary": "{color.primitive.white}",        "secondary": "{color.primitive.gray.50}",        "tertiary": "{color.primitive.gray.100}"      },      "feedback": {        "success": "{color.primitive.green.600}",        "warning": "{color.primitive.yellow.600}",        "error": "{color.primitive.red.600}",        "info": "{color.primitive.blue.600}"      }    }  }}
```
```
{  "typography": {    "fontFamily": {      "sans": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",      "serif": "'Georgia', 'Times New Roman', serif",      "mono": "'Fira Code', 'Courier New', monospace"    },    "fontSize": {      "xs": "0.75rem",     // 12px      "sm": "0.875rem",    // 14px      "base": "1rem",      // 16px      "lg": "1.125rem",    // 18px      "xl": "1.25rem",     // 20px      "2xl": "1.5rem",     // 24px      "3xl": "1.875rem",   // 30px      "4xl": "2.25rem",    // 36px      "5xl": "3rem"        // 48px    },    "fontWeight": {      "normal": 400,      "medium": 500,      "semibold": 600,      "bold": 700    },    "lineHeight": {      "tight": 1.25,      "normal": 1.5,      "relaxed": 1.75,      "loose": 2    },    "letterSpacing": {      "tight": "-0.025em",      "normal": "0",      "wide": "0.025em"    }  }}
```
```
{  "typography": {    "fontFamily": {      "sans": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",      "serif": "'Georgia', 'Times New Roman', serif",      "mono": "'Fira Code', 'Courier New', monospace"    },    "fontSize": {      "xs": "0.75rem",     // 12px      "sm": "0.875rem",    // 14px      "base": "1rem",      // 16px      "lg": "1.125rem",    // 18px      "xl": "1.25rem",     // 20px      "2xl": "1.5rem",     // 24px      "3xl": "1.875rem",   // 30px      "4xl": "2.25rem",    // 36px      "5xl": "3rem"        // 48px    },    "fontWeight": {      "normal": 400,      "medium": 500,      "semibold": 600,      "bold": 700    },    "lineHeight": {      "tight": 1.25,      "normal": 1.5,      "relaxed": 1.75,      "loose": 2    },    "letterSpacing": {      "tight": "-0.025em",      "normal": "0",      "wide": "0.025em"    }  }}
```
```
{  "spacing": {    "0": "0",    "1": "0.25rem",   // 4px    "2": "0.5rem",    // 8px    "3": "0.75rem",   // 12px    "4": "1rem",      // 16px    "5": "1.25rem",   // 20px    "6": "1.5rem",    // 24px    "8": "2rem",      // 32px    "10": "2.5rem",   // 40px    "12": "3rem",     // 48px    "16": "4rem",     // 64px    "20": "5rem",     // 80px    "24": "6rem"      // 96px  }}
```
```
{  "spacing": {    "0": "0",    "1": "0.25rem",   // 4px    "2": "0.5rem",    // 8px    "3": "0.75rem",   // 12px    "4": "1rem",      // 16px    "5": "1.25rem",   // 20px    "6": "1.5rem",    // 24px    "8": "2rem",      // 32px    "10": "2.5rem",   // 40px    "12": "3rem",     // 48px    "16": "4rem",     // 64px    "20": "5rem",     // 80px    "24": "6rem"      // 96px  }}
```
```
{  "component": {    "button": {      "padding-x": "{spacing.4}",      "padding-y": "{spacing.2}",      "gap": "{spacing.2}"    },    "card": {      "padding": "{spacing.6}",      "gap": "{spacing.4}"    }  }}
```
```
{  "component": {    "button": {      "padding-x": "{spacing.4}",      "padding-y": "{spacing.2}",      "gap": "{spacing.2}"    },    "card": {      "padding": "{spacing.6}",      "gap": "{spacing.4}"    }  }}
```
```
{  "borderRadius": {    "none": "0",    "sm": "0.125rem",   // 2px    "base": "0.25rem",  // 4px    "md": "0.375rem",   // 6px    "lg": "0.5rem",     // 8px    "xl": "0.75rem",    // 12px    "2xl": "1rem",      // 16px    "full": "9999px"  }}
```
```
{  "borderRadius": {    "none": "0",    "sm": "0.125rem",   // 2px    "base": "0.25rem",  // 4px    "md": "0.375rem",   // 6px    "lg": "0.5rem",     // 8px    "xl": "0.75rem",    // 12px    "2xl": "1rem",      // 16px    "full": "9999px"  }}
```
```
{  "shadow": {    "xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",    "sm": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",    "base": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",    "md": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",    "lg": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",    "xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"  }}
```
```
{  "shadow": {    "xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",    "sm": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",    "base": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",    "md": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",    "lg": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",    "xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"  }}
```
```
interface ButtonProps {  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';  size?: 'sm' | 'md' | 'lg';  disabled?: boolean;  loading?: boolean;  icon?: React.ReactNode;  children: React.ReactNode;}
```
```
interface ButtonProps {  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';  size?: 'sm' | 'md' | 'lg';  disabled?: boolean;  loading?: boolean;  icon?: React.ReactNode;  children: React.ReactNode;}
```
```
references/component-examples.md
```
```
interface FormFieldProps {  label: string;  name: string;  error?: string;  hint?: string;  required?: boolean;  children: React.ReactNode;}
```
```
interface FormFieldProps {  label: string;  name: string;  error?: string;  hint?: string;  required?: boolean;  children: React.ReactNode;}
```
```
references/component-examples.md
```
```
// ✅ Good: Consistent naming<Button variant="primary" size="md" /><Input variant="outlined" size="md" />// ❌ Bad: Inconsistent<Button type="primary" sizeMode="md" /><Input style="outlined" inputSize="md" />
```
```
// ✅ Good: Consistent naming<Button variant="primary" size="md" /><Input variant="outlined" size="md" />// ❌ Bad: Inconsistent<Button type="primary" sizeMode="md" /><Input style="outlined" inputSize="md" />
```
```
// ✅ Good: Provides defaultsinterface ButtonProps {  variant?: 'primary' | 'secondary';  // Default: primary  size?: 'sm' | 'md' | 'lg';          // Default: md}// ❌ Bad: Everything requiredinterface ButtonProps {  variant: 'primary' | 'secondary';  size: 'sm' | 'md' | 'lg';  color: string;  padding: string;}
```
```
// ✅ Good: Provides defaultsinterface ButtonProps {  variant?: 'primary' | 'secondary';  // Default: primary  size?: 'sm' | 'md' | 'lg';          // Default: md}// ❌ Bad: Everything requiredinterface ButtonProps {  variant: 'primary' | 'secondary';  size: 'sm' | 'md' | 'lg';  color: string;  padding: string;}
```
```
// ✅ Good: Composable<Card>  <Card.Header>    <Card.Title>Title</Card.Title>  </Card.Header>  <Card.Body>Content</Card.Body>  <Card.Footer>Actions</Card.Footer></Card>// ❌ Bad: Too many props<Card  title="Title"  content="Content"  footerContent="Actions"  hasHeader={true}  hasFooter={true}/>
```
```
// ✅ Good: Composable<Card>  <Card.Header>    <Card.Title>Title</Card.Title>  </Card.Header>  <Card.Body>Content</Card.Body>  <Card.Footer>Actions</Card.Footer></Card>// ❌ Bad: Too many props<Card  title="Title"  content="Content"  footerContent="Actions"  hasHeader={true}  hasFooter={true}/>
```
```
<Button as="a" href="/login">Login</Button><Button as="button" onClick={handleClick}>Click Me</Button>
```
```
<Button as="a" href="/login">Login</Button><Button as="button" onClick={handleClick}>Click Me</Button>
```
```
references/component-examples.md
```
```
interface Theme {  colors: {    brand: {      primary: string;      secondary: string;    };    text: {      primary: string;      secondary: string;    };    background: {      primary: string;      secondary: string;    };    feedback: {      success: string;      warning: string;      error: string;      info: string;    };  };  typography: {    fontFamily: {      sans: string;      mono: string;    };    fontSize: Record<string, string>;  };  spacing: Record<string, string>;  borderRadius: Record<string, string>;  shadow: Record<string, string>;}
```
```
interface Theme {  colors: {    brand: {      primary: string;      secondary: string;    };    text: {      primary: string;      secondary: string;    };    background: {      primary: string;      secondary: string;    };    feedback: {      success: string;      warning: string;      error: string;      info: string;    };  };  typography: {    fontFamily: {      sans: string;      mono: string;    };    fontSize: Record<string, string>;  };  spacing: Record<string, string>;  borderRadius: Record<string, string>;  shadow: Record<string, string>;}
```
```
:root {  --color-bg-primary: #ffffff;  --color-text-primary: #000000;}[data-theme="dark"] {  --color-bg-primary: #1a1a1a;  --color-text-primary: #ffffff;}
```
```
:root {  --color-bg-primary: #ffffff;  --color-text-primary: #000000;}[data-theme="dark"] {  --color-bg-primary: #1a1a1a;  --color-text-primary: #ffffff;}
```
```
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">  Content</div>
```
```
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">  Content</div>
```
```
const lightTheme = { background: '#fff', text: '#000' };const darkTheme = { background: '#000', text: '#fff' };<ThemeProvider theme={isDark ? darkTheme : lightTheme}>  <App /></ThemeProvider>
```
```
const lightTheme = { background: '#fff', text: '#000' };const darkTheme = { background: '#000', text: '#fff' };<ThemeProvider theme={isDark ? darkTheme : lightTheme}>  <App /></ThemeProvider>
```
```
// ✅ All interactive elements must be keyboard accessible<button  onClick={handleClick}  onKeyDown={(e) => e.key === 'Enter' && handleClick()}>  Click me</button>// ✅ Focus management<Modal>  <FocusTrap>    {/* Modal content */}  </FocusTrap></Modal>
```
```
// ✅ All interactive elements must be keyboard accessible<button  onClick={handleClick}  onKeyDown={(e) => e.key === 'Enter' && handleClick()}>  Click me</button>// ✅ Focus management<Modal>  <FocusTrap>    {/* Modal content */}  </FocusTrap></Modal>
```
```
aria-label
```
```
aria-expanded
```
```
aria-controls
```
```
aria-live
```
```
<button>
```
```
<nav>
```
```
<main>
```
```
references/component-examples.md
```
```
templates/component-template.tsx
```
Elevate your development workflow by leveraging the Design System Starter Agent Skill. This powerful tool empowers you to lay the foundational elements for robust and maintainable user interfaces with unprecedented speed. From defining granular design tokens to structuring a scalable component architecture, it streamlines the complex process of creating a cohesive visual language. Ensure your applications are not just beautiful, but also universally accessible and ready for future expansion. It's an indispensable asset for any team aiming for consistent, high-quality product experiences across their digital landscape.

# When to Use This Skill
- •Quickly bootstrap a new frontend project with a predefined design system foundation.
- •Migrate an existing application to a structured design system, including dark mode support.
- •Standardize UI components and accessibility practices across multiple teams or products.
- •Generate comprehensive documentation for design tokens and component usage.

# Pro Tips
- 💡Start with a clear vision of your brand's aesthetic and accessibility requirements; this skill can translate those into actionable tokens and guidelines.
- 💡Leverage the 'Component architecture' trigger to explore various structural patterns like Atomic Design, then iterate based on your project's complexity.
- 💡Always review the generated accessibility guidelines and integrate them into your CI/CD pipeline for continuous compliance.

