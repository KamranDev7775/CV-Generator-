import Stripe from 'npm:stripe';

// Use test key for sandbox testing
const stripe = new Stripe(Deno.env.get('STRIPE_TEST_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { submissionId, successUrl, cancelUrl, customerEmail } = await req.json();

    const idempotencyKey = `checkout_${submissionId}_${Date.now()}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'ATS CV Generator',
              description: 'PDF + Copyable Text CV Download'
            },
            unit_amount: 199
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        submission_id: submissionId
      }
    }, {
      idempotencyKey: idempotencyKey
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});