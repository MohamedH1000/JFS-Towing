import { stripe } from "../../lib/stripe";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, currency, name, phone, description } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: currency, // 'usd'
              product_data: {
                name: description, // Use the description or product name
              },
              unit_amount: Math.round(amount * 100), // Convert dollars to cents
            },
            quantity: 1, // You can modify quantity based on the use case
          },
        ],
        expand: ["line_items"],
        mode: "payment",
        success_url: `${req.headers.origin}/success`, // On success
        cancel_url: `${req.headers.origin}/cancel`, // On cancel'
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
