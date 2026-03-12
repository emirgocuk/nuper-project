# react-patterns
Source: https://antigravity.codes/agent-skills/react/react

## AI Worker Instructions
When the user requests functionality related to react-patterns, follow these guidelines and utilize this context.

## Scraped Content

# react-patterns
```
import { useState } from 'react';function Counter() {  const [count, setCount] = useState(0);    return (    <button onClick={() => setCount(count + 1)}>      Count: {count}    </button>  );}
```
```
import { useState } from 'react';function Counter() {  const [count, setCount] = useState(0);    return (    <button onClick={() => setCount(count + 1)}>      Count: {count}    </button>  );}
```
```
const [state, setState] = useState(() => {  const initialState = computeExpensiveValue();  return initialState;});
```
```
const [state, setState] = useState(() => {  const initialState = computeExpensiveValue();  return initialState;});
```
```
function UserProfile() {  const [name, setName] = useState('');  const [age, setAge] = useState(0);  const [email, setEmail] = useState('');    return (    <form>      <input value={name} onChange={e => setName(e.target.value)} />      <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} />      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />    </form>  );}
```
```
function UserProfile() {  const [name, setName] = useState('');  const [age, setAge] = useState(0);  const [email, setEmail] = useState('');    return (    <form>      <input value={name} onChange={e => setName(e.target.value)} />      <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} />      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />    </form>  );}
```
```
import { useEffect } from 'react';function ChatRoom({ roomId }: { roomId: string }) {  useEffect(() => {    const connection = createConnection(roomId);    connection.connect();        // Cleanup function    return () => {      connection.disconnect();    };  }, [roomId]); // Dependency array    return <div>Connected to {roomId}</div>;}
```
```
import { useEffect } from 'react';function ChatRoom({ roomId }: { roomId: string }) {  useEffect(() => {    const connection = createConnection(roomId);    connection.connect();        // Cleanup function    return () => {      connection.disconnect();    };  }, [roomId]); // Dependency array    return <div>Connected to {roomId}</div>;}
```
```
function ChatRoom({ roomId, serverUrl }: { roomId: string; serverUrl: string }) {  useEffect(() => {    const connection = createConnection(serverUrl, roomId);    connection.connect();        return () => connection.disconnect();  }, [roomId, serverUrl]); // Re-run when either changes    return <h1>Welcome to {roomId}</h1>;}
```
```
function ChatRoom({ roomId, serverUrl }: { roomId: string; serverUrl: string }) {  useEffect(() => {    const connection = createConnection(serverUrl, roomId);    connection.connect();        return () => connection.disconnect();  }, [roomId, serverUrl]); // Re-run when either changes    return <h1>Welcome to {roomId}</h1>;}
```
```
function StatusBar() {  const [isOnline, setIsOnline] = useState(true);    useEffect(() => {    function handleOnline() {      setIsOnline(true);    }        function handleOffline() {      setIsOnline(false);    }        window.addEventListener('online', handleOnline);    window.addEventListener('offline', handleOffline);        return () => {      window.removeEventListener('online', handleOnline);      window.removeEventListener('offline', handleOffline);    };  }, []); // Empty array = run once on mount    return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;}
```
```
function StatusBar() {  const [isOnline, setIsOnline] = useState(true);    useEffect(() => {    function handleOnline() {      setIsOnline(true);    }        function handleOffline() {      setIsOnline(false);    }        window.addEventListener('online', handleOnline);    window.addEventListener('offline', handleOffline);        return () => {      window.removeEventListener('online', handleOnline);      window.removeEventListener('offline', handleOffline);    };  }, []); // Empty array = run once on mount    return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;}
```
```
import { useRef } from 'react';function Timer() {  const intervalRef = useRef<NodeJS.Timeout | null>(null);    const startTimer = () => {    intervalRef.current = setInterval(() => {      console.log('Tick');    }, 1000);  };    const stopTimer = () => {    if (intervalRef.current) {      clearInterval(intervalRef.current);    }  };    return (    <>      <button onClick={startTimer}>Start</button>      <button onClick={stopTimer}>Stop</button>    </>  );}
```
```
import { useRef } from 'react';function Timer() {  const intervalRef = useRef<NodeJS.Timeout | null>(null);    const startTimer = () => {    intervalRef.current = setInterval(() => {      console.log('Tick');    }, 1000);  };    const stopTimer = () => {    if (intervalRef.current) {      clearInterval(intervalRef.current);    }  };    return (    <>      <button onClick={startTimer}>Start</button>      <button onClick={stopTimer}>Stop</button>    </>  );}
```
```
function TextInput() {  const inputRef = useRef<HTMLInputElement>(null);    const focusInput = () => {    inputRef.current?.focus();  };    return (    <>      <input ref={inputRef} type="text" />      <button onClick={focusInput}>Focus Input</button>    </>  );}
```
```
function TextInput() {  const inputRef = useRef<HTMLInputElement>(null);    const focusInput = () => {    inputRef.current?.focus();  };    return (    <>      <input ref={inputRef} type="text" />      <button onClick={focusInput}>Focus Input</button>    </>  );}
```
```
// useOnlineStatus.tsimport { useState, useEffect } from 'react';export function useOnlineStatus() {  const [isOnline, setIsOnline] = useState(true);    useEffect(() => {    function handleOnline() {      setIsOnline(true);    }        function handleOffline() {      setIsOnline(false);    }        window.addEventListener('online', handleOnline);    window.addEventListener('offline', handleOffline);        return () => {      window.removeEventListener('online', handleOnline);      window.removeEventListener('offline', handleOffline);    };  }, []);    return isOnline;}// Usage in componentsfunction StatusBar() {  const isOnline = useOnlineStatus();  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;}function SaveButton() {  const isOnline = useOnlineStatus();  return (    <button disabled={!isOnline}>      {isOnline ? 'Save' : 'Reconnecting...'}    </button>  );}
```
```
// useOnlineStatus.tsimport { useState, useEffect } from 'react';export function useOnlineStatus() {  const [isOnline, setIsOnline] = useState(true);    useEffect(() => {    function handleOnline() {      setIsOnline(true);    }        function handleOffline() {      setIsOnline(false);    }        window.addEventListener('online', handleOnline);    window.addEventListener('offline', handleOffline);        return () => {      window.removeEventListener('online', handleOnline);      window.removeEventListener('offline', handleOffline);    };  }, []);    return isOnline;}// Usage in componentsfunction StatusBar() {  const isOnline = useOnlineStatus();  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;}function SaveButton() {  const isOnline = useOnlineStatus();  return (    <button disabled={!isOnline}>      {isOnline ? 'Save' : 'Reconnecting...'}    </button>  );}
```
```
// useChatRoom.tsimport { useEffect } from 'react';interface ChatOptions {  serverUrl: string;  roomId: string;}export function useChatRoom({ serverUrl, roomId }: ChatOptions) {  useEffect(() => {    const connection = createConnection(serverUrl, roomId);    connection.connect();        return () => connection.disconnect();  }, [serverUrl, roomId]);}// Usagefunction ChatRoom({ roomId }: { roomId: string }) {  const [serverUrl, setServerUrl] = useState('https://localhost:1234');    useChatRoom({ serverUrl, roomId });    return (    <>      <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />      <h1>Welcome to {roomId}</h1>    </>  );}
```
```
// useChatRoom.tsimport { useEffect } from 'react';interface ChatOptions {  serverUrl: string;  roomId: string;}export function useChatRoom({ serverUrl, roomId }: ChatOptions) {  useEffect(() => {    const connection = createConnection(serverUrl, roomId);    connection.connect();        return () => connection.disconnect();  }, [serverUrl, roomId]);}// Usagefunction ChatRoom({ roomId }: { roomId: string }) {  const [serverUrl, setServerUrl] = useState('https://localhost:1234');    useChatRoom({ serverUrl, roomId });    return (    <>      <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />      <h1>Welcome to {roomId}</h1>    </>  );}
```
```
interface ButtonProps {  variant?: 'primary' | 'secondary';  size?: 'sm' | 'md' | 'lg';  onClick?: () => void;  children: React.ReactNode;}function Button({ variant = 'primary', size = 'md', onClick, children }: ButtonProps) {  return (    <button       className={btn btn-${variant} btn-${size}}      onClick={onClick}    >      {children}    </button>  );}
```
```
interface ButtonProps {  variant?: 'primary' | 'secondary';  size?: 'sm' | 'md' | 'lg';  onClick?: () => void;  children: React.ReactNode;}function Button({ variant = 'primary', size = 'md', onClick, children }: ButtonProps) {  return (    <button       className={btn btn-${variant} btn-${size}}      onClick={onClick}    >      {children}    </button>  );}
```
```
btn btn-${variant} btn-${size}
```
```
interface CardProps {  children: React.ReactNode;  className?: string;}function Card({ children, className = '' }: CardProps) {  return (    <div className={card ${className}}>      {children}    </div>  );}// Usagefunction UserProfile() {  return (    <Card>      <h2>John Doe</h2>      <p>Software Engineer</p>    </Card>  );}
```
```
interface CardProps {  children: React.ReactNode;  className?: string;}function Card({ children, className = '' }: CardProps) {  return (    <div className={card ${className}}>      {children}    </div>  );}// Usagefunction UserProfile() {  return (    <Card>      <h2>John Doe</h2>      <p>Software Engineer</p>    </Card>  );}
```
```
card ${className}
```
```
function Parent() {  const [activeIndex, setActiveIndex] = useState(0);    return (    <>      <Panel        isActive={activeIndex === 0}        onShow={() => setActiveIndex(0)}      >        Panel 1 content      </Panel>      <Panel        isActive={activeIndex === 1}        onShow={() => setActiveIndex(1)}      >        Panel 2 content      </Panel>    </>  );}interface PanelProps {  isActive: boolean;  onShow: () => void;  children: React.ReactNode;}function Panel({ isActive, onShow, children }: PanelProps) {  return (    <div>      <button onClick={onShow}>Show</button>      {isActive && <div>{children}</div>}    </div>  );}
```
```
function Parent() {  const [activeIndex, setActiveIndex] = useState(0);    return (    <>      <Panel        isActive={activeIndex === 0}        onShow={() => setActiveIndex(0)}      >        Panel 1 content      </Panel>      <Panel        isActive={activeIndex === 1}        onShow={() => setActiveIndex(1)}      >        Panel 2 content      </Panel>    </>  );}interface PanelProps {  isActive: boolean;  onShow: () => void;  children: React.ReactNode;}function Panel({ isActive, onShow, children }: PanelProps) {  return (    <div>      <button onClick={onShow}>Show</button>      {isActive && <div>{children}</div>}    </div>  );}
```
```
function TodoList({ todos }: { todos: Todo[] }) {  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);    useEffect(() => {    setVisibleTodos(todos.filter(t => !t.completed));  }, [todos]); // Unnecessary effect    return <ul>{/* ... */}</ul>;}
```
```
function TodoList({ todos }: { todos: Todo[] }) {  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);    useEffect(() => {    setVisibleTodos(todos.filter(t => !t.completed));  }, [todos]); // Unnecessary effect    return <ul>{/* ... */}</ul>;}
```
```
function TodoList({ todos }: { todos: Todo[] }) {  const visibleTodos = todos.filter(t => !t.completed); // Direct computation    return <ul>{/* ... */}</ul>;}
```
```
function TodoList({ todos }: { todos: Todo[] }) {  const visibleTodos = todos.filter(t => !t.completed); // Direct computation    return <ul>{/* ... */}</ul>;}
```
```
import { useMemo } from 'react';function DataTable({ data }: { data: Item[] }) {  const sortedData = useMemo(() => {    return [...data].sort((a, b) => a.name.localeCompare(b.name));  }, [data]); // Only recompute when data changes    return <table>{/* render sortedData */}</table>;}
```
```
import { useMemo } from 'react';function DataTable({ data }: { data: Item[] }) {  const sortedData = useMemo(() => {    return [...data].sort((a, b) => a.name.localeCompare(b.name));  }, [data]); // Only recompute when data changes    return <table>{/* render sortedData */}</table>;}
```
```
import { useCallback } from 'react';function Parent() {  const [count, setCount] = useState(0);    const handleClick = useCallback(() => {    console.log('Clicked', count);  }, [count]); // Recreate only when count changes    return <ExpensiveChild onClick={handleClick} />;}
```
```
import { useCallback } from 'react';function Parent() {  const [count, setCount] = useState(0);    const handleClick = useCallback(() => {    console.log('Clicked', count);  }, [count]); // Recreate only when count changes    return <ExpensiveChild onClick={handleClick} />;}
```
```
interface UserProps {  id: string;  name: string;  email: string;  age?: number; // Optional}function User({ id, name, email, age }: UserProps) {  return (    <div>      <h2>{name}</h2>      <p>{email}</p>      {age && <p>Age: {age}</p>}    </div>  );}
```
```
interface UserProps {  id: string;  name: string;  email: string;  age?: number; // Optional}function User({ id, name, email, age }: UserProps) {  return (    <div>      <h2>{name}</h2>      <p>{email}</p>      {age && <p>Age: {age}</p>}    </div>  );}
```
```
interface ListProps<T> {  items: T[];  renderItem: (item: T) => React.ReactNode;}function List<T>({ items, renderItem }: ListProps<T>) {  return (    <ul>      {items.map((item, index) => (        <li key={index}>{renderItem(item)}</li>      ))}    </ul>  );}// Usage<List   items={users}  renderItem={(user) => <span>{user.name}</span>}/>
```
```
interface ListProps<T> {  items: T[];  renderItem: (item: T) => React.ReactNode;}function List<T>({ items, renderItem }: ListProps<T>) {  return (    <ul>      {items.map((item, index) => (        <li key={index}>{renderItem(item)}</li>      ))}    </ul>  );}// Usage<List   items={users}  renderItem={(user) => <span>{user.name}</span>}/>
```
```
function Form() {  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {    e.preventDefault();    // Handle form submission  };    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {    console.log(e.target.value);  };    return (    <form onSubmit={handleSubmit}>      <input onChange={handleChange} />    </form>  );}
```
```
function Form() {  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {    e.preventDefault();    // Handle form submission  };    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {    console.log(e.target.value);  };    return (    <form onSubmit={handleSubmit}>      <input onChange={handleChange} />    </form>  );}
```
```
function ControlledInput() {  const [value, setValue] = useState('');    return (    <input       value={value}      onChange={e => setValue(e.target.value)}    />  );}
```
```
function ControlledInput() {  const [value, setValue] = useState('');    return (    <input       value={value}      onChange={e => setValue(e.target.value)}    />  );}
```
```
function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {  return (    <div>      {isLoggedIn ? (        <UserGreeting />      ) : (        <GuestGreeting />      )}    </div>  );}
```
```
function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {  return (    <div>      {isLoggedIn ? (        <UserGreeting />      ) : (        <GuestGreeting />      )}    </div>  );}
```
```
function UserList({ users }: { users: User[] }) {  return (    <ul>      {users.map(user => (        <li key={user.id}>          {user.name}        </li>      ))}    </ul>  );}
```
```
function UserList({ users }: { users: User[] }) {  return (    <ul>      {users.map(user => (        <li key={user.id}>          {user.name}        </li>      ))}    </ul>  );}
```
```
useEffect(() => {  // Uses 'count' but doesn't include it in deps  console.log(count);}, []); // Wrong!
```
```
useEffect(() => {  // Uses 'count' but doesn't include it in deps  console.log(count);}, []); // Wrong!
```
```
const [items, setItems] = useState([]);items.push(newItem); // Wrong! Mutates statesetItems(items); // Won't trigger re-render
```
```
const [items, setItems] = useState([]);items.push(newItem); // Wrong! Mutates statesetItems(items); // Won't trigger re-render
```
```
setItems([...items, newItem]); // Create new array
```
```
setItems([...items, newItem]); // Create new array
```
```
// Wrong!function handleClick() {  const data = use(promise); // Error: use() can only be called in render}
```
```
// Wrong!function handleClick() {  const data = use(promise); // Error: use() can only be called in render}
```
```
function Component({ promise }) {  const data = use(promise); // Correct: called during render  return <div>{data}</div>;}
```
```
function Component({ promise }) {  const data = use(promise); // Correct: called during render  return <div>{data}</div>;}
```
```
// Wrong - missing 'use server'export async function myAction() {  // This will run on the client!}
```
```
// Wrong - missing 'use server'export async function myAction() {  // This will run on the client!}
```
```
'use server'; // Must be at the topexport async function myAction() {  // Now runs on the server}
```
```
'use server'; // Must be at the topexport async function myAction() {  // Now runs on the server}
```
```
// Wrong - trying to use browser APIs in Server Componentexport default async function ServerComponent() {  const width = window.innerWidth; // Error: window is not defined  return <div>{width}</div>;}
```
```
// Wrong - trying to use browser APIs in Server Componentexport default async function ServerComponent() {  const width = window.innerWidth; // Error: window is not defined  return <div>{width}</div>;}
```
```
// Server Component for dataexport default async function ServerComponent() {  const data = await fetchData();  return <ClientComponent data={data} />;}// Client Component for browser APIs'use client';function ClientComponent({ data }) {  const [width, setWidth] = useState(window.innerWidth);  // Handle resize logic...  return <div>{width}</div>;}
```
```
// Server Component for dataexport default async function ServerComponent() {  const data = await fetchData();  return <ClientComponent data={data} />;}// Client Component for browser APIs'use client';function ClientComponent({ data }) {  const [width, setWidth] = useState(window.innerWidth);  // Handle resize logic...  return <div>{width}</div>;}
```
```
use()
```
```
import { use } from 'react';// Reading a Promise in a componentfunction MessageComponent({ messagePromise }) {  const message = use(messagePromise);  return <p>{message}</p>;}// Reading Context conditionallyfunction Button() {  if (condition) {    const theme = use(ThemeContext);    return <button className={theme}>Click</button>;  }  return <button>Click</button>;}
```
```
import { use } from 'react';// Reading a Promise in a componentfunction MessageComponent({ messagePromise }) {  const message = use(messagePromise);  return <p>{message}</p>;}// Reading Context conditionallyfunction Button() {  if (condition) {    const theme = use(ThemeContext);    return <button className={theme}>Click</button>;  }  return <button>Click</button>;}
```
```
import { useOptimistic } from 'react';function TodoList({ todos, addTodo }) {  const [optimisticTodos, addOptimisticTodo] = useOptimistic(    todos,    (state, newTodo) => [...state, newTodo]  );  const handleSubmit = async (formData) => {    const newTodo = { id: Date.now(), text: formData.get('text') };    // Optimistically add to UI    addOptimisticTodo(newTodo);    // Actually add to backend    await addTodo(newTodo);  };  return (    <form action={handleSubmit}>      {optimisticTodos.map(todo => (        <div key={todo.id}>{todo.text}</div>      ))}      <input type="text" name="text" />      <button type="submit">Add Todo</button>    </form>  );}
```
```
import { useOptimistic } from 'react';function TodoList({ todos, addTodo }) {  const [optimisticTodos, addOptimisticTodo] = useOptimistic(    todos,    (state, newTodo) => [...state, newTodo]  );  const handleSubmit = async (formData) => {    const newTodo = { id: Date.now(), text: formData.get('text') };    // Optimistically add to UI    addOptimisticTodo(newTodo);    // Actually add to backend    await addTodo(newTodo);  };  return (    <form action={handleSubmit}>      {optimisticTodos.map(todo => (        <div key={todo.id}>{todo.text}</div>      ))}      <input type="text" name="text" />      <button type="submit">Add Todo</button>    </form>  );}
```
```
import { useFormStatus } from 'react';function SubmitButton() {  const { pending, data } = useFormStatus();  return (    <button type="submit" disabled={pending}>      {pending ? 'Submitting...' : 'Submit'}    </button>  );}function ContactForm() {  return (    <form action={submitForm}>      <input name="email" type="email" />      <SubmitButton />    </form>  );}
```
```
import { useFormStatus } from 'react';function SubmitButton() {  const { pending, data } = useFormStatus();  return (    <button type="submit" disabled={pending}>      {pending ? 'Submitting...' : 'Submit'}    </button>  );}function ContactForm() {  return (    <form action={submitForm}>      <input name="email" type="email" />      <SubmitButton />    </form>  );}
```
```
import { useFormState } from 'react';async function submitAction(prevState: string | null, formData: FormData) {  const email = formData.get('email') as string;  if (!email.includes('@')) {    return 'Invalid email address';  }  await submitToDatabase(email);  return null;}function EmailForm() {  const [state, formAction] = useFormState(submitAction, null);  return (    <form action={formAction}>      <input name="email" type="email" />      <button type="submit">Subscribe</button>      {state && <p className="error">{state}</p>}    </form>  );}
```
```
import { useFormState } from 'react';async function submitAction(prevState: string | null, formData: FormData) {  const email = formData.get('email') as string;  if (!email.includes('@')) {    return 'Invalid email address';  }  await submitToDatabase(email);  return null;}function EmailForm() {  const [state, formAction] = useFormState(submitAction, null);  return (    <form action={formAction}>      <input name="email" type="email" />      <button type="submit">Subscribe</button>      {state && <p className="error">{state}</p>}    </form>  );}
```
```
// app/actions.ts'use server';import { redirect } from 'next/navigation';import { revalidatePath } from 'next/cache';export async function createPost(formData: FormData) {  const title = formData.get('title') as string;  const content = formData.get('content') as string;  // Validate input  if (!title || !content) {    return { error: 'Title and content are required' };  }  // Save to database  const post = await db.post.create({    data: { title, content }  });  // Update cache and redirect  revalidatePath('/posts');  redirect(/posts/${post.id});}
```
```
// app/actions.ts'use server';import { redirect } from 'next/navigation';import { revalidatePath } from 'next/cache';export async function createPost(formData: FormData) {  const title = formData.get('title') as string;  const content = formData.get('content') as string;  // Validate input  if (!title || !content) {    return { error: 'Title and content are required' };  }  // Save to database  const post = await db.post.create({    data: { title, content }  });  // Update cache and redirect  revalidatePath('/posts');  redirect(/posts/${post.id});}
```
```
/posts/${post.id}
```
```
// app/posts/page.tsx - Server Componentasync function PostsPage() {  // Server-side data fetching  const posts = await db.post.findMany({    orderBy: { createdAt: 'desc' },    take: 10  });  return (    <div>      <h1>Latest Posts</h1>      <PostsList posts={posts} />    </div>  );}// Client Component for interactivity'use client';function PostsList({ posts }: { posts: Post[] }) {  const [selectedId, setSelectedId] = useState<number | null>(null);  return (    <ul>      {posts.map(post => (        <li          key={post.id}          onClick={() => setSelectedId(post.id)}          className={selectedId === post.id ? 'selected' : ''}        >          {post.title}        </li>      ))}    </ul>  );}
```
```
// app/posts/page.tsx - Server Componentasync function PostsPage() {  // Server-side data fetching  const posts = await db.post.findMany({    orderBy: { createdAt: 'desc' },    take: 10  });  return (    <div>      <h1>Latest Posts</h1>      <PostsList posts={posts} />    </div>  );}// Client Component for interactivity'use client';function PostsList({ posts }: { posts: Post[] }) {  const [selectedId, setSelectedId] = useState<number | null>(null);  return (    <ul>      {posts.map(post => (        <li          key={post.id}          onClick={() => setSelectedId(post.id)}          className={selectedId === post.id ? 'selected' : ''}        >          {post.title}        </li>      ))}    </ul>  );}
```
```
// Before React Compiler - manual memoization neededconst ExpensiveComponent = memo(function ExpensiveComponent({  data,  onUpdate}) {  const processedData = useMemo(() => {    return data.map(item => ({      ...item,      computed: expensiveCalculation(item)    }));  }, [data]);  const handleClick = useCallback((id) => {    onUpdate(id);  }, [onUpdate]);  return (    <div>      {processedData.map(item => (        <Item          key={item.id}          item={item}          onClick={handleClick}        />      ))}    </div>  );});// After React Compiler - no manual optimization neededfunction ExpensiveComponent({ data, onUpdate }) {  const processedData = data.map(item => ({    ...item,    computed: expensiveCalculation(item)  }));  const handleClick = (id) => {    onUpdate(id);  };  return (    <div>      {processedData.map(item => (        <Item          key={item.id}          item={item}          onClick={handleClick}        />      ))}    </div>  );}
```
```
// Before React Compiler - manual memoization neededconst ExpensiveComponent = memo(function ExpensiveComponent({  data,  onUpdate}) {  const processedData = useMemo(() => {    return data.map(item => ({      ...item,      computed: expensiveCalculation(item)    }));  }, [data]);  const handleClick = useCallback((id) => {    onUpdate(id);  }, [onUpdate]);  return (    <div>      {processedData.map(item => (        <Item          key={item.id}          item={item}          onClick={handleClick}        />      ))}    </div>  );});// After React Compiler - no manual optimization neededfunction ExpensiveComponent({ data, onUpdate }) {  const processedData = data.map(item => ({    ...item,    computed: expensiveCalculation(item)  }));  const handleClick = (id) => {    onUpdate(id);  };  return (    <div>      {processedData.map(item => (        <Item          key={item.id}          item={item}          onClick={handleClick}        />      ))}    </div>  );}
```
```
# Install React Compilernpm install -D babel-plugin-react-compiler@latest# Install ESLint plugin for validationnpm install -D eslint-plugin-react-hooks@latest
```
```
# Install React Compilernpm install -D babel-plugin-react-compiler@latest# Install ESLint plugin for validationnpm install -D eslint-plugin-react-hooks@latest
```
```
// babel.config.jsmodule.exports = {  plugins: [    'babel-plugin-react-compiler', // Must run first!    // ... other plugins  ],};
```
```
// babel.config.jsmodule.exports = {  plugins: [    'babel-plugin-react-compiler', // Must run first!    // ... other plugins  ],};
```
```
// vite.config.js for Vite usersimport { defineConfig } from 'vite';import react from '@vitejs/plugin-react';export default defineConfig({  plugins: [    react({      babel: {        plugins: ['babel-plugin-react-compiler'],      },    }),  ],});
```
```
// vite.config.js for Vite usersimport { defineConfig } from 'vite';import react from '@vitejs/plugin-react';export default defineConfig({  plugins: [    react({      babel: {        plugins: ['babel-plugin-react-compiler'],      },    }),  ],});
```
```
// babel.config.js with compiler optionsmodule.exports = {  plugins: [    [      'babel-plugin-react-compiler',      {        // Enable compilation for specific files        target: '18', // or '19'        // Debug mode for development        debug: process.env.NODE_ENV === 'development'      }    ],  ],};// Incremental adoption with overridesmodule.exports = {  plugins: [],  overrides: [    {      test: './src/components/**/*.{js,jsx,ts,tsx}',      plugins: ['babel-plugin-react-compiler']    }  ]};
```
```
// babel.config.js with compiler optionsmodule.exports = {  plugins: [    [      'babel-plugin-react-compiler',      {        // Enable compilation for specific files        target: '18', // or '19'        // Debug mode for development        debug: process.env.NODE_ENV === 'development'      }    ],  ],};// Incremental adoption with overridesmodule.exports = {  plugins: [],  overrides: [    {      test: './src/components/**/*.{js,jsx,ts,tsx}',      plugins: ['babel-plugin-react-compiler']    }  ]};
```
```
// Server Component for data fetchingasync function ProductPage({ id }: { id: string }) {  const product = await fetchProduct(id);  const related = await fetchRelatedProducts(id);  return (    <div>      <ProductDetails product={product} />      <ProductGallery images={product.images} />      <RelatedProducts products={related} />    </div>  );}// Client Component for interactivity'use client';function ProductDetails({ product }: { product: Product }) {  const [quantity, setQuantity] = useState(1);  const [isAdded, setIsAdded] = useState(false);  return (    <div>      <h1>{product.name}</h1>      <p>{product.description}</p>      <p>${product.price}</p>      <QuantitySelector        value={quantity}        onChange={setQuantity}      />      <AddToCartButton        productId={product.id}        quantity={quantity}        onAdded={() => setIsAdded(true)}      />      {isAdded && <p>Added to cart!</p>}    </div>  );}
```
```
// Server Component for data fetchingasync function ProductPage({ id }: { id: string }) {  const product = await fetchProduct(id);  const related = await fetchRelatedProducts(id);  return (    <div>      <ProductDetails product={product} />      <ProductGallery images={product.images} />      <RelatedProducts products={related} />    </div>  );}// Client Component for interactivity'use client';function ProductDetails({ product }: { product: Product }) {  const [quantity, setQuantity] = useState(1);  const [isAdded, setIsAdded] = useState(false);  return (    <div>      <h1>{product.name}</h1>      <p>{product.description}</p>      <p>${product.price}</p>      <QuantitySelector        value={quantity}        onChange={setQuantity}      />      <AddToCartButton        productId={product.id}        quantity={quantity}        onAdded={() => setIsAdded(true)}      />      {isAdded && <p>Added to cart!</p>}    </div>  );}
```
```
'use server';import { z } from 'zod';const checkoutSchema = z.object({  items: z.array(z.object({    productId: z.string(),    quantity: z.number().min(1)  })),  shippingAddress: z.object({    street: z.string().min(1),    city: z.string().min(1),    zipCode: z.string().regex(/^\d{5}$/)  }),  paymentMethod: z.enum(['credit', 'paypal', 'apple'])});export async function processCheckout(  prevState: any,  formData: FormData) {  // Extract and validate data  const rawData = {    items: JSON.parse(formData.get('items') as string),    shippingAddress: {      street: formData.get('street'),      city: formData.get('city'),      zipCode: formData.get('zipCode')    },    paymentMethod: formData.get('paymentMethod')  };  const result = checkoutSchema.safeParse(rawData);  if (!result.success) {    return {      error: 'Validation failed',      fieldErrors: result.error.flatten().fieldErrors    };  }  try {    // Process payment    const order = await createOrder(result.data);    // Update inventory    await updateInventory(result.data.items);    // Send confirmation    await sendConfirmationEmail(order);    // Revalidate cache    revalidatePath('/orders');    return { success: true, orderId: order.id };  } catch (error) {    return { error: 'Payment failed' };  }}
```
```
'use server';import { z } from 'zod';const checkoutSchema = z.object({  items: z.array(z.object({    productId: z.string(),    quantity: z.number().min(1)  })),  shippingAddress: z.object({    street: z.string().min(1),    city: z.string().min(1),    zipCode: z.string().regex(/^\d{5}$/)  }),  paymentMethod: z.enum(['credit', 'paypal', 'apple'])});export async function processCheckout(  prevState: any,  formData: FormData) {  // Extract and validate data  const rawData = {    items: JSON.parse(formData.get('items') as string),    shippingAddress: {      street: formData.get('street'),      city: formData.get('city'),      zipCode: formData.get('zipCode')    },    paymentMethod: formData.get('paymentMethod')  };  const result = checkoutSchema.safeParse(rawData);  if (!result.success) {    return {      error: 'Validation failed',      fieldErrors: result.error.flatten().fieldErrors    };  }  try {    // Process payment    const order = await createOrder(result.data);    // Update inventory    await updateInventory(result.data.items);    // Send confirmation    await sendConfirmationEmail(order);    // Revalidate cache    revalidatePath('/orders');    return { success: true, orderId: order.id };  } catch (error) {    return { error: 'Payment failed' };  }}
```
```
import { useTransition, useState } from 'react';function SearchableList({ items }: { items: Item[] }) {  const [query, setQuery] = useState('');  const [isPending, startTransition] = useTransition();  const [filteredItems, setFilteredItems] = useState(items);  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {    // Update input immediately    setQuery(e.target.value);    // Transition the filter operation    startTransition(() => {      setFilteredItems(        items.filter(item =>          item.name.toLowerCase().includes(e.target.value.toLowerCase())        )      );    });  };  return (    <div>      <input        type="text"        value={query}        onChange={handleChange}        placeholder="Search items..."      />      {isPending && <div className="loading">Filtering...</div>}      <ul>        {filteredItems.map(item => (          <li key={item.id}>{item.name}</li>        ))}      </ul>    </div>  );}
```
```
import { useTransition, useState } from 'react';function SearchableList({ items }: { items: Item[] }) {  const [query, setQuery] = useState('');  const [isPending, startTransition] = useTransition();  const [filteredItems, setFilteredItems] = useState(items);  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {    // Update input immediately    setQuery(e.target.value);    // Transition the filter operation    startTransition(() => {      setFilteredItems(        items.filter(item =>          item.name.toLowerCase().includes(e.target.value.toLowerCase())        )      );    });  };  return (    <div>      <input        type="text"        value={query}        onChange={handleChange}        placeholder="Search items..."      />      {isPending && <div className="loading">Filtering...</div>}      <ul>        {filteredItems.map(item => (          <li key={item.id}>{item.name}</li>        ))}      </ul>    </div>  );}
```
```
import { useDeferredValue, useMemo } from 'react';function DataGrid({ data }: { data: DataRow[] }) {  const [searchTerm, setSearchTerm] = useState('');  const deferredSearchTerm = useDeferredValue(searchTerm);  const filteredData = useMemo(() => {    return data.filter(row =>      Object.values(row).some(value =>        String(value).toLowerCase().includes(deferredSearchTerm.toLowerCase())      )    );  }, [data, deferredSearchTerm]);  return (    <div>      <input        value={searchTerm}        onChange={e => setSearchTerm(e.target.value)}        placeholder="Search..."        className={searchTerm !== deferredSearchTerm ? 'stale' : ''}      />      <DataGridRows        data={filteredData}        isStale={searchTerm !== deferredSearchTerm}      />    </div>  );}
```
```
import { useDeferredValue, useMemo } from 'react';function DataGrid({ data }: { data: DataRow[] }) {  const [searchTerm, setSearchTerm] = useState('');  const deferredSearchTerm = useDeferredValue(searchTerm);  const filteredData = useMemo(() => {    return data.filter(row =>      Object.values(row).some(value =>        String(value).toLowerCase().includes(deferredSearchTerm.toLowerCase())      )    );  }, [data, deferredSearchTerm]);  return (    <div>      <input        value={searchTerm}        onChange={e => setSearchTerm(e.target.value)}        placeholder="Search..."        className={searchTerm !== deferredSearchTerm ? 'stale' : ''}      />      <DataGridRows        data={filteredData}        isStale={searchTerm !== deferredSearchTerm}      />    </div>  );}
```
```
import { render, screen, fireEvent } from '@testing-library/react';import { jest } from '@jest/globals';import ContactForm from './ContactForm';// Mock server actionconst mockSubmitForm = jest.fn();describe('ContactForm', () => {  it('submits form with server action', async () => {    render(<ContactForm />);    fireEvent.change(screen.getByLabelText('Email'), {      target: { value: 'test@example.com' }    });    fireEvent.click(screen.getByText('Submit'));    expect(mockSubmitForm).toHaveBeenCalledWith(      expect.any(FormData)    );  });  it('shows loading state during submission', async () => {    mockSubmitForm.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));    render(<ContactForm />);    fireEvent.click(screen.getByText('Submit'));    expect(screen.getByText('Submitting...')).toBeInTheDocument();    await waitFor(() => {      expect(screen.getByText('Submit')).toBeInTheDocument();    });  });});
```
```
import { render, screen, fireEvent } from '@testing-library/react';import { jest } from '@jest/globals';import ContactForm from './ContactForm';// Mock server actionconst mockSubmitForm = jest.fn();describe('ContactForm', () => {  it('submits form with server action', async () => {    render(<ContactForm />);    fireEvent.change(screen.getByLabelText('Email'), {      target: { value: 'test@example.com' }    });    fireEvent.click(screen.getByText('Submit'));    expect(mockSubmitForm).toHaveBeenCalledWith(      expect.any(FormData)    );  });  it('shows loading state during submission', async () => {    mockSubmitForm.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));    render(<ContactForm />);    fireEvent.click(screen.getByText('Submit'));    expect(screen.getByText('Submitting...')).toBeInTheDocument();    await waitFor(() => {      expect(screen.getByText('Submit')).toBeInTheDocument();    });  });});
```
```
import { render, screen, fireEvent, waitFor } from '@testing-library/react';import { jest } from '@jest/globals';import TodoList from './TodoList';describe('useOptimistic', () => {  it('shows optimistic update immediately', async () => {    const mockAddTodo = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));    render(      <TodoList        todos={[]}        addTodo={mockAddTodo}      />    );    fireEvent.change(screen.getByPlaceholderText('Add a todo'), {      target: { value: 'New todo' }    });    fireEvent.click(screen.getByText('Add'));    // Optimistic update appears immediately    expect(screen.getByText('New todo')).toBeInTheDocument();    // Wait for actual submission    await waitFor(() => {      expect(mockAddTodo).toHaveBeenCalledWith({        id: expect.any(Number),        text: 'New todo'      });    });  });});
```
```
import { render, screen, fireEvent, waitFor } from '@testing-library/react';import { jest } from '@jest/globals';import TodoList from './TodoList';describe('useOptimistic', () => {  it('shows optimistic update immediately', async () => {    const mockAddTodo = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));    render(      <TodoList        todos={[]}        addTodo={mockAddTodo}      />    );    fireEvent.change(screen.getByPlaceholderText('Add a todo'), {      target: { value: 'New todo' }    });    fireEvent.click(screen.getByText('Add'));    // Optimistic update appears immediately    expect(screen.getByText('New todo')).toBeInTheDocument();    // Wait for actual submission    await waitFor(() => {      expect(mockAddTodo).toHaveBeenCalledWith({        id: expect.any(Number),        text: 'New todo'      });    });  });});
```
```
// Good: Clean, idiomatic Reactfunction ProductCard({ product, onAddToCart }) {  const [quantity, setQuantity] = useState(1);  const handleAdd = () => {    onAddToCart(product.id, quantity);  };  return (    <div>      <h3>{product.name}</h3>      <p>${product.price}</p>      <input        type="number"        value={quantity}        onChange={e => setQuantity(Number(e.target.value))}        min="1"      />      <button onClick={handleAdd}>Add to Cart</button>    </div>  );}// Avoid: Manual optimizationfunction ProductCard({ product, onAddToCart }) {  const [quantity, setQuantity] = useState(1);  const handleAdd = useCallback(() => {    onAddToCart(product.id, quantity);  }, [product.id, quantity, onAddToCart]);  return (    <div>      <h3>{product.name}</h3>      <p>${product.price}</p>      <QuantityInput        value={quantity}        onChange={setQuantity}      />      <button onClick={handleAdd}>Add to Cart</button>    </div>  );}
```
```
// Good: Clean, idiomatic Reactfunction ProductCard({ product, onAddToCart }) {  const [quantity, setQuantity] = useState(1);  const handleAdd = () => {    onAddToCart(product.id, quantity);  };  return (    <div>      <h3>{product.name}</h3>      <p>${product.price}</p>      <input        type="number"        value={quantity}        onChange={e => setQuantity(Number(e.target.value))}        min="1"      />      <button onClick={handleAdd}>Add to Cart</button>    </div>  );}// Avoid: Manual optimizationfunction ProductCard({ product, onAddToCart }) {  const [quantity, setQuantity] = useState(1);  const handleAdd = useCallback(() => {    onAddToCart(product.id, quantity);  }, [product.id, quantity, onAddToCart]);  return (    <div>      <h3>{product.name}</h3>      <p>${product.price}</p>      <QuantityInput        value={quantity}        onChange={setQuantity}      />      <button onClick={handleAdd}>Add to Cart</button>    </div>  );}
```
```
// Good: Server Component for static contentasync function ProductPage({ id }: { id: string }) {  const product = await fetchProduct(id);  return (    <article>      <header>        <h1>{product.name}</h1>        <p>{product.description}</p>      </header>      <img        src={product.imageUrl}        alt={product.name}        width={600}        height={400}      />      <PriceDisplay price={product.price} />      <AddToCartForm productId={product.id} />    </article>  );}// Client Component only for interactivity'use client';function AddToCartForm({ productId }: { productId: string }) {  const [isAdding, setIsAdding] = useState(false);  async function handleSubmit() {    setIsAdding(true);    await addToCart(productId);    setIsAdding(false);  }  return (    <form action={handleSubmit}>      <button type="submit" disabled={isAdding}>        {isAdding ? 'Adding...' : 'Add to Cart'}      </button>    </form>  );}
```
```
// Good: Server Component for static contentasync function ProductPage({ id }: { id: string }) {  const product = await fetchProduct(id);  return (    <article>      <header>        <h1>{product.name}</h1>        <p>{product.description}</p>      </header>      <img        src={product.imageUrl}        alt={product.name}        width={600}        height={400}      />      <PriceDisplay price={product.price} />      <AddToCartForm productId={product.id} />    </article>  );}// Client Component only for interactivity'use client';function AddToCartForm({ productId }: { productId: string }) {  const [isAdding, setIsAdding] = useState(false);  async function handleSubmit() {    setIsAdding(true);    await addToCart(productId);    setIsAdding(false);  }  return (    <form action={handleSubmit}>      <button type="submit" disabled={isAdding}>        {isAdding ? 'Adding...' : 'Add to Cart'}      </button>    </form>  );}
```
```
npm install react@19 react-dom@19
```
```
npm install react@19 react-dom@19
```
```
// Beforefunction TodoList({ todos, addTodo }) {  const [optimisticTodos, setOptimisticTodos] = useState(todos);  const handleAdd = async (text) => {    const newTodo = { id: Date.now(), text };    setOptimisticTodos([...optimisticTodos, newTodo]);    await addTodo(newTodo);  };}// Afterfunction TodoList({ todos, addTodo }) {  const [optimisticTodos, addOptimisticTodo] = useOptimistic(    todos,    (state, newTodo) => [...state, newTodo]  );  const handleAdd = async (formData) => {    const newTodo = { id: Date.now(), text: formData.get('text') };    addOptimisticTodo(newTodo);    await addTodo(newTodo);  };}
```
```
// Beforefunction TodoList({ todos, addTodo }) {  const [optimisticTodos, setOptimisticTodos] = useState(todos);  const handleAdd = async (text) => {    const newTodo = { id: Date.now(), text };    setOptimisticTodos([...optimisticTodos, newTodo]);    await addTodo(newTodo);  };}// Afterfunction TodoList({ todos, addTodo }) {  const [optimisticTodos, addOptimisticTodo] = useOptimistic(    todos,    (state, newTodo) => [...state, newTodo]  );  const handleAdd = async (formData) => {    const newTodo = { id: Date.now(), text: formData.get('text') };    addOptimisticTodo(newTodo);    await addTodo(newTodo);  };}
```
Unlock the full potential of your React projects with this advanced agent skill, meticulously crafted to guide you through the latest paradigms of React 19. From leveraging the power of Server Components and Actions to mastering concurrent features and cutting-edge hooks like `use()` and `useOptimistic`, this resource ensures your applications are robust, performant, and future-proof. Whether you're architecting new features or optimizing existing codebases, this skill provides a comprehensive toolkit for modern React development, empowering you to build scalable and efficient user interfaces with confidence.

# When to Use This Skill
- •Developing new React 19 applications using Server Components, Actions, and modern TypeScript.
- •Optimizing existing React codebases for performance with concurrent features and memoization hooks.
- •Implementing complex state management and side effects using core React hooks like `useState` and `useEffect`.
- •Building interactive forms leveraging new React 19 form hooks such as `useFormStatus` and `useFormState`.

# Pro Tips
- 💡Always cross-reference patterns with official React 19 documentation to ensure compatibility with bleeding-edge updates and best practices.
- 💡Prioritize Server Components for data fetching and static content to minimize client-side bundle size and improve initial load times.
- 💡Leverage the `use()` hook for promise resolution directly in components, simplifying asynchronous data handling within Suspense boundaries, and enhancing user experience.

