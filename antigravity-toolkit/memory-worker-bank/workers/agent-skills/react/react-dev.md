# react-dev
Source: https://antigravity.codes/agent-skills/react/react-dev

## AI Worker Instructions
When the user requests functionality related to react-dev, follow these guidelines and utilize this context.

## Scraped Content

# react-dev
```
// React 19 - ref as regular proptype ButtonProps = {  ref?: React.Ref<HTMLButtonElement>;} & React.ComponentPropsWithoutRef<'button'>;function Button({ ref, children, ...props }: ButtonProps) {  return <button ref={ref} {...props}>{children}</button>;}
```
```
// React 19 - ref as regular proptype ButtonProps = {  ref?: React.Ref<HTMLButtonElement>;} & React.ComponentPropsWithoutRef<'button'>;function Button({ ref, children, ...props }: ButtonProps) {  return <button ref={ref} {...props}>{children}</button>;}
```
```
import { useActionState } from 'react';type FormState = { errors?: string[]; success?: boolean };function Form() {  const [state, formAction, isPending] = useActionState(submitAction, {});  return <form action={formAction}>...</form>;}
```
```
import { useActionState } from 'react';type FormState = { errors?: string[]; success?: boolean };function Form() {  const [state, formAction, isPending] = useActionState(submitAction, {});  return <form action={formAction}>...</form>;}
```
```
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {  const user = use(userPromise); // Suspends until resolved  return <div>{user.name}</div>;}
```
```
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {  const user = use(userPromise); // Suspends until resolved  return <div>{user.name}</div>;}
```
```
type ButtonProps = {  variant: 'primary' | 'secondary';} & React.ComponentPropsWithoutRef<'button'>;function Button({ variant, children, ...props }: ButtonProps) {  return <button className={variant} {...props}>{children}</button>;}
```
```
type ButtonProps = {  variant: 'primary' | 'secondary';} & React.ComponentPropsWithoutRef<'button'>;function Button({ variant, children, ...props }: ButtonProps) {  return <button className={variant} {...props}>{children}</button>;}
```
```
type Props = {  children: React.ReactNode;          // Anything renderable  icon: React.ReactElement;           // Single element  render: (data: T) => React.ReactNode;  // Render prop};
```
```
type Props = {  children: React.ReactNode;          // Anything renderable  icon: React.ReactElement;           // Single element  render: (data: T) => React.ReactNode;  // Render prop};
```
```
type ButtonProps =  | { variant: 'link'; href: string }  | { variant: 'button'; onClick: () => void };function Button(props: ButtonProps) {  if (props.variant === 'link') {    return <a href={props.href}>Link</a>;  }  return <button onClick={props.onClick}>Button</button>;}
```
```
type ButtonProps =  | { variant: 'link'; href: string }  | { variant: 'button'; onClick: () => void };function Button(props: ButtonProps) {  if (props.variant === 'link') {    return <a href={props.href}>Link</a>;  }  return <button onClick={props.onClick}>Button</button>;}
```
```
// Mousefunction handleClick(e: React.MouseEvent<HTMLButtonElement>) {  e.currentTarget.disabled = true;}// Formfunction handleSubmit(e: React.FormEvent<HTMLFormElement>) {  e.preventDefault();  const formData = new FormData(e.currentTarget);}// Inputfunction handleChange(e: React.ChangeEvent<HTMLInputElement>) {  console.log(e.target.value);}// Keyboardfunction handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {  if (e.key === 'Enter') e.currentTarget.blur();}
```
```
// Mousefunction handleClick(e: React.MouseEvent<HTMLButtonElement>) {  e.currentTarget.disabled = true;}// Formfunction handleSubmit(e: React.FormEvent<HTMLFormElement>) {  e.preventDefault();  const formData = new FormData(e.currentTarget);}// Inputfunction handleChange(e: React.ChangeEvent<HTMLInputElement>) {  console.log(e.target.value);}// Keyboardfunction handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {  if (e.key === 'Enter') e.currentTarget.blur();}
```
```
const [user, setUser] = useState<User | null>(null);const [status, setStatus] = useState<'idle' | 'loading'>('idle');
```
```
const [user, setUser] = useState<User | null>(null);const [status, setStatus] = useState<'idle' | 'loading'>('idle');
```
```
const inputRef = useRef<HTMLInputElement>(null);  // DOM - use ?.const countRef = useRef<number>(0);               // Mutable - direct access
```
```
const inputRef = useRef<HTMLInputElement>(null);  // DOM - use ?.const countRef = useRef<number>(0);               // Mutable - direct access
```
```
type Action =  | { type: 'increment' }  | { type: 'set'; payload: number };function reducer(state: State, action: Action): State {  switch (action.type) {    case 'set': return { ...state, count: action.payload };    default: return state;  }}
```
```
type Action =  | { type: 'increment' }  | { type: 'set'; payload: number };function reducer(state: State, action: Action): State {  switch (action.type) {    case 'set': return { ...state, count: action.payload };    default: return state;  }}
```
```
function useToggle(initial = false) {  const [value, setValue] = useState(initial);  const toggle = () => setValue(v => !v);  return [value, toggle] as const;}
```
```
function useToggle(initial = false) {  const [value, setValue] = useState(initial);  const toggle = () => setValue(v => !v);  return [value, toggle] as const;}
```
```
const UserContext = createContext<User | null>(null);function useUser() {  const user = useContext(UserContext);  if (!user) throw new Error('useUser outside UserProvider');  return user;}
```
```
const UserContext = createContext<User | null>(null);function useUser() {  const user = useContext(UserContext);  if (!user) throw new Error('useUser outside UserProvider');  return user;}
```
```
type Column<T> = {  key: keyof T;  header: string;  render?: (value: T[keyof T], item: T) => React.ReactNode;};type TableProps<T> = {  data: T[];  columns: Column<T>[];  keyExtractor: (item: T) => string | number;};function Table<T>({ data, columns, keyExtractor }: TableProps<T>) {  return (    <table>      <thead>        <tr>{columns.map(col => <th key={String(col.key)}>{col.header}</th>)}</tr>      </thead>      <tbody>        {data.map(item => (          <tr key={keyExtractor(item)}>            {columns.map(col => (              <td key={String(col.key)}>                {col.render ? col.render(item[col.key], item) : String(item[col.key])}              </td>            ))}          </tr>        ))}      </tbody>    </table>  );}
```
```
type Column<T> = {  key: keyof T;  header: string;  render?: (value: T[keyof T], item: T) => React.ReactNode;};type TableProps<T> = {  data: T[];  columns: Column<T>[];  keyExtractor: (item: T) => string | number;};function Table<T>({ data, columns, keyExtractor }: TableProps<T>) {  return (    <table>      <thead>        <tr>{columns.map(col => <th key={String(col.key)}>{col.header}</th>)}</tr>      </thead>      <tbody>        {data.map(item => (          <tr key={keyExtractor(item)}>            {columns.map(col => (              <td key={String(col.key)}>                {col.render ? col.render(item[col.key], item) : String(item[col.key])}              </td>            ))}          </tr>        ))}      </tbody>    </table>  );}
```
```
type HasId = { id: string | number };function List<T extends HasId>({ items }: { items: T[] }) {  return <ul>{items.map(item => <li key={item.id}>...</li>)}</ul>;}
```
```
type HasId = { id: string | number };function List<T extends HasId>({ items }: { items: T[] }) {  return <ul>{items.map(item => <li key={item.id}>...</li>)}</ul>;}
```
```
export default async function UserPage({ params }: { params: { id: string } }) {  const user = await fetchUser(params.id);  return <div>{user.name}</div>;}
```
```
export default async function UserPage({ params }: { params: { id: string } }) {  const user = await fetchUser(params.id);  return <div>{user.name}</div>;}
```
```
'use server';export async function updateUser(userId: string, formData: FormData) {  await db.user.update({ where: { id: userId }, data: { ... } });  revalidatePath(/users/${userId});}
```
```
'use server';export async function updateUser(userId: string, formData: FormData) {  await db.user.update({ where: { id: userId }, data: { ... } });  revalidatePath(/users/${userId});}
```
```
/users/${userId}
```
```
'use client';import { useActionState } from 'react';import { updateUser } from '@/actions/user';function UserForm({ userId }: { userId: string }) {  const [state, formAction, isPending] = useActionState(    (prev, formData) => updateUser(userId, formData), {}  );  return <form action={formAction}>...</form>;}
```
```
'use client';import { useActionState } from 'react';import { updateUser } from '@/actions/user';function UserForm({ userId }: { userId: string }) {  const [state, formAction, isPending] = useActionState(    (prev, formData) => updateUser(userId, formData), {}  );  return <form action={formAction}>...</form>;}
```
```
// Server: pass promise without awaitasync function Page() {  const userPromise = fetchUser('123');  return <UserProfile userPromise={userPromise} />;}// Client: unwrap with use()'use client';function UserProfile({ userPromise }: { userPromise: Promise<User> }) {  const user = use(userPromise);  return <div>{user.name}</div>;}
```
```
// Server: pass promise without awaitasync function Page() {  const userPromise = fetchUser('123');  return <UserProfile userPromise={userPromise} />;}// Client: unwrap with use()'use client';function UserProfile({ userPromise }: { userPromise: Promise<User> }) {  const user = use(userPromise);  return <div>{user.name}</div>;}
```
```
import { createRoute } from '@tanstack/react-router';import { z } from 'zod';const userRoute = createRoute({  path: '/users/$userId',  component: UserPage,  loader: async ({ params }) => ({ user: await fetchUser(params.userId) }),  validateSearch: z.object({    tab: z.enum(['profile', 'settings']).optional(),    page: z.number().int().positive().default(1),  }),});function UserPage() {  const { user } = useLoaderData({ from: userRoute.id });  const { tab, page } = useSearch({ from: userRoute.id });  const { userId } = useParams({ from: userRoute.id });}
```
```
import { createRoute } from '@tanstack/react-router';import { z } from 'zod';const userRoute = createRoute({  path: '/users/$userId',  component: UserPage,  loader: async ({ params }) => ({ user: await fetchUser(params.userId) }),  validateSearch: z.object({    tab: z.enum(['profile', 'settings']).optional(),    page: z.number().int().positive().default(1),  }),});function UserPage() {  const { user } = useLoaderData({ from: userRoute.id });  const { tab, page } = useSearch({ from: userRoute.id });  const { userId } = useParams({ from: userRoute.id });}
```
```
import type { Route } from "./+types/user";export async function loader({ params }: Route.LoaderArgs) {  return { user: await fetchUser(params.userId) };}export default function UserPage({ loaderData }: Route.ComponentProps) {  const { user } = loaderData; // Typed from loader  return <h1>{user.name}</h1>;}
```
```
import type { Route } from "./+types/user";export async function loader({ params }: Route.LoaderArgs) {  return { user: await fetchUser(params.userId) };}export default function UserPage({ loaderData }: Route.ComponentProps) {  const { user } = loaderData; // Typed from loader  return <h1>{user.name}</h1>;}
```
Unlock the full potential of modern React development with this specialized AI Agent skill, meticulously crafted to guide you through the intricacies of type-safe patterns. Whether you're building robust components, mastering React 19's groundbreaking features like Actions and Server Components, or ensuring seamless router integration, this skill provides invaluable assistance. Elevate your code quality, reduce bugs, and accelerate your development workflow by confidently leveraging TypeScript in all your React projects, from initial setup to advanced state management.

# When to Use This Skill
- •Building highly reusable and type-safe React components with TypeScript.
- •Migrating existing React applications to incorporate React 19 features like Actions and Server Components.
- •Ensuring proper type definitions for event handlers, forms, refs, and custom hooks.
- •Integrating modern routing solutions like TanStack Router or React Router with robust TypeScript patterns.

# Pro Tips
- 💡Always enable `strict` mode in your `tsconfig.json` for maximum type safety benefits across your React projects.
- 💡Familiarize yourself with React 19's new `ref` prop handling and `useActionState` to smoothly transition your components.
- 💡Prioritize generic components for increased reusability and type inference, reducing boilerplate and improving maintainability.

