import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, Loader2 } from "lucide-react";

export default function ProductCatalog() {
  const { data: products, isLoading } = trpc.products.list.useQuery({ limit: 50, offset: 0 });

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Our Products</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {products?.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-12 h-12" />}
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">{p.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{p.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">KES {(p.price / 100).toFixed(2)}</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
