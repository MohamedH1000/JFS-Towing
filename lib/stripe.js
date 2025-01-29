import Stripe from "stripe";

// Create a new instance of the Stripe client with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15", // Use the latest stable version
});
