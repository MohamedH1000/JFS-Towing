import { buffer } from "micro";
import nodemailer from "nodemailer";
import { stripe } from "../../lib/stripe";

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "mail.nashamatech.tech",
  port: 587,
  secure: true,
  auth: {
    user: "info@nashamatech.tech",
    pass: "Aziz@123",
  },
  tls: {
    rejectUnauthorized: false, // Skip certificate validation if needed
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to send messages:", success);
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};
export async function sendMail({ email, sendTo, subject, text, html }) {
  try {
    await transporter.verify();
  } catch (error) {
    console.error(
      "Something Went Wrong",
      SMTP_SERVER_USERNAME,
      SMTP_SERVER_PASSWORD,
      error
    );
    return;
  }
  const info = await transporter.sendMail({
    from: email,
    to: sendTo || SITE_MAIL_RECIEVER,
    subject: subject,
    text: text,
    html: html ? html : "",
  });
  console.log("Message Sent", info.messageId);
  console.log("Mail sent to", SITE_MAIL_RECIEVER);
  return info;
}

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

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name;
        const amount = (session.amount_total / 100).toFixed(2); // Convert to dollars
        const description = "Booking Service Payment";

        // Send an email to the customer
        await sendMail({
          email: SMTP_SERVER_USERNAME, // Email sender
          sendTo: customerEmail, // Customer's email
          subject: "Payment Confirmation",
          text: `Hello ${customerName},\n\nYour payment of $${amount} for ${description} was successful.\n\nThank you for your business!`,
          html: `<p>Hello ${customerName},</p>
                 <p>Your payment of <strong>$${amount}</strong> for <strong>${description}</strong> was successful.</p>
                 <p>Thank you for your business!</p>`,
        });

        res.status(200).json({ received: true });
      } else {
        res.status(400).send(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("Webhook Error:", err);
      res.status(500).send(`Webhook Error: ${err.message}`);
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
