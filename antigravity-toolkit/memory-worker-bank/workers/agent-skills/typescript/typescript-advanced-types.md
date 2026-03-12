# typescript-advanced-types
Source: https://antigravity.codes/agent-skills/typescript/typescript-advanced-types

## AI Worker Instructions
When the user requests functionality related to typescript-advanced-types, follow these guidelines and utilize this context.

## Scraped Content

# typescript-advanced-types
```
function identity<T>(value: T): T {  return value;}const num = identity<number>(42); // Type: numberconst str = identity<string>("hello"); // Type: stringconst auto = identity(true); // Type inferred: boolean
```
```
function identity<T>(value: T): T {  return value;}const num = identity<number>(42); // Type: numberconst str = identity<string>("hello"); // Type: stringconst auto = identity(true); // Type inferred: boolean
```
```
interface HasLength {  length: number;}function logLength<T extends HasLength>(item: T): T {  console.log(item.length);  return item;}logLength("hello"); // OK: string has lengthlogLength([1, 2, 3]); // OK: array has lengthlogLength({ length: 10 }); // OK: object has length// logLength(42);             // Error: number has no length
```
```
interface HasLength {  length: number;}function logLength<T extends HasLength>(item: T): T {  console.log(item.length);  return item;}logLength("hello"); // OK: string has lengthlogLength([1, 2, 3]); // OK: array has lengthlogLength({ length: 10 }); // OK: object has length// logLength(42);             // Error: number has no length
```
```
function merge<T, U>(obj1: T, obj2: U): T & U {  return { ...obj1, ...obj2 };}const merged = merge({ name: "John" }, { age: 30 });// Type: { name: string } & { age: number }
```
```
function merge<T, U>(obj1: T, obj2: U): T & U {  return { ...obj1, ...obj2 };}const merged = merge({ name: "John" }, { age: 30 });// Type: { name: string } & { age: number }
```
```
type IsString<T> = T extends string ? true : false;type A = IsString<string>; // truetype B = IsString<number>; // false
```
```
type IsString<T> = T extends string ? true : false;type A = IsString<string>; // truetype B = IsString<number>; // false
```
```
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;function getUser() {  return { id: 1, name: "John" };}type User = ReturnType<typeof getUser>;// Type: { id: number; name: string; }
```
```
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;function getUser() {  return { id: 1, name: "John" };}type User = ReturnType<typeof getUser>;// Type: { id: number; name: string; }
```
```
type ToArray<T> = T extends any ? T[] : never;type StrOrNumArray = ToArray<string | number>;// Type: string[] | number[]
```
```
type ToArray<T> = T extends any ? T[] : never;type StrOrNumArray = ToArray<string | number>;// Type: string[] | number[]
```
```
type TypeName<T> = T extends string  ? "string"  : T extends number    ? "number"    : T extends boolean      ? "boolean"      : T extends undefined        ? "undefined"        : T extends Function          ? "function"          : "object";type T1 = TypeName<string>; // "string"type T2 = TypeName<() => void>; // "function"
```
```
type TypeName<T> = T extends string  ? "string"  : T extends number    ? "number"    : T extends boolean      ? "boolean"      : T extends undefined        ? "undefined"        : T extends Function          ? "function"          : "object";type T1 = TypeName<string>; // "string"type T2 = TypeName<() => void>; // "function"
```
```
type Readonly<T> = {  readonly [P in keyof T]: T[P];};interface User {  id: number;  name: string;}type ReadonlyUser = Readonly<User>;// Type: { readonly id: number; readonly name: string; }
```
```
type Readonly<T> = {  readonly [P in keyof T]: T[P];};interface User {  id: number;  name: string;}type ReadonlyUser = Readonly<User>;// Type: { readonly id: number; readonly name: string; }
```
```
type Partial<T> = {  [P in keyof T]?: T[P];};type PartialUser = Partial<User>;// Type: { id?: number; name?: string; }
```
```
type Partial<T> = {  [P in keyof T]?: T[P];};type PartialUser = Partial<User>;// Type: { id?: number; name?: string; }
```
```
type Getters<T> = {  [K in keyof T as get${Capitalize<string & K>}]: () => T[K];};interface Person {  name: string;  age: number;}type PersonGetters = Getters<Person>;// Type: { getName: () => string; getAge: () => number; }
```
```
type Getters<T> = {  [K in keyof T as get${Capitalize<string & K>}]: () => T[K];};interface Person {  name: string;  age: number;}type PersonGetters = Getters<Person>;// Type: { getName: () => string; getAge: () => number; }
```
```
get${Capitalize<string & K>}
```
```
type PickByType<T, U> = {  [K in keyof T as T[K] extends U ? K : never]: T[K];};interface Mixed {  id: number;  name: string;  age: number;  active: boolean;}type OnlyNumbers = PickByType<Mixed, number>;// Type: { id: number; age: number; }
```
```
type PickByType<T, U> = {  [K in keyof T as T[K] extends U ? K : never]: T[K];};interface Mixed {  id: number;  name: string;  age: number;  active: boolean;}type OnlyNumbers = PickByType<Mixed, number>;// Type: { id: number; age: number; }
```
```
type EventName = "click" | "focus" | "blur";type EventHandler = on${Capitalize<EventName>};// Type: "onClick" | "onFocus" | "onBlur"
```
```
type EventName = "click" | "focus" | "blur";type EventHandler = on${Capitalize<EventName>};// Type: "onClick" | "onFocus" | "onBlur"
```
```
on${Capitalize<EventName>}
```
```
type UppercaseGreeting = Uppercase<"hello">; // "HELLO"type LowercaseGreeting = Lowercase<"HELLO">; // "hello"type CapitalizedName = Capitalize<"john">; // "John"type UncapitalizedName = Uncapitalize<"John">; // "john"
```
```
type UppercaseGreeting = Uppercase<"hello">; // "HELLO"type LowercaseGreeting = Lowercase<"HELLO">; // "hello"type CapitalizedName = Capitalize<"john">; // "John"type UncapitalizedName = Uncapitalize<"John">; // "john"
```
```
type Path<T> = T extends object  ? {      [K in keyof T]: K extends string ? ${K} | ${K}.${Path<T[K]>} : never;    }[keyof T]  : never;interface Config {  server: {    host: string;    port: number;  };  database: {    url: string;  };}type ConfigPath = Path<Config>;// Type: "server" | "database" | "server.host" | "server.port" | "database.url"
```
```
type Path<T> = T extends object  ? {      [K in keyof T]: K extends string ? ${K} | ${K}.${Path<T[K]>} : never;    }[keyof T]  : never;interface Config {  server: {    host: string;    port: number;  };  database: {    url: string;  };}type ConfigPath = Path<Config>;// Type: "server" | "database" | "server.host" | "server.port" | "database.url"
```
```
${K}
```
```
${K}.${Path<T[K]>}
```
```
// Partial<T> - Make all properties optionaltype PartialUser = Partial<User>;// Required<T> - Make all properties requiredtype RequiredUser = Required<PartialUser>;// Readonly<T> - Make all properties readonlytype ReadonlyUser = Readonly<User>;// Pick<T, K> - Select specific propertiestype UserName = Pick<User, "name" | "email">;// Omit<T, K> - Remove specific propertiestype UserWithoutPassword = Omit<User, "password">;// Exclude<T, U> - Exclude types from uniontype T1 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"// Extract<T, U> - Extract types from uniontype T2 = Extract<"a" | "b" | "c", "a" | "b">; // "a" | "b"// NonNullable<T> - Exclude null and undefinedtype T3 = NonNullable<string | null | undefined>; // string// Record<K, T> - Create object type with keys K and values Ttype PageInfo = Record<"home" | "about", { title: string }>;
```
```
// Partial<T> - Make all properties optionaltype PartialUser = Partial<User>;// Required<T> - Make all properties requiredtype RequiredUser = Required<PartialUser>;// Readonly<T> - Make all properties readonlytype ReadonlyUser = Readonly<User>;// Pick<T, K> - Select specific propertiestype UserName = Pick<User, "name" | "email">;// Omit<T, K> - Remove specific propertiestype UserWithoutPassword = Omit<User, "password">;// Exclude<T, U> - Exclude types from uniontype T1 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"// Extract<T, U> - Extract types from uniontype T2 = Extract<"a" | "b" | "c", "a" | "b">; // "a" | "b"// NonNullable<T> - Exclude null and undefinedtype T3 = NonNullable<string | null | undefined>; // string// Record<K, T> - Create object type with keys K and values Ttype PageInfo = Record<"home" | "about", { title: string }>;
```
```
type EventMap = {  "user:created": { id: string; name: string };  "user:updated": { id: string };  "user:deleted": { id: string };};class TypedEventEmitter<T extends Record<string, any>> {  private listeners: {    [K in keyof T]?: Array<(data: T[K]) => void>;  } = {};  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {    if (!this.listeners[event]) {      this.listeners[event] = [];    }    this.listeners[event]!.push(callback);  }  emit<K extends keyof T>(event: K, data: T[K]): void {    const callbacks = this.listeners[event];    if (callbacks) {      callbacks.forEach((callback) => callback(data));    }  }}const emitter = new TypedEventEmitter<EventMap>();emitter.on("user:created", (data) => {  console.log(data.id, data.name); // Type-safe!});emitter.emit("user:created", { id: "1", name: "John" });// emitter.emit("user:created", { id: "1" });  // Error: missing 'name'
```
```
type EventMap = {  "user:created": { id: string; name: string };  "user:updated": { id: string };  "user:deleted": { id: string };};class TypedEventEmitter<T extends Record<string, any>> {  private listeners: {    [K in keyof T]?: Array<(data: T[K]) => void>;  } = {};  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {    if (!this.listeners[event]) {      this.listeners[event] = [];    }    this.listeners[event]!.push(callback);  }  emit<K extends keyof T>(event: K, data: T[K]): void {    const callbacks = this.listeners[event];    if (callbacks) {      callbacks.forEach((callback) => callback(data));    }  }}const emitter = new TypedEventEmitter<EventMap>();emitter.on("user:created", (data) => {  console.log(data.id, data.name); // Type-safe!});emitter.emit("user:created", { id: "1", name: "John" });// emitter.emit("user:created", { id: "1" });  // Error: missing 'name'
```
```
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";type EndpointConfig = {  "/users": {    GET: { response: User[] };    POST: { body: { name: string; email: string }; response: User };  };  "/users/:id": {    GET: { params: { id: string }; response: User };    PUT: { params: { id: string }; body: Partial<User>; response: User };    DELETE: { params: { id: string }; response: void };  };};type ExtractParams<T> = T extends { params: infer P } ? P : never;type ExtractBody<T> = T extends { body: infer B } ? B : never;type ExtractResponse<T> = T extends { response: infer R } ? R : never;class APIClient<Config extends Record<string, Record<HTTPMethod, any>>> {  async request<Path extends keyof Config, Method extends keyof Config[Path]>(    path: Path,    method: Method,    ...[options]: ExtractParams<Config[Path][Method]> extends never      ? ExtractBody<Config[Path][Method]> extends never        ? []        : [{ body: ExtractBody<Config[Path][Method]> }]      : [          {            params: ExtractParams<Config[Path][Method]>;            body?: ExtractBody<Config[Path][Method]>;          },        ]  ): Promise<ExtractResponse<Config[Path][Method]>> {    // Implementation here    return {} as any;  }}const api = new APIClient<EndpointConfig>();// Type-safe API callsconst users = await api.request("/users", "GET");// Type: User[]const newUser = await api.request("/users", "POST", {  body: { name: "John", email: "john@example.com" },});// Type: Userconst user = await api.request("/users/:id", "GET", {  params: { id: "123" },});// Type: User
```
```
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";type EndpointConfig = {  "/users": {    GET: { response: User[] };    POST: { body: { name: string; email: string }; response: User };  };  "/users/:id": {    GET: { params: { id: string }; response: User };    PUT: { params: { id: string }; body: Partial<User>; response: User };    DELETE: { params: { id: string }; response: void };  };};type ExtractParams<T> = T extends { params: infer P } ? P : never;type ExtractBody<T> = T extends { body: infer B } ? B : never;type ExtractResponse<T> = T extends { response: infer R } ? R : never;class APIClient<Config extends Record<string, Record<HTTPMethod, any>>> {  async request<Path extends keyof Config, Method extends keyof Config[Path]>(    path: Path,    method: Method,    ...[options]: ExtractParams<Config[Path][Method]> extends never      ? ExtractBody<Config[Path][Method]> extends never        ? []        : [{ body: ExtractBody<Config[Path][Method]> }]      : [          {            params: ExtractParams<Config[Path][Method]>;            body?: ExtractBody<Config[Path][Method]>;          },        ]  ): Promise<ExtractResponse<Config[Path][Method]>> {    // Implementation here    return {} as any;  }}const api = new APIClient<EndpointConfig>();// Type-safe API callsconst users = await api.request("/users", "GET");// Type: User[]const newUser = await api.request("/users", "POST", {  body: { name: "John", email: "john@example.com" },});// Type: Userconst user = await api.request("/users/:id", "GET", {  params: { id: "123" },});// Type: User
```
```
type BuilderState<T> = {  [K in keyof T]: T[K] | undefined;};type RequiredKeys<T> = {  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;}[keyof T];type OptionalKeys<T> = {  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;}[keyof T];type IsComplete<T, S> =  RequiredKeys<T> extends keyof S    ? S[RequiredKeys<T>] extends undefined      ? false      : true    : false;class Builder<T, S extends BuilderState<T> = {}> {  private state: S = {} as S;  set<K extends keyof T>(key: K, value: T[K]): Builder<T, S & Record<K, T[K]>> {    this.state[key] = value;    return this as any;  }  build(this: IsComplete<T, S> extends true ? this : never): T {    return this.state as T;  }}interface User {  id: string;  name: string;  email: string;  age?: number;}const builder = new Builder<User>();const user = builder  .set("id", "1")  .set("name", "John")  .set("email", "john@example.com")  .build(); // OK: all required fields set// const incomplete = builder//   .set("id", "1")//   .build();  // Error: missing required fields
```
```
type BuilderState<T> = {  [K in keyof T]: T[K] | undefined;};type RequiredKeys<T> = {  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;}[keyof T];type OptionalKeys<T> = {  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;}[keyof T];type IsComplete<T, S> =  RequiredKeys<T> extends keyof S    ? S[RequiredKeys<T>] extends undefined      ? false      : true    : false;class Builder<T, S extends BuilderState<T> = {}> {  private state: S = {} as S;  set<K extends keyof T>(key: K, value: T[K]): Builder<T, S & Record<K, T[K]>> {    this.state[key] = value;    return this as any;  }  build(this: IsComplete<T, S> extends true ? this : never): T {    return this.state as T;  }}interface User {  id: string;  name: string;  email: string;  age?: number;}const builder = new Builder<User>();const user = builder  .set("id", "1")  .set("name", "John")  .set("email", "john@example.com")  .build(); // OK: all required fields set// const incomplete = builder//   .set("id", "1")//   .build();  // Error: missing required fields
```
```
type DeepReadonly<T> = {  readonly [P in keyof T]: T[P] extends object    ? T[P] extends Function      ? T[P]      : DeepReadonly<T[P]>    : T[P];};type DeepPartial<T> = {  [P in keyof T]?: T[P] extends object    ? T[P] extends Array<infer U>      ? Array<DeepPartial<U>>      : DeepPartial<T[P]>    : T[P];};interface Config {  server: {    host: string;    port: number;    ssl: {      enabled: boolean;      cert: string;    };  };  database: {    url: string;    pool: {      min: number;      max: number;    };  };}type ReadonlyConfig = DeepReadonly<Config>;// All nested properties are readonlytype PartialConfig = DeepPartial<Config>;// All nested properties are optional
```
```
type DeepReadonly<T> = {  readonly [P in keyof T]: T[P] extends object    ? T[P] extends Function      ? T[P]      : DeepReadonly<T[P]>    : T[P];};type DeepPartial<T> = {  [P in keyof T]?: T[P] extends object    ? T[P] extends Array<infer U>      ? Array<DeepPartial<U>>      : DeepPartial<T[P]>    : T[P];};interface Config {  server: {    host: string;    port: number;    ssl: {      enabled: boolean;      cert: string;    };  };  database: {    url: string;    pool: {      min: number;      max: number;    };  };}type ReadonlyConfig = DeepReadonly<Config>;// All nested properties are readonlytype PartialConfig = DeepPartial<Config>;// All nested properties are optional
```
```
type ValidationRule<T> = {  validate: (value: T) => boolean;  message: string;};type FieldValidation<T> = {  [K in keyof T]?: ValidationRule<T[K]>[];};type ValidationErrors<T> = {  [K in keyof T]?: string[];};class FormValidator<T extends Record<string, any>> {  constructor(private rules: FieldValidation<T>) {}  validate(data: T): ValidationErrors<T> | null {    const errors: ValidationErrors<T> = {};    let hasErrors = false;    for (const key in this.rules) {      const fieldRules = this.rules[key];      const value = data[key];      if (fieldRules) {        const fieldErrors: string[] = [];        for (const rule of fieldRules) {          if (!rule.validate(value)) {            fieldErrors.push(rule.message);          }        }        if (fieldErrors.length > 0) {          errors[key] = fieldErrors;          hasErrors = true;        }      }    }    return hasErrors ? errors : null;  }}interface LoginForm {  email: string;  password: string;}const validator = new FormValidator<LoginForm>({  email: [    {      validate: (v) => v.includes("@"),      message: "Email must contain @",    },    {      validate: (v) => v.length > 0,      message: "Email is required",    },  ],  password: [    {      validate: (v) => v.length >= 8,      message: "Password must be at least 8 characters",    },  ],});const errors = validator.validate({  email: "invalid",  password: "short",});// Type: { email?: string[]; password?: string[]; } | null
```
```
type ValidationRule<T> = {  validate: (value: T) => boolean;  message: string;};type FieldValidation<T> = {  [K in keyof T]?: ValidationRule<T[K]>[];};type ValidationErrors<T> = {  [K in keyof T]?: string[];};class FormValidator<T extends Record<string, any>> {  constructor(private rules: FieldValidation<T>) {}  validate(data: T): ValidationErrors<T> | null {    const errors: ValidationErrors<T> = {};    let hasErrors = false;    for (const key in this.rules) {      const fieldRules = this.rules[key];      const value = data[key];      if (fieldRules) {        const fieldErrors: string[] = [];        for (const rule of fieldRules) {          if (!rule.validate(value)) {            fieldErrors.push(rule.message);          }        }        if (fieldErrors.length > 0) {          errors[key] = fieldErrors;          hasErrors = true;        }      }    }    return hasErrors ? errors : null;  }}interface LoginForm {  email: string;  password: string;}const validator = new FormValidator<LoginForm>({  email: [    {      validate: (v) => v.includes("@"),      message: "Email must contain @",    },    {      validate: (v) => v.length > 0,      message: "Email is required",    },  ],  password: [    {      validate: (v) => v.length >= 8,      message: "Password must be at least 8 characters",    },  ],});const errors = validator.validate({  email: "invalid",  password: "short",});// Type: { email?: string[]; password?: string[]; } | null
```
```
type Success<T> = {  status: "success";  data: T;};type Error = {  status: "error";  error: string;};type Loading = {  status: "loading";};type AsyncState<T> = Success<T> | Error | Loading;function handleState<T>(state: AsyncState<T>): void {  switch (state.status) {    case "success":      console.log(state.data); // Type: T      break;    case "error":      console.log(state.error); // Type: string      break;    case "loading":      console.log("Loading...");      break;  }}// Type-safe state machinetype State =  | { type: "idle" }  | { type: "fetching"; requestId: string }  | { type: "success"; data: any }  | { type: "error"; error: Error };type Event =  | { type: "FETCH"; requestId: string }  | { type: "SUCCESS"; data: any }  | { type: "ERROR"; error: Error }  | { type: "RESET" };function reducer(state: State, event: Event): State {  switch (state.type) {    case "idle":      return event.type === "FETCH"        ? { type: "fetching", requestId: event.requestId }        : state;    case "fetching":      if (event.type === "SUCCESS") {        return { type: "success", data: event.data };      }      if (event.type === "ERROR") {        return { type: "error", error: event.error };      }      return state;    case "success":    case "error":      return event.type === "RESET" ? { type: "idle" } : state;  }}
```
```
type Success<T> = {  status: "success";  data: T;};type Error = {  status: "error";  error: string;};type Loading = {  status: "loading";};type AsyncState<T> = Success<T> | Error | Loading;function handleState<T>(state: AsyncState<T>): void {  switch (state.status) {    case "success":      console.log(state.data); // Type: T      break;    case "error":      console.log(state.error); // Type: string      break;    case "loading":      console.log("Loading...");      break;  }}// Type-safe state machinetype State =  | { type: "idle" }  | { type: "fetching"; requestId: string }  | { type: "success"; data: any }  | { type: "error"; error: Error };type Event =  | { type: "FETCH"; requestId: string }  | { type: "SUCCESS"; data: any }  | { type: "ERROR"; error: Error }  | { type: "RESET" };function reducer(state: State, event: Event): State {  switch (state.type) {    case "idle":      return event.type === "FETCH"        ? { type: "fetching", requestId: event.requestId }        : state;    case "fetching":      if (event.type === "SUCCESS") {        return { type: "success", data: event.data };      }      if (event.type === "ERROR") {        return { type: "error", error: event.error };      }      return state;    case "success":    case "error":      return event.type === "RESET" ? { type: "idle" } : state;  }}
```
```
// Extract array element typetype ElementType<T> = T extends (infer U)[] ? U : never;type NumArray = number[];type Num = ElementType<NumArray>; // number// Extract promise typetype PromiseType<T> = T extends Promise<infer U> ? U : never;type AsyncNum = PromiseType<Promise<number>>; // number// Extract function parameterstype Parameters<T> = T extends (...args: infer P) => any ? P : never;function foo(a: string, b: number) {}type FooParams = Parameters<typeof foo>; // [string, number]
```
```
// Extract array element typetype ElementType<T> = T extends (infer U)[] ? U : never;type NumArray = number[];type Num = ElementType<NumArray>; // number// Extract promise typetype PromiseType<T> = T extends Promise<infer U> ? U : never;type AsyncNum = PromiseType<Promise<number>>; // number// Extract function parameterstype Parameters<T> = T extends (...args: infer P) => any ? P : never;function foo(a: string, b: number) {}type FooParams = Parameters<typeof foo>; // [string, number]
```
```
function isString(value: unknown): value is string {  return typeof value === "string";}function isArrayOf<T>(  value: unknown,  guard: (item: unknown) => item is T,): value is T[] {  return Array.isArray(value) && value.every(guard);}const data: unknown = ["a", "b", "c"];if (isArrayOf(data, isString)) {  data.forEach((s) => s.toUpperCase()); // Type: string[]}
```
```
function isString(value: unknown): value is string {  return typeof value === "string";}function isArrayOf<T>(  value: unknown,  guard: (item: unknown) => item is T,): value is T[] {  return Array.isArray(value) && value.every(guard);}const data: unknown = ["a", "b", "c"];if (isArrayOf(data, isString)) {  data.forEach((s) => s.toUpperCase()); // Type: string[]}
```
```
function assertIsString(value: unknown): asserts value is string {  if (typeof value !== "string") {    throw new Error("Not a string");  }}function processValue(value: unknown) {  assertIsString(value);  // value is now typed as string  console.log(value.toUpperCase());}
```
```
function assertIsString(value: unknown): asserts value is string {  if (typeof value !== "string") {    throw new Error("Not a string");  }}function processValue(value: unknown) {  assertIsString(value);  // value is now typed as string  console.log(value.toUpperCase());}
```
```
unknown
```
```
any
```
```
interface
```
```
type
```
```
// Type assertion teststype AssertEqual<T, U> = [T] extends [U]  ? [U] extends [T]    ? true    : false  : false;type Test1 = AssertEqual<string, string>; // truetype Test2 = AssertEqual<string, number>; // falsetype Test3 = AssertEqual<string | number, string>; // false// Expect error helpertype ExpectError<T extends never> = T;// Example usagetype ShouldError = ExpectError<AssertEqual<string, number>>;
```
```
// Type assertion teststype AssertEqual<T, U> = [T] extends [U]  ? [U] extends [T]    ? true    : false  : false;type Test1 = AssertEqual<string, string>; // truetype Test2 = AssertEqual<string, number>; // falsetype Test3 = AssertEqual<string | number, string>; // false// Expect error helpertype ExpectError<T extends never> = T;// Example usagetype ShouldError = ExpectError<AssertEqual<string, number>>;
```
```
any
```
Unlock the full potential of your TypeScript projects with this specialized AI Agent Skill designed for mastering advanced typing concepts. This skill empowers you to transcend basic type declarations, delving into powerful paradigms like generics for flexible, reusable components, and conditional types for intricate logic. Whether you're architecting large-scale applications or developing precise utility libraries, this guidance ensures your codebase remains impeccably type-safe, reducing bugs and enhancing maintainability. Elevate your development workflow by leveraging sophisticated type inference and compile-time validation, making your TypeScript journey more robust and efficient.

# When to Use This Skill
- •Developing highly reusable functions and components with varying input types using generics.
- •Crafting precise type transformations and inference logic using conditional and mapped types for complex data structures.
- •Ensuring compile-time safety and autocompletion for API clients or configuration objects.
- •Refactoring large JavaScript codebases to TypeScript, leveraging advanced types for robust migrations.

# Pro Tips
- 💡Always strive for the narrowest possible types to maximize type safety and allow the compiler to catch more errors early.
- 💡When dealing with complex generics, consider adding JSDoc comments to explain the purpose of type parameters, enhancing readability for others (and your future self).
- 💡Before resorting to 'any', explore conditional types, mapped types, or even 'unknown' combined with type guards to maintain strong typing throughout your codebase.

