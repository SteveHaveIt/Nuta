import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Loader2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';
// Auth hook will be imported from existing auth context

const supabaseUrl = import.meta.env.VITE_SUPABASE_CMS_URL || 'https://twmpnqbzrntjwammtxbw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_CMS_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3bXBucWJ6cm50andhbW10eGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDgxMjksImV4cCI6MjA4MDMyNDEyOX0.nJuEQIbvE45lR89x1XzPQfbd2lOK81Kx6KrIrs8kYs0';

const cmsSupabase = createClient(supabaseUrl, supabaseAnonKey);

interface CommunityStory {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_urls: string[];
  category: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected' | 'published';
  author_id: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_featured: boolean;
  published_at: string;
  created_at: string;
}

interface Author {
  id: number;
  full_name: string;
  avatar_url: string;
}

const Community: React.FC = () => {

  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [authors, setAuthors] = useState<Map<number, Author>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'testimonial',
  });
  useEffect(() => {
    document.title = 'Nuta Community - Share Your Story';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Join the Nuta community and share your transformation story, testimonials, and health journey with others.');
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data: storiesData, error: storiesError } = await cmsSupabase
        .from('community_stories')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (storiesError) throw storiesError;
      setStories(storiesData || []);

      // Fetch authors
      const authorIds = Array.from(new Set((storiesData || []).map((s: CommunityStory) => s.author_id)));
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
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // For now, use a placeholder user ID
      // In production, this would be connected to the actual auth system
      const userId = 1; // Placeholder

      // Submit story
      const { error: submitError } = await cmsSupabase
        .from('community_stories')
        .insert({
          author_id: userId || 1,
          title: formData.title,
          slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
          content: formData.content,
          category: formData.category,
          status: 'pending',
        });

      if (submitError) throw submitError;

      alert('Story submitted! It will be reviewed and published soon.');
      setFormData({ title: '', content: '', category: 'testimonial' });
      setShowSubmitForm(false);
      fetchStories();
    } catch (error) {
      console.error('Error submitting story:', error);
      alert('Error submitting story. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuta Community</h1>
          <p className="text-xl text-rose-100 mb-8">
            Share your transformation story and inspire others in the Nuta community
          </p>

          <Button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="bg-white text-rose-600 hover:bg-rose-50"
          >
            <Plus size={20} className="mr-2" />
            Share Your Story
          </Button>
        </div>
      </section>

      {/* Submit Form */}
      {showSubmitForm && (
        <section className="bg-white border-b py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Share Your Story</h2>
            <form onSubmit={handleSubmitStory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="My transformation journey..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="testimonial">Testimonial</option>
                  <option value="transformation">Transformation</option>
                  <option value="journey">Journey</option>
                  <option value="tips">Tips & Advice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Story
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 h-48"
                  placeholder="Tell us your story..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                  Submit Story
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubmitForm(false)}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-sm text-gray-600">
                ℹ️ Your story will be reviewed by our moderation team before being published.
              </p>
            </form>
          </div>
        </section>
      )}

      {/* Stories Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="animate-spin text-rose-500" size={40} />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No stories yet. Be the first to share!</p>
            <p className="text-sm text-gray-600">Click "Share Your Story" to submit your story.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(story => {
              const author = authors.get(story.author_id);
              return (
                <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Featured Image */}
                  {story.image_urls && story.image_urls.length > 0 && (
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img
                        src={story.image_urls[0]}
                        alt={story.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      {story.is_featured && (
                        <Badge className="absolute top-4 left-4 bg-rose-600">Featured</Badge>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {author?.avatar_url && (
                        <img
                          src={author.avatar_url}
                          alt={author.full_name}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {author?.full_name || 'Community Member'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(story.published_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {story.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {story.content}
                    </p>

                    <Badge variant="secondary" className="mb-4 capitalize">
                      {story.category}
                    </Badge>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart size={16} />
                          {story.like_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          {story.comment_count}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Nuta Community Stories',
          description: 'Community stories and testimonials from Nuta users',
          url: `${window.location.origin}/community`,
        })}
      </script>
    </div>
  );
};

export default Community;
