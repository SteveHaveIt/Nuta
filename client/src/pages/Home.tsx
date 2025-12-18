import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatPrice } from "@/lib/cart";
import { Star, Leaf, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = trpc.products.getFeatured.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-accent/10 py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Hero Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Pure Love in a Jar
                </h1>
                <p className="text-xl text-muted-foreground">
                  100% Natural Peanut Butter. No Preservatives. No Additives.
                </p>
              </div>

              <p className="text-lg text-muted-foreground max-w-lg">
                Nuta Peanut Butter is made from hand-roasted peanuts, blended with care. 
                Experience the natural flavor and richness of real nuts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">100% Natural</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium">Locally Made</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-96 md:h-full">
              <img
                src="/assets/33bc0d80-c034-11f0-b827-f91fa4ecc710(1).png"
                alt="Nuta Peanut Butter"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our range of natural peanut butter products, crafted with care and quality ingredients.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productsLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))
            ) : featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                      {/* Product Image */}
                      <div className="relative h-48 bg-secondary overflow-hidden">
                        <img
                          src={product.imageUrl || "/assets/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {product.shortDescription}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-primary text-primary"
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">(42 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>

                        {/* CTA Button */}
                        <Button className="w-full" size="sm">
                          View Details
                        </Button>
                      </div>
                    </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No products available</p>
              </div>
            )}
          </div>

          {/* View All Products */}
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Nuta Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Nuta?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Natural</h3>
              <p className="text-muted-foreground">
                Made from pure roasted peanuts with no preservatives or additives. Just real nuts, hand-roasted and blended with care.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Locally Made</h3>
              <p className="text-muted-foreground">
                Proudly made in Kenya by Steve Have It Enterprise Hub. Supporting local quality and craftsmanship.
              </p>
            </Card>

            <Card className="p-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Carefully sourced peanuts, hand-roasted to perfection. Every jar is a testament to our commitment to excellence.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50">
        <div className="container max-w-2xl">
          <NewsletterSignup />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Taste the Difference?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers who have made Nuta their favorite peanut butter.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary">
              Shop Nuta Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
