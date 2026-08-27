import { supabase } from './supabase';
import type { BlogPost, BlogPostInsert, BlogPostUpdate } from '../types/blog';

const CACHE_KEY = 'blog_posts_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/* ─── View tracking helpers ──────────────────────────────────────── */

function detectDevice(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile';
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  return 'desktop';
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Edg/'))    return 'Edge';
  if (ua.includes('OPR/'))    return 'Opera';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Firefox/'))return 'Firefox';
  if (ua.includes('Safari/')) return 'Safari';
  return 'Other';
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua))  return 'Windows';
  if (/Macintosh/i.test(ua))return 'macOS';
  if (/Android/i.test(ua))  return 'Android';
  if (/iPhone|iPad/i.test(ua)) return 'iOS';
  if (/Linux/i.test(ua))    return 'Linux';
  return 'Other';
}

function parseReferrer(ref: string): { source: string; url: string } {
  if (!ref) return { source: 'Direct', url: '' };
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '');
    if (host.includes('google'))    return { source: 'Google', url: ref };
    if (host.includes('bing'))      return { source: 'Bing', url: ref };
    if (host.includes('facebook'))  return { source: 'Facebook', url: ref };
    if (host.includes('twitter') || host.includes('t.co')) return { source: 'Twitter/X', url: ref };
    if (host.includes('linkedin'))  return { source: 'LinkedIn', url: ref };
    if (host.includes('github'))    return { source: 'GitHub', url: ref };
    if (host.includes('medium'))    return { source: 'Medium', url: ref };
    if (host.includes('youtube'))   return { source: 'YouTube', url: ref };
    return { source: host, url: ref };
  } catch {
    return { source: 'Direct', url: ref };
  }
}

/* ─── View analytics types ───────────────────────────────────────── */
export interface BlogView {
  id: string;
  post_id: string;
  viewed_at: string;
  referrer: string | null;
  referrer_url: string | null;
  country: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
}

export interface PostViewStats {
  post_id: string;
  post_title: string;
  post_slug: string;
  total_views: number;
  views_7d: number;
  views_30d: number;
  views: BlogView[];
}

/* ─── Main service ───────────────────────────────────────────────── */
export const blogService = {
  /** Public — only published posts, newest first */
  async getPublishedPosts(): Promise<BlogPost[]> {
    // Serve from sessionStorage cache if fresh
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const { data, ts } = JSON.parse(raw) as { data: BlogPost[]; ts: number };
        if (Date.now() - ts < CACHE_TTL) return data;
      }
    } catch { /* ignore parse errors */ }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) throw error;
    const posts = data ?? [];

    // Cache result
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: posts, ts: Date.now() })); }
    catch { /* storage full — ignore */ }

    return posts;
  },

  /** Public — single published post by slug */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    if (error) return null;
    return data;
  },

  /**
   * Public — record a view for a post.
   * Call this once when the BlogPost page mounts.
   * Silently fails if the table doesn't exist yet.
   */
  async trackView(postId: string): Promise<void> {
    try {
      const ref = parseReferrer(document.referrer);
      await supabase.from('blog_views').insert({
        post_id:      postId,
        referrer:     ref.source,
        referrer_url: ref.url || null,
        device:       detectDevice(),
        browser:      detectBrowser(),
        os:           detectOS(),
      });
    } catch { /* silently ignore — never break the reading experience */ }
  },

  /** Admin — all posts including drafts */
  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  /**
   * Admin — view analytics for all posts.
   * Returns each post with its total views, 7-day views, 30-day views,
   * and the last 100 raw view records for that post.
   */
  async getViewStats(): Promise<PostViewStats[]> {
    // Fetch all posts
    const posts = await blogService.getAllPosts();

    // Fetch all views ordered newest first
    const { data: views, error } = await supabase
      .from('blog_views')
      .select('*')
      .order('viewed_at', { ascending: false });
    if (error) throw error;

    const allViews: BlogView[] = views ?? [];
    const now = Date.now();
    const ms7d  = 7  * 24 * 60 * 60 * 1000;
    const ms30d = 30 * 24 * 60 * 60 * 1000;

    return posts.map(post => {
      const postViews = allViews.filter(v => v.post_id === post.id);
      return {
        post_id:     post.id,
        post_title:  post.title,
        post_slug:   post.slug,
        total_views: postViews.length,
        views_7d:    postViews.filter(v => now - new Date(v.viewed_at).getTime() < ms7d).length,
        views_30d:   postViews.filter(v => now - new Date(v.viewed_at).getTime() < ms30d).length,
        views:       postViews.slice(0, 100),
      };
    });
  },

  /** Admin — create a new post */
  async createPost(post: BlogPostInsert): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /** Admin — update an existing post */
  async updatePost(id: string, updates: BlogPostUpdate): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /** Admin — delete a post */
  async deletePost(id: string): Promise<void> {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  },

  /** Admin — check if a slug is already taken (exclude current post when editing) */
  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    let query = supabase.from('blog_posts').select('id').eq('slug', slug);
    if (excludeId) query = query.neq('id', excludeId);
    const { data } = await query;
    return (data?.length ?? 0) > 0;
  },
};
