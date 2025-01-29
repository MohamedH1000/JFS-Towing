import { buffer } from "micro";
import nodemailer from "nodemailer";
import { stripe } from "../../lib/stripe";
import DropOffLocation from "../components/DropOffLocation";

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: SMTP_SERVER_HOST,
  port: 587,
  secure: false,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true, // Skip certificate validation if needed
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
    from: SMTP_SERVER_USERNAME,
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
        const pickupLocation = JSON.parse(session.metadata.pickupLocation);
        const dropoffLocation = JSON.parse(session.metadata.dropoffLocation);
        const pictures = JSON.parse(session.metadata.pictures);

        const {
          name,
          phone,
          dateTimeOption,
          serviceDate,
          serviceTime,
          year,
          make,
          model,
          brokenAxle,
          parkingGarage,
          vehicleType,
          selectedService,
          vehicleOther,
          countryCode,
        } = session.metadata;
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name;
        const amount = (session.amount_total / 100).toFixed(2); // Convert to dollars
        const description = "Booking Service Payment";
        const emailContent = `
        <h1>Service Request Details</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${countryCode + phone}</p>
        ${
          pickupLocation?.address
            ? `<p>
           <strong>Pickup Location:</strong> ${pickupLocation.address}
         </p>`
            : ""
        }
        ${
          dropoffLocation?.address
            ? `
            
            <p>
              <strong>Dropoff Location:</strong> ${dropoffLocation.address}
            </p>
            `
            : ""
        }
        ${
          pickupLocation?.geometry
            ? ` 
            <p>
              <strong>Pickup Location:</strong> 
              ${pickupLocation.geometry.location.lat}
            </p>
            `
            : ""
        }
        ${
          dropoffLocation?.geometry
            ? `
            <p>
              <strong>Dropoff Location:</strong>
              ${dropoffLocation.geometry.location.lng}
            </p>
            `
            : ""
        } 
        <p><strong>Date and Time Option:</strong> ${dateTimeOption}</p>
        ${
          serviceDate
            ? `<p><strong>Service Date:</strong> ${serviceDate}</p>`
            : ""
        }
        ${
          serviceTime
            ? `<p><strong>Service Time:</strong> ${serviceTime}</p>`
            : ""
        }
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Make:</strong> ${make}</p>
        <p><strong>Model:</strong> ${model}</p>
        <p><strong>Broken Axle:</strong> ${brokenAxle}</p>
        <p><strong>Parking Garage:</strong> ${parkingGarage}</p>
        <p><strong>Amount Paid:</strong> $${amount}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>The Selected Service:</strong> ${selectedService}</p>
        <p><strong>The Vehicle Type:</strong> ${vehicleType}</p>
        ${
          vehicleOther
            ? `<p><strong>The Vehicle Name:</strong> ${vehicleOther}</p>`
            : ""
        }
      `;
        // Send an email to the customer
        await sendMail({
          email: SMTP_SERVER_USERNAME,
          sendTo: customerEmail,
          subject: "Service Booked Successfully",
          text: `New service request from ${name}. Amount Paid: $${amount}.`,
          html: emailContent,
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
