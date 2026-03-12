# zustand-state-management
Source: https://antigravity.codes/agent-skills/react/zustand-state-management

## AI Worker Instructions
When the user requests functionality related to zustand-state-management, follow these guidelines and utilize this context.

## Scraped Content

# zustand-state-management
```
npm install zustand
```
```
npm install zustand
```
```
create<T>()()
```
```
import { create } from 'zustand'interface BearStore {  bears: number  increase: (by: number) => void}const useBearStore = create<BearStore>()((set) => ({  bears: 0,  increase: (by) => set((state) => ({ bears: state.bears + by })),}))
```
```
import { create } from 'zustand'interface BearStore {  bears: number  increase: (by: number) => void}const useBearStore = create<BearStore>()((set) => ({  bears: 0,  increase: (by) => set((state) => ({ bears: state.bears + by })),}))
```
```
const bears = useBearStore((state) => state.bears)  // Only re-renders when bears changesconst increase = useBearStore((state) => state.increase)
```
```
const bears = useBearStore((state) => state.bears)  // Only re-renders when bears changesconst increase = useBearStore((state) => state.increase)
```
```
const useStore = create((set) => ({  count: 0,  increment: () => set((state) => ({ count: state.count + 1 })),}))
```
```
const useStore = create((set) => ({  count: 0,  increment: () => set((state) => ({ count: state.count + 1 })),}))
```
```
interface CounterStore { count: number; increment: () => void }const useStore = create<CounterStore>()((set) => ({  count: 0,  increment: () => set((state) => ({ count: state.count + 1 })),}))
```
```
interface CounterStore { count: number; increment: () => void }const useStore = create<CounterStore>()((set) => ({  count: 0,  increment: () => set((state) => ({ count: state.count + 1 })),}))
```
```
import { persist, createJSONStorage } from 'zustand/middleware'const useStore = create<UserPreferences>()(  persist(    (set) => ({ theme: 'system', setTheme: (theme) => set({ theme }) }),    { name: 'user-preferences', storage: createJSONStorage(() => localStorage) },  ),)
```
```
import { persist, createJSONStorage } from 'zustand/middleware'const useStore = create<UserPreferences>()(  persist(    (set) => ({ theme: 'system', setTheme: (theme) => set({ theme }) }),    { name: 'user-preferences', storage: createJSONStorage(() => localStorage) },  ),)
```
```
create<T>()()
```
```
set
```
```
set((state) => ({ count: state.count + 1 }))
```
```
hasHydrated
```
```
useShallow
```
```
create<T>(...)
```
```
set((state) => { state.count++; return state })
```
```
useStore((state) => ({ a: state.a }))
```
```
"Text content does not match server-rendered HTML"
```
```
"Hydration failed"
```
```
import { create } from 'zustand'import { persist } from 'zustand/middleware'interface StoreWithHydration {  count: number  _hasHydrated: boolean  setHasHydrated: (hydrated: boolean) => void  increase: () => void}const useStore = create<StoreWithHydration>()(  persist(    (set) => ({      count: 0,      _hasHydrated: false,      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),      increase: () => set((state) => ({ count: state.count + 1 })),    }),    {      name: 'my-store',      onRehydrateStorage: () => (state) => {        state?.setHasHydrated(true)      },    },  ),)// In componentfunction MyComponent() {  const hasHydrated = useStore((state) => state._hasHydrated)  if (!hasHydrated) {    return <div>Loading...</div>  }  // Now safe to render with persisted state  return <ActualContent />}
```
```
import { create } from 'zustand'import { persist } from 'zustand/middleware'interface StoreWithHydration {  count: number  _hasHydrated: boolean  setHasHydrated: (hydrated: boolean) => void  increase: () => void}const useStore = create<StoreWithHydration>()(  persist(    (set) => ({      count: 0,      _hasHydrated: false,      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),      increase: () => set((state) => ({ count: state.count + 1 })),    }),    {      name: 'my-store',      onRehydrateStorage: () => (state) => {        state?.setHasHydrated(true)      },    },  ),)// In componentfunction MyComponent() {  const hasHydrated = useStore((state) => state._hasHydrated)  if (!hasHydrated) {    return <div>Loading...</div>  }  // Now safe to render with persisted state  return <ActualContent />}
```
```
StateCreator
```
```
create<T>()()
```
```
// ❌ WRONG - Single parenthesesconst useStore = create<MyStore>((set) => ({  // ...}))// ✅ CORRECT - Double parenthesesconst useStore = create<MyStore>()((set) => ({  // ...}))
```
```
// ❌ WRONG - Single parenthesesconst useStore = create<MyStore>((set) => ({  // ...}))// ✅ CORRECT - Double parenthesesconst useStore = create<MyStore>()((set) => ({  // ...}))
```
```
create<T>()()
```
```
"Attempted import error: 'createJSONStorage' is not exported from 'zustand/middleware'"
```
```
// ✅ CORRECT imports for v5import { create } from 'zustand'import { persist, createJSONStorage } from 'zustand/middleware'// Verify versions// zustand@5.0.9 includes createJSONStorage// zustand@4.x uses different API// Check your package.json// "zustand": "^5.0.9"
```
```
// ✅ CORRECT imports for v5import { create } from 'zustand'import { persist, createJSONStorage } from 'zustand/middleware'// Verify versions// zustand@5.0.9 includes createJSONStorage// zustand@4.x uses different API// Check your package.json// "zustand": "^5.0.9"
```
```
Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
```
```
Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
```
```
import { useShallow } from 'zustand/shallow'// ❌ WRONG - Creates new object every timeconst { bears, fishes } = useStore((state) => ({  bears: state.bears,  fishes: state.fishes,}))// ✅ CORRECT Option 1 - Select primitives separatelyconst bears = useStore((state) => state.bears)const fishes = useStore((state) => state.fishes)// ✅ CORRECT Option 2 - Use useShallow hook for multiple valuesconst { bears, fishes } = useStore(  useShallow((state) => ({ bears: state.bears, fishes: state.fishes })))
```
```
import { useShallow } from 'zustand/shallow'// ❌ WRONG - Creates new object every timeconst { bears, fishes } = useStore((state) => ({  bears: state.bears,  fishes: state.fishes,}))// ✅ CORRECT Option 1 - Select primitives separatelyconst bears = useStore((state) => state.bears)const fishes = useStore((state) => state.fishes)// ✅ CORRECT Option 2 - Use useShallow hook for multiple valuesconst { bears, fishes } = useStore(  useShallow((state) => ({ bears: state.bears, fishes: state.fishes })))
```
```
StateCreator
```
```
import { create, StateCreator } from 'zustand'// Define slice typesinterface BearSlice {  bears: number  addBear: () => void}interface FishSlice {  fishes: number  addFish: () => void}// Create slices with proper typesconst createBearSlice: StateCreator<  BearSlice & FishSlice,  // Combined store type  [],                      // Middleware mutators (empty if none)  [],                      // Chained middleware (empty if none)  BearSlice               // This slice's type> = (set) => ({  bears: 0,  addBear: () => set((state) => ({ bears: state.bears + 1 })),})const createFishSlice: StateCreator<  BearSlice & FishSlice,  [],  [],  FishSlice> = (set) => ({  fishes: 0,  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),})// Combine slicesconst useStore = create<BearSlice & FishSlice>()((...a) => ({  ...createBearSlice(...a),  ...createFishSlice(...a),}))
```
```
import { create, StateCreator } from 'zustand'// Define slice typesinterface BearSlice {  bears: number  addBear: () => void}interface FishSlice {  fishes: number  addFish: () => void}// Create slices with proper typesconst createBearSlice: StateCreator<  BearSlice & FishSlice,  // Combined store type  [],                      // Middleware mutators (empty if none)  [],                      // Chained middleware (empty if none)  BearSlice               // This slice's type> = (set) => ({  bears: 0,  addBear: () => set((state) => ({ bears: state.bears + 1 })),})const createFishSlice: StateCreator<  BearSlice & FishSlice,  [],  [],  FishSlice> = (set) => ({  fishes: 0,  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),})// Combine slicesconst useStore = create<BearSlice & FishSlice>()((...a) => ({  ...createBearSlice(...a),  ...createFishSlice(...a),}))
```
```
npm install zustand@latest  # Ensure v5.0.10+
```
```
npm install zustand@latest  # Ensure v5.0.10+
```
```
import { persist, createJSONStorage } from 'zustand/middleware'const useStore = create<MyStore>()(  persist(    (set) => ({ data: [], addItem: (item) => set((state) => ({ data: [...state.data, item] })) }),    {      name: 'my-storage',      partialize: (state) => ({ data: state.data }),  // Only persist 'data'    },  ),)
```
```
import { persist, createJSONStorage } from 'zustand/middleware'const useStore = create<MyStore>()(  persist(    (set) => ({ data: [], addItem: (item) => set((state) => ({ data: [...state.data, item] })) }),    {      name: 'my-storage',      partialize: (state) => ({ data: state.data }),  // Only persist 'data'    },  ),)
```
```
import { devtools } from 'zustand/middleware'const useStore = create<CounterStore>()(  devtools(    (set) => ({ count: 0, increment: () => set((s) => ({ count: s.count + 1 }), undefined, 'increment') }),    { name: 'CounterStore' },  ),)
```
```
import { devtools } from 'zustand/middleware'const useStore = create<CounterStore>()(  devtools(    (set) => ({ count: 0, increment: () => set((s) => ({ count: s.count + 1 }), undefined, 'increment') }),    { name: 'CounterStore' },  ),)
```
```
'zustand/middleware/devtools'
```
```
'zustand/middleware'
```
```
const useStore = create<MyStore>()(devtools(persist((set) => ({ /* ... */ }), { name: 'storage' }), { name: 'MyStore' }))
```
```
const useStore = create<MyStore>()(devtools(persist((set) => ({ /* ... */ }), { name: 'storage' }), { name: 'MyStore' }))
```
```
const count = useStore((state) => state.items.length)  // Computed on read
```
```
const count = useStore((state) => state.items.length)  // Computed on read
```
```
const useAsyncStore = create<AsyncStore>()((set) => ({  data: null,  isLoading: false,  fetchData: async () => {    set({ isLoading: true })    const response = await fetch('/api/data')    set({ data: await response.text(), isLoading: false })  },}))
```
```
const useAsyncStore = create<AsyncStore>()((set) => ({  data: null,  isLoading: false,  fetchData: async () => {    set({ isLoading: true })    const response = await fetch('/api/data')    set({ data: await response.text(), isLoading: false })  },}))
```
```
const initialState = { count: 0, name: '' }const useStore = create<ResettableStore>()((set) => ({  ...initialState,  reset: () => set(initialState),}))
```
```
const initialState = { count: 0, name: '' }const useStore = create<ResettableStore>()((set) => ({  ...initialState,  reset: () => set(initialState),}))
```
```
const todo = useStore((state) => state.todos.find((t) => t.id === id))
```
```
const todo = useStore((state) => state.todos.find((t) => t.id === id))
```
```
basic-store.ts
```
```
typescript-store.ts
```
```
persist-store.ts
```
```
slices-pattern.ts
```
```
devtools-store.ts
```
```
nextjs-store.ts
```
```
computed-store.ts
```
```
async-actions-store.ts
```
```
middleware-guide.md
```
```
typescript-patterns.md
```
```
nextjs-hydration.md
```
```
migration-guide.md
```
```
check-versions.sh
```
```
import { createStore } from 'zustand/vanilla'const store = createStore<CounterStore>()((set) => ({ count: 0, increment: () => set((s) => ({ count: s.count + 1 })) }))const unsubscribe = store.subscribe((state) => console.log(state.count))store.getState().increment()
```
```
import { createStore } from 'zustand/vanilla'const store = createStore<CounterStore>()((set) => ({ count: 0, increment: () => set((s) => ({ count: s.count + 1 })) }))const unsubscribe = store.subscribe((state) => console.log(state.count))store.getState().increment()
```
```
const logger: Logger = (f, name) => (set, get, store) => {  const loggedSet: typeof set = (...a) => { set(...a); console.log([${name}]:, get()) }  return f(loggedSet, get, store)}
```
```
const logger: Logger = (f, name) => (set, get, store) => {  const loggedSet: typeof set = (...a) => { set(...a); console.log([${name}]:, get()) }  return f(loggedSet, get, store)}
```
```
[${name}]:
```
```
import { immer } from 'zustand/middleware/immer'const useStore = create<TodoStore>()(immer((set) => ({  todos: [],  addTodo: (text) => set((state) => { state.todos.push({ id: Date.now().toString(), text }) }),})))
```
```
import { immer } from 'zustand/middleware/immer'const useStore = create<TodoStore>()(immer((set) => ({  todos: [],  addTodo: (text) => set((state) => { state.todos.push({ id: Date.now().toString(), text }) }),})))
```
```
zustand/middleware/immer
```
```
unstable_ssrSafe
```
```
_hasHydrated
```
```
import { unstable_ssrSafe } from 'zustand/middleware'const useStore = create<Store>()(  unstable_ssrSafe(    persist(      (set) => ({ /* state */ }),      { name: 'my-store' }    )  ))
```
```
import { unstable_ssrSafe } from 'zustand/middleware'const useStore = create<Store>()(  unstable_ssrSafe(    persist(      (set) => ({ /* state */ }),      { name: 'my-store' }    )  ))
```
```
_hasHydrated
```
```
/pmndrs/zustand
```
```
/* ❌ v4 syntax (breaks middleware types) */const useStore = create<MyState>((set) => ({  count: 0,  increment: () => set((s) => ({ count: s.count + 1 })),}))/* ✅ v5 syntax: create<T>()(...) */const useStore = create<MyState>()((set) => ({  count: 0,  increment: () => set((s) => ({ count: s.count + 1 })),}))
```
```
/* ❌ v4 syntax (breaks middleware types) */const useStore = create<MyState>((set) => ({  count: 0,  increment: () => set((s) => ({ count: s.count + 1 })),}))/* ✅ v5 syntax: create<T>()(...) */const useStore = create<MyState>()((set) => ({  count: 0,  increment: () => set((s) => ({ count: s.count + 1 })),}))
```
```
/* ❌ Wrong import */import { persist, createJSONStorage } from 'zustand'/* ✅ Import from middleware */import { create } from 'zustand'import { persist, createJSONStorage } from 'zustand/middleware'const useStore = create<MyState>()(  persist(    (set) => ({ /* ... */ }),    {      name: 'my-store',      storage: createJSONStorage(() => localStorage),    }  ))
```
```
/* ❌ Wrong import */import { persist, createJSONStorage } from 'zustand'/* ✅ Import from middleware */import { create } from 'zustand'import { persist, createJSONStorage } from 'zustand/middleware'const useStore = create<MyState>()(  persist(    (set) => ({ /* ... */ }),    {      name: 'my-store',      storage: createJSONStorage(() => localStorage),    }  ))
```
```
/* ❌ Creates new object every render (infinite re-renders) */const { count, increment } = useStore((s) => ({  count: s.count,  increment: s.increment,}))/* ✅ Option 1: Select separately */const count = useStore((s) => s.count)const increment = useStore((s) => s.increment)/* ✅ Option 2: Use shallow comparator */import { useShallow } from 'zustand/shallow'const { count, increment } = useStore(  useShallow((s) => ({ count: s.count, increment: s.increment })))
```
```
/* ❌ Creates new object every render (infinite re-renders) */const { count, increment } = useStore((s) => ({  count: s.count,  increment: s.increment,}))/* ✅ Option 1: Select separately */const count = useStore((s) => s.count)const increment = useStore((s) => s.increment)/* ✅ Option 2: Use shallow comparator */import { useShallow } from 'zustand/shallow'const { count, increment } = useStore(  useShallow((s) => ({ count: s.count, increment: s.increment })))
```
```
/* ❌ "Text content does not match" error */// Persist reads localStorage on client, not server/* ✅ Add hydration check */interface MyState {  count: number  _hasHydrated: boolean  setHasHydrated: (state: boolean) => void}const useStore = create<MyState>()(  persist(    (set) => ({      count: 0,      _hasHydrated: false,      setHasHydrated: (state) => set({ _hasHydrated: state }),    }),    {      name: 'my-store',      onRehydrateStorage: () => (state) => {        state?.setHasHydrated(true)      },    }  ))// In component:const hasHydrated = useStore((s) => s._hasHydrated)if (!hasHydrated) return <Loading />
```
```
/* ❌ "Text content does not match" error */// Persist reads localStorage on client, not server/* ✅ Add hydration check */interface MyState {  count: number  _hasHydrated: boolean  setHasHydrated: (state: boolean) => void}const useStore = create<MyState>()(  persist(    (set) => ({      count: 0,      _hasHydrated: false,      setHasHydrated: (state) => set({ _hasHydrated: state }),    }),    {      name: 'my-store',      onRehydrateStorage: () => (state) => {        state?.setHasHydrated(true)      },    }  ))// In component:const hasHydrated = useStore((s) => s._hasHydrated)if (!hasHydrated) return <Loading />
```
```
/* ✅ Complex but necessary for middleware */import { StateCreator } from 'zustand'interface BearSlice {  bears: number  addBear: () => void}const createBearSlice: StateCreator<  BearSlice & FishSlice, // Combined state  [],  [],  BearSlice // This slice> = (set) => ({  bears: 0,  addBear: () => set((s) => ({ bears: s.bears + 1 })),})
```
```
/* ✅ Complex but necessary for middleware */import { StateCreator } from 'zustand'interface BearSlice {  bears: number  addBear: () => void}const createBearSlice: StateCreator<  BearSlice & FishSlice, // Combined state  [],  [],  BearSlice // This slice> = (set) => ({  bears: 0,  addBear: () => set((s) => ({ bears: s.bears + 1 })),})
```
```
create<T>((set) => ...)
```
```
create<T>()((set) => ...)
```
```
useShallow
```
```
_hasHydrated
```
```
StateCreator
```
Zustand offers a minimalist and highly performant approach to state management, standing out as an excellent alternative to more complex solutions. Designed for simplicity and speed, it leverages React hooks to provide a delightful developer experience. This agent skill empowers you to swiftly integrate Zustand into your projects, whether you're building a small component or managing intricate global states across a large application. Dive into best practices for TypeScript integration, persistent storage, and optimized re-renders, ensuring your applications remain lightweight and responsive.

# When to Use This Skill
- •Managing global application state efficiently in a React single-page application.
- •Creating small, focused stores for specific features like a shopping cart or user preferences.
- •Implementing persistent state that survives page reloads using built-in middleware capabilities.
- •Optimizing component re-renders by selecting only the necessary slices of state.

# Pro Tips
- 💡Always use the `create<T>()()` double parentheses syntax for TypeScript stores to ensure robust type inference and safety.
- 💡Leverage selector functions (`useStore(state => state.value)`) to prevent unnecessary component re-renders, ensuring components only update when their specific slice of state changes.
- 💡For complex asynchronous actions or side effects, consider integrating middleware or custom actions directly within your store to keep logic centralized and testable.

