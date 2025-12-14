import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Clock, Users, ChefHat, Heart, MessageCircle, Share2, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_CMS_URL || 'https://twmpnqbzrntjwammtxbw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_CMS_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3bXBucWJ6cm50andhbW10eGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDgxMjksImV4cCI6MjA4MDMyNDEyOX0.nJuEQIbvE45lR89x1XzPQfbd2lOK81Kx6KrIrs8kYs0';

const cmsSupabase = createClient(supabaseUrl, supabaseAnonKey);

interface Recipe {
  id: number;
  title: string;
  slug: string;
  description: string;
  ingredients: string;
  instructions: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  cuisine_type: string;
  dietary_info: string[];
  nutrition_info: any;
  featured_image_url: string;
  tags: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string;
}

const Recipes: React.FC = () => {
  const [, setLocation] = useLocation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Nuta Recipes - Delicious Peanut Butter Recipes';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover delicious and nutritious peanut butter recipes. From smoothies to desserts, find the perfect recipe for your lifestyle.');
    }

    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await cmsSupabase
        .from('recipes')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
      setFilteredRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = recipes;

    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty_level === selectedDifficulty);
    }

    if (selectedDietary) {
      filtered = filtered.filter(recipe =>
        recipe.dietary_info && recipe.dietary_info.includes(selectedDietary)
      );
    }

    setFilteredRecipes(filtered);
  }, [searchQuery, selectedDifficulty, selectedDietary, recipes]);

  const handleViewRecipe = (slug: string) => {
    setLocation(`/recipes/${slug}`);
  };

  const totalTime = (recipe: Recipe) => recipe.prep_time_minutes + recipe.cook_time_minutes;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuta Recipes</h1>
          <p className="text-xl text-amber-100 mb-8">
            Discover delicious peanut butter recipes for every occasion
          </p>

          <div className="relative">
            <Search className="absolute left-4 top-3 text-amber-200" size={20} />
            <Input
              type="text"
              placeholder="Search recipes..."
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
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter size={20} /> Filters
                </h3>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Difficulty</h4>
                <div className="space-y-2">
                  {['easy', 'medium', 'hard'].map(level => (
                    <Button
                      key={level}
                      variant={selectedDifficulty === level ? 'default' : 'outline'}
                      className="w-full justify-start capitalize"
                      onClick={() => setSelectedDifficulty(selectedDifficulty === level ? null : level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Dietary Filter */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Dietary</h4>
                <div className="space-y-2">
                  {['vegan', 'gluten-free', 'dairy-free', 'keto'].map(diet => (
                    <Button
                      key={diet}
                      variant={selectedDietary === diet ? 'default' : 'outline'}
                      className="w-full justify-start capitalize"
                      onClick={() => setSelectedDietary(selectedDietary === diet ? null : diet)}
                    >
                      {diet}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedDifficulty(null);
                  setSelectedDietary(null);
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </aside>

          {/* Recipes Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="animate-spin text-amber-600" size={40} />
              </div>
            ) : filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No recipes found. Try different filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecipes.map(recipe => (
                  <Card
                    key={recipe.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewRecipe(recipe.slug)}
                  >
                    {/* Recipe Image */}
                    {recipe.featured_image_url && (
                      <div className="relative h-48 overflow-hidden bg-gray-200">
                        <img
                          src={recipe.featured_image_url}
                          alt={recipe.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                        <Badge className="absolute top-4 left-4 bg-amber-600 capitalize">
                          {recipe.difficulty_level}
                        </Badge>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {recipe.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {recipe.description}
                      </p>

                      {/* Quick Info */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
                        <div>
                          <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                            <Clock size={16} />
                          </div>
                          <span className="font-semibold">{totalTime(recipe)}m</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                            <Users size={16} />
                          </div>
                          <span className="font-semibold">{recipe.servings}</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                            <ChefHat size={16} />
                          </div>
                          <span className="font-semibold">{recipe.cuisine_type}</span>
                        </div>
                      </div>

                      {/* Dietary Tags */}
                      {recipe.dietary_info && recipe.dietary_info.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {recipe.dietary_info.slice(0, 2).map(diet => (
                            <Badge key={diet} variant="secondary" className="text-xs capitalize">
                              {diet}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Heart size={16} />
                            {recipe.like_count}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={16} />
                            {recipe.comment_count}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Nuta Recipes',
          description: 'Delicious peanut butter recipes',
          url: `${window.location.origin}/recipes`,
          mainEntity: filteredRecipes.map(recipe => ({
            '@type': 'Recipe',
            name: recipe.title,
            description: recipe.description,
            image: recipe.featured_image_url,
            prepTime: `PT${recipe.prep_time_minutes}M`,
            cookTime: `PT${recipe.cook_time_minutes}M`,
            totalTime: `PT${totalTime(recipe)}M`,
            recipeYield: `${recipe.servings} servings`,
            recipeCategory: recipe.cuisine_type,
            recipeCuisine: 'International',
          })),
        })}
      </script>
    </div>
  );
};

export default Recipes;
