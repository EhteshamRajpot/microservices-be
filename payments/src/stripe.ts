import stripe from "stripe";

const Stripe = new stripe(process.env.STRIPE_KEY!);

export default Stripe;