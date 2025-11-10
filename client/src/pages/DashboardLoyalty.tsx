import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function DashboardLoyalty() {
  const { data: points, isLoading } = trpc.loyalty.getPoints.useQuery();

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Loyalty Points</h1>
        {points && (
          <div className="bg-white p-6 rounded-lg">
            <p className="text-2xl font-bold">Current Points: {points.points}</p>
            <p className="text-gray-600">Redeemed: {points.redeemedPoints}</p>
            <p className="text-gray-600">Total Earned: {points.totalEarned}</p>
          </div>
        )}
      </div>
    </div>
  );
}
