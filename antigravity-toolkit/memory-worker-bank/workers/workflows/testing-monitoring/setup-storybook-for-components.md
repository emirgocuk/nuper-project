# Setup Storybook for Components
Source: https://antigravity.codes/workflows/testing-monitoring/setup-storybook-component-development-testing

## AI Worker Instructions
When the user requests functionality related to Setup Storybook for Components, follow these guidelines and utilize this context.

## Scraped Content

# Setup Storybook for Components
```
npx storybook@latest init
```
```
// components/Button.stories.tsx   import type { Meta, StoryObj } from '@storybook/react';   import { Button } from './Button';      const meta: Meta<typeof Button> = {     title: 'Components/Button',     component: Button,     tags: ['autodocs'],   };      export default meta;   type Story = StoryObj<typeof Button>;      export const Primary: Story = {     args: {       variant: 'primary',       children: 'Click me',     },   };      export const Secondary: Story = {     args: {       variant: 'secondary',       children: 'Click me',     },   };
```
```
// components/Button.stories.tsx   import type { Meta, StoryObj } from '@storybook/react';   import { Button } from './Button';      const meta: Meta<typeof Button> = {     title: 'Components/Button',     component: Button,     tags: ['autodocs'],   };      export default meta;   type Story = StoryObj<typeof Button>;      export const Primary: Story = {     args: {       variant: 'primary',       children: 'Click me',     },   };      export const Secondary: Story = {     args: {       variant: 'secondary',       children: 'Click me',     },   };
```
```
npm run storybook
```
```
import { userEvent, within } from '@storybook/testing-library';   import { expect } from '@storybook/jest';      export const Clicked: Story = {     play: async ({ canvasElement }) => {       const canvas = within(canvasElement);       await userEvent.click(canvas.getByRole('button'));       await expect(canvas.getByText('Clicked!')).toBeInTheDocument();     },   };
```
```
import { userEvent, within } from '@storybook/testing-library';   import { expect } from '@storybook/jest';      export const Clicked: Story = {     play: async ({ canvasElement }) => {       const canvas = within(canvasElement);       await userEvent.click(canvas.getByRole('button'));       await expect(canvas.getByText('Clicked!')).toBeInTheDocument();     },   };
```
```
npm run build-storybook
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-storybook-component-development-testing.md
```
setup-storybook-component-development-testing.md
```
- In Antigravity, type /setup_storybook_component_development_testing or just describe what you want to do
```
/setup_storybook_component_development_testing
```
Learn more about workflows →

# Related Workflows

# Setup API Mocking with MSW

# Setup Sentry Error Tracking

