# native-data-fetching
Source: https://antigravity.codes/agent-skills/expo/native-data-fetching

## AI Worker Instructions
When the user requests functionality related to native-data-fetching, follow these guidelines and utilize this context.

## Scraped Content

# native-data-fetching
```
const fetchUser = async (userId: string) => {  const response = await fetch(https://api.example.com/users/${userId});  if (!response.ok) {    throw new Error(HTTP error! status: ${response.status});  }  return response.json();};
```
```
const fetchUser = async (userId: string) => {  const response = await fetch(https://api.example.com/users/${userId});  if (!response.ok) {    throw new Error(HTTP error! status: ${response.status});  }  return response.json();};
```
```
https://api.example.com/users/${userId}
```
```
HTTP error! status: ${response.status}
```
```
const createUser = async (userData: UserData) => {  const response = await fetch("https://api.example.com/users", {    method: "POST",    headers: {      "Content-Type": "application/json",      Authorization: Bearer ${token},    },    body: JSON.stringify(userData),  });  if (!response.ok) {    const error = await response.json();    throw new Error(error.message);  }  return response.json();};
```
```
const createUser = async (userData: UserData) => {  const response = await fetch("https://api.example.com/users", {    method: "POST",    headers: {      "Content-Type": "application/json",      Authorization: Bearer ${token},    },    body: JSON.stringify(userData),  });  if (!response.ok) {    const error = await response.json();    throw new Error(error.message);  }  return response.json();};
```
```
Bearer ${token}
```
```
// app/_layout.tsximport { QueryClient, QueryClientProvider } from "@tanstack/react-query";const queryClient = new QueryClient({  defaultOptions: {    queries: {      staleTime: 1000 * 60 * 5, // 5 minutes      retry: 2,    },  },});export default function RootLayout() {  return (    <QueryClientProvider client={queryClient}>      <Stack />    </QueryClientProvider>  );}
```
```
// app/_layout.tsximport { QueryClient, QueryClientProvider } from "@tanstack/react-query";const queryClient = new QueryClient({  defaultOptions: {    queries: {      staleTime: 1000 * 60 * 5, // 5 minutes      retry: 2,    },  },});export default function RootLayout() {  return (    <QueryClientProvider client={queryClient}>      <Stack />    </QueryClientProvider>  );}
```
```
import { useQuery } from "@tanstack/react-query";function UserProfile({ userId }: { userId: string }) {  const { data, isLoading, error, refetch } = useQuery({    queryKey: ["user", userId],    queryFn: () => fetchUser(userId),  });  if (isLoading) return <Loading />;  if (error) return <Error message={error.message} />;  return <Profile user={data} />;}
```
```
import { useQuery } from "@tanstack/react-query";function UserProfile({ userId }: { userId: string }) {  const { data, isLoading, error, refetch } = useQuery({    queryKey: ["user", userId],    queryFn: () => fetchUser(userId),  });  if (isLoading) return <Loading />;  if (error) return <Error message={error.message} />;  return <Profile user={data} />;}
```
```
import { useMutation, useQueryClient } from "@tanstack/react-query";function CreateUserForm() {  const queryClient = useQueryClient();  const mutation = useMutation({    mutationFn: createUser,    onSuccess: () => {      // Invalidate and refetch      queryClient.invalidateQueries({ queryKey: ["users"] });    },  });  const handleSubmit = (data: UserData) => {    mutation.mutate(data);  };  return <Form onSubmit={handleSubmit} isLoading={mutation.isPending} />;}
```
```
import { useMutation, useQueryClient } from "@tanstack/react-query";function CreateUserForm() {  const queryClient = useQueryClient();  const mutation = useMutation({    mutationFn: createUser,    onSuccess: () => {      // Invalidate and refetch      queryClient.invalidateQueries({ queryKey: ["users"] });    },  });  const handleSubmit = (data: UserData) => {    mutation.mutate(data);  };  return <Form onSubmit={handleSubmit} isLoading={mutation.isPending} />;}
```
```
class ApiError extends Error {  constructor(message: string, public status: number, public code?: string) {    super(message);    this.name = "ApiError";  }}const fetchWithErrorHandling = async (url: string, options?: RequestInit) => {  try {    const response = await fetch(url, options);    if (!response.ok) {      const error = await response.json().catch(() => ({}));      throw new ApiError(        error.message || "Request failed",        response.status,        error.code      );    }    return response.json();  } catch (error) {    if (error instanceof ApiError) {      throw error;    }    // Network error (no internet, timeout, etc.)    throw new ApiError("Network error", 0, "NETWORK_ERROR");  }};
```
```
class ApiError extends Error {  constructor(message: string, public status: number, public code?: string) {    super(message);    this.name = "ApiError";  }}const fetchWithErrorHandling = async (url: string, options?: RequestInit) => {  try {    const response = await fetch(url, options);    if (!response.ok) {      const error = await response.json().catch(() => ({}));      throw new ApiError(        error.message || "Request failed",        response.status,        error.code      );    }    return response.json();  } catch (error) {    if (error instanceof ApiError) {      throw error;    }    // Network error (no internet, timeout, etc.)    throw new ApiError("Network error", 0, "NETWORK_ERROR");  }};
```
```
const fetchWithRetry = async (  url: string,  options?: RequestInit,  retries = 3) => {  for (let i = 0; i < retries; i++) {    try {      return await fetchWithErrorHandling(url, options);    } catch (error) {      if (i === retries - 1) throw error;      // Exponential backoff      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));    }  }};
```
```
const fetchWithRetry = async (  url: string,  options?: RequestInit,  retries = 3) => {  for (let i = 0; i < retries; i++) {    try {      return await fetchWithErrorHandling(url, options);    } catch (error) {      if (i === retries - 1) throw error;      // Exponential backoff      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));    }  }};
```
```
import * as SecureStore from "expo-secure-store";const TOKEN_KEY = "auth_token";export const auth = {  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),  removeToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),};// Authenticated fetch wrapperconst authFetch = async (url: string, options: RequestInit = {}) => {  const token = await auth.getToken();  return fetch(url, {    ...options,    headers: {      ...options.headers,      Authorization: token ? Bearer ${token} : "",    },  });};
```
```
import * as SecureStore from "expo-secure-store";const TOKEN_KEY = "auth_token";export const auth = {  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),  removeToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),};// Authenticated fetch wrapperconst authFetch = async (url: string, options: RequestInit = {}) => {  const token = await auth.getToken();  return fetch(url, {    ...options,    headers: {      ...options.headers,      Authorization: token ? Bearer ${token} : "",    },  });};
```
```
Bearer ${token}
```
```
let isRefreshing = false;let refreshPromise: Promise<string> | null = null;const getValidToken = async (): Promise<string> => {  const token = await auth.getToken();  if (!token || isTokenExpired(token)) {    if (!isRefreshing) {      isRefreshing = true;      refreshPromise = refreshToken().finally(() => {        isRefreshing = false;        refreshPromise = null;      });    }    return refreshPromise!;  }  return token;};
```
```
let isRefreshing = false;let refreshPromise: Promise<string> | null = null;const getValidToken = async (): Promise<string> => {  const token = await auth.getToken();  if (!token || isTokenExpired(token)) {    if (!isRefreshing) {      isRefreshing = true;      refreshPromise = refreshToken().finally(() => {        isRefreshing = false;        refreshPromise = null;      });    }    return refreshPromise!;  }  return token;};
```
```
import NetInfo from "@react-native-community/netinfo";// Hook for network statusfunction useNetworkStatus() {  const [isOnline, setIsOnline] = useState(true);  useEffect(() => {    return NetInfo.addEventListener((state) => {      setIsOnline(state.isConnected ?? true);    });  }, []);  return isOnline;}
```
```
import NetInfo from "@react-native-community/netinfo";// Hook for network statusfunction useNetworkStatus() {  const [isOnline, setIsOnline] = useState(true);  useEffect(() => {    return NetInfo.addEventListener((state) => {      setIsOnline(state.isConnected ?? true);    });  }, []);  return isOnline;}
```
```
import { onlineManager } from "@tanstack/react-query";import NetInfo from "@react-native-community/netinfo";// Sync React Query with network statusonlineManager.setEventListener((setOnline) => {  return NetInfo.addEventListener((state) => {    setOnline(state.isConnected ?? true);  });});// Queries will pause when offline and resume when online
```
```
import { onlineManager } from "@tanstack/react-query";import NetInfo from "@react-native-community/netinfo";// Sync React Query with network statusonlineManager.setEventListener((setOnline) => {  return NetInfo.addEventListener((state) => {    setOnline(state.isConnected ?? true);  });});// Queries will pause when offline and resume when online
```
```
EXPO_PUBLIC_
```
```
// .envEXPO_PUBLIC_API_URL=https://api.example.comEXPO_PUBLIC_API_VERSION=v1// Usage in codeconst API_URL = process.env.EXPO_PUBLIC_API_URL;const fetchUsers = async () => {  const response = await fetch(${API_URL}/users);  return response.json();};
```
```
// .envEXPO_PUBLIC_API_URL=https://api.example.comEXPO_PUBLIC_API_VERSION=v1// Usage in codeconst API_URL = process.env.EXPO_PUBLIC_API_URL;const fetchUsers = async () => {  const response = await fetch(${API_URL}/users);  return response.json();};
```
```
${API_URL}/users
```
```
// .env.developmentEXPO_PUBLIC_API_URL=http://localhost:3000// .env.productionEXPO_PUBLIC_API_URL=https://api.production.com
```
```
// .env.developmentEXPO_PUBLIC_API_URL=http://localhost:3000// .env.productionEXPO_PUBLIC_API_URL=https://api.production.com
```
```
// api/client.tsconst BASE_URL = process.env.EXPO_PUBLIC_API_URL;if (!BASE_URL) {  throw new Error("EXPO_PUBLIC_API_URL is not defined");}export const apiClient = {  get: async <T,>(path: string): Promise<T> => {    const response = await fetch(${BASE_URL}${path});    if (!response.ok) throw new Error(HTTP ${response.status});    return response.json();  },  post: async <T,>(path: string, body: unknown): Promise<T> => {    const response = await fetch(${BASE_URL}${path}, {      method: "POST",      headers: { "Content-Type": "application/json" },      body: JSON.stringify(body),    });    if (!response.ok) throw new Error(HTTP ${response.status});    return response.json();  },};
```
```
// api/client.tsconst BASE_URL = process.env.EXPO_PUBLIC_API_URL;if (!BASE_URL) {  throw new Error("EXPO_PUBLIC_API_URL is not defined");}export const apiClient = {  get: async <T,>(path: string): Promise<T> => {    const response = await fetch(${BASE_URL}${path});    if (!response.ok) throw new Error(HTTP ${response.status});    return response.json();  },  post: async <T,>(path: string, body: unknown): Promise<T> => {    const response = await fetch(${BASE_URL}${path}, {      method: "POST",      headers: { "Content-Type": "application/json" },      body: JSON.stringify(body),    });    if (!response.ok) throw new Error(HTTP ${response.status});    return response.json();  },};
```
```
${BASE_URL}${path}
```
```
HTTP ${response.status}
```
```
${BASE_URL}${path}
```
```
HTTP ${response.status}
```
```
EXPO_PUBLIC_
```
```
EXPO_PUBLIC_
```
```
.env
```
```
EXPO_PUBLIC_
```
```
// types/env.d.tsdeclare global {  namespace NodeJS {    interface ProcessEnv {      EXPO_PUBLIC_API_URL: string;      EXPO_PUBLIC_API_VERSION?: string;    }  }}export {};
```
```
// types/env.d.tsdeclare global {  namespace NodeJS {    interface ProcessEnv {      EXPO_PUBLIC_API_URL: string;      EXPO_PUBLIC_API_VERSION?: string;    }  }}export {};
```
```
useEffect(() => {  const controller = new AbortController();  fetch(url, { signal: controller.signal })    .then((response) => response.json())    .then(setData)    .catch((error) => {      if (error.name !== "AbortError") {        setError(error);      }    });  return () => controller.abort();}, [url]);
```
```
useEffect(() => {  const controller = new AbortController();  fetch(url, { signal: controller.signal })    .then((response) => response.json())    .then(setData)    .catch((error) => {      if (error.name !== "AbortError") {        setError(error);      }    });  return () => controller.abort();}, [url]);
```
```
// React Query automatically cancels requests when queries are invalidated// or components unmount
```
```
// React Query automatically cancels requests when queries are invalidated// or components unmount
```
```
User asks about networking  |-- Basic fetch?  |   \-- Use fetch API with error handling  |  |-- Need caching/state management?  |   |-- Complex app -> React Query (TanStack Query)  |   \-- Simpler needs -> SWR or custom hooks  |  |-- Authentication?  |   |-- Token storage -> expo-secure-store  |   \-- Token refresh -> Implement refresh flow  |  |-- Error handling?  |   |-- Network errors -> Check connectivity first  |   |-- HTTP errors -> Parse response, throw typed errors  |   \-- Retries -> Exponential backoff  |  |-- Offline support?  |   |-- Check status -> NetInfo  |   \-- Queue requests -> React Query persistence  |  |-- Environment/API config?  |   |-- Client-side URLs -> EXPO_PUBLIC_ prefix in .env  |   |-- Server secrets -> Non-prefixed env vars (API routes only)  |   \-- Multiple environments -> .env.development, .env.production  |  \-- Performance?      |-- Caching -> React Query with staleTime      |-- Deduplication -> React Query handles this      \-- Cancellation -> AbortController or React Query
```
```
User asks about networking  |-- Basic fetch?  |   \-- Use fetch API with error handling  |  |-- Need caching/state management?  |   |-- Complex app -> React Query (TanStack Query)  |   \-- Simpler needs -> SWR or custom hooks  |  |-- Authentication?  |   |-- Token storage -> expo-secure-store  |   \-- Token refresh -> Implement refresh flow  |  |-- Error handling?  |   |-- Network errors -> Check connectivity first  |   |-- HTTP errors -> Parse response, throw typed errors  |   \-- Retries -> Exponential backoff  |  |-- Offline support?  |   |-- Check status -> NetInfo  |   \-- Queue requests -> React Query persistence  |  |-- Environment/API config?  |   |-- Client-side URLs -> EXPO_PUBLIC_ prefix in .env  |   |-- Server secrets -> Non-prefixed env vars (API routes only)  |   \-- Multiple environments -> .env.development, .env.production  |  \-- Performance?      |-- Caching -> React Query with staleTime      |-- Deduplication -> React Query handles this      \-- Cancellation -> AbortController or React Query
```
```
const data = await fetch(url).then((r) => r.json());
```
```
const data = await fetch(url).then((r) => r.json());
```
```
const response = await fetch(url);if (!response.ok) throw new Error(HTTP ${response.status});const data = await response.json();
```
```
const response = await fetch(url);if (!response.ok) throw new Error(HTTP ${response.status});const data = await response.json();
```
```
HTTP ${response.status}
```
```
await AsyncStorage.setItem("token", token); // Not secure!
```
```
await AsyncStorage.setItem("token", token); // Not secure!
```
```
await SecureStore.setItemAsync("token", token);
```
```
await SecureStore.setItemAsync("token", token);
```
In modern application development, robust data fetching and network management are paramount. This specialized AI agent skill empowers your coding assistant to proficiently handle all aspects of network communication, from initial API requests to sophisticated caching and error resolution. Whether you're integrating with backend services, optimizing data delivery with libraries like React Query, or ensuring resilient offline experiences, this skill provides the foundational expertise. It guides the agent through best practices for secure and efficient data exchange, significantly streamlining the development of data-driven features and ensuring your applications are always connected and responsive.

# When to Use This Skill
- •Building new features that require interaction with RESTful or GraphQL APIs.
- •Optimizing application performance through advanced data caching mechanisms.
- •Troubleshooting and resolving common network errors and connectivity issues.
- •Implementing secure authentication and token refresh flows for API access.

# Pro Tips
- 💡Prioritize `expo/fetch` over `axios` for Expo-specific projects to leverage platform optimizations and reduce bundle size.
- 💡Always implement comprehensive error handling, including network failures, HTTP status codes, and server-side errors, to provide a resilient user experience.
- 💡Strategically implement caching (e.g., with React Query or SWR) to reduce redundant requests and significantly improve application responsiveness and offline capabilities.

