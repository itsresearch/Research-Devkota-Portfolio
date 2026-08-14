import { useState, useEffect, useCallback, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  LogOut, Plus, Search, Edit2, Trash2, Eye, EyeOff,
  Save, Send, ArrowLeft, CheckCircle, XCircle,
  Star, StarOff, FileText, Globe, LayoutDashboard, ChevronRight,
  Tag, RefreshCw, Copy, BarChart2, Bold, Italic, Link, Code,
  List, Heading2, Heading3, Minus, Image, Quote,
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
  return title.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}
function wordCount(text: string) {
  return text?.split(/\s+/).filter(Boolean).length ?? 0;
}
function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const EMPTY_POST: BlogPostInsert = {
  title: '', slug: '', excerpt: '', content: '', cover_image_url: '',
  category: 'General', tags: [], status: 'draft', featured: false,
  published_at: new Date().toISOString().slice(0, 10),
  reading_time: 5, external_url: '', meta_title: '', meta_description: '',
  canonical_url: '', og_image_url: '', focus_keyword: '',
};

/* ═══════════════════════════════════════════════════════════════════
   SEO SCORE
═══════════════════════════════════════════════════════════════════ */
interface SEOCheck { label: string; pass: boolean; weight: number }
function calcSEO(f: BlogPostInsert): { score: number; checks: SEOCheck[] } {
  const desc = f.meta_description || f.excerpt || '';
  const title = f.meta_title || f.title || '';
  const wc = wordCount(f.content || '');
  const kw = (f.focus_keyword || '').toLowerCase();
  const checks: SEOCheck[] = [
    { label: 'Title present',                        pass: f.title.length > 0,                                    weight: 10 },
    { label: 'Title 30–60 characters',               pass: title.length >= 30 && title.length <= 60,              weight: 10 },
    { label: 'Meta description present',             pass: desc.length > 0,                                       weight: 10 },
    { label: 'Meta description 120–160 chars',       pass: desc.length >= 120 && desc.length <= 160,              weight: 10 },
    { label: 'Focus keyword set',                    pass: kw.length > 0,                                         weight: 10 },
    { label: 'Focus keyword in title',               pass: kw.length > 0 && title.toLowerCase().includes(kw),    weight: 10 },
    { label: 'Content ≥ 300 words',                  pass: wc >= 300,                                             weight: 10 },
    { label: 'Long-form content ≥ 800 words',        pass: wc >= 800,                                             weight: 10 },
    { label: 'Slug is set',                          pass: f.slug.length > 0,                                     weight: 5  },
    { label: 'Slug lowercase with hyphens',          pass: f.slug.length > 0 && !/[A-Z\s]/.test(f.slug),         weight: 5  },
    { label: 'OG / cover image set',                pass: !!(f.og_image_url || f.cover_image_url),               weight: 5  },
    { label: 'Tags added (min 2)',                   pass: f.tags.length >= 2,                                    weight: 5  },
  ];
  const total  = checks.reduce((a, c) => a + c.weight, 0);
  const earned = checks.filter(c => c.pass).reduce((a, c) => a + c.weight, 0);
  return { score: Math.round((earned / total) * 100), checks };
}
function scoreColor(s: number) { return s >= 80 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444'; }
function scoreBg(s: number)    { return s >= 80 ? 'bg-emerald-500' : s >= 50 ? 'bg-amber-400' : 'bg-red-500'; }

/* ═══════════════════════════════════════════════════════════════════
   MARKDOWN EDITOR  (no external CSS — fully custom)
═══════════════════════════════════════════════════════════════════ */
const PROSE: Record<string, React.ElementType> = {
  h1: ({ ...p }) => <h1 className="text-2xl font-bold mt-8 mb-3 text-slate-900 font-display" {...p} />,
  h2: ({ ...p }) => <h2 className="text-xl font-bold mt-6 mb-2 text-slate-900 font-display" {...p} />,
  h3: ({ ...p }) => <h3 className="text-lg font-semibold mt-5 mb-2 text-slate-800 font-display" {...p} />,
  p:  ({ ...p }) => <p  className="mb-3 leading-relaxed text-slate-700 text-sm" {...p} />,
  ul: ({ ...p }) => <ul className="mb-3 ml-5 list-disc space-y-1" {...p} />,
  ol: ({ ...p }) => <ol className="mb-3 ml-5 list-decimal space-y-1" {...p} />,
  li: ({ ...p }) => <li className="text-sm text-slate-700" {...p} />,
  blockquote: ({ ...p }) => <blockquote className="border-l-4 border-primary/40 pl-4 italic text-slate-500 my-3 text-sm bg-primary/5 py-1 pr-2 rounded-r" {...p} />,
  code: ({ className, children, ...p }: React.HTMLAttributes<HTMLElement> & { className?: string }) => {
    const block = className?.includes('language-');
    return block
      ? <code className={`block bg-slate-900 text-slate-100 rounded-lg p-3 my-3 text-xs font-mono overflow-x-auto ${className}`} {...p}>{children}</code>
      : <code className="bg-primary/10 text-primary px-1 py-0.5 rounded text-xs font-mono" {...p}>{children}</code>;
  },
  pre: ({ ...p }) => <pre className="mb-3" {...p} />,
  a:   ({ href, ...p }) => <a href={href} className="text-primary underline underline-offset-2 text-sm" target="_blank" rel="noopener noreferrer" {...p} />,
  hr:  () => <hr className="my-4 border-slate-200" />,
  img: ({ alt, ...p }) => <img className="rounded-lg my-4 w-full object-cover" alt={alt} {...p} />,
};

interface ToolbarBtn { icon: React.ReactNode; label: string; action: () => void; }

const MarkdownEditor = ({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) => {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const taRef = useRef<HTMLTextAreaElement>(null);
  const wc = wordCount(value);

  const wrap = (before: string, after = '', placeholder = 'text') => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  };
  const insertLine = (prefix: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s } = ta;
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + prefix.length, s + prefix.length); });
  };

  const tools: ToolbarBtn[] = [
    { icon: <Heading2 size={14} />,  label: 'Heading 2',    action: () => insertLine('## ')     },
    { icon: <Heading3 size={14} />,  label: 'Heading 3',    action: () => insertLine('### ')    },
    { icon: <Bold     size={14} />,  label: 'Bold',         action: () => wrap('**', '**', 'bold text') },
    { icon: <Italic   size={14} />,  label: 'Italic',       action: () => wrap('_', '_', 'italic text') },
    { icon: <Code     size={14} />,  label: 'Inline code',  action: () => wrap('`', '`', 'code') },
    { icon: <Quote    size={14} />,  label: 'Blockquote',   action: () => insertLine('> ')      },
    { icon: <List     size={14} />,  label: 'Bullet list',  action: () => insertLine('- ')      },
    { icon: <Link     size={14} />,  label: 'Link',         action: () => wrap('[', '](https://)', 'link text') },
    { icon: <Image    size={14} />,  label: 'Image',        action: () => wrap('![', '](https://)', 'alt text') },
    { icon: <Minus    size={14} />,  label: 'Divider',      action: () => { onChange(value + '\n---\n'); } },
  ];

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-slate-50 border-b border-slate-200 flex-wrap">
        {tools.map(t => (
          <button key={t.label} type="button" title={t.label} onClick={t.action}
            className="p-1.5 rounded text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
            {t.icon}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <span className="text-xs text-slate-400 mr-2">{wc} words</span>
          {(['write', 'preview'] as const).map(m => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all capitalize ${mode === m ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Write mode */}
      {mode === 'write' && (
        <textarea
          ref={taRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Write your article in Markdown…&#10;&#10;## Start with a heading&#10;&#10;Your content here."
          className="w-full resize-none outline-none p-4 font-mono text-sm leading-relaxed text-slate-800 bg-white placeholder-slate-300"
          style={{ minHeight: '420px' }}
          spellCheck
        />
      )}

      {/* Preview mode */}
      {mode === 'preview' && (
        <div className="p-5 overflow-y-auto bg-white" style={{ minHeight: '420px' }}>
          {value.trim()
            ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={PROSE}>{value}</ReactMarkdown>
            : <p className="text-slate-400 italic text-sm">Nothing to preview yet…</p>
          }
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TAG INPUT
═══════════════════════════════════════════════════════════════════ */
const TagInput = ({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) => {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim().replace(/,/g, '');
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  };
  return (
    <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-slate-200 bg-white min-h-[44px] focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
      {tags.map(t => (
        <span key={t} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
          <Tag size={9} />{t}
          <button type="button" onClick={() => onChange(tags.filter(x => x !== t))} className="ml-0.5 hover:text-red-500 transition-colors">×</button>
        </span>
      ))}
      <input type="text" value={input} placeholder={tags.length === 0 ? 'Add tags (Enter or comma)' : 'Add more…'}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
        onBlur={add}
        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent" />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   REUSABLE FORM PRIMITIVES
═══════════════════════════════════════════════════════════════════ */
const Field = ({ label, hint, counter, maxLen, error, children }: {
  label: string; hint?: string; counter?: number; maxLen?: number; error?: string; children: React.ReactNode;
}) => (
  <div className="mb-5">
    <div className="flex items-baseline justify-between mb-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="flex items-center gap-3">
        {counter !== undefined && maxLen && (
          <span className={`text-xs tabular-nums ${counter > maxLen ? 'text-red-500 font-semibold' : counter >= maxLen * 0.85 ? 'text-amber-500' : 'text-slate-400'}`}>
            {counter}/{maxLen}
          </span>
        )}
        {hint && <span className="text-xs text-slate-400 italic">{hint}</span>}
      </div>
    </div>
    {children}
    {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><XCircle size={11} />{error}</p>}
  </div>
);

const cx = 'w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all';
const FInput  = ({ className = '', ...p }: React.InputHTMLAttributes<HTMLInputElement>)         => <input    className={`${cx} ${className}`} {...p} />;
const FArea   = ({ className = '', ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>)   => <textarea className={`${cx} resize-none ${className}`} {...p} />;
const FSelect = ({ className = '', ...p }: React.SelectHTMLAttributes<HTMLSelectElement>)       => <select   className={`${cx} ${className}`} {...p} />;

/* ═══════════════════════════════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════════════════════════════ */
const LoginScreen = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 flex items-center justify-center px-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <LayoutDashboard size={26} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Blog Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Research Devkota · Navya EdTech</p>
        </div>
        <form onSubmit={handle} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-5">
          <Field label="Email">
            <FInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" required autoFocus />
          </Field>
          <Field label="Password">
            <FInput type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </Field>
          {error && (
            <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <XCircle size={14} /> {error}
            </p>
          )}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-primary text-white shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {loading && <RefreshCw size={15} className="animate-spin" />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-6">Authorized administrators only.</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   POST EDITOR
═══════════════════════════════════════════════════════════════════ */
type EditorTab = 'content' | 'seo' | 'settings';

const PostEditor = ({ initialPost, onSaved, onBack }: {
  initialPost: BlogPost | null; onSaved: () => void; onBack: () => void;
}) => {
  const isNew = !initialPost;
  const [form, setForm] = useState<BlogPostInsert>(
    initialPost ? {
      title: initialPost.title, slug: initialPost.slug, excerpt: initialPost.excerpt,
      content: initialPost.content, cover_image_url: initialPost.cover_image_url,
      category: initialPost.category, tags: initialPost.tags ?? [], status: initialPost.status,
      featured: initialPost.featured, published_at: initialPost.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      reading_time: initialPost.reading_time, external_url: initialPost.external_url,
      meta_title: initialPost.meta_title, meta_description: initialPost.meta_description,
      canonical_url: initialPost.canonical_url, og_image_url: initialPost.og_image_url,
      focus_keyword: initialPost.focus_keyword,
    } : EMPTY_POST,
  );
  const [tab, setTab]                   = useState<EditorTab>('content');
  const [saving, setSaving]             = useState(false);
  const [slugConflict, setSlugConflict] = useState(false);
  const [slugAutoSync, setSlugAutoSync] = useState(isNew);

  const set = <K extends keyof BlogPostInsert>(key: K, val: BlogPostInsert[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleTitle = (v: string) => { set('title', v); if (slugAutoSync) set('slug', generateSlug(v)); };

  useEffect(() => {
    if (!form.slug) return;
    const t = setTimeout(async () => {
      setSlugConflict(await blogService.isSlugTaken(form.slug, initialPost?.id));
    }, 500);
    return () => clearTimeout(t);
  }, [form.slug, initialPost?.id]);

  const { score, checks } = calcSEO(form);

  const save = useCallback(async (status?: 'draft' | 'published') => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.slug.trim())  { toast.error('Slug is required'); return; }
    if (slugConflict)        { toast.error('Slug already in use'); return; }
    setSaving(true);
    const payload = { ...form, status: status ?? form.status, published_at: form.published_at || new Date().toISOString() };
    try {
      if (isNew) await blogService.createPost(payload);
      else        await blogService.updatePost(initialPost!.id, payload as BlogPostUpdate);
      toast.success(isNew ? 'Post created!' : 'Changes saved!');
      onSaved();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Save failed');
    } finally { setSaving(false); }
  }, [form, isNew, initialPost, slugConflict, onSaved]);

  const tabs = [
    { id: 'content'  as EditorTab, label: 'Content' },
    { id: 'seo'      as EditorTab, label: `SEO  ${score}/100` },
    { id: 'settings' as EditorTab, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-slate-200 bg-white flex-shrink-0 flex-wrap gap-y-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={14} /> Posts
        </button>
        <ChevronRight size={13} className="text-slate-300" />
        <span className="text-sm font-medium text-slate-700 truncate max-w-[200px] sm:max-w-xs">
          {form.title || (isNew ? 'New Post' : 'Untitled')}
        </span>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {form.status === 'published' && form.slug && (
            <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary transition-all">
              <Globe size={12} /> View live
            </a>
          )}
          <button onClick={() => save('draft')} disabled={saving}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50">
            <Save size={13} /> Save Draft
          </button>
          <button onClick={() => save('published')} disabled={saving}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl font-semibold bg-primary text-white shadow-sm hover:opacity-90 transition-all disabled:opacity-50">
            {saving ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
            {form.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 flex-shrink-0">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6">

        {/* CONTENT */}
        {tab === 'content' && (
          <div className="max-w-4xl mx-auto space-y-0">
            <Field label="Title" counter={form.title.length} maxLen={70}>
              <FInput value={form.title} onChange={e => handleTitle(e.target.value)}
                placeholder="Write a clear, keyword-rich title…" className="text-base font-semibold" />
            </Field>

            <Field label="Slug" hint="Auto-generated from title" error={slugConflict ? 'Slug already exists — pick another' : undefined}>
              <div className="flex gap-2">
                <span className="flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 text-xs text-slate-500 whitespace-nowrap select-none">
                  /blog/
                </span>
                <FInput value={form.slug}
                  onChange={e => { setSlugAutoSync(false); set('slug', e.target.value.toLowerCase().replace(/\s/g, '-')); }}
                  placeholder="my-post-slug" className={`rounded-l-none font-mono text-xs flex-1 ${slugConflict ? 'border-red-400' : ''}`} />
                <button type="button" title="Re-generate from title"
                  onClick={() => { set('slug', generateSlug(form.title)); setSlugAutoSync(true); }}
                  className="px-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/40 transition-all flex-shrink-0">
                  <RefreshCw size={13} />
                </button>
                <button type="button" title="Copy slug"
                  onClick={() => { navigator.clipboard.writeText(form.slug); toast.success('Copied!'); }}
                  className="px-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/40 transition-all flex-shrink-0">
                  <Copy size={13} />
                </button>
              </div>
            </Field>

            <Field label="Excerpt" hint="Fallback meta description" counter={form.excerpt.length} maxLen={200}>
              <FArea rows={3} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                placeholder="A compelling 1–2 sentence summary shown in blog card and search results…" />
            </Field>

            <Field label="Content (Markdown)">
              <MarkdownEditor value={form.content} onChange={v => set('content', v)} />
            </Field>
          </div>
        )}

        {/* SEO */}
        {tab === 'seo' && (
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Score card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SEO Score</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{checks.length} checks analysed</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tabular-nums" style={{ color: scoreColor(score), fontFamily: "'Space Grotesk', sans-serif" }}>{score}</span>
                  <span className="text-slate-400 text-lg">/100</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
                <div className={`h-full rounded-full transition-all duration-700 ${scoreBg(score)}`} style={{ width: `${score}%` }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {checks.map(c => (
                  <div key={c.label} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${c.pass ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50/70 text-red-600'}`}>
                    {c.pass ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {c.label}
                  </div>
                ))}
              </div>
            </div>

            {/* SEO fields */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-0">
              <Field label="Focus Keyword" hint="Keyword you want to rank for">
                <FInput value={form.focus_keyword} onChange={e => set('focus_keyword', e.target.value)} placeholder="e.g. Laravel multi-tenant SaaS" />
              </Field>
              <Field label="Meta Title" counter={form.meta_title.length} maxLen={60} hint="Overrides title in search results">
                <FInput value={form.meta_title} onChange={e => set('meta_title', e.target.value)} placeholder={form.title || 'Defaults to post title'} />
              </Field>
              <Field label="Meta Description" counter={(form.meta_description || form.excerpt).length} maxLen={160} hint="120–160 chars recommended">
                <FArea rows={3} value={form.meta_description} onChange={e => set('meta_description', e.target.value)} placeholder={form.excerpt || 'Defaults to excerpt'} />
              </Field>
              <Field label="OG Image URL" hint="1200×630 px — used for social cards">
                <FInput value={form.og_image_url} onChange={e => set('og_image_url', e.target.value)} placeholder="https://example.com/og-image.png" />
                {form.og_image_url && (
                  <img src={form.og_image_url} alt="OG preview" className="mt-2 rounded-lg w-full object-cover max-h-36 border border-slate-200"
                    onError={e => (e.currentTarget.style.display = 'none')} />
                )}
              </Field>
              <Field label="Canonical URL" hint="For cross-posted content">
                <FInput value={form.canonical_url} onChange={e => set('canonical_url', e.target.value)} placeholder="https://devkotaresearch.com.np/blog/slug" />
              </Field>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-0">
              {/* Status + Featured */}
              <div className="flex flex-wrap gap-4 pb-5 mb-5 border-b border-slate-100">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Status</label>
                  <FSelect value={form.status} onChange={e => set('status', e.target.value as 'draft' | 'published')} className="w-36">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </FSelect>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1.5">Featured</label>
                  <button type="button" onClick={() => set('featured', !form.featured)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${form.featured ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-200'}`}>
                    {form.featured
                      ? <Star size={14} className="fill-amber-400 text-amber-400" />
                      : <StarOff size={14} />}
                    {form.featured ? 'Featured' : 'Not featured'}
                  </button>
                </div>
              </div>

              <Field label="Category">
                <FSelect value={form.category} onChange={e => set('category', e.target.value)}>
                  {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </FSelect>
              </Field>
              <Field label="Tags">
                <TagInput tags={form.tags} onChange={t => set('tags', t)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Reading time (min)">
                  <FInput type="number" min={1} max={120} value={form.reading_time}
                    onChange={e => set('reading_time', parseInt(e.target.value, 10) || 5)} />
                </Field>
                <Field label="Publish Date">
                  <FInput type="date" value={form.published_at?.slice(0, 10)} onChange={e => set('published_at', e.target.value)} />
                </Field>
              </div>
              <Field label="Cover Image URL" hint="Displayed at the top of the post">
                <FInput value={form.cover_image_url} onChange={e => set('cover_image_url', e.target.value)} placeholder="https://example.com/cover.jpg" />
                {form.cover_image_url && (
                  <img src={form.cover_image_url} alt="Cover" className="mt-2 rounded-lg w-full object-cover max-h-36 border border-slate-200"
                    onError={e => (e.currentTarget.style.display = 'none')} />
                )}
              </Field>
              <Field label="External URL" hint="Medium, dev.to, or any cross-post (optional)">
                <FInput value={form.external_url} onChange={e => set('external_url', e.target.value)} placeholder="https://medium.com/@devkotaresearch/…" />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════════ */
const Dashboard = ({ posts, loading, onEdit, onNew, onRefresh }: {
  posts: BlogPost[]; loading: boolean;
  onEdit: (p: BlogPost) => void; onNew: () => void; onRefresh: () => void;
}) => {
  const [search, setSearch]   = useState('');
  const [deleting, setDel]    = useState<string | null>(null);

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDel(id);
    try { await blogService.deletePost(id); toast.success('Deleted'); onRefresh(); }
    catch { toast.error('Delete failed'); }
    finally { setDel(null); }
  };

  const toggleStatus = async (p: BlogPost) => {
    const next = p.status === 'published' ? 'draft' : 'published';
    try { await blogService.updatePost(p.id, { status: next }); toast.success(next === 'published' ? 'Published!' : 'Moved to draft'); onRefresh(); }
    catch { toast.error('Update failed'); }
  };

  const stats = {
    total:     posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts:    posts.filter(p => p.status === 'draft').length,
    featured:  posts.filter(p => p.featured).length,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total',     value: stats.total,     icon: <FileText size={15} />, color: 'text-slate-600' },
            { label: 'Published', value: stats.published, icon: <Globe    size={15} />, color: 'text-emerald-600' },
            { label: 'Drafts',    value: stats.drafts,    icon: <Edit2    size={15} />, color: 'text-amber-600' },
            { label: 'Featured',  value: stats.featured,  icon: <Star     size={15} />, color: 'text-primary' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
              <span className={s.color}>{s.icon}</span>
              <div>
                <div className={`text-xl font-black tabular-nums ${s.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
              className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all" />
          </div>
          <button onClick={onRefresh} title="Refresh" className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary/40 transition-all">
            <RefreshCw size={14} />
          </button>
          <button onClick={onNew} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm bg-primary text-white shadow-sm hover:opacity-90 transition-all">
            <Plus size={14} /> New Post
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400">
              <RefreshCw size={22} className="animate-spin mx-auto mb-3 text-primary" />
              <p className="text-sm">Loading posts…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <FileText size={36} className="mx-auto mb-4 opacity-20 text-slate-400" />
              <p className="font-semibold text-slate-600 mb-1">{search ? 'No posts match.' : 'No posts yet.'}</p>
              {!search && (
                <button onClick={onNew} className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-white shadow-sm hover:opacity-90 mx-auto">
                  <Plus size={13} /> Write your first post
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    {['Title', 'Category', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          {p.featured && <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                          <span className="font-medium text-slate-800 truncate">{p.title}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 font-mono truncate">/blog/{p.slug}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded whitespace-nowrap">{p.category}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => toggleStatus(p)} title="Click to toggle"
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold transition-all whitespace-nowrap ${p.status === 'published' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
                          {p.status === 'published' ? <><Eye size={9} /> Published</> : <><EyeOff size={9} /> Draft</>}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{formatDateShort(p.published_at)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {p.status === 'published' && (
                            <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" title="View live"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"><Globe size={13} /></a>
                          )}
                          <button onClick={() => onEdit(p)} title="Edit"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"><Edit2 size={13} /></button>
                          <button onClick={() => handleDelete(p.id, p.title)} disabled={deleting === p.id} title="Delete"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40">
                            {deleting === p.id ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ADMIN SHELL
═══════════════════════════════════════════════════════════════════ */
type AdminView = 'dashboard' | 'editor';

const AdminShell = ({ user }: { user: User }) => {
  const [view, setView]         = useState<AdminView>('dashboard');
  const [posts, setPosts]       = useState<BlogPost[]>([]);
  const [loadingPosts, setLP]   = useState(true);
  const [editingPost, setEditing] = useState<BlogPost | null>(null);

  const fetchPosts = useCallback(async () => {
    setLP(true);
    try { setPosts(await blogService.getAllPosts()); }
    catch { toast.error('Failed to load posts'); }
    finally { setLP(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openEditor = (p: BlogPost | null) => { setEditing(p); setView('editor'); };
  const handleSaved = () => { fetchPosts(); setView('dashboard'); };
  const signOut = async () => { await supabase.auth.signOut(); toast.success('Signed out'); };

  const stats = { published: posts.filter(p => p.status === 'published').length, drafts: posts.filter(p => p.status === 'draft').length };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-slate-900 text-slate-100 flex flex-col">
        {/* Brand */}
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Blog Admin</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 border-b border-slate-800 space-y-1.5">
          {[
            { label: 'Published', value: stats.published, icon: <Globe size={10} />, color: 'text-emerald-400' },
            { label: 'Drafts',    value: stats.drafts,    icon: <Edit2 size={10} />, color: 'text-amber-400' },
            { label: 'Total',     value: posts.length,    icon: <BarChart2 size={10} />, color: 'text-slate-300' },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <span className={`flex items-center gap-1.5 text-slate-400 ${s.color}`}>{s.icon} {s.label}</span>
              <span className={`font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { id: 'dashboard' as AdminView, icon: <LayoutDashboard size={13} />, label: 'All Posts', active: view === 'dashboard', action: () => setView('dashboard') },
            { id: 'editor'   as AdminView, icon: <Plus size={13} />,            label: 'New Post',  active: view === 'editor' && !editingPost, action: () => openEditor(null) },
          ].map(n => (
            <button key={n.id} onClick={n.action}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${n.active ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
              {n.icon}{n.label}
            </button>
          ))}
          <a href="/#blog" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all">
            <Globe size={13} /> View Blog
          </a>
        </nav>

        {/* Sign out */}
        <div className="px-3 pb-4 border-t border-slate-800 pt-3">
          <button onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all">
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <div className="h-[3px] flex-shrink-0 bg-gradient-to-r from-primary via-blue-400 to-amber-400" />

        {view === 'dashboard' && (
          <>
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
              <h1 className="font-bold text-lg text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>All Posts</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage your blog content</p>
            </div>
            <Dashboard posts={posts} loading={loadingPosts} onEdit={openEditor} onNew={() => openEditor(null)} onRefresh={fetchPosts} />
          </>
        )}
        {view === 'editor' && (
          <PostEditor initialPost={editingPost} onSaved={handleSaved} onBack={() => setView('dashboard')} />
        )}
      </main>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════ */
const Admin = () => {
  const [user, setUser]           = useState<User | null>(null);
  const [authLoading, setAuthLoad] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null); setAuthLoad(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center gap-3 text-slate-500" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <RefreshCw size={18} className="animate-spin text-primary" /> Loading…
    </div>
  );
  if (!user) return <LoginScreen />;
  return <AdminShell user={user} />;
};

export default Admin;
