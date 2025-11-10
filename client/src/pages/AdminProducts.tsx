import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AdminProducts() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  if (!user || user.role !== "admin") return <div className="text-center py-12">Access denied</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Products</h1>
          <Button>Add Product</Button>
        </div>
        <p className="text-gray-600">No products yet</p>
      </div>
    </div>
  );
}
