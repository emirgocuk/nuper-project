# auto-animate
Source: https://antigravity.codes/agent-skills/react/auto-animate

## AI Worker Instructions
When the user requests functionality related to auto-animate, follow these guidelines and utilize this context.

## Scraped Content

# auto-animate
```
// Use client-only import to prevent SSR errorsimport { useState, useEffect } from "react";export function useAutoAnimateSafe<T extends HTMLElement>() {  const [parent, setParent] = useState<T | null>(null);  useEffect(() => {    if (typeof window !== "undefined" && parent) {      import("@formkit/auto-animate").then(({ default: autoAnimate }) => {        autoAnimate(parent);      });    }  }, [parent]);  return [parent, setParent] as const;}
```
```
// Use client-only import to prevent SSR errorsimport { useState, useEffect } from "react";export function useAutoAnimateSafe<T extends HTMLElement>() {  const [parent, setParent] = useState<T | null>(null);  useEffect(() => {    if (typeof window !== "undefined" && parent) {      import("@formkit/auto-animate").then(({ default: autoAnimate }) => {        autoAnimate(parent);      });    }  }, [parent]);  return [parent, setParent] as const;}
```
```
templates/vite-ssr-safe.tsx
```
```
// ❌ Wrong{showList && <ul ref={parent}>...</ul>}// ✅ Correct<ul ref={parent}>{showList && items.map(...)}</ul>
```
```
// ❌ Wrong{showList && <ul ref={parent}>...</ul>}// ✅ Correct<ul ref={parent}>{showList && items.map(...)}</ul>
```
```
<!-- ❌ Wrong - parent conditional --><ul v-if="showList" ref="parent">  <li v-for="item in items" :key="item.id">{{ item.text }}</li></ul><!-- ✅ Correct - children conditional --><ul ref="parent">  <li v-if="showList" v-for="item in items" :key="item.id">    {{ item.text }}  </li></ul>
```
```
<!-- ❌ Wrong - parent conditional --><ul v-if="showList" ref="parent">  <li v-for="item in items" :key="item.id">{{ item.text }}</li></ul><!-- ✅ Correct - children conditional --><ul ref="parent">  <li v-if="showList" v-for="item in items" :key="item.id">    {{ item.text }}  </li></ul>
```
```
key={item.id}
```
```
flex-grow: 1
```
```
// ❌ Wrong - causes shaking<ul ref={parent} style={{ display: 'flex' }}>  {items.map(item => (    <li key={item.id} style={{ flex: '1 1 auto' }}>{item.text}</li>  ))}</ul>// ✅ Correct - fixed sizes<ul ref={parent} style={{ display: 'flex', gap: '1rem' }}>  {items.map(item => (    <li      key={item.id}      style={{ minWidth: '200px', maxWidth: '200px' }}    >      {item.text}    </li>  ))}</ul>
```
```
// ❌ Wrong - causes shaking<ul ref={parent} style={{ display: 'flex' }}>  {items.map(item => (    <li key={item.id} style={{ flex: '1 1 auto' }}>{item.text}</li>  ))}</ul>// ✅ Correct - fixed sizes<ul ref={parent} style={{ display: 'flex', gap: '1rem' }}>  {items.map(item => (    <li      key={item.id}      style={{ minWidth: '200px', maxWidth: '200px' }}    >      {item.text}    </li>  ))}</ul>
```
```
<tbody>
```
```
moduleNameMapper
```
```
position: relative
```
```
// ❌ Wrong - breaks in StrictModeconst [parent] = useAutoAnimate();// ✅ Correct - prevents double initializationconst [parent] = useAutoAnimate();const initialized = useRef(false);useEffect(() => {  if (initialized.current) return;  initialized.current = true;}, []);
```
```
// ❌ Wrong - breaks in StrictModeconst [parent] = useAutoAnimate();// ✅ Correct - prevents double initializationconst [parent] = useAutoAnimate();const initialized = useRef(false);useEffect(() => {  if (initialized.current) return;  initialized.current = true;}, []);
```
```
const isInViewport = (element) => {  const rect = element.getBoundingClientRect();  return rect.top >= 0 && rect.bottom <= window.innerHeight;};useEffect(() => {  if (parent.current && isInViewport(parent.current)) {    autoAnimate(parent.current);  }}, [parent]);
```
```
const isInViewport = (element) => {  const rect = element.getBoundingClientRect();  return rect.top >= 0 && rect.bottom <= window.innerHeight;};useEffect(() => {  if (parent.current && isInViewport(parent.current)) {    autoAnimate(parent.current);  }}, [parent]);
```
```
// CSS workaround<style>{  [data-auto-animate-target] {    z-index: -1 !important;  }}</style>
```
```
// CSS workaround<style>{  [data-auto-animate-target] {    z-index: -1 !important;  }}</style>
```
```
[data-auto-animate-target] {    z-index: -1 !important;  }
```
```
const [isDragging, setIsDragging] = useState(false);const [parent] = useAutoAnimate();return (  <ul ref={isDragging ? null : parent}>    {/* items */}  </ul>);
```
```
const [isDragging, setIsDragging] = useState(false);const [parent] = useAutoAnimate();return (  <ul ref={isDragging ? null : parent}>    {/* items */}  </ul>);
```
```
useEffect(() => {  if (showList && parent.current) {    setTimeout(() => {      autoAnimate(parent.current);    }, 300); // Match CSS transition duration  }}, [showList]);
```
```
useEffect(() => {  if (showList && parent.current) {    setTimeout(() => {      autoAnimate(parent.current);    }, 300); // Match CSS transition duration  }}, [showList]);
```
```
key={item.id}
```
```
key={index}
```
```
disrespectUserMotionPreference: false
```
```
{show && <ul ref={parent}>}
```
```
key={index}
```
```
disrespectUserMotionPreference: true
```
```
prefers-reduced-motion
```
```
// jest.setup.jsglobal.ResizeObserver = jest.fn().mockImplementation(() => ({  observe: jest.fn(),  unobserve: jest.fn(),  disconnect: jest.fn(),}));// __mocks__/@formkit/auto-animate.jsconst autoAnimate = jest.fn(() => () => {});const useAutoAnimate = jest.fn(() => [null, jest.fn(), jest.fn()]);module.exports = { default: autoAnimate, useAutoAnimate };
```
```
// jest.setup.jsglobal.ResizeObserver = jest.fn().mockImplementation(() => ({  observe: jest.fn(),  unobserve: jest.fn(),  disconnect: jest.fn(),}));// __mocks__/@formkit/auto-animate.jsconst autoAnimate = jest.fn(() => () => {});const useAutoAnimate = jest.fn(() => [null, jest.fn(), jest.fn()]);module.exports = { default: autoAnimate, useAutoAnimate };
```
```
useEffect(() => {  const cleanup = autoAnimate(parent.current);  return () => cleanup && cleanup();}, []);// useAutoAnimate hook handles cleanup automaticallyconst [parent] = useAutoAnimate(); // Preferred
```
```
useEffect(() => {  const cleanup = autoAnimate(parent.current);  return () => cleanup && cleanup();}, []);// useAutoAnimate hook handles cleanup automaticallyconst [parent] = useAutoAnimate(); // Preferred
```
```
{  "dependencies": {    "@formkit/auto-animate": "^0.9.0"  }}
```
```
{  "dependencies": {    "@formkit/auto-animate": "^0.9.0"  }}
```
```
templates/
```
```
references/
```
Integrating seamless animations into web applications can significantly boost user experience, but often comes with a unique set of challenges, especially concerning server-side rendering (SSR) and framework compatibility. This AutoAnimate skill is meticulously crafted to preempt and resolve 15 common pitfalls associated with the @formkit/auto-animate library. By leveraging its expert guidance, developers can confidently implement dynamic, animated UIs across React, Vue, and other modern frameworks, ensuring robust performance and stability from development to deployment. Say goodbye to frustrating SSR errors and unexpected animation glitches.

# When to Use This Skill
- •When implementing dynamic lists or grids in a Next.js application, to ensure auto-animate works without SSR import errors.
- •Developing interactive UI components (e.g., expandable sections, sortable items) that require smooth transitions and need robust error prevention across multiple frameworks.
- •Troubleshooting existing auto-animate implementations that are encountering 'DOM API not available' errors or unexpected behavior in a production environment.
- •Integrating auto-animate into a complex application using various frontend frameworks (React, Vue, Svelte) and needing a unified, error-safe approach.

# Pro Tips
- 💡Always utilize the `useAutoAnimateSafe` pattern provided for any SSR-capable framework (like Next.js) to avoid critical runtime errors, even if you don't explicitly think you're rendering on the server.
- 💡Before diving into complex custom animations, test auto-animate's default behavior with a simple list to confirm it integrates correctly with your component's lifecycle and state management.
- 💡For advanced debugging, combine this skill's insights with your browser's dev tools to inspect element styles and ensure auto-animate is correctly applying its CSS transforms, especially when encountering visual glitches.

