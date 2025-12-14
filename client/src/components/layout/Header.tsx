import { Link } from "wouter";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { getCartSessionId } from "@/lib/cart";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localCartCount, setLocalCartCount] = useState(0);
  const sessionId = getCartSessionId();
  const { data: cartItems, refetch: refetchCart } = trpc.cart.get.useQuery({ sessionId });
  
  // Update cart count from localStorage
  const updateLocalCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "{}");
      const items = cart[sessionId] || [];
      const count = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setLocalCartCount(count);
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
    }
  };

  // Initialize local cart count on mount
  useEffect(() => {
    updateLocalCartCount();
  }, [sessionId]);

  // Listen for cart updates and refetch
  useEffect(() => {
    const handleCartUpdate = () => {
      refetchCart();
      updateLocalCartCount();
    };
    
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [refetchCart]);

  // Calculate cart count from API
  const apiCartCount = cartItems?.reduce((sum, item) => sum + item.cartItem.quantity, 0) || 0;
  
  // Use API cart if available, otherwise fall back to localStorage
  const cartItemCount = apiCartCount > 0 ? apiCartCount : localCartCount;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/production", label: "Our Process" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img
              src="/assets/file_00000000d8a461f6a74d818a1fdf51fe.png"
              alt="Steve Have It"
              className="h-10 w-auto"
            />
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all duration-200">
                {link.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* Cart and Mobile Menu Button */}
        <div className="flex items-center space-x-2">
          <Link href="/cart">
            <Button 
              size="icon" 
              className="relative bg-orange-600 hover:bg-orange-700 text-white rounded-full transition-all duration-200 hover:scale-110"
              title="View shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <nav className="container py-4 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
