import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../config/api'

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts({ featured: 'true' })
        setFeaturedProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        // Fallback mock data
        setFeaturedProducts([
          {
            id: 1,
            slug: 'creamy-peanut-butter',
            name: 'Creamy Peanut Butter',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop',
            rating: 4.8,
            reviews: 124
          },
          {
            id: 2,
            slug: 'crunchy-peanut-butter',
            name: 'Crunchy Peanut Butter',
            price: 13.99,
            image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400&h=400&fit=crop',
            rating: 4.9,
            reviews: 98
          },
          {
            id: 3,
            slug: 'roasted-peanuts',
            name: 'Premium Roasted Peanuts',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400&h=400&fit=crop',
            rating: 4.7,
            reviews: 156
          },
          {
            id: 4,
            slug: 'honey-peanut-butter',
            name: 'Honey Peanut Butter',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop',
            rating: 4.9,
            reviews: 87
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Add to cart function
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-accent/20 via-background to-secondary/20 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Premium Peanut Products for a{' '}
                <span className="text-primary">Healthier You</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover our range of natural, delicious peanut butter and roasted nuts. 
                Made with love, packed with nutrition.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Our Story
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop"
                alt="Nuta Peanut Butter"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our bestselling peanut products, crafted with premium ingredients and traditional methods.
            </p>
          </div>

          {loading ? (
            <div className="text-center col-span-full">Loading featured products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-shadow duration-300">
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
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
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
                      <Button size="icon" onClick={() => addToCart(product)}>
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop"
                alt="Nuta Story"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                At Nuta, we believe in the power of simple, natural ingredients. Our journey began with a passion 
                for creating the finest peanut products that not only taste amazing but also nourish your body.
              </p>
              <p className="text-muted-foreground mb-6">
                Every jar of Nuta peanut butter is crafted with care, using only premium peanuts and minimal 
                processing to preserve their natural goodness. We're committed to quality, sustainability, and 
                bringing you products you can trust.
              </p>
              <Link to="/about">
                <Button>Learn More About Us</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Natural Ingredients</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Customer Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
