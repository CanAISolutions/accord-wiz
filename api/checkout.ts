import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2024-06-20' });

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const form = await req.json();

  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'cad',
        unit_amount: 999,
        product_data: { name: 'Canadian Rental Agreement (PDF)' }
      },
      quantity: 1
    }],
    success_url: `${origin}/api/download?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/`,
    metadata: { form: JSON.stringify(form) }
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'content-type': 'application/json' }
  });
}


