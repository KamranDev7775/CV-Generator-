import Stripe from 'npm:stripe';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  // Get secrets inside handler to ensure fresh values
  const stripe = new Stripe(Deno.env.get('STRIPE_TEST_SECRET_KEY'));
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    console.log('Webhook received');
    console.log('Signature present:', !!signature);
    console.log('Webhook secret length:', webhookSecret?.length || 0);
    console.log('Body length:', body?.length || 0);

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured!');
      return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!signature) {
      console.error('No stripe-signature header present');
      return Response.json({ error: 'No signature' }, { status: 400 });
    }

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Signature verification failed:', err.message);
      console.error('Expected secret starts with:', webhookSecret?.substring(0, 10));
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Received Stripe event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const submissionId = session.metadata?.submission_id;

      console.log('Payment completed for submission:', submissionId);

      if (submissionId) {
        try {
          await base44.asServiceRole.entities.CVSubmission.update(submissionId, {
            payment_status: 'completed',
            stripe_session_id: session.id
          });
          console.log('Updated submission payment status to completed');
        } catch (updateError) {
          console.error('Error updating submission:', updateError);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});