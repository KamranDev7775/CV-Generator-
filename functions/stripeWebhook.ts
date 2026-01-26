import Stripe from 'npm:stripe';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

Deno.serve(async (req) => {
  // Set up Base44 client first (before signature verification)
  const base44 = createClientFromRequest(req);

  try {
    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return Response.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }

    // Verify webhook signature using async method (required for Deno)
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Received Stripe event:', event.type);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const submissionId = session.metadata?.submission_id;

      if (!submissionId) {
        console.error('No submission_id in session metadata');
        return Response.json({ error: 'Missing submission_id' }, { status: 400 });
      }

      console.log(`Processing payment for submission: ${submissionId}`);

      // Update CVSubmission payment_status to 'completed' using service role
      try {
        await base44.asServiceRole.entities.CVSubmission.update(submissionId, {
          payment_status: 'completed',
          stripe_session_id: session.id
        });

        console.log(`Payment completed for submission: ${submissionId}`);
        return Response.json({ success: true, submissionId });
      } catch (updateError) {
        console.error('Error updating submission:', updateError);
        return Response.json({ error: 'Failed to update submission' }, { status: 500 });
      }
    }

    // Return success for other event types
    console.log('Event type not handled:', event.type);
    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});