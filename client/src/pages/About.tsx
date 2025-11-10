import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">About Nuta</h1>
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">Nuta was born from a simple vision: to bring authentic, high-quality peanut products to health-conscious consumers across Africa and beyond.</p>
          <p className="text-gray-600">Founded by Steve Have It, Nuta represents innovation, quality, and community impact.</p>
        </Card>
      </div>
    </div>
  );
}
