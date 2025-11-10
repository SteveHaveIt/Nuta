import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function DashboardAffiliate() {
  const { data: affiliate, isLoading } = trpc.affiliates.getStatus.useQuery();
  const registerMutation = trpc.affiliates.register.useMutation();

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Affiliate Program</h1>
        {affiliate ? (
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg font-bold">Referral Code: {affiliate.referralCode}</p>
            <p className="text-gray-600">Status: {affiliate.status}</p>
            <p className="text-gray-600">Total Earnings: KES {(affiliate.totalEarnings / 100).toFixed(2)}</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">Join our affiliate program and earn 5% commission on every referral!</p>
            <Button onClick={() => registerMutation.mutate()}>Register as Affiliate</Button>
          </div>
        )}
      </div>
    </div>
  );
}
