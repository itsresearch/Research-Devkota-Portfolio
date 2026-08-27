-- ============================================================
-- Blog View Tracking — run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → paste → Run
-- ============================================================

-- 1. Views table
CREATE TABLE IF NOT EXISTS public.blog_views (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id      uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  viewed_at    timestamptz NOT NULL DEFAULT now(),
  referrer     text,          -- where they came from (google, direct, etc.)
  referrer_url text,          -- exact referrer URL
  country      text,          -- filled from IP if available
  device       text,          -- 'desktop' | 'mobile' | 'tablet'
  browser      text,          -- 'Chrome' | 'Firefox' | 'Safari' | etc.
  os           text           -- 'Windows' | 'macOS' | 'Android' | etc.
);

-- 2. Index for fast per-post queries
CREATE INDEX IF NOT EXISTS blog_views_post_id_idx ON public.blog_views(post_id);
CREATE INDEX IF NOT EXISTS blog_views_viewed_at_idx ON public.blog_views(viewed_at DESC);

-- 3. Allow public INSERT (anyone can record a view) — no auth needed
ALTER TABLE public.blog_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a view"
  ON public.blog_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4. Only authenticated users (admin) can SELECT views
CREATE POLICY "Only authenticated can read views"
  ON public.blog_views FOR SELECT
  TO authenticated
  USING (true);

-- 5. Convenience view: total views per post
CREATE OR REPLACE VIEW public.blog_post_view_counts AS
SELECT
  post_id,
  COUNT(*)                                          AS total_views,
  COUNT(*) FILTER (WHERE viewed_at >= now() - interval '7 days')  AS views_7d,
  COUNT(*) FILTER (WHERE viewed_at >= now() - interval '30 days') AS views_30d
FROM public.blog_views
GROUP BY post_id;
