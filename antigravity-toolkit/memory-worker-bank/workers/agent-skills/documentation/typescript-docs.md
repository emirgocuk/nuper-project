# typescript-docs
Source: https://antigravity.codes/agent-skills/documentation/typescript-docs

## AI Worker Instructions
When the user requests functionality related to typescript-docs, follow these guidelines and utilize this context.

## Scraped Content

# typescript-docs
```
npm install --save-dev typedoc typedoc-plugin-markdownnpm install --save-dev @compodoc/compodoc # For Angular
```
```
npm install --save-dev typedoc typedoc-plugin-markdownnpm install --save-dev @compodoc/compodoc # For Angular
```
```
{  "entryPoints": ["src/index.ts"],  "out": "docs/api",  "theme": "markdown",  "excludePrivate": true,  "readme": "README.md"}
```
```
{  "entryPoints": ["src/index.ts"],  "out": "docs/api",  "theme": "markdown",  "excludePrivate": true,  "readme": "README.md"}
```
```
npx typedoc
```
```
npx typedoc
```
```
/** * Represents a user in the authentication system * @interface User * * @property id - Unique identifier (UUID v4) * @property email - User's email address (validated format) * @property roles - Array of user roles for RBAC * @property metadata - Additional user data (preferences, settings) * * @example *
```
```
/** * Represents a user in the authentication system * @interface User * * @property id - Unique identifier (UUID v4) * @property email - User's email address (validated format) * @property roles - Array of user roles for RBAC * @property metadata - Additional user data (preferences, settings) * * @example *
```
```
* * @see {@link UserRole} for role definitions * @see {@link UserService} for user operations */export interface User {  id: string;  email: string;  roles: UserRole[];  metadata: Record<string, unknown>;}
```
```
* * @see {@link UserRole} for role definitions * @see {@link UserService} for user operations */export interface User {  id: string;  email: string;  roles: UserRole[];  metadata: Record<string, unknown>;}
```
```
/** * Authenticates a user with email and password * @param email - User's email address * @param password - User's password (min 8 characters) * @param options - Additional authentication options * @returns Promise resolving to authentication result * * @throws {InvalidCredentialsError} If email/password don't match * @throws {AccountLockedError} If account is locked after failed attempts * @throws {RateLimitExceededError} If too many attempts made * * @remarks * Implements secure authentication with: * - Bcrypt password hashing (cost factor 12) * - Rate limiting (5 attempts per 15 minutes) * - Account lockout after 3 consecutive failures * - JWT token generation with 15-minute expiry * * @example *
```
```
/** * Authenticates a user with email and password * @param email - User's email address * @param password - User's password (min 8 characters) * @param options - Additional authentication options * @returns Promise resolving to authentication result * * @throws {InvalidCredentialsError} If email/password don't match * @throws {AccountLockedError} If account is locked after failed attempts * @throws {RateLimitExceededError} If too many attempts made * * @remarks * Implements secure authentication with: * - Bcrypt password hashing (cost factor 12) * - Rate limiting (5 attempts per 15 minutes) * - Account lockout after 3 consecutive failures * - JWT token generation with 15-minute expiry * * @example *
```
```
Authenticated: ${result.user.email}
```
```
* * @security * - Passwords are never logged or stored in plain text * - Uses timing-attack safe comparison * - Implements CSRF protection for web requests * * @performance * - Average response time: ~200ms * - Uses connection pooling for database queries * - Caches user permissions for 5 minutes */export async function authenticateUser(  email: string,  password: string,  options?: AuthOptions): Promise<AuthResult> {  // Implementation}
```
```
* * @security * - Passwords are never logged or stored in plain text * - Uses timing-attack safe comparison * - Implements CSRF protection for web requests * * @performance * - Average response time: ~200ms * - Uses connection pooling for database queries * - Caches user permissions for 5 minutes */export async function authenticateUser(  email: string,  password: string,  options?: AuthOptions): Promise<AuthResult> {  // Implementation}
```
```
/** * Service for managing user authentication and authorization * * @remarks * This service handles: * - User authentication with JWT tokens * - Password reset flows * - Multi-factor authentication * - Session management * - Role-based access control * * @example *
```
```
/** * Service for managing user authentication and authorization * * @remarks * This service handles: * - User authentication with JWT tokens * - Password reset flows * - Multi-factor authentication * - Session management * - Role-based access control * * @example *
```
```
* * @security * - All passwords hashed with bcrypt * - JWT tokens signed with RS256 * - Rate limiting on authentication endpoints * - Secure session management * * @performance * - Uses Redis for session storage * - Implements connection pooling * - Caches user permissions */export class AuthService {  /**   * Creates an instance of AuthService   * @param config - Service configuration   * @param config.jwtSecret - Secret key for JWT signing   * @param config.tokenExpiry - Token expiry duration   * @param config.refreshTokenExpiry - Refresh token expiry   */  constructor(private readonly config: AuthConfig) {}  /**   * Authenticates a user and returns access tokens   * @param credentials - User credentials   * @returns Authentication result with tokens   */  async login(credentials: LoginCredentials): Promise<AuthResult> {    // Implementation  }}
```
```
* * @security * - All passwords hashed with bcrypt * - JWT tokens signed with RS256 * - Rate limiting on authentication endpoints * - Secure session management * * @performance * - Uses Redis for session storage * - Implements connection pooling * - Caches user permissions */export class AuthService {  /**   * Creates an instance of AuthService   * @param config - Service configuration   * @param config.jwtSecret - Secret key for JWT signing   * @param config.tokenExpiry - Token expiry duration   * @param config.refreshTokenExpiry - Refresh token expiry   */  constructor(private readonly config: AuthConfig) {}  /**   * Authenticates a user and returns access tokens   * @param credentials - User credentials   * @returns Authentication result with tokens   */  async login(credentials: LoginCredentials): Promise<AuthResult> {    // Implementation  }}
```
```
/** * Repository base class for TypeScript entities * @template T - Entity type (must extend BaseEntity) * @template K - Primary key type (string | number) * * @remarks * Provides CRUD operations with type safety. * All methods return Result types for explicit error handling. * * @example *
```
```
/** * Repository base class for TypeScript entities * @template T - Entity type (must extend BaseEntity) * @template K - Primary key type (string | number) * * @remarks * Provides CRUD operations with type safety. * All methods return Result types for explicit error handling. * * @example *
```
```
*/export abstract class BaseRepository<T extends BaseEntity, K extends string | number> {  /**   * Finds an entity by its primary key   * @param id - Primary key value   * @returns Result containing entity or error   */  abstract findById(id: K): Promise<Result<T, RepositoryError>>;}
```
```
*/export abstract class BaseRepository<T extends BaseEntity, K extends string | number> {  /**   * Finds an entity by its primary key   * @param id - Primary key value   * @returns Result containing entity or error   */  abstract findById(id: K): Promise<Result<T, RepositoryError>>;}
```
```
/** * Represents different types of API responses * @variant success - Successful response with data * @variant error - Error response with error details * @variant pending - Pending response for async operations * * @example *
```
```
/** * Represents different types of API responses * @variant success - Successful response with data * @variant error - Error response with error details * @variant pending - Pending response for async operations * * @example *
```
```
*/export type ApiResponse<T> =  | { status: 'success'; data: T }  | { status: 'error'; error: ApiError }  | { status: 'pending'; progress?: number };
```
```
*/export type ApiResponse<T> =  | { status: 'success'; data: T }  | { status: 'error'; error: ApiError }  | { status: 'pending'; progress?: number };
```
```
/** * Guard for protecting routes with JWT authentication * * @guard * @remarks * Validates JWT tokens from Authorization header. * Attaches user data to request object. * * @usageNotes * Apply to controllers or methods: *
```
```
/** * Guard for protecting routes with JWT authentication * * @guard * @remarks * Validates JWT tokens from Authorization header. * Attaches user data to request object. * * @usageNotes * Apply to controllers or methods: *
```
```
* * @security * - Validates token signature * - Checks token expiration * - Prevents token replay attacks * * @performance * - Caches validation results for 5 minutes * - Uses Redis for distributed caching */@Injectable()export class JwtAuthGuard implements CanActivate {  constructor(private jwtService: JwtService) {}  /**   * Validates JWT token and extracts user data   * @param context - Execution context   * @returns True if authentication successful   */  async canActivate(context: ExecutionContext): Promise<boolean> {    // Implementation  }}
```
```
* * @security * - Validates token signature * - Checks token expiration * - Prevents token replay attacks * * @performance * - Caches validation results for 5 minutes * - Uses Redis for distributed caching */@Injectable()export class JwtAuthGuard implements CanActivate {  constructor(private jwtService: JwtService) {}  /**   * Validates JWT token and extracts user data   * @param context - Execution context   * @returns True if authentication successful   */  async canActivate(context: ExecutionContext): Promise<boolean> {    // Implementation  }}
```
```
/** * User profile card component * @component * @param {UserProfileProps} props - Component props * @param {User} props.user - User data to display * @param {boolean} props.editable - Whether profile is editable * @param {function} props.onEdit - Edit button click handler * * @example *
```
```
/** * User profile card component * @component * @param {UserProfileProps} props - Component props * @param {User} props.user - User data to display * @param {boolean} props.editable - Whether profile is editable * @param {function} props.onEdit - Edit button click handler * * @example *
```
```
* * @performance * - Memoized with React.memo * - Lazy loads avatar images * - Optimistic UI updates * * @accessibility * - Full keyboard navigation * - ARIA labels for screen readers * - High contrast support */export const UserProfile = React.memo<UserProfileProps>(  ({ user, editable, onEdit }) => {    // Implementation  });
```
```
* * @performance * - Memoized with React.memo * - Lazy loads avatar images * - Optimistic UI updates * * @accessibility * - Full keyboard navigation * - ARIA labels for screen readers * - High contrast support */export const UserProfile = React.memo<UserProfileProps>(  ({ user, editable, onEdit }) => {    // Implementation  });
```
```
/** * Rate limiting middleware with Redis backend * @middleware * @param options - Rate limiting options * @param options.windowMs - Time window in milliseconds * @param options.max - Maximum requests per window * @param options.keyGenerator - Function to generate rate limit key * * @example *
```
```
/** * Rate limiting middleware with Redis backend * @middleware * @param options - Rate limiting options * @param options.windowMs - Time window in milliseconds * @param options.max - Maximum requests per window * @param options.keyGenerator - Function to generate rate limit key * * @example *
```
```
* * @errorResponses * - 429 - Too many requests * - 500 - Redis connection error * * @security * - Prevents DoS attacks * - Implements sliding window algorithm * - Distributed across multiple servers */export function rateLimit(options: RateLimitOptions): RequestHandler {  // Implementation}
```
```
* * @errorResponses * - 429 - Too many requests * - 500 - Redis connection error * * @security * - Prevents DoS attacks * - Implements sliding window algorithm * - Distributed across multiple servers */export function rateLimit(options: RateLimitOptions): RequestHandler {  // Implementation}
```
```
429
```
```
500
```
```
# ADR-001: TypeScript Strict Mode Configuration## StatusProposed | Accepted | Rejected | Deprecated | Superseded## ContextWhat is the issue that we're seeing that is motivating this decision?## DecisionWhat is the change that we're proposing and/or doing?## ConsequencesWhat becomes easier or more difficult to do because of this change?## Compliance- Links to standards or regulations- Impact on compliance requirements## References- [TypeScript Strict Mode Documentation](https://www.typescriptlang.org/tsconfig#strict)- [Related ADRs](#)
```
```
# ADR-001: TypeScript Strict Mode Configuration## StatusProposed | Accepted | Rejected | Deprecated | Superseded## ContextWhat is the issue that we're seeing that is motivating this decision?## DecisionWhat is the change that we're proposing and/or doing?## ConsequencesWhat becomes easier or more difficult to do because of this change?## Compliance- Links to standards or regulations- Impact on compliance requirements## References- [TypeScript Strict Mode Documentation](https://www.typescriptlang.org/tsconfig#strict)- [Related ADRs](#)
```
```
# ADR-003: NestJS Framework Selection for Backend API## StatusAccepted## ContextOur Express.js monolith has grown to 50k+ lines with:- Inconsistent error handling patterns- No standardized validation- Difficult testing due to tight coupling- Poor TypeScript integrationWe need a framework that provides:- Strong TypeScript support- Opinionated structure- Built-in validation and error handling- Excellent testing support- Microservices readiness## DecisionAdopt NestJS for all new backend services with:- Full TypeScript strict mode- Class-based DI container- Modular architecture- Built-in validation pipes- Exception filters- Swagger/OpenAPI integration## Consequences### Positive- 40% reduction in boilerplate code- Consistent patterns across services- Improved testability with dependency injection- Better developer experience with decorators- Built-in support for microservices### Negative- Learning curve for team (2-3 weeks)- More complex for simple APIs- Requires understanding of decorators- Additional build step needed## Implementation1. Create NestJS starter template2. Migrate new services to NestJS3. Gradually refactor critical Express services4. Establish NestJS best practices guide## Compliance- Aligns with architecture standards v2.1- Supports SOC2 through better error handling- Enables GDPR compliance with structured logging
```
```
# ADR-003: NestJS Framework Selection for Backend API## StatusAccepted## ContextOur Express.js monolith has grown to 50k+ lines with:- Inconsistent error handling patterns- No standardized validation- Difficult testing due to tight coupling- Poor TypeScript integrationWe need a framework that provides:- Strong TypeScript support- Opinionated structure- Built-in validation and error handling- Excellent testing support- Microservices readiness## DecisionAdopt NestJS for all new backend services with:- Full TypeScript strict mode- Class-based DI container- Modular architecture- Built-in validation pipes- Exception filters- Swagger/OpenAPI integration## Consequences### Positive- 40% reduction in boilerplate code- Consistent patterns across services- Improved testability with dependency injection- Better developer experience with decorators- Built-in support for microservices### Negative- Learning curve for team (2-3 weeks)- More complex for simple APIs- Requires understanding of decorators- Additional build step needed## Implementation1. Create NestJS starter template2. Migrate new services to NestJS3. Gradually refactor critical Express services4. Establish NestJS best practices guide## Compliance- Aligns with architecture standards v2.1- Supports SOC2 through better error handling- Enables GDPR compliance with structured logging
```
```
{  "entryPoints": ["src/index.ts"],  "out": "docs/api",  "theme": "markdown",  "readme": "README.md",  "excludePrivate": true,  "excludeProtected": false,  "excludeExternals": true,  "includeVersion": true,  "sort": ["source-order"],  "kindSortOrder": [    "Document",    "Project",    "Module",    "Namespace",    "Enum",    "Class",    "Interface",    "TypeAlias",    "Constructor",    "Property",    "Method"  ],  "categorizeByGroup": true,  "categoryOrder": [    "Authentication",    "Authorization",    "*",    "Other"  ],  "navigation": {    "includeCategories": true,    "includeGroups": true  }}
```
```
{  "entryPoints": ["src/index.ts"],  "out": "docs/api",  "theme": "markdown",  "readme": "README.md",  "excludePrivate": true,  "excludeProtected": false,  "excludeExternals": true,  "includeVersion": true,  "sort": ["source-order"],  "kindSortOrder": [    "Document",    "Project",    "Module",    "Namespace",    "Enum",    "Class",    "Interface",    "TypeAlias",    "Constructor",    "Property",    "Method"  ],  "categorizeByGroup": true,  "categoryOrder": [    "Authentication",    "Authorization",    "*",    "Other"  ],  "navigation": {    "includeCategories": true,    "includeGroups": true  }}
```
```
{  "scripts": {    "docs:generate": "typedoc",    "docs:serve": "cd docs && python -m http.server 8080",    "docs:validate": "node scripts/validate-docs.js",    "docs:deploy": "npm run docs:generate && ./scripts/deploy-docs.sh",    "adr:new": "node scripts/create-adr.js",    "adr:generate-index": "node scripts/generate-adr-index.js"  }}
```
```
{  "scripts": {    "docs:generate": "typedoc",    "docs:serve": "cd docs && python -m http.server 8080",    "docs:validate": "node scripts/validate-docs.js",    "docs:deploy": "npm run docs:generate && ./scripts/deploy-docs.sh",    "adr:new": "node scripts/create-adr.js",    "adr:generate-index": "node scripts/generate-adr-index.js"  }}
```
```
name: Documentationon:  push:    branches: [main, develop]    paths:      - 'src/**'      - 'docs/**'      - '.github/workflows/docs.yml'jobs:  generate-docs:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v3      - name: Setup Node.js        uses: actions/setup-node@v3        with:          node-version: '18'          cache: 'npm'      - name: Install dependencies        run: npm ci      - name: Generate TypeDoc        run: npm run docs:generate      - name: Validate documentation        run: npm run docs:validate      - name: Check for documentation changes        id: changes        run: |          if git diff --quiet HEAD~1 docs/; then            echo "changed=false" >> $GITHUB_OUTPUT          else            echo "changed=true" >> $GITHUB_OUTPUT          fi      - name: Commit documentation        if: steps.changes.outputs.changed == 'true'        run: |          git config --local user.email "action@github.com"          git config --local user.name "GitHub Action"          git add docs/          git commit -m "docs: update generated documentation [skip ci]"          git push      - name: Deploy to GitHub Pages        uses: peaceiris/actions-gh-pages@v3        with:          github_token: ${{ secrets.GITHUB_TOKEN }}          publish_dir: ./docs
```
```
name: Documentationon:  push:    branches: [main, develop]    paths:      - 'src/**'      - 'docs/**'      - '.github/workflows/docs.yml'jobs:  generate-docs:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v3      - name: Setup Node.js        uses: actions/setup-node@v3        with:          node-version: '18'          cache: 'npm'      - name: Install dependencies        run: npm ci      - name: Generate TypeDoc        run: npm run docs:generate      - name: Validate documentation        run: npm run docs:validate      - name: Check for documentation changes        id: changes        run: |          if git diff --quiet HEAD~1 docs/; then            echo "changed=false" >> $GITHUB_OUTPUT          else            echo "changed=true" >> $GITHUB_OUTPUT          fi      - name: Commit documentation        if: steps.changes.outputs.changed == 'true'        run: |          git config --local user.email "action@github.com"          git config --local user.name "GitHub Action"          git add docs/          git commit -m "docs: update generated documentation [skip ci]"          git push      - name: Deploy to GitHub Pages        uses: peaceiris/actions-gh-pages@v3        with:          github_token: ${{ secrets.GITHUB_TOKEN }}          publish_dir: ./docs
```
```
/** * Decorator for rate limiting endpoints * @decorator * @param options - Rate limiting options * * @usageNotes * Apply to controller methods: *
```
```
/** * Decorator for rate limiting endpoints * @decorator * @param options - Rate limiting options * * @usageNotes * Apply to controller methods: *
```
```
* * @see {@link RateLimitInterceptor} * @see {@link RateLimitOptions} */export const RateLimit = (options: RateLimitOptions) =>  applyDecorators(    UseInterceptors(RateLimitInterceptor),    SetMetadata('rateLimit', options)  );
```
```
* * @see {@link RateLimitInterceptor} * @see {@link RateLimitOptions} */export const RateLimit = (options: RateLimitOptions) =>  applyDecorators(    UseInterceptors(RateLimitInterceptor),    SetMetadata('rateLimit', options)  );
```
```
/** * Custom hook for managing form state with validation * @hook * @param schema - Yup validation schema * @param initialValues - Initial form values * @returns Form state and handlers * * @example *
```
```
/** * Custom hook for managing form state with validation * @hook * @param schema - Yup validation schema * @param initialValues - Initial form values * @returns Form state and handlers * * @example *
```
```
* * @performance * - Memoized validation to prevent unnecessary re-renders * - Debounced validation for better UX * - Optimistic updates for better perceived performance */export function useForm<T>({  schema,  initialValues}: UseFormOptions<T>): UseFormReturn<T> {  // Implementation}
```
```
* * @performance * - Memoized validation to prevent unnecessary re-renders * - Debounced validation for better UX * - Optimistic updates for better perceived performance */export function useForm<T>({  schema,  initialValues}: UseFormOptions<T>): UseFormReturn<T> {  // Implementation}
```
```
/** * Service for managing user sessions * @injectable * @providedIn root * * @remarks * Handles user authentication state across the application. * Automatically refreshes tokens before expiry. * * @example *
```
```
/** * Service for managing user sessions * @injectable * @providedIn root * * @remarks * Handles user authentication state across the application. * Automatically refreshes tokens before expiry. * * @example *
```
```
* * @security * - Stores tokens in secure storage * - Implements token refresh logic * - Handles logout on all tabs (broadcast channel) */@Injectable({  providedIn: 'root'})export class AuthService {  // Implementation}
```
```
* * @security * - Stores tokens in secure storage * - Implements token refresh logic * - Handles logout on all tabs (broadcast channel) */@Injectable({  providedIn: 'root'})export class AuthService {  // Implementation}
```
```
// typedoc-plugin-validation.jsexport function load(app) {  app.converter.on(    Converter.EVENT_CREATE_SIGNATURE,    (context, reflection, node?) => {      // Check if method has JSDoc      if (reflection.kind === ReflectionKind.Method) {        const comment = reflection.comment;        if (!comment) {          app.logger.warn(            Method ${reflection.name} lacks documentation in ${reflection.parent.name}          );        }      }    }  );}
```
```
// typedoc-plugin-validation.jsexport function load(app) {  app.converter.on(    Converter.EVENT_CREATE_SIGNATURE,    (context, reflection, node?) => {      // Check if method has JSDoc      if (reflection.kind === ReflectionKind.Method) {        const comment = reflection.comment;        if (!comment) {          app.logger.warn(            Method ${reflection.name} lacks documentation in ${reflection.parent.name}          );        }      }    }  );}
```
```
Method ${reflection.name} lacks documentation in ${reflection.parent.name}
```
```
{  "rules": {    "jsdoc/require-description": "error",    "jsdoc/require-param-description": "error",    "jsdoc/require-returns-description": "error",    "jsdoc/require-example": "warn",    "jsdoc/check-alignment": "error",    "jsdoc/check-indentation": "error",    "jsdoc/tag-lines": ["error", "any", { "startLines": 1 }]  }}
```
```
{  "rules": {    "jsdoc/require-description": "error",    "jsdoc/require-param-description": "error",    "jsdoc/require-returns-description": "error",    "jsdoc/require-example": "warn",    "jsdoc/check-alignment": "error",    "jsdoc/check-indentation": "error",    "jsdoc/tag-lines": ["error", "any", { "startLines": 1 }]  }}
```
The TypeScript Documentation Agent Skill empowers developers to streamline the creation of high-quality, production-ready documentation. Beyond basic comments, this skill helps structure comprehensive API references, architectural decision records (ADRs), and detailed code examples tailored for diverse audiences. It integrates seamlessly with popular frameworks like React, Angular, NestJS, Express, and Vue, ensuring consistency and accuracy across projects. By leveraging tools like JSDoc and TypeDoc, teams can maintain a living documentation ecosystem that evolves with their codebase, significantly improving maintainability and onboarding processes. This skill is essential for projects demanding clarity and robustness in their technical artifacts.

# When to Use This Skill
- •Automatically generate TypeDoc configurations and API documentation for a new or existing TypeScript project.
- •Document a complex TypeScript module or function with detailed JSDoc comments, including examples.
- •Formally record an architectural decision for a TypeScript-based system using ADR patterns.
- •Set up an automated documentation pipeline that integrates with CI/CD for consistent updates across your codebase.

# Pro Tips
- 💡Integrate TypeDoc generation into your CI/CD pipeline to ensure documentation is always up-to-date with your codebase.
- 💡Combine JSDoc tags with Markdown in your comments for richer formatting and better readability in generated documentation.
- 💡Leverage custom TypeDoc plugins to extend functionality, such as generating interactive diagrams or integrating with external services like Jira.

