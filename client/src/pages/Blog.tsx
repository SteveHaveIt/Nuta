import { Card } from "@/components/ui/card";

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-2">Health Benefits of Peanuts</h3>
            <p className="text-gray-600 mb-4">Discover why peanuts are a superfood...</p>
            <a href="#" className="text-primary hover:underline">Read More</a>
          </Card>
        </div>
      </div>
    </div>
  );
}
