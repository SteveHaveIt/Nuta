import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Cart() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">Your cart is empty</p>
          <Link href="/products"><Button>Continue Shopping</Button></Link>
        </div>
      </div>
    </div>
  );
}
