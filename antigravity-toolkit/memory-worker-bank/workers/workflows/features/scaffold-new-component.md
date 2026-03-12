# Scaffold New Component
Source: https://antigravity.codes/workflows/features/scaffold-new-react-component-structure

## AI Worker Instructions
When the user requests functionality related to Scaffold New Component, follow these guidelines and utilize this context.

## Scraped Content

# Scaffold New Component
```
mkdir -p src/components/NewComponent
```
```
printf "export const NewComponent = () => {\n  return (\n    <div className='p-4'>\n      <h1>NewComponent</h1>\n    </div>\n  );\n};" > src/components/NewComponent/index.tsx
```
```
plop.js
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as scaffold-new-react-component-structure.md
```
scaffold-new-react-component-structure.md
```
- In Antigravity, type /scaffold_new_react_component_structure or just describe what you want to do
```
/scaffold_new_react_component_structure
```
Learn more about workflows →

# Related Workflows

# Implement Dark Mode

# Setup Internationalization (i18n)

# Handle File Uploads (S3)

