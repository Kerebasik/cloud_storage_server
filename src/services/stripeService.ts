import Stripe from 'stripe';
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2022-11-15',
});

export async function StripeCreateSessionsUrl(priceId: string, userId: string) {
  try {
    const successUrl = `${process.env.API_URL}/api/payment/success/${priceId}/${userId}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: `${priceId}`,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: `${process.env.API_URL}/error`,
    });
    return String(session.url);
  } catch (e) {
    console.log(e);
  }
}
