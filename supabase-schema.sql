-- Portfolio Owner Edit Mode - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Enable Row Level Security (RLS)
-- This ensures public users can only read, and writes are controlled by API routes

-- ========================================
-- PROJECTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[], -- Array of technology tags
  url TEXT,
  image_url TEXT,
  slug TEXT UNIQUE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read projects
CREATE POLICY "Public read access for projects"
  ON public.projects
  FOR SELECT
  USING (true);

-- Policy: Only service role can insert/update/delete
-- (Your API routes use service role key)
CREATE POLICY "Service role can modify projects"
  ON public.projects
  FOR ALL
  USING (auth.role() = 'service_role');

-- ========================================
-- SITE SETTINGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read settings
CREATE POLICY "Public read access for settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Policy: Only service role can insert/update/delete
CREATE POLICY "Service role can modify settings"
  ON public.site_settings
  FOR ALL
  USING (auth.role() = 'service_role');

-- ========================================
-- INSERT SAMPLE DATA
-- ========================================

-- Sample projects
INSERT INTO public.projects (title, description, tech_stack, url, featured) VALUES
  ('AI-Powered Analytics Platform', 'Built a distributed system processing 1M+ events/day with real-time ML inference', ARRAY['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'], 'https://github.com', true),
  ('Infrastructure Automation Suite', 'Designed IaC framework reducing deployment time by 80%', ARRAY['TypeScript', 'AWS CDK', 'Terraform', 'Kubernetes'], 'https://github.com', true),
  ('Real-time Collaboration Engine', 'WebSocket-based system with CRDT conflict resolution', ARRAY['Node.js', 'WebSockets', 'MongoDB', 'React'], 'https://github.com', false);

-- Add columns if table already existed
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Sample site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('contact_email', 'hello@example.com'),
  ('github_url', 'https://github.com/yourusername'),
  ('linkedin_url', 'https://linkedin.com/in/yourusername'),
  ('twitter_url', 'https://twitter.com/yourusername');

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- ========================================
-- UPDATED_AT TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
