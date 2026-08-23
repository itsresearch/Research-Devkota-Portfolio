import { supabase } from './supabase';
import type { BlogPost, BlogPostInsert, BlogPostUpdate } from '../types/blog';

const CACHE_KEY = 'blog_posts_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

  /** Admin — all posts including drafts */
  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
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
