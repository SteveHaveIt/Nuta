import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Loader2, ShoppingBag, Heart, Zap } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { data: products } = trpc.products.list.useQuery({ limit: 6, offset: 0 });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-white z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="w-8 h-8" />
            <span className="font-bold text-lg">{APP_TITLE}</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/products" className="text-sm hover:text-primary">Shop</Link>
            <Link href="/about" className="text-sm hover:text-primary">About</Link>
            <Link href="/blog" className="text-sm hover:text-primary">Blog</Link>
            <Link href="/support" className="text-sm hover:text-primary">Support</Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-sm hover:text-primary">Dashboard</Link>
                {user?.role === "admin" && (
                  <Link href="/admin" className="text-sm hover:text-primary">Admin</Link>
                )}
                <Button size="sm" variant="outline" onClick={logout}>Logout</Button>
              </>
            ) : (
              <Button size="sm" onClick={() => window.location.href = getLoginUrl()}>Login</Button>
            )}
            
            <Link href="/cart" className="relative">
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                The Taste of Real Kenyan Peanuts
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Healthy. Honest. Homegrown. Discover authentic peanut products from Steve Have It, crafted with care for your wellness.
              </p>
              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg">Shop Now</Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">Learn Our Story</Button>
                </Link>
              </div>
            </div>
            <div className="bg-amber-100 rounded-lg h-96 flex items-center justify-center">
              <img src={APP_LOGO} alt="Nuta Products" className="w-48 h-48" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Nuta</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h3 className="font-bold mb-2">100% Natural</h3>
              <p className="text-sm text-muted-foreground">No additives, no preservatives. Pure peanut goodness from Kenyan farms.</p>
            </Card>
            <Card className="p-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="font-bold mb-2">Protein-Rich</h3>
              <p className="text-sm text-muted-foreground">Perfect for fitness enthusiasts and health-conscious families.</p>
            </Card>
            <Card className="p-6 text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="font-bold mb-2">Easy Delivery</h3>
              <p className="text-sm text-muted-foreground">Fast, reliable shipping across Kenya with real-time tracking.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12">Featured Products</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products?.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">KES {(product.price / 100).toFixed(2)}</span>
                      <Button size="sm">View</Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Loyalty & Rewards */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Earn Rewards with Every Purchase</h2>
            <p className="text-lg mb-6">Join our loyalty program and earn points redeemable for discounts, spin the wheel for prizes, or become an affiliate and earn commissions.</p>
            {isAuthenticated ? (
              <Link href="/dashboard/loyalty">
                <Button size="lg" variant="secondary">View Your Rewards</Button>
              </Link>
            ) : (
              <Button size="lg" variant="secondary" onClick={() => window.location.href = getLoginUrl()}>
                Sign Up to Earn Rewards
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Nuta?</h2>
          <p className="text-lg text-muted-foreground mb-8">Start your journey to healthier eating today.</p>
          <Link href="/products">
            <Button size="lg">Shop Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About Nuta</h4>
              <p className="text-sm text-gray-400">Authentic Kenyan peanut products for health-conscious consumers worldwide.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products" className="hover:text-white">Products</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/support" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/policies" className="hover:text-white">Policies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Steve Have It Enterprise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
