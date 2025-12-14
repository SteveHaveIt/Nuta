import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { formatPrice, getCartSessionId } from "@/lib/cart";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { PaymentModal } from "@/components/PaymentModal";

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
  postalCode: string;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Map<number, any>>(new Map());
  const [currentStep, setCurrentStep] = useState<"shipping" | "payment" | "processing">("shipping");
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    postalCode: "",
  });

  const sessionId = getCartSessionId();
  const { data: allProducts } = trpc.products.getAll.useQuery();
  const { data: apiCartItems } = trpc.cart.get.useQuery({ sessionId });
  const createOrderMutation = trpc.orders.create.useMutation();
  const initiatePaymentMutation = trpc.payment.initiateSTKPush.useMutation();

  useEffect(() => {
    const mergedItems: CartItem[] = [];
    const itemMap = new Map<number, CartItem>();

    if (apiCartItems && apiCartItems.length > 0) {
      apiCartItems.forEach((item: any) => {
        const productId = item.cartItem.productId;
        const quantity = item.cartItem.quantity;
        itemMap.set(productId, { productId, quantity });
      });
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "{}");
      const localItems = cart[sessionId] || [];
      localItems.forEach((item: CartItem) => {
        if (!itemMap.has(item.productId)) {
          itemMap.set(item.productId, item);
        }
      });
    } catch (error) {
      console.error("Error reading localStorage cart:", error);
    }

    const mergedCartItems: CartItem[] = [];
    itemMap.forEach((item) => mergedCartItems.push(item));
    setCartItems(mergedCartItems);

    if (allProducts && mergedCartItems.length > 0) {
      const productMap = new Map();
      mergedCartItems.forEach((item: CartItem) => {
        const product = allProducts.find((p) => p.id === item.productId);
        if (product) {
          productMap.set(item.productId, product);
        }
      });
      setProducts(productMap);
    }

    setIsLoading(false);
  }, [sessionId, allProducts, apiCartItems]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.get(item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const subtotal = calculateTotal();
  const shippingCost = 50000;
  const total = subtotal + shippingCost;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateShippingForm = () => {
    if (!shippingForm.customerName.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!shippingForm.customerEmail.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!shippingForm.customerPhone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!shippingForm.shippingAddress.trim()) {
      toast.error("Please enter your shipping address");
      return false;
    }
    if (!shippingForm.postalCode.trim()) {
      toast.error("Please enter your postal code");
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (!validateShippingForm()) return;
    setCurrentStep("payment");
    setShowPaymentModal(true);
  };

  const handlePaymentInitiate = async (phoneNumber: string) => {
    setIsProcessing(true);
    try {
      console.log("Creating order...");

      const itemsForOrder = cartItems.map((item) => {
        const product = products.get(item.productId);
        return {
          productId: item.productId,
          productName: product?.name || "Unknown Product",
          quantity: item.quantity,
          price: product?.price || 0,
          productImage: product?.image,
        };
      });

      const orderResponse = await createOrderMutation.mutateAsync({
        customerName: shippingForm.customerName,
        customerEmail: shippingForm.customerEmail,
        customerPhone: shippingForm.customerPhone,
        shippingAddress: shippingForm.shippingAddress,
        items: itemsForOrder,
        totalAmount: total,
        sessionId,
      });

      console.log("Order created:", orderResponse);
      setOrderNumber(orderResponse.orderNumber);
      setTrackingId(`TRK-${orderResponse.orderId}`);

      console.log("Initiating STK Push with phone:", phoneNumber);
      // Convert from cents to KES (divide by 100) before sending to M-Pesa
      const amountInKES = Math.round(total / 100);
      console.log("Amount in cents:", total, "Amount in KES:", amountInKES);
      
      const paymentResponse = await initiatePaymentMutation.mutateAsync({
        orderId: orderResponse.orderId,
        orderNumber: orderResponse.orderNumber,
        amount: amountInKES,
        phoneNumber: phoneNumber,
      });

      console.log("Payment response:", paymentResponse);

      if (paymentResponse.success) {
        setCurrentStep("processing");
        setShowPaymentModal(false);
        toast.success("STK Push sent! Check your phone to complete payment.");

        // Set status to pending - will be updated by webhook when payment completes
        sessionStorage.setItem(
          "lastOrder",
          JSON.stringify({
            orderNumber: orderResponse.orderNumber,
            trackingId: `TRK-${orderResponse.orderId}`,
            total: total,
            items: itemsForOrder,
            shippingAddress: shippingForm.shippingAddress,
            customerEmail: shippingForm.customerEmail,
            customerPhone: shippingForm.customerPhone,
            status: "pending",
          })
        );

        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        cart[sessionId] = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));

        setTimeout(() => {
          setLocation("/order-confirmation");
        }, 3000);
      } else {
        toast.error(paymentResponse.message || "Failed to initiate payment");
        setShowPaymentModal(true);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Payment error:", error);
      toast.error(`Payment failed: ${errorMessage}`);
      setShowPaymentModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Please add items before checking out</p>
        <Button
          onClick={() => setLocation("/products")}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/cart")}
            className="text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="flex gap-4 mb-8">
          <div
            className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold ${
              currentStep === "shipping"
                ? "bg-orange-600 text-white"
                : currentStep === "payment" || currentStep === "processing"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            1. Shipping
          </div>
          <div
            className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold ${
              currentStep === "payment"
                ? "bg-orange-600 text-white"
                : currentStep === "processing"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            2. Payment
          </div>
          <div
            className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold ${
              currentStep === "processing" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3. Confirmation
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                      name="customerName"
                      value={shippingForm.customerName}
                      onChange={handleShippingChange}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input
                      name="customerEmail"
                      type="email"
                      value={shippingForm.customerEmail}
                      onChange={handleShippingChange}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input
                      name="customerPhone"
                      type="tel"
                      value={shippingForm.customerPhone}
                      onChange={handleShippingChange}
                      placeholder="0742101089"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
                    <textarea
                      name="shippingAddress"
                      value={shippingForm.shippingAddress}
                      onChange={handleShippingChange}
                      placeholder="123 Main Street, Apartment 4B"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <Input
                      name="postalCode"
                      value={shippingForm.postalCode}
                      onChange={handleShippingChange}
                      placeholder="00100"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleContinueToPayment}
                  size="lg"
                  className="w-full mt-8 bg-orange-600 hover:bg-orange-700"
                >
                  Continue to Payment
                </Button>
              </Card>
            )}

            {currentStep === "payment" && (
              <Card className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Ready for Payment?</h2>
                <p className="text-gray-600 mb-8">
                  Click the button below to enter your M-Pesa phone number and complete your payment.
                </p>
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Proceed to M-Pesa Payment
                </Button>
              </Card>
            )}

            {currentStep === "processing" && (
              <Card className="p-8 text-center">
                <div className="mb-6">
                  <Loader2 className="w-16 h-16 animate-spin text-orange-600 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
                <p className="text-gray-600 mb-4">
                  Please check your phone for the M-Pesa payment prompt. Enter your PIN to complete the transaction.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-900">
                    <strong>Order Number:</strong> #{orderNumber}
                  </p>
                  <p className="text-sm text-blue-900 mt-2">
                    <strong>Tracking ID:</strong> {trackingId}
                  </p>
                </div>
              </Card>
            )}
          </div>

          <div>
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => {
                  const product = products.get(item.productId);
                  return (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-800">{product?.name || "Product"}</p>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {formatPrice((product?.price || 0) * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t space-y-3 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-orange-600">{formatPrice(total)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        total={total}
        subtotal={subtotal}
        shippingCost={shippingCost}
        orderNumber={orderNumber}
        onPaymentInitiate={handlePaymentInitiate}
        isProcessing={isProcessing}
      />
    </div>
  );
}
