# google-chat-api
Source: https://antigravity.codes/agent-skills/communication/google-chat-api

## AI Worker Instructions
When the user requests functionality related to google-chat-api, follow these guidelines and utilize this context.

## Scraped Content

# google-chat-api
```
# No code needed - just configure in Google Chat# 1. Go to Google Cloud Console# 2. Create new project or select existing# 3. Enable Google Chat API# 4. Configure Chat app with webhook URL
```
```
# No code needed - just configure in Google Chat# 1. Go to Google Cloud Console# 2. Create new project or select existing# 3. Enable Google Chat API# 4. Configure Chat app with webhook URL
```
```
https://your-worker.workers.dev/webhook
```
```
export default {  async fetch(request: Request, env: Env): Promise<Response> {    const event = await request.json()    // Respond with a card    return Response.json({      text: "Hello from bot!",      cardsV2: [{        cardId: "unique-card-1",        card: {          header: { title: "Welcome" },          sections: [{            widgets: [{              textParagraph: { text: "Click the button below" }            }, {              buttonList: {                buttons: [{                  text: "Click me",                  onClick: {                    action: {                      function: "handleClick",                      parameters: [{ key: "data", value: "test" }]                    }                  }                }]              }            }]          }]        }      }]    })  }}
```
```
export default {  async fetch(request: Request, env: Env): Promise<Response> {    const event = await request.json()    // Respond with a card    return Response.json({      text: "Hello from bot!",      cardsV2: [{        cardId: "unique-card-1",        card: {          header: { title: "Welcome" },          sections: [{            widgets: [{              textParagraph: { text: "Click the button below" }            }, {              buttonList: {                buttons: [{                  text: "Click me",                  onClick: {                    action: {                      function: "handleClick",                      parameters: [{ key: "data", value: "test" }]                    }                  }                }]              }            }]          }]        }      }]    })  }}
```
```
cardsV2
```
```
async function verifyToken(token: string): Promise<boolean> {  // Verify token is signed by chat@system.gserviceaccount.com  // See templates/bearer-token-verify.ts for full implementation  return true}
```
```
async function verifyToken(token: string): Promise<boolean> {  // Verify token is signed by chat@system.gserviceaccount.com  // See templates/bearer-token-verify.ts for full implementation  return true}
```
```
curl -X POST 'https://chat.googleapis.com/v1/spaces/.../messages?key=...' \  -H 'Content-Type: application/json' \  -d '{"text": "Hello from webhook!"}'
```
```
curl -X POST 'https://chat.googleapis.com/v1/spaces/.../messages?key=...' \  -H 'Content-Type: application/json' \  -d '{"text": "Hello from webhook!"}'
```
```
templates/interactive-bot.ts
```
```
{  "cardsV2": [{    "cardId": "unique-id",    "card": {      "header": {        "title": "Card Title",        "subtitle": "Optional subtitle",        "imageUrl": "https://..."      },      "sections": [{        "header": "Section 1",        "widgets": [          { "textParagraph": { "text": "Some text" } },          { "buttonList": { "buttons": [...] } }        ]      }]    }  }]}
```
```
{  "cardsV2": [{    "cardId": "unique-id",    "card": {      "header": {        "title": "Card Title",        "subtitle": "Optional subtitle",        "imageUrl": "https://..."      },      "sections": [{        "header": "Section 1",        "widgets": [          { "textParagraph": { "text": "Some text" } },          { "buttonList": { "buttons": [...] } }        ]      }]    }  }]}
```
```
textParagraph
```
```
buttonList
```
```
textInput
```
```
selectionInput
```
```
dateTimePicker
```
```
divider
```
```
image
```
```
decoratedText
```
```
// HTML formatting (traditional){  textParagraph: {    text: "This is <b>bold</b> and <i>italic</i> text with <font color='#ea9999'>color</font>"  }}// Markdown formatting (NEW - better for AI agents){  textParagraph: {    text: "This is **bold** and *italic* text\n\n- Bullet list\n- Second item\n\n
```
```
// HTML formatting (traditional){  textParagraph: {    text: "This is <b>bold</b> and <i>italic</i> text with <font color='#ea9999'>color</font>"  }}// Markdown formatting (NEW - better for AI agents){  textParagraph: {    text: "This is **bold** and *italic* text\n\n- Bullet list\n- Second item\n\n
```
```
"  }}**Supported Markdown** (text messages and cards):- **bold** or *italic*-  code  for inline code- - list item or 1. ordered for lists-
```
```
**Supported Markdown** (text messages and cards):- **bold** or *italic*-  code  for inline code- - list item or 1. ordered for lists-
```
```
**Supported Markdown** (text messages and cards):-
```
```
or
```
```
-
```
```

```
```

```
```
for inline code-
```
```
or
```
```
for lists-
```
```

```
```
~strikethrough~
```
```
<b>bold</b>
```
```
<i>italic</i>
```
```
<u>underline</u>
```
```
<font color="#FF0000">colored</font>
```
```
<a href="url">link</a>
```
```
export default {  async fetch(request: Request): Promise<Response> {    const event = await request.json()    // Check event type    if (event.type === 'MESSAGE') {      // User sent message      return handleMessage(event)    }    if (event.type === 'CARD_CLICKED') {      // User clicked button      const action = event.action.actionMethodName      const params = event.action.parameters      if (action === 'submitForm') {        return handleFormSubmission(event)      }    }    return Response.json({ text: "Unknown event" })  }}
```
```
export default {  async fetch(request: Request): Promise<Response> {    const event = await request.json()    // Check event type    if (event.type === 'MESSAGE') {      // User sent message      return handleMessage(event)    }    if (event.type === 'CARD_CLICKED') {      // User clicked button      const action = event.action.actionMethodName      const params = event.action.parameters      if (action === 'submitForm') {        return handleFormSubmission(event)      }    }    return Response.json({ text: "Unknown event" })  }}
```
```
ADDED_TO_SPACE
```
```
REMOVED_FROM_SPACE
```
```
MESSAGE
```
```
CARD_CLICKED
```
```
cardsV2
```
```
cardId
```
```
google-chat-cards
```
```
{  "actionResponse": {    "type": "DIALOG",    "dialogAction": {      "actionStatus": {        "statusCode": "INVALID_ARGUMENT",        "userFacingMessage": "Email is required"      }    }  }}
```
```
{  "actionResponse": {    "type": "DIALOG",    "dialogAction": {      "actionStatus": {        "statusCode": "INVALID_ARGUMENT",        "userFacingMessage": "Email is required"      }    }  }}
```
```
{  "name": "google-chat-bot",  "main": "src/index.ts",  "compatibility_date": "2026-01-03",  "compatibility_flags": ["nodejs_compat"],  // Secrets (set with: wrangler secret put CHAT_BOT_TOKEN)  "vars": {    "ALLOWED_SPACES": "spaces/SPACE_ID_1,spaces/SPACE_ID_2"  }}
```
```
{  "name": "google-chat-bot",  "main": "src/index.ts",  "compatibility_date": "2026-01-03",  "compatibility_flags": ["nodejs_compat"],  // Secrets (set with: wrangler secret put CHAT_BOT_TOKEN)  "vars": {    "ALLOWED_SPACES": "spaces/SPACE_ID_1,spaces/SPACE_ID_2"  }}
```
```
nodejs_compat
```
```
// External service sends notification to Chatasync function sendNotification(webhookUrl: string, message: string) {  await fetch(webhookUrl, {    method: 'POST',    headers: { 'Content-Type': 'application/json' },    body: JSON.stringify({      text: message,      cardsV2: [{        cardId: notif-${Date.now()},        card: {          header: { title: "Alert" },          sections: [{            widgets: [{              textParagraph: { text: message }            }]          }]        }      }]    })  })}
```
```
// External service sends notification to Chatasync function sendNotification(webhookUrl: string, message: string) {  await fetch(webhookUrl, {    method: 'POST',    headers: { 'Content-Type': 'application/json' },    body: JSON.stringify({      text: message,      cardsV2: [{        cardId: notif-${Date.now()},        card: {          header: { title: "Alert" },          sections: [{            widgets: [{              textParagraph: { text: message }            }]          }]        }      }]    })  })}
```
```
notif-${Date.now()}
```
```
// Show form to collect datafunction showForm() {  return {    cardsV2: [{      cardId: "form-card",      card: {        header: { title: "Enter Details" },        sections: [{          widgets: [            {              textInput: {                name: "email",                label: "Email",                type: "SINGLE_LINE",                hintText: "user@example.com"              }            },            {              selectionInput: {                name: "priority",                label: "Priority",                type: "DROPDOWN",                items: [                  { text: "Low", value: "low" },                  { text: "High", value: "high" }                ]              }            },            {              buttonList: {                buttons: [{                  text: "Submit",                  onClick: {                    action: {                      function: "submitForm",                      parameters: [{                        key: "formId",                        value: "contact-form"                      }]                    }                  }                }]              }            }          ]        }]      }    }]  }}
```
```
// Show form to collect datafunction showForm() {  return {    cardsV2: [{      cardId: "form-card",      card: {        header: { title: "Enter Details" },        sections: [{          widgets: [            {              textInput: {                name: "email",                label: "Email",                type: "SINGLE_LINE",                hintText: "user@example.com"              }            },            {              selectionInput: {                name: "priority",                label: "Priority",                type: "DROPDOWN",                items: [                  { text: "Low", value: "low" },                  { text: "High", value: "high" }                ]              }            },            {              buttonList: {                buttons: [{                  text: "Submit",                  onClick: {                    action: {                      function: "submitForm",                      parameters: [{                        key: "formId",                        value: "contact-form"                      }]                    }                  }                }]              }            }          ]        }]      }    }]  }}
```
```
// Open modal dialogfunction openDialog() {  return {    actionResponse: {      type: "DIALOG",      dialogAction: {        dialog: {          body: {            sections: [{              header: "Confirm Action",              widgets: [{                textParagraph: { text: "Are you sure?" }              }, {                buttonList: {                  buttons: [                    {                      text: "Confirm",                      onClick: {                        action: { function: "confirm" }                      }                    },                    {                      text: "Cancel",                      onClick: {                        action: { function: "cancel" }                      }                    }                  ]                }              }]            }]          }        }      }    }  }}
```
```
// Open modal dialogfunction openDialog() {  return {    actionResponse: {      type: "DIALOG",      dialogAction: {        dialog: {          body: {            sections: [{              header: "Confirm Action",              widgets: [{                textParagraph: { text: "Are you sure?" }              }, {                buttonList: {                  buttons: [                    {                      text: "Confirm",                      onClick: {                        action: { function: "confirm" }                      }                    },                    {                      text: "Cancel",                      onClick: {                        action: { function: "cancel" }                      }                    }                  ]                }              }]            }]          }        }      }    }  }}
```
```
templates/webhook-handler.ts
```
```
templates/wrangler.jsonc
```
```
templates/interactive-bot.ts
```
```
templates/card-builder-examples.ts
```
```
templates/form-validation.ts
```
```
templates/bearer-token-verify.ts
```
```
references/google-chat-docs.md
```
```
references/cards-v2-schema.md
```
```
references/common-errors.md
```
```
// User types: /create-ticket Bug in loginif (event.message?.slashCommand?.commandName === 'create-ticket') {  const text = event.message.argumentText  return Response.json({    text: Creating ticket: ${text},    cardsV2: [/* ticket confirmation card */]  })}
```
```
// User types: /create-ticket Bug in loginif (event.message?.slashCommand?.commandName === 'create-ticket') {  const text = event.message.argumentText  return Response.json({    text: Creating ticket: ${text},    cardsV2: [/* ticket confirmation card */]  })}
```
```
Creating ticket: ${text}
```
```
return Response.json({  text: "Reply in thread",  thread: {    name: event.message.thread.name  // Use existing thread  }})
```
```
return Response.json({  text: "Reply in thread",  thread: {    name: event.message.thread.name  // Use existing thread  }})
```
```
spaces.create
```
```
chat.spaces.create
```
```
spaces.delete
```
```
chat.delete
```
```
spaces.get
```
```
chat.spaces.readonly
```
```
spaces.list
```
```
chat.spaces.readonly
```
```
spaces.patch
```
```
chat.spaces
```
```
spaces.search
```
```
chat.spaces.readonly
```
```
spaces.setup
```
```
chat.spaces.create
```
```
spaces.findDirectMessage
```
```
chat.spaces.readonly
```
```
async function createSpace(accessToken: string) {  const response = await fetch('https://chat.googleapis.com/v1/spaces', {    method: 'POST',    headers: {      'Authorization': Bearer ${accessToken},      'Content-Type': 'application/json'    },    body: JSON.stringify({      spaceType: 'SPACE',          // or 'GROUP_CHAT', 'DIRECT_MESSAGE'      displayName: 'Project Team',      singleUserBotDm: false,      spaceDetails: {        description: 'Team collaboration space',        guidelines: 'Be respectful and on-topic'      }    })  })  return response.json()}
```
```
async function createSpace(accessToken: string) {  const response = await fetch('https://chat.googleapis.com/v1/spaces', {    method: 'POST',    headers: {      'Authorization': Bearer ${accessToken},      'Content-Type': 'application/json'    },    body: JSON.stringify({      spaceType: 'SPACE',          // or 'GROUP_CHAT', 'DIRECT_MESSAGE'      displayName: 'Project Team',      singleUserBotDm: false,      spaceDetails: {        description: 'Team collaboration space',        guidelines: 'Be respectful and on-topic'      }    })  })  return response.json()}
```
```
Bearer ${accessToken}
```
```
async function listSpaces(accessToken: string) {  const response = await fetch(    'https://chat.googleapis.com/v1/spaces?pageSize=100',    {      headers: { 'Authorization': Bearer ${accessToken} }    }  )  const data = await response.json()  // Returns: { spaces: [...], nextPageToken: '...' }  return data.spaces}
```
```
async function listSpaces(accessToken: string) {  const response = await fetch(    'https://chat.googleapis.com/v1/spaces?pageSize=100',    {      headers: { 'Authorization': Bearer ${accessToken} }    }  )  const data = await response.json()  // Returns: { spaces: [...], nextPageToken: '...' }  return data.spaces}
```
```
Bearer ${accessToken}
```
```
async function searchSpaces(accessToken: string, query: string) {  const params = new URLSearchParams({    query: query,  // e.g., 'displayName:Project'    pageSize: '50'  })  const response = await fetch(    https://chat.googleapis.com/v1/spaces:search?${params},    {      headers: { 'Authorization': Bearer ${accessToken} }    }  )  return response.json()}
```
```
async function searchSpaces(accessToken: string, query: string) {  const params = new URLSearchParams({    query: query,  // e.g., 'displayName:Project'    pageSize: '50'  })  const response = await fetch(    https://chat.googleapis.com/v1/spaces:search?${params},    {      headers: { 'Authorization': Bearer ${accessToken} }    }  )  return response.json()}
```
```
https://chat.googleapis.com/v1/spaces:search?${params}
```
```
Bearer ${accessToken}
```
```
displayName:Project
```
```
spaceType:SPACE
```
```
createTime>2025-01-01
```
```
AND
```
```
OR
```
```
spaces.members.create
```
```
chat.memberships
```
```
spaces.members.delete
```
```
chat.memberships
```
```
spaces.members.get
```
```
chat.memberships.readonly
```
```
spaces.members.list
```
```
chat.memberships.readonly
```
```
spaces.members.patch
```
```
chat.memberships
```
```
async function addMember(accessToken: string, spaceName: string, userEmail: string) {  const response = await fetch(    https://chat.googleapis.com/v1/${spaceName}/members,    {      method: 'POST',      headers: {        'Authorization': Bearer ${accessToken},        'Content-Type': 'application/json'      },      body: JSON.stringify({        member: {          name: users/${userEmail},          type: 'HUMAN'  // or 'BOT'        },        role: 'ROLE_MEMBER'  // or 'ROLE_MANAGER'      })    }  )  return response.json()}
```
```
async function addMember(accessToken: string, spaceName: string, userEmail: string) {  const response = await fetch(    https://chat.googleapis.com/v1/${spaceName}/members,    {      method: 'POST',      headers: {        'Authorization': Bearer ${accessToken},        'Content-Type': 'application/json'      },      body: JSON.stringify({        member: {          name: users/${userEmail},          type: 'HUMAN'  // or 'BOT'        },        role: 'ROLE_MEMBER'  // or 'ROLE_MANAGER'      })    }  )  return response.json()}
```
```
https://chat.googleapis.com/v1/${spaceName}/members
```
```
Bearer ${accessToken}
```
```
users/${userEmail}
```
```
async function listMembers(accessToken: string, spaceName: string) {  const response = await fetch(    https://chat.googleapis.com/v1/${spaceName}/members?pageSize=100,    {      headers: { 'Authorization': Bearer ${accessToken} }    }  )  return response.json()  // Returns: { memberships: [...], nextPageToken: '...' }}
```
```
async function listMembers(accessToken: string, spaceName: string) {  const response = await fetch(    https://chat.googleapis.com/v1/${spaceName}/members?pageSize=100,    {      headers: { 'Authorization': Bearer ${accessToken} }    }  )  return response.json()  // Returns: { memberships: [...], nextPageToken: '...' }}
```
```
https://chat.googleapis.com/v1/${spaceName}/members?pageSize=100
```
```
Bearer ${accessToken}
```
```
async function updateMemberRole(  accessToken: string,  memberName: string,  // e.g., 'spaces/ABC/members/DEF'  newRole: 'ROLE_MEMBER' | 'ROLE_MANAGER') {  const response = await fetch(    https://chat.googleapis.com/v1/${memberName}?updateMask=role,    {      method: 'PATCH',      headers: {        'Authorization': Bearer ${accessToken},        'Content-Type': 'application/json'      },      body: JSON.stringify({ role: newRole })    }  )  return response.json()}
```
```
async function updateMemberRole(  accessToken: string,  memberName: string,  // e.g., 'spaces/ABC/members/DEF'  newRole: 'ROLE_MEMBER' | 'ROLE_MANAGER') {  const response = await fetch(    https://chat.googleapis.com/v1/${memberName}?updateMask=role,    {      method: 'PATCH',      headers: {        'Authorization': Bearer ${accessToken},        'Content-Type': 'application/json'      },      body: JSON.stringify({ role: newRole })    }  )  return response.json()}
```
```
https://chat.googleapis.com/v1/${memberName}?updateMask=role
```
```
Bearer ${accessToken}
```
```
ROLE_MEMBER
```
```
ROLE_MANAGER
```
```
spaces.messages.reactions.create
```
```
spaces.messages.reactions.delete
```
```
spaces.messages.reactions.list
```
```
async function addReaction(  accessToken: string,  messageName: string,  // e.g., 'spaces/ABC/messages/XYZ'  emoji: string) {  const response = await fetch(    https://chat.googleapis.com/v1/${messageName}/reactions,    {      method: 'POST',      headers: {        'Authorization': Bearer ${accessToken},        'Content-Type': 'application/json'      },      body: JSON.stringify({        emoji: {          unicode: emoji  // e.g., '👍' or custom emoji code        }      })    }  )  return response.json()}
```
```
async function addReaction(  accessToken: string,  messageName: string,  // e.g., 'spaces/ABC/messages/XYZ'  emoji: string) {  const response = await fetch(    https://chat.googleapis.com/v1/${messageName}/reactions,    {      method: 'POST',      headers: {        'Authorization': Bearer ${accessToken},        'Content-Type': 'application/json'      },      body: JSON.stringify({        emoji: {          unicode: emoji  // e.g., '👍' or custom emoji code        }      })    }  )  return response.json()}
```
```
https://chat.googleapis.com/v1/${messageName}/reactions
```
```
Bearer ${accessToken}
```
```
async function listReactions(accessToken: string, messageName: string) {  const response = await fetch(    https://chat.googleapis.com/v1/${messageName}/reactions?pageSize=100,    {      headers: { 'Authorization': Bearer ${accessToken} }    }  )  return response.json()  // Returns: { reactions: [...], nextPageToken: '...' }}
```
```
async function listReactions(accessToken: string, messageName: string) {  const response = await fetch(    https://chat.googleapis.com/v1/${messageName}/reactions?pageSize=100,    {      headers: { 'Authorization': Bearer ${accessToken} }    }  )  return response.json()  // Returns: { reactions: [...], nextPageToken: '...' }}
```
```
https://chat.googleapis.com/v1/${messageName}/reactions?pageSize=100
```
```
Bearer ${accessToken}
```
```
customEmoji.uid
```
```
unicode
```
```
async function withRetry<T>(  fn: () => Promise<T>,  maxRetries = 3): Promise<T> {  for (let i = 0; i < maxRetries; i++) {    try {      return await fn()    } catch (error: any) {      if (error.status === 429) {        // Rate limited - wait with exponential backoff        const waitMs = Math.pow(2, i) * 1000 + Math.random() * 1000        await new Promise(r => setTimeout(r, waitMs))        continue      }      throw error    }  }  throw new Error('Max retries exceeded')}// Usageconst spaces = await withRetry(() => listSpaces(accessToken))
```
```
async function withRetry<T>(  fn: () => Promise<T>,  maxRetries = 3): Promise<T> {  for (let i = 0; i < maxRetries; i++) {    try {      return await fn()    } catch (error: any) {      if (error.status === 429) {        // Rate limited - wait with exponential backoff        const waitMs = Math.pow(2, i) * 1000 + Math.random() * 1000        await new Promise(r => setTimeout(r, waitMs))        continue      }      throw error    }  }  throw new Error('Max retries exceeded')}// Usageconst spaces = await withRetry(() => listSpaces(accessToken))
```
```
google-chat-cards@1.0.3
```
```
{  "dependencies": {    "google-chat-cards": "^1.0.3"  },  "devDependencies": {    "@cloudflare/workers-types": "^4.20260109.0",    "wrangler": "^4.58.0"  }}
```
```
{  "dependencies": {    "google-chat-cards": "^1.0.3"  },  "devDependencies": {    "@cloudflare/workers-types": "^4.20260109.0",    "wrangler": "^4.58.0"  }}
```
```
templates/bearer-token-verify.ts
```
```
actionResponse.dialogAction.actionStatus
```
```
references/common-errors.md
```
The Google Chat API skill empowers your AI agent to seamlessly interact with Google Chat environments, transforming how teams communicate and collaborate. By leveraging this skill, developers can build robust integrations that go beyond simple notifications, enabling dynamic interactions, managing memberships, and responding to user input directly within Chat spaces. It's an indispensable tool for automating routine tasks, providing instant information, or orchestrating complex workflows that require real-time communication. This skill ensures your agent is a proactive and integral part of any Google Chat-centric team.

# When to Use This Skill
- •Automating real-time notifications for system alerts or project updates.
- •Developing interactive chatbots for customer support or internal team queries.
- •Programmatically managing Google Chat spaces, members, and conversations.
- •Integrating with external services to post rich cards and receive structured input.

# Pro Tips
- 💡For interactive bots, always use Cloudflare Workers or similar serverless functions for efficient, scalable event processing and rapid responses.
- 💡Start with webhook integrations for simple outgoing messages; it drastically reduces setup complexity for basic notifications.
- 💡Design rich, interactive cards (Cards v2) instead of plain text messages to enhance user experience and facilitate structured input.

