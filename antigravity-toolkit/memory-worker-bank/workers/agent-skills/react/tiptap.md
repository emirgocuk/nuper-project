# tiptap
Source: https://antigravity.codes/agent-skills/react/tiptap

## AI Worker Instructions
When the user requests functionality related to tiptap, follow these guidelines and utilize this context.

## Scraped Content

# tiptap
```
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm @tiptap/extension-image @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-typography
```
```
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm @tiptap/extension-image @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-typography
```
```
@tiptap/pm
```
```
import { useEditor, EditorContent } from '@tiptap/react'import StarterKit from '@tiptap/starter-kit'export function Editor() {  const editor = useEditor({    extensions: [StarterKit],    content: '<p>Hello World!</p>',    immediatelyRender: false, // ⚠️ CRITICAL for SSR/Next.js    editorProps: {      attributes: {        class: 'prose prose-sm focus:outline-none min-h-[200px] p-4',      },    },  })  return <EditorContent editor={editor} />}
```
```
import { useEditor, EditorContent } from '@tiptap/react'import StarterKit from '@tiptap/starter-kit'export function Editor() {  const editor = useEditor({    extensions: [StarterKit],    content: '<p>Hello World!</p>',    immediatelyRender: false, // ⚠️ CRITICAL for SSR/Next.js    editorProps: {      attributes: {        class: 'prose prose-sm focus:outline-none min-h-[200px] p-4',      },    },  })  return <EditorContent editor={editor} />}
```
```
immediatelyRender: false
```
```
immediatelyRender
```
```
false
```
```
npm install @tailwindcss/typography
```
```
npm install @tailwindcss/typography
```
```
tailwind.config.ts
```
```
import typography from '@tailwindcss/typography'export default {  plugins: [typography],}
```
```
import typography from '@tailwindcss/typography'export default {  plugins: [typography],}
```
```
.tiptap
```
```
npx shadcn@latest add https://raw.githubusercontent.com/Aslam97/shadcn-minimal-tiptap/main/registry/block-registry.json
```
```
npx shadcn@latest add https://raw.githubusercontent.com/Aslam97/shadcn-minimal-tiptap/main/registry/block-registry.json
```
```
templates/base-editor.tsx
```
```
templates/common-extensions.ts
```
```
templates/tiptap-prose.css
```
```
import StarterKit from '@tiptap/starter-kit'import Image from '@tiptap/extension-image'import Link from '@tiptap/extension-link'import Typography from '@tiptap/extension-typography'const editor = useEditor({  extensions: [    StarterKit.configure({      // Customize built-in extensions      heading: {        levels: [1, 2, 3],      },      bulletList: {        keepMarks: true,      },    }),    Image.configure({      inline: true,      allowBase64: false, // ⚠️ Prevent base64 bloat      resize: {        enabled: true,        directions: ['top-right', 'bottom-right', 'bottom-left', 'top-left'],        minWidth: 100,        minHeight: 100,        alwaysPreserveAspectRatio: true,      },    }),    Link.configure({      openOnClick: false,      HTMLAttributes: {        class: 'text-primary underline',      },    }),    Typography, // Smart quotes, dashes, etc.  ],})
```
```
import StarterKit from '@tiptap/starter-kit'import Image from '@tiptap/extension-image'import Link from '@tiptap/extension-link'import Typography from '@tiptap/extension-typography'const editor = useEditor({  extensions: [    StarterKit.configure({      // Customize built-in extensions      heading: {        levels: [1, 2, 3],      },      bulletList: {        keepMarks: true,      },    }),    Image.configure({      inline: true,      allowBase64: false, // ⚠️ Prevent base64 bloat      resize: {        enabled: true,        directions: ['top-right', 'bottom-right', 'bottom-left', 'top-left'],        minWidth: 100,        minHeight: 100,        alwaysPreserveAspectRatio: true,      },    }),    Link.configure({      openOnClick: false,      HTMLAttributes: {        class: 'text-primary underline',      },    }),    Typography, // Smart quotes, dashes, etc.  ],})
```
```
allowBase64: false
```
```
templates/image-upload-r2.tsx
```
```
import { Editor } from '@tiptap/core'async function uploadImageToR2(file: File, env: Env): Promise<string> {  // 1. Create base64 preview for immediate display  const reader = new FileReader()  const base64 = await new Promise<string>((resolve) => {    reader.onload = () => resolve(reader.result as string)    reader.readAsDataURL(file)  })  // 2. Insert preview into editor  editor.chain().focus().setImage({ src: base64 }).run()  // 3. Upload to R2 in background  const formData = new FormData()  formData.append('file', file)  const response = await fetch('/api/upload', {    method: 'POST',    body: formData,  })  const { url } = await response.json()  // 4. Replace base64 with permanent URL  editor.chain()    .focus()    .updateAttributes('image', { src: url })    .run()  return url}
```
```
import { Editor } from '@tiptap/core'async function uploadImageToR2(file: File, env: Env): Promise<string> {  // 1. Create base64 preview for immediate display  const reader = new FileReader()  const base64 = await new Promise<string>((resolve) => {    reader.onload = () => resolve(reader.result as string)    reader.readAsDataURL(file)  })  // 2. Insert preview into editor  editor.chain().focus().setImage({ src: base64 }).run()  // 3. Upload to R2 in background  const formData = new FormData()  formData.append('file', file)  const response = await fetch('/api/upload', {    method: 'POST',    body: formData,  })  const { url } = await response.json()  // 4. Replace base64 with permanent URL  editor.chain()    .focus()    .updateAttributes('image', { src: url })    .run()  return url}
```
```
immediatelyRender: false
```
```
useEditor()
```
```
@tailwindcss/typography
```
```
@tiptap/pm
```
```
immediatelyRender: true
```
```
prose
```
```
immediatelyRender
```
```
false
```
```
immediatelyRender: true
```
```
immediatelyRender: false
```
```
useEditor()
```
```
useEditorState()
```
```
@tailwindcss/typography
```
```
Error: Looks like multiple versions of prosemirror-model were loaded
```
```
// package.json{  "resolutions": {    "prosemirror-model": "~1.21.0",    "prosemirror-view": "~1.33.0",    "prosemirror-state": "~1.4.3"  }}
```
```
// package.json{  "resolutions": {    "prosemirror-model": "~1.21.0",    "prosemirror-view": "~1.33.0",    "prosemirror-state": "~1.4.3"  }}
```
```
rm -rf node_modules package-lock.jsonnpm install
```
```
rm -rf node_modules package-lock.jsonnpm install
```
```
SSR has been detected, please set 'immediatelyRender' explicitly to 'false'
```
```
// Don't use both together<EditorProvider>  <MyComponent /></EditorProvider>function MyComponent() {  const editor = useEditor({ ... }) // ❌ Wrong - EditorProvider already created editor}
```
```
// Don't use both together<EditorProvider>  <MyComponent /></EditorProvider>function MyComponent() {  const editor = useEditor({ ... }) // ❌ Wrong - EditorProvider already created editor}
```
```
// Option 1: Use EditorProvider only<EditorProvider immediatelyRender={false} extensions={[StarterKit]}>  <EditorContent /></EditorProvider>// Option 2: Use useEditor onlyfunction Editor() {  const editor = useEditor({    extensions: [StarterKit],    immediatelyRender: false,  })  return <EditorContent editor={editor} />}
```
```
// Option 1: Use EditorProvider only<EditorProvider immediatelyRender={false} extensions={[StarterKit]}>  <EditorContent /></EditorProvider>// Option 2: Use useEditor onlyfunction Editor() {  const editor = useEditor({    extensions: [StarterKit],    immediatelyRender: false,  })  return <EditorContent editor={editor} />}
```
```
/* Apply to editor container */.tiptap {  /* Tailwind Typography */  @apply prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none;  /* Custom overrides */  h1 {    @apply text-3xl font-bold mt-8 mb-4;  }  h2 {    @apply text-2xl font-semibold mt-6 mb-3;  }  p {    @apply my-4 text-base leading-7;  }  ul, ol {    @apply my-4 ml-6;  }  code {    @apply bg-muted px-1.5 py-0.5 rounded text-sm font-mono;  }  pre {    @apply bg-muted p-4 rounded-lg overflow-x-auto;  }  blockquote {    @apply border-l-4 border-primary pl-4 italic my-4;  }}
```
```
/* Apply to editor container */.tiptap {  /* Tailwind Typography */  @apply prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none;  /* Custom overrides */  h1 {    @apply text-3xl font-bold mt-8 mb-4;  }  h2 {    @apply text-2xl font-semibold mt-6 mb-3;  }  p {    @apply my-4 text-base leading-7;  }  ul, ol {    @apply my-4 ml-6;  }  code {    @apply bg-muted px-1.5 py-0.5 rounded text-sm font-mono;  }  pre {    @apply bg-muted p-4 rounded-lg overflow-x-auto;  }  blockquote {    @apply border-l-4 border-primary pl-4 italic my-4;  }}
```
```
prose
```
```
dark:prose-invert
```
```
import { useEditor } from '@tiptap/react'import Collaboration from '@tiptap/extension-collaboration'import * as Y from 'yjs'const ydoc = new Y.Doc()const editor = useEditor({  extensions: [    StarterKit.configure({      history: false, // Disable history for collaboration    }),    Collaboration.configure({      document: ydoc,    }),  ],})
```
```
import { useEditor } from '@tiptap/react'import Collaboration from '@tiptap/extension-collaboration'import * as Y from 'yjs'const ydoc = new Y.Doc()const editor = useEditor({  extensions: [    StarterKit.configure({      history: false, // Disable history for collaboration    }),    Collaboration.configure({      document: ydoc,    }),  ],})
```
```
templates/collaborative-setup.tsx
```
```
import { useEditor } from '@tiptap/react'import StarterKit from '@tiptap/starter-kit'import { Markdown } from '@tiptap/markdown'// Load editor with markdown contentconst editor = useEditor({  extensions: [StarterKit, Markdown],  content: '# Hello World\n\nThis is **Markdown**!',  contentType: 'markdown',  // ⚠️ CRITICAL: Must specify or content parsed as HTML  immediatelyRender: false,})// Get markdown from editorconst markdownOutput = editor.getMarkdown()// Insert markdown contenteditor.commands.setContent('## New heading', { contentType: 'markdown' })editor.commands.insertContent('**Bold** text', { contentType: 'markdown' })
```
```
import { useEditor } from '@tiptap/react'import StarterKit from '@tiptap/starter-kit'import { Markdown } from '@tiptap/markdown'// Load editor with markdown contentconst editor = useEditor({  extensions: [StarterKit, Markdown],  content: '# Hello World\n\nThis is **Markdown**!',  contentType: 'markdown',  // ⚠️ CRITICAL: Must specify or content parsed as HTML  immediatelyRender: false,})// Get markdown from editorconst markdownOutput = editor.getMarkdown()// Insert markdown contenteditor.commands.setContent('## New heading', { contentType: 'markdown' })editor.commands.insertContent('**Bold** text', { contentType: 'markdown' })
```
```
npm install @tiptap/markdown@3.16.0
```
```
contentType: 'markdown'
```
```
import { useForm, Controller } from 'react-hook-form'function BlogForm() {  const { control, handleSubmit } = useForm()  return (    <form onSubmit={handleSubmit(onSubmit)}>      <Controller        name="content"        control={control}        render={({ field }) => (          <Editor            content={field.value}            onUpdate={({ editor }) => {              field.onChange(editor.getHTML())            }}          />        )}      />    </form>  )}
```
```
import { useForm, Controller } from 'react-hook-form'function BlogForm() {  const { control, handleSubmit } = useForm()  return (    <form onSubmit={handleSubmit(onSubmit)}>      <Controller        name="content"        control={control}        render={({ field }) => (          <Editor            content={field.value}            onUpdate={({ editor }) => {              field.onChange(editor.getHTML())            }}          />        )}      />    </form>  )}
```
```
templates/base-editor.tsx
```
```
templates/package.json
```
```
templates/minimal-tiptap-setup.sh
```
```
templates/image-upload-r2.tsx
```
```
templates/tiptap-prose.css
```
```
templates/collaborative-setup.tsx
```
```
templates/common-extensions.ts
```
```
references/tiptap-docs.md
```
```
references/common-errors.md
```
```
references/extension-catalog.md
```
```
import { Node } from '@tiptap/core'const CustomNode = Node.create({  name: 'customNode',  group: 'block',  content: 'inline*',  parseHTML() {    return [{ tag: 'div[data-custom]' }]  },  renderHTML({ HTMLAttributes }) {    return ['div', { 'data-custom': '', ...HTMLAttributes }, 0]  },  addCommands() {    return {      insertCustomNode: () => ({ commands }) => {        return commands.insertContent({ type: this.name })      },    }  },})
```
```
import { Node } from '@tiptap/core'const CustomNode = Node.create({  name: 'customNode',  group: 'block',  content: 'inline*',  parseHTML() {    return [{ tag: 'div[data-custom]' }]  },  renderHTML({ HTMLAttributes }) {    return ['div', { 'data-custom': '', ...HTMLAttributes }, 0]  },  addCommands() {    return {      insertCustomNode: () => ({ commands }) => {        return commands.insertContent({ type: this.name })      },    }  },})
```
```
/
```
```
import { Extension } from '@tiptap/core'import Suggestion from '@tiptap/suggestion'const SlashCommands = Extension.create({  name: 'slashCommands',  addOptions() {    return {      suggestion: {        char: '/',        items: ({ query }) => {          return [            { title: 'Heading 1', command: ({ editor, range }) => {              editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()            }},            { title: 'Bullet List', command: ({ editor, range }) => {              editor.chain().focus().deleteRange(range).toggleBulletList().run()            }},          ]        },      },    }  },  addProseMirrorPlugins() {    return [Suggestion({ editor: this.editor, ...this.options.suggestion })]  },})
```
```
import { Extension } from '@tiptap/core'import Suggestion from '@tiptap/suggestion'const SlashCommands = Extension.create({  name: 'slashCommands',  addOptions() {    return {      suggestion: {        char: '/',        items: ({ query }) => {          return [            { title: 'Heading 1', command: ({ editor, range }) => {              editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()            }},            { title: 'Bullet List', command: ({ editor, range }) => {              editor.chain().focus().deleteRange(range).toggleBulletList().run()            }},          ]        },      },    }  },  addProseMirrorPlugins() {    return [Suggestion({ editor: this.editor, ...this.options.suggestion })]  },})
```
```
@tiptap/react@^3.16.0
```
```
@tiptap/starter-kit@^3.16.0
```
```
@tiptap/pm@^3.16.0
```
```
react@^19.0.0
```
```
@tiptap/extension-audio@^3.16.0
```
```
@tiptap/extension-image@^3.16.0
```
```
@tiptap/extension-link@^3.16.0
```
```
@tiptap/extension-color@^3.16.0
```
```
@tiptap/extension-typography@^3.16.0
```
```
@tiptap/extension-collaboration@^3.16.0
```
```
@tiptap/extension-markdown@^3.16.0
```
```
@tailwindcss/typography@^0.5.19
```
```
yjs@^13.6.0
```
```
react-medium-image-zoom@^5.2.0
```
```
{  "dependencies": {    "@tiptap/react": "^3.16.0",    "@tiptap/starter-kit": "^3.16.0",    "@tiptap/pm": "^3.16.0",    "@tiptap/extension-audio": "^3.16.0",    "@tiptap/extension-image": "^3.16.0",    "@tiptap/extension-color": "^3.16.0",    "@tiptap/extension-text-style": "^3.16.0",    "@tiptap/extension-typography": "^3.16.0",    "@tiptap/extension-link": "^3.16.0",    "@tiptap/extension-markdown": "^3.16.0"  },  "devDependencies": {    "@tailwindcss/typography": "^0.5.19",    "react": "^19.2.3",    "react-dom": "^19.2.3"  }}
```
```
{  "dependencies": {    "@tiptap/react": "^3.16.0",    "@tiptap/starter-kit": "^3.16.0",    "@tiptap/pm": "^3.16.0",    "@tiptap/extension-audio": "^3.16.0",    "@tiptap/extension-image": "^3.16.0",    "@tiptap/extension-color": "^3.16.0",    "@tiptap/extension-text-style": "^3.16.0",    "@tiptap/extension-typography": "^3.16.0",    "@tiptap/extension-link": "^3.16.0",    "@tiptap/extension-markdown": "^3.16.0"  },  "devDependencies": {    "@tailwindcss/typography": "^0.5.19",    "react": "^19.2.3",    "react-dom": "^19.2.3"  }}
```
```
immediatelyRender
```
```
false
```
```
immediatelyRender: false
```
```
useEditor()
```
```
@tailwindcss/typography
```
```
prose
```
```
useEditorState()
```
```
useEditor()
```
```
allowBase64: false
```
```
@tiptap/react
```
```
@tiptap/starter-kit
```
```
@tiptap/pm
```
```
immediatelyRender: false
```
```
useEditor()
```
```
@tailwindcss/typography
```
```
prose
```
```
allowBase64: false
```
```
references/common-errors.md
```
```
immediatelyRender: false
```
```
@tiptap/pm
```
```
/* ❌ v2 default (causes hydration mismatch in SSR) */const editor = useEditor({  extensions: [StarterKit],  content: '<p>Hello</p>',})/* ✅ v3 SSR-safe */const editor = useEditor({  extensions: [StarterKit],  content: '<p>Hello</p>',  immediatelyRender: false, // CRITICAL for Next.js/SSR})
```
```
/* ❌ v2 default (causes hydration mismatch in SSR) */const editor = useEditor({  extensions: [StarterKit],  content: '<p>Hello</p>',})/* ✅ v3 SSR-safe */const editor = useEditor({  extensions: [StarterKit],  content: '<p>Hello</p>',  immediatelyRender: false, // CRITICAL for Next.js/SSR})
```
```
immediatelyRender
```
```
false
```
```
# ❌ Missing peer dependency (causes runtime errors)npm install @tiptap/react @tiptap/starter-kit# ✅ Include ProseMirror enginenpm install @tiptap/react @tiptap/starter-kit @tiptap/pm
```
```
# ❌ Missing peer dependency (causes runtime errors)npm install @tiptap/react @tiptap/starter-kit# ✅ Include ProseMirror enginenpm install @tiptap/react @tiptap/starter-kit @tiptap/pm
```
```
/* ❌ v2 extension config */StarterKit.configure({  heading: { levels: [1, 2, 3] },})/* ✅ v3 extension config (same API, verify import) */import StarterKit from '@tiptap/starter-kit'StarterKit.configure({  heading: { levels: [1, 2, 3] },})
```
```
/* ❌ v2 extension config */StarterKit.configure({  heading: { levels: [1, 2, 3] },})/* ✅ v3 extension config (same API, verify import) */import StarterKit from '@tiptap/starter-kit'StarterKit.configure({  heading: { levels: [1, 2, 3] },})
```
```
/* ❌ v2 onUpdate signature */onUpdate: ({ editor }) => {  const html = editor.getHTML()}/* ✅ v3 (same API, but check for transaction) */onUpdate: ({ editor, transaction }) => {  if (transaction.docChanged) {    const html = editor.getHTML()    onChange?.(html)  }}
```
```
/* ❌ v2 onUpdate signature */onUpdate: ({ editor }) => {  const html = editor.getHTML()}/* ✅ v3 (same API, but check for transaction) */onUpdate: ({ editor, transaction }) => {  if (transaction.docChanged) {    const html = editor.getHTML()    onChange?.(html)  }}
```
```
/* ❌ Old import path */import Image from '@tiptap/extension-image'/* ✅ v3 import */import Image from '@tiptap/extension-image'Image.configure({  inline: true,  allowBase64: true, // For data URLs})
```
```
/* ❌ Old import path */import Image from '@tiptap/extension-image'/* ✅ v3 import */import Image from '@tiptap/extension-image'Image.configure({  inline: true,  allowBase64: true, // For data URLs})
```
```
useEditor({...})
```
```
immediatelyRender: false
```
```
@tiptap/pm
```
```
editor.commands.setContent()
```
```
useEffect
```
```
onUpdate
```
```
editor.chain().focus().insertContent()
```
```
getHTML()
```
This AI Agent Skill for Tiptap empowers developers to seamlessly integrate and configure the versatile Tiptap rich text editor into their applications, particularly those built with React. It provides quick access to installation steps, essential dependencies, and foundational code for an SSR-safe editor, enabling rapid development of content-rich features. By leveraging this skill, you can efficiently set up complex editing environments, ensuring adherence to best practices and accelerating your project's frontend development cycle without extensive manual research.

# When to Use This Skill
- •Building a blogging platform or CMS where users need to create and edit rich text content.
- •Developing an in-app messaging system or forum that supports formatted messages, links, and images.
- •Implementing a collaborative document editor similar to Notion or Google Docs within a web application.
- •Integrating a powerful WYSIWYG editor into an administrative panel for dynamic website content management.

# Pro Tips
- 💡Always start with the `StarterKit` to get a foundational set of extensions, then add specific ones like `Image` or `Color` as needed, avoiding unnecessary bloat.
- 💡Pay close attention to dependency versions, especially for `ProseMirror` and `Tiptap` itself, to ensure compatibility and leverage the latest features and bug fixes.
- 💡When integrating Tiptap into SSR frameworks like Next.js, ensure your editor component is client-side rendered or handled safely to prevent hydration mismatches.

