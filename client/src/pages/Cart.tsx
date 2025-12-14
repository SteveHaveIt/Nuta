import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatPrice, getCartSessionId } from "@/lib/cart";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface CartItem {
  productId: number;
  quantity: number;
  product?: any;
}

export default function Cart() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Map<number, any>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = getCartSessionId();
  const { data: allProducts } = trpc.products.getAll.useQuery();
  const { data: apiCartItems, refetch: refetchApiCart } = trpc.cart.get.useQuery({ sessionId });

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      refetchApiCart();
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [refetchApiCart]);

  // Load cart from both API and localStorage
  useEffect(() => {
    const mergedItems: CartItem[] = [];
    const itemMap = new Map<number, CartItem>();

    // First, add items from API (database cart)
    if (apiCartItems && apiCartItems.length > 0) {
      apiCartItems.forEach((item: any) => {
        const productId = item.cartItem.productId;
        const quantity = item.cartItem.quantity;
        itemMap.set(productId, { productId, quantity });
      });
    }

    // Then, add items from localStorage (fallback for legacy carts)
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "{}");
      const localItems = cart[sessionId] || [];
      localItems.forEach((item: CartItem) => {
        if (!itemMap.has(item.productId)) {
          itemMap.set(item.productId, item);
        }
      });
    } catch (error) {
      console.error("Error reading localStorage cart:", error);
    }

    // Convert map to array
    itemMap.forEach((item) => mergedItems.push(item));
    setCartItems(mergedItems);

    // Fetch product details
    if (allProducts && mergedItems.length > 0) {
      const productMap = new Map();
      mergedItems.forEach((item: CartItem) => {
        const product = allProducts.find((p) => p.id === item.productId);
        if (product) {
          productMap.set(item.productId, product);
        }
      });
      setProducts(productMap);
    }
    setIsLoading(false);
  }, [sessionId, allProducts, apiCartItems]);

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);

    // Update localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    cart[sessionId] = updatedCart;
    localStorage.setItem("cart", JSON.stringify(cart));
    
    toast.success("Cart updated");
  };

  const handleRemoveItem = (productId: number) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCart);

    // Update localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    cart[sessionId] = updatedCart;
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Dispatch event to update cart badge
    window.dispatchEvent(new CustomEvent("cartUpdated"));
    
    toast.success("Item removed from cart");
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.get(item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const subtotal = calculateTotal();
  const shippingCost = subtotal > 0 ? 50000 : 0; // 500 KES in cents
  const total = subtotal + shippingCost;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-orange-600 animate-bounce" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <ShoppingBag className="w-20 h-20 text-orange-300 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some delicious Nuta products to get started!</p>
        <Link href="/products">
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-lg">
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const product = products.get(item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={item.productId}
                      className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-600 cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-2">{product.weight}</p>
                        <p className="text-orange-600 font-semibold">
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.productId, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.productId, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="text-lg font-bold text-gray-800">
                            {formatPrice(product.price * item.quantity)}
                          </p>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={() => setLocation("/checkout")}
                size="lg"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg mb-3"
              >
                Proceed to Checkout
              </Button>

              <Button
                onClick={() => setLocation("/products")}
                variant="outline"
                size="lg"
                className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                Continue Shopping
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>100% Natural Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Fast Delivery Across Kenya</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Secure M-Pesa Payment</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
