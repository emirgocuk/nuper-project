# interaction-design
Source: https://antigravity.codes/agent-skills/ui-design/interaction-design

## AI Worker Instructions
When the user requests functionality related to interaction-design, follow these guidelines and utilize this context.

## Scraped Content

# interaction-design
```
/* Common easings */--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* Decelerate - entering */--ease-in: cubic-bezier(0.55, 0, 1, 0.45); /* Accelerate - exiting */--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* Both - moving between */--spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot - playful */
```
```
/* Common easings */--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* Decelerate - entering */--ease-in: cubic-bezier(0.55, 0, 1, 0.45); /* Accelerate - exiting */--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* Both - moving between */--spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot - playful */
```
```
import { motion } from "framer-motion";export function InteractiveButton({ children, onClick }) {  return (    <motion.button      onClick={onClick}      whileHover={{ scale: 1.02 }}      whileTap={{ scale: 0.98 }}      transition={{ type: "spring", stiffness: 400, damping: 17 }}      className="px-4 py-2 bg-blue-600 text-white rounded-lg"    >      {children}    </motion.button>  );}
```
```
import { motion } from "framer-motion";export function InteractiveButton({ children, onClick }) {  return (    <motion.button      onClick={onClick}      whileHover={{ scale: 1.02 }}      whileTap={{ scale: 0.98 }}      transition={{ type: "spring", stiffness: 400, damping: 17 }}      className="px-4 py-2 bg-blue-600 text-white rounded-lg"    >      {children}    </motion.button>  );}
```
```
function CardSkeleton() {  return (    <div className="animate-pulse">      <div className="h-48 bg-gray-200 rounded-lg" />      <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />    </div>  );}
```
```
function CardSkeleton() {  return (    <div className="animate-pulse">      <div className="h-48 bg-gray-200 rounded-lg" />      <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />      <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />    </div>  );}
```
```
function ProgressBar({ progress }: { progress: number }) {  return (    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">      <motion.div        className="h-full bg-blue-600"        initial={{ width: 0 }}        animate={{ width: ${progress}% }}        transition={{ ease: "easeOut" }}      />    </div>  );}
```
```
function ProgressBar({ progress }: { progress: number }) {  return (    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">      <motion.div        className="h-full bg-blue-600"        initial={{ width: 0 }}        animate={{ width: ${progress}% }}        transition={{ ease: "easeOut" }}      />    </div>  );}
```
```
${progress}%
```
```
function Toggle({ checked, onChange }) {  return (    <button      role="switch"      aria-checked={checked}      onClick={() => onChange(!checked)}      className={        relative w-12 h-6 rounded-full transition-colors duration-200        ${checked ? "bg-blue-600" : "bg-gray-300"}      }    >      <motion.span        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow"        animate={{ x: checked ? 24 : 0 }}        transition={{ type: "spring", stiffness: 500, damping: 30 }}      />    </button>  );}
```
```
function Toggle({ checked, onChange }) {  return (    <button      role="switch"      aria-checked={checked}      onClick={() => onChange(!checked)}      className={        relative w-12 h-6 rounded-full transition-colors duration-200        ${checked ? "bg-blue-600" : "bg-gray-300"}      }    >      <motion.span        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow"        animate={{ x: checked ? 24 : 0 }}        transition={{ type: "spring", stiffness: 500, damping: 30 }}      />    </button>  );}
```
```
relative w-12 h-6 rounded-full transition-colors duration-200        ${checked ? "bg-blue-600" : "bg-gray-300"}
```
```
import { AnimatePresence, motion } from "framer-motion";function PageTransition({ children, key }) {  return (    <AnimatePresence mode="wait">      <motion.div        key={key}        initial={{ opacity: 0, y: 20 }}        animate={{ opacity: 1, y: 0 }}        exit={{ opacity: 0, y: -20 }}        transition={{ duration: 0.3 }}      >        {children}      </motion.div>    </AnimatePresence>  );}
```
```
import { AnimatePresence, motion } from "framer-motion";function PageTransition({ children, key }) {  return (    <AnimatePresence mode="wait">      <motion.div        key={key}        initial={{ opacity: 0, y: 20 }}        animate={{ opacity: 1, y: 0 }}        exit={{ opacity: 0, y: -20 }}        transition={{ duration: 0.3 }}      >        {children}      </motion.div>    </AnimatePresence>  );}
```
```
function RippleButton({ children, onClick }) {  const [ripples, setRipples] = useState([]);  const handleClick = (e) => {    const rect = e.currentTarget.getBoundingClientRect();    const ripple = {      x: e.clientX - rect.left,      y: e.clientY - rect.top,      id: Date.now(),    };    setRipples((prev) => [...prev, ripple]);    setTimeout(() => {      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));    }, 600);    onClick?.(e);  };  return (    <button onClick={handleClick} className="relative overflow-hidden">      {children}      {ripples.map((ripple) => (        <span          key={ripple.id}          className="absolute bg-white/30 rounded-full animate-ripple"          style={{ left: ripple.x, top: ripple.y }}        />      ))}    </button>  );}
```
```
function RippleButton({ children, onClick }) {  const [ripples, setRipples] = useState([]);  const handleClick = (e) => {    const rect = e.currentTarget.getBoundingClientRect();    const ripple = {      x: e.clientX - rect.left,      y: e.clientY - rect.top,      id: Date.now(),    };    setRipples((prev) => [...prev, ripple]);    setTimeout(() => {      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));    }, 600);    onClick?.(e);  };  return (    <button onClick={handleClick} className="relative overflow-hidden">      {children}      {ripples.map((ripple) => (        <span          key={ripple.id}          className="absolute bg-white/30 rounded-full animate-ripple"          style={{ left: ripple.x, top: ripple.y }}        />      ))}    </button>  );}
```
```
function SwipeCard({ children, onDismiss }) {  return (    <motion.div      drag="x"      dragConstraints={{ left: 0, right: 0 }}      onDragEnd={(_, info) => {        if (Math.abs(info.offset.x) > 100) {          onDismiss();        }      }}      className="cursor-grab active:cursor-grabbing"    >      {children}    </motion.div>  );}
```
```
function SwipeCard({ children, onDismiss }) {  return (    <motion.div      drag="x"      dragConstraints={{ left: 0, right: 0 }}      onDragEnd={(_, info) => {        if (Math.abs(info.offset.x) > 100) {          onDismiss();        }      }}      className="cursor-grab active:cursor-grabbing"    >      {children}    </motion.div>  );}
```
```
@keyframes fadeIn {  from {    opacity: 0;    transform: translateY(10px);  }  to {    opacity: 1;    transform: translateY(0);  }}@keyframes pulse {  0%,  100% {    opacity: 1;  }  50% {    opacity: 0.5;  }}@keyframes spin {  to {    transform: rotate(360deg);  }}.animate-fadeIn {  animation: fadeIn 0.3s ease-out;}.animate-pulse {  animation: pulse 2s ease-in-out infinite;}.animate-spin {  animation: spin 1s linear infinite;}
```
```
@keyframes fadeIn {  from {    opacity: 0;    transform: translateY(10px);  }  to {    opacity: 1;    transform: translateY(0);  }}@keyframes pulse {  0%,  100% {    opacity: 1;  }  50% {    opacity: 0.5;  }}@keyframes spin {  to {    transform: rotate(360deg);  }}.animate-fadeIn {  animation: fadeIn 0.3s ease-out;}.animate-pulse {  animation: pulse 2s ease-in-out infinite;}.animate-spin {  animation: spin 1s linear infinite;}
```
```
.card {  transition:    transform 0.2s ease-out,    box-shadow 0.2s ease-out;}.card:hover {  transform: translateY(-4px);  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);}
```
```
.card {  transition:    transform 0.2s ease-out,    box-shadow 0.2s ease-out;}.card:hover {  transform: translateY(-4px);  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);}
```
```
/* Respect user motion preferences */@media (prefers-reduced-motion: reduce) {  *,  *::before,  *::after {    animation-duration: 0.01ms !important;    animation-iteration-count: 1 !important;    transition-duration: 0.01ms !important;  }}
```
```
/* Respect user motion preferences */@media (prefers-reduced-motion: reduce) {  *,  *::before,  *::after {    animation-duration: 0.01ms !important;    animation-iteration-count: 1 !important;    transition-duration: 0.01ms !important;  }}
```
```
function AnimatedComponent() {  const prefersReducedMotion = window.matchMedia(    "(prefers-reduced-motion: reduce)",  ).matches;  return (    <motion.div      animate={{ opacity: 1 }}      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}    />  );}
```
```
function AnimatedComponent() {  const prefersReducedMotion = window.matchMedia(    "(prefers-reduced-motion: reduce)",  ).matches;  return (    <motion.div      animate={{ opacity: 1 }}      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}    />  );}
```
```
transform
```
```
opacity
```
```
prefers-reduced-motion
```
```
width
```
```
height
```
```
top
```
```
left
```
```
will-change
```
Crafting truly engaging digital products goes beyond static layouts; it demands thoughtful interaction. This skill empowers AI agents to infuse your applications with dynamic and intuitive motion, ensuring every user action is met with clear feedback and a seamless flow. By mastering elements like transitions, microinteractions, and loading states, the agent helps transform functional interfaces into delightful experiences, reducing user frustration and elevating the overall perception of your product's quality and polish. It’s about making your UI not just work, but feel alive.

# When to Use This Skill
- •Adding microinteractions to buttons, forms, and other UI elements for enhanced user feedback.
- •Implementing smooth and contextual page or component transitions to guide users through workflows.
- •Designing effective loading states, such as skeleton screens or custom spinners, to manage user expectations.
- •Building notification and toast systems that provide non-intrusive alerts and confirmations.

# Pro Tips
- 💡Prioritize Purposeful Motion: Always ensure animations serve a clear function (feedback, orientation, focus) rather than being purely decorative, which can overwhelm users.
- 💡Test on Various Devices: Interaction timings and responsiveness can differ significantly across devices and network conditions. Test thoroughly to ensure a consistent, delightful experience.
- 💡Integrate Accessibility: Ensure motion doesn't trigger motion sickness for sensitive users. Provide options to reduce or disable animations, adhering to WCAG guidelines.

