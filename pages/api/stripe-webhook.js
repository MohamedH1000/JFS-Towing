import { buffer } from "micro"; // To handle raw body content
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

// Use Nodemailer or another email service to send the email
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service here
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const config = {
  api: {
    bodyParser: false, // Disabling body parsing so we can process the raw payload
  },
};

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const sig = req.headers["stripe-signature"];
      const reqBuffer = await buffer(req); // Raw body

      const event = stripe.webhooks.constructEvent(
        reqBuffer.toString(),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET // Your Stripe webhook secret
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Payment was successful, now send the email
        const customerEmail = session.customer_email;
        const amount = session.amount_total / 100; // Stripe sends the amount in cents
        const description =
          session.line_items[0]?.description || "Booking Service Payment";

        const emailSubject = "Payment Confirmation";
        const emailText = `Hello ${session.customer_name},\n\nYour payment of $${amount} for ${description} was successful. Thank you!`;

        // Send an email to the customer
        sendEmail(customerEmail, emailSubject, emailText);

        res.status(200).json({ received: true });
      } else {
        res.status(400).send(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      console.error("Webhook Error:", err);
      res.status(500).send("Webhook Error: " + err.message);
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
