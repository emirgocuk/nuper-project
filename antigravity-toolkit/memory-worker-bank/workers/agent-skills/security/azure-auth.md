# azure-auth
Source: https://antigravity.codes/agent-skills/security/azure-auth

## AI Worker Instructions
When the user requests functionality related to azure-auth, follow these guidelines and utilize this context.

## Scraped Content

# azure-auth
```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐│   React SPA         │────▶│  Microsoft Entra ID  │────▶│  Cloudflare Worker  ││   @azure/msal-react │     │  (login.microsoft)   │     │  jose JWT validation│└─────────────────────┘     └──────────────────────┘     └─────────────────────┘        │                                                          │        │  Authorization Code + PKCE                               │        │  (access_token, id_token)                                │        └──────────────────────────────────────────────────────────┘                    Bearer token in Authorization header
```
```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐│   React SPA         │────▶│  Microsoft Entra ID  │────▶│  Cloudflare Worker  ││   @azure/msal-react │     │  (login.microsoft)   │     │  jose JWT validation│└─────────────────────┘     └──────────────────────┘     └─────────────────────┘        │                                                          │        │  Authorization Code + PKCE                               │        │  (access_token, id_token)                                │        └──────────────────────────────────────────────────────────┘                    Bearer token in Authorization header
```
```
# Frontend (React SPA)npm install @azure/msal-react @azure/msal-browser# Backend (Cloudflare Workers)npm install jose
```
```
# Frontend (React SPA)npm install @azure/msal-react @azure/msal-browser# Backend (Cloudflare Workers)npm install jose
```
```
http://localhost:5173
```
```
User.Read
```
```
import { Configuration, LogLevel } from "@azure/msal-browser";export const msalConfig: Configuration = {  auth: {    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,    authority: https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID},    redirectUri: window.location.origin,    postLogoutRedirectUri: window.location.origin,    navigateToLoginRequestUrl: true,  },  cache: {    cacheLocation: "localStorage", // or "sessionStorage"    storeAuthStateInCookie: true, // Required for Safari/Edge issues  },  system: {    loggerOptions: {      logLevel: LogLevel.Warning,      loggerCallback: (level, message) => {        if (level === LogLevel.Error) console.error(message);      },    },  },};// Scopes for token requestsexport const loginRequest = {  scopes: ["User.Read", "openid", "profile", "email"],};// Scopes for API calls (add your API scope here)export const apiRequest = {  scopes: [api://${import.meta.env.VITE_AZURE_CLIENT_ID}/access_as_user],};
```
```
import { Configuration, LogLevel } from "@azure/msal-browser";export const msalConfig: Configuration = {  auth: {    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,    authority: https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID},    redirectUri: window.location.origin,    postLogoutRedirectUri: window.location.origin,    navigateToLoginRequestUrl: true,  },  cache: {    cacheLocation: "localStorage", // or "sessionStorage"    storeAuthStateInCookie: true, // Required for Safari/Edge issues  },  system: {    loggerOptions: {      logLevel: LogLevel.Warning,      loggerCallback: (level, message) => {        if (level === LogLevel.Error) console.error(message);      },    },  },};// Scopes for token requestsexport const loginRequest = {  scopes: ["User.Read", "openid", "profile", "email"],};// Scopes for API calls (add your API scope here)export const apiRequest = {  scopes: [api://${import.meta.env.VITE_AZURE_CLIENT_ID}/access_as_user],};
```
```
https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}
```
```
api://${import.meta.env.VITE_AZURE_CLIENT_ID}/access_as_user
```
```
import React from "react";import ReactDOM from "react-dom/client";import { PublicClientApplication, EventType } from "@azure/msal-browser";import { MsalProvider } from "@azure/msal-react";import { msalConfig } from "./auth/msal-config";import App from "./App";// CRITICAL: Initialize MSAL outside component tree to prevent re-instantiationconst msalInstance = new PublicClientApplication(msalConfig);// Handle redirect promise on page loadmsalInstance.initialize().then(() => {  // Set active account after redirect  // IMPORTANT: Use getAllAccounts() (returns array), NOT getActiveAccount() (returns single account or null)  const accounts = msalInstance.getAllAccounts();  if (accounts.length > 0) {    msalInstance.setActiveAccount(accounts[0]);  }  // Listen for sign-in events  msalInstance.addEventCallback((event) => {    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {      const account = (event.payload as { account: any }).account;      msalInstance.setActiveAccount(account);    }  });  ReactDOM.createRoot(document.getElementById("root")!).render(    <React.StrictMode>      <MsalProvider instance={msalInstance}>        <App />      </MsalProvider>    </React.StrictMode>  );});
```
```
import React from "react";import ReactDOM from "react-dom/client";import { PublicClientApplication, EventType } from "@azure/msal-browser";import { MsalProvider } from "@azure/msal-react";import { msalConfig } from "./auth/msal-config";import App from "./App";// CRITICAL: Initialize MSAL outside component tree to prevent re-instantiationconst msalInstance = new PublicClientApplication(msalConfig);// Handle redirect promise on page loadmsalInstance.initialize().then(() => {  // Set active account after redirect  // IMPORTANT: Use getAllAccounts() (returns array), NOT getActiveAccount() (returns single account or null)  const accounts = msalInstance.getAllAccounts();  if (accounts.length > 0) {    msalInstance.setActiveAccount(accounts[0]);  }  // Listen for sign-in events  msalInstance.addEventCallback((event) => {    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {      const account = (event.payload as { account: any }).account;      msalInstance.setActiveAccount(account);    }  });  ReactDOM.createRoot(document.getElementById("root")!).render(    <React.StrictMode>      <MsalProvider instance={msalInstance}>        <App />      </MsalProvider>    </React.StrictMode>  );});
```
```
import { useMsal, useIsAuthenticated } from "@azure/msal-react";import { InteractionStatus } from "@azure/msal-browser";import { loginRequest } from "./msal-config";export function ProtectedRoute({ children }: { children: React.ReactNode }) {  const { instance, inProgress } = useMsal();  const isAuthenticated = useIsAuthenticated();  // Wait for MSAL to finish any in-progress operations  if (inProgress !== InteractionStatus.None) {    return <div>Loading...</div>;  }  if (!isAuthenticated) {    // Trigger login redirect    instance.loginRedirect(loginRequest);    return <div>Redirecting to login...</div>;  }  return <>{children}</>;}
```
```
import { useMsal, useIsAuthenticated } from "@azure/msal-react";import { InteractionStatus } from "@azure/msal-browser";import { loginRequest } from "./msal-config";export function ProtectedRoute({ children }: { children: React.ReactNode }) {  const { instance, inProgress } = useMsal();  const isAuthenticated = useIsAuthenticated();  // Wait for MSAL to finish any in-progress operations  if (inProgress !== InteractionStatus.None) {    return <div>Loading...</div>;  }  if (!isAuthenticated) {    // Trigger login redirect    instance.loginRedirect(loginRequest);    return <div>Redirecting to login...</div>;  }  return <>{children}</>;}
```
```
import { useMsal } from "@azure/msal-react";import { InteractionRequiredAuthError } from "@azure/msal-browser";import { apiRequest } from "./msal-config";export function useApiToken() {  const { instance, accounts } = useMsal();  async function getAccessToken(): Promise<string | null> {    if (accounts.length === 0) return null;    const request = {      ...apiRequest,      account: accounts[0],    };    try {      // Try silent token acquisition first      const response = await instance.acquireTokenSilent(request);      return response.accessToken;    } catch (error) {      if (error instanceof InteractionRequiredAuthError) {        // Silent acquisition failed, need interactive login        // This handles expired refresh tokens (AADSTS700084)        await instance.acquireTokenRedirect(request);        return null;      }      throw error;    }  }  return { getAccessToken };}
```
```
import { useMsal } from "@azure/msal-react";import { InteractionRequiredAuthError } from "@azure/msal-browser";import { apiRequest } from "./msal-config";export function useApiToken() {  const { instance, accounts } = useMsal();  async function getAccessToken(): Promise<string | null> {    if (accounts.length === 0) return null;    const request = {      ...apiRequest,      account: accounts[0],    };    try {      // Try silent token acquisition first      const response = await instance.acquireTokenSilent(request);      return response.accessToken;    } catch (error) {      if (error instanceof InteractionRequiredAuthError) {        // Silent acquisition failed, need interactive login        // This handles expired refresh tokens (AADSTS700084)        await instance.acquireTokenRedirect(request);        return null;      }      throw error;    }  }  return { getAccessToken };}
```
```
import * as jose from "jose";interface EntraTokenPayload {  aud: string;       // Audience (your client ID or API URI)  iss: string;       // Issuer (https://login.microsoftonline.com/{tenant}/v2.0)  sub: string;       // Subject (user's unique ID)  oid: string;       // Object ID (user's Azure AD object ID)  preferred_username: string;  name: string;  email?: string;  roles?: string[];  // App roles if configured  scp?: string;      // Scopes (space-separated)}// Cache JWKS to avoid fetching on every requestlet jwksCache: jose.JWTVerifyGetKey | null = null;let jwksCacheTime = 0;const JWKS_CACHE_DURATION = 3600000; // 1 hourasync function getJWKS(tenantId: string): Promise<jose.JWTVerifyGetKey> {  const now = Date.now();  if (jwksCache && now - jwksCacheTime < JWKS_CACHE_DURATION) {    return jwksCache;  }  // CRITICAL: Azure AD JWKS is NOT at .well-known/jwks.json  // Must fetch from openid-configuration first  const configUrl = https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration;  const configResponse = await fetch(configUrl);  const config = await configResponse.json() as { jwks_uri: string };  // Now fetch JWKS from the correct URL  jwksCache = jose.createRemoteJWKSet(new URL(config.jwks_uri));  jwksCacheTime = now;  return jwksCache;}export async function validateEntraToken(  token: string,  env: {    AZURE_TENANT_ID: string;    AZURE_CLIENT_ID: string;  }): Promise<EntraTokenPayload | null> {  try {    const jwks = await getJWKS(env.AZURE_TENANT_ID);    const { payload } = await jose.jwtVerify(token, jwks, {      issuer: https://login.microsoftonline.com/${env.AZURE_TENANT_ID}/v2.0,      audience: env.AZURE_CLIENT_ID, // or your API URI: api://{client_id}    });    return payload as unknown as EntraTokenPayload;  } catch (error) {    console.error("Token validation failed:", error);    return null;  }}
```
```
import * as jose from "jose";interface EntraTokenPayload {  aud: string;       // Audience (your client ID or API URI)  iss: string;       // Issuer (https://login.microsoftonline.com/{tenant}/v2.0)  sub: string;       // Subject (user's unique ID)  oid: string;       // Object ID (user's Azure AD object ID)  preferred_username: string;  name: string;  email?: string;  roles?: string[];  // App roles if configured  scp?: string;      // Scopes (space-separated)}// Cache JWKS to avoid fetching on every requestlet jwksCache: jose.JWTVerifyGetKey | null = null;let jwksCacheTime = 0;const JWKS_CACHE_DURATION = 3600000; // 1 hourasync function getJWKS(tenantId: string): Promise<jose.JWTVerifyGetKey> {  const now = Date.now();  if (jwksCache && now - jwksCacheTime < JWKS_CACHE_DURATION) {    return jwksCache;  }  // CRITICAL: Azure AD JWKS is NOT at .well-known/jwks.json  // Must fetch from openid-configuration first  const configUrl = https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration;  const configResponse = await fetch(configUrl);  const config = await configResponse.json() as { jwks_uri: string };  // Now fetch JWKS from the correct URL  jwksCache = jose.createRemoteJWKSet(new URL(config.jwks_uri));  jwksCacheTime = now;  return jwksCache;}export async function validateEntraToken(  token: string,  env: {    AZURE_TENANT_ID: string;    AZURE_CLIENT_ID: string;  }): Promise<EntraTokenPayload | null> {  try {    const jwks = await getJWKS(env.AZURE_TENANT_ID);    const { payload } = await jose.jwtVerify(token, jwks, {      issuer: https://login.microsoftonline.com/${env.AZURE_TENANT_ID}/v2.0,      audience: env.AZURE_CLIENT_ID, // or your API URI: api://{client_id}    });    return payload as unknown as EntraTokenPayload;  } catch (error) {    console.error("Token validation failed:", error);    return null;  }}
```
```
https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration
```
```
https://login.microsoftonline.com/${env.AZURE_TENANT_ID}/v2.0
```
```
import { validateEntraToken } from "./auth/validate-token";export default {  async fetch(request: Request, env: Env): Promise<Response> {    // Skip auth for public routes    const url = new URL(request.url);    if (url.pathname === "/" || url.pathname.startsWith("/public")) {      return handlePublicRoute(request, env);    }    // Extract Bearer token    const authHeader = request.headers.get("Authorization");    if (!authHeader?.startsWith("Bearer ")) {      return new Response(JSON.stringify({ error: "Missing authorization" }), {        status: 401,        headers: { "Content-Type": "application/json" },      });    }    const token = authHeader.slice(7);    const user = await validateEntraToken(token, env);    if (!user) {      return new Response(JSON.stringify({ error: "Invalid token" }), {        status: 401,        headers: { "Content-Type": "application/json" },      });    }    // Add user to request context    const requestWithUser = new Request(request);    // Pass user info downstream (e.g., via headers or context)    return handleProtectedRoute(request, env, user);  },};
```
```
import { validateEntraToken } from "./auth/validate-token";export default {  async fetch(request: Request, env: Env): Promise<Response> {    // Skip auth for public routes    const url = new URL(request.url);    if (url.pathname === "/" || url.pathname.startsWith("/public")) {      return handlePublicRoute(request, env);    }    // Extract Bearer token    const authHeader = request.headers.get("Authorization");    if (!authHeader?.startsWith("Bearer ")) {      return new Response(JSON.stringify({ error: "Missing authorization" }), {        status: 401,        headers: { "Content-Type": "application/json" },      });    }    const token = authHeader.slice(7);    const user = await validateEntraToken(token, env);    if (!user) {      return new Response(JSON.stringify({ error: "Invalid token" }), {        status: 401,        headers: { "Content-Type": "application/json" },      });    }    // Add user to request context    const requestWithUser = new Request(request);    // Pass user info downstream (e.g., via headers or context)    return handleProtectedRoute(request, env, user);  },};
```
```
acquireTokenSilent
```
```
// Always check for accounts before silent acquisitionconst accounts = instance.getAllAccounts();if (accounts.length === 0) {  // No cached user, trigger interactive login  await instance.loginRedirect(loginRequest);  return;}
```
```
// Always check for accounts before silent acquisitionconst accounts = instance.getAllAccounts();if (accounts.length === 0) {  // No cached user, trigger interactive login  await instance.loginRedirect(loginRequest);  return;}
```
```
try {  const response = await instance.acquireTokenSilent(request);} catch (error) {  if (error instanceof InteractionRequiredAuthError) {    // Refresh token expired, need fresh login    await instance.acquireTokenRedirect(request);  }}
```
```
try {  const response = await instance.acquireTokenSilent(request);} catch (error) {  if (error instanceof InteractionRequiredAuthError) {    // Refresh token expired, need fresh login    await instance.acquireTokenRedirect(request);  }}
```
```
import { NavigationClient } from "@azure/msal-browser";import { useNavigate } from "react-router-dom";class CustomNavigationClient extends NavigationClient {  private navigate: ReturnType<typeof useNavigate>;  constructor(navigate: ReturnType<typeof useNavigate>) {    super();    this.navigate = navigate;  }  async navigateInternal(url: string, options: { noHistory: boolean }) {    const relativePath = url.replace(window.location.origin, "");    if (options.noHistory) {      this.navigate(relativePath, { replace: true });    } else {      this.navigate(relativePath);    }    return false; // Prevent MSAL from doing its own navigation  }}// In your App component:const navigate = useNavigate();useEffect(() => {  const navigationClient = new CustomNavigationClient(navigate);  instance.setNavigationClient(navigationClient);}, [instance, navigate]);
```
```
import { NavigationClient } from "@azure/msal-browser";import { useNavigate } from "react-router-dom";class CustomNavigationClient extends NavigationClient {  private navigate: ReturnType<typeof useNavigate>;  constructor(navigate: ReturnType<typeof useNavigate>) {    super();    this.navigate = navigate;  }  async navigateInternal(url: string, options: { noHistory: boolean }) {    const relativePath = url.replace(window.location.origin, "");    if (options.noHistory) {      this.navigate(relativePath, { replace: true });    } else {      this.navigate(relativePath);    }    return false; // Prevent MSAL from doing its own navigation  }}// In your App component:const navigate = useNavigate();useEffect(() => {  const navigationClient = new CustomNavigationClient(navigate);  instance.setNavigationClient(navigationClient);}, [instance, navigate]);
```
```
no_cached_authority_error
```
```
_app.tsx
```
```
// pages/_app.tsximport { PublicClientApplication } from "@azure/msal-browser";import { MsalProvider } from "@azure/msal-react";import { msalConfig } from "../auth/msal-config";// Initialize outside componentconst msalInstance = new PublicClientApplication(msalConfig);// Ensure initialization completes before renderexport default function App({ Component, pageProps }) {  const [isInitialized, setIsInitialized] = useState(false);  useEffect(() => {    msalInstance.initialize().then(() => setIsInitialized(true));  }, []);  if (!isInitialized) return <div>Loading...</div>;  return (    <MsalProvider instance={msalInstance}>      <Component {...pageProps} />    </MsalProvider>  );}
```
```
// pages/_app.tsximport { PublicClientApplication } from "@azure/msal-browser";import { MsalProvider } from "@azure/msal-react";import { msalConfig } from "../auth/msal-config";// Initialize outside componentconst msalInstance = new PublicClientApplication(msalConfig);// Ensure initialization completes before renderexport default function App({ Component, pageProps }) {  const [isInitialized, setIsInitialized] = useState(false);  useEffect(() => {    msalInstance.initialize().then(() => setIsInitialized(true));  }, []);  if (!isInitialized) return <div>Loading...</div>;  return (    <MsalProvider instance={msalInstance}>      <Component {...pageProps} />    </MsalProvider>  );}
```
```
cache: {  cacheLocation: "localStorage",  storeAuthStateInCookie: true, // REQUIRED for Safari/Edge}
```
```
cache: {  cacheLocation: "localStorage",  storeAuthStateInCookie: true, // REQUIRED for Safari/Edge}
```
```
.well-known/jwks.json
```
```
openid-configuration
```
```
jwks_uri
```
```
// WRONG - Azure AD doesn't use this pathconst jwks = createRemoteJWKSet(  new URL(https://login.microsoftonline.com/${tenantId}/.well-known/jwks.json));// CORRECT - Fetch config firstconst config = await fetch(  https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration).then(r => r.json());const jwks = createRemoteJWKSet(new URL(config.jwks_uri));
```
```
// WRONG - Azure AD doesn't use this pathconst jwks = createRemoteJWKSet(  new URL(https://login.microsoftonline.com/${tenantId}/.well-known/jwks.json));// CORRECT - Fetch config firstconst config = await fetch(  https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration).then(r => r.json());const jwks = createRemoteJWKSet(new URL(config.jwks_uri));
```
```
https://login.microsoftonline.com/${tenantId}/.well-known/jwks.json
```
```
https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration
```
```
acquireTokenSilent
```
```
PublicClientApplication
```
```
MsalProvider
```
```
initialize()
```
```
const protectedLoader = async () => {  await msalInstance.initialize(); // Prevents state conflict  const response = await msalInstance.acquireTokenSilent(request);  return { data };};
```
```
const protectedLoader = async () => {  await msalInstance.initialize(); // Prevents state conflict  const response = await msalInstance.acquireTokenSilent(request);  return { data };};
```
```
useMsal()
```
```
setActiveAccount()
```
```
setActiveAccount()
```
```
const [accountKey, setAccountKey] = useState(0);const switchAccount = (newAccount) => {  msalInstance.setActiveAccount(newAccount);  setAccountKey(prev => prev + 1); // Force update};
```
```
const [accountKey, setAccountKey] = useState(0);const switchAccount = (newAccount) => {  msalInstance.setActiveAccount(newAccount);  setAccountKey(prev => prev + 1); // Force update};
```
```
authority: https://login.microsoftonline.com/${TENANT_ID},
```
```
authority: https://login.microsoftonline.com/${TENANT_ID},
```
```
https://login.microsoftonline.com/${TENANT_ID}
```
```
https://login.microsoftonline.com/{tenant_id}/v2.0
```
```
authority: "https://login.microsoftonline.com/common",// or for work/school accounts only:authority: "https://login.microsoftonline.com/organizations",
```
```
authority: "https://login.microsoftonline.com/common",// or for work/school accounts only:authority: "https://login.microsoftonline.com/organizations",
```
```
// Multi-tenant issuer validationconst tenantId = payload.tid; // Tenant ID from tokenconst expectedIssuer = https://login.microsoftonline.com/${tenantId}/v2.0;if (payload.iss !== expectedIssuer) {  throw new Error("Invalid issuer");}
```
```
// Multi-tenant issuer validationconst tenantId = payload.tid; // Tenant ID from tokenconst expectedIssuer = https://login.microsoftonline.com/${tenantId}/v2.0;if (payload.iss !== expectedIssuer) {  throw new Error("Invalid issuer");}
```
```
https://login.microsoftonline.com/${tenantId}/v2.0
```
```
VITE_AZURE_CLIENT_ID=your-client-id-guidVITE_AZURE_TENANT_ID=your-tenant-id-guid
```
```
VITE_AZURE_CLIENT_ID=your-client-id-guidVITE_AZURE_TENANT_ID=your-tenant-id-guid
```
```
{  "name": "my-api",  "vars": {    "AZURE_TENANT_ID": "your-tenant-id-guid",    "AZURE_CLIENT_ID": "your-client-id-guid"  }}
```
```
{  "name": "my-api",  "vars": {    "AZURE_TENANT_ID": "your-tenant-id-guid",    "AZURE_CLIENT_ID": "your-client-id-guid"  }}
```
```
{tenant}.ciamlogin.com
```
```
{tenant}.b2clogin.com
```
```
// ADAL (deprecated) - resource-basedacquireToken({ resource: "https://graph.microsoft.com" })// MSAL (current) - scope-basedacquireTokenSilent({ scopes: ["https://graph.microsoft.com/User.Read"] })
```
```
// ADAL (deprecated) - resource-basedacquireToken({ resource: "https://graph.microsoft.com" })// MSAL (current) - scope-basedacquireTokenSilent({ scopes: ["https://graph.microsoft.com/User.Read"] })
```
```
cacheLocation: "sessionStorage"
```
```
storeAuthStateInCookie: true
```
```
authority: "https://login.microsoftonline.com/common"
```
```
acquireTokenSilent
```
```
getAllAccounts().length > 0
```
```
InteractionRequiredAuthError
```
```
inProgress !== InteractionStatus.None
```
```
.well-known/jwks.json
```
```
openid-configuration
```
```
jwks_uri
```
```
tid
```
```
MsalAuthenticationTemplate
```
```
NavigationClient
```
```
loginRedirect
```
```
useEffect
```
```
http://localhost:5173
```
```
import.meta.env.VITE_AZURE_CLIENT_ID
```
```
.env
```
```
process.env
```
```
import.meta.env
```
This agent skill provides a comprehensive guide to implementing robust authentication for modern web applications. It focuses on integrating Microsoft Entra ID (formerly Azure AD) with React single-page applications using MSAL.js, while offloading secure JWT token validation to Cloudflare Workers. Developers will find clear architectural insights and crucial versioning information to navigate potential breaking changes. Leverage this skill to build highly secure and scalable authentication flows that comply with industry best practices, ensuring your user data and application endpoints are well-protected against unauthorized access.

# When to Use This Skill
- •Implementing secure user login for React SPAs using Microsoft Entra ID.
- •Validating JWT access tokens on a Cloudflare Worker backend for API protection.
- •Migrating existing Azure AD B2C or ADAL authentication systems to the latest MSAL.js v5.
- •Setting up a modern authentication architecture for serverless applications with frontend React.

# Pro Tips
- 💡MSAL.js is browser/Node.js specific; use a library like `jose` for JWT validation directly within Cloudflare Workers to avoid compatibility issues.
- 💡Pay close attention to announced deprecations (Azure AD B2C, ADAL) to plan timely migrations to MSAL.js v5 or newer.
- 💡Always utilize the Authorization Code + PKCE flow for public clients (like SPAs) to mitigate authorization code interception attacks.

