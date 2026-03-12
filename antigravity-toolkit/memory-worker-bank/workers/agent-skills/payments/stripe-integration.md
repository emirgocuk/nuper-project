# stripe-integration
Source: https://antigravity.codes/agent-skills/payments/stripe-integration

## AI Worker Instructions
When the user requests functionality related to stripe-integration, follow these guidelines and utilize this context.

## Scraped Content

# stripe-integration
```
payment_intent.succeeded
```
```
payment_intent.payment_failed
```
```
customer.subscription.updated
```
```
customer.subscription.deleted
```
```
charge.refunded
```
```
invoice.payment_succeeded
```
```
import stripestripe.api_key = "sk_test_..."# Create a checkout sessionsession = stripe.checkout.Session.create(    payment_method_types=['card'],    line_items=[{        'price_data': {            'currency': 'usd',            'product_data': {                'name': 'Premium Subscription',            },            'unit_amount': 2000,  # $20.00            'recurring': {                'interval': 'month',            },        },        'quantity': 1,    }],    mode='subscription',    success_url='https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',    cancel_url='https://yourdomain.com/cancel',)# Redirect user to session.urlprint(session.url)
```
```
import stripestripe.api_key = "sk_test_..."# Create a checkout sessionsession = stripe.checkout.Session.create(    payment_method_types=['card'],    line_items=[{        'price_data': {            'currency': 'usd',            'product_data': {                'name': 'Premium Subscription',            },            'unit_amount': 2000,  # $20.00            'recurring': {                'interval': 'month',            },        },        'quantity': 1,    }],    mode='subscription',    success_url='https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',    cancel_url='https://yourdomain.com/cancel',)# Redirect user to session.urlprint(session.url)
```
```
def create_checkout_session(amount, currency='usd'):    """Create a one-time payment checkout session."""    try:        session = stripe.checkout.Session.create(            payment_method_types=['card'],            line_items=[{                'price_data': {                    'currency': currency,                    'product_data': {                        'name': 'Purchase',                        'images': ['https://example.com/product.jpg'],                    },                    'unit_amount': amount,  # Amount in cents                },                'quantity': 1,            }],            mode='payment',            success_url='https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',            cancel_url='https://yourdomain.com/cancel',            metadata={                'order_id': 'order_123',                'user_id': 'user_456'            }        )        return session    except stripe.error.StripeError as e:        # Handle error        print(f"Stripe error: {e.user_message}")        raise
```
```
def create_checkout_session(amount, currency='usd'):    """Create a one-time payment checkout session."""    try:        session = stripe.checkout.Session.create(            payment_method_types=['card'],            line_items=[{                'price_data': {                    'currency': currency,                    'product_data': {                        'name': 'Purchase',                        'images': ['https://example.com/product.jpg'],                    },                    'unit_amount': amount,  # Amount in cents                },                'quantity': 1,            }],            mode='payment',            success_url='https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',            cancel_url='https://yourdomain.com/cancel',            metadata={                'order_id': 'order_123',                'user_id': 'user_456'            }        )        return session    except stripe.error.StripeError as e:        # Handle error        print(f"Stripe error: {e.user_message}")        raise
```
```
def create_payment_intent(amount, currency='usd', customer_id=None):    """Create a payment intent for custom checkout UI."""    intent = stripe.PaymentIntent.create(        amount=amount,        currency=currency,        customer=customer_id,        automatic_payment_methods={            'enabled': True,        },        metadata={            'integration_check': 'accept_a_payment'        }    )    return intent.client_secret  # Send to frontend# Frontend (JavaScript)"""const stripe = Stripe('pk_test_...');const elements = stripe.elements();const cardElement = elements.create('card');cardElement.mount('#card-element');const {error, paymentIntent} = await stripe.confirmCardPayment(    clientSecret,    {        payment_method: {            card: cardElement,            billing_details: {                name: 'Customer Name'            }        }    });if (error) {    // Handle error} else if (paymentIntent.status === 'succeeded') {    // Payment successful}"""
```
```
def create_payment_intent(amount, currency='usd', customer_id=None):    """Create a payment intent for custom checkout UI."""    intent = stripe.PaymentIntent.create(        amount=amount,        currency=currency,        customer=customer_id,        automatic_payment_methods={            'enabled': True,        },        metadata={            'integration_check': 'accept_a_payment'        }    )    return intent.client_secret  # Send to frontend# Frontend (JavaScript)"""const stripe = Stripe('pk_test_...');const elements = stripe.elements();const cardElement = elements.create('card');cardElement.mount('#card-element');const {error, paymentIntent} = await stripe.confirmCardPayment(    clientSecret,    {        payment_method: {            card: cardElement,            billing_details: {                name: 'Customer Name'            }        }    });if (error) {    // Handle error} else if (paymentIntent.status === 'succeeded') {    // Payment successful}"""
```
```
def create_subscription(customer_id, price_id):    """Create a subscription for a customer."""    try:        subscription = stripe.Subscription.create(            customer=customer_id,            items=[{'price': price_id}],            payment_behavior='default_incomplete',            payment_settings={'save_default_payment_method': 'on_subscription'},            expand=['latest_invoice.payment_intent'],        )        return {            'subscription_id': subscription.id,            'client_secret': subscription.latest_invoice.payment_intent.client_secret        }    except stripe.error.StripeError as e:        print(f"Subscription creation failed: {e}")        raise
```
```
def create_subscription(customer_id, price_id):    """Create a subscription for a customer."""    try:        subscription = stripe.Subscription.create(            customer=customer_id,            items=[{'price': price_id}],            payment_behavior='default_incomplete',            payment_settings={'save_default_payment_method': 'on_subscription'},            expand=['latest_invoice.payment_intent'],        )        return {            'subscription_id': subscription.id,            'client_secret': subscription.latest_invoice.payment_intent.client_secret        }    except stripe.error.StripeError as e:        print(f"Subscription creation failed: {e}")        raise
```
```
def create_customer_portal_session(customer_id):    """Create a portal session for customers to manage subscriptions."""    session = stripe.billing_portal.Session.create(        customer=customer_id,        return_url='https://yourdomain.com/account',    )    return session.url  # Redirect customer here
```
```
def create_customer_portal_session(customer_id):    """Create a portal session for customers to manage subscriptions."""    session = stripe.billing_portal.Session.create(        customer=customer_id,        return_url='https://yourdomain.com/account',    )    return session.url  # Redirect customer here
```
```
from flask import Flask, requestimport stripeapp = Flask(__name__)endpoint_secret = 'whsec_...'@app.route('/webhook', methods=['POST'])def webhook():    payload = request.data    sig_header = request.headers.get('Stripe-Signature')    try:        event = stripe.Webhook.construct_event(            payload, sig_header, endpoint_secret        )    except ValueError:        # Invalid payload        return 'Invalid payload', 400    except stripe.error.SignatureVerificationError:        # Invalid signature        return 'Invalid signature', 400    # Handle the event    if event['type'] == 'payment_intent.succeeded':        payment_intent = event['data']['object']        handle_successful_payment(payment_intent)    elif event['type'] == 'payment_intent.payment_failed':        payment_intent = event['data']['object']        handle_failed_payment(payment_intent)    elif event['type'] == 'customer.subscription.deleted':        subscription = event['data']['object']        handle_subscription_canceled(subscription)    return 'Success', 200def handle_successful_payment(payment_intent):    """Process successful payment."""    customer_id = payment_intent.get('customer')    amount = payment_intent['amount']    metadata = payment_intent.get('metadata', {})    # Update your database    # Send confirmation email    # Fulfill order    print(f"Payment succeeded: {payment_intent['id']}")def handle_failed_payment(payment_intent):    """Handle failed payment."""    error = payment_intent.get('last_payment_error', {})    print(f"Payment failed: {error.get('message')}")    # Notify customer    # Update order statusdef handle_subscription_canceled(subscription):    """Handle subscription cancellation."""    customer_id = subscription['customer']    # Update user access    # Send cancellation email    print(f"Subscription canceled: {subscription['id']}")
```
```
from flask import Flask, requestimport stripeapp = Flask(__name__)endpoint_secret = 'whsec_...'@app.route('/webhook', methods=['POST'])def webhook():    payload = request.data    sig_header = request.headers.get('Stripe-Signature')    try:        event = stripe.Webhook.construct_event(            payload, sig_header, endpoint_secret        )    except ValueError:        # Invalid payload        return 'Invalid payload', 400    except stripe.error.SignatureVerificationError:        # Invalid signature        return 'Invalid signature', 400    # Handle the event    if event['type'] == 'payment_intent.succeeded':        payment_intent = event['data']['object']        handle_successful_payment(payment_intent)    elif event['type'] == 'payment_intent.payment_failed':        payment_intent = event['data']['object']        handle_failed_payment(payment_intent)    elif event['type'] == 'customer.subscription.deleted':        subscription = event['data']['object']        handle_subscription_canceled(subscription)    return 'Success', 200def handle_successful_payment(payment_intent):    """Process successful payment."""    customer_id = payment_intent.get('customer')    amount = payment_intent['amount']    metadata = payment_intent.get('metadata', {})    # Update your database    # Send confirmation email    # Fulfill order    print(f"Payment succeeded: {payment_intent['id']}")def handle_failed_payment(payment_intent):    """Handle failed payment."""    error = payment_intent.get('last_payment_error', {})    print(f"Payment failed: {error.get('message')}")    # Notify customer    # Update order statusdef handle_subscription_canceled(subscription):    """Handle subscription cancellation."""    customer_id = subscription['customer']    # Update user access    # Send cancellation email    print(f"Subscription canceled: {subscription['id']}")
```
```
import hashlibimport hmacdef verify_webhook_signature(payload, signature, secret):    """Manually verify webhook signature."""    expected_sig = hmac.new(        secret.encode('utf-8'),        payload,        hashlib.sha256    ).hexdigest()    return hmac.compare_digest(signature, expected_sig)def handle_webhook_idempotently(event_id, handler):    """Ensure webhook is processed exactly once."""    # Check if event already processed    if is_event_processed(event_id):        return    # Process event    try:        handler()        mark_event_processed(event_id)    except Exception as e:        log_error(e)        # Stripe will retry failed webhooks        raise
```
```
import hashlibimport hmacdef verify_webhook_signature(payload, signature, secret):    """Manually verify webhook signature."""    expected_sig = hmac.new(        secret.encode('utf-8'),        payload,        hashlib.sha256    ).hexdigest()    return hmac.compare_digest(signature, expected_sig)def handle_webhook_idempotently(event_id, handler):    """Ensure webhook is processed exactly once."""    # Check if event already processed    if is_event_processed(event_id):        return    # Process event    try:        handler()        mark_event_processed(event_id)    except Exception as e:        log_error(e)        # Stripe will retry failed webhooks        raise
```
```
def create_customer(email, name, payment_method_id=None):    """Create a Stripe customer."""    customer = stripe.Customer.create(        email=email,        name=name,        payment_method=payment_method_id,        invoice_settings={            'default_payment_method': payment_method_id        } if payment_method_id else None,        metadata={            'user_id': '12345'        }    )    return customerdef attach_payment_method(customer_id, payment_method_id):    """Attach a payment method to a customer."""    stripe.PaymentMethod.attach(        payment_method_id,        customer=customer_id    )    # Set as default    stripe.Customer.modify(        customer_id,        invoice_settings={            'default_payment_method': payment_method_id        }    )def list_customer_payment_methods(customer_id):    """List all payment methods for a customer."""    payment_methods = stripe.PaymentMethod.list(        customer=customer_id,        type='card'    )    return payment_methods.data
```
```
def create_customer(email, name, payment_method_id=None):    """Create a Stripe customer."""    customer = stripe.Customer.create(        email=email,        name=name,        payment_method=payment_method_id,        invoice_settings={            'default_payment_method': payment_method_id        } if payment_method_id else None,        metadata={            'user_id': '12345'        }    )    return customerdef attach_payment_method(customer_id, payment_method_id):    """Attach a payment method to a customer."""    stripe.PaymentMethod.attach(        payment_method_id,        customer=customer_id    )    # Set as default    stripe.Customer.modify(        customer_id,        invoice_settings={            'default_payment_method': payment_method_id        }    )def list_customer_payment_methods(customer_id):    """List all payment methods for a customer."""    payment_methods = stripe.PaymentMethod.list(        customer=customer_id,        type='card'    )    return payment_methods.data
```
```
def create_refund(payment_intent_id, amount=None, reason=None):    """Create a refund."""    refund_params = {        'payment_intent': payment_intent_id    }    if amount:        refund_params['amount'] = amount  # Partial refund    if reason:        refund_params['reason'] = reason  # 'duplicate', 'fraudulent', 'requested_by_customer'    refund = stripe.Refund.create(**refund_params)    return refunddef handle_dispute(charge_id, evidence):    """Update dispute with evidence."""    stripe.Dispute.modify(        charge_id,        evidence={            'customer_name': evidence.get('customer_name'),            'customer_email_address': evidence.get('customer_email'),            'shipping_documentation': evidence.get('shipping_proof'),            'customer_communication': evidence.get('communication'),        }    )
```
```
def create_refund(payment_intent_id, amount=None, reason=None):    """Create a refund."""    refund_params = {        'payment_intent': payment_intent_id    }    if amount:        refund_params['amount'] = amount  # Partial refund    if reason:        refund_params['reason'] = reason  # 'duplicate', 'fraudulent', 'requested_by_customer'    refund = stripe.Refund.create(**refund_params)    return refunddef handle_dispute(charge_id, evidence):    """Update dispute with evidence."""    stripe.Dispute.modify(        charge_id,        evidence={            'customer_name': evidence.get('customer_name'),            'customer_email_address': evidence.get('customer_email'),            'shipping_documentation': evidence.get('shipping_proof'),            'customer_communication': evidence.get('communication'),        }    )
```
```
# Use test mode keysstripe.api_key = "sk_test_..."# Test card numbersTEST_CARDS = {    'success': '4242424242424242',    'declined': '4000000000000002',    '3d_secure': '4000002500003155',    'insufficient_funds': '4000000000009995'}def test_payment_flow():    """Test complete payment flow."""    # Create test customer    customer = stripe.Customer.create(        email="test@example.com"    )    # Create payment intent    intent = stripe.PaymentIntent.create(        amount=1000,        currency='usd',        customer=customer.id,        payment_method_types=['card']    )    # Confirm with test card    confirmed = stripe.PaymentIntent.confirm(        intent.id,        payment_method='pm_card_visa'  # Test payment method    )    assert confirmed.status == 'succeeded'
```
```
# Use test mode keysstripe.api_key = "sk_test_..."# Test card numbersTEST_CARDS = {    'success': '4242424242424242',    'declined': '4000000000000002',    '3d_secure': '4000002500003155',    'insufficient_funds': '4000000000009995'}def test_payment_flow():    """Test complete payment flow."""    # Create test customer    customer = stripe.Customer.create(        email="test@example.com"    )    # Create payment intent    intent = stripe.PaymentIntent.create(        amount=1000,        currency='usd',        customer=customer.id,        payment_method_types=['card']    )    # Confirm with test card    confirmed = stripe.PaymentIntent.confirm(        intent.id,        payment_method='pm_card_visa'  # Test payment method    )    assert confirmed.status == 'succeeded'
```
Seamlessly integrate powerful payment capabilities into your applications with this Stripe Integration Agent Skill. Designed to simplify the complexities of online transactions, it empowers developers to build secure, scalable, and user-friendly payment experiences. From setting up one-time purchases and recurring subscriptions to managing refunds and handling critical webhook events, this skill provides the guidance needed to implement robust financial operations. Leverage Stripe's industry-leading infrastructure for PCI compliance and fraud protection, ensuring your payment flows are both efficient and secure. This agent skill is your go-to resource for mastering Stripe’s diverse suite of payment solutions.

# When to Use This Skill
- •Implementing a new e-commerce checkout system for online stores.
- •Developing a SaaS platform with recurring subscription models and billing cycles.
- •Setting up a secure payment gateway for mobile applications using Stripe.
- •Building a marketplace that handles payments between multiple parties with Stripe Connect.

# Pro Tips
- 💡Always rely on webhooks for critical payment lifecycle events (e.g., `payment_intent.succeeded`) rather than solely client-side callbacks, to ensure data integrity and prevent fraud.
- 💡Implement comprehensive error handling and logging for all Stripe API interactions and webhook endpoints to quickly diagnose and resolve any payment processing issues.
- 💡Regularly review Stripe's API documentation and security best practices, particularly regarding PCI compliance and Strong Customer Authentication (SCA), to keep your integration up-to-date and secure.

