# expo-api-routes
Source: https://antigravity.codes/agent-skills/expo/expo-api-routes

## AI Worker Instructions
When the user requests functionality related to expo-api-routes, follow these guidelines and utilize this context.

## Scraped Content

# expo-api-routes
```
app
```
```
+api.ts
```
```
app/  api/    hello+api.ts          → GET /api/hello    users+api.ts          → /api/users    users/[id]+api.ts     → /api/users/:id  (tabs)/    index.tsx
```
```
app/  api/    hello+api.ts          → GET /api/hello    users+api.ts          → /api/users    users/[id]+api.ts     → /api/users/:id  (tabs)/    index.tsx
```
```
// app/api/hello+api.tsexport function GET(request: Request) {  return Response.json({ message: "Hello from Expo!" });}
```
```
// app/api/hello+api.tsexport function GET(request: Request) {  return Response.json({ message: "Hello from Expo!" });}
```
```
// app/api/items+api.tsexport function GET(request: Request) {  return Response.json({ items: [] });}export async function POST(request: Request) {  const body = await request.json();  return Response.json({ created: body }, { status: 201 });}export async function PUT(request: Request) {  const body = await request.json();  return Response.json({ updated: body });}export async function DELETE(request: Request) {  return new Response(null, { status: 204 });}
```
```
// app/api/items+api.tsexport function GET(request: Request) {  return Response.json({ items: [] });}export async function POST(request: Request) {  const body = await request.json();  return Response.json({ created: body }, { status: 201 });}export async function PUT(request: Request) {  const body = await request.json();  return Response.json({ updated: body });}export async function DELETE(request: Request) {  return new Response(null, { status: 204 });}
```
```
// app/api/users/[id]+api.tsexport function GET(request: Request, { id }: { id: string }) {  return Response.json({ userId: id });}
```
```
// app/api/users/[id]+api.tsexport function GET(request: Request, { id }: { id: string }) {  return Response.json({ userId: id });}
```
```
export function GET(request: Request) {  const url = new URL(request.url);  const page = url.searchParams.get("page") ?? "1";  const limit = url.searchParams.get("limit") ?? "10";  return Response.json({ page, limit });}
```
```
export function GET(request: Request) {  const url = new URL(request.url);  const page = url.searchParams.get("page") ?? "1";  const limit = url.searchParams.get("limit") ?? "10";  return Response.json({ page, limit });}
```
```
export function GET(request: Request) {  const auth = request.headers.get("Authorization");  if (!auth) {    return Response.json({ error: "Unauthorized" }, { status: 401 });  }  return Response.json({ authenticated: true });}
```
```
export function GET(request: Request) {  const auth = request.headers.get("Authorization");  if (!auth) {    return Response.json({ error: "Unauthorized" }, { status: 401 });  }  return Response.json({ authenticated: true });}
```
```
export async function POST(request: Request) {  const { email, password } = await request.json();  if (!email || !password) {    return Response.json({ error: "Missing fields" }, { status: 400 });  }  return Response.json({ success: true });}
```
```
export async function POST(request: Request) {  const { email, password } = await request.json();  if (!email || !password) {    return Response.json({ error: "Missing fields" }, { status: 400 });  }  return Response.json({ success: true });}
```
```
process.env
```
```
// app/api/ai+api.tsexport async function POST(request: Request) {  const { prompt } = await request.json();  const response = await fetch("https://api.openai.com/v1/chat/completions", {    method: "POST",    headers: {      "Content-Type": "application/json",      Authorization: Bearer ${process.env.OPENAI_API_KEY},    },    body: JSON.stringify({      model: "gpt-4",      messages: [{ role: "user", content: prompt }],    }),  });  const data = await response.json();  return Response.json(data);}
```
```
// app/api/ai+api.tsexport async function POST(request: Request) {  const { prompt } = await request.json();  const response = await fetch("https://api.openai.com/v1/chat/completions", {    method: "POST",    headers: {      "Content-Type": "application/json",      Authorization: Bearer ${process.env.OPENAI_API_KEY},    },    body: JSON.stringify({      model: "gpt-4",      messages: [{ role: "user", content: prompt }],    }),  });  const data = await response.json();  return Response.json(data);}
```
```
Bearer ${process.env.OPENAI_API_KEY}
```
```
.env
```
```
eas env:create
```
```
const corsHeaders = {  "Access-Control-Allow-Origin": "*",  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",  "Access-Control-Allow-Headers": "Content-Type, Authorization",};export function OPTIONS() {  return new Response(null, { headers: corsHeaders });}export function GET() {  return Response.json({ data: "value" }, { headers: corsHeaders });}
```
```
const corsHeaders = {  "Access-Control-Allow-Origin": "*",  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",  "Access-Control-Allow-Headers": "Content-Type, Authorization",};export function OPTIONS() {  return new Response(null, { headers: corsHeaders });}export function GET() {  return Response.json({ data: "value" }, { headers: corsHeaders });}
```
```
export async function POST(request: Request) {  try {    const body = await request.json();    // Process...    return Response.json({ success: true });  } catch (error) {    console.error("API error:", error);    return Response.json({ error: "Internal server error" }, { status: 500 });  }}
```
```
export async function POST(request: Request) {  try {    const body = await request.json();    // Process...    return Response.json({ success: true });  } catch (error) {    console.error("API error:", error);    return Response.json({ error: "Internal server error" }, { status: 500 });  }}
```
```
npx expo serve
```
```
npx expo serve
```
```
http://localhost:8081
```
```
curl http://localhost:8081/api/hellocurl -X POST http://localhost:8081/api/users -H "Content-Type: application/json" -d '{"name":"Test"}'
```
```
curl http://localhost:8081/api/hellocurl -X POST http://localhost:8081/api/users -H "Content-Type: application/json" -d '{"name":"Test"}'
```
```
npm install -g eas-clieas login
```
```
npm install -g eas-clieas login
```
```
eas deploy
```
```
eas deploy
```
```
# Create a secreteas env:create --name OPENAI_API_KEY --value sk-xxx --environment production# Or use the Expo dashboard
```
```
# Create a secreteas env:create --name OPENAI_API_KEY --value sk-xxx --environment production# Or use the Expo dashboard
```
```
eas.json
```
```
fs
```
```
// Use Web Crypto instead of Node cryptoconst hash = await crypto.subtle.digest(  "SHA-256",  new TextEncoder().encode("data"));// Use fetch instead of node-fetchconst response = await fetch("https://api.example.com");// Use Response/Request (already available)return new Response(JSON.stringify(data), {  headers: { "Content-Type": "application/json" },});
```
```
// Use Web Crypto instead of Node cryptoconst hash = await crypto.subtle.digest(  "SHA-256",  new TextEncoder().encode("data"));// Use fetch instead of node-fetchconst response = await fetch("https://api.example.com");// Use Response/Request (already available)return new Response(JSON.stringify(data), {  headers: { "Content-Type": "application/json" },});
```
```
// app/api/users+api.tsimport { createClient } from "@libsql/client/web";const db = createClient({  url: process.env.TURSO_URL!,  authToken: process.env.TURSO_AUTH_TOKEN!,});export async function GET() {  const result = await db.execute("SELECT * FROM users");  return Response.json(result.rows);}
```
```
// app/api/users+api.tsimport { createClient } from "@libsql/client/web";const db = createClient({  url: process.env.TURSO_URL!,  authToken: process.env.TURSO_AUTH_TOKEN!,});export async function GET() {  const result = await db.execute("SELECT * FROM users");  return Response.json(result.rows);}
```
```
// From React Native componentsconst response = await fetch("/api/hello");const data = await response.json();// With bodyconst response = await fetch("/api/users", {  method: "POST",  headers: { "Content-Type": "application/json" },  body: JSON.stringify({ name: "John" }),});
```
```
// From React Native componentsconst response = await fetch("/api/hello");const data = await response.json();// With bodyconst response = await fetch("/api/users", {  method: "POST",  headers: { "Content-Type": "application/json" },  body: JSON.stringify({ name: "John" }),});
```
```
// utils/auth.tsexport async function requireAuth(request: Request) {  const token = request.headers.get("Authorization")?.replace("Bearer ", "");  if (!token) {    throw new Response(JSON.stringify({ error: "Unauthorized" }), {      status: 401,      headers: { "Content-Type": "application/json" },    });  }  // Verify token...  return { userId: "123" };}// app/api/protected+api.tsimport { requireAuth } from "../../utils/auth";export async function GET(request: Request) {  const { userId } = await requireAuth(request);  return Response.json({ userId });}
```
```
// utils/auth.tsexport async function requireAuth(request: Request) {  const token = request.headers.get("Authorization")?.replace("Bearer ", "");  if (!token) {    throw new Response(JSON.stringify({ error: "Unauthorized" }), {      status: 401,      headers: { "Content-Type": "application/json" },    });  }  // Verify token...  return { userId: "123" };}// app/api/protected+api.tsimport { requireAuth } from "../../utils/auth";export async function GET(request: Request) {  const { userId } = await requireAuth(request);  return Response.json({ userId });}
```
```
// app/api/weather+api.tsexport async function GET(request: Request) {  const url = new URL(request.url);  const city = url.searchParams.get("city");  const response = await fetch(    https://api.weather.com/v1/current?city=${city}&key=${process.env.WEATHER_API_KEY}  );  return Response.json(await response.json());}
```
```
// app/api/weather+api.tsexport async function GET(request: Request) {  const url = new URL(request.url);  const city = url.searchParams.get("city");  const response = await fetch(    https://api.weather.com/v1/current?city=${city}&key=${process.env.WEATHER_API_KEY}  );  return Response.json(await response.json());}
```
```
https://api.weather.com/v1/current?city=${city}&key=${process.env.WEATHER_API_KEY}
```
This skill empowers AI agents to guide developers through implementing robust backend logic directly within their Expo projects. It demystifies the creation of API routes using Expo Router and EAS Hosting, providing clear distinctions between server-side and client-side operations. Developers will gain insights into safeguarding sensitive data, integrating with external APIs securely, and performing critical server-side validations. Leverage this guide to build more secure, efficient, and scalable mobile applications without the complexity of a separate backend framework, streamlining your development workflow significantly.

# When to Use This Skill
- •Protecting sensitive server-side secrets like API keys and database credentials from client exposure.
- •Performing direct database operations or complex data validations before writing to the database.
- •Creating secure proxy layers for third-party APIs to hide keys and control access rates.
- •Implementing webhook endpoints to receive automated callbacks from services such as Stripe or GitHub.

# Pro Tips
- 💡Always use environment variables for secrets (`process.env.EXPO_PUBLIC_MY_VAR`) and configure them correctly for your EAS build to prevent sensitive data from being bundled client-side.
- 💡Structure your API routes logically within the `app/+api` directory, organizing by resource or feature to maintain a scalable and maintainable codebase.
- 💡Implement comprehensive error handling and logging within your API routes to monitor performance, debug issues, and respond gracefully to unexpected situations in production.

