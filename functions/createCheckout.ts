import Stripe from 'npm:stripe';

// Use test key for sandbox testing
const stripe = new Stripe(Deno.env.get('STRIPE_TEST_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { submissionId, successUrl, cancelUrl, customerEmail, csrfToken } = await req.json();

    // Verify CSRF token (basic check - token must be present and non-empty)
    // Note: Full CSRF validation would require storing token server-side or in a signed cookie
    // For now, we verify token exists and has reasonable format (UUID-like)
    if (!csrfToken || typeof csrfToken !== 'string' || csrfToken.trim().length === 0) {
      return Response.json({ error: 'Invalid request' }, { status: 403 });
    }
    
    // Additional validation: CSRF token should be UUID-like format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const timestampRegex = /^\d+-[a-z0-9]+$/i;
    if (!uuidRegex.test(csrfToken) && !timestampRegex.test(csrfToken)) {
      return Response.json({ error: 'Invalid request format' }, { status: 403 });
    }

    // Better idempotency: use submissionId as key (prevents duplicate charges for same CV)
    // Stripe will reject duplicate requests with same idempotency key
    const idempotencyKey = `checkout_${submissionId}`;

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