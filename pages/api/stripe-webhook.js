import { buffer } from "micro";
import nodemailer from "nodemailer";
import { stripe } from "../../lib/stripe";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw to handle appropriately
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const sig = req.headers["stripe-signature"];
      const reqBuffer = await buffer(req);

      const event = stripe.webhooks.constructEvent(
        reqBuffer.toString(),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      console.log("Received event:", event.type);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Handle customer email
        const customerEmail =
          session.customer_email || session.customer_details?.email;
        if (!customerEmail) {
          console.error("Customer email is missing.");
          return res.status(400).send("Customer email is missing.");
        }

        // Amount and description
        const amount = session.amount_total / 100;
        const description = "Booking Service Payment";

        const emailSubject = "Payment Confirmation";
        const emailText = `Hello,\n\nYour payment of $${amount} for ${description} was successful. Thank you!`;

        // Send email
        await sendEmail(customerEmail, emailSubject, emailText);

        res.status(200).json({ received: true });
      } else {
        console.log(`Unhandled event type: ${event.type}`);
        res.status(400).send(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("Webhook Error:", err.message);
      res.status(500).send("Webhook Error: " + err.message);
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
