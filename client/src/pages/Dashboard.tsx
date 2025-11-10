import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  if (!user) return <div className="text-center py-12">Please log in</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Welcome, {user.name}</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/dashboard/orders"><Button className="w-full">My Orders</Button></Link>
          <Link href="/dashboard/loyalty"><Button className="w-full">Loyalty Points</Button></Link>
          <Link href="/dashboard/affiliate"><Button className="w-full">Affiliate Program</Button></Link>
        </div>
      </div>
    </div>
  );
}
