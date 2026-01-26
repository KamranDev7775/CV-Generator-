import Stripe from 'npm:stripe';

// Use test key for sandbox testing
const stripe = new Stripe(Deno.env.get('STRIPE_TEST_SECRET_KEY'));

// Price IDs from Stripe
const TRIAL_PRICE_ID = 'price_1Sp7ZCBJbYwh3WQ7E6BHPOri'; // €2.99 one-time
const MONTHLY_PRICE_ID = 'price_1Sp7ZCBJbYwh3WQ7W840G2IK'; // €6.99/month

Deno.serve(async (req) => {
  try {
    const { planType, successUrl, cancelUrl, customerEmail } = await req.json();

    const idempotencyKey = `sub_${planType}_${Date.now()}`;

    // Require customer email for subscription tracking
    if (!customerEmail) {
      return Response.json({ error: 'Customer email is required' }, { status: 400 });
    }

    let sessionConfig = {
      payment_method_types: ['card'],
      customer_email: customerEmail,
      success_url: successUrl.replace('SESSION_PLACEHOLDER', '{CHECKOUT_SESSION_ID}'),
      cancel_url: cancelUrl,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        plan_type: planType
      }
    };

    if (planType === 'trial') {
      // Trial: One-time €2.99 payment
      // Note: For true trial-to-subscription conversion, you would need to:
      // 1. Create a subscription with trial period
      // 2. Set up subscription schedule
      // For now, this creates a one-time payment
      sessionConfig.mode = 'payment';
      sessionConfig.line_items = [
        {
          price: TRIAL_PRICE_ID,
          quantity: 1
        }
      ];
    } else if (planType === 'monthly') {
      // Monthly subscription
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items = [
        {
          price: MONTHLY_PRICE_ID,
          quantity: 1
        }
      ];
    } else {
      return Response.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create(sessionConfig, {
      idempotencyKey: idempotencyKey
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Subscription checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});