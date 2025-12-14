import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Calendar, User, Eye, Heart, MessageCircle, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for CMS database
const supabaseUrl = import.meta.env.VITE_SUPABASE_CMS_URL || 'https://twmpnqbzrntjwammtxbw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_CMS_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3bXBucWJ6cm50andhbW10eGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDgxMjksImV4cCI6MjA4MDMyNDEyOX0.nJuEQIbvE45lR89x1XzPQfbd2lOK81Kx6KrIrs8kYs0';

const cmsSupabase = createClient(supabaseUrl, supabaseAnonKey);

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  category: string;
  tags: string[];
  author_id: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  reading_time_minutes: number;
  published_at: string;
  created_at: string;
}

interface Author {
  id: number;
  full_name: string;
  avatar_url: string;
}

const Blog: React.FC = () => {
  const [, setLocation] = useLocation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<Map<number, Author>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Set page meta tags for SEO
    document.title = 'Nuta Blog - Health, Nutrition & Wellness Tips';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read expert articles about nutrition, fitness, wellness, and peanut butter recipes. Join the Nuta community for health tips and lifestyle insights.');
    }

    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);

      // Fetch published blog posts
      const { data: postsData, error: postsError } = await cmsSupabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (postsError) throw postsError;

      setPosts(postsData || []);
      setFilteredPosts(postsData || []);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set((postsData || []).map((p: BlogPost) => p.category).filter(Boolean)));
      setCategories(uniqueCategories as string[]);

      // Fetch authors
      const authorIds = Array.from(new Set((postsData || []).map((p: BlogPost) => p.author_id)));
      const { data: authorsData, error: authorsError } = await cmsSupabase
        .from('cms_users')
        .select('id, full_name, avatar_url')
        .in('id', authorIds);

      if (authorsError) throw authorsError;

      const authorsMap = new Map<number, Author>();
      (authorsData || []).forEach((author: any) => {
        authorsMap.set(author.id, author);
      });
      setAuthors(authorsMap);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  const handleReadMore = (slug: string) => {
    setLocation(`/blog/${slug}`);
  };

  const handleShare = (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    const text = `Check out: ${post.title}`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: url,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuta Blog</h1>
          <p className="text-xl text-orange-100 mb-8">
            Discover health tips, nutrition advice, and delicious peanut butter recipes
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3 text-orange-200" size={20} />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-gray-900 rounded-lg w-full md:w-96"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Articles ({posts.length})
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category} ({posts.filter(p => p.category === category).length})
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          {/* Blog Posts Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="animate-spin text-orange-500" size={40} />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map(post => {
                  const author = authors.get(post.author_id);
                  return (
                    <Card
                      key={post.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleReadMore(post.slug)}
                    >
                      {/* Featured Image */}
                      {post.featured_image_url && (
                        <div className="relative h-48 overflow-hidden bg-gray-200">
                          <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                          {post.category && (
                            <Badge className="absolute top-4 left-4 bg-orange-500">
                              {post.category}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                          {author && (
                            <div className="flex items-center gap-2">
                              {author.avatar_url && (
                                <img
                                  src={author.avatar_url}
                                  alt={author.full_name}
                                  className="w-6 h-6 rounded-full"
                                />
                              )}
                              <span>{author.full_name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            {new Date(post.published_at).toLocaleDateString()}
                          </div>
                          {post.reading_time_minutes && (
                            <span>{post.reading_time_minutes} min read</span>
                          )}
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Stats & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye size={16} />
                              {post.view_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart size={16} />
                              {post.like_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle size={16} />
                              {post.comment_count}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(post);
                            }}
                          >
                            <Share2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Schema.org Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Nuta Blog',
          description: 'Health, nutrition, and wellness tips from Nuta',
          url: `${window.location.origin}/blog`,
          blogPost: filteredPosts.map(post => ({
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.featured_image_url,
            datePublished: post.published_at,
            author: {
              '@type': 'Person',
              name: authors.get(post.author_id)?.full_name || 'Nuta Team',
            },
          })),
        })}
      </script>
    </div>
  );
};

export default Blog;
