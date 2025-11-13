import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { trpc } from '../utils/trpc';

function BlogPostPage() {
  const { slug } = useParams();

  // Fetch post dynamically via tRPC
  const postQuery = trpc.blog.getPostBySlug.useQuery({ slug });
  const post = postQuery.data;

  if (postQuery.isLoading) {
    return (
      <div className="w-full py-12 text-center text-muted-foreground">
        Loading blog post...
      </div>
    );
  }

  if (postQuery.error) {
    return (
      <div className="w-full py-12 text-center text-red-500">
        Error loading post: {postQuery.error.message}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full py-12 text-center text-muted-foreground">
        Post not found.
      </div>
    );
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
                );
              }
              if (paragraph.includes('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 mb-6">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
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
  );
}

export default BlogPostPage;
