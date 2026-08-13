export interface BlogPost {
  id: string;
  // Core content
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  // Classification
  category: string;
  tags: string[];
  // Publishing
  status: 'draft' | 'published';
  featured: boolean;
  published_at: string;
  reading_time: number;
  // External link (e.g. Medium cross-post)
  external_url: string;
  // SEO fields
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_image_url: string;
  focus_keyword: string;
  // Timestamps (managed by DB)
  created_at: string;
  updated_at: string;
}

export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
export type BlogPostUpdate = Partial<BlogPostInsert>;

export const BLOG_CATEGORIES = [
  'General',
  'Backend',
  'Frontend',
  'Architecture',
  'DevOps',
  'AI & ML',
  'Career',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
