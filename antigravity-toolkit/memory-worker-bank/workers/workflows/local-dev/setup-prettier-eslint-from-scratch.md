# Setup Prettier & ESLint from Scratch
Source: https://antigravity.codes/workflows/local-dev/setup-prettier-eslint-typescript-configuration

## AI Worker Instructions
When the user requests functionality related to Setup Prettier & ESLint from Scratch, follow these guidelines and utilize this context.

## Scraped Content

# Setup Prettier & ESLint from Scratch
```
npm install --save-dev eslint @eslint/js typescript-eslint prettier eslint-config-prettier eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```
```
eslint.config.js
```
```
import js from '@eslint/js';   import globals from 'globals';   import reactHooks from 'eslint-plugin-react-hooks';   import reactRefresh from 'eslint-plugin-react-refresh';   import tseslint from 'typescript-eslint';   export default tseslint.config(     { ignores: ['dist', '.next'] },     {       extends: [js.configs.recommended, ...tseslint.configs.recommended],       files: ['**/*.{ts,tsx}'],       languageOptions: {         ecmaVersion: 2020,         globals: globals.browser,       },       plugins: {         'react-hooks': reactHooks,         'react-refresh': reactRefresh,       },       rules: {         ...reactHooks.configs.recommended.rules,         'react-refresh/only-export-components': [           'warn',           { allowConstantExport: true },         ],       },     },   );
```
```
import js from '@eslint/js';   import globals from 'globals';   import reactHooks from 'eslint-plugin-react-hooks';   import reactRefresh from 'eslint-plugin-react-refresh';   import tseslint from 'typescript-eslint';   export default tseslint.config(     { ignores: ['dist', '.next'] },     {       extends: [js.configs.recommended, ...tseslint.configs.recommended],       files: ['**/*.{ts,tsx}'],       languageOptions: {         ecmaVersion: 2020,         globals: globals.browser,       },       plugins: {         'react-hooks': reactHooks,         'react-refresh': reactRefresh,       },       rules: {         ...reactHooks.configs.recommended.rules,         'react-refresh/only-export-components': [           'warn',           { allowConstantExport: true },         ],       },     },   );
```
```
.prettierrc
```
```
{     "semi": true,     "singleQuote": true,     "tabWidth": 2,     "trailingComma": "es5",     "printWidth": 100,     "plugins": ["prettier-plugin-tailwindcss"]   }
```
```
{     "semi": true,     "singleQuote": true,     "tabWidth": 2,     "trailingComma": "es5",     "printWidth": 100,     "plugins": ["prettier-plugin-tailwindcss"]   }
```
```
{     "scripts": {       "lint": "eslint .",       "lint:fix": "eslint . --fix",       "format": "prettier --write ."     }   }
```
```
{     "scripts": {       "lint": "eslint .",       "lint:fix": "eslint . --fix",       "format": "prettier --write ."     }   }
```
```
.eslintrc
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-prettier-eslint-typescript-configuration.md
```
setup-prettier-eslint-typescript-configuration.md
```
- In Antigravity, type /setup_prettier_eslint_typescript_configuration or just describe what you want to do
```
/setup_prettier_eslint_typescript_configuration
```
Learn more about workflows →

# Related Workflows

# Fix Lint Errors

# Generate .env from Example

# Setup Husky Git Hooks

