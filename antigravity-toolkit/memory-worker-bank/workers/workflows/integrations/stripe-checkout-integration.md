# Stripe Checkout Integration
Source: https://antigravity.codes/workflows/integrations/integrate-stripe-checkout-payment-flow-webhooks

## AI Worker Instructions
When the user requests functionality related to Stripe Checkout Integration, follow these guidelines and utilize this context.

## Scraped Content

# Stripe Checkout Integration
```
npm install stripe
```
```
'use server'   import Stripe from 'stripe';   import { redirect } from 'next/navigation';      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);   export async function checkout() {     const session = await stripe.checkout.sessions.create({       line_items: [{ price: 'price_id', quantity: 1 }],       mode: 'payment',       success_url: ${process.env.NEXT_PUBLIC_URL}/success,       cancel_url: ${process.env.NEXT_PUBLIC_URL}/cancel,     });     redirect(session.url!);   }
```
```
'use server'   import Stripe from 'stripe';   import { redirect } from 'next/navigation';      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);   export async function checkout() {     const session = await stripe.checkout.sessions.create({       line_items: [{ price: 'price_id', quantity: 1 }],       mode: 'payment',       success_url: ${process.env.NEXT_PUBLIC_URL}/success,       cancel_url: ${process.env.NEXT_PUBLIC_URL}/cancel,     });     redirect(session.url!);   }
```
```
${process.env.NEXT_PUBLIC_URL}/success
```
```
${process.env.NEXT_PUBLIC_URL}/cancel
```
```
api/webhooks/stripe/route.ts
```
```
headers()
```
```
import { headers } from 'next/headers';   import { NextResponse } from 'next/server';   import Stripe from 'stripe';      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;   export async function POST(req: Request) {     const body = await req.text();     const headersList = await headers();     const sig = headersList.get('stripe-signature')!;          let event;     try {       event = stripe.webhooks.constructEvent(body, sig, endpointSecret);     } catch (err) {       return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });     }     if (event.type === 'checkout.session.completed') {       const session = event.data.object;       // Fulfill order here     }          return NextResponse.json({ received: true });   }
```
```
import { headers } from 'next/headers';   import { NextResponse } from 'next/server';   import Stripe from 'stripe';      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;   export async function POST(req: Request) {     const body = await req.text();     const headersList = await headers();     const sig = headersList.get('stripe-signature')!;          let event;     try {       event = stripe.webhooks.constructEvent(body, sig, endpointSecret);     } catch (err) {       return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });     }     if (event.type === 'checkout.session.completed') {       const session = event.data.object;       // Fulfill order here     }          return NextResponse.json({ received: true });   }
```
```
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
```
STRIPE_WEBHOOK_SECRET
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as integrate-stripe-checkout-payment-flow-webhooks.md
```
integrate-stripe-checkout-payment-flow-webhooks.md
```
- In Antigravity, type /integrate_stripe_checkout_payment_flow_webhooks or just describe what you want to do
```
/integrate_stripe_checkout_payment_flow_webhooks
```
Learn more about workflows →

# Related Workflows

# NextAuth.js (Auth.js) v5 Setup

# Supabase Row Level Security (RLS)

# Setup Local Database (Postgres)

