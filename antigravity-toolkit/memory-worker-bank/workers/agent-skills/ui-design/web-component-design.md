# web-component-design
Source: https://antigravity.codes/agent-skills/ui-design/web-component-design

## AI Worker Instructions
When the user requests functionality related to web-component-design, follow these guidelines and utilize this context.

## Scraped Content

# web-component-design
```
// Usage<Select value={value} onChange={setValue}>  <Select.Trigger>Choose option</Select.Trigger>  <Select.Options>    <Select.Option value="a">Option A</Select.Option>    <Select.Option value="b">Option B</Select.Option>  </Select.Options></Select>
```
```
// Usage<Select value={value} onChange={setValue}>  <Select.Trigger>Choose option</Select.Trigger>  <Select.Options>    <Select.Option value="a">Option A</Select.Option>    <Select.Option value="b">Option B</Select.Option>  </Select.Options></Select>
```
```
<DataFetcher url="/api/users">  {({ data, loading, error }) =>    loading ? <Spinner /> : <UserList users={data} />  }</DataFetcher>
```
```
<DataFetcher url="/api/users">  {({ data, loading, error }) =>    loading ? <Spinner /> : <UserList users={data} />  }</DataFetcher>
```
```
<template>  <Card>    <template #header>Title</template>    <template #content>Body text</template>    <template #footer><Button>Action</Button></template>  </Card></template>
```
```
<template>  <Card>    <template #header>Title</template>    <template #content>Body text</template>    <template #footer><Button>Action</Button></template>  </Card></template>
```
```
interface ButtonProps {  variant?: "primary" | "secondary" | "ghost";  size?: "sm" | "md" | "lg";  isLoading?: boolean;  isDisabled?: boolean;  leftIcon?: React.ReactNode;  rightIcon?: React.ReactNode;  children: React.ReactNode;  onClick?: () => void;}
```
```
interface ButtonProps {  variant?: "primary" | "secondary" | "ghost";  size?: "sm" | "md" | "lg";  isLoading?: boolean;  isDisabled?: boolean;  leftIcon?: React.ReactNode;  rightIcon?: React.ReactNode;  children: React.ReactNode;  onClick?: () => void;}
```
```
isLoading
```
```
loading
```
```
children
```
```
className
```
```
style
```
```
import { forwardRef, type ComponentPropsWithoutRef } from "react";import { cva, type VariantProps } from "class-variance-authority";import { cn } from "@/lib/utils";const buttonVariants = cva(  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",  {    variants: {      variant: {        primary: "bg-blue-600 text-white hover:bg-blue-700",        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",        ghost: "hover:bg-gray-100 hover:text-gray-900",      },      size: {        sm: "h-8 px-3 text-sm",        md: "h-10 px-4 text-sm",        lg: "h-12 px-6 text-base",      },    },    defaultVariants: {      variant: "primary",      size: "md",    },  },);interface ButtonProps  extends    ComponentPropsWithoutRef<"button">,    VariantProps<typeof buttonVariants> {  isLoading?: boolean;}export const Button = forwardRef<HTMLButtonElement, ButtonProps>(  ({ className, variant, size, isLoading, children, ...props }, ref) => (    <button      ref={ref}      className={cn(buttonVariants({ variant, size }), className)}      disabled={isLoading || props.disabled}      {...props}    >      {isLoading && <Spinner className="mr-2 h-4 w-4" />}      {children}    </button>  ),);Button.displayName = "Button";
```
```
import { forwardRef, type ComponentPropsWithoutRef } from "react";import { cva, type VariantProps } from "class-variance-authority";import { cn } from "@/lib/utils";const buttonVariants = cva(  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",  {    variants: {      variant: {        primary: "bg-blue-600 text-white hover:bg-blue-700",        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",        ghost: "hover:bg-gray-100 hover:text-gray-900",      },      size: {        sm: "h-8 px-3 text-sm",        md: "h-10 px-4 text-sm",        lg: "h-12 px-6 text-base",      },    },    defaultVariants: {      variant: "primary",      size: "md",    },  },);interface ButtonProps  extends    ComponentPropsWithoutRef<"button">,    VariantProps<typeof buttonVariants> {  isLoading?: boolean;}export const Button = forwardRef<HTMLButtonElement, ButtonProps>(  ({ className, variant, size, isLoading, children, ...props }, ref) => (    <button      ref={ref}      className={cn(buttonVariants({ variant, size }), className)}      disabled={isLoading || props.disabled}      {...props}    >      {isLoading && <Spinner className="mr-2 h-4 w-4" />}      {children}    </button>  ),);Button.displayName = "Button";
```
```
import { createContext, useContext, useState, type ReactNode } from "react";interface AccordionContextValue {  openItems: Set<string>;  toggle: (id: string) => void;}const AccordionContext = createContext<AccordionContextValue | null>(null);function useAccordion() {  const context = useContext(AccordionContext);  if (!context) throw new Error("Must be used within Accordion");  return context;}export function Accordion({ children }: { children: ReactNode }) {  const [openItems, setOpenItems] = useState<Set<string>>(new Set());  const toggle = (id: string) => {    setOpenItems((prev) => {      const next = new Set(prev);      next.has(id) ? next.delete(id) : next.add(id);      return next;    });  };  return (    <AccordionContext.Provider value={{ openItems, toggle }}>      <div className="divide-y">{children}</div>    </AccordionContext.Provider>  );}Accordion.Item = function AccordionItem({  id,  title,  children,}: {  id: string;  title: string;  children: ReactNode;}) {  const { openItems, toggle } = useAccordion();  const isOpen = openItems.has(id);  return (    <div>      <button onClick={() => toggle(id)} className="w-full text-left py-3">        {title}      </button>      {isOpen && <div className="pb-3">{children}</div>}    </div>  );};
```
```
import { createContext, useContext, useState, type ReactNode } from "react";interface AccordionContextValue {  openItems: Set<string>;  toggle: (id: string) => void;}const AccordionContext = createContext<AccordionContextValue | null>(null);function useAccordion() {  const context = useContext(AccordionContext);  if (!context) throw new Error("Must be used within Accordion");  return context;}export function Accordion({ children }: { children: ReactNode }) {  const [openItems, setOpenItems] = useState<Set<string>>(new Set());  const toggle = (id: string) => {    setOpenItems((prev) => {      const next = new Set(prev);      next.has(id) ? next.delete(id) : next.add(id);      return next;    });  };  return (    <AccordionContext.Provider value={{ openItems, toggle }}>      <div className="divide-y">{children}</div>    </AccordionContext.Provider>  );}Accordion.Item = function AccordionItem({  id,  title,  children,}: {  id: string;  title: string;  children: ReactNode;}) {  const { openItems, toggle } = useAccordion();  const isOpen = openItems.has(id);  return (    <div>      <button onClick={() => toggle(id)} className="w-full text-left py-3">        {title}      </button>      {isOpen && <div className="pb-3">{children}</div>}    </div>  );};
```
```
<script setup lang="ts">import { ref, computed, provide, inject, type InjectionKey } from "vue";interface TabsContext {  activeTab: Ref<string>;  setActive: (id: string) => void;}const TabsKey: InjectionKey<TabsContext> = Symbol("tabs");// Parent componentconst activeTab = ref("tab-1");provide(TabsKey, {  activeTab,  setActive: (id: string) => {    activeTab.value = id;  },});// Child component usageconst tabs = inject(TabsKey);const isActive = computed(() => tabs?.activeTab.value === props.id);</script>
```
```
<script setup lang="ts">import { ref, computed, provide, inject, type InjectionKey } from "vue";interface TabsContext {  activeTab: Ref<string>;  setActive: (id: string) => void;}const TabsKey: InjectionKey<TabsContext> = Symbol("tabs");// Parent componentconst activeTab = ref("tab-1");provide(TabsKey, {  activeTab,  setActive: (id: string) => {    activeTab.value = id;  },});// Child component usageconst tabs = inject(TabsKey);const isActive = computed(() => tabs?.activeTab.value === props.id);</script>
```
```
<script lang="ts">  interface Props {    variant?: 'primary' | 'secondary';    size?: 'sm' | 'md' | 'lg';    onclick?: () => void;    children: import('svelte').Snippet;  }  let { variant = 'primary', size = 'md', onclick, children }: Props = $props();  const classes = $derived(    btn btn-${variant} btn-${size}  );</script><button class={classes} {onclick}>  {@render children()}</button>
```
```
<script lang="ts">  interface Props {    variant?: 'primary' | 'secondary';    size?: 'sm' | 'md' | 'lg';    onclick?: () => void;    children: import('svelte').Snippet;  }  let { variant = 'primary', size = 'md', onclick, children }: Props = $props();  const classes = $derived(    btn btn-${variant} btn-${size}  );</script><button class={classes} {onclick}>  {@render children()}</button>
```
```
btn btn-${variant} btn-${size}
```
```
React.memo
```
```
useMemo
```
This skill elevates your frontend development by systematizing the creation of robust, reusable UI components across popular frameworks. Dive deep into the principles that underpin scalable design systems, enabling you to craft elegant solutions whether you're working with React, Vue, or Svelte. Beyond just syntax, you'll grasp the architectural decisions that lead to maintainable codebases, fostering consistency and efficiency in your projects. It's about empowering you to build not just functional, but truly extensible and adaptable user interfaces.

# When to Use This Skill
- •Building a scalable design system from scratch or extending an existing one.
- •Migrating monolithic UI codebases to modular, reusable component architectures.
- •Implementing advanced UI patterns like compound components or render props in a framework-agnostic manner.
- •Standardizing styling approaches across a large frontend project using CSS-in-JS or similar methodologies.

# Pro Tips
- 💡Always prioritize accessibility from the outset; well-designed components are inherently inclusive and usable for everyone.
- 💡When designing component APIs, aim for simplicity and predictability, mirroring native HTML elements or established patterns where appropriate for ease of use.
- 💡Embrace tools like Storybook for isolated development, visual testing, and comprehensive documentation of your components, ensuring consistency and accelerated development.

