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
              currency: "usd",
              product_data: {
                name: "Booking Service",
              },
              unit_amount: 5000, // Amount in cents
            },
            quantity: 1,
          },
        ],
        expand: ["line_items"],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        metadata: {
          // Flat key-value pairs for each field in formData
          pickupLocation: JSON.stringify(formData.pickupLocation),
          dropoffLocation: JSON.stringify(formData.dropoffLocation),
          dateTimeOption: formData.dateTimeOption,
          serviceDate: formData.serviceDate,
          serviceTime: formData.serviceTime,
          year: formData.year,
          make: formData.make,
          model: formData.model,
          brokenAxle: formData.brokenAxle,
          parkingGarage: formData.parkingGarage,
          pictures: JSON.stringify(formData.pictures), // If pictures are URLs or data URIs
          name: formData.name,
          countryCode: formData.countryCode,
          phone: formData.phone,
        },
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
