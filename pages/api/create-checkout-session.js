import { stripe } from "../../lib/stripe";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      amount,
      currency,
      name,
      phone,
      description,
      pickupLocation,
      dropoffLocation,
      dateTimeOption,
      serviceDate,
      serviceTime,
      year,
      make,
      model,
      brokenAxle,
      parkingGarage,
      pictures,
      selectedService,
      vehicleType,
      vehicleOther,
      countryCode,
    } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: description,
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        expand: ["line_items"],
        mode: "payment",
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
        metadata: {
          pickupLocation: JSON.stringify(pickupLocation),
          dropoffLocation: JSON.stringify(dropoffLocation),
          lat: pickupLocation.geometry.location.lat,
          lng: pickupLocation.geometry.location.lng,
          dateTimeOption: dateTimeOption,
          serviceDate: serviceDate,
          serviceTime: serviceTime,
          year: year,
          make: make,
          model: model,
          brokenAxle: brokenAxle,
          parkingGarage: parkingGarage,
          pictures: JSON.stringify(pictures),
          name: name,
          phone: phone,
          selectedService: selectedService,
          vehicleType: vehicleType,
          vehicleOther: vehicleOther,
          countryCode: countryCode,
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
