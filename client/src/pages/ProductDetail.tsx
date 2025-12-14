import { useRoute, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatPrice, getCartSessionId } from "@/lib/cart";
import { Star, ShoppingCart, Heart, Share2, Copy, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug as string;
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: product, isLoading } = trpc.products.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const { data: reviews } = trpc.reviews.getByProduct.useQuery(
    { productId: product?.id! },
    { enabled: !!product?.id }
  );

  const { data: favoriteData } = trpc.favorites.check.useQuery(
    { productId: product?.id! },
    { enabled: !!product?.id }
  );

  const toggleFavoriteMutation = trpc.favorites.toggle.useMutation({
    onSuccess: (data) => {
      setIsFavorite(data.isFavorite);
      toast.success(data.isFavorite ? "Added to favorites" : "Removed from favorites");
    },
    onError: () => {
      toast.error("Failed to update favorite");
    },
  });

  const addToCartMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success(`Added ${quantity} ${product?.name} to cart`);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      setQuantity(1);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add to cart");
    },
  });

  useEffect(() => {
    if (favoriteData) {
      setIsFavorite(favoriteData.isFavorite);
    }
  }, [favoriteData]);

  const handleAddToCart = () => {
    if (product) {
      const sessionId = getCartSessionId();
      addToCartMutation.mutate({
        productId: product.id,
        quantity,
        sessionId,
      });
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      toggleFavoriteMutation.mutate({ productId: product.id });
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = product?.name || "Check this out";
    const shareText = `Check out ${product?.name} on Nuta!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or error occurred
      }
    }

    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out ${product?.name} on Nuta! ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareOnFacebook = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, "_blank");
  };

  const shareOnTwitter = () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out ${product?.name} on Nuta!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you are looking for does not exist.</p>
          <Link href="/products">
            <Button className="bg-orange-600 hover:bg-orange-700">Back to Products</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const averageRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/products">
          <Button variant="ghost" size="sm" className="mb-6 text-gray-600 hover:text-orange-600">
            ← Back to Products
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-white rounded-lg shadow-lg p-8">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full h-auto max-h-96 object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600 text-lg">{product.weight}</p>
            </div>

            {/* Rating */}
            {reviews && reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(Number(averageRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {averageRating} ({reviews.length} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Price</p>
              <p className="text-4xl font-bold text-orange-600">{formatPrice(product.price)}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-medium">Quantity:</label>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addToCartMutation.isPending}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleToggleFavorite}
                disabled={toggleFavoriteMutation.isPending}
                className={isFavorite ? "border-red-500 text-red-500" : ""}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`}
                />
              </Button>
              <div className="relative">
                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                    <button
                      onClick={copyToClipboard}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 border-b"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy link</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={shareOnWhatsApp}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 border-b"
                    >
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={shareOnFacebook}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 border-b"
                    >
                      <span>f</span>
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={shareOnTwitter}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span>𝕏</span>
                      <span>Twitter/X</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Checkout Button */}
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4"
              onClick={() => {
                if (product) {
                  // Navigate directly to checkout - items already in cart from Add to Cart button
                  setLocation("/checkout");
                }
              }}
              disabled={product.stock === 0}
            >
              🚀 Checkout Now
            </Button>

            {/* Trust Badges */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-600">
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
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
            <div className="grid gap-4">
              {reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{review.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
