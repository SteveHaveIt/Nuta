import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatPrice } from "@/lib/cart";
import { Star, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("featured");

  const { data: allProducts, isLoading: allProductsLoading } = trpc.products.getAll.useQuery();
  const { data: categoryProducts, isLoading: categoryProductsLoading } = trpc.products.getByCategory.useQuery(
    { categoryId: selectedCategory! },
    { enabled: selectedCategory !== null }
  );
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery();

  const products = selectedCategory !== null ? categoryProducts : allProducts;
  const productsLoading = selectedCategory !== null ? categoryProductsLoading : allProductsLoading;

  const sortedProducts = products ? [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  }) : [];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-secondary/30 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-lg text-muted-foreground">
            Discover our range of natural peanut butter products
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Categories Filter */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === null
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      All Products
                    </button>
                    {categoriesLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))
                    ) : categories ? (
                      categories.map((category: any) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))
                    ) : null}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="font-semibold mb-4">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="p-4">
                      <Skeleton className="h-48 w-full mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </Card>
                  ))
                ) : sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`}>
                      <a className="group">
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                          {/* Product Image */}
                          <div className="relative h-48 bg-secondary overflow-hidden">
                            <img
                              src={product.imageUrl || "/assets/placeholder.png"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {product.compareAtPrice && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                Sale
                              </div>
                            )}
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
                              <span className="text-xs text-muted-foreground ml-1">(42)</span>
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

                            {/* Stock Status */}
                            <p className="text-xs text-muted-foreground mb-4">
                              {product.stock > 0 ? (
                                <span className="text-green-600 font-medium">In Stock</span>
                              ) : (
                                <span className="text-red-600 font-medium">Out of Stock</span>
                              )}
                            </p>

                            {/* CTA Button */}
                            <Button className="w-full" size="sm" disabled={product.stock === 0}>
                              {product.stock > 0 ? "View Details" : "Notify Me"}
                            </Button>
                          </div>
                        </Card>
                      </a>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
