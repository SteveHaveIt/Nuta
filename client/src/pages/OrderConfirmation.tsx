import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Mail, Phone, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderData {
  orderNumber: string;
  trackingId: string;
  total: number;
  items: Array<{ productName: string; quantity: number; price: number }>;
  shippingAddress: string;
  customerEmail: string;
  customerPhone: string;
  status: "success" | "pending" | "failed";
}

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Get order data from sessionStorage (set after successful payment)
    const data = sessionStorage.getItem("lastOrder");
    if (data) {
      setOrderData(JSON.parse(data));
    } else {
      // Redirect to home if no order data
      setLocation("/");
    }
  }, [setLocation]);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (orderData.status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h1>
            <p className="text-gray-600">Unfortunately, your payment could not be processed.</p>
          </div>

          <Card className="p-8 mb-8">
            <div className="space-y-4">
              <p className="text-gray-700">
                Your order <strong>#{orderData.orderNumber}</strong> was created, but the payment was not completed.
              </p>
              <p className="text-gray-700">
                Please try again or contact our customer care team for assistance.
              </p>
            </div>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setLocation("/cart")}
              variant="outline"
              size="lg"
              className="text-gray-700"
            >
              Back to Cart
            </Button>
            <Button
              onClick={() => setLocation("/")}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700"
            >
              Continue Shopping
            </Button>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Need help?</strong> Contact our customer care team at{" "}
              <a href="tel:+254742101089" className="font-semibold text-blue-600 hover:underline">
                +254 742 101 089
              </a>{" "}
              or email{" "}
              <a href="mailto:info.stevehaveit@gmail.com" className="font-semibold text-blue-600 hover:underline">
                info.stevehaveit@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Thank You!</h1>
          <p className="text-xl text-gray-600">Your order has been successfully placed</p>
        </div>

        {/* Warm Message */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <div className="text-center space-y-3">
            <p className="text-lg text-gray-800">
              We're thrilled to have you as a customer! Your Nuta Peanut Butter is being prepared with care and will be on its way to you soon.
            </p>
            <p className="text-gray-700">
              Thank you for choosing quality, natural nutrition. We wish you delicious moments ahead! 🥜
            </p>
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-lg font-semibold text-gray-800">#{orderData.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tracking ID</p>
              <p className="text-lg font-semibold text-orange-600">{orderData.trackingId}</p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t pt-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">KES {(item.price * item.quantity / 100).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total Amount Paid</span>
              <span className="text-2xl font-bold text-orange-600">KES {(orderData.total / 100).toLocaleString()}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-600" />
              Shipping Information
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-700">
                <strong>Delivery Address:</strong> {orderData.shippingAddress}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Estimated Delivery:</strong> 2-3 business days
              </p>
              <p className="text-sm text-gray-700">
                <strong>Tracking ID:</strong> {orderData.trackingId}
              </p>
              <p className="text-xs text-gray-600 mt-3">
                You can track your order using the tracking ID above. A detailed tracking link has been sent to your email.
              </p>
            </div>
          </div>
        </Card>

        {/* Return Policy */}
        <Card className="p-6 mb-8 bg-amber-50 border-amber-200">
          <h3 className="font-semibold text-gray-800 mb-3">Return Policy</h3>
          <p className="text-sm text-gray-700 mb-2">
            We stand behind our products! If you're not completely satisfied with your purchase:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Returns accepted within 14 days of delivery</li>
            <li>Product must be unopened and in original condition</li>
            <li>Full refund or replacement available</li>
            <li>Free return shipping for defective items</li>
          </ul>
        </Card>

        {/* Contact Information */}
        <Card className="p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Need Help?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Call us</p>
                <a href="tel:+254742101089" className="font-semibold text-orange-600 hover:underline">
                  +254 742 101 089
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Email us</p>
                <a href="mailto:info.stevehaveit@gmail.com" className="font-semibold text-orange-600 hover:underline">
                  info.stevehaveit@gmail.com
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* Email Confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Confirmation Email Sent</p>
            <p className="text-sm text-green-800">
              A detailed order confirmation with tracking information has been sent to <strong>{orderData.customerEmail}</strong>
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => setLocation("/products")}
            variant="outline"
            size="lg"
            className="text-gray-700"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => setLocation("/")}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700"
          >
            Back to Home
          </Button>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12 pt-8 border-t">
          <p className="text-gray-600 text-sm">
            Thank you for supporting Nuta - Pure Love in a Jar! 🥜❤️
          </p>
        </div>
      </div>
    </div>
  );
}
