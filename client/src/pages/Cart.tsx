import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatPrice, getCartSessionId } from "@/lib/cart";
import { Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  productId: number;
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = getCartSessionId();

  // Load cart from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    const items = cart[sessionId] || [];
    setCartItems(items);

    // Fetch products for cart items
    if (items.length > 0) {
      const productIds = items.map((item: CartItem) => item.productId);
      // In a real app, you'd fetch these from the API
      // For now, we'll just set loading to false
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);

    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    cart[sessionId] = updatedCart;
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleRemoveItem = (productId: number) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);

    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    cart[sessionId] = updatedCart;
    localStorage.setItem('cart', JSON.stringify(cart));

    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    setCartItems([]);
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    cart[sessionId] = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success("Cart cleared");
  };

  // Calculate totals (placeholder - would need actual product prices)
  const subtotal = 0; // Would calculate from products
  const tax = Math.round(subtotal * 0.16); // 16% VAT
  const total = subtotal + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some delicious Nuta products to get started!
            </p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="border-b pb-6 last:border-0">
                    <div className="flex gap-4">
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 bg-secondary rounded-lg flex-shrink-0" />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Product Name</h3>
                        <p className="text-sm text-muted-foreground mb-4">Product SKU</p>

                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Qty:</span>
                          <div className="flex items-center border border-input rounded">
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-secondary"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                              className="w-10 text-center border-none outline-none"
                              min="1"
                            />
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-secondary"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="text-right">
                        <p className="text-lg font-semibold mb-4">KES 0.00</p>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleClearCart}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (16%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full mb-3" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/products">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
