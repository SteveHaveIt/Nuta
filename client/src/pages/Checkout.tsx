import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatPrice, getCartSessionId } from "@/lib/cart";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  productId: number;
  quantity: number;
  product?: any;
}

interface ShippingForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Map<number, any>>(new Map());
  const [currentStep, setCurrentStep] = useState<"shipping" | "payment" | "confirmation">(
    "shipping"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    postalCode: "",
  });

  const sessionId = getCartSessionId();
  const { data: allProducts } = trpc.products.getAll.useQuery();
  const createOrderMutation = trpc.orders.create.useMutation();
  const initiatePaymentMutation = trpc.payment.initiateSTKPush.useMutation();

  // Load cart items
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    const items = cart[sessionId] || [];
    setCartItems(items);

    if (allProducts && items.length > 0) {
      const productMap = new Map();
      items.forEach((item: CartItem) => {
        const product = allProducts.find((p) => p.id === item.productId);
        if (product) {
          productMap.set(item.productId, product);
        }
      });
      setProducts(productMap);
    }
  }, [sessionId, allProducts]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing) {
      setLocation("/cart");
    }
  }, [cartItems, setLocation, isProcessing]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.get(item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const subtotal = calculateTotal();
  const shippingCost = 50000; // 500 KES in cents
  const total = subtotal + shippingCost;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateShippingForm = () => {
    if (
      !shippingForm.customerName ||
      !shippingForm.customerEmail ||
      !shippingForm.customerPhone ||
      !shippingForm.shippingAddress ||
      !shippingForm.city
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Validate phone number (Kenya format)
    if (!/^(\+254|0)[17][0-9]{8}$/.test(shippingForm.customerPhone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid Kenyan phone number");
      return false;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.customerEmail)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleProceedToPayment = () => {
    if (validateShippingForm()) {
      setCurrentStep("payment");
    }
  };

  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    try {
      // Create order first
      const orderData = {
        customerName: shippingForm.customerName,
        customerEmail: shippingForm.customerEmail,
        customerPhone: shippingForm.customerPhone,
        shippingAddress: `${shippingForm.shippingAddress}, ${shippingForm.city}${
          shippingForm.postalCode ? ", " + shippingForm.postalCode : ""
        }`,
        totalAmount: total,
        items: cartItems.map((item) => {
          const product = products.get(item.productId);
          return {
            productId: item.productId,
            productName: product?.name || "Product",
            productImage: product?.imageUrl,
            quantity: item.quantity,
            price: product?.price || 0,
          };
        }),
      };

      const order = await createOrderMutation.mutateAsync(orderData);
      setOrderNumber(order.orderNumber);

      // Format phone number for Lipana API (254XXXXXXXXX format)
      const formattedPhone = shippingForm.customerPhone
        .replace(/^0/, "254")
        .replace(/\D/g, "");

      // Initiate M-Pesa payment
      const paymentResponse = await initiatePaymentMutation.mutateAsync({
        phoneNumber: formattedPhone,
        amount: total,
        orderId: order.orderId,
        orderNumber: order.orderNumber,
      });

      if (paymentResponse.success) {
        toast.success("M-Pesa prompt sent to your phone! Please enter your PIN.");
        // Clear cart
        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        cart[sessionId] = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartItems([]);
        setCurrentStep("confirmation");
      } else {
        toast.error(paymentResponse?.message || "Payment initiation failed");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Shipping Step
  if (currentStep === "shipping") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setLocation("/cart")}
            className="mb-6 text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Shipping Information</h1>

                <form className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={shippingForm.customerName}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={shippingForm.customerEmail}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number (M-Pesa) *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={shippingForm.customerPhone}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0742101089"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: 0712345678 or +254712345678
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <textarea
                      name="shippingAddress"
                      value={shippingForm.shippingAddress}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="123 Main Street, Apartment 4B"
                      rows={3}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City/Town *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Nairobi"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingForm.postalCode}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="00100"
                    />
                  </div>

                  <Button
                    onClick={handleProceedToPayment}
                    size="lg"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg"
                  >
                    Proceed to Payment
                  </Button>
                </form>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 shadow-lg sticky top-20">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => {
                    const product = products.get(item.productId);
                    if (!product) return null;
                    return (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {product.name} x{item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(product.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-orange-600 pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  if (currentStep === "payment") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-lg text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment</h1>
            <p className="text-gray-600 mb-8">
              Click below to complete your payment via M-Pesa. You will receive a prompt on your
              phone.
            </p>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Total Amount</p>
              <p className="text-4xl font-bold text-orange-600">{formatPrice(total)}</p>
            </div>

            <Button
              onClick={handleInitiatePayment}
              disabled={isProcessing}
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg mb-4"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay with M-Pesa"
              )}
            </Button>

            <Button
              onClick={() => setCurrentStep("shipping")}
              variant="outline"
              size="lg"
              className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shipping
            </Button>

            <div className="mt-8 text-left space-y-3 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">How M-Pesa Payment Works:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Click "Pay with M-Pesa" button</li>
                <li>You'll receive an M-Pesa prompt on your phone</li>
                <li>Enter your M-Pesa PIN to complete payment</li>
                <li>Receive confirmation and tracking details via email</li>
              </ol>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Confirmation Step
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Your order has been confirmed. You will receive tracking details via email shortly.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-2xl font-bold text-gray-800">{orderNumber}</p>
            <p className="text-sm text-gray-600 mt-4">Total Paid</p>
            <p className="text-2xl font-bold text-orange-600">{formatPrice(total)}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900">
              📧 A confirmation email with tracking details has been sent to{" "}
              <strong>{shippingForm.customerEmail}</strong>
            </p>
          </div>

          <Button
            onClick={() => setLocation("/")}
            size="lg"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg"
          >
            Back to Home
          </Button>
        </Card>
      </div>
    </div>
  );
}
