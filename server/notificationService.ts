import { createTransport } from "nodemailer";
import twilio from "twilio";
import { ENV } from "./_core/env";

// --- Types ---

export type OrderNotificationData = {
  orderNumber: string;
  totalAmount: number; // in cents
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
};

// --- Email Service (Nodemailer) ---

const transporter = createTransport({
  host: ENV.mailHost,
  port: ENV.mailPort,
  secure: ENV.mailPort === 465, // true for 465, false for other ports
  auth: {
    user: ENV.mailUsername,
    pass: ENV.mailPassword,
  },
});

async function sendEmailNotification(data: OrderNotificationData) {
  if (!data.customerEmail || !ENV.mailUsername) {
    console.warn("Email notification skipped: Missing customer email or sender credentials.");
    return;
  }

  const subject = `Nuta Order Confirmation: ${data.orderNumber}`;
  const totalKES = (data.totalAmount / 100).toFixed(2);
  const body = `
    Dear ${data.customerName || "Customer"},

    Thank you for your order with Nuta!

    Your order **${data.orderNumber}** has been successfully placed.
    Total Amount: KES ${totalKES}
    
    We will notify you once your order has been shipped.

    The Nuta Team
  `;

  try {
    await transporter.sendMail({
      from: `"${ENV.mailFromName}" <${ENV.mailFromAddress}>`,
      to: data.customerEmail,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
    });
    console.log(`Email sent successfully to ${data.customerEmail} for order ${data.orderNumber}`);
  } catch (error) {
    console.error(`Failed to send email for order ${data.orderNumber}:`, error);
  }
}

// --- SMS Service (Twilio) ---

const twilioClient = ENV.twilioAccountSid && ENV.twilioAuthToken && ENV.twilioPhoneNumber ? twilio(ENV.twilioAccountSid, ENV.twilioAuthToken) : null;

async function sendSmsNotification(data: OrderNotificationData) {
  if (!twilioClient || !data.customerPhone || !ENV.twilioPhoneNumber || !ENV.twilioAccountSid) {
    console.warn("SMS notification skipped: Missing phone number or Twilio credentials.");
    return;
  }

  const totalKES = (data.totalAmount / 100).toFixed(2);
  const body = `Nuta: Your order ${data.orderNumber} has been placed. Total: KES ${totalKES}. We will notify you on shipment.`;

  try {
    await twilioClient.messages.create({
      body: body,
      to: data.customerPhone,
      from: ENV.twilioPhoneNumber,
    });
    console.log(`SMS sent successfully to ${data.customerPhone} for order ${data.orderNumber}`);
  } catch (error) {
    console.error(`Failed to send SMS for order ${data.orderNumber}:`, error);
  }
}

// --- WhatsApp Service (Twilio) ---

async function sendWhatsappNotification(data: OrderNotificationData) {
  if (!twilioClient || !data.customerPhone || !ENV.twilioPhoneNumber || !ENV.twilioAccountSid) {
    console.warn("WhatsApp notification skipped: Missing phone number or Twilio credentials.");
    return;
  }

  const totalKES = (data.totalAmount / 100).toFixed(2);
  const body = `*Nuta Order Confirmation*
Hello ${data.customerName || "Customer"},

Your order **${data.orderNumber}** has been successfully placed.
Total Amount: KES ${totalKES}

We will notify you once your order has been shipped.
`;

  try {
    await twilioClient.messages.create({
      body: body,
      to: `whatsapp:${data.customerPhone}`,
      from: `whatsapp:${ENV.twilioPhoneNumber}`,
    });
    console.log(`WhatsApp sent successfully to ${data.customerPhone} for order ${data.orderNumber}`);
  } catch (error) {
    console.error(`Failed to send WhatsApp for order ${data.orderNumber}:`, error);
  }
}

// --- Main Dispatcher ---

export async function sendOrderConfirmation(data: OrderNotificationData) {
  console.log(`Dispatching order confirmation for ${data.orderNumber}...`);

  // 1. Email Notification
  await sendEmailNotification(data);

  // 2. SMS Notification
  await sendSmsNotification(data);

  // 3. WhatsApp Notification
  await sendWhatsappNotification(data);

  console.log(`Order confirmation dispatch complete for ${data.orderNumber}.`);
}
