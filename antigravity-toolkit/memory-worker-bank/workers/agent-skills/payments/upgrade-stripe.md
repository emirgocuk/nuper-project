# upgrade-stripe
Source: https://antigravity.codes/agent-skills/payments/upgrade-stripe

## AI Worker Instructions
When the user requests functionality related to upgrade-stripe, follow these guidelines and utilize this context.

## Scraped Content

# upgrade-stripe
```
2025-12-15.clover
```
```
2025-08-27.basil
```
```
2024-12-18.acacia
```
```
import stripestripe.api_version = '2025-12-15.clover'
```
```
import stripestripe.api_version = '2025-12-15.clover'
```
```
Stripe.api_version = '2025-12-15.clover'
```
```
Stripe.api_version = '2025-12-15.clover'
```
```
const stripe = require('stripe')('sk_test_xxx', {  apiVersion: '2025-12-15.clover'});
```
```
const stripe = require('stripe')('sk_test_xxx', {  apiVersion: '2025-12-15.clover'});
```
```
stripe.Customer.create(  email="customer@example.com",  stripe_version='2025-12-15.clover')
```
```
stripe.Customer.create(  email="customer@example.com",  stripe_version='2025-12-15.clover')
```
```
// Good: Explicit versionconst stripe = require('stripe')('sk_test_xxx', {  apiVersion: '2025-12-15.clover'});// Avoid: Relying on account defaultconst stripe = require('stripe')('sk_test_xxx');
```
```
// Good: Explicit versionconst stripe = require('stripe')('sk_test_xxx', {  apiVersion: '2025-12-15.clover'});// Avoid: Relying on account defaultconst stripe = require('stripe')('sk_test_xxx');
```
```
<script src="https://js.stripe.com/clover/stripe.js"></script>
```
```
<script src="https://js.stripe.com/clover/stripe.js"></script>
```
```
npm install @stripe/stripe-js
```
```
npm install @stripe/stripe-js
```
```
2025-12-15.clover
```
```
2024-12-18.acacia
```
```
npm update stripe
```
```
pip install --upgrade stripe
```
```
apiVersion
```
```
Stripe-Version
```
```
Stripe-Version
```
```
curl https://api.stripe.com/v1/customers \  -u sk_test_xxx: \  -H "Stripe-Version: 2025-12-15.clover"
```
```
curl https://api.stripe.com/v1/customers \  -u sk_test_xxx: \  -H "Stripe-Version: 2025-12-15.clover"
```
```
const stripe = require('stripe')('sk_test_xxx', {  apiVersion: '2025-12-15.clover'  // Test with new version});
```
```
const stripe = require('stripe')('sk_test_xxx', {  apiVersion: '2025-12-15.clover'  // Test with new version});
```
This skill is designed to streamline the often complex process of upgrading your Stripe integration. As payment platforms evolve, keeping your API and SDK versions current is crucial for security, performance, and access to the latest features. This guide demystifies Stripe's date-based versioning and details the necessary steps for updating server-side, client-side (Stripe.js), and mobile SDKs. Leveraging this skill can significantly reduce the potential for breaking changes and ensure your payment flows remain robust and up-to-date with Stripe's ecosystem, enabling a smoother development experience.

# When to Use This Skill
- •Migrating an existing application to a newer Stripe API version.
- •Updating outdated Stripe server-side SDKs in a Python or Ruby project.
- •Troubleshooting payment errors after a Stripe API version change.
- •Planning a Stripe integration upgrade project to adopt new features.

# Pro Tips
- 💡Always test Stripe upgrades in a staging or development environment first, never directly in production.
- 💡Before updating, thoroughly review the official Stripe API Changelog for your specific version range to anticipate and prepare for any breaking changes.
- 💡Utilize Stripe's API version setting in your account dashboard and dynamically in your SDKs to manage transitions granularly and minimize disruption.

