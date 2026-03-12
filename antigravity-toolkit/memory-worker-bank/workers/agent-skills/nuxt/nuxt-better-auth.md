# nuxt-better-auth
Source: https://antigravity.codes/agent-skills/nuxt/nuxt-better-auth

## AI Worker Instructions
When the user requests functionality related to nuxt-better-auth, follow these guidelines and utilize this context.

## Scraped Content

# nuxt-better-auth
```
@onmax/nuxt-better-auth
```
```
nuxt
```
```
nuxthub
```
```
useUserSession()
```
```
requireUserSession()
```
```
auth
```
```
'user'
```
```
'guest'
```
```
{ user: {...} }
```
```
false
```
```
serverAuth()
```
```
// Client: useUserSession()const { user, loggedIn, signIn, signOut } = useUserSession()await signIn.email({ email, password }, { onSuccess: () => navigateTo('/') })
```
```
// Client: useUserSession()const { user, loggedIn, signIn, signOut } = useUserSession()await signIn.email({ email, password }, { onSuccess: () => navigateTo('/') })
```
```
// Server: requireUserSession()const { user } = await requireUserSession(event, { user: { role: 'admin' } })
```
```
// Server: requireUserSession()const { user } = await requireUserSession(event, { user: { role: 'admin' } })
```
```
// nuxt.config.ts: Route protectionrouteRules: {  '/admin/**': { auth: { user: { role: 'admin' } } },  '/login': { auth: 'guest' },  '/app/**': { auth: 'user' }}
```
```
// nuxt.config.ts: Route protectionrouteRules: {  '/admin/**': { auth: { user: { role: 'admin' } } },  '/login': { auth: 'guest' },  '/app/**': { auth: 'user' }}
```
This AI Agent Skill empowers you to integrate comprehensive authentication into your Nuxt 4+ applications with ease, leveraging the `@onmax/nuxt-better-auth` module. Whether you're setting up login flows, protecting sensitive routes, or managing user sessions, this skill provides focused guidance and best practices. It streamlines the complex process of securing your application, allowing developers to concentrate on core features while ensuring a robust and reliable authentication layer. From installation to advanced plugin integration, navigate Nuxt authentication confidently.

# When to Use This Skill
- •Configuring and installing `@onmax/nuxt-better-auth` in a new or existing Nuxt project.
- •Implementing secure user login, signup, and signout functionalities within your application.
- •Protecting specific client-side and server-side routes to restrict access based on user authentication status.
- •Integrating advanced Better Auth plugins like admin panels, passkey authentication, or 2FA.
- •Accessing and managing user session data in Nuxt API routes or components.

# Pro Tips
- 💡Given its 'Alpha Status', always review the official `@onmax/nuxt-better-auth` documentation for the latest API changes before deployment to production environments.
- 💡Leverage the `useUserSession` composable for consistent client-side user state management, ensuring your UI reflects authentication changes in real-time.
- 💡When protecting server routes, combine this skill's guidance with Nuxt's server middleware for robust access control, especially for sensitive API endpoints.

