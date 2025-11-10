import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function OrderTracking() {
  const { orderPin } = useParams<{ orderPin: string }>();
  const { data: order, isLoading } = trpc.orders.trackByPin.useQuery({ orderPin: orderPin || "" });

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Track Your Order</h1>
        <div className="bg-white p-6 rounded-lg">
          <p className="font-bold text-lg">{order.orderNumber}</p>
          <p className="text-gray-600">Status: {order.status}</p>
          <p className="text-gray-600">Amount: KES {(order.totalAmount / 100).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
