import { Card } from "@/components/ui/card";

export default function Policies() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Policies</h1>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
            <p className="text-gray-600">By using this website, you agree to our terms and conditions...</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <p className="text-gray-600">We respect your privacy and protect your personal data...</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
            <p className="text-gray-600">We offer 30-day returns on all products...</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
