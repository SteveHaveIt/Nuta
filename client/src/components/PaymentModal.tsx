import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  subtotal: number;
  shippingCost: number;
  orderNumber: string;
  onPaymentInitiate: (phoneNumber: string) => Promise<void>;
  isProcessing: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  total,
  subtotal,
  shippingCost,
  orderNumber,
  onPaymentInitiate,
  isProcessing,
}: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const formatPhoneNumber = (phone: string): string => {
    let formatted = phone.trim().replace(/\s/g, "");
    if (formatted.startsWith("0")) {
      formatted = "254" + formatted.substring(1);
    } else if (!formatted.startsWith("254")) {
      formatted = "254" + formatted;
    }
    return formatted;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const formatted = formatPhoneNumber(phone);
    return /^254\d{9}$/.test(formatted);
  };

  const handlePayment = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter your M-Pesa phone number");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Invalid phone number. Please enter a valid Kenyan number (e.g., 0742101089)");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      await onPaymentInitiate(formattedPhone);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">M-Pesa Payment</h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Order #{orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">KES {(subtotal / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">KES {(shippingCost / 100).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-gray-800">Total Amount:</span>
                <span className="text-xl font-bold text-orange-600">KES {(total / 100).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="tel"
                placeholder="0742101089 or 254742101089"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter your M-Pesa registered phone number. STK Push will be sent to this number.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-900">
              <strong>Instructions:</strong> After clicking "Pay", you'll receive a payment prompt on your phone. Enter your M-Pesa PIN to complete the payment.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isSubmitting || isProcessing}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting || isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Pay"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
