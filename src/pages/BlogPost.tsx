import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  ExternalLink,
  Share2,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { blogService } from '@/lib/blogService';
import type { BlogPost } from '@/types/blog';

/* ─── Helpers ─────────────────────────────────────────────────────── */
function formatDate(iso: string) {
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

function injectOGMeta(property: string, content: string) {
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
  const existing = document.getElementById('blog-post-schema');
  if (existing) existing.remove();

  const pageUrl = window.location.href;
  const imageUrl = post.og_image_url || post.cover_image_url || '';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: 'Research Devkota',
      url: 'https://devkotaresearch.com.np',
      sameAs: [
        'https://github.com/itsresearch',
        'https://www.linkedin.com/in/researchdevkota/',
        'https://medium.com/@devkotaresearch',
      ],
    },
    publisher: {
      '@type': 'Person',
      name: 'Research Devkota',
      url: 'https://devkotaresearch.com.np',
    },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: { '@type': 'WebPage', '@id': post.canonical_url || pageUrl },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
    inLanguage: 'en-US',
    url: post.canonical_url || pageUrl,
    ...(imageUrl ? { thumbnailUrl: imageUrl } : {}),
  };

  const script = document.createElement('script');
  script.id = 'blog-post-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

/* ─── Skeleton ────────────────────────────────────────────────────── */
const PostSkeleton = () => (
  <div className="max-w-3xl mx-auto animate-pulse">
    <div className="h-4 w-32 bg-secondary rounded mb-8" />
    <div className="h-8 bg-secondary rounded-lg w-3/4 mb-4" />
    <div className="h-8 bg-secondary rounded-lg w-1/2 mb-8" />
    <div className="flex gap-4 mb-10">
      <div className="h-5 w-28 bg-secondary rounded" />
      <div className="h-5 w-20 bg-secondary rounded" />
    </div>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className={`h-4 bg-secondary rounded mb-3 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

/* ─── Markdown prose styles ───────────────────────────────────────── */
const PROSE_COMPONENTS = {
  h1: ({ ...props }) => <h1 className="font-display text-3xl font-bold mt-10 mb-4 text-foreground" {...props} />,
  h2: ({ ...props }) => <h2 className="font-display text-2xl font-bold mt-8 mb-3 text-foreground" {...props} />,
  h3: ({ ...props }) => <h3 className="font-display text-xl font-semibold mt-6 mb-2 text-foreground" {...props} />,
  p: ({ ...props }) => <p className="mb-4 leading-relaxed text-foreground/90" {...props} />,
  ul: ({ ...props }) => <ul className="mb-4 ml-6 list-disc space-y-1" {...props} />,
  ol: ({ ...props }) => <ol className="mb-4 ml-6 list-decimal space-y-1" {...props} />,
  li: ({ ...props }) => <li className="leading-relaxed text-foreground/90" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-primary/50 italic text-muted-foreground bg-primary/5 py-2 pr-4 rounded-r-lg" {...props} />
  ),
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { className?: string }) => {
    const isBlock = className?.includes('language-');
    return isBlock ? (
      <code className={`block bg-slate-900 text-slate-100 rounded-xl p-4 mb-4 overflow-x-auto text-sm font-mono leading-relaxed ${className}`} {...props}>
        {children}
      </code>
    ) : (
      <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
    );
  },
  pre: ({ ...props }) => <pre className="mb-4" {...props} />,
  a: ({ href, ...props }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" {...props} />
  ),
  img: ({ alt, ...props }) => (
    <img className="rounded-xl my-6 w-full object-cover shadow-md" alt={alt} {...props} />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: ({ ...props }) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse border border-border rounded-lg text-sm" {...props} />
    </div>
  ),
  th: ({ ...props }) => <th className="bg-secondary text-foreground font-semibold px-4 py-2 text-left border border-border" {...props} />,
  td: ({ ...props }) => <td className="px-4 py-2 border border-border text-foreground/90" {...props} />,
};

/* ─── Page Component ──────────────────────────────────────────────── */
const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }

    blogService.getPostBySlug(slug).then((data) => {
      if (!data) { setNotFound(true); return; }
      setPost(data);

      /* ── SEO: inject all tags ────────────────────────────────── */
      const title = data.meta_title || data.title;
      const description = data.meta_description || data.excerpt;
      const image = data.og_image_url || data.cover_image_url;
      const pageUrl = window.location.href;

      document.title = `${title} | Research Devkota`;

      injectMeta('description', description);
      injectMeta('keywords', data.tags?.join(', '));
      injectMeta('author', 'Research Devkota');
      injectMeta('robots', 'index, follow');

      injectOGMeta('og:title', title);
      injectOGMeta('og:description', description);
      injectOGMeta('og:image', image);
      injectOGMeta('og:url', data.canonical_url || pageUrl);
      injectOGMeta('og:type', 'article');
      injectOGMeta('og:site_name', 'Research Devkota');
      injectOGMeta('article:published_time', data.published_at);
      injectOGMeta('article:modified_time', data.updated_at);
      injectOGMeta('article:author', 'Research Devkota');
      injectOGMeta('article:section', data.category);
      data.tags?.forEach((tag) => injectOGMeta('article:tag', tag));

      injectOGMeta('twitter:card', 'summary_large_image');
      injectOGMeta('twitter:title', title);
      injectOGMeta('twitter:description', description);
      injectOGMeta('twitter:image', image);
      injectOGMeta('twitter:creator', '@researchdevkota');

      injectCanonical(data.canonical_url || pageUrl);
      injectJSONLD(data);
    }).catch(() => {
      setNotFound(true);
    }).finally(() => setLoading(false));

    return () => {
      /* restore portfolio title when leaving */
      document.title = 'Research Devkota | Co-Founder, Navya EdTech';
      document.getElementById('blog-post-schema')?.remove();
    };
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  /* ── Not Found ─────────────────────────────────────────────────── */
  if (!loading && notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <AlertCircle size={48} className="text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">This article doesn't exist or has been unpublished.</p>
          <Link to="/#blog" className="btn-primary">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Progress bar top ────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-blue-400 to-accent z-50" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-24">

        {/* ── Back nav ────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
        </motion.div>

        {loading ? (
          <PostSkeleton />
        ) : post ? (
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            itemScope
            itemType="https://schema.org/BlogPosting"
          >
            {/* ── Category + tags ──────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <BookOpen size={11} />
                {post.category}
              </span>
              {post.featured && (
                <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-semibold">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* ── Title ────────────────────────────────────────────── */}
            <h1
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-balance"
              itemProp="headline"
            >
              {post.title}
            </h1>

            {/* ── Meta row ─────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground border-b border-border pb-8">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <img src="/logos/navyaedtech.webp" alt="Research Devkota" className="w-5 h-5 rounded-full object-cover" />
                Research Devkota
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                <time dateTime={post.published_at} itemProp="datePublished">
                  {formatDate(post.published_at)}
                </time>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {post.reading_time} min read
              </span>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 hover:text-primary transition-all duration-200 text-xs font-medium"
              >
                <Share2 size={13} />
                {copied ? 'Link copied!' : 'Share'}
              </button>
            </div>

            {/* ── Cover image ──────────────────────────────────────── */}
            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full rounded-2xl mb-10 shadow-md object-cover max-h-80"
                itemProp="image"
              />
            )}

            {/* ── Excerpt (if no full content) ─────────────────────── */}
            {!post.content?.trim() && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 italic border-l-4 border-primary/30 pl-4" itemProp="description">
                {post.excerpt}
              </p>
            )}

            {/* ── Full Markdown Content ─────────────────────────────── */}
            {post.content?.trim() && (
              <div className="prose-blog" itemProp="articleBody">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={PROSE_COMPONENTS}>
                  {post.content}
                </ReactMarkdown>
              </div>
            )}

            {/* ── Tags ─────────────────────────────────────────────── */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
                <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                  <Tag size={13} /> Tags:
                </span>
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── External link (cross-post) ────────────────────────── */}
            {post.external_url && (
              <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">Also published on Medium</p>
                <a
                  href={post.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm py-2"
                >
                  Read on Medium <ExternalLink size={13} />
                </a>
              </div>
            )}

            {/* ── Author card ───────────────────────────────────────── */}
            <div
              className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-blue-50 border border-primary/15 flex items-start gap-5"
              itemProp="author"
              itemScope
              itemType="https://schema.org/Person"
            >
              <img
                src="/logos/navyaedtech.webp"
                alt="Research Devkota"
                className="w-14 h-14 rounded-full border-2 border-primary/20 object-cover flex-shrink-0"
              />
              <div>
                <p className="font-display font-bold text-lg mb-0.5" itemProp="name">Research Devkota</p>
                <p className="text-xs text-primary font-semibold mb-2" itemProp="jobTitle">Co-Founder @ Navya EdTech · Fullstack Developer</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Building enterprise software, LMS platforms, and cloud systems with Laravel, React, and Python. Based in Kathmandu, Nepal 🇳🇵
                </p>
                <div className="flex gap-3 mt-3">
                  <a href="https://github.com/itsresearch" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline" itemProp="sameAs">GitHub</a>
                  <a href="https://www.linkedin.com/in/researchdevkota/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline" itemProp="sameAs">LinkedIn</a>
                  <a href="https://medium.com/@devkotaresearch" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline" itemProp="sameAs">Medium</a>
                </div>
              </div>
            </div>

            {/* ── Back to blog ─────────────────────────────────────── */}
            <div className="mt-10 text-center">
              <Link to="/#blog" className="btn-secondary">
                <ArrowLeft size={15} /> Back to All Posts
              </Link>
            </div>
          </motion.article>
        ) : null}
      </div>
    </div>
  );
};

export default BlogPost;
