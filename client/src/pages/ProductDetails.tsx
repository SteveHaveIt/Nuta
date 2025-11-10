import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, ShoppingBag } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: parseInt(id || "0") });

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" /> : <ShoppingBag className="w-24 h-24" />}
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-primary mb-6">KES {(product.price / 100).toFixed(2)}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <p className="text-sm text-gray-500 mb-6">Stock: {product.quantity} units available</p>
            <Button size="lg" className="w-full">Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
