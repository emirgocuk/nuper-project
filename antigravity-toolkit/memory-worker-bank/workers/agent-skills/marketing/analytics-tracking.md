# analytics-tracking
Source: https://antigravity.codes/agent-skills/marketing/analytics-tracking

## AI Worker Instructions
When the user requests functionality related to analytics-tracking, follow these guidelines and utilize this context.

## Scraped Content

# analytics-tracking
```
Event Name | Event Category | Properties | Trigger | Notes---------- | ------------- | ---------- | ------- | -----
```
```
Event Name | Event Category | Properties | Trigger | Notes---------- | ------------- | ---------- | ------- | -----
```
```
signup_completedbutton_clickedform_submittedarticle_read
```
```
signup_completedbutton_clickedform_submittedarticle_read
```
```
click_buttonsubmit_formcomplete_signup
```
```
click_buttonsubmit_formcomplete_signup
```
```
checkout_payment_completedblog_article_viewedonboarding_step_completed
```
```
checkout_payment_completedblog_article_viewedonboarding_step_completed
```
```
cta_hero_clicked
```
```
button_clicked
```
```
// gtag.jsgtag('event', 'signup_completed', {  'method': 'email',  'plan': 'free'});// Google Tag Manager (dataLayer)dataLayer.push({  'event': 'signup_completed',  'method': 'email',  'plan': 'free'});
```
```
// gtag.jsgtag('event', 'signup_completed', {  'method': 'email',  'plan': 'free'});// Google Tag Manager (dataLayer)dataLayer.push({  'event': 'signup_completed',  'method': 'email',  'plan': 'free'});
```
```
// Push custom eventdataLayer.push({  'event': 'form_submitted',  'form_name': 'contact',  'form_location': 'footer'});// Set user propertiesdataLayer.push({  'user_id': '12345',  'user_type': 'premium'});// E-commerce eventdataLayer.push({  'event': 'purchase',  'ecommerce': {    'transaction_id': 'T12345',    'value': 99.99,    'currency': 'USD',    'items': [{      'item_id': 'SKU123',      'item_name': 'Product Name',      'price': 99.99    }]  }});
```
```
// Push custom eventdataLayer.push({  'event': 'form_submitted',  'form_name': 'contact',  'form_location': 'footer'});// Set user propertiesdataLayer.push({  'user_id': '12345',  'user_type': 'premium'});// E-commerce eventdataLayer.push({  'event': 'purchase',  'ecommerce': {    'transaction_id': 'T12345',    'value': 99.99,    'currency': 'USD',    'items': [{      'item_id': 'SKU123',      'item_name': 'Product Name',      'price': 99.99    }]  }});
```
```
# [Site/Product] Tracking Plan## Overview- Tools: GA4, GTM- Last updated: [Date]- Owner: [Name]## Events### Marketing Events| Event Name | Description | Properties | Trigger ||------------|-------------|------------|---------|| signup_started | User initiates signup | source, page | Click signup CTA || signup_completed | User completes signup | method, plan | Signup success page |### Product Events[Similar table]## Custom Dimensions| Name | Scope | Parameter | Description ||------|-------|-----------|-------------|| user_type | User | user_type | Free, trial, paid |## Conversions| Conversion | Event | Counting | Google Ads ||------------|-------|----------|------------|| Signup | signup_completed | Once per session | Yes |## UTM Convention[Guidelines]
```
```
# [Site/Product] Tracking Plan## Overview- Tools: GA4, GTM- Last updated: [Date]- Owner: [Name]## Events### Marketing Events| Event Name | Description | Properties | Trigger ||------------|-------------|------------|---------|| signup_started | User initiates signup | source, page | Click signup CTA || signup_completed | User completes signup | method, plan | Signup success page |### Product Events[Similar table]## Custom Dimensions| Name | Scope | Parameter | Description ||------|-------|-----------|-------------|| user_type | User | user_type | Free, trial, paid |## Conversions| Conversion | Event | Counting | Google Ads ||------------|-------|----------|------------|| Signup | signup_completed | Once per session | Yes |## UTM Convention[Guidelines]
```
Unlock the power of data-driven decision making with this comprehensive Analytics Tracking Agent Skill. Designed for marketing and product professionals, it guides you through setting up robust measurement systems. From understanding business objectives to implementing GA4, event tracking, and conversion funnels, this skill ensures your data strategy is precise and actionable. Leverage expert advice to audit existing setups, troubleshoot issues, and gain deep insights that propel your growth and optimize user experiences.

# When to Use This Skill
- •Setting up Google Analytics 4 (GA4) from scratch for a new website or app.
- •Auditing an existing analytics implementation to identify gaps, errors, or opportunities for improvement.
- •Defining and implementing custom event tracking for key user interactions and conversion goals.
- •Creating a comprehensive tracking plan for a new product launch or marketing campaign.

# Pro Tips
- 💡Always begin with defining clear business questions and desired outcomes. This ensures every piece of tracked data serves a purpose and avoids collecting 'vanity metrics'.
- 💡Implement a consistent naming convention for events and parameters across all tracking platforms. This drastically improves data usability and reporting coherence.
- 💡Regularly audit your tracking setup using tools like Tag Assistant and debug views. Data quality is paramount for reliable insights, so validate frequently.

