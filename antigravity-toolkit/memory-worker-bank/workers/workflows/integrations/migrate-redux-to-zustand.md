# Migrate Redux to Zustand
Source: https://antigravity.codes/workflows/integrations/migrate-state-management-redux-to-zustand

## AI Worker Instructions
When the user requests functionality related to Migrate Redux to Zustand, follow these guidelines and utilize this context.

## Scraped Content

# Migrate Redux to Zustand
```
npm install zustand
```
```
import { create } from 'zustand';      export const useStore = create((set) => ({     count: 0,     increment: () => set((state) => ({ count: state.count + 1 }))   }));
```
```
import { create } from 'zustand';      export const useStore = create((set) => ({     count: 0,     increment: () => set((state) => ({ count: state.count + 1 }))   }));
```
```
const count = useStore((state) => state.count);   const increment = useStore((state) => state.increment);
```
```
const count = useStore((state) => state.count);   const increment = useStore((state) => state.increment);
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as migrate-state-management-redux-to-zustand.md
```
migrate-state-management-redux-to-zustand.md
```
- In Antigravity, type /migrate_state_management_redux_to_zustand or just describe what you want to do
```
/migrate_state_management_redux_to_zustand
```
Learn more about workflows →

# Related Workflows

# NextAuth.js (Auth.js) v5 Setup

# Stripe Checkout Integration

# Supabase Row Level Security (RLS)

