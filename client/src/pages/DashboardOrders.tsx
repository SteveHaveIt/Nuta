import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function DashboardOrders() {
  const { data: orders, isLoading } = trpc.orders.myOrders.useQuery();

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-lg">
                <p className="font-bold">{order.orderNumber}</p>
                <p className="text-sm text-gray-600">Status: {order.status}</p>
                <p className="text-sm text-gray-600">Amount: KES {(order.totalAmount / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No orders yet</p>
        )}
      </div>
    </div>
  );
}
