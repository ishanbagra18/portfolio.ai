import express from 'express';
import { getUserEntitlements, getUserPlan } from '../middleware/entitlementMiddleware.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/**
 * GET /api/billing/entitlements
 * Returns user's active plan, feature limits, and remaining monthly quotas
 */
router.get('/entitlements', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || 'guest';
    const entitlements = await getUserEntitlements(userId);
    res.json(entitlements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entitlements', details: err.message });
  }
});

/**
 * POST /api/billing/create-checkout-session
 * Initiates Stripe checkout for Pro Plan ($12/mo)
 */
router.post('/create-checkout-session', async (req, res) => {
  const { userId, billingCycle = 'monthly', returnUrl } = req.body;

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    // Simulation / local testing fallback if Stripe API Key isn't provided
    if (!stripeKey) {
      // Simulate upgrade for local dev
      if (userId && userId !== 'guest') {
        await supabase
          .from('profiles')
          .upsert({ id: userId, plan: 'pro', plan_renews_at: new Date(Date.now() + 30 * 86400000).toISOString() });
      }

      return res.json({
        simulated: true,
        url: returnUrl || '/upgrade/success?session_id=simulated_session_123',
        message: 'Stripe simulated upgrade complete! (Local Development Mode)'
      });
    }

    // Dynamic import of Stripe if key exists
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);

    const priceId = billingCycle === 'yearly' 
      ? (process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly')
      : (process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Portfolio.io Pro Developer',
              description: 'Unlimited AI generation, 20+ templates, custom domain & custom slug, no watermark.'
            },
            unit_amount: billingCycle === 'yearly' ? 12000 : 1200, // $12/mo or $120/yr
            recurring: { interval: billingCycle === 'yearly' ? 'year' : 'month' }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing`,
      metadata: { userId }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Error creating Stripe checkout session:', err);
    res.status(500).json({ error: 'Failed to create Stripe checkout session', details: err.message });
  }
});

/**
 * POST /api/billing/create-portal-session
 * Customer Portal link for managing active Stripe subscription
 */
router.post('/create-portal-session', async (req, res) => {
  const { userId } = req.body;
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return res.json({ url: '/settings/billing', message: 'Local development mode' });
    }

    const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', userId).single();
    if (!profile?.stripe_customer_id) {
      return res.status(400).json({ error: 'No active Stripe customer record found.' });
    }

    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings/billing`
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer portal session', details: err.message });
  }
});

/**
 * POST /api/billing/webhook
 * Handles incoming Stripe webhooks (checkout.session.completed, customer.subscription.updated/deleted)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return res.status(200).send('Webhook unconfigured (Local Dev Mode)');
  }

  try {
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (userId) {
          await supabase.from('profiles').upsert({
            id: userId,
            plan: 'pro',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan_renews_at: new Date(Date.now() + 30 * 86400000).toISOString()
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const { data: profile } = await supabase.from('profiles').select('id').eq('stripe_subscription_id', subscription.id).single();
        if (profile) {
          await supabase.from('profiles').update({ plan: 'free' }).eq('id', profile.id);
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
