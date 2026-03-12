# Avoid Barrel File Imports
Source: https://antigravity.codes/agent-skills/bundle/bundle-barrel-imports

## AI Worker Instructions
When the user requests functionality related to Avoid Barrel File Imports, follow these guidelines and utilize this context.

## Scraped Content

# Avoid Barrel File Imports
```
index.js
```
```
export * from './module'
```
```
import { Check, X, Menu } from 'lucide-react'// Loads 1,583 modules, takes ~2.8s extra in dev// Runtime cost: 200-800ms on every cold startimport { Button, TextField } from '@mui/material'// Loads 2,225 modules, takes ~4.2s extra in dev
```
```
import { Check, X, Menu } from 'lucide-react'// Loads 1,583 modules, takes ~2.8s extra in dev// Runtime cost: 200-800ms on every cold startimport { Button, TextField } from '@mui/material'// Loads 2,225 modules, takes ~4.2s extra in dev
```
```
import Check from 'lucide-react/dist/esm/icons/check'import X from 'lucide-react/dist/esm/icons/x'import Menu from 'lucide-react/dist/esm/icons/menu'// Loads only 3 modules (~2KB vs ~1MB)import Button from '@mui/material/Button'import TextField from '@mui/material/TextField'// Loads only what you use
```
```
import Check from 'lucide-react/dist/esm/icons/check'import X from 'lucide-react/dist/esm/icons/x'import Menu from 'lucide-react/dist/esm/icons/menu'// Loads only 3 modules (~2KB vs ~1MB)import Button from '@mui/material/Button'import TextField from '@mui/material/TextField'// Loads only what you use
```
```
// next.config.js - use optimizePackageImportsmodule.exports = {  experimental: {    optimizePackageImports: ['lucide-react', '@mui/material']  }}// Then you can keep the ergonomic barrel imports:import { Check, X, Menu } from 'lucide-react'// Automatically transformed to direct imports at build time
```
```
// next.config.js - use optimizePackageImportsmodule.exports = {  experimental: {    optimizePackageImports: ['lucide-react', '@mui/material']  }}// Then you can keep the ergonomic barrel imports:import { Check, X, Menu } from 'lucide-react'// Automatically transformed to direct imports at build time
```
```
lucide-react
```
```
@mui/material
```
```
@mui/icons-material
```
```
@tabler/icons-react
```
```
react-icons
```
```
@headlessui/react
```
```
@radix-ui/react-*
```
```
lodash
```
```
ramda
```
```
date-fns
```
```
rxjs
```
```
react-use
```

