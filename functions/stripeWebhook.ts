import Stripe from 'npm:stripe';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  // Get secrets inside handler to ensure fresh values (use live key if available)
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || Deno.env.get('STRIPE_TEST_SECRET_KEY'));
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

    // Handle checkout session completed (one-time payments & subscription starts)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const submissionId = session.metadata?.submission_id;
      const planType = session.metadata?.plan_type;

      console.log('Checkout completed - mode:', session.mode, 'planType:', planType);

      // Handle one-time CV payment
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

      // Handle subscription checkout
      if (session.mode === 'subscription' && session.subscription) {
        try {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await base44.asServiceRole.entities.Subscription.create({
            user_email: session.customer_email || session.customer_details?.email,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan_type: planType || 'monthly',
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          });
          console.log('Created subscription record');
        } catch (subError) {
          console.error('Error creating subscription:', subError);
        }
      }

      // Handle one-time trial payment (not a subscription but needs tracking)
      if (session.mode === 'payment' && planType === 'trial') {
        try {
          // Calculate 14 days access from now
          const accessEnd = new Date();
          accessEnd.setDate(accessEnd.getDate() + 14);
          
          await base44.asServiceRole.entities.Subscription.create({
            user_email: session.customer_email || session.customer_details?.email,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.payment_intent || session.id,
            plan_type: 'trial',
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: accessEnd.toISOString()
          });
          console.log('Created trial access record');
        } catch (trialError) {
          console.error('Error creating trial record:', trialError);
        }
      }
    }

    // Handle subscription updates
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      try {
        const existing = await base44.asServiceRole.entities.Subscription.filter({
          stripe_subscription_id: subscription.id
        });
        if (existing.length > 0) {
          await base44.asServiceRole.entities.Subscription.update(existing[0].id, {
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null
          });
          console.log('Updated subscription status to:', subscription.status);
        }
      } catch (updateError) {
        console.error('Error updating subscription:', updateError);
      }
    }

    // Handle subscription deletion/cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      try {
        const existing = await base44.asServiceRole.entities.Subscription.filter({
          stripe_subscription_id: subscription.id
        });
        if (existing.length > 0) {
          await base44.asServiceRole.entities.Subscription.update(existing[0].id, {
            status: 'canceled',
            canceled_at: new Date().toISOString()
          });
          console.log('Marked subscription as canceled');
        }
      } catch (deleteError) {
        console.error('Error updating canceled subscription:', deleteError);
      }
    }

    // Handle failed payments
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      if (invoice.subscription) {
        try {
          const existing = await base44.asServiceRole.entities.Subscription.filter({
            stripe_subscription_id: invoice.subscription
          });
          if (existing.length > 0) {
            await base44.asServiceRole.entities.Subscription.update(existing[0].id, {
              status: 'past_due'
            });
            console.log('Marked subscription as past_due');
          }
        } catch (failError) {
          console.error('Error updating failed payment subscription:', failError);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});