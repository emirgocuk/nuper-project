# openapi-to-typescript
Source: https://antigravity.codes/agent-skills/typescript/openapi-to-typescript

## AI Worker Instructions
When the user requests functionality related to openapi-to-typescript, follow these guidelines and utilize this context.

## Scraped Content

# openapi-to-typescript
```
components/schemas
```
```
paths
```
```
types/api.ts
```
```
- Field "openapi" must exist and start with "3.0"- Field "paths" must exist- Field "components.schemas" must exist (if there are types)
```
```
- Field "openapi" must exist and start with "3.0"- Field "paths" must exist- Field "components.schemas" must exist (if there are types)
```
```
string
```
```
string
```
```
number
```
```
number
```
```
integer
```
```
number
```
```
boolean
```
```
boolean
```
```
null
```
```
null
```
```
uuid
```
```
string
```
```
date
```
```
string
```
```
date-time
```
```
string
```
```
email
```
```
string
```
```
uri
```
```
string
```
```
// OpenAPI: type: object, properties: {id, name}, required: [id]interface Example {  id: string;      // required: no ?  name?: string;   // optional: with ?}
```
```
// OpenAPI: type: object, properties: {id, name}, required: [id]interface Example {  id: string;      // required: no ?  name?: string;   // optional: with ?}
```
```
// OpenAPI: type: array, items: {type: string}type Names = string[];
```
```
// OpenAPI: type: array, items: {type: string}type Names = string[];
```
```
// OpenAPI: type: string, enum: [active, draft]type Status = "active" | "draft";
```
```
// OpenAPI: type: string, enum: [active, draft]type Status = "active" | "draft";
```
```
// OpenAPI: oneOf: [{$ref: Cat}, {$ref: Dog}]type Pet = Cat | Dog;
```
```
// OpenAPI: oneOf: [{$ref: Cat}, {$ref: Dog}]type Pet = Cat | Dog;
```
```
// OpenAPI: allOf: [{$ref: Base}, {type: object, properties: ...}]interface Extended extends Base {  extraField: string;}
```
```
// OpenAPI: allOf: [{$ref: Base}, {type: object, properties: ...}]interface Extended extends Base {  extraField: string;}
```
```
/** * Auto-generated from: {source_file} * Generated at: {timestamp} * * DO NOT EDIT MANUALLY - Regenerate from OpenAPI schema */
```
```
/** * Auto-generated from: {source_file} * Generated at: {timestamp} * * DO NOT EDIT MANUALLY - Regenerate from OpenAPI schema */
```
```
components/schemas
```
```
export interface Product {  /** Product unique identifier */  id: string;  /** Product title */  title: string;  /** Product price */  price: number;  /** Created timestamp */  created_at?: string;}
```
```
export interface Product {  /** Product unique identifier */  id: string;  /** Product title */  title: string;  /** Product price */  price: number;  /** Created timestamp */  created_at?: string;}
```
```
required[]
```
```
?
```
```
required[]
```
```
?
```
```
paths
```
```
// GET /products - query paramsexport interface GetProductsRequest {  page?: number;  limit?: number;}// GET /products - response 200export type GetProductsResponse = ProductList;// POST /products - request bodyexport interface CreateProductRequest {  title: string;  price: number;}// POST /products - response 201export type CreateProductResponse = Product;
```
```
// GET /products - query paramsexport interface GetProductsRequest {  page?: number;  limit?: number;}// GET /products - response 200export type GetProductsResponse = ProductList;// POST /products - request bodyexport interface CreateProductRequest {  title: string;  price: number;}// POST /products - response 201export type CreateProductResponse = Product;
```
```
{Method}{Path}Request
```
```
{Method}{Path}Response
```
```
export function isProduct(value: unknown): value is Product {  return (    typeof value === 'object' &&    value !== null &&    'id' in value &&    typeof (value as any).id === 'string' &&    'title' in value &&    typeof (value as any).title === 'string' &&    'price' in value &&    typeof (value as any).price === 'number'  );}
```
```
export function isProduct(value: unknown): value is Product {  return (    typeof value === 'object' &&    value !== null &&    'id' in value &&    typeof (value as any).id === 'string' &&    'title' in value &&    typeof (value as any).title === 'string' &&    'price' in value &&    typeof (value as any).price === 'number'  );}
```
```
typeof value === 'object' && value !== null
```
```
'field' in value
```
```
typeof
```
```
Array.isArray()
```
```
.includes()
```
```
export interface ApiError {  status: number;  error: string;  detail?: string;}export function isApiError(value: unknown): value is ApiError {  return (    typeof value === 'object' &&    value !== null &&    'status' in value &&    typeof (value as any).status === 'number' &&    'error' in value &&    typeof (value as any).error === 'string'  );}
```
```
export interface ApiError {  status: number;  error: string;  detail?: string;}export function isApiError(value: unknown): value is ApiError {  return (    typeof value === 'object' &&    value !== null &&    'status' in value &&    typeof (value as any).status === 'number' &&    'error' in value &&    typeof (value as any).error === 'string'  );}
```
```
{"$ref": "#/components/schemas/Product"}
```
```
Product
```
```
// OpenAPI: items: {$ref: "#/components/schemas/Product"}// TypeScript:items: Product[]  // reference, not inline
```
```
// OpenAPI: items: {$ref: "#/components/schemas/Product"}// TypeScript:items: Product[]  // reference, not inline
```
```
{  "openapi": "3.0.0",  "components": {    "schemas": {      "User": {        "type": "object",        "properties": {          "id": {"type": "string", "format": "uuid"},          "email": {"type": "string", "format": "email"},          "role": {"type": "string", "enum": ["admin", "user"]}        },        "required": ["id", "email", "role"]      }    }  },  "paths": {    "/users/{id}": {      "get": {        "parameters": [{"name": "id", "in": "path", "required": true}],        "responses": {          "200": {            "content": {              "application/json": {                "schema": {"$ref": "#/components/schemas/User"}              }            }          }        }      }    }  }}
```
```
{  "openapi": "3.0.0",  "components": {    "schemas": {      "User": {        "type": "object",        "properties": {          "id": {"type": "string", "format": "uuid"},          "email": {"type": "string", "format": "email"},          "role": {"type": "string", "enum": ["admin", "user"]}        },        "required": ["id", "email", "role"]      }    }  },  "paths": {    "/users/{id}": {      "get": {        "parameters": [{"name": "id", "in": "path", "required": true}],        "responses": {          "200": {            "content": {              "application/json": {                "schema": {"$ref": "#/components/schemas/User"}              }            }          }        }      }    }  }}
```
```
/** * Auto-generated from: api.openapi.json * Generated at: 2025-01-15T10:30:00Z * * DO NOT EDIT MANUALLY - Regenerate from OpenAPI schema */// ============================================================================// Types// ============================================================================export type UserRole = "admin" | "user";export interface User {  /** UUID */  id: string;  /** Email */  email: string;  role: UserRole;}// ============================================================================// Request/Response Types// ============================================================================export interface GetUserByIdRequest {  id: string;}export type GetUserByIdResponse = User;// ============================================================================// Type Guards// ============================================================================export function isUser(value: unknown): value is User {  return (    typeof value === 'object' &&    value !== null &&    'id' in value &&    typeof (value as any).id === 'string' &&    'email' in value &&    typeof (value as any).email === 'string' &&    'role' in value &&    ['admin', 'user'].includes((value as any).role)  );}// ============================================================================// Error Types// ============================================================================export interface ApiError {  status: number;  error: string;  detail?: string;}export function isApiError(value: unknown): value is ApiError {  return (    typeof value === 'object' &&    value !== null &&    'status' in value &&    typeof (value as any).status === 'number' &&    'error' in value &&    typeof (value as any).error === 'string'  );}
```
```
/** * Auto-generated from: api.openapi.json * Generated at: 2025-01-15T10:30:00Z * * DO NOT EDIT MANUALLY - Regenerate from OpenAPI schema */// ============================================================================// Types// ============================================================================export type UserRole = "admin" | "user";export interface User {  /** UUID */  id: string;  /** Email */  email: string;  role: UserRole;}// ============================================================================// Request/Response Types// ============================================================================export interface GetUserByIdRequest {  id: string;}export type GetUserByIdResponse = User;// ============================================================================// Type Guards// ============================================================================export function isUser(value: unknown): value is User {  return (    typeof value === 'object' &&    value !== null &&    'id' in value &&    typeof (value as any).id === 'string' &&    'email' in value &&    typeof (value as any).email === 'string' &&    'role' in value &&    ['admin', 'user'].includes((value as any).role)  );}// ============================================================================// Error Types// ============================================================================export interface ApiError {  status: number;  error: string;  detail?: string;}export function isApiError(value: unknown): value is ApiError {  return (    typeof value === 'object' &&    value !== null &&    'status' in value &&    typeof (value as any).status === 'number' &&    'error' in value &&    typeof (value as any).error === 'string'  );}
```
```
unknown
```
Integrating external APIs into modern applications often presents a challenge: maintaining data consistency and type safety. This agent skill specifically addresses that by automating the conversion of your OpenAPI 3.0 specifications into robust TypeScript interfaces and essential type guards. Developers can now rapidly scaffold API clients, reduce common runtime errors, and enhance the predictability of their codebase. It’s an invaluable tool for ensuring your frontend or backend services flawlessly interact with well-defined API contracts, streamlining your development workflow significantly.

# When to Use This Skill
- •When you need to generate strongly-typed API clients for a new microservice.
- •To automatically synchronize frontend types with evolving backend OpenAPI specifications.
- •For validating API responses at runtime using generated TypeScript type guards.
- •When integrating with third-party APIs that provide an OpenAPI 3.0 definition.

# Pro Tips
- 💡Always keep your OpenAPI specification up-to-date to ensure the generated TypeScript types accurately reflect your API's current state.
- 💡Combine this skill with a code generation skill to scaffold not just types, but also full API client boilerplate.
- 💡Leverage the generated type guards for robust runtime validation of data received from your API endpoints, enhancing application resilience.

