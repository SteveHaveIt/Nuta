import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShoppingCart, Heart, Star, Minus, Plus, Check } from 'lucide-react'

function ProductDetailPage() {
  const { slug } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Mock data - would come from API based on slug
  const product = {
    name: 'Creamy Peanut Butter',
    price: 12.99,
    rating: 4.8,
    reviews: 124,
    inStock: true,
    stockCount: 45,
    images: [
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=600&h=600&fit=crop'
    ],
    description: 'Our signature creamy peanut butter is made from 100% premium roasted peanuts. Smooth, rich, and packed with natural protein and healthy fats. Perfect for spreading, baking, or eating straight from the jar!',
    features: [
      '100% Natural Ingredients',
      'No Added Sugar',
      'High in Protein',
      'Gluten-Free',
      'Vegan Friendly',
      'No Artificial Preservatives'
    ],
    nutrition: {
      servingSize: '2 tbsp (32g)',
      calories: 190,
      protein: '8g',
      fat: '16g',
      carbs: '7g',
      fiber: '2g'
    }
  }

  const reviews = [
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      date: 'March 15, 2025',
      comment: 'Absolutely love this peanut butter! The texture is perfect and the taste is incredible. Will definitely buy again!'
    },
    {
      id: 2,
      author: 'John D.',
      rating: 5,
      date: 'March 10, 2025',
      comment: 'Best peanut butter I\'ve ever had. Natural ingredients and great flavor. Highly recommend!'
    },
    {
      id: 3,
      author: 'Emily R.',
      rating: 4,
      date: 'March 5, 2025',
      comment: 'Really good quality. A bit pricey but worth it for the natural ingredients.'
    }
  ]

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-primary text-primary'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="text-4xl font-bold text-primary mb-6">
              ${product.price}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Key Features:</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <p className="text-sm text-green-600 font-medium">
                  In Stock ({product.stockCount} available)
                </p>
              ) : (
                <p className="text-sm text-destructive font-medium">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button size="lg" className="flex-1" disabled={!product.inStock}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl mb-1">🚚</div>
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🔒</div>
                <p className="text-xs text-muted-foreground">Secure Payment</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">↩️</div>
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Details and Reviews */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <p className="text-muted-foreground">
                    Our peanut butter is made using traditional methods, ensuring the highest quality and 
                    most authentic taste. We source only the finest peanuts and use minimal processing to 
                    preserve their natural goodness. No artificial ingredients, no preservatives – just 
                    pure, delicious peanut butter the way nature intended.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Nutrition Facts</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Serving Size</span>
                      <span>{product.nutrition.servingSize}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Calories</span>
                      <span>{product.nutrition.calories}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Protein</span>
                      <span>{product.nutrition.protein}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Total Fat</span>
                      <span>{product.nutrition.fat}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Carbohydrates</span>
                      <span>{product.nutrition.carbs}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium">Dietary Fiber</span>
                      <span>{product.nutrition.fiber}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{review.author}</h4>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-primary text-primary'
                                  : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
