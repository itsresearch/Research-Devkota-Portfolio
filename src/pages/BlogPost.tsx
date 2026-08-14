import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft, Clock, Calendar, Tag, ExternalLink, Share2,
  BookOpen, AlertCircle, ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { blogService } from '@/lib/blogService';
import type { BlogPost } from '@/types/blog';

/* ─── Helpers ─────────────────────────────────────────────────────── */
function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function injectMeta(name: string, content: string) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function injectOG(property: string, content: string) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function injectCanonical(url: string) {
  if (!url) return;
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
  el.setAttribute('href', url);
}
function injectJSONLD(post: BlogPost) {
  document.getElementById('blog-jsonld')?.remove();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline:    post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    image:       post.og_image_url || post.cover_image_url || '',
    author: {
      '@type': 'Person', name: 'Research Devkota',
      url: 'https://devkotaresearch.com.np',
      sameAs: ['https://github.com/itsresearch', 'https://www.linkedin.com/in/researchdevkota/', 'https://medium.com/@devkotaresearch'],
    },
    publisher: { '@type': 'Person', name: 'Research Devkota', url: 'https://devkotaresearch.com.np' },
    datePublished: post.published_at,
    dateModified:  post.updated_at,
    mainEntityOfPage: { '@type': 'WebPage', '@id': post.canonical_url || window.location.href },
    keywords:      post.tags?.join(', '),
    articleSection: post.category,
    inLanguage:    'en-US',
    url:           post.canonical_url || window.location.href,
  };
  const s = document.createElement('script');
  s.id = 'blog-jsonld'; s.type = 'application/ld+json';
  s.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(s);
}

/* ─── Prose Components (styled for blog reading) ──────────────────── */
const PROSE = {
  h1: ({ ...p }) => <h1  className="font-display text-3xl font-bold mt-10 mb-4 text-foreground leading-tight" {...p} />,
  h2: ({ ...p }) => <h2  className="font-display text-2xl font-bold mt-8 mb-3 text-foreground leading-snug" {...p} />,
  h3: ({ ...p }) => <h3  className="font-display text-xl font-semibold mt-6 mb-2 text-foreground" {...p} />,
  h4: ({ ...p }) => <h4  className="font-display text-lg font-semibold mt-5 mb-2 text-foreground" {...p} />,
  p:  ({ ...p }) => <p   className="mb-5 leading-[1.85] text-foreground/85 text-[1.0625rem]" {...p} />,
  ul: ({ ...p }) => <ul  className="mb-5 ml-6 list-disc space-y-2" {...p} />,
  ol: ({ ...p }) => <ol  className="mb-5 ml-6 list-decimal space-y-2" {...p} />,
  li: ({ ...p }) => <li  className="leading-relaxed text-foreground/85" {...p} />,
  blockquote: ({ ...p }) => (
    <blockquote className="my-6 pl-5 border-l-4 border-primary/50 italic text-muted-foreground bg-primary/5 py-3 pr-4 rounded-r-xl" {...p} />
  ),
  code: ({ className, children, ...p }: React.HTMLAttributes<HTMLElement> & { className?: string }) => {
    const isBlock = className?.includes('language-');
    return isBlock
      ? <code className={`block bg-slate-900 text-slate-100 rounded-xl p-4 mb-5 text-sm font-mono leading-relaxed overflow-x-auto ${className}`} {...p}>{children}</code>
      : <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-[0.875em] font-mono" {...p}>{children}</code>;
  },
  pre:   ({ ...p }) => <pre className="mb-5" {...p} />,
  a:     ({ href, ...p }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors" {...p} />
  ),
  img:   ({ alt, ...p }) => <img className="rounded-2xl my-8 w-full object-cover shadow-md" alt={alt} {...p} />,
  hr:    () => <hr className="my-10 border-border" />,
  table: ({ ...p }) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse border border-border rounded-xl text-sm" {...p} />
    </div>
  ),
  th: ({ ...p }) => <th className="bg-secondary text-foreground font-semibold px-4 py-2.5 text-left border border-border" {...p} />,
  td: ({ ...p }) => <td className="px-4 py-2.5 border border-border text-foreground/80" {...p} />,
};

/* ─── Skeleton ────────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
    <div className="h-4 w-24 bg-secondary rounded" />
    <div className="h-10 bg-secondary rounded-xl w-4/5" />
    <div className="h-10 bg-secondary rounded-xl w-3/5" />
    <div className="flex gap-4 py-2">
      <div className="h-4 w-28 bg-secondary rounded" />
      <div className="h-4 w-20 bg-secondary rounded" />
    </div>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className={`h-4 bg-secondary rounded ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

/* ─── Page ────────────────────────────────────────────────────────── */
const BlogPost = () => {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const [post, setPost]       = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }

    blogService.getPostBySlug(slug).then(data => {
      if (!data) { setNotFound(true); return; }
      setPost(data);

      const title = data.meta_title || data.title;
      const desc  = data.meta_description || data.excerpt;
      const image = data.og_image_url || data.cover_image_url || '';
      const url   = data.canonical_url || window.location.href;

      document.title = `${title} | Research Devkota`;

      injectMeta('description', desc);
      injectMeta('keywords', data.tags?.join(', ') || '');
      injectMeta('author', 'Research Devkota');
      injectMeta('robots', 'index, follow');

      injectOG('og:title', title);         injectOG('og:description', desc);
      injectOG('og:image', image);          injectOG('og:url', url);
      injectOG('og:type', 'article');       injectOG('og:site_name', 'Research Devkota');
      injectOG('article:published_time', data.published_at);
      injectOG('article:modified_time',  data.updated_at);
      injectOG('article:author',  'Research Devkota');
      injectOG('article:section', data.category);
      data.tags?.forEach(t => injectOG('article:tag', t));

      injectOG('twitter:card',        'summary_large_image');
      injectOG('twitter:title',       title);
      injectOG('twitter:description', desc);
      injectOG('twitter:image',       image);
      injectOG('twitter:creator',     '@researchdevkota');

      injectCanonical(url);
      injectJSONLD(data);
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));

    return () => {
      document.title = 'Research Devkota | Co-Founder, Navya EdTech';
      document.getElementById('blog-jsonld')?.remove();
    };
  }, [slug]);

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* ignore */ }
  };

  /* ── Not Found ───────────────────────────────────────────────────── */
  if (!loading && notFound) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center px-6">
          <AlertCircle size={48} className="text-muted-foreground mx-auto mb-4 opacity-40" />
          <h1 className="font-display text-3xl font-bold mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">This article doesn't exist or has been unpublished.</p>
          <Link to="/#blog" className="btn-primary">
            <ArrowLeft size={15} /> Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-blue-400 to-accent z-50" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
        </motion.div>

        {loading ? <Skeleton /> : post ? (
          <motion.article
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            itemScope itemType="https://schema.org/BlogPosting"
          >
            {/* Category badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <BookOpen size={11} /> {post.category}
              </span>
              {post.featured && (
                <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-semibold">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.625rem] font-bold mb-6 leading-tight text-balance tracking-tight" itemProp="headline">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 pb-8 border-b border-border text-sm text-muted-foreground">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <img src="/logos/navyaedtech.webp" alt="" className="w-6 h-6 rounded-full object-cover border border-border" />
                Research Devkota
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                <time dateTime={post.published_at} itemProp="datePublished">{fmt(post.published_at)}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {post.reading_time} min read
              </span>
              <button onClick={share}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-all text-xs font-medium">
                <Share2 size={12} /> {copied ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Cover image */}
            {post.cover_image_url && (
              <img src={post.cover_image_url} alt={post.title}
                className="w-full rounded-2xl mb-10 shadow-md object-cover max-h-96" itemProp="image" />
            )}

            {/* Excerpt (no content) */}
            {!post.content?.trim() && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 italic border-l-4 border-primary/30 pl-5 py-1" itemProp="description">
                {post.excerpt}
              </p>
            )}

            {/* Markdown content */}
            {post.content?.trim() && (
              <div itemProp="articleBody">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={PROSE}>
                  {post.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-border">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Tag size={13} /> Tags:
                </span>
                {post.tags.map(t => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* External / cross-post */}
            {post.external_url && (
              <div className="mt-8 p-5 rounded-2xl bg-primary/5 border border-primary/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Also published on Medium</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Read the original on Medium for comments and claps.</p>
                </div>
                <a href={post.external_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2 whitespace-nowrap flex-shrink-0">
                  Read on Medium <ExternalLink size={13} />
                </a>
              </div>
            )}

            {/* Author card */}
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-white to-blue-50/40 border border-primary/12 flex items-start gap-5"
              itemProp="author" itemScope itemType="https://schema.org/Person">
              <div className="w-14 h-14 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src="/logos/navyaedtech.webp" alt="Research Devkota" className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-lg mb-0.5" itemProp="name">Research Devkota</p>
                <p className="text-xs text-primary font-semibold mb-2" itemProp="jobTitle">Co-Founder @ Navya EdTech · Fullstack Developer</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Building enterprise software, LMS platforms, and cloud systems with Laravel, React, and Python. Based in Kathmandu, Nepal 🇳🇵
                </p>
                <div className="flex gap-4 mt-3">
                  {[
                    { label: 'GitHub',   href: 'https://github.com/itsresearch' },
                    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/researchdevkota/' },
                    { label: 'Medium',   href: 'https://medium.com/@devkotaresearch' },
                  ].map(l => (
                    <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline font-medium" itemProp="sameAs">{l.label}</a>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link to="/#blog" className="btn-secondary text-sm">
                <ArrowLeft size={14} /> All Posts
              </Link>
              <a href="https://medium.com/@devkotaresearch" target="_blank" rel="noopener noreferrer"
                className="btn-primary text-sm">
                More on Medium <ChevronRight size={14} />
              </a>
            </div>
          </motion.article>
        ) : null}
      </div>
    </div>
  );
};

export default BlogPost;
