# motion
Source: https://antigravity.codes/agent-skills/react/motion

## AI Worker Instructions
When the user requests functionality related to motion, follow these guidelines and utilize this context.

## Scraped Content

# motion
```
motion
```
```
framer-motion
```
```
auto-animate
```
```
motion
```
```
framer-motion
```
```
# Using pnpm (recommended)pnpm add motion# Using npmnpm install motion# Using yarnyarn add motion
```
```
# Using pnpm (recommended)pnpm add motion# Using npmnpm install motion# Using yarnyarn add motion
```
```
# Both packages work with Cloudflare Workers (issue #2918 fixed Dec 2024)pnpm add motion# ORpnpm add framer-motion  # Same version, same API
```
```
# Both packages work with Cloudflare Workers (issue #2918 fixed Dec 2024)pnpm add motion# ORpnpm add framer-motion  # Same version, same API
```
```
motion
```
```
LazyMotion
```
```
m
```
```
useAnimate
```
```
useAnimate
```
```
import { AnimatePresence } from "motion/react"<AnimatePresence>  {isVisible && (    <motion.div      key="modal"      initial={{ opacity: 0 }}      animate={{ opacity: 1 }}      exit={{ opacity: 0 }}    >      Modal content    </motion.div>  )}</AnimatePresence>
```
```
import { AnimatePresence } from "motion/react"<AnimatePresence>  {isVisible && (    <motion.div      key="modal"      initial={{ opacity: 0 }}      animate={{ opacity: 1 }}      exit={{ opacity: 0 }}    >      Modal content    </motion.div>  )}</AnimatePresence>
```
```
key
```
```
// ❌ Wrong - AnimatePresence unmounts with condition{isVisible && (  <AnimatePresence>    <motion.div>Content</motion.div>  </AnimatePresence>)}// ✅ Correct - AnimatePresence stays mounted<AnimatePresence>  {isVisible && <motion.div key="unique">Content</motion.div>}</AnimatePresence>
```
```
// ❌ Wrong - AnimatePresence unmounts with condition{isVisible && (  <AnimatePresence>    <motion.div>Content</motion.div>  </AnimatePresence>)}// ✅ Correct - AnimatePresence stays mounted<AnimatePresence>  {isVisible && <motion.div key="unique">Content</motion.div>}</AnimatePresence>
```
```
layout
```
```
layoutId
```
```
layoutScroll
```
```
layoutRoot
```
```
<motion.div layout>  {isExpanded ? <FullContent /> : <Summary />}</motion.div>
```
```
<motion.div layout>  {isExpanded ? <FullContent /> : <Summary />}</motion.div>
```
```
<motion.div  initial={{ opacity: 0, y: 50 }}  whileInView={{ opacity: 1, y: 0 }}  viewport={{ once: true, margin: "-100px" }}>  Fades in when 100px from entering viewport</motion.div>
```
```
<motion.div  initial={{ opacity: 0, y: 50 }}  whileInView={{ opacity: 1, y: 0 }}  viewport={{ once: true, margin: "-100px" }}>  Fades in when 100px from entering viewport</motion.div>
```
```
import { useScroll, useTransform } from "motion/react"const { scrollYProgress } = useScroll()const y = useTransform(scrollYProgress, [0, 1], [0, -300])<motion.div style={{ y }}>  Moves up 300px as user scrolls page</motion.div>
```
```
import { useScroll, useTransform } from "motion/react"const { scrollYProgress } = useScroll()const y = useTransform(scrollYProgress, [0, 1], [0, -300])<motion.div style={{ y }}>  Moves up 300px as user scrolls page</motion.div>
```
```
pnpm add motion
```
```
pnpm add motion
```
```
import { motion } from "motion/react"
```
```
src/components/motion-client.tsx
```
```
"use client"// Optimized import for Next.js (reduces client JS)import * as motion from "motion/react-client"export { motion }
```
```
"use client"// Optimized import for Next.js (reduces client JS)import * as motion from "motion/react-client"export { motion }
```
```
src/app/page.tsx
```
```
import { motion } from "@/components/motion-client"export default function Page() {  return (    <motion.div      initial={{ opacity: 0 }}      animate={{ opacity: 1 }}    >      This works in Server Component (wrapper is client)    </motion.div>  )}
```
```
import { motion } from "@/components/motion-client"export default function Page() {  return (    <motion.div      initial={{ opacity: 0 }}      animate={{ opacity: 1 }}    >      This works in Server Component (wrapper is client)    </motion.div>  )}
```
```
"use client"import { motion } from "motion/react"export function AnimatedCard() {  return <motion.div>...</motion.div>}
```
```
"use client"import { motion } from "motion/react"export function AnimatedCard() {  return <motion.div>...</motion.div>}
```
```
import { motion } from "motion/react"export default function Page() {  return <motion.div>No "use client" needed</motion.div>}
```
```
import { motion } from "motion/react"export default function Page() {  return <motion.div>No "use client" needed</motion.div>}
```
```
className
```
```
<motion.button  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"  whileHover={{ scale: 1.1 }}  whileTap={{ scale: 0.95 }}>  Tailwind styles + Motion animations</motion.button>
```
```
<motion.button  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"  whileHover={{ scale: 1.1 }}  whileTap={{ scale: 0.95 }}>  Tailwind styles + Motion animations</motion.button>
```
```
// ❌ Wrong - Tailwind transition conflicts with Motion<motion.div className="transition-all duration-300" animate={{ x: 100 }} />// ✅ Correct - Remove Tailwind transition<motion.div animate={{ x: 100 }} />
```
```
// ❌ Wrong - Tailwind transition conflicts with Motion<motion.div className="transition-all duration-300" animate={{ x: 100 }} />// ✅ Correct - Remove Tailwind transition<motion.div animate={{ x: 100 }} />
```
```
# Motion now works directly with Cloudflare Workerspnpm add motion
```
```
# Motion now works directly with Cloudflare Workerspnpm add motion
```
```
import { motion } from "motion/react"
```
```
import { motion } from "motion/react"
```
```
framer-motion
```
```
motion
```
```
LazyMotion
```
```
m
```
```
import { LazyMotion, domAnimation, m } from "motion/react"function App() {  return (    <LazyMotion features={domAnimation}>      {/* Use 'm' instead of 'motion' */}      <m.div        initial={{ opacity: 0 }}        animate={{ opacity: 1 }}      >        Only 4.6 KB!      </m.div>    </LazyMotion>  )}
```
```
import { LazyMotion, domAnimation, m } from "motion/react"function App() {  return (    <LazyMotion features={domAnimation}>      {/* Use 'm' instead of 'motion' */}      <m.div        initial={{ opacity: 0 }}        animate={{ opacity: 1 }}      >        Only 4.6 KB!      </m.div>    </LazyMotion>  )}
```
```
useAnimate
```
```
import { useAnimate } from "motion/react"function Component() {  const [scope, animate] = useAnimate()  return <div ref={scope}>Smallest possible React animation</div>}
```
```
import { useAnimate } from "motion/react"function Component() {  const [scope, animate] = useAnimate()  return <div ref={scope}>Smallest possible React animation</div>}
```
```
willChange
```
```
<motion.div  style={{ willChange: "transform" }}  animate={{ x: 100, rotate: 45 }}/>
```
```
<motion.div  style={{ willChange: "transform" }}  animate={{ x: 100, rotate: 45 }}/>
```
```
opacity
```
```
backgroundColor
```
```
clipPath
```
```
filter
```
```
pnpm add react-window# orpnpm add react-virtuoso# orpnpm add @tanstack/react-virtual
```
```
pnpm add react-window# orpnpm add react-virtuoso# orpnpm add @tanstack/react-virtual
```
```
import { FixedSizeList } from 'react-window'import { motion } from 'motion/react'<FixedSizeList  height={600}  itemCount={1000}  itemSize={50}>  {({ index, style }) => (    <motion.div style={style} layout>      Item {index}    </motion.div>  )}</FixedSizeList>
```
```
import { FixedSizeList } from 'react-window'import { motion } from 'motion/react'<FixedSizeList  height={600}  itemCount={1000}  itemSize={50}>  {({ index, style }) => (    <motion.div style={style} layout>      Item {index}    </motion.div>  )}</FixedSizeList>
```
```
layout
```
```
<motion.div layout>  {isExpanded ? <LargeContent /> : <SmallContent />}</motion.div>
```
```
<motion.div layout>  {isExpanded ? <LargeContent /> : <SmallContent />}</motion.div>
```
```
prefers-reduced-motion
```
```
import { MotionConfig } from "motion/react"<MotionConfig reducedMotion="user">  <App /></MotionConfig>
```
```
import { MotionConfig } from "motion/react"<MotionConfig reducedMotion="user">  <App /></MotionConfig>
```
```
"user"
```
```
"always"
```
```
"never"
```
```
height: "auto"
```
```
drag="x"
```
```
dragConstraints
```
```
whileInView
```
```
useScroll
```
```
useTransform
```
```
references/common-patterns.md
```
```
key
```
```
exit
```
```
// ❌ Wrong - AnimatePresence wrapped in conditional{isVisible && (  <AnimatePresence>    <motion.div>Content</motion.div>  </AnimatePresence>)}// ✅ Correct - AnimatePresence stays mounted<AnimatePresence>  {isVisible && <motion.div key="unique">Content</motion.div>}</AnimatePresence>// ❌ Wrong - Staggered children with exit prevent modal removal<AnimatePresence>  {isOpen && (    <Modal>      <motion.ul>        {items.map(item => (          <motion.li            key={item.id}            exit={{ opacity: 1, scale: 1 }}  // ← Prevents modal unmount          >            {item.content}          </motion.li>        ))}      </motion.ul>    </Modal>  )}</AnimatePresence>// ✅ Fix for modal - Remove exit from children or set duration: 0<motion.li  key={item.id}  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0 } }}>  {item.content}</motion.li>
```
```
// ❌ Wrong - AnimatePresence wrapped in conditional{isVisible && (  <AnimatePresence>    <motion.div>Content</motion.div>  </AnimatePresence>)}// ✅ Correct - AnimatePresence stays mounted<AnimatePresence>  {isVisible && <motion.div key="unique">Content</motion.div>}</AnimatePresence>// ❌ Wrong - Staggered children with exit prevent modal removal<AnimatePresence>  {isOpen && (    <Modal>      <motion.ul>        {items.map(item => (          <motion.li            key={item.id}            exit={{ opacity: 1, scale: 1 }}  // ← Prevents modal unmount          >            {item.content}          </motion.li>        ))}      </motion.ul>    </Modal>  )}</AnimatePresence>// ✅ Fix for modal - Remove exit from children or set duration: 0<motion.li  key={item.id}  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0 } }}>  {item.content}</motion.li>
```
```
pnpm add react-window
```
```
pnpm add react-window
```
```
references/performance-optimization.md
```
```
transition-*
```
```
// ❌ Wrong<motion.div className="transition-all" animate={{ x: 100 }} />// ✅ Correct<motion.div animate={{ x: 100 }} />
```
```
// ❌ Wrong<motion.div className="transition-all" animate={{ x: 100 }} />// ✅ Correct<motion.div animate={{ x: 100 }} />
```
```
"use client"
```
```
"use client"import { motion } from "motion/react"
```
```
"use client"import { motion } from "motion/react"
```
```
references/nextjs-integration.md
```
```
layoutScroll
```
```
<motion.div layoutScroll className="overflow-auto">  {items.map(item => (    <motion.div key={item.id} layout>      {item.content}    </motion.div>  ))}</motion.div>
```
```
<motion.div layoutScroll className="overflow-auto">  {items.map(item => (    <motion.div key={item.id} layout>      {item.content}    </motion.div>  ))}</motion.div>
```
```
motion
```
```
layoutRoot
```
```
<motion.div layoutRoot className="fixed top-0 left-0">  <motion.div layout>Content</motion.div></motion.div>
```
```
<motion.div layoutRoot className="fixed top-0 left-0">  <motion.div layout>Content</motion.div></motion.div>
```
```
layoutId
```
```
LayoutGroup
```
```
import { LayoutGroup } from "motion/react"<LayoutGroup>  <AnimatePresence>    {items.map(item => (      <motion.div key={item.id} layoutId={item.id}>        {item.content}      </motion.div>    ))}  </AnimatePresence></LayoutGroup>
```
```
import { LayoutGroup } from "motion/react"<LayoutGroup>  <AnimatePresence>    {items.map(item => (      <motion.div key={item.id} layoutId={item.id}>        {item.content}      </motion.div>    ))}  </AnimatePresence></LayoutGroup>
```
```
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches<motion.div  initial={{ opacity: prefersReducedMotion ? 1 : 0 }}  animate={{ opacity: 1 }}  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}/>
```
```
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches<motion.div  initial={{ opacity: prefersReducedMotion ? 1 : 0 }}  animate={{ opacity: 1 }}  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}/>
```
```
Reorder.Group
```
```
overflow: auto/scroll
```
```
// ❌ Wrong - Page-level scrolling (auto-scroll fails)<body style={{ height: "200vh" }}>  <Reorder.Group values={items} onReorder={setItems}>    {/* Auto-scroll doesn't trigger at viewport edges */}  </Reorder.Group></body>// ✅ Correct - Container with overflow<div style={{ height: "300px", overflow: "auto" }}>  <Reorder.Group values={items} onReorder={setItems}>    {items.map(item => (      <Reorder.Item key={item.id} value={item}>        {item.content}      </Reorder.Item>    ))}  </Reorder.Group></div>// ✅ Alternative - Use DnD Kit for complex cases// Motion docs officially recommend DnD Kit for:// - Multi-row reordering// - Dragging between columns// - Page-level scrollable containers// - Complex drag-and-drop interactions// Install: pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```
```
// ❌ Wrong - Page-level scrolling (auto-scroll fails)<body style={{ height: "200vh" }}>  <Reorder.Group values={items} onReorder={setItems}>    {/* Auto-scroll doesn't trigger at viewport edges */}  </Reorder.Group></body>// ✅ Correct - Container with overflow<div style={{ height: "300px", overflow: "auto" }}>  <Reorder.Group values={items} onReorder={setItems}>    {items.map(item => (      <Reorder.Item key={item.id} value={item}>        {item.content}      </Reorder.Item>    ))}  </Reorder.Group></div>// ✅ Alternative - Use DnD Kit for complex cases// Motion docs officially recommend DnD Kit for:// - Multi-row reordering// - Dragging between columns// - Page-level scrollable containers// - Complex drag-and-drop interactions// Install: pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```
```
references/nextjs-integration.md
```
```
// Use transformTemplate to correct for parent scaleconst scale = 2; // Parent's transform scale value<div style={{ transform: scale(${scale}) }}>  <motion.div    layout    transformTemplate={(latest, generated) => {      const match = /translate3d\((.+)px,\s?(.+)px,\s?(.+)px\)/.exec(generated);      if (match) {        const [, x, y, z] = match;        return translate3d(${Number(x) / scale}px, ${Number(y) / scale}px, ${Number(z) / scale}px);      }      return generated;    }}  >    Content  </motion.div></div>
```
```
// Use transformTemplate to correct for parent scaleconst scale = 2; // Parent's transform scale value<div style={{ transform: scale(${scale}) }}>  <motion.div    layout    transformTemplate={(latest, generated) => {      const match = /translate3d\((.+)px,\s?(.+)px,\s?(.+)px\)/.exec(generated);      if (match) {        const [, x, y, z] = match;        return translate3d(${Number(x) / scale}px, ${Number(y) / scale}px, ${Number(z) / scale}px);      }      return generated;    }}  >    Content  </motion.div></div>
```
```
scale(${scale})
```
```
translate3d(${Number(x) / scale}px, ${Number(y) / scale}px, ${Number(z) / scale}px)
```
```
templates/
```
```
references/
```
```
scripts/
```
```
references/motion-vs-auto-animate.md
```
```
# ❌ Old package namenpm install framer-motion# ✅ New package name (2024+)npm install motion
```
```
# ❌ Old package namenpm install framer-motion# ✅ New package name (2024+)npm install motion
```
```
/* ❌ Old imports */import { motion, AnimatePresence } from 'framer-motion'/* ✅ New imports */import { motion, AnimatePresence } from 'motion/react'
```
```
/* ❌ Old imports */import { motion, AnimatePresence } from 'framer-motion'/* ✅ New imports */import { motion, AnimatePresence } from 'motion/react'
```
```
/* ❌ May cause issues with React 19 */import { motion } from 'framer-motion'/* ✅ motion/react is React 19 compatible */import { motion } from 'motion/react'
```
```
/* ❌ May cause issues with React 19 */import { motion } from 'framer-motion'/* ✅ motion/react is React 19 compatible */import { motion } from 'motion/react'
```
```
/* ✅ Same API, just new import */import { motion } from 'motion/react'const variants = {  hidden: { opacity: 0, y: 20 },  visible: { opacity: 1, y: 0 },}<motion.div  initial="hidden"  animate="visible"  variants={variants}/>
```
```
/* ✅ Same API, just new import */import { motion } from 'motion/react'const variants = {  hidden: { opacity: 0, y: 20 },  visible: { opacity: 1, y: 0 },}<motion.div  initial="hidden"  animate="visible"  variants={variants}/>
```
```
/* ❌ Old import */import { useAnimation } from 'framer-motion'/* ✅ New import */import { useAnimation } from 'motion/react'const controls = useAnimation()await controls.start({ opacity: 1 })
```
```
/* ❌ Old import */import { useAnimation } from 'framer-motion'/* ✅ New import */import { useAnimation } from 'motion/react'const controls = useAnimation()await controls.start({ opacity: 1 })
```
```
/* ❌ Old import */import { LayoutGroup } from 'framer-motion'/* ✅ New import */import { LayoutGroup } from 'motion/react'<LayoutGroup>  <motion.div layout /></LayoutGroup>
```
```
/* ❌ Old import */import { LayoutGroup } from 'framer-motion'/* ✅ New import */import { LayoutGroup } from 'motion/react'<LayoutGroup>  <motion.div layout /></LayoutGroup>
```
```
npm install framer-motion
```
```
npm install motion
```
```
from 'framer-motion'
```
```
from 'motion/react'
```
```
import { motion }
```
```
import { motion } from 'motion/react'
```
```
motion
```
```
/react
```
```
motion/react
```
The Motion Animation Library Agent Skill empowers developers to effortlessly integrate sophisticated, production-ready animations into their React applications. Leveraging the power of Motion (formerly Framer Motion), this skill helps you build dynamic user interfaces with gestures, scroll effects, and layout transitions. By offloading complex animation logic to the agent, you can accelerate development, ensure best practices, and achieve polished UI/UX, transforming static designs into interactive, engaging experiences for your users.

# When to Use This Skill
- •Implementing smooth drag-and-drop functionalities for interactive lists or kanban boards.
- •Creating engaging hover effects with scaling, rotation, or color changes for UI elements.
- •Developing scroll-linked animations, parallax effects, or viewport-triggered transitions.
- •Designing shared element transitions and FLIP-based layout animations for seamless user experience.

# Pro Tips
- 💡Start with `useAnimation` for imperative controls when declarative approaches aren't sufficient, especially for complex sequences or external triggers.
- 💡Optimize performance by leveraging `shouldUpdate` or `variants` to prevent unnecessary re-renders and ensure smooth 60fps animations.
- 💡Combine Motion with Tailwind CSS or CSS-in-JS solutions for streamlined styling and animation definitions within your components.

