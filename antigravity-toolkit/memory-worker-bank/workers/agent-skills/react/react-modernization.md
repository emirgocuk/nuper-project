# react-modernization
Source: https://antigravity.codes/agent-skills/react/react-modernization

## AI Worker Instructions
When the user requests functionality related to react-modernization, follow these guidelines and utilize this context.

## Scraped Content

# react-modernization
```
// Before: Class componentclass Counter extends React.Component {  constructor(props) {    super(props);    this.state = {      count: 0,      name: "",    };  }  increment = () => {    this.setState({ count: this.state.count + 1 });  };  render() {    return (      <div>        <p>Count: {this.state.count}</p>        <button onClick={this.increment}>Increment</button>      </div>    );  }}// After: Functional component with hooksfunction Counter() {  const [count, setCount] = useState(0);  const [name, setName] = useState("");  const increment = () => {    setCount(count + 1);  };  return (    <div>      <p>Count: {count}</p>      <button onClick={increment}>Increment</button>    </div>  );}
```
```
// Before: Class componentclass Counter extends React.Component {  constructor(props) {    super(props);    this.state = {      count: 0,      name: "",    };  }  increment = () => {    this.setState({ count: this.state.count + 1 });  };  render() {    return (      <div>        <p>Count: {this.state.count}</p>        <button onClick={this.increment}>Increment</button>      </div>    );  }}// After: Functional component with hooksfunction Counter() {  const [count, setCount] = useState(0);  const [name, setName] = useState("");  const increment = () => {    setCount(count + 1);  };  return (    <div>      <p>Count: {count}</p>      <button onClick={increment}>Increment</button>    </div>  );}
```
```
// Before: Lifecycle methodsclass DataFetcher extends React.Component {  state = { data: null, loading: true };  componentDidMount() {    this.fetchData();  }  componentDidUpdate(prevProps) {    if (prevProps.id !== this.props.id) {      this.fetchData();    }  }  componentWillUnmount() {    this.cancelRequest();  }  fetchData = async () => {    const data = await fetch(/api/${this.props.id});    this.setState({ data, loading: false });  };  cancelRequest = () => {    // Cleanup  };  render() {    if (this.state.loading) return <div>Loading...</div>;    return <div>{this.state.data}</div>;  }}// After: useEffect hookfunction DataFetcher({ id }) {  const [data, setData] = useState(null);  const [loading, setLoading] = useState(true);  useEffect(() => {    let cancelled = false;    const fetchData = async () => {      try {        const response = await fetch(/api/${id});        const result = await response.json();        if (!cancelled) {          setData(result);          setLoading(false);        }      } catch (error) {        if (!cancelled) {          console.error(error);        }      }    };    fetchData();    // Cleanup function    return () => {      cancelled = true;    };  }, [id]); // Re-run when id changes  if (loading) return <div>Loading...</div>;  return <div>{data}</div>;}
```
```
// Before: Lifecycle methodsclass DataFetcher extends React.Component {  state = { data: null, loading: true };  componentDidMount() {    this.fetchData();  }  componentDidUpdate(prevProps) {    if (prevProps.id !== this.props.id) {      this.fetchData();    }  }  componentWillUnmount() {    this.cancelRequest();  }  fetchData = async () => {    const data = await fetch(/api/${this.props.id});    this.setState({ data, loading: false });  };  cancelRequest = () => {    // Cleanup  };  render() {    if (this.state.loading) return <div>Loading...</div>;    return <div>{this.state.data}</div>;  }}// After: useEffect hookfunction DataFetcher({ id }) {  const [data, setData] = useState(null);  const [loading, setLoading] = useState(true);  useEffect(() => {    let cancelled = false;    const fetchData = async () => {      try {        const response = await fetch(/api/${id});        const result = await response.json();        if (!cancelled) {          setData(result);          setLoading(false);        }      } catch (error) {        if (!cancelled) {          console.error(error);        }      }    };    fetchData();    // Cleanup function    return () => {      cancelled = true;    };  }, [id]); // Re-run when id changes  if (loading) return <div>Loading...</div>;  return <div>{data}</div>;}
```
```
/api/${this.props.id}
```
```
/api/${id}
```
```
// Before: Context consumer and HOCconst ThemeContext = React.createContext();class ThemedButton extends React.Component {  static contextType = ThemeContext;  render() {    return (      <button style={{ background: this.context.theme }}>        {this.props.children}      </button>    );  }}// After: useContext hookfunction ThemedButton({ children }) {  const { theme } = useContext(ThemeContext);  return <button style={{ background: theme }}>{children}</button>;}// Before: HOC for data fetchingfunction withUser(Component) {  return class extends React.Component {    state = { user: null };    componentDidMount() {      fetchUser().then((user) => this.setState({ user }));    }    render() {      return <Component {...this.props} user={this.state.user} />;    }  };}// After: Custom hookfunction useUser() {  const [user, setUser] = useState(null);  useEffect(() => {    fetchUser().then(setUser);  }, []);  return user;}function UserProfile() {  const user = useUser();  if (!user) return <div>Loading...</div>;  return <div>{user.name}</div>;}
```
```
// Before: Context consumer and HOCconst ThemeContext = React.createContext();class ThemedButton extends React.Component {  static contextType = ThemeContext;  render() {    return (      <button style={{ background: this.context.theme }}>        {this.props.children}      </button>    );  }}// After: useContext hookfunction ThemedButton({ children }) {  const { theme } = useContext(ThemeContext);  return <button style={{ background: theme }}>{children}</button>;}// Before: HOC for data fetchingfunction withUser(Component) {  return class extends React.Component {    state = { user: null };    componentDidMount() {      fetchUser().then((user) => this.setState({ user }));    }    render() {      return <Component {...this.props} user={this.state.user} />;    }  };}// After: Custom hookfunction useUser() {  const [user, setUser] = useState(null);  useEffect(() => {    fetchUser().then(setUser);  }, []);  return user;}function UserProfile() {  const user = useUser();  if (!user) return <div>Loading...</div>;  return <div>{user.name}</div>;}
```
```
// Before: React 17import ReactDOM from "react-dom";ReactDOM.render(<App />, document.getElementById("root"));// After: React 18import { createRoot } from "react-dom/client";const root = createRoot(document.getElementById("root"));root.render(<App />);
```
```
// Before: React 17import ReactDOM from "react-dom";ReactDOM.render(<App />, document.getElementById("root"));// After: React 18import { createRoot } from "react-dom/client";const root = createRoot(document.getElementById("root"));root.render(<App />);
```
```
// React 18: All updates are batchedfunction handleClick() {  setCount((c) => c + 1);  setFlag((f) => !f);  // Only one re-render (batched)}// Even in async:setTimeout(() => {  setCount((c) => c + 1);  setFlag((f) => !f);  // Still batched in React 18!}, 1000);// Opt out if neededimport { flushSync } from "react-dom";flushSync(() => {  setCount((c) => c + 1);});// Re-render happens heresetFlag((f) => !f);// Another re-render
```
```
// React 18: All updates are batchedfunction handleClick() {  setCount((c) => c + 1);  setFlag((f) => !f);  // Only one re-render (batched)}// Even in async:setTimeout(() => {  setCount((c) => c + 1);  setFlag((f) => !f);  // Still batched in React 18!}, 1000);// Opt out if neededimport { flushSync } from "react-dom";flushSync(() => {  setCount((c) => c + 1);});// Re-render happens heresetFlag((f) => !f);// Another re-render
```
```
import { useState, useTransition } from "react";function SearchResults() {  const [query, setQuery] = useState("");  const [results, setResults] = useState([]);  const [isPending, startTransition] = useTransition();  const handleChange = (e) => {    // Urgent: Update input immediately    setQuery(e.target.value);    // Non-urgent: Update results (can be interrupted)    startTransition(() => {      setResults(searchResults(e.target.value));    });  };  return (    <>      <input value={query} onChange={handleChange} />      {isPending && <Spinner />}      <Results data={results} />    </>  );}
```
```
import { useState, useTransition } from "react";function SearchResults() {  const [query, setQuery] = useState("");  const [results, setResults] = useState([]);  const [isPending, startTransition] = useTransition();  const handleChange = (e) => {    // Urgent: Update input immediately    setQuery(e.target.value);    // Non-urgent: Update results (can be interrupted)    startTransition(() => {      setResults(searchResults(e.target.value));    });  };  return (    <>      <input value={query} onChange={handleChange} />      {isPending && <Spinner />}      <Results data={results} />    </>  );}
```
```
import { Suspense } from "react";// Resource-based data fetching (with React 18)const resource = fetchProfileData();function ProfilePage() {  return (    <Suspense fallback={<Loading />}>      <ProfileDetails />      <Suspense fallback={<Loading />}>        <ProfileTimeline />      </Suspense>    </Suspense>  );}function ProfileDetails() {  // This will suspend if data not ready  const user = resource.user.read();  return <h1>{user.name}</h1>;}function ProfileTimeline() {  const posts = resource.posts.read();  return <Timeline posts={posts} />;}
```
```
import { Suspense } from "react";// Resource-based data fetching (with React 18)const resource = fetchProfileData();function ProfilePage() {  return (    <Suspense fallback={<Loading />}>      <ProfileDetails />      <Suspense fallback={<Loading />}>        <ProfileTimeline />      </Suspense>    </Suspense>  );}function ProfileDetails() {  // This will suspend if data not ready  const user = resource.user.read();  return <h1>{user.name}</h1>;}function ProfileTimeline() {  const posts = resource.posts.read();  return <Timeline posts={posts} />;}
```
```
# Install jscodeshiftnpm install -g jscodeshift# React 16.9 codemod (rename unsafe lifecycle methods)npx react-codeshift <transform> <path># Example: Rename UNSAFE_ methodsnpx react-codeshift --parser=tsx \  --transform=react-codeshift/transforms/rename-unsafe-lifecycles.js \  src/# Update to new JSX Transform (React 17+)npx react-codeshift --parser=tsx \  --transform=react-codeshift/transforms/new-jsx-transform.js \  src/# Class to Hooks (third-party)npx codemod react/hooks/convert-class-to-function src/
```
```
# Install jscodeshiftnpm install -g jscodeshift# React 16.9 codemod (rename unsafe lifecycle methods)npx react-codeshift <transform> <path># Example: Rename UNSAFE_ methodsnpx react-codeshift --parser=tsx \  --transform=react-codeshift/transforms/rename-unsafe-lifecycles.js \  src/# Update to new JSX Transform (React 17+)npx react-codeshift --parser=tsx \  --transform=react-codeshift/transforms/new-jsx-transform.js \  src/# Class to Hooks (third-party)npx codemod react/hooks/convert-class-to-function src/
```
```
// custom-codemod.jsmodule.exports = function (file, api) {  const j = api.jscodeshift;  const root = j(file.source);  // Find setState calls  root    .find(j.CallExpression, {      callee: {        type: "MemberExpression",        property: { name: "setState" },      },    })    .forEach((path) => {      // Transform to useState      // ... transformation logic    });  return root.toSource();};// Run: jscodeshift -t custom-codemod.js src/
```
```
// custom-codemod.jsmodule.exports = function (file, api) {  const j = api.jscodeshift;  const root = j(file.source);  // Find setState calls  root    .find(j.CallExpression, {      callee: {        type: "MemberExpression",        property: { name: "setState" },      },    })    .forEach((path) => {      // Transform to useState      // ... transformation logic    });  return root.toSource();};// Run: jscodeshift -t custom-codemod.js src/
```
```
function ExpensiveComponent({ items, filter }) {  // Memoize expensive calculation  const filteredItems = useMemo(() => {    return items.filter((item) => item.category === filter);  }, [items, filter]);  // Memoize callback to prevent child re-renders  const handleClick = useCallback((id) => {    console.log("Clicked:", id);  }, []); // No dependencies, never changes  return <List items={filteredItems} onClick={handleClick} />;}// Child component with memoconst List = React.memo(({ items, onClick }) => {  return items.map((item) => (    <Item key={item.id} item={item} onClick={onClick} />  ));});
```
```
function ExpensiveComponent({ items, filter }) {  // Memoize expensive calculation  const filteredItems = useMemo(() => {    return items.filter((item) => item.category === filter);  }, [items, filter]);  // Memoize callback to prevent child re-renders  const handleClick = useCallback((id) => {    console.log("Clicked:", id);  }, []); // No dependencies, never changes  return <List items={filteredItems} onClick={handleClick} />;}// Child component with memoconst List = React.memo(({ items, onClick }) => {  return items.map((item) => (    <Item key={item.id} item={item} onClick={onClick} />  ));});
```
```
import { lazy, Suspense } from "react";// Lazy load componentsconst Dashboard = lazy(() => import("./Dashboard"));const Settings = lazy(() => import("./Settings"));function App() {  return (    <Suspense fallback={<Loading />}>      <Routes>        <Route path="/dashboard" element={<Dashboard />} />        <Route path="/settings" element={<Settings />} />      </Routes>    </Suspense>  );}
```
```
import { lazy, Suspense } from "react";// Lazy load componentsconst Dashboard = lazy(() => import("./Dashboard"));const Settings = lazy(() => import("./Settings"));function App() {  return (    <Suspense fallback={<Loading />}>      <Routes>        <Route path="/dashboard" element={<Dashboard />} />        <Route path="/settings" element={<Settings />} />      </Routes>    </Suspense>  );}
```
```
// Before: JavaScriptfunction Button({ onClick, children }) {  return <button onClick={onClick}>{children}</button>;}// After: TypeScriptinterface ButtonProps {  onClick: () => void;  children: React.ReactNode;}function Button({ onClick, children }: ButtonProps) {  return <button onClick={onClick}>{children}</button>;}// Generic componentsinterface ListProps<T> {  items: T[];  renderItem: (item: T) => React.ReactNode;}function List<T>({ items, renderItem }: ListProps<T>) {  return <>{items.map(renderItem)}</>;}
```
```
// Before: JavaScriptfunction Button({ onClick, children }) {  return <button onClick={onClick}>{children}</button>;}// After: TypeScriptinterface ButtonProps {  onClick: () => void;  children: React.ReactNode;}function Button({ onClick, children }: ButtonProps) {  return <button onClick={onClick}>{children}</button>;}// Generic componentsinterface ListProps<T> {  items: T[];  renderItem: (item: T) => React.ReactNode;}function List<T>({ items, renderItem }: ListProps<T>) {  return <>{items.map(renderItem)}</>;}
```
```
### Pre-Migration- [ ] Update dependencies incrementally (not all at once)- [ ] Review breaking changes in release notes- [ ] Set up testing suite- [ ] Create feature branch### Class → Hooks Migration- [ ] Identify class components to migrate- [ ] Start with leaf components (no children)- [ ] Convert state to useState- [ ] Convert lifecycle to useEffect- [ ] Convert context to useContext- [ ] Extract custom hooks- [ ] Test thoroughly### React 18 Upgrade- [ ] Update to React 17 first (if needed)- [ ] Update react and react-dom to 18- [ ] Update @types/react if using TypeScript- [ ] Change to createRoot API- [ ] Test with StrictMode (double invocation)- [ ] Address concurrent rendering issues- [ ] Adopt Suspense/Transitions where beneficial### Performance- [ ] Identify performance bottlenecks- [ ] Add React.memo where appropriate- [ ] Use useMemo/useCallback for expensive operations- [ ] Implement code splitting- [ ] Optimize re-renders### Testing- [ ] Update test utilities (React Testing Library)- [ ] Test with React 18 features- [ ] Check for warnings in console- [ ] Performance testing
```
```
### Pre-Migration- [ ] Update dependencies incrementally (not all at once)- [ ] Review breaking changes in release notes- [ ] Set up testing suite- [ ] Create feature branch### Class → Hooks Migration- [ ] Identify class components to migrate- [ ] Start with leaf components (no children)- [ ] Convert state to useState- [ ] Convert lifecycle to useEffect- [ ] Convert context to useContext- [ ] Extract custom hooks- [ ] Test thoroughly### React 18 Upgrade- [ ] Update to React 17 first (if needed)- [ ] Update react and react-dom to 18- [ ] Update @types/react if using TypeScript- [ ] Change to createRoot API- [ ] Test with StrictMode (double invocation)- [ ] Address concurrent rendering issues- [ ] Adopt Suspense/Transitions where beneficial### Performance- [ ] Identify performance bottlenecks- [ ] Add React.memo where appropriate- [ ] Use useMemo/useCallback for expensive operations- [ ] Implement code splitting- [ ] Optimize re-renders### Testing- [ ] Update test utilities (React Testing Library)- [ ] Test with React 18 features- [ ] Check for warnings in console- [ ] Performance testing
```
Keeping React applications up-to-date is crucial for performance, security, and developer experience. This agent skill provides comprehensive guidance for transforming legacy React codebases into modern, efficient systems. Whether upgrading to the latest versions, refactoring class components into contemporary functional hooks, or integrating powerful concurrent features, this skill acts as your expert co-pilot. It streamlines complex modernization tasks, ensuring your application leverages the newest patterns and best practices. This ultimately enhances maintainability and scalability, preparing your project for future growth and innovation.

# When to Use This Skill
- •Refactoring a large class-based component into multiple functional components with `useState` and `useEffect`.
- •Implementing `Suspense` and `React.lazy` for code splitting and improving initial load times.
- •Automating repetitive code changes across a codebase using codemods during a major React version upgrade.
- •Migrating an older React Router setup to the latest version with hooks-based navigation and concurrent features.

# Pro Tips
- 💡Always upgrade React versions incrementally (e.g., 16 → 17 → 18) to isolate breaking changes and simplify debugging.
- 💡Prioritize migrating complex, stateful class components to hooks first, as this often reveals opportunities for better state management and reusability.
- 💡Leverage the React Strict Mode during development after an upgrade to identify potential issues related to concurrent features and side effects early.

