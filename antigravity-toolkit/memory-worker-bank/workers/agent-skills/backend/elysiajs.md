# elysiajs
Source: https://antigravity.codes/agent-skills/backend/elysia

## AI Worker Instructions
When the user requests functionality related to elysiajs, follow these guidelines and utilize this context.

## Scraped Content

# elysiajs
```
bun create elysia app
```
```
bun create elysia app
```
```
import { Elysia, t, status } from 'elysia'const app = new Elysia()  	.get('/', () => 'Hello World')   	.post('/user', ({ body }) => body, {    	body: t.Object({      		name: t.String(),        	age: t.Number()     	})    })    .get('/id/:id', ({ params: { id } }) => {   		if(id > 1_000_000) return status(404, 'Not Found')          	return id    }, {    	params: t.Object({     		id: t.Number({       			minimum: 1       		})     	}),     	response: {      		200: t.Number(),        	404: t.Literal('Not Found')      	}    })    .listen(3000)
```
```
import { Elysia, t, status } from 'elysia'const app = new Elysia()  	.get('/', () => 'Hello World')   	.post('/user', ({ body }) => body, {    	body: t.Object({      		name: t.String(),        	age: t.Number()     	})    })    .get('/id/:id', ({ params: { id } }) => {   		if(id > 1_000_000) return status(404, 'Not Found')          	return id    }, {    	params: t.Object({     		id: t.Number({       			minimum: 1       		})     	}),     	response: {      		200: t.Number(),        	404: t.Literal('Not Found')      	}    })    .listen(3000)
```
```
import { Elysia } from 'elysia'new Elysia()  .get('/', 'GET')  .post('/', 'POST')  .put('/', 'PUT')  .patch('/', 'PATCH')  .delete('/', 'DELETE')  .options('/', 'OPTIONS')  .head('/', 'HEAD')
```
```
import { Elysia } from 'elysia'new Elysia()  .get('/', 'GET')  .post('/', 'POST')  .put('/', 'PUT')  .patch('/', 'PATCH')  .delete('/', 'DELETE')  .options('/', 'OPTIONS')  .head('/', 'HEAD')
```
```
.get('/user/:id', ({ params: { id } }) => id).get('/post/:id/:slug', ({ params }) => params)
```
```
.get('/user/:id', ({ params: { id } }) => id).get('/post/:id/:slug', ({ params }) => params)
```
```
.get('/search', ({ query }) => query.q)// GET /search?q=elysia → "elysia"
```
```
.get('/search', ({ query }) => query.q)// GET /search?q=elysia → "elysia"
```
```
.post('/user', ({ body }) => body)
```
```
.post('/user', ({ body }) => body)
```
```
.get('/', ({ headers }) => headers.authorization)
```
```
.get('/', ({ headers }) => headers.authorization)
```
```
import { Elysia, t } from 'elysia'.post('/user', ({ body }) => body, {  body: t.Object({    name: t.String(),    age: t.Number(),    email: t.String({ format: 'email' }),    website: t.Optional(t.String({ format: 'uri' }))  })})
```
```
import { Elysia, t } from 'elysia'.post('/user', ({ body }) => body, {  body: t.Object({    name: t.String(),    age: t.Number(),    email: t.String({ format: 'email' }),    website: t.Optional(t.String({ format: 'uri' }))  })})
```
```
body: t.Object({  user: t.Object({    name: t.String(),    address: t.Object({      street: t.String(),      city: t.String()    })  })})
```
```
body: t.Object({  user: t.Object({    name: t.String(),    address: t.Object({      street: t.String(),      city: t.String()    })  })})
```
```
body: t.Object({  tags: t.Array(t.String()),  users: t.Array(t.Object({    id: t.String(),    name: t.String()  }))})
```
```
body: t.Object({  tags: t.Array(t.String()),  users: t.Array(t.Object({    id: t.String(),    name: t.String()  }))})
```
```
.post('/upload', ({ body }) => body.file, {  body: t.Object({    file: t.File({      type: 'image',              // image/* mime types      maxSize: '5m'               // 5 megabytes    }),    files: t.Files({              // Multiple files      type: ['image/png', 'image/jpeg']    })  })})
```
```
.post('/upload', ({ body }) => body.file, {  body: t.Object({    file: t.File({      type: 'image',              // image/* mime types      maxSize: '5m'               // 5 megabytes    }),    files: t.Files({              // Multiple files      type: ['image/png', 'image/jpeg']    })  })})
```
```
.get('/user/:id', ({ params: { id } }) => ({  id,  name: 'John',  email: 'john@example.com'}), {  params: t.Object({    id: t.Number()  }),  response: {    200: t.Object({      id: t.Number(),      name: t.String(),      email: t.String()    }),    404: t.String()  }})
```
```
.get('/user/:id', ({ params: { id } }) => ({  id,  name: 'John',  email: 'john@example.com'}), {  params: t.Object({    id: t.Number()  }),  response: {    200: t.Object({      id: t.Number(),      name: t.String(),      email: t.String()    }),    404: t.String()  }})
```
```
import { z } from 'zod'.post('/user', ({ body }) => body, {  body: z.object({    name: z.string(),    age: z.number().min(0),    email: z.string().email()  })})
```
```
import { z } from 'zod'.post('/user', ({ body }) => body, {  body: z.object({    name: z.string(),    age: z.number().min(0),    email: z.string().email()  })})
```
```
.get('/user/:id', ({ params: { id }, status }) => {  const user = findUser(id)    if (!user) {    return status(404, 'User not found')  }    return user})
```
```
.get('/user/:id', ({ params: { id }, status }) => {  const user = findUser(id)    if (!user) {    return status(404, 'User not found')  }    return user})
```
```
.guard({  params: t.Object({    id: t.Number()  })}, app => app  .get('/user/:id', ({ params: { id } }) => id)  .delete('/user/:id', ({ params: { id } }) => id))
```
```
.guard({  params: t.Object({    id: t.Number()  })}, app => app  .get('/user/:id', ({ params: { id } }) => id)  .delete('/user/:id', ({ params: { id } }) => id))
```
```
.macro({  hi: (word: string) => ({    beforeHandle() { console.log(word) }  })}).get('/', () => 'hi', { hi: 'Elysia' })
```
```
.macro({  hi: (word: string) => ({    beforeHandle() { console.log(word) }  })}).get('/', () => 'hi', { hi: 'Elysia' })
```
```
src/├── index.ts              # Main server entry├── modules/│   ├── auth/│   │   ├── index.ts      # Auth routes (Elysia instance)│   │   ├── service.ts    # Business logic│   │   └── model.ts      # TypeBox schemas/DTOs│   └── user/│       ├── index.ts│       ├── service.ts│       └── model.ts└── plugins/    └── custom.tspublic/                   # Static files (if using static plugin)test/                     # Unit tests
```
```
src/├── index.ts              # Main server entry├── modules/│   ├── auth/│   │   ├── index.ts      # Auth routes (Elysia instance)│   │   ├── service.ts    # Business logic│   │   └── model.ts      # TypeBox schemas/DTOs│   └── user/│       ├── index.ts│       ├── service.ts│       └── model.ts└── plugins/    └── custom.tspublic/                   # Static files (if using static plugin)test/                     # Unit tests
```
```
onError
```
```
Elysia.models({ ...models })
```
```
Elysia.prefix('model', 'Namespace.')	- Prefers Reference Model by name provided by Elysia instead of using an actual
```
```
- Service:	- Prefers class (or abstract class if possible)	- Prefers interface/type derive from
```
```
- Return
```
```
(
```
```
) for error	- Prefers
```
```
instead of
```
```
- Models:	- Always export validation model and type of validation model	- Custom Error should be in contains in Model## Elysia Key ConceptElysia has a every important concepts/rules to understand before use.## Encapsulation - Isolates by DefaultLifecycles (hooks, middleware) **don't leak** between instances unless scoped.**Scope levels:**-
```
```
(default) - current instance + descendants-
```
```
- parent + current + descendants  -
```
```
- all instances.onBeforeHandle(() => {}) // only local instance.onBeforeHandle({ as: 'global' }, () => {}) // exports to all## Method Chaining - Required for Types**Must chain**. Each method returns new type reference.❌ Don't:const app = new Elysia()app.state('build', 1) // loses typeapp.get('/', ({ store }) => store.build) // build doesn't exists✅ Do:new Elysia()  .state('build', 1)  .get('/', ({ store }) => store.build)## Explicit DependenciesEach instance independent. **Declare what you use.**const auth = new Elysia()	.decorate('Auth', Auth)	.model(Auth.models)new Elysia()  .get('/', ({ Auth }) => Auth.getProfile()) // Auth doesn't existsnew Elysia()  .use(auth) // must declare  .get('/', ({ Auth }) => Auth.getProfile())**Global scope when:**- No types added (cors, helmet)- Global lifecycle (logging, tracing)**Explicit when:**- Adds types (state, models)- Business logic (auth, db)## DeduplicationPlugins re-execute unless named:new Elysia() // rerun on .usenew Elysia({ name: 'ip' }) // runs once across all instances## Order MattersEvents apply to routes **registered after** them..onBeforeHandle(() => console.log('1')).get('/', () => 'hi') // has hook.onBeforeHandle(() => console.log('2')) // doesn't affect '/'## Type Inference**Inline functions only** for accurate types.For controllers, destructure in inline wrapper:.post('/', ({ body }) => Controller.greet(body), {  body: t.Object({ name: t.String() })})Get type from schema:type MyType = typeof MyType.static## Reference ModelModel can be reference by name, especially great for documenting an APInew Elysia()	.model({		book: t.Object({			name: t.String()		})	})	.post('/', ({ body }) => body.name, {		body: 'book'	})Model can be renamed by using
```
```
.onBeforeHandle(() => {}) // only local instance.onBeforeHandle({ as: 'global' }, () => {}) // exports to all
```
```
.onBeforeHandle(() => {}) // only local instance.onBeforeHandle({ as: 'global' }, () => {}) // exports to all
```
```
const app = new Elysia()app.state('build', 1) // loses typeapp.get('/', ({ store }) => store.build) // build doesn't exists
```
```
const app = new Elysia()app.state('build', 1) // loses typeapp.get('/', ({ store }) => store.build) // build doesn't exists
```
```
new Elysia()  .state('build', 1)  .get('/', ({ store }) => store.build)
```
```
new Elysia()  .state('build', 1)  .get('/', ({ store }) => store.build)
```
```
const auth = new Elysia()	.decorate('Auth', Auth)	.model(Auth.models)new Elysia()  .get('/', ({ Auth }) => Auth.getProfile()) // Auth doesn't existsnew Elysia()  .use(auth) // must declare  .get('/', ({ Auth }) => Auth.getProfile())
```
```
const auth = new Elysia()	.decorate('Auth', Auth)	.model(Auth.models)new Elysia()  .get('/', ({ Auth }) => Auth.getProfile()) // Auth doesn't existsnew Elysia()  .use(auth) // must declare  .get('/', ({ Auth }) => Auth.getProfile())
```
```
new Elysia() // rerun on .usenew Elysia({ name: 'ip' }) // runs once across all instances
```
```
new Elysia() // rerun on
```
```
new Elysia({ name: 'ip' }) // runs once across all instances
```
```
.onBeforeHandle(() => console.log('1')).get('/', () => 'hi') // has hook.onBeforeHandle(() => console.log('2')) // doesn't affect '/'
```
```
.onBeforeHandle(() => console.log('1')).get('/', () => 'hi') // has hook.onBeforeHandle(() => console.log('2')) // doesn't affect '/'
```
```
.post('/', ({ body }) => Controller.greet(body), {  body: t.Object({ name: t.String() })})
```
```
.post('/', ({ body }) => Controller.greet(body), {  body: t.Object({ name: t.String() })})
```
```
type MyType = typeof MyType.static
```
```
type MyType = typeof MyType.static
```
```
new Elysia()	.model({		book: t.Object({			name: t.String()		})	})	.post('/', ({ body }) => body.name, {		body: 'book'	})
```
```
new Elysia()	.model({		book: t.Object({			name: t.String()		})	})	.post('/', ({ body }) => body.name, {		body: 'book'	})
```
```
/
```
```
new Elysia()	.model({		book: t.Object({			name: t.String()		})	})	.prefix('model', 'Namespace')	.post('/', ({ body }) => body.name, {		body: 'Namespace.Book'	})Once
```
```
new Elysia()	.model({		book: t.Object({			name: t.String()		})	})	.prefix('model', 'Namespace')	.post('/', ({ body }) => body.name, {		body: 'Namespace.Book'	})
```
```
new Elysia()	.model({		book: t.Object({			name: t.String()		})	})	.prefix('model', 'Namespace')	.post('/', ({ body }) => body.name, {		body: 'Namespace.Book'	})
```
```
, model name will be capitalized by default.## Technical TermsThe following are technical terms that is use for Elysia:-
```
```
- function name
```
```
from
```
```
for generating OpenAPI from types, see
```
```
-
```
```
,
```
```
- e2e type safe RPC client for share type from backend to frontend## ResourcesUse the following references as needed.It's recommended to checkout
```
```
for as it contains the most important foundation building blocks with examples.
```
```
and
```
```
is important as well but can be check as needed.### references/Detailed documentation split by topic:-
```
```
- Bun Fullstack Dev Server with HMR. React without bundler.-
```
```
- Detailed documentation on cookie-
```
```
- Production deployment guide / Docker-
```
```
- e2e type safe RPC client for share type from backend to frontend-
```
```
- Setting validation/lifecycle all at once-
```
```
- Compose multiple schema/lifecycle as a reusable Elysia via key-value (recommended for complex setup, eg. authentication, authorization, Role-based Access Check)-
```
```
- Decouple part of Elysia into a standalone component-
```
```
- Elysia foundation building block: Routing, Handler and Context-
```
```
- Unit tests with examples-
```
```
- Setup input/output validation and list of all custom validation rules-
```
```
- Real-time features### plugins/ Detailed documentation, usage and configuration reference for official Elysia plugin:-
```
```
- Add bearer capability to Elysia (
```
```
)-
```
```
- Out of box configuration for CORS (
```
```
)-
```
```
- Run cron job with access to Elysia context (
```
```
)-
```
```
- Integration GraphQL Apollo (
```
```
)-
```
```
- Integration with GraphQL Yoga (
```
```
)-
```
```
- HTML and JSX plugin setup and usage (
```
```
)-
```
```
- JWT / JWK plugin (
```
```
)-
```
```
- OpenAPI documentation and OpenAPI Type Gen / OpenAPI from types (
```
```
)-
```
```
- OpenTelemetry, instrumentation, and record span utilities (
```
```
)-
```
```
- Server Timing metric for debug (
```
```
) -
```
```
- Serve static files/folders for Elysia Server (
```
```
)### integrations/Guide to integrate Elysia with external library/runtime:-
```
```
- Using Vercel AI SDK with Elysia-
```
```
- Elysia in Astro API route-
```
```
- Integrate Elysia with better-auth-
```
```
- Elysia on Cloudflare Worker adapter-
```
```
- Elysia on Deno-
```
```
- Integrate Elysia with Drizzle ORM-
```
```
- Elysia in Expo API route-
```
```
- Elysia in Nextjs API route-
```
```
- Run Elysia on Node.js-
```
```
- Elysia on API route-
```
```
- Integrate Elysia with Prisma-
```
```
- Create and Send Email with React and Elysia-
```
```
- Run Elysia on Svelte Kit API route-
```
```
- Run Elysia on Tanstack Start / React Query-
```
```
- Deploy Elysia to Vercel### examples/ (optional)-
```
```
- Basic Elysia example-
```
```
- Custom body parser example via
```
```
-
```
```
- Comprehensive usage of Elysia server-
```
```
- Setting cookie-
```
```
- Error handling-
```
```
- Returning local file from server-
```
```
- Setting mulitple validation schema and lifecycle-
```
```
- Custom response mapper-
```
```
- Redirect response-
```
```
- Rename context's property -
```
```
- Setup validation-
```
```
- Setup global state-
```
```
- File upload with validation-
```
```
- Web Socket for realtime communication### patterns/ (optional)-
```
Leverage the power of ElysiaJS, a modern TypeScript framework optimized for Bun, with this dedicated agent skill. Designed for developers seeking to build lightning-fast and robust backend services, this skill provides comprehensive guidance. From setting up intricate routing and robust data validation to implementing secure authentication and integrating with advanced plugins, the agent is equipped to streamline your development workflow. Maximize productivity and ensure type-safety across your projects, transforming complex challenges into efficient, high-performance solutions.

# When to Use This Skill
- •Developing new or modifying existing ElysiaJS routes, handlers, or full servers.
- •Setting up robust data validation for API endpoints using TypeBox, Zod, or Valibox.
- •Implementing various authentication strategies like JWT, session-based, or custom guards.
- •Integrating external services or databases (e.g., Drizzle ORM) with your ElysiaJS application.

# Pro Tips
- 💡Always consult `elysiajs.com/llms.txt` for the most current API details and examples, as the framework is actively developed.
- 💡Utilize Elysia's robust plugin system and macros to modularize common functionalities like CORS, JWT handling, or custom request decorators.
- 💡Leverage Bun's native features and the type-safety of ElysiaJS to write highly performant and maintainable backend code.

