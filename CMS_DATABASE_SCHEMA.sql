-- Nuta CMS Database Schema
-- Purpose: Blogs, Vlogs, Stories, Recipes, Health Tips, Community Content
-- Database: twmpnqbzrntjwammtxbw.supabase.co

-- ============================================
-- 1. USERS TABLE (for CMS)
-- ============================================
CREATE TABLE IF NOT EXISTS cms_users (
  id BIGSERIAL PRIMARY KEY,
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(320) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  role ENUM('admin', 'editor', 'contributor', 'community_user') DEFAULT 'community_user',
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ============================================
-- 2. BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt VARCHAR(1000),
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category VARCHAR(100),
  tags TEXT[], -- Array of tags
  status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  seo_keywords VARCHAR(255),
  reading_time_minutes INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT title_not_empty CHECK (LENGTH(title) > 0),
  CONSTRAINT content_not_empty CHECK (LENGTH(content) > 0)
);

-- ============================================
-- 3. VLOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vlogs (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL, -- YouTube, Vimeo, or custom video URL
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  category VARCHAR(100),
  tags TEXT[],
  status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  seo_keywords VARCHAR(255),
  transcript TEXT, -- Auto-generated from video
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. STORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stories (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[], -- Array of image URLs
  status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE, -- Stories can expire (24-48 hours)
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. RECIPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS recipes (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  ingredients TEXT NOT NULL, -- JSON array of ingredients
  instructions TEXT NOT NULL, -- JSON array of steps
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,
  difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  cuisine_type VARCHAR(100),
  dietary_info TEXT[], -- vegan, gluten-free, dairy-free, etc.
  nutrition_info JSONB, -- calories, protein, carbs, fat, etc.
  image_url TEXT,
  featured_image_url TEXT,
  tags TEXT[],
  status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  seo_keywords VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. HEALTH TIPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS health_tips (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100), -- nutrition, fitness, mental-health, wellness
  difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  image_url TEXT,
  featured_image_url TEXT,
  tags TEXT[],
  status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  seo_keywords VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. COMMUNITY STORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS community_stories (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[],
  category VARCHAR(100), -- transformation, testimonial, journey, tips
  tags TEXT[],
  status ENUM('pending', 'approved', 'rejected', 'published', 'archived') DEFAULT 'pending',
  moderation_notes TEXT,
  moderated_by BIGINT REFERENCES cms_users(id),
  moderated_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- blog, vlog, story, recipe, health_tip, community_story
  content_id BIGINT NOT NULL,
  parent_comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'spam') DEFAULT 'pending',
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 9. LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS likes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- blog, vlog, story, recipe, health_tip, community_story, comment
  content_id BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- ============================================
-- 10. SHARES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shares (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES cms_users(id) ON DELETE SET NULL,
  content_type VARCHAR(50) NOT NULL,
  content_id BIGINT NOT NULL,
  platform VARCHAR(50), -- facebook, twitter, whatsapp, email, etc.
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 11. ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS content_analytics (
  id BIGSERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,
  content_id BIGINT NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  avg_time_on_page_seconds INTEGER,
  bounce_rate DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_type, content_id, date)
);

-- ============================================
-- 12. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  color_code VARCHAR(7),
  content_type VARCHAR(50), -- blog, recipe, health_tip, etc.
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 13. TAGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 14. CONTENT_TAGS JUNCTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS content_tags (
  id BIGSERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,
  content_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(content_type, content_id, tag_id)
);

-- ============================================
-- 15. NEWSLETTER SUBSCRIPTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(320) UNIQUE NOT NULL,
  name VARCHAR(255),
  categories TEXT[], -- blog, recipe, health_tips, etc.
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verified_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 16. CONTENT SCHEDULE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS content_schedule (
  id BIGSERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,
  content_id BIGINT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status ENUM('pending', 'published', 'failed') DEFAULT 'pending',
  created_by BIGINT REFERENCES cms_users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 17. MODERATION QUEUE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS moderation_queue (
  id BIGSERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,
  content_id BIGINT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reason_for_rejection TEXT,
  assigned_to BIGINT REFERENCES cms_users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 18. TELEGRAM BOT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS telegram_bot_logs (
  id BIGSERIAL PRIMARY KEY,
  telegram_user_id BIGINT NOT NULL,
  telegram_username VARCHAR(255),
  command VARCHAR(100),
  content_type VARCHAR(50),
  content_id BIGINT,
  action VARCHAR(100), -- publish, schedule, delete, edit
  status VARCHAR(50), -- success, failed
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Blog Posts Indexes
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured);

-- Vlogs Indexes
CREATE INDEX idx_vlogs_author_id ON vlogs(author_id);
CREATE INDEX idx_vlogs_slug ON vlogs(slug);
CREATE INDEX idx_vlogs_status ON vlogs(status);
CREATE INDEX idx_vlogs_published_at ON vlogs(published_at DESC);
CREATE INDEX idx_vlogs_category ON vlogs(category);

-- Stories Indexes
CREATE INDEX idx_stories_author_id ON stories(author_id);
CREATE INDEX idx_stories_slug ON stories(slug);
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_published_at ON stories(published_at DESC);

-- Recipes Indexes
CREATE INDEX idx_recipes_author_id ON recipes(author_id);
CREATE INDEX idx_recipes_slug ON recipes(slug);
CREATE INDEX idx_recipes_status ON recipes(status);
CREATE INDEX idx_recipes_published_at ON recipes(published_at DESC);
CREATE INDEX idx_recipes_difficulty_level ON recipes(difficulty_level);

-- Health Tips Indexes
CREATE INDEX idx_health_tips_author_id ON health_tips(author_id);
CREATE INDEX idx_health_tips_slug ON health_tips(slug);
CREATE INDEX idx_health_tips_status ON health_tips(status);
CREATE INDEX idx_health_tips_published_at ON health_tips(published_at DESC);
CREATE INDEX idx_health_tips_category ON health_tips(category);

-- Community Stories Indexes
CREATE INDEX idx_community_stories_author_id ON community_stories(author_id);
CREATE INDEX idx_community_stories_slug ON community_stories(slug);
CREATE INDEX idx_community_stories_status ON community_stories(status);
CREATE INDEX idx_community_stories_published_at ON community_stories(published_at DESC);

-- Comments Indexes
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_content_type_id ON comments(content_type, content_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);

-- Likes Indexes
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_content_type_id ON likes(content_type, content_id);

-- Analytics Indexes
CREATE INDEX idx_analytics_content_type_id ON content_analytics(content_type, content_id);
CREATE INDEX idx_analytics_date ON content_analytics(date);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Top Blog Posts
CREATE OR REPLACE VIEW top_blog_posts AS
SELECT 
  id, title, slug, author_id, view_count, like_count, published_at,
  ROW_NUMBER() OVER (ORDER BY view_count DESC) as rank
FROM blog_posts
WHERE status = 'published'
AND published_at <= NOW()
LIMIT 100;

-- View: Trending Content
CREATE OR REPLACE VIEW trending_content AS
SELECT 
  'blog' as content_type,
  id,
  title,
  slug,
  view_count,
  like_count,
  published_at
FROM blog_posts
WHERE status = 'published'
AND published_at > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 
  'recipe' as content_type,
  id,
  title,
  slug,
  view_count,
  like_count,
  published_at
FROM recipes
WHERE status = 'published'
AND published_at > NOW() - INTERVAL '7 days'
UNION ALL
SELECT 
  'vlog' as content_type,
  id,
  title,
  slug,
  view_count,
  like_count,
  published_at
FROM vlogs
WHERE status = 'published'
AND published_at > NOW() - INTERVAL '7 days'
ORDER BY view_count DESC;

-- ============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================

-- Update blog post updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at_trigger
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_posts_updated_at();

-- Similar triggers for other tables...
CREATE OR REPLACE FUNCTION update_recipes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipes_updated_at_trigger
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE FUNCTION update_recipes_updated_at();

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert sample categories
INSERT INTO categories (name, slug, description, color_code, content_type) VALUES
('Nutrition', 'nutrition', 'Articles about nutrition and diet', '#FF6B6B', 'blog'),
('Fitness', 'fitness', 'Fitness tips and workout guides', '#4ECDC4', 'blog'),
('Wellness', 'wellness', 'General wellness and lifestyle', '#45B7D1', 'blog'),
('Recipes', 'recipes', 'Delicious peanut butter recipes', '#FFA07A', 'recipe'),
('Health Tips', 'health-tips', 'Quick health and wellness tips', '#98D8C8', 'health_tip'),
('Community', 'community', 'Community stories and testimonials', '#F7DC6F', 'community_story')
ON CONFLICT DO NOTHING;

-- ============================================
-- PERMISSIONS (Row Level Security)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vlogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_queue ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view published content
CREATE POLICY "Users can view published content" ON blog_posts
FOR SELECT USING (status = 'published' OR auth.uid()::text = author_id::text);

-- Policy: Users can create comments on published content
CREATE POLICY "Users can create comments" ON comments
FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

-- Policy: Admins can moderate community stories
CREATE POLICY "Admins can moderate" ON moderation_queue
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cms_users 
    WHERE cms_users.auth_id = auth.uid() 
    AND cms_users.role IN ('admin', 'editor')
  )
);

-- ============================================
-- END OF SCHEMA
-- ============================================
