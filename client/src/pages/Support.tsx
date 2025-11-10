import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Support() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Customer Support</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Subject" className="w-full border rounded px-3 py-2" />
              <textarea placeholder="Message" rows={5} className="w-full border rounded px-3 py-2"></textarea>
              <Button className="w-full">Submit Ticket</Button>
            </form>
          </Card>
          <div>
            <h2 className="text-2xl font-bold mb-4">FAQ</h2>
            <div className="space-y-4">
              <Card className="p-4">
                <p className="font-bold">How long does delivery take?</p>
                <p className="text-sm text-gray-600">2-3 business days within Nairobi</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
