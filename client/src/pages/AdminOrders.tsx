import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AdminOrders() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  if (!user || user.role !== "admin") return <div className="text-center py-12">Access denied</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">All Orders</h1>
        <p className="text-gray-600">No orders yet</p>
      </div>
    </div>
  );
}
