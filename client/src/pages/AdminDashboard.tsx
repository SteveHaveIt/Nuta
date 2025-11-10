import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  if (!user || user.role !== "admin") return <div className="text-center py-12">Access denied</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg"><p className="text-2xl font-bold">0</p><p className="text-gray-600">Total Orders</p></div>
          <div className="bg-white p-6 rounded-lg"><p className="text-2xl font-bold">KES 0</p><p className="text-gray-600">Total Revenue</p></div>
          <div className="bg-white p-6 rounded-lg"><p className="text-2xl font-bold">0</p><p className="text-gray-600">Active Users</p></div>
        </div>
      </div>
    </div>
  );
}
