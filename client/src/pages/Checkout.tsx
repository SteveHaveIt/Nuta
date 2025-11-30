import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { formatPrice } from "@/lib/cart";
import { toast } from "sonner";

export default function Checkout() {
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Here you would integrate with Lipana API for M-Pesa payment
      // For now, we'll just show a success message
      toast.success("Order placed successfully!");
      // Redirect to order confirmation
      // navigate("/order-confirmation");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = 0; // Would calculate from cart
  const tax = 0;
  const shipping = 500; // KES 5.00
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-12">
          <div className={`flex items-center justify-center h-10 w-10 rounded-full ${step === "shipping" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            1
          </div>
          <div className="flex-1 h-1 bg-secondary" />
          <div className={`flex items-center justify-center h-10 w-10 rounded-full ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            2
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {step === "shipping" ? (
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254712345678"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Nairobi"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Postal Code</label>
                      <Input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="00100"
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </Card>
            ) : (
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="border-2 border-primary rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="payment" value="mpesa" defaultChecked />
                      <span className="font-medium">M-Pesa (Lipana)</span>
                    </label>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      You will be prompted to enter your M-Pesa PIN to complete the payment.
                      A prompt will appear on your phone.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Billing Address</h3>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Same as shipping address</span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Order Terms</h3>
                    <label className="flex items-start gap-2">
                      <input type="checkbox" required className="mt-1" />
                      <span className="text-sm">
                        I agree to the terms and conditions and privacy policy
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep("shipping")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Complete Order"}
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Link href="/cart">
                <Button variant="outline" className="w-full">
                  Edit Cart
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
