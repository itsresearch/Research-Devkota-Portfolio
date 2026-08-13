import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import {
  LogOut, Plus, Search, Edit2, Trash2, Eye, EyeOff,
  Save, Send, ArrowLeft, CheckCircle, XCircle, AlertTriangle,
  Star, StarOff, FileText, Globe, LayoutDashboard, ChevronRight,
  Tag, RefreshCw, Copy, BarChart2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { blogService } from '@/lib/blogService';
import type { BlogPost, BlogPostInsert, BlogPostUpdate } from '@/types/blog';
import { BLOG_CATEGORIES } from '@/types/blog';
import { toast } from 'sonner';

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════ */
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function wordCount(text: string) {
  return text?.split(/\s+/).filter(Boolean).length ?? 0;
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const EMPTY_POST: BlogPostInsert = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  category: 'General',
  tags: [],
  status: 'draft',
  featured: false,
  published_at: new Date().toISOString().slice(0, 10),
  reading_time: 5,
  external_url: '',
  meta_title: '',
  meta_description: '',
  canonical_url: '',
  og_image_url: '',
  focus_keyword: '',
};

/* ═══════════════════════════════════════════════════════════════════
   SEO SCORE
═══════════════════════════════════════════════════════════════════ */
interface SEOCheck { label: string; pass: boolean; weight: number }

function calcSEO(f: BlogPostInsert): { score: number; checks: SEOCheck[] } {
  const metaDesc = f.meta_description || f.excerpt || '';
  const metaTitle = f.meta_title || f.title || '';
  const wc = wordCount(f.content || '');
  const kw = (f.focus_keyword || '').toLowerCase();

  const checks: SEOCheck[] = [
    { label: 'Title present',                           pass: f.title.length > 0,                                   weight: 10 },
    { label: 'Title 30–60 characters',                  pass: metaTitle.length >= 30 && metaTitle.length <= 60,      weight: 10 },
    { label: 'Meta description present',                pass: metaDesc.length > 0,                                  weight: 10 },
    { label: 'Meta description 120–160 characters',     pass: metaDesc.length >= 120 && metaDesc.length <= 160,      weight: 10 },
    { label: 'Focus keyword set',                       pass: kw.length > 0,                                        weight: 10 },
    { label: 'Focus keyword in title',                  pass: kw.length > 0 && metaTitle.toLowerCase().includes(kw), weight: 10 },
    { label: 'Content ≥ 300 words',                     pass: wc >= 300,                                            weight: 10 },
    { label: 'Long-form content ≥ 800 words',           pass: wc >= 800,                                            weight: 10 },
    { label: 'Slug is set',                             pass: f.slug.length > 0,                                    weight: 5  },
    { label: 'Slug is lowercase with hyphens',          pass: f.slug.length > 0 && !/[A-Z\s]/.test(f.slug),        weight: 5  },
    { label: 'OG / cover image set',                   pass: !!(f.og_image_url || f.cover_image_url),              weight: 5  },
    { label: 'Tags added (min 2)',                      pass: f.tags.length >= 2,                                   weight: 5  },
  ];

  const total = checks.reduce((a, c) => a + c.weight, 0);
  const earned = checks.filter((c) => c.pass).reduce((a, c) => a + c.weight, 0);
  return { score: Math.round((earned / total) * 100), checks };
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-500';
  return 'text-red-500';
}

function scoreBg(score: number) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-400';
  return 'bg-red-500';
}

/* ═══════════════════════════════════════════════════════════════════
   TAG INPUT
═══════════════════════════════════════════════════════════════════ */
const TagInput = ({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) => {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim().replace(/,/g, '');
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInput('');
  };
  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-slate-200 bg-white min-h-[44px] focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
          <Tag size={9} />{tag}
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="ml-0.5 hover:text-red-500 transition-colors">×</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        placeholder={tags.length === 0 ? 'Add tags (Enter or comma)' : 'Add more...'}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
        onBlur={add}
        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   FORM FIELD
═══════════════════════════════════════════════════════════════════ */
const Field = ({
  label, hint, counter, maxLen, error, children,
}: {
  label: string; hint?: string; counter?: number; maxLen?: number; error?: string; children: React.ReactNode;
}) => (
  <div className="mb-5">
    <div className="flex items-baseline justify-between mb-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="flex items-center gap-3">
        {counter !== undefined && maxLen && (
          <span className={`text-xs ${counter > maxLen ? 'text-red-500 font-semibold' : counter >= maxLen * 0.85 ? 'text-amber-500' : 'text-slate-400'}`}>
            {counter}/{maxLen}
          </span>
        )}
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
    </div>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none ${className}`}
    {...props}
  />
);

const Select = ({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${className}`}
    {...props}
  />
);

/* ═══════════════════════════════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════════════════════════════ */
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <LayoutDashboard size={26} className="text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Blog Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Research Devkota · Navya EdTech</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-5"
        >
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required autoFocus />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <XCircle size={15} /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : null}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          This panel is for authorized administrators only.
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   POST EDITOR
═══════════════════════════════════════════════════════════════════ */
type EditorTab = 'content' | 'seo' | 'settings';

const PostEditor = ({
  initialPost,
  onSaved,
  onBack,
}: {
  initialPost: BlogPost | null;
  onSaved: () => void;
  onBack: () => void;
}) => {
  const isNew = !initialPost;
  const [form, setForm] = useState<BlogPostInsert>(
    initialPost
      ? {
          title: initialPost.title,
          slug: initialPost.slug,
          excerpt: initialPost.excerpt,
          content: initialPost.content,
          cover_image_url: initialPost.cover_image_url,
          category: initialPost.category,
          tags: initialPost.tags ?? [],
          status: initialPost.status,
          featured: initialPost.featured,
          published_at: initialPost.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
          reading_time: initialPost.reading_time,
          external_url: initialPost.external_url,
          meta_title: initialPost.meta_title,
          meta_description: initialPost.meta_description,
          canonical_url: initialPost.canonical_url,
          og_image_url: initialPost.og_image_url,
          focus_keyword: initialPost.focus_keyword,
        }
      : EMPTY_POST,
  );

  const [tab, setTab] = useState<EditorTab>('content');
  const [saving, setSaving] = useState(false);
  const [slugConflict, setSlugConflict] = useState(false);
  const [slugAutoSync, setSlugAutoSync] = useState(isNew);

  const set = <K extends keyof BlogPostInsert>(key: K, val: BlogPostInsert[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  /* Auto-generate slug from title */
  const handleTitleChange = (val: string) => {
    set('title', val);
    if (slugAutoSync) set('slug', generateSlug(val));
  };

  /* Slug conflict check (debounced) */
  useEffect(() => {
    if (!form.slug) return;
    const t = setTimeout(async () => {
      const taken = await blogService.isSlugTaken(form.slug, initialPost?.id);
      setSlugConflict(taken);
    }, 500);
    return () => clearTimeout(t);
  }, [form.slug, initialPost?.id]);

  /* SEO */
  const { score, checks } = calcSEO(form);
  const wc = wordCount(form.content || '');

  const save = useCallback(async (publishStatus?: 'draft' | 'published') => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.slug.trim())  { toast.error('Slug is required'); return; }
    if (slugConflict)        { toast.error('Slug already exists — choose a unique one'); return; }

    setSaving(true);
    const payload: BlogPostInsert = {
      ...form,
      status: publishStatus ?? form.status,
      published_at: form.published_at || new Date().toISOString(),
    };

    try {
      if (isNew) await blogService.createPost(payload);
      else await blogService.updatePost(initialPost!.id, payload as BlogPostUpdate);
      toast.success(isNew ? 'Post created!' : 'Post saved!');
      onSaved();
    } catch (err: unknown) {
      toast.error((err as Error).message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [form, isNew, initialPost, slugConflict, onSaved]);

  const tabs: { id: EditorTab; label: string }[] = [
    { id: 'content',  label: 'Content' },
    { id: 'seo',      label: `SEO (${score}/100)` },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-full" data-color-mode="light">
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={15} /> Posts
        </button>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="text-sm font-medium text-slate-700 truncate max-w-xs">
          {form.title || (isNew ? 'New Post' : 'Untitled')}
        </span>

        <div className="ml-auto flex items-center gap-3">
          {form.status === 'published' && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary transition-all"
            >
              <Globe size={13} /> Preview
            </a>
          )}
          <button
            onClick={() => save('draft')}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <Save size={14} /> Save Draft
          </button>
          <button
            onClick={() => save('published')}
            disabled={saving}
            className="btn-primary py-2 text-sm disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
            {form.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="flex border-b border-slate-200 bg-white flex-shrink-0 px-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-slate-50/60 p-6">

        {/* ── CONTENT TAB ─────────────────────────────────────── */}
        {tab === 'content' && (
          <div className="max-w-4xl mx-auto space-y-1">
            <Field label="Title" counter={form.title.length} maxLen={70}>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Write a clear, keyword-rich title…"
                className="text-lg font-semibold"
              />
            </Field>

            <Field
              label="Slug"
              hint="Auto-generated from title"
              error={slugConflict ? 'This slug is already taken' : undefined}
            >
              <div className="flex gap-2">
                <div className="flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 text-xs text-slate-500 whitespace-nowrap">
                  /blog/
                </div>
                <Input
                  value={form.slug}
                  onChange={(e) => { setSlugAutoSync(false); set('slug', e.target.value.toLowerCase().replace(/\s/g, '-')); }}
                  placeholder="my-post-slug"
                  className={`rounded-l-none font-mono text-sm ${slugConflict ? 'border-red-400 focus:ring-red-200' : ''}`}
                />
                <button
                  type="button"
                  title="Regenerate slug from title"
                  onClick={() => { set('slug', generateSlug(form.title)); setSlugAutoSync(true); }}
                  className="flex-shrink-0 px-3 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/40 transition-all"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  title="Copy slug"
                  onClick={() => { navigator.clipboard.writeText(form.slug); toast.success('Slug copied'); }}
                  className="flex-shrink-0 px-3 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/40 transition-all"
                >
                  <Copy size={14} />
                </button>
              </div>
            </Field>

            <Field label="Excerpt" hint="Used as meta description if no override" counter={form.excerpt.length} maxLen={200}>
              <Textarea
                rows={3}
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="A brief, engaging summary of the article (1-2 sentences)…"
              />
            </Field>

            <Field label={`Content — Markdown  (${wc} words)`}>
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm" data-color-mode="light">
                <MDEditor
                  value={form.content}
                  onChange={(val) => set('content', val ?? '')}
                  height={480}
                  data-color-mode="light"
                  preview="live"
                  style={{ fontFamily: 'inherit' }}
                />
              </div>
            </Field>
          </div>
        )}

        {/* ── SEO TAB ─────────────────────────────────────────── */}
        {tab === 'seo' && (
          <div className="max-w-3xl mx-auto">
            {/* Score Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-800">SEO Score</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Based on {checks.length} checks</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-4xl font-display font-black ${scoreColor(score)}`}>{score}</div>
                  <div className="text-slate-400 text-xl font-light">/100</div>
                </div>
              </div>
              {/* Score bar */}
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreBg(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {checks.map((c) => (
                  <div key={c.label} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${c.pass ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50/60 text-red-600'}`}>
                    {c.pass ? <CheckCircle size={13} /> : <XCircle size={13} />}
                    {c.label}
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Fields */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-1">
              <Field label="Focus Keyword" hint="Primary keyword you want to rank for">
                <Input value={form.focus_keyword} onChange={(e) => set('focus_keyword', e.target.value)} placeholder="e.g. Laravel multi-tenant SaaS" />
              </Field>
              <Field label="Meta Title" counter={form.meta_title.length} maxLen={60} hint="Overrides post title in search results">
                <Input value={form.meta_title} onChange={(e) => set('meta_title', e.target.value)} placeholder={form.title || 'Defaults to post title'} />
              </Field>
              <Field label="Meta Description" counter={(form.meta_description || form.excerpt).length} maxLen={160} hint="Overrides excerpt in search results">
                <Textarea rows={3} value={form.meta_description} onChange={(e) => set('meta_description', e.target.value)} placeholder={form.excerpt || 'Defaults to excerpt (120–160 chars recommended)'} />
              </Field>
              <Field label="Open Graph Image URL" hint="1200×630px recommended (Twitter + Facebook)">
                <Input value={form.og_image_url} onChange={(e) => set('og_image_url', e.target.value)} placeholder="https://example.com/og-image.png" />
                {form.og_image_url && (
                  <img src={form.og_image_url} alt="OG preview" className="mt-2 rounded-lg w-full object-cover max-h-36 border border-slate-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
                )}
              </Field>
              <Field label="Canonical URL" hint="For cross-posted content (Medium, dev.to, etc.)">
                <Input value={form.canonical_url} onChange={(e) => set('canonical_url', e.target.value)} placeholder="https://devkotaresearch.com.np/blog/slug" />
              </Field>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ──────────────────────────────────── */}
        {tab === 'settings' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-1">
              {/* Status + Featured */}
              <div className="flex flex-wrap gap-4 mb-5 pb-5 border-b border-slate-100">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Status</label>
                  <Select
                    value={form.status}
                    onChange={(e) => set('status', e.target.value as 'draft' | 'published')}
                    className="w-40"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Featured</label>
                  <button
                    type="button"
                    onClick={() => set('featured', !form.featured)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      form.featured
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-amber-200'
                    }`}
                  >
                    {form.featured ? <Star size={14} className="fill-amber-400 text-amber-400" /> : <StarOff size={14} />}
                    {form.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </div>
              </div>

              <Field label="Category">
                <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>

              <Field label="Tags">
                <TagInput tags={form.tags} onChange={(tags) => set('tags', tags)} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Reading Time (min)">
                  <Input type="number" min={1} max={120} value={form.reading_time} onChange={(e) => set('reading_time', parseInt(e.target.value, 10) || 5)} />
                </Field>
                <Field label="Publish Date">
                  <Input type="date" value={form.published_at?.slice(0, 10)} onChange={(e) => set('published_at', e.target.value)} />
                </Field>
              </div>

              <Field label="Cover Image URL" hint="Displayed at top of post">
                <Input value={form.cover_image_url} onChange={(e) => set('cover_image_url', e.target.value)} placeholder="https://example.com/cover.jpg" />
                {form.cover_image_url && (
                  <img src={form.cover_image_url} alt="Cover preview" className="mt-2 rounded-lg w-full object-cover max-h-36 border border-slate-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
                )}
              </Field>

              <Field label="External URL" hint="Medium, dev.to, or any cross-post link (optional)">
                <Input value={form.external_url} onChange={(e) => set('external_url', e.target.value)} placeholder="https://medium.com/@devkotaresearch/..." />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD (POST LIST)
═══════════════════════════════════════════════════════════════════ */
const Dashboard = ({
  posts,
  loading,
  onEdit,
  onNew,
  onRefresh,
}: {
  posts: BlogPost[];
  loading: boolean;
  onEdit: (p: BlogPost) => void;
  onNew: () => void;
  onRefresh: () => void;
}) => {
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await blogService.deletePost(id);
      toast.success('Post deleted');
      onRefresh();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const toggleStatus = async (p: BlogPost) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    try {
      await blogService.updatePost(p.id, { status: newStatus });
      toast.success(newStatus === 'published' ? 'Post published!' : 'Moved to draft');
      onRefresh();
    } catch {
      toast.error('Update failed');
    }
  };

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    drafts: posts.filter((p) => p.status === 'draft').length,
    featured: posts.filter((p) => p.featured).length,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/60">
      <div className="max-w-5xl mx-auto p-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Posts', value: stats.total, icon: <FileText size={16} />, color: 'text-slate-600' },
            { label: 'Published',   value: stats.published, icon: <Globe size={16} />, color: 'text-emerald-600' },
            { label: 'Drafts',      value: stats.drafts, icon: <Edit2 size={16} />, color: 'text-amber-600' },
            { label: 'Featured',    value: stats.featured, icon: <Star size={16} />, color: 'text-primary' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className={`${s.color}`}>{s.icon}</div>
              <div>
                <div className={`text-xl font-display font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <button onClick={onRefresh} className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-primary transition-colors" title="Refresh">
            <RefreshCw size={15} />
          </button>
          <button onClick={onNew} className="btn-primary py-2.5 text-sm">
            <Plus size={15} /> New Post
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400">
              <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
              Loading posts…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <FileText size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium text-slate-600">{search ? 'No posts match your search.' : 'No posts yet.'}</p>
              {!search && (
                <button onClick={onNew} className="btn-primary mt-4 text-sm">
                  <Plus size={14} /> Write your first post
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Title</th>
                  <th className="text-left px-3 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide hidden sm:table-cell">Category</th>
                  <th className="text-left px-3 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-3 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {p.featured && <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                        <span className="font-medium text-slate-800 line-clamp-1">{p.title}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">/blog/{p.slug}</div>
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{p.category}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <button
                        onClick={() => toggleStatus(p)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      >
                        {p.status === 'published' ? <><Eye size={10} /> Published</> : <><EyeOff size={10} /> Draft</>}
                      </button>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-slate-500 hidden md:table-cell">
                      {formatDateShort(p.published_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {p.status === 'published' && (
                          <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"
                             className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all" title="View live">
                            <Globe size={14} />
                          </a>
                        )}
                        <button onClick={() => onEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={deleting === p.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40" title="Delete">
                          {deleting === p.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN ADMIN SHELL
═══════════════════════════════════════════════════════════════════ */
type AdminView = 'dashboard' | 'editor';

const AdminShell = ({ user }: { user: User }) => {
  const [view, setView] = useState<AdminView>('dashboard');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try { setPosts(await blogService.getAllPosts()); }
    catch { toast.error('Failed to load posts'); }
    finally { setPostsLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openEditor = (post: BlogPost | null) => {
    setEditingPost(post);
    setView('editor');
  };

  const handleSaved = () => {
    fetchPosts();
    setView('dashboard');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
  };

  const stats = {
    published: posts.filter((p) => p.status === 'published').length,
    drafts: posts.filter((p) => p.status === 'draft').length,
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <LayoutDashboard size={15} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight">Blog Admin</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[130px]">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="px-4 py-4 border-b border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5"><Globe size={11} /> Published</span>
            <span className="font-bold text-emerald-400">{stats.published}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5"><Edit2 size={11} /> Drafts</span>
            <span className="font-bold text-amber-400">{stats.drafts}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5"><BarChart2 size={11} /> Total</span>
            <span className="font-bold text-slate-200">{posts.length}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
              view === 'dashboard' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <LayoutDashboard size={14} /> All Posts
          </button>
          <button
            onClick={() => openEditor(null)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
              view === 'editor' && !editingPost ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Plus size={14} /> New Post
          </button>
          <a
            href="/#blog"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all"
          >
            <Globe size={14} /> View Blog
          </a>
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Banner */}
        <div className="h-[3px] w-full bg-gradient-to-r from-primary via-blue-400 to-accent flex-shrink-0" />

        {view === 'dashboard' && (
          <>
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
              <h1 className="font-display font-bold text-lg text-slate-800">All Posts</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage your blog content from here</p>
            </div>
            <Dashboard
              posts={posts}
              loading={postsLoading}
              onEdit={openEditor}
              onNew={() => openEditor(null)}
              onRefresh={fetchPosts}
            />
          </>
        )}

        {view === 'editor' && (
          <PostEditor
            initialPost={editingPost}
            onSaved={handleSaved}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ROOT ADMIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw size={20} className="animate-spin text-primary" />
          Loading…
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen />;
  return <AdminShell user={user} />;
};

export default Admin;
