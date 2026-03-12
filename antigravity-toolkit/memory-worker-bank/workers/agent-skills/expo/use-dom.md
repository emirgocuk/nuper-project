# use-dom
Source: https://antigravity.codes/agent-skills/expo/use-dom

## AI Worker Instructions
When the user requests functionality related to use-dom, follow these guidelines and utilize this context.

## Scraped Content

# use-dom
```
recharts
```
```
react-syntax-highlighter
```
```
_layout
```
```
'use dom';
```
```
// components/WebChart.tsx"use dom";export default function WebChart({  data,}: {  data: number[];  dom: import("expo/dom").DOMProps;}) {  return (    <div style={{ padding: 20 }}>      <h2>Chart Data</h2>      <ul>        {data.map((value, i) => (          <li key={i}>{value}</li>        ))}      </ul>    </div>  );}
```
```
// components/WebChart.tsx"use dom";export default function WebChart({  data,}: {  data: number[];  dom: import("expo/dom").DOMProps;}) {  return (    <div style={{ padding: 20 }}>      <h2>Chart Data</h2>      <ul>        {data.map((value, i) => (          <li key={i}>{value}</li>        ))}      </ul>    </div>  );}
```
```
'use dom';
```
```
dom
```
```
dom
```
```
"use dom";interface Props {  content: string;  dom: import("expo/dom").DOMProps;}export default function MyComponent({ content }: Props) {  return <div>{content}</div>;}
```
```
"use dom";interface Props {  content: string;  dom: import("expo/dom").DOMProps;}export default function MyComponent({ content }: Props) {  return <div>{content}</div>;}
```
```
dom
```
```
// Disable body scrolling<DOMComponent dom={{ scrollEnabled: false }} />// Flow under the notch (disable safe area insets)<DOMComponent dom={{ contentInsetAdjustmentBehavior: "never" }} />// Control size manually<DOMComponent dom={{ style: { width: 300, height: 400 } }} />// Combine options<DOMComponent  dom={{    scrollEnabled: false,    contentInsetAdjustmentBehavior: "never",    style: { width: '100%', height: 500 }  }}/>
```
```
// Disable body scrolling<DOMComponent dom={{ scrollEnabled: false }} />// Flow under the notch (disable safe area insets)<DOMComponent dom={{ contentInsetAdjustmentBehavior: "never" }} />// Control size manually<DOMComponent dom={{ style: { width: 300, height: 400 } }} />// Combine options<DOMComponent  dom={{    scrollEnabled: false,    contentInsetAdjustmentBehavior: "never",    style: { width: '100%', height: 500 }  }}/>
```
```
// app/index.tsx (native)import { Alert } from "react-native";import DOMComponent from "@/components/dom-component";export default function Screen() {  return (    <DOMComponent      showAlert={async (message: string) => {        Alert.alert("From Web", message);      }}      saveData={async (data: { name: string; value: number }) => {        // Save to native storage, database, etc.        console.log("Saving:", data);        return { success: true };      }}    />  );}
```
```
// app/index.tsx (native)import { Alert } from "react-native";import DOMComponent from "@/components/dom-component";export default function Screen() {  return (    <DOMComponent      showAlert={async (message: string) => {        Alert.alert("From Web", message);      }}      saveData={async (data: { name: string; value: number }) => {        // Save to native storage, database, etc.        console.log("Saving:", data);        return { success: true };      }}    />  );}
```
```
// components/dom-component.tsx"use dom";interface Props {  showAlert: (message: string) => Promise<void>;  saveData: (data: {    name: string;    value: number;  }) => Promise<{ success: boolean }>;  dom?: import("expo/dom").DOMProps;}export default function DOMComponent({ showAlert, saveData }: Props) {  const handleClick = async () => {    await showAlert("Hello from the webview!");    const result = await saveData({ name: "test", value: 42 });    console.log("Save result:", result);  };  return <button onClick={handleClick}>Trigger Native Action</button>;}
```
```
// components/dom-component.tsx"use dom";interface Props {  showAlert: (message: string) => Promise<void>;  saveData: (data: {    name: string;    value: number;  }) => Promise<{ success: boolean }>;  dom?: import("expo/dom").DOMProps;}export default function DOMComponent({ showAlert, saveData }: Props) {  const handleClick = async () => {    await showAlert("Hello from the webview!");    const result = await saveData({ name: "test", value: 42 });    console.log("Save result:", result);  };  return <button onClick={handleClick}>Trigger Native Action</button>;}
```
```
// components/syntax-highlight.tsx"use dom";import SyntaxHighlighter from "react-syntax-highlighter";import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";interface Props {  code: string;  language: string;  dom?: import("expo/dom").DOMProps;}export default function SyntaxHighlight({ code, language }: Props) {  return (    <SyntaxHighlighter language={language} style={docco}>      {code}    </SyntaxHighlighter>  );}
```
```
// components/syntax-highlight.tsx"use dom";import SyntaxHighlighter from "react-syntax-highlighter";import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";interface Props {  code: string;  language: string;  dom?: import("expo/dom").DOMProps;}export default function SyntaxHighlight({ code, language }: Props) {  return (    <SyntaxHighlighter language={language} style={docco}>      {code}    </SyntaxHighlighter>  );}
```
```
// components/chart.tsx"use dom";import {  LineChart,  Line,  XAxis,  YAxis,  CartesianGrid,  Tooltip,} from "recharts";interface Props {  data: Array<{ name: string; value: number }>;  dom: import("expo/dom").DOMProps;}export default function Chart({ data }: Props) {  return (    <LineChart width={400} height={300} data={data}>      <CartesianGrid strokeDasharray="3 3" />      <XAxis dataKey="name" />      <YAxis />      <Tooltip />      <Line type="monotone" dataKey="value" stroke="#8884d8" />    </LineChart>  );}
```
```
// components/chart.tsx"use dom";import {  LineChart,  Line,  XAxis,  YAxis,  CartesianGrid,  Tooltip,} from "recharts";interface Props {  data: Array<{ name: string; value: number }>;  dom: import("expo/dom").DOMProps;}export default function Chart({ data }: Props) {  return (    <LineChart width={400} height={300} data={data}>      <CartesianGrid strokeDasharray="3 3" />      <XAxis dataKey="name" />      <YAxis />      <Tooltip />      <Line type="monotone" dataKey="value" stroke="#8884d8" />    </LineChart>  );}
```
```
// components/styled-component.tsx"use dom";import "@/styles.css"; // CSS file in same directoryexport default function StyledComponent({  dom,}: {  dom: import("expo/dom").DOMProps;}) {  return (    <div className="container">      <h1 className="title">Styled Content</h1>    </div>  );}
```
```
// components/styled-component.tsx"use dom";import "@/styles.css"; // CSS file in same directoryexport default function StyledComponent({  dom,}: {  dom: import("expo/dom").DOMProps;}) {  return (    <div className="container">      <h1 className="title">Styled Content</h1>    </div>  );}
```
```
"use dom";const styles = {  container: {    padding: 20,    backgroundColor: "#f0f0f0",  },  title: {    fontSize: 24,    color: "#333",  },};export default function StyledComponent({  dom,}: {  dom: import("expo/dom").DOMProps;}) {  return (    <div style={styles.container}>      <h1 style={styles.title}>Styled Content</h1>    </div>  );}
```
```
"use dom";const styles = {  container: {    padding: 20,    backgroundColor: "#f0f0f0",  },  title: {    fontSize: 24,    color: "#333",  },};export default function StyledComponent({  dom,}: {  dom: import("expo/dom").DOMProps;}) {  return (    <div style={styles.container}>      <h1 style={styles.title}>Styled Content</h1>    </div>  );}
```
```
<Link />
```
```
"use dom";import { Link, useRouter } from "expo-router";export default function Navigation({  dom,}: {  dom: import("expo/dom").DOMProps;}) {  const router = useRouter();  return (    <nav>      <Link href="/about">About</Link>      <button onClick={() => router.push("/settings")}>Settings</button>    </nav>  );}
```
```
"use dom";import { Link, useRouter } from "expo-router";export default function Navigation({  dom,}: {  dom: import("expo/dom").DOMProps;}) {  const router = useRouter();  return (    <nav>      <Link href="/about">About</Link>      <button onClick={() => router.push("/settings")}>Settings</button>    </nav>  );}
```
```
useLocalSearchParams()
```
```
useGlobalSearchParams()
```
```
usePathname()
```
```
useSegments()
```
```
useRootNavigation()
```
```
useRootNavigationState()
```
```
// app/[id].tsx (native)import { useLocalSearchParams, usePathname } from "expo-router";import DOMComponent from "@/components/dom-component";export default function Screen() {  const { id } = useLocalSearchParams();  const pathname = usePathname();  return <DOMComponent id={id as string} pathname={pathname} />;}
```
```
// app/[id].tsx (native)import { useLocalSearchParams, usePathname } from "expo-router";import DOMComponent from "@/components/dom-component";export default function Screen() {  const { id } = useLocalSearchParams();  const pathname = usePathname();  return <DOMComponent id={id as string} pathname={pathname} />;}
```
```
// components/dom-component.tsx"use dom";interface Props {  id: string;  pathname: string;  dom?: import("expo/dom").DOMProps;}export default function DOMComponent({ id, pathname }: Props) {  return (    <div>      <p>Current ID: {id}</p>      <p>Current Path: {pathname}</p>    </div>  );}
```
```
// components/dom-component.tsx"use dom";interface Props {  id: string;  pathname: string;  dom?: import("expo/dom").DOMProps;}export default function DOMComponent({ id, pathname }: Props) {  return (    <div>      <p>Current ID: {id}</p>      <p>Current Path: {pathname}</p>    </div>  );}
```
```
"use dom";import { IS_DOM } from "expo/dom";export default function Component({  dom,}: {  dom?: import("expo/dom").DOMProps;}) {  return <div>{IS_DOM ? "Running in DOM component" : "Running natively"}</div>;}
```
```
"use dom";import { IS_DOM } from "expo/dom";export default function Component({  dom,}: {  dom?: import("expo/dom").DOMProps;}) {  return <div>{IS_DOM ? "Running in DOM component" : "Running natively"}</div>;}
```
```
"use dom";// Good - bundled with the componentconst logo = require("../assets/logo.png");export default function Component({  dom,}: {  dom: import("expo/dom").DOMProps;}) {  return <img src={logo} alt="Logo" />;}
```
```
"use dom";// Good - bundled with the componentconst logo = require("../assets/logo.png");export default function Component({  dom,}: {  dom: import("expo/dom").DOMProps;}) {  return <img src={logo} alt="Logo" />;}
```
```
// app/index.tsximport { View, Text } from "react-native";import WebChart from "@/components/web-chart";import CodeBlock from "@/components/code-block";export default function HomeScreen() {  return (    <View style={{ flex: 1 }}>      <Text>Native content above</Text>      <WebChart data={[10, 20, 30, 40, 50]} dom={{ style: { height: 300 } }} />      <CodeBlock        code="const x = 1;"        language="javascript"        dom={{ scrollEnabled: true }}      />      <Text>Native content below</Text>    </View>  );}
```
```
// app/index.tsximport { View, Text } from "react-native";import WebChart from "@/components/web-chart";import CodeBlock from "@/components/code-block";export default function HomeScreen() {  return (    <View style={{ flex: 1 }}>      <Text>Native content above</Text>      <WebChart data={[10, 20, 30, 40, 50]} dom={{ style: { height: 300 } }} />      <CodeBlock        code="const x = 1;"        language="javascript"        dom={{ scrollEnabled: true }}      />      <Text>Native content below</Text>    </View>  );}
```
```
dom
```
The 'use-dom' agent skill revolutionizes how developers bridge the gap between web and native environments within the Expo ecosystem. It empowers you to reuse intricate web UIs, interactive charts, and specialized web libraries directly within your mobile apps, rendering them flawlessly in a webview on native platforms while maintaining their original fidelity on the web. This capability significantly accelerates development by reducing the need for complete rewrites, allowing for a strategic, incremental approach to bringing robust web functionality to your native user base. It's a game-changer for projects requiring rich web content and complex layouts.

# When to Use This Skill
- •Integrating web-only libraries like Recharts or React Syntax Highlighter into an Expo native app.
- •Migrating existing React web components and complex HTML/CSS layouts to a native mobile context without a full rewrite.
- •Embedding external content via iframes or utilizing web graphics APIs like Canvas/WebGL within a cross-platform application.
- •Displaying rich text editors or other browser-dependent UI elements in a mobile app while maintaining web compatibility.

# Pro Tips
- 💡Prioritize performance-critical sections for native React Native components, using DOM components judiciously for less demanding, web-dependent features to balance performance and development speed.
- 💡When migrating, start with self-contained web components that have minimal native dependencies, gradually integrating them to identify and address any webview-specific quirks early.
- 💡Ensure robust cross-platform testing. While DOM components aim for 'as-is' rendering, differences in webview implementations across platforms (iOS vs. Android) can sometimes necessitate minor adjustments.

