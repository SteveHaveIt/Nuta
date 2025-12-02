import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatPrice, getCartSessionId } from "@/lib/cart";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

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
  const [isLoading, setIsLoading] = useState(true);

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
  const { data: apiCartItems, refetch: refetchApiCart } = trpc.cart.get.useQuery({ sessionId });
  const createOrderMutation = trpc.orders.create.useMutation();
  const initiatePaymentMutation = trpc.payment.initiateSTKPush.useMutation();

  // Load cart items from both API and localStorage
  useEffect(() => {
    const mergedItems: CartItem[] = [];
    const itemMap = new Map<number, CartItem>();

    // First, add items from API (database cart)
    if (apiCartItems && apiCartItems.length > 0) {
      apiCartItems.forEach((item: any) => {
        const productId = item.cartItem.productId;
        const quantity = item.cartItem.quantity;
        itemMap.set(productId, { productId, quantity });
      });
    }

    // Then, add items from localStorage (fallback for legacy carts)
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

    // Convert map to array
    const mergedCartItems: CartItem[] = [];
    itemMap.forEach((item) => mergedCartItems.push(item));
    setCartItems(mergedCartItems);

    // Fetch product details
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

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing && !isLoading) {
      setLocation("/cart");
    }
  }, [cartItems, setLocation, isProcessing, isLoading]);

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
      !shippingForm.shippingAddress
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateShippingForm()) return;

    setIsProcessing(true);
    try {
      // Transform cart items to match API schema
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

      // Create order first
      const orderResponse = await createOrderMutation.mutateAsync({
        customerName: shippingForm.customerName,
        customerEmail: shippingForm.customerEmail,
        customerPhone: shippingForm.customerPhone,
        shippingAddress: shippingForm.shippingAddress,
        items: itemsForOrder,
        totalAmount: total,
        sessionId,
      });

      setOrderNumber(orderResponse.orderNumber);

      // Initiate payment
      const paymentResponse = await initiatePaymentMutation.mutateAsync({
        orderId: orderResponse.orderId,
        orderNumber: orderResponse.orderNumber,
        amount: total,
        phoneNumber: shippingForm.customerPhone,
      });

      if (paymentResponse.success) {
        setCurrentStep("payment");
        toast.success("Payment initiated! Check your phone for STK Push");

        // Clear cart after successful order
        const cart = JSON.parse(localStorage.getItem("cart") || "{}");
        cart[sessionId] = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartItems([]);

        // Move to confirmation after a delay
        setTimeout(() => {
          setCurrentStep("confirmation");
        }, 3000);
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
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
        {/* Header */}
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

        {/* Step Indicator */}
        <div className="flex gap-4 mb-8">
          <div
            className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold ${
              currentStep === "shipping"
                ? "bg-orange-600 text-white"
                : currentStep === "payment" || currentStep === "confirmation"
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
                : currentStep === "confirmation"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            2. Payment
          </div>
          <div
            className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold ${
              currentStep === "confirmation"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            3. Confirmation
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <Card className="p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={shippingForm.customerName}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={shippingForm.customerEmail}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={shippingForm.customerPhone}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="+254712345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Address *
                    </label>
                    <textarea
                      name="shippingAddress"
                      value={shippingForm.shippingAddress}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="123 Main Street"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingForm.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="Nairobi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingForm.postalCode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                        placeholder="00100"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    size="lg"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg mt-6"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === "payment" && (
              <Card className="p-8 shadow-lg text-center">
                <Loader2 className="w-16 h-16 animate-spin text-orange-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
                <p className="text-gray-600">
                  Please check your phone for the M-Pesa STK Push prompt...
                </p>
              </Card>
            )}

            {currentStep === "confirmation" && (
              <Card className="p-8 shadow-lg text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-4">
                  Your order has been placed successfully.
                </p>
                <p className="text-lg font-semibold text-orange-600 mb-6">
                  Order Number: {orderNumber}
                </p>
                <Button
                  onClick={() => setLocation("/")}
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg"
                >
                  Back to Home
                </Button>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => {
                  const product = products.get(item.productId);
                  if (!product) return null;

                  return (
                    <div key={item.productId} className="flex justify-between text-sm pb-4 border-b">
                      <div>
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {formatPrice(product.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 mb-6 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-4 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>100% Natural Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Fast Delivery Across Kenya</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Secure M-Pesa Payment</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
