-- ========================================================
-- JULI CLUB LUCKNOW CMS - SUPABASE PRODUCTION MIGRATION
-- ========================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HOMEPAGE CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.homepage_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LOCATION PAGES TABLE
CREATE TABLE IF NOT EXISTS public.locations (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  display_order INT DEFAULT 0,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REDIRECTS TABLE
CREATE TABLE IF NOT EXISTS public.redirects (
  id TEXT PRIMARY KEY,
  from_path TEXT NOT NULL,
  to_path TEXT NOT NULL,
  type INT DEFAULT 301,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MEDIA LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.media_library (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  size TEXT,
  type TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  user_email TEXT,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  details JSONB
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- PUBLIC READ POLICIES (WEBSITE FRONTEND)
-- --------------------------------------------------------
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Homepage" ON public.homepage_config FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public Read Redirects" ON public.redirects FOR SELECT USING (true);
CREATE POLICY "Public Read Media" ON public.media_library FOR SELECT USING (true);
CREATE POLICY "Public Read Logs" ON public.activity_logs FOR SELECT USING (true);

-- --------------------------------------------------------
-- AUTHENTICATED ADMIN WRITE POLICIES (INSERT, UPDATE, DELETE)
-- --------------------------------------------------------
CREATE POLICY "Admin Write Settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Homepage" ON public.homepage_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Locations" ON public.locations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Blogs" ON public.blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Reviews" ON public.reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write FAQs" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Redirects" ON public.redirects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Media" ON public.media_library FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Logs" ON public.activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========================================================
-- STORAGE BUCKETS CONFIGURATION FOR MEDIA UPLOADS
-- ========================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('cms_media', 'cms_media', true)
ON CONFLICT (id) DO NOTHING;

-- Public Read Access for Media Files
CREATE POLICY "Public Read CMS Media" ON storage.objects
FOR SELECT USING (bucket_id = 'cms_media');

-- Authenticated Admin Access for Bucket Writes
CREATE POLICY "Admin Insert CMS Media" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms_media');

CREATE POLICY "Admin Update CMS Media" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'cms_media');

CREATE POLICY "Admin Delete CMS Media" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'cms_media');
