# oauth-integrations
Source: https://antigravity.codes/agent-skills/security/oauth-integrations

## AI Worker Instructions
When the user requests functionality related to oauth-integrations, follow these guidelines and utilize this context.

## Scraped Content

# oauth-integrations
```
User-Agent
```
```
Accept
```
```
application/vnd.github+json
```
```
const resp = await fetch('https://api.github.com/user', {  headers: {    Authorization: Bearer ${accessToken},    'User-Agent': 'MyApp/1.0',  // Required!    'Accept': 'application/vnd.github+json',  },});
```
```
const resp = await fetch('https://api.github.com/user', {  headers: {    Authorization: Bearer ${accessToken},    'User-Agent': 'MyApp/1.0',  // Required!    'Accept': 'application/vnd.github+json',  },});
```
```
Bearer ${accessToken}
```
```
/user
```
```
email: null
```
```
if (!userData.email) {  const emails = await fetch('https://api.github.com/user/emails', { headers })    .then(r => r.json());  userData.email = emails.find(e => e.primary && e.verified)?.email;}
```
```
if (!userData.email) {  const emails = await fetch('https://api.github.com/user/emails', { headers })    .then(r => r.json());  userData.email = emails.find(e => e.primary && e.verified)?.email;}
```
```
user:email
```
```
const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {  method: 'POST',  headers: {    'Content-Type': 'application/x-www-form-urlencoded',    'Accept': 'application/json',  // Get JSON response  },  body: new URLSearchParams({ code, client_id, client_secret, redirect_uri }),});
```
```
const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {  method: 'POST',  headers: {    'Content-Type': 'application/x-www-form-urlencoded',    'Accept': 'application/json',  // Get JSON response  },  body: new URLSearchParams({ code, client_id, client_secret, redirect_uri }),});
```
```
'Accept': 'application/json'
```
```
jose
```
```
// For user identity (email, name, profile picture)const scope = 'openid email profile User.Read';// For refresh tokens (long-lived sessions)const scope = 'openid email profile User.Read offline_access';
```
```
// For user identity (email, name, profile picture)const scope = 'openid email profile User.Read';// For refresh tokens (long-lived sessions)const scope = 'openid email profile User.Read offline_access';
```
```
User.Read
```
```
/me
```
```
// Microsoft Graph /me endpointconst resp = await fetch('https://graph.microsoft.com/v1.0/me', {  headers: { Authorization: Bearer ${accessToken} },});// Email may be in different fieldsconst email = data.mail || data.userPrincipalName;
```
```
// Microsoft Graph /me endpointconst resp = await fetch('https://graph.microsoft.com/v1.0/me', {  headers: { Authorization: Bearer ${accessToken} },});// Email may be in different fieldsconst email = data.mail || data.userPrincipalName;
```
```
Bearer ${accessToken}
```
```
common
```
```
organizations
```
```
consumers
```
```
{tenant-id}
```
```
/callback
```
```
/admin/callback
```
```
offline_access
```
```
'User-Agent': 'AppName/1.0'
```
```
User.Read
```
```
/me
```
```
email: null
```
```
/user/emails
```
```
user:email
```
```
'User-Agent': 'AppName/1.0'
```
```
'Accept': 'application/vnd.github+json'
```
```
const resp = await fetch('https://api.github.com/user', {  headers: {    Authorization: Bearer ${accessToken},    'User-Agent': 'MyApp/1.0',    'Accept': 'application/vnd.github+json',  },});
```
```
const resp = await fetch('https://api.github.com/user', {  headers: {    Authorization: Bearer ${accessToken},    'User-Agent': 'MyApp/1.0',    'Accept': 'application/vnd.github+json',  },});
```
```
Bearer ${accessToken}
```
```
/user
```
```
email: null
```
```
if (!userData.email) {  const emails = await fetch('https://api.github.com/user/emails', { headers }).then(r => r.json());  userData.email = emails.find(e => e.primary && e.verified)?.email;}
```
```
if (!userData.email) {  const emails = await fetch('https://api.github.com/user/emails', { headers }).then(r => r.json());  userData.email = emails.find(e => e.primary && e.verified)?.email;}
```
```
user:email
```
```
'Accept': 'application/json'
```
```
const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {  method: 'POST',  headers: {    'Content-Type': 'application/x-www-form-urlencoded',    'Accept': 'application/json',  },  body: new URLSearchParams({ code, client_id, client_secret, redirect_uri }),});
```
```
const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {  method: 'POST',  headers: {    'Content-Type': 'application/x-www-form-urlencoded',    'Accept': 'application/json',  },  body: new URLSearchParams({ code, client_id, client_secret, redirect_uri }),});
```
```
openid email profile
```
```
User.Read
```
```
/me
```
```
jose
```
```
// For user identity (email, name, profile picture)const scope = 'openid email profile User.Read';// For refresh tokens (long-lived sessions)const scope = 'openid email profile User.Read offline_access';
```
```
// For user identity (email, name, profile picture)const scope = 'openid email profile User.Read';// For refresh tokens (long-lived sessions)const scope = 'openid email profile User.Read offline_access';
```
```
User.Read
```
```
/me
```
```
// Microsoft Graph /me endpointconst resp = await fetch('https://graph.microsoft.com/v1.0/me', {  headers: { Authorization: Bearer ${accessToken} },});// Email may be in different fieldsconst email = data.mail || data.userPrincipalName;
```
```
// Microsoft Graph /me endpointconst resp = await fetch('https://graph.microsoft.com/v1.0/me', {  headers: { Authorization: Bearer ${accessToken} },});// Email may be in different fieldsconst email = data.mail || data.userPrincipalName;
```
```
Bearer ${accessToken}
```
```
common
```
```
organizations
```
```
consumers
```
```
{tenant-id}
```
```
/callback
```
```
/admin/callback
```
```
offline_access
```
This skill empowers AI agents to generate code and guidance for implementing OAuth 2.0 authentication flows in serverless and edge computing environments. Specifically tailored for platforms like Cloudflare Workers, it addresses the unique challenges of token exchange, header requirements, and private email handling for providers like GitHub and Microsoft. By leveraging this skill, developers can efficiently integrate secure user authentication into their edge applications, ensuring best practices are followed for API communication and access token management. It streamlines the complex process of connecting your edge functions with popular identity providers, enhancing security and user experience.

# When to Use This Skill
- •Implementing user login for an application deployed on Cloudflare Workers using GitHub or Microsoft accounts.
- •Adding third-party authentication (e.g., 'Login with GitHub') to an edge-deployed API or frontend.
- •Building a serverless backend that needs to interact with GitHub or Microsoft APIs on behalf of a user.
- •Securing access to edge-hosted microservices by integrating with standard OAuth providers.

# Pro Tips
- 💡Always validate the `state` parameter in OAuth callbacks to prevent Cross-Site Request Forgery (CSRF) attacks.
- 💡Store sensitive credentials (client ID, client secret) securely as environment variables, never hardcoded in your source.
- 💡Consider using a dedicated OAuth library or framework for edge environments if available, to abstract away common boilerplate and security considerations.

