# shadcn-ui
Source: https://antigravity.codes/agent-skills/react/shadcn-ui

## AI Worker Instructions
When the user requests functionality related to shadcn-ui, follow these guidelines and utilize this context.

## Scraped Content

# shadcn-ui
```
# Create Next.js project with shadcn/uinpx create-next-app@latest my-app --typescript --tailwind --eslint --appcd my-appnpx shadcn@latest init# Install essential componentsnpx shadcn@latest add button input form card dialog select
```
```
# Create Next.js project with shadcn/uinpx create-next-app@latest my-app --typescript --tailwind --eslint --appcd my-appnpx shadcn@latest init# Install essential componentsnpx shadcn@latest add button input form card dialog select
```
```
# Install dependenciesnpm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react# Initialize shadcn/uinpx shadcn@latest init
```
```
# Install dependenciesnpm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react# Initialize shadcn/uinpx shadcn@latest init
```
```
# Initialize shadcn/ui in your projectnpx shadcn@latest init
```
```
# Initialize shadcn/ui in your projectnpx shadcn@latest init
```
```
# Install a single componentnpx shadcn@latest add button# Install multiple componentsnpx shadcn@latest add button input form# Install all componentsnpx shadcn@latest add --all
```
```
# Install a single componentnpx shadcn@latest add button# Install multiple componentsnpx shadcn@latest add button input form# Install all componentsnpx shadcn@latest add --all
```
```
# Install dependencies for a specific componentnpm install @radix-ui/react-slot# Copy component code from ui.shadcn.com# Place in src/components/ui/
```
```
# Install dependencies for a specific componentnpm install @radix-ui/react-slot# Copy component code from ui.shadcn.com# Place in src/components/ui/
```
```
{  "dependencies": {    "@radix-ui/react-accordion": "^1.1.2",    "@radix-ui/react-alert-dialog": "^1.0.5",    "@radix-ui/react-dialog": "^1.0.5",    "@radix-ui/react-dropdown-menu": "^2.0.6",    "@radix-ui/react-label": "^2.0.2",    "@radix-ui/react-select": "^2.0.0",    "@radix-ui/react-separator": "^1.0.3",    "@radix-ui/react-slot": "^1.0.2",    "@radix-ui/react-toast": "^1.1.5",    "class-variance-authority": "^0.7.0",    "clsx": "^2.0.0",    "lucide-react": "^0.294.0",    "tailwind-merge": "^2.0.0",    "tailwindcss-animate": "^1.0.7"  }}
```
```
{  "dependencies": {    "@radix-ui/react-accordion": "^1.1.2",    "@radix-ui/react-alert-dialog": "^1.0.5",    "@radix-ui/react-dialog": "^1.0.5",    "@radix-ui/react-dropdown-menu": "^2.0.6",    "@radix-ui/react-label": "^2.0.2",    "@radix-ui/react-select": "^2.0.0",    "@radix-ui/react-separator": "^1.0.3",    "@radix-ui/react-slot": "^1.0.2",    "@radix-ui/react-toast": "^1.1.5",    "class-variance-authority": "^0.7.0",    "clsx": "^2.0.0",    "lucide-react": "^0.294.0",    "tailwind-merge": "^2.0.0",    "tailwindcss-animate": "^1.0.7"  }}
```
```
{  "compilerOptions": {    "target": "es5",    "lib": ["dom", "dom.iterable", "es6"],    "allowJs": true,    "skipLibCheck": true,    "strict": true,    "forceConsistentCasingInFileNames": true,    "noEmit": true,    "esModuleInterop": true,    "module": "esnext",    "moduleResolution": "node",    "resolveJsonModule": true,    "isolatedModules": true,    "jsx": "preserve",    "incremental": true,    "plugins": [      {        "name": "next"      }    ],    "baseUrl": ".",    "paths": {      "@/components/*": ["./src/components/*"],      "@/lib/*": ["./src/lib/*"]    }  },  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],  "exclude": ["node_modules"]}
```
```
{  "compilerOptions": {    "target": "es5",    "lib": ["dom", "dom.iterable", "es6"],    "allowJs": true,    "skipLibCheck": true,    "strict": true,    "forceConsistentCasingInFileNames": true,    "noEmit": true,    "esModuleInterop": true,    "module": "esnext",    "moduleResolution": "node",    "resolveJsonModule": true,    "isolatedModules": true,    "jsx": "preserve",    "incremental": true,    "plugins": [      {        "name": "next"      }    ],    "baseUrl": ".",    "paths": {      "@/components/*": ["./src/components/*"],      "@/lib/*": ["./src/lib/*"]    }  },  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],  "exclude": ["node_modules"]}
```
```
// tailwind.config.js/** @type {import('tailwindcss').Config} */module.exports = {  darkMode: ["class"],  content: [    './pages/**/*.{ts,tsx}',    './components/**/*.{ts,tsx}',    './app/**/*.{ts,tsx}',    './src/**/*.{ts,tsx}',  ],  prefix: "",  theme: {    container: {      center: true,      padding: "2rem",      screens: {        "2xl": "1400px",      },    },    extend: {      colors: {        border: "hsl(var(--border))",        input: "hsl(var(--input))",        ring: "hsl(var(--ring))",        background: "hsl(var(--background))",        foreground: "hsl(var(--foreground))",        primary: {          DEFAULT: "hsl(var(--primary))",          foreground: "hsl(var(--primary-foreground))",        },        secondary: {          DEFAULT: "hsl(var(--secondary))",          foreground: "hsl(var(--secondary-foreground))",        },        destructive: {          DEFAULT: "hsl(var(--destructive))",          foreground: "hsl(var(--destructive-foreground))",        },        muted: {          DEFAULT: "hsl(var(--muted))",          foreground: "hsl(var(--muted-foreground))",        },        accent: {          DEFAULT: "hsl(var(--accent))",          foreground: "hsl(var(--accent-foreground))",        },        popover: {          DEFAULT: "hsl(var(--popover))",          foreground: "hsl(var(--popover-foreground))",        },        card: {          DEFAULT: "hsl(var(--card))",          foreground: "hsl(var(--card-foreground))",        },      },      borderRadius: {        lg: "var(--radius)",        md: "calc(var(--radius) - 2px)",        sm: "calc(var(--radius) - 4px)",      },      keyframes: {        "accordion-down": {          from: { height: "0" },          to: { height: "var(--radix-accordion-content-height)" },        },        "accordion-up": {          from: { height: "var(--radix-accordion-content-height)" },          to: { height: "0" },        },      },      animation: {        "accordion-down": "accordion-down 0.2s ease-out",        "accordion-up": "accordion-up 0.2s ease-out",      },    },  },  plugins: [require("tailwindcss-animate")],}
```
```
// tailwind.config.js/** @type {import('tailwindcss').Config} */module.exports = {  darkMode: ["class"],  content: [    './pages/**/*.{ts,tsx}',    './components/**/*.{ts,tsx}',    './app/**/*.{ts,tsx}',    './src/**/*.{ts,tsx}',  ],  prefix: "",  theme: {    container: {      center: true,      padding: "2rem",      screens: {        "2xl": "1400px",      },    },    extend: {      colors: {        border: "hsl(var(--border))",        input: "hsl(var(--input))",        ring: "hsl(var(--ring))",        background: "hsl(var(--background))",        foreground: "hsl(var(--foreground))",        primary: {          DEFAULT: "hsl(var(--primary))",          foreground: "hsl(var(--primary-foreground))",        },        secondary: {          DEFAULT: "hsl(var(--secondary))",          foreground: "hsl(var(--secondary-foreground))",        },        destructive: {          DEFAULT: "hsl(var(--destructive))",          foreground: "hsl(var(--destructive-foreground))",        },        muted: {          DEFAULT: "hsl(var(--muted))",          foreground: "hsl(var(--muted-foreground))",        },        accent: {          DEFAULT: "hsl(var(--accent))",          foreground: "hsl(var(--accent-foreground))",        },        popover: {          DEFAULT: "hsl(var(--popover))",          foreground: "hsl(var(--popover-foreground))",        },        card: {          DEFAULT: "hsl(var(--card))",          foreground: "hsl(var(--card-foreground))",        },      },      borderRadius: {        lg: "var(--radius)",        md: "calc(var(--radius) - 2px)",        sm: "calc(var(--radius) - 4px)",      },      keyframes: {        "accordion-down": {          from: { height: "0" },          to: { height: "var(--radix-accordion-content-height)" },        },        "accordion-up": {          from: { height: "var(--radix-accordion-content-height)" },          to: { height: "0" },        },      },      animation: {        "accordion-down": "accordion-down 0.2s ease-out",        "accordion-up": "accordion-up 0.2s ease-out",      },    },  },  plugins: [require("tailwindcss-animate")],}
```
```
@tailwind base;@tailwind components;@tailwind utilities;@layer base {  :root {    --background: 0 0% 100%;    --foreground: 222.2 84% 4.9%;    --card: 0 0% 100%;    --card-foreground: 222.2 84% 4.9%;    --popover: 0 0% 100%;    --popover-foreground: 222.2 84% 4.9%;    --primary: 222.2 47.4% 11.2%;    --primary-foreground: 210 40% 98%;    --secondary: 210 40% 96.1%;    --secondary-foreground: 222.2 47.4% 11.2%;    --muted: 210 40% 96.1%;    --muted-foreground: 215.4 16.3% 46.9%;    --accent: 210 40% 96.1%;    --accent-foreground: 222.2 47.4% 11.2%;    --destructive: 0 84.2% 60.2%;    --destructive-foreground: 210 40% 98%;    --border: 214.3 31.8% 91.4%;    --input: 214.3 31.8% 91.4%;    --ring: 222.2 84% 4.9%;    --radius: 0.5rem;  }  .dark {    --background: 222.2 84% 4.9%;    --foreground: 210 40% 98%;    --card: 222.2 84% 4.9%;    --card-foreground: 210 40% 98%;    --popover: 222.2 84% 4.9%;    --popover-foreground: 210 40% 98%;    --primary: 210 40% 98%;    --primary-foreground: 222.2 47.4% 11.2%;    --secondary: 217.2 32.6% 17.5%;    --secondary-foreground: 210 40% 98%;    --muted: 217.2 32.6% 17.5%;    --muted-foreground: 215 20.2% 65.1%;    --accent: 217.2 32.6% 17.5%;    --accent-foreground: 210 40% 98%;    --destructive: 0 62.8% 30.6%;    --destructive-foreground: 210 40% 98%;    --border: 217.2 32.6% 17.5%;    --input: 217.2 32.6% 17.5%;    --ring: 212.7 26.8% 83.9%;  }}@layer base {  * {    @apply border-border;  }  body {    @apply bg-background text-foreground;  }}
```
```
@tailwind base;@tailwind components;@tailwind utilities;@layer base {  :root {    --background: 0 0% 100%;    --foreground: 222.2 84% 4.9%;    --card: 0 0% 100%;    --card-foreground: 222.2 84% 4.9%;    --popover: 0 0% 100%;    --popover-foreground: 222.2 84% 4.9%;    --primary: 222.2 47.4% 11.2%;    --primary-foreground: 210 40% 98%;    --secondary: 210 40% 96.1%;    --secondary-foreground: 222.2 47.4% 11.2%;    --muted: 210 40% 96.1%;    --muted-foreground: 215.4 16.3% 46.9%;    --accent: 210 40% 96.1%;    --accent-foreground: 222.2 47.4% 11.2%;    --destructive: 0 84.2% 60.2%;    --destructive-foreground: 210 40% 98%;    --border: 214.3 31.8% 91.4%;    --input: 214.3 31.8% 91.4%;    --ring: 222.2 84% 4.9%;    --radius: 0.5rem;  }  .dark {    --background: 222.2 84% 4.9%;    --foreground: 210 40% 98%;    --card: 222.2 84% 4.9%;    --card-foreground: 210 40% 98%;    --popover: 222.2 84% 4.9%;    --popover-foreground: 210 40% 98%;    --primary: 210 40% 98%;    --primary-foreground: 222.2 47.4% 11.2%;    --secondary: 217.2 32.6% 17.5%;    --secondary-foreground: 210 40% 98%;    --muted: 217.2 32.6% 17.5%;    --muted-foreground: 215 20.2% 65.1%;    --accent: 217.2 32.6% 17.5%;    --accent-foreground: 210 40% 98%;    --destructive: 0 62.8% 30.6%;    --destructive-foreground: 210 40% 98%;    --border: 217.2 32.6% 17.5%;    --input: 217.2 32.6% 17.5%;    --ring: 212.7 26.8% 83.9%;  }}@layer base {  * {    @apply border-border;  }  body {    @apply bg-background text-foreground;  }}
```
```
npx shadcn@latest add button
```
```
npx shadcn@latest add button
```
```
import { Button } from "@/components/ui/button";export function ButtonDemo() {  return <Button>Click me</Button>;}
```
```
import { Button } from "@/components/ui/button";export function ButtonDemo() {  return <Button>Click me</Button>;}
```
```
import { Button } from "@/components/ui/button";export function ButtonVariants() {  return (    <div className="flex gap-4">      <Button variant="default">Default</Button>      <Button variant="destructive">Destructive</Button>      <Button variant="outline">Outline</Button>      <Button variant="secondary">Secondary</Button>      <Button variant="ghost">Ghost</Button>      <Button variant="link">Link</Button>    </div>  );}
```
```
import { Button } from "@/components/ui/button";export function ButtonVariants() {  return (    <div className="flex gap-4">      <Button variant="default">Default</Button>      <Button variant="destructive">Destructive</Button>      <Button variant="outline">Outline</Button>      <Button variant="secondary">Secondary</Button>      <Button variant="ghost">Ghost</Button>      <Button variant="link">Link</Button>    </div>  );}
```
```
<div className="flex gap-4 items-center">  <Button size="default">Default</Button>  <Button size="sm">Small</Button>  <Button size="lg">Large</Button>  <Button size="icon">    <Icon className="h-4 w-4" />  </Button></div>
```
```
<div className="flex gap-4 items-center">  <Button size="default">Default</Button>  <Button size="sm">Small</Button>  <Button size="lg">Large</Button>  <Button size="icon">    <Icon className="h-4 w-4" />  </Button></div>
```
```
import { Button } from "@/components/ui/button";import { Loader2 } from "lucide-react";export function ButtonLoading() {  return (    <Button disabled>      <Loader2 className="mr-2 h-4 w-4 animate-spin" />      Please wait    </Button>  );}
```
```
import { Button } from "@/components/ui/button";import { Loader2 } from "lucide-react";export function ButtonLoading() {  return (    <Button disabled>      <Loader2 className="mr-2 h-4 w-4 animate-spin" />      Please wait    </Button>  );}
```
```
npx shadcn@latest add input
```
```
npx shadcn@latest add input
```
```
import { Input } from "@/components/ui/input";export function InputDemo() {  return <Input type="email" placeholder="Email" />;}
```
```
import { Input } from "@/components/ui/input";export function InputDemo() {  return <Input type="email" placeholder="Email" />;}
```
```
import { Input } from "@/components/ui/input";import { Label } from "@/components/ui/label";export function InputWithLabel() {  return (    <div className="grid w-full max-w-sm items-center gap-1.5">      <Label htmlFor="email">Email</Label>      <Input type="email" id="email" placeholder="Email" />    </div>  );}
```
```
import { Input } from "@/components/ui/input";import { Label } from "@/components/ui/label";export function InputWithLabel() {  return (    <div className="grid w-full max-w-sm items-center gap-1.5">      <Label htmlFor="email">Email</Label>      <Input type="email" id="email" placeholder="Email" />    </div>  );}
```
```
import { Button } from "@/components/ui/button";import { Input } from "@/components/ui/input";export function InputWithButton() {  return (    <div className="flex w-full max-w-sm items-center gap-2">      <Input type="email" placeholder="Email" />      <Button type="submit" variant="outline">Subscribe</Button>    </div>  );}
```
```
import { Button } from "@/components/ui/button";import { Input } from "@/components/ui/input";export function InputWithButton() {  return (    <div className="flex w-full max-w-sm items-center gap-2">      <Input type="email" placeholder="Email" />      <Button type="submit" variant="outline">Subscribe</Button>    </div>  );}
```
```
npx shadcn@latest add form
```
```
npx shadcn@latest add form
```
```
"use client"import { zodResolver } from "@hookform/resolvers/zod"import { useForm } from "react-hook-form"import * as z from "zod"import { Button } from "@/components/ui/button"import {  Form,  FormControl,  FormDescription,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"import { Input } from "@/components/ui/input"import { toast } from "@/components/ui/use-toast"const formSchema = z.object({  username: z.string().min(2, {    message: "Username must be at least 2 characters.",  }),  email: z.string().email({    message: "Please enter a valid email address.",  }),})export function ProfileForm() {  const form = useForm<z.infer<typeof formSchema>>({    resolver: zodResolver(formSchema),    defaultValues: {      username: "",      email: "",    },  })  function onSubmit(values: z.infer<typeof formSchema>) {    toast({      title: "You submitted the following values:",      description: (        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">          <code className="text-white">{JSON.stringify(values, null, 2)}</code>        </pre>      ),    })  }  return (    <Form {...form}>      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">        <FormField          control={form.control}          name="username"          render={({ field }) => (            <FormItem>              <FormLabel>Username</FormLabel>              <FormControl>                <Input placeholder="shadcn" {...field} />              </FormControl>              <FormDescription>                This is your public display name.              </FormDescription>              <FormMessage />            </FormItem>          )}        />                <FormField          control={form.control}          name="email"          render={({ field }) => (            <FormItem>              <FormLabel>Email</FormLabel>              <FormControl>                <Input type="email" placeholder="you@example.com" {...field} />              </FormControl>              <FormMessage />            </FormItem>          )}        />                <Button type="submit">Submit</Button>      </form>    </Form>  )}
```
```
"use client"import { zodResolver } from "@hookform/resolvers/zod"import { useForm } from "react-hook-form"import * as z from "zod"import { Button } from "@/components/ui/button"import {  Form,  FormControl,  FormDescription,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"import { Input } from "@/components/ui/input"import { toast } from "@/components/ui/use-toast"const formSchema = z.object({  username: z.string().min(2, {    message: "Username must be at least 2 characters.",  }),  email: z.string().email({    message: "Please enter a valid email address.",  }),})export function ProfileForm() {  const form = useForm<z.infer<typeof formSchema>>({    resolver: zodResolver(formSchema),    defaultValues: {      username: "",      email: "",    },  })  function onSubmit(values: z.infer<typeof formSchema>) {    toast({      title: "You submitted the following values:",      description: (        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">          <code className="text-white">{JSON.stringify(values, null, 2)}</code>        </pre>      ),    })  }  return (    <Form {...form}>      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">        <FormField          control={form.control}          name="username"          render={({ field }) => (            <FormItem>              <FormLabel>Username</FormLabel>              <FormControl>                <Input placeholder="shadcn" {...field} />              </FormControl>              <FormDescription>                This is your public display name.              </FormDescription>              <FormMessage />            </FormItem>          )}        />                <FormField          control={form.control}          name="email"          render={({ field }) => (            <FormItem>              <FormLabel>Email</FormLabel>              <FormControl>                <Input type="email" placeholder="you@example.com" {...field} />              </FormControl>              <FormMessage />            </FormItem>          )}        />                <Button type="submit">Submit</Button>      </form>    </Form>  )}
```
```
npx shadcn@latest add card
```
```
npx shadcn@latest add card
```
```
import {  Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card"export function CardDemo() {  return (    <Card>      <CardHeader>        <CardTitle>Card Title</CardTitle>        <CardDescription>Card Description</CardDescription>      </CardHeader>      <CardContent>        <p>Card Content</p>      </CardContent>      <CardFooter>        <p>Card Footer</p>      </CardFooter>    </Card>  )}
```
```
import {  Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card"export function CardDemo() {  return (    <Card>      <CardHeader>        <CardTitle>Card Title</CardTitle>        <CardDescription>Card Description</CardDescription>      </CardHeader>      <CardContent>        <p>Card Content</p>      </CardContent>      <CardFooter>        <p>Card Footer</p>      </CardFooter>    </Card>  )}
```
```
import { Button } from "@/components/ui/button"import {  Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card"import { Input } from "@/components/ui/input"import { Label } from "@/components/ui/label"export function CardWithForm() {  return (    <Card className="w-[350px]">      <CardHeader>        <CardTitle>Create project</CardTitle>        <CardDescription>Deploy your new project in one-click.</CardDescription>      </CardHeader>      <CardContent>        <form>          <div className="grid w-full items-center gap-4">            <div className="flex flex-col space-y-1.5">              <Label htmlFor="name">Name</Label>              <Input id="name" placeholder="Name of your project" />            </div>          </div>        </form>      </CardContent>      <CardFooter className="flex justify-between">        <Button variant="outline">Cancel</Button>        <Button>Deploy</Button>      </CardFooter>    </Card>  )}
```
```
import { Button } from "@/components/ui/button"import {  Card,  CardContent,  CardDescription,  CardFooter,  CardHeader,  CardTitle,} from "@/components/ui/card"import { Input } from "@/components/ui/input"import { Label } from "@/components/ui/label"export function CardWithForm() {  return (    <Card className="w-[350px]">      <CardHeader>        <CardTitle>Create project</CardTitle>        <CardDescription>Deploy your new project in one-click.</CardDescription>      </CardHeader>      <CardContent>        <form>          <div className="grid w-full items-center gap-4">            <div className="flex flex-col space-y-1.5">              <Label htmlFor="name">Name</Label>              <Input id="name" placeholder="Name of your project" />            </div>          </div>        </form>      </CardContent>      <CardFooter className="flex justify-between">        <Button variant="outline">Cancel</Button>        <Button>Deploy</Button>      </CardFooter>    </Card>  )}
```
```
npx shadcn@latest add dialog
```
```
npx shadcn@latest add dialog
```
```
import { Button } from "@/components/ui/button"import {  Dialog,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,  DialogTrigger,} from "@/components/ui/dialog"export function DialogDemo() {  return (    <Dialog>      <DialogTrigger asChild>        <Button variant="outline">Open Dialog</Button>      </DialogTrigger>      <DialogContent className="sm:max-w-[425px]">        <DialogHeader>          <DialogTitle>Edit profile</DialogTitle>          <DialogDescription>            Make changes to your profile here. Click save when you're done.          </DialogDescription>        </DialogHeader>        <div className="grid gap-4 py-4">          <div className="grid grid-cols-4 items-center gap-4">            <Label htmlFor="name" className="text-right">              Name            </Label>            <Input id="name" value="Pedro Duarte" className="col-span-3" />          </div>        </div>        <DialogFooter>          <Button type="submit">Save changes</Button>        </DialogFooter>      </DialogContent>    </Dialog>  )}
```
```
import { Button } from "@/components/ui/button"import {  Dialog,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,  DialogTrigger,} from "@/components/ui/dialog"export function DialogDemo() {  return (    <Dialog>      <DialogTrigger asChild>        <Button variant="outline">Open Dialog</Button>      </DialogTrigger>      <DialogContent className="sm:max-w-[425px]">        <DialogHeader>          <DialogTitle>Edit profile</DialogTitle>          <DialogDescription>            Make changes to your profile here. Click save when you're done.          </DialogDescription>        </DialogHeader>        <div className="grid gap-4 py-4">          <div className="grid grid-cols-4 items-center gap-4">            <Label htmlFor="name" className="text-right">              Name            </Label>            <Input id="name" value="Pedro Duarte" className="col-span-3" />          </div>        </div>        <DialogFooter>          <Button type="submit">Save changes</Button>        </DialogFooter>      </DialogContent>    </Dialog>  )}
```
```
npx shadcn@latest add sheet
```
```
npx shadcn@latest add sheet
```
```
import { Button } from "@/components/ui/button"import {  Sheet,  SheetContent,  SheetDescription,  SheetHeader,  SheetTitle,  SheetTrigger,} from "@/components/ui/sheet"export function SheetDemo() {  return (    <Sheet>      <SheetTrigger asChild>        <Button variant="outline">Open Sheet</Button>      </SheetTrigger>      <SheetContent>        <SheetHeader>          <SheetTitle>Edit profile</SheetTitle>          <SheetDescription>            Make changes to your profile here. Click save when you're done.          </SheetDescription>        </SheetHeader>        <div className="grid gap-4 py-4">          <div className="grid grid-cols-4 items-center gap-4">            <Label htmlFor="name" className="text-right">              Name            </Label>            <Input id="name" value="Pedro Duarte" className="col-span-3" />          </div>          <div className="grid grid-cols-4 items-center gap-4">            <Label htmlFor="username" className="text-right">              Username            </Label>            <Input id="username" value="@peduarte" className="col-span-3" />          </div>        </div>      </SheetContent>    </Sheet>  )}
```
```
import { Button } from "@/components/ui/button"import {  Sheet,  SheetContent,  SheetDescription,  SheetHeader,  SheetTitle,  SheetTrigger,} from "@/components/ui/sheet"export function SheetDemo() {  return (    <Sheet>      <SheetTrigger asChild>        <Button variant="outline">Open Sheet</Button>      </SheetTrigger>      <SheetContent>        <SheetHeader>          <SheetTitle>Edit profile</SheetTitle>          <SheetDescription>            Make changes to your profile here. Click save when you're done.          </SheetDescription>        </SheetHeader>        <div className="grid gap-4 py-4">          <div className="grid grid-cols-4 items-center gap-4">            <Label htmlFor="name" className="text-right">              Name            </Label>            <Input id="name" value="Pedro Duarte" className="col-span-3" />          </div>          <div className="grid grid-cols-4 items-center gap-4">            <Label htmlFor="username" className="text-right">              Username            </Label>            <Input id="username" value="@peduarte" className="col-span-3" />          </div>        </div>      </SheetContent>    </Sheet>  )}
```
```
<Sheet>  <SheetTrigger asChild>    <Button variant="outline">Open Right Sheet</Button>  </SheetTrigger>  <SheetContent side="right">    <SheetHeader>      <SheetTitle>Settings</SheetTitle>      <SheetDescription>        Configure your application settings here.      </SheetDescription>    </SheetHeader>    {/* Settings content */}  </SheetContent></Sheet>
```
```
<Sheet>  <SheetTrigger asChild>    <Button variant="outline">Open Right Sheet</Button>  </SheetTrigger>  <SheetContent side="right">    <SheetHeader>      <SheetTitle>Settings</SheetTitle>      <SheetDescription>        Configure your application settings here.      </SheetDescription>    </SheetHeader>    {/* Settings content */}  </SheetContent></Sheet>
```
```
npx shadcn@latest add menubar
```
```
npx shadcn@latest add menubar
```
```
import {  Menubar,  MenubarContent,  MenubarItem,  MenubarMenu,  MenubarSeparator,  MenubarShortcut,  MenubarSub,  MenubarSubContent,  MenubarSubTrigger,  MenubarTrigger,} from "@/components/ui/menubar"export function MenubarDemo() {  return (    <Menubar>      <MenubarMenu>        <MenubarTrigger>File</MenubarTrigger>        <MenubarContent>          <MenubarItem>            New Tab <MenubarShortcut>⌘T</MenubarShortcut>          </MenubarItem>          <MenubarItem>            New Window <MenubarShortcut>⌘N</MenubarShortcut>          </MenubarItem>          <MenubarSeparator />          <MenubarItem>Share</MenubarItem>          <MenubarSeparator />          <MenubarItem>Print</MenubarItem>        </MenubarContent>      </MenubarMenu>      <MenubarMenu>        <MenubarTrigger>Edit</MenubarTrigger>        <MenubarContent>          <MenubarItem>            Undo <MenubarShortcut>⌘Z</MenubarShortcut>          </MenubarItem>          <MenubarItem>            Redo <MenubarShortcut>⌘Y</MenubarShortcut>          </MenubarItem>          <MenubarSeparator />          <MenubarSub>            <MenubarSubTrigger>Find</MenubarSubTrigger>            <MenubarSubContent>              <MenubarItem>Search the web</MenubarItem>              <MenubarItem>Find...</MenubarItem>              <MenubarItem>Find Next</MenubarItem>              <MenubarItem>Find Previous</MenubarItem>            </MenubarSubContent>          </MenubarSub>        </MenubarContent>      </MenubarMenu>    </Menubar>  )}
```
```
import {  Menubar,  MenubarContent,  MenubarItem,  MenubarMenu,  MenubarSeparator,  MenubarShortcut,  MenubarSub,  MenubarSubContent,  MenubarSubTrigger,  MenubarTrigger,} from "@/components/ui/menubar"export function MenubarDemo() {  return (    <Menubar>      <MenubarMenu>        <MenubarTrigger>File</MenubarTrigger>        <MenubarContent>          <MenubarItem>            New Tab <MenubarShortcut>⌘T</MenubarShortcut>          </MenubarItem>          <MenubarItem>            New Window <MenubarShortcut>⌘N</MenubarShortcut>          </MenubarItem>          <MenubarSeparator />          <MenubarItem>Share</MenubarItem>          <MenubarSeparator />          <MenubarItem>Print</MenubarItem>        </MenubarContent>      </MenubarMenu>      <MenubarMenu>        <MenubarTrigger>Edit</MenubarTrigger>        <MenubarContent>          <MenubarItem>            Undo <MenubarShortcut>⌘Z</MenubarShortcut>          </MenubarItem>          <MenubarItem>            Redo <MenubarShortcut>⌘Y</MenubarShortcut>          </MenubarItem>          <MenubarSeparator />          <MenubarSub>            <MenubarSubTrigger>Find</MenubarSubTrigger>            <MenubarSubContent>              <MenubarItem>Search the web</MenubarItem>              <MenubarItem>Find...</MenubarItem>              <MenubarItem>Find Next</MenubarItem>              <MenubarItem>Find Previous</MenubarItem>            </MenubarSubContent>          </MenubarSub>        </MenubarContent>      </MenubarMenu>    </Menubar>  )}
```
```
npx shadcn@latest add select
```
```
npx shadcn@latest add select
```
```
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"export function SelectDemo() {  return (    <Select>      <SelectTrigger className="w-[180px]">        <SelectValue placeholder="Select a fruit" />      </SelectTrigger>      <SelectContent>        <SelectItem value="apple">Apple</SelectItem>        <SelectItem value="banana">Banana</SelectItem>        <SelectItem value="orange">Orange</SelectItem>      </SelectContent>    </Select>  )}
```
```
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"export function SelectDemo() {  return (    <Select>      <SelectTrigger className="w-[180px]">        <SelectValue placeholder="Select a fruit" />      </SelectTrigger>      <SelectContent>        <SelectItem value="apple">Apple</SelectItem>        <SelectItem value="banana">Banana</SelectItem>        <SelectItem value="orange">Orange</SelectItem>      </SelectContent>    </Select>  )}
```
```
<FormField  control={form.control}  name="role"  render={({ field }) => (    <FormItem>      <FormLabel>Role</FormLabel>      <Select onValueChange={field.onChange} defaultValue={field.value}>        <FormControl>          <SelectTrigger>            <SelectValue placeholder="Select a role" />          </SelectTrigger>        </FormControl>        <SelectContent>          <SelectItem value="admin">Admin</SelectItem>          <SelectItem value="user">User</SelectItem>          <SelectItem value="guest">Guest</SelectItem>        </SelectContent>      </Select>      <FormMessage />    </FormItem>  )}/>
```
```
<FormField  control={form.control}  name="role"  render={({ field }) => (    <FormItem>      <FormLabel>Role</FormLabel>      <Select onValueChange={field.onChange} defaultValue={field.value}>        <FormControl>          <SelectTrigger>            <SelectValue placeholder="Select a role" />          </SelectTrigger>        </FormControl>        <SelectContent>          <SelectItem value="admin">Admin</SelectItem>          <SelectItem value="user">User</SelectItem>          <SelectItem value="guest">Guest</SelectItem>        </SelectContent>      </Select>      <FormMessage />    </FormItem>  )}/>
```
```
npx shadcn@latest add toast
```
```
npx shadcn@latest add toast
```
```
import { Toaster } from "@/components/ui/toaster"export default function RootLayout({ children }) {  return (    <html lang="en">      <body>        {children}        <Toaster />      </body>    </html>  )}
```
```
import { Toaster } from "@/components/ui/toaster"export default function RootLayout({ children }) {  return (    <html lang="en">      <body>        {children}        <Toaster />      </body>    </html>  )}
```
```
import { useToast } from "@/components/ui/use-toast"import { Button } from "@/components/ui/button"export function ToastDemo() {  const { toast } = useToast()  return (    <Button      onClick={() => {        toast({          title: "Scheduled: Catch up",          description: "Friday, February 10, 2023 at 5:57 PM",        })      }}    >      Show Toast    </Button>  )}
```
```
import { useToast } from "@/components/ui/use-toast"import { Button } from "@/components/ui/button"export function ToastDemo() {  const { toast } = useToast()  return (    <Button      onClick={() => {        toast({          title: "Scheduled: Catch up",          description: "Friday, February 10, 2023 at 5:57 PM",        })      }}    >      Show Toast    </Button>  )}
```
```
// Successtoast({  title: "Success",  description: "Your changes have been saved.",})// Errortoast({  variant: "destructive",  title: "Error",  description: "Something went wrong.",})// With actiontoast({  title: "Uh oh! Something went wrong.",  description: "There was a problem with your request.",  action: <ToastAction altText="Try again">Try again</ToastAction>,})
```
```
// Successtoast({  title: "Success",  description: "Your changes have been saved.",})// Errortoast({  variant: "destructive",  title: "Error",  description: "Something went wrong.",})// With actiontoast({  title: "Uh oh! Something went wrong.",  description: "There was a problem with your request.",  action: <ToastAction altText="Try again">Try again</ToastAction>,})
```
```
npx shadcn@latest add table
```
```
npx shadcn@latest add table
```
```
import {  Table,  TableBody,  TableCaption,  TableCell,  TableHead,  TableHeader,  TableRow,} from "@/components/ui/table"const invoices = [  { invoice: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },  { invoice: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },]export function TableDemo() {  return (    <Table>      <TableCaption>A list of your recent invoices.</TableCaption>      <TableHeader>        <TableRow>          <TableHead>Invoice</TableHead>          <TableHead>Status</TableHead>          <TableHead>Method</TableHead>          <TableHead className="text-right">Amount</TableHead>        </TableRow>      </TableHeader>      <TableBody>        {invoices.map((invoice) => (          <TableRow key={invoice.invoice}>            <TableCell className="font-medium">{invoice.invoice}</TableCell>            <TableCell>{invoice.status}</TableCell>            <TableCell>{invoice.method}</TableCell>            <TableCell className="text-right">{invoice.amount}</TableCell>          </TableRow>        ))}      </TableBody>    </Table>  )}
```
```
import {  Table,  TableBody,  TableCaption,  TableCell,  TableHead,  TableHeader,  TableRow,} from "@/components/ui/table"const invoices = [  { invoice: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },  { invoice: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },]export function TableDemo() {  return (    <Table>      <TableCaption>A list of your recent invoices.</TableCaption>      <TableHeader>        <TableRow>          <TableHead>Invoice</TableHead>          <TableHead>Status</TableHead>          <TableHead>Method</TableHead>          <TableHead className="text-right">Amount</TableHead>        </TableRow>      </TableHeader>      <TableBody>        {invoices.map((invoice) => (          <TableRow key={invoice.invoice}>            <TableCell className="font-medium">{invoice.invoice}</TableCell>            <TableCell>{invoice.status}</TableCell>            <TableCell>{invoice.method}</TableCell>            <TableCell className="text-right">{invoice.amount}</TableCell>          </TableRow>        ))}      </TableBody>    </Table>  )}
```
```
globals.css
```
```
@layer base {  :root {    --background: 0 0% 100%;    --foreground: 222.2 84% 4.9%;    --primary: 222.2 47.4% 11.2%;    --primary-foreground: 210 40% 98%;    --secondary: 210 40% 96.1%;    --secondary-foreground: 222.2 47.4% 11.2%;    --muted: 210 40% 96.1%;    --muted-foreground: 215.4 16.3% 46.9%;    --accent: 210 40% 96.1%;    --accent-foreground: 222.2 47.4% 11.2%;    --destructive: 0 84.2% 60.2%;    --destructive-foreground: 210 40% 98%;    --border: 214.3 31.8% 91.4%;    --input: 214.3 31.8% 91.4%;    --ring: 222.2 84% 4.9%;    --radius: 0.5rem;  }  .dark {    --background: 222.2 84% 4.9%;    --foreground: 210 40% 98%;    --primary: 210 40% 98%;    --primary-foreground: 222.2 47.4% 11.2%;    /* ... other dark mode variables */  }}
```
```
@layer base {  :root {    --background: 0 0% 100%;    --foreground: 222.2 84% 4.9%;    --primary: 222.2 47.4% 11.2%;    --primary-foreground: 210 40% 98%;    --secondary: 210 40% 96.1%;    --secondary-foreground: 222.2 47.4% 11.2%;    --muted: 210 40% 96.1%;    --muted-foreground: 215.4 16.3% 46.9%;    --accent: 210 40% 96.1%;    --accent-foreground: 222.2 47.4% 11.2%;    --destructive: 0 84.2% 60.2%;    --destructive-foreground: 210 40% 98%;    --border: 214.3 31.8% 91.4%;    --input: 214.3 31.8% 91.4%;    --ring: 222.2 84% 4.9%;    --radius: 0.5rem;  }  .dark {    --background: 222.2 84% 4.9%;    --foreground: 210 40% 98%;    --primary: 210 40% 98%;    --primary-foreground: 222.2 47.4% 11.2%;    /* ... other dark mode variables */  }}
```
```
// components/ui/button.tsximport * as React from "react"import { Slot } from "@radix-ui/react-slot"import { cva, type VariantProps } from "class-variance-authority"import { cn } from "@/lib/utils"const buttonVariants = cva(  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",  {    variants: {      variant: {        default: "bg-primary text-primary-foreground hover:bg-primary/90",        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",        outline: "border border-input bg-background hover:bg-accent",        // Add custom variant        custom: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",      },      size: {        default: "h-10 px-4 py-2",        sm: "h-9 rounded-md px-3",        lg: "h-11 rounded-md px-8",        // Add custom size        xl: "h-14 rounded-md px-10 text-lg",      },    },    defaultVariants: {      variant: "default",      size: "default",    },  })export interface ButtonProps  extends React.ButtonHTMLAttributes<HTMLButtonElement>,    VariantProps<typeof buttonVariants> {  asChild?: boolean}const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(  ({ className, variant, size, asChild = false, ...props }, ref) => {    const Comp = asChild ? Slot : "button"    return (      <Comp        className={cn(buttonVariants({ variant, size, className }))}        ref={ref}        {...props}      />    )  })Button.displayName = "Button"export { Button, buttonVariants }
```
```
// components/ui/button.tsximport * as React from "react"import { Slot } from "@radix-ui/react-slot"import { cva, type VariantProps } from "class-variance-authority"import { cn } from "@/lib/utils"const buttonVariants = cva(  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",  {    variants: {      variant: {        default: "bg-primary text-primary-foreground hover:bg-primary/90",        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",        outline: "border border-input bg-background hover:bg-accent",        // Add custom variant        custom: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",      },      size: {        default: "h-10 px-4 py-2",        sm: "h-9 rounded-md px-3",        lg: "h-11 rounded-md px-8",        // Add custom size        xl: "h-14 rounded-md px-10 text-lg",      },    },    defaultVariants: {      variant: "default",      size: "default",    },  })export interface ButtonProps  extends React.ButtonHTMLAttributes<HTMLButtonElement>,    VariantProps<typeof buttonVariants> {  asChild?: boolean}const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(  ({ className, variant, size, asChild = false, ...props }, ref) => {    const Comp = asChild ? Slot : "button"    return (      <Comp        className={cn(buttonVariants({ variant, size, className }))}        ref={ref}        {...props}      />    )  })Button.displayName = "Button"export { Button, buttonVariants }
```
```
"use client"
```
```
// src/components/ui/button.tsx"use client"import * as React from "react"import { Slot } from "@radix-ui/react-slot"import { cva, type VariantProps } from "class-variance-authority"import { cn } from "@/lib/utils"// ... rest of component
```
```
// src/components/ui/button.tsx"use client"import * as React from "react"import { Slot } from "@radix-ui/react-slot"import { cva, type VariantProps } from "class-variance-authority"import { cn } from "@/lib/utils"// ... rest of component
```
```
// app/layout.tsximport { Toaster } from "@/components/ui/toaster"import "./globals.css"export default function RootLayout({  children,}: {  children: React.ReactNode}) {  return (    <html lang="en" suppressHydrationWarning>      <body className="min-h-screen bg-background font-sans antialiased">        {children}        <Toaster />      </body>    </html>  )}
```
```
// app/layout.tsximport { Toaster } from "@/components/ui/toaster"import "./globals.css"export default function RootLayout({  children,}: {  children: React.ReactNode}) {  return (    <html lang="en" suppressHydrationWarning>      <body className="min-h-screen bg-background font-sans antialiased">        {children}        <Toaster />      </body>    </html>  )}
```
```
// app/dashboard/page.tsximport { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"import { ButtonClient } from "@/components/ui/button-client"export default function DashboardPage() {  return (    <div className="container mx-auto p-6">      <Card>        <CardHeader>          <CardTitle>Dashboard</CardTitle>        </CardHeader>        <CardContent>          <ButtonClient>Interactive Button</ButtonClient>        </CardContent>      </Card>    </div>  )}
```
```
// app/dashboard/page.tsximport { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"import { ButtonClient } from "@/components/ui/button-client"export default function DashboardPage() {  return (    <div className="container mx-auto p-6">      <Card>        <CardHeader>          <CardTitle>Dashboard</CardTitle>        </CardHeader>        <CardContent>          <ButtonClient>Interactive Button</ButtonClient>        </CardContent>      </Card>    </div>  )}
```
```
// src/components/ui/button-client.tsx"use client"import { Button } from "./button"export function ButtonClient(props: React.ComponentProps<typeof Button>) {  return <Button {...props} />}
```
```
// src/components/ui/button-client.tsx"use client"import { Button } from "./button"export function ButtonClient(props: React.ComponentProps<typeof Button>) {  return <Button {...props} />}
```
```
// app/api/contact/route.tsimport { NextRequest, NextResponse } from "next/server"import { z } from "zod"const contactSchema = z.object({  name: z.string().min(2),  email: z.string().email(),  message: z.string().min(10),})export async function POST(request: NextRequest) {  try {    const body = await request.json()    const validated = contactSchema.parse(body)    // Process form data    console.log("Form submission:", validated)    return NextResponse.json({ success: true })  } catch (error) {    if (error instanceof z.ZodError) {      return NextResponse.json(        { errors: error.errors },        { status: 400 }      )    }    return NextResponse.json(      { error: "Internal server error" },      { status: 500 }    )  }}
```
```
// app/api/contact/route.tsimport { NextRequest, NextResponse } from "next/server"import { z } from "zod"const contactSchema = z.object({  name: z.string().min(2),  email: z.string().email(),  message: z.string().min(10),})export async function POST(request: NextRequest) {  try {    const body = await request.json()    const validated = contactSchema.parse(body)    // Process form data    console.log("Form submission:", validated)    return NextResponse.json({ success: true })  } catch (error) {    if (error instanceof z.ZodError) {      return NextResponse.json(        { errors: error.errors },        { status: 400 }      )    }    return NextResponse.json(      { error: "Internal server error" },      { status: 500 }    )  }}
```
```
// app/contact/page.tsx"use client"import { zodResolver } from "@hookform/resolvers/zod"import { useForm } from "react-hook-form"import * as z from "zod"import { Button } from "@/components/ui/button"import {  Form,  FormControl,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"import { Input } from "@/components/ui/input"import { Textarea } from "@/components/ui/textarea"import { toast } from "@/components/ui/use-toast"const formSchema = z.object({  name: z.string().min(2),  email: z.string().email(),  message: z.string().min(10),})async function onSubmit(values: z.infer<typeof formSchema>) {  try {    const response = await fetch("/api/contact", {      method: "POST",      headers: { "Content-Type": "application/json" },      body: JSON.stringify(values),    })    if (!response.ok) throw new Error("Failed to submit")    toast({      title: "Success!",      description: "Your message has been sent.",    })  } catch (error) {    toast({      variant: "destructive",      title: "Error",      description: "Failed to send message. Please try again.",    })  }}export default function ContactPage() {  const form = useForm<z.infer<typeof formSchema>>({    resolver: zodResolver(formSchema),  })  return (    <div className="container mx-auto max-w-2xl py-8">      <Form {...form}>        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">          <FormField            control={form.control}            name="name"            render={({ field }) => (              <FormItem>                <FormLabel>Name</FormLabel>                <FormControl>                  <Input placeholder="Your name" {...field} />                </FormControl>                <FormMessage />              </FormItem>            )}          />          <FormField            control={form.control}            name="email"            render={({ field }) => (              <FormItem>                <FormLabel>Email</FormLabel>                <FormControl>                  <Input type="email" placeholder="your@email.com" {...field} />                </FormControl>                <FormMessage />              </FormItem>            )}          />          <FormField            control={form.control}            name="message"            render={({ field }) => (              <FormItem>                <FormLabel>Message</FormLabel>                <FormControl>                  <Textarea                    placeholder="Your message..."                    className="resize-none"                    {...field}                  />                </FormControl>                <FormMessage />              </FormItem>            )}          />          <Button type="submit" className="w-full">            Send Message          </Button>        </form>      </Form>    </div>  )}
```
```
// app/contact/page.tsx"use client"import { zodResolver } from "@hookform/resolvers/zod"import { useForm } from "react-hook-form"import * as z from "zod"import { Button } from "@/components/ui/button"import {  Form,  FormControl,  FormField,  FormItem,  FormLabel,  FormMessage,} from "@/components/ui/form"import { Input } from "@/components/ui/input"import { Textarea } from "@/components/ui/textarea"import { toast } from "@/components/ui/use-toast"const formSchema = z.object({  name: z.string().min(2),  email: z.string().email(),  message: z.string().min(10),})async function onSubmit(values: z.infer<typeof formSchema>) {  try {    const response = await fetch("/api/contact", {      method: "POST",      headers: { "Content-Type": "application/json" },      body: JSON.stringify(values),    })    if (!response.ok) throw new Error("Failed to submit")    toast({      title: "Success!",      description: "Your message has been sent.",    })  } catch (error) {    toast({      variant: "destructive",      title: "Error",      description: "Failed to send message. Please try again.",    })  }}export default function ContactPage() {  const form = useForm<z.infer<typeof formSchema>>({    resolver: zodResolver(formSchema),  })  return (    <div className="container mx-auto max-w-2xl py-8">      <Form {...form}>        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">          <FormField            control={form.control}            name="name"            render={({ field }) => (              <FormItem>                <FormLabel>Name</FormLabel>                <FormControl>                  <Input placeholder="Your name" {...field} />                </FormControl>                <FormMessage />              </FormItem>            )}          />          <FormField            control={form.control}            name="email"            render={({ field }) => (              <FormItem>                <FormLabel>Email</FormLabel>                <FormControl>                  <Input type="email" placeholder="your@email.com" {...field} />                </FormControl>                <FormMessage />              </FormItem>            )}          />          <FormField            control={form.control}            name="message"            render={({ field }) => (              <FormItem>                <FormLabel>Message</FormLabel>                <FormControl>                  <Textarea                    placeholder="Your message..."                    className="resize-none"                    {...field}                  />                </FormControl>                <FormMessage />              </FormItem>            )}          />          <Button type="submit" className="w-full">            Send Message          </Button>        </form>      </Form>    </div>  )}
```
```
// app/layout.tsximport { Metadata } from "next"export const metadata: Metadata = {  title: {    default: "My App",    template: "%s | My App",  },  description: "Built with shadcn/ui and Next.js",}// app/about/page.tsximport { Metadata } from "next"import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"export const metadata: Metadata = {  title: "About Us",  description: "Learn more about our company",}export default function AboutPage() {  return (    <div className="container mx-auto py-8">      <Card>        <CardHeader>          <CardTitle>About Our Company</CardTitle>        </CardHeader>        <CardContent>          <p>We build amazing products with modern web technologies.</p>        </CardContent>      </Card>    </div>  )}
```
```
// app/layout.tsximport { Metadata } from "next"export const metadata: Metadata = {  title: {    default: "My App",    template: "%s | My App",  },  description: "Built with shadcn/ui and Next.js",}// app/about/page.tsximport { Metadata } from "next"import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"export const metadata: Metadata = {  title: "About Us",  description: "Learn more about our company",}export default function AboutPage() {  return (    <div className="container mx-auto py-8">      <Card>        <CardHeader>          <CardTitle>About Our Company</CardTitle>        </CardHeader>        <CardContent>          <p>We build amazing products with modern web technologies.</p>        </CardContent>      </Card>    </div>  )}
```
```
// app/layout.tsximport { Inter } from "next/font/google"import { Toaster } from "@/components/ui/toaster"import { cn } from "@/lib/utils"import "./globals.css"const inter = Inter({ subsets: ["latin"] })export default function RootLayout({  children,}: {  children: React.ReactNode}) {  return (    <html lang="en" suppressHydrationWarning>      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>        {children}        <Toaster />      </body>    </html>  )}
```
```
// app/layout.tsximport { Inter } from "next/font/google"import { Toaster } from "@/components/ui/toaster"import { cn } from "@/lib/utils"import "./globals.css"const inter = Inter({ subsets: ["latin"] })export default function RootLayout({  children,}: {  children: React.ReactNode}) {  return (    <html lang="en" suppressHydrationWarning>      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>        {children}        <Toaster />      </body>    </html>  )}
```
```
const formSchema = z.object({  username: z.string().min(2).max(50),  email: z.string().email(),  bio: z.string().max(160).min(4),  role: z.enum(["admin", "user", "guest"]),  notifications: z.boolean().default(false),})export function AdvancedForm() {  const form = useForm<z.infer<typeof formSchema>>({    resolver: zodResolver(formSchema),    defaultValues: {      username: "",      email: "",      bio: "",      role: "user",      notifications: false,    },  })  function onSubmit(values: z.infer<typeof formSchema>) {    console.log(values)  }  return (    <Form {...form}>      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">        {/* Username field */}        <FormField          control={form.control}          name="username"          render={({ field }) => (            <FormItem>              <FormLabel>Username</FormLabel>              <FormControl>                <Input placeholder="johndoe" {...field} />              </FormControl>              <FormMessage />            </FormItem>          )}        />        {/* Email field */}        <FormField          control={form.control}          name="email"          render={({ field }) => (            <FormItem>              <FormLabel>Email</FormLabel>              <FormControl>                <Input type="email" placeholder="john@example.com" {...field} />              </FormControl>              <FormMessage />            </FormItem>          )}        />        {/* Textarea field */}        <FormField          control={form.control}          name="bio"          render={({ field }) => (            <FormItem>              <FormLabel>Bio</FormLabel>              <FormControl>                <Textarea                  placeholder="Tell us about yourself"                  className="resize-none"                  {...field}                />              </FormControl>              <FormMessage />            </FormItem>          )}        />        {/* Select field */}        <FormField          control={form.control}          name="role"          render={({ field }) => (            <FormItem>              <FormLabel>Role</FormLabel>              <Select onValueChange={field.onChange} defaultValue={field.value}>                <FormControl>                  <SelectTrigger>                    <SelectValue placeholder="Select a role" />                  </SelectTrigger>                </FormControl>                <SelectContent>                  <SelectItem value="admin">Admin</SelectItem>                  <SelectItem value="user">User</SelectItem>                  <SelectItem value="guest">Guest</SelectItem>                </SelectContent>              </Select>              <FormMessage />            </FormItem>          )}        />        {/* Checkbox field */}        <FormField          control={form.control}          name="notifications"          render={({ field }) => (            <FormItem className="flex flex-row items-start space-x-3 space-y-0">              <FormControl>                <Checkbox                  checked={field.value}                  onCheckedChange={field.onChange}                />              </FormControl>              <div className="space-y-1 leading-none">                <FormLabel>Email notifications</FormLabel>                <FormDescription>                  Receive emails about your account activity.                </FormDescription>              </div>            </FormItem>          )}        />        <Button type="submit">Submit</Button>      </form>    </Form>  )}
```
```
const formSchema = z.object({  username: z.string().min(2).max(50),  email: z.string().email(),  bio: z.string().max(160).min(4),  role: z.enum(["admin", "user", "guest"]),  notifications: z.boolean().default(false),})export function AdvancedForm() {  const form = useForm<z.infer<typeof formSchema>>({    resolver: zodResolver(formSchema),    defaultValues: {      username: "",      email: "",      bio: "",      role: "user",      notifications: false,    },  })  function onSubmit(values: z.infer<typeof formSchema>) {    console.log(values)  }  return (    <Form {...form}>      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">        {/* Username field */}        <FormField          control={form.control}          name="username"          render={({ field }) => (            <FormItem>              <FormLabel>Username</FormLabel>              <FormControl>                <Input placeholder="johndoe" {...field} />              </FormControl>              <FormMessage />            </FormItem>          )}        />        {/* Email field */}        <FormField          control={form.control}          name="email"          render={({ field }) => (            <FormItem>              <FormLabel>Email</FormLabel>              <FormControl>                <Input type="email" placeholder="john@example.com" {...field} />              </FormControl>              <FormMessage />            </FormItem>          )}        />        {/* Textarea field */}        <FormField          control={form.control}          name="bio"          render={({ field }) => (            <FormItem>              <FormLabel>Bio</FormLabel>              <FormControl>                <Textarea                  placeholder="Tell us about yourself"                  className="resize-none"                  {...field}                />              </FormControl>              <FormMessage />            </FormItem>          )}        />        {/* Select field */}        <FormField          control={form.control}          name="role"          render={({ field }) => (            <FormItem>              <FormLabel>Role</FormLabel>              <Select onValueChange={field.onChange} defaultValue={field.value}>                <FormControl>                  <SelectTrigger>                    <SelectValue placeholder="Select a role" />                  </SelectTrigger>                </FormControl>                <SelectContent>                  <SelectItem value="admin">Admin</SelectItem>                  <SelectItem value="user">User</SelectItem>                  <SelectItem value="guest">Guest</SelectItem>                </SelectContent>              </Select>              <FormMessage />            </FormItem>          )}        />        {/* Checkbox field */}        <FormField          control={form.control}          name="notifications"          render={({ field }) => (            <FormItem className="flex flex-row items-start space-x-3 space-y-0">              <FormControl>                <Checkbox                  checked={field.value}                  onCheckedChange={field.onChange}                />              </FormControl>              <div className="space-y-1 leading-none">                <FormLabel>Email notifications</FormLabel>                <FormDescription>                  Receive emails about your account activity.                </FormDescription>              </div>            </FormItem>          )}        />        <Button type="submit">Submit</Button>      </form>    </Form>  )}
```
```
<Card className="w-[350px]">  <CardHeader>    <CardTitle>Login</CardTitle>    <CardDescription>Enter your credentials to continue</CardDescription>  </CardHeader>  <CardContent>    <Form {...form}>      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">        <FormField          control={form.control}          name="email"          render={({ field }) => (            <FormItem>              <FormLabel>Email</FormLabel>              <FormControl>                <Input type="email" placeholder="you@example.com" {...field} />              </FormControl>              <FormMessage />            </FormItem>          )}        />        <FormField          control={form.control}          name="password"          render={({ field }) => (            <FormItem>              <FormLabel>Password</FormLabel>              <FormControl>                <Input type="password" {...field} />              </FormControl>              <FormMessage />            </FormItem>          )}        />        <Button type="submit" className="w-full">Login</Button>      </form>    </Form>  </CardContent></Card>
```
```
<Card className="w-[350px]">  <CardHeader>    <CardTitle>Login</CardTitle>    <CardDescription>Enter your credentials to continue</CardDescription>  </CardHeader>  <CardContent>    <Form {...form}>      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">        <FormField          control={form.control}          name="email"          render={({ field }) => (            <FormItem>              <FormLabel>Email</FormLabel>              <FormControl>                <Input type="email" placeholder="you@example.com" {...field} />              </FormControl>              <FormMessage />            </FormItem>          )}        />        <FormField          control={form.control}          name="password"          render={({ field }) => (            <FormItem>              <FormLabel>Password</FormLabel>              <FormControl>                <Input type="password" {...field} />              </FormControl>              <FormMessage />            </FormItem>          )}        />        <Button type="submit" className="w-full">Login</Button>      </form>    </Form>  </CardContent></Card>
```
Leverage this specialized AI Agent Skill to effortlessly integrate and utilize shadcn/ui in your React projects. Designed for developers seeking to build modern, accessible, and highly customizable user interfaces, this skill provides comprehensive guidance from initial setup to advanced component patterns. It streamlines the process of working with Radix UI primitives and Tailwind CSS, ensuring your applications are not only visually appealing but also robust and maintainable. Accelerate your development workflow and implement professional-grade UI solutions with ease.

# When to Use This Skill
- •Setting up a new React project and integrating shadcn/ui for a consistent, accessible UI framework.
- •Implementing complex forms with validation using shadcn/ui components alongside React Hook Form and Zod.
- •Customizing the look and feel of shadcn/ui components to match a specific brand or design system using Tailwind CSS.
- •Building advanced UI patterns such as data tables, modals, dropdowns, and navigation menus with best practices.

# Pro Tips
- 💡Always review the generated component code to understand its structure and ensure it aligns with your project's specific accessibility and styling requirements.
- 💡Utilize the `cn` utility for conditional class merging and best practice Tailwind CSS integration within shadcn/ui components.
- 💡When customizing, prioritize theme variables and `tailwind.config.ts` extensions over direct component style overrides for easier maintenance and future updates across your application.

