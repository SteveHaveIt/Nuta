import nodemailer from "nodemailer";
import { Order, OrderItem } from "../drizzle/schema";

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface OrderConfirmationData {
  order: Order;
  items: (OrderItem & { productName: string })[];
  trackingNumber?: string;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  const { order, items, trackingNumber } = data;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.productName}</strong><br/>
        Quantity: ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        KES ${(item.price / 100).toFixed(2)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        KES ${((item.price * item.quantity) / 100).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50000; // 500 KES in cents
  const total = subtotal + shipping;

  const trackingInfo = trackingNumber
    ? `
    <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Tracking Number:</strong></p>
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #0284c7;">${trackingNumber}</p>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">You can use this number to track your shipment</p>
    </div>
  `
    : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #eee; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        .order-number { font-size: 24px; font-weight: bold; color: #ea580c; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .total-row { background: #f9fafb; font-weight: bold; font-size: 16px; }
        .button { display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
        </div>
        
        <div class="content">
          <p>Hi <strong>${order.customerName}</strong>,</p>
          
          <p>We're thrilled to confirm your order! Your Nuta products are being prepared with care.</p>
          
          <div class="order-number">Order #${order.orderNumber}</div>
          
          <p style="margin: 20px 0;"><strong>Shipping Address:</strong></p>
          <p style="margin: 0; background: #f9fafb; padding: 12px; border-radius: 4px;">
            ${order.shippingAddress}
          </p>
          
          <p style="margin: 20px 0; font-weight: bold;">Order Details:</p>
          <table>
            <thead>
              <tr style="background: #f9fafb; border-bottom: 2px solid #eee;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: right;">Unit Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="total-row">
                <td style="padding: 12px; text-align: right;">Subtotal:</td>
                <td style="padding: 12px; text-align: right;">KES ${(subtotal / 100).toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td style="padding: 12px; text-align: right;">Shipping:</td>
                <td style="padding: 12px; text-align: right;">KES ${(shipping / 100).toFixed(2)}</td>
              </tr>
              <tr class="total-row" style="font-size: 18px;">
                <td style="padding: 12px; text-align: right;">Total Amount:</td>
                <td style="padding: 12px; text-align: right; color: #ea580c;">KES ${(total / 100).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          ${trackingInfo}
          
          <p style="margin: 20px 0;"><strong>What's Next?</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Your order is being processed and will be shipped soon</li>
            <li>You'll receive a tracking update via email</li>
            <li>Estimated delivery: 2-5 business days within Nairobi</li>
            <li>For inquiries, contact us on WhatsApp: 0742101089</li>
          </ul>
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            Thank you for choosing Nuta! We hope you enjoy our 100% natural peanut products.
          </p>
          
          <p style="margin: 10px 0; color: #666; font-size: 14px;">
            Best regards,<br/>
            <strong>The Nuta Team</strong><br/>
            Steve Have It Enterprise Hub
          </p>
        </div>
        
        <div class="footer">
          <p>If you have any questions, reply to this email or contact us on WhatsApp: 0742101089</p>
          <p style="margin-top: 10px;">© 2024 Nuta - 100% Natural Peanut Products</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error };
  }
}

/**
 * Send shipment tracking email to customer
 */
export async function sendShipmentTrackingEmail(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  trackingNumber: string,
  estimatedDelivery: string
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #eee; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        .tracking-box { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .tracking-number { font-size: 28px; font-weight: bold; color: #0284c7; margin: 10px 0; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Your Order is On the Way!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Track your shipment</p>
        </div>
        
        <div class="content">
          <p>Hi <strong>${customerName}</strong>,</p>
          
          <p>Great news! Your Nuta order has been shipped and is on its way to you.</p>
          
          <div class="tracking-box">
            <p style="margin: 0 0 10px 0;">Order Number:</p>
            <p style="margin: 0 0 20px 0; font-size: 18px; font-weight: bold;">${orderNumber}</p>
            
            <p style="margin: 0 0 10px 0;">Tracking Number:</p>
            <div class="tracking-number">${trackingNumber}</div>
            
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #666;">
              Use this tracking number to monitor your shipment's progress
            </p>
          </div>
          
          <p style="margin: 20px 0;"><strong>Estimated Delivery:</strong></p>
          <p style="margin: 0; font-size: 16px; color: #ea580c; font-weight: bold;">${estimatedDelivery}</p>
          
          <p style="margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 4px;">
            <strong>Delivery Instructions:</strong><br/>
            Please ensure someone is available to receive the package. If you're not available, 
            the courier will leave a notice with instructions for collection.
          </p>
          
          <p style="margin: 20px 0;">
            Have questions? Contact us on WhatsApp: <strong>0742101089</strong>
          </p>
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            Thank you for choosing Nuta!<br/>
            <strong>The Nuta Team</strong><br/>
            Steve Have It Enterprise Hub
          </p>
        </div>
        
        <div class="footer">
          <p>© 2024 Nuta - 100% Natural Peanut Products</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: customerEmail,
      subject: `Your Nuta Order is Shipping - ${trackingNumber}`,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send shipment tracking email:", error);
    return { success: false, error };
  }
}
