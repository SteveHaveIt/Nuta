import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'

function BlogPostPage() {
  const { slug } = useParams()

  // Mock data - would come from API
  const post = {
    title: '10 Amazing Health Benefits of Peanut Butter',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&h=600&fit=crop',
    date: 'March 20, 2025',
    readTime: '5 min read',
    category: 'Health',
    author: 'Dr. Sarah Johnson',
    content: `
Peanut butter is more than just a delicious spread – it's a nutritional powerhouse that offers numerous health benefits. Whether you're an athlete, a busy professional, or simply someone who enjoys good food, understanding the benefits of peanut butter can help you make informed dietary choices.

## Rich in Protein

One of the most significant benefits of peanut butter is its high protein content. With approximately 8 grams of protein per 2-tablespoon serving, peanut butter is an excellent choice for muscle building and repair. This makes it particularly valuable for athletes and anyone engaged in regular physical activity.

## Heart-Healthy Fats

Despite its high fat content, peanut butter contains primarily unsaturated fats, which are beneficial for heart health. These healthy fats can help reduce bad cholesterol levels and lower the risk of heart disease when consumed as part of a balanced diet.

## Energy Boost

The combination of protein, healthy fats, and complex carbohydrates in peanut butter provides sustained energy throughout the day. This makes it an ideal choice for breakfast or as a pre-workout snack.

## Nutrient Dense

Peanut butter is packed with essential nutrients including:
- Vitamin E: A powerful antioxidant
- Magnesium: Important for bone health and energy production
- Potassium: Essential for heart health and blood pressure regulation
- B vitamins: Crucial for energy metabolism

## Weight Management

While peanut butter is calorie-dense, its protein and fiber content can help you feel fuller for longer, potentially aiding in weight management when consumed in moderation.

## Blood Sugar Control

The low glycemic index of peanut butter means it doesn't cause rapid spikes in blood sugar levels, making it a suitable option for people managing diabetes.

## Antioxidant Properties

Peanut butter contains resveratrol, the same antioxidant found in red wine, which has been linked to various health benefits including reduced inflammation and improved heart health.

## Brain Health

The healthy fats and vitamin E in peanut butter support brain health and may help protect against cognitive decline as we age.

## Versatility in Diet

From smoothies to sandwiches, peanut butter's versatility makes it easy to incorporate into various meals and snacks, helping you maintain a nutritious diet without sacrificing taste.

## Natural and Simple

When you choose natural peanut butter with minimal ingredients, you're getting a wholesome food that's free from artificial additives and excessive processing.

## Conclusion

Incorporating high-quality peanut butter into your diet can offer numerous health benefits. At Nuta, we're committed to providing you with the finest natural peanut butter that maximizes these benefits while delivering exceptional taste. Remember, moderation is key – enjoy peanut butter as part of a balanced, varied diet for optimal health.
    `
  }

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <article>
          <div className="mb-6">
            <div className="inline-block bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full mb-4">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <span>By {post.author}</span>
            </div>
          </div>

          <img
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />

          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              }
              if (paragraph.includes('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '))
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 mb-6">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                  {paragraph}
                </p>
              )
            })}
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Written by</p>
                <p className="font-semibold">{post.author}</p>
              </div>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Article
              </Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default BlogPostPage
