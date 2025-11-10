import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
              <form className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full border rounded px-3 py-2" />
                <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2" />
                <input type="tel" placeholder="Phone" className="w-full border rounded px-3 py-2" />
                <input type="text" placeholder="Address" className="w-full border rounded px-3 py-2" />
                <input type="text" placeholder="City" className="w-full border rounded px-3 py-2" />
                <Button className="w-full">Continue to Payment</Button>
              </form>
            </Card>
          </div>
          <div>
            <Card className="p-6">
              <h3 className="font-bold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>KES 0.00</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>KES 0.00</span></div>
                <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>KES 0.00</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
