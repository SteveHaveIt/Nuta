import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

function BlogPage() {
  const posts = [
    {
      id: 1,
      slug: 'health-benefits-peanut-butter',
      title: '10 Amazing Health Benefits of Peanut Butter',
      excerpt: 'Discover why peanut butter is more than just a delicious spread. From heart health to muscle building, learn about its incredible benefits.',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=400&fit=crop',
      date: 'March 20, 2025',
      readTime: '5 min read',
      category: 'Health'
    },
    {
      id: 2,
      slug: 'peanut-butter-recipes',
      title: '15 Creative Peanut Butter Recipes You Must Try',
      excerpt: 'From breakfast to dessert, explore innovative ways to incorporate peanut butter into your daily meals.',
      image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=600&h=400&fit=crop',
      date: 'March 18, 2025',
      readTime: '8 min read',
      category: 'Recipes'
    },
    {
      id: 3,
      slug: 'choosing-right-peanut-butter',
      title: 'How to Choose the Right Peanut Butter for Your Needs',
      excerpt: 'Not all peanut butter is created equal. Learn what to look for when selecting the perfect jar.',
      image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=600&h=400&fit=crop',
      date: 'March 15, 2025',
      readTime: '6 min read',
      category: 'Guide'
    },
    {
      id: 4,
      slug: 'peanut-farming-sustainability',
      title: 'Sustainable Peanut Farming: Our Commitment',
      excerpt: 'Learn about our sustainable farming practices and how we ensure quality while protecting the environment.',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop',
      date: 'March 12, 2025',
      readTime: '7 min read',
      category: 'Sustainability'
    }
  ]

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nuta Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover recipes, health tips, and stories about peanuts and healthy living.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link to={`/blog/${post.slug}`} className="w-full">
                  <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogPage
