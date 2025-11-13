import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingCart, Heart, Star, Filter } from 'lucide-react'

// Mock Cart Context
const useCart = () => {
  const [cartItems, setCartItems] = useState([])
  const addToCart = (product) => {
    setCartItems(prev => [...prev, product])
    alert(`${product.name} added to cart`)
  }
  return { cartItems, addToCart }
}

function ProductsPage() {
  const [sortBy, setSortBy] = useState('featured')
  const [category, setCategory] = useState('all')
  const [wishlist, setWishlist] = useState([]) // stores product ids in wishlist
  const { addToCart } = useCart()

  // Mock products
  const products = [
    { id: 1, slug: 'creamy-peanut-butter', name: 'Creamy Peanut Butter', category: 'butter', price: 12.99, image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop', rating: 4.8, reviews: 124, inStock: true },
    { id: 2, slug: 'crunchy-peanut-butter', name: 'Crunchy Peanut Butter', category: 'butter', price: 13.99, image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400&h=400&fit=crop', rating: 4.9, reviews: 98, inStock: true },
    { id: 3, slug: 'roasted-peanuts', name: 'Premium Roasted Peanuts', category: 'nuts', price: 8.99, image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=400&fit=crop', rating: 4.7, reviews: 156, inStock: true },
    { id: 4, slug: 'honey-peanut-butter', name: 'Honey Peanut Butter', category: 'butter', price: 14.99, image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop', rating: 4.9, reviews: 87, inStock: true },
    { id: 5, slug: 'salted-roasted-peanuts', name: 'Salted Roasted Peanuts', category: 'nuts', price: 9.99, image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=400&fit=crop', rating: 4.6, reviews: 203, inStock: true },
    { id: 6, slug: 'chocolate-peanut-butter', name: 'Chocolate Peanut Butter', category: 'butter', price: 15.99, image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400&h=400&fit=crop', rating: 4.8, reviews: 145, inStock: true }
  ]

  // Filter by category
  const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category)

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      default: return 0
    }
  })

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id])
  }

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover our full range of premium peanut products. All natural, all delicious.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="butter">Peanut Butter</SelectItem>
                <SelectItem value="nuts">Roasted Nuts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground flex items-center ml-auto">
            Showing {sortedProducts.length} products
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className={`absolute top-4 right-4 transition-opacity ${wishlist.includes(product.id) ? 'opacity-100 text-red-500' : 'opacity-0 group-hover:opacity-100'}`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  {product.inStock ? (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      In Stock
                    </div>
                  ) : (
                    <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                <CardDescription className="flex items-center mb-2">
                  <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground ml-1">({product.reviews})</span>
                </CardDescription>
                <p className="text-2xl font-bold text-primary">${product.price}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Link to={`/products/${product.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
                <Button
                  size="icon"
                  disabled={!product.inStock}
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
