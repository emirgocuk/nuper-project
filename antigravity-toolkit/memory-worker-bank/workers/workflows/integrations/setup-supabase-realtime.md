# Setup Supabase Realtime
Source: https://antigravity.codes/workflows/integrations/setup-supabase-realtime-subscriptions-websocket

## AI Worker Instructions
When the user requests functionality related to Setup Supabase Realtime, follow these guidelines and utilize this context.

## Scraped Content

# Setup Supabase Realtime
```
const channel = supabase     .channel('messages')     .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {       if (payload.eventType === 'INSERT') {         setMessages((prev) => [...prev, payload.new]);       }     })     .subscribe();
```
```
const channel = supabase     .channel('messages')     .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {       if (payload.eventType === 'INSERT') {         setMessages((prev) => [...prev, payload.new]);       }     })     .subscribe();
```
```
await channel.track({ user: 'John', online_at: new Date() });
```
```
await channel.track({ user: 'John', online_at: new Date() });
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as setup-supabase-realtime-subscriptions-websocket.md
```
setup-supabase-realtime-subscriptions-websocket.md
```
- In Antigravity, type /setup_supabase_realtime_subscriptions_websocket or just describe what you want to do
```
/setup_supabase_realtime_subscriptions_websocket
```
Learn more about workflows →

# Related Workflows

# Supabase Row Level Security (RLS)

# NextAuth.js (Auth.js) v5 Setup

# Stripe Checkout Integration

