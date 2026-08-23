import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Tag, ExternalLink, BookOpen, ChevronRight,
  TrendingUp, Code2, Lightbulb, Rocket, AlertCircle,
  Brain, Briefcase,
} from 'lucide-react';
import { blogService } from '@/lib/blogService';
import type { BlogPost } from '@/types/blog';

/* ─── Category meta ───────────────────────────────────────────────── */
const ALL_CATS = ['All', 'Backend', 'Frontend', 'Architecture', 'DevOps', 'AI & ML', 'Career', 'General'];

const CAT_ICON: Record<string, React.ReactNode> = {
  Backend:      <Code2      size={13} />,
  Frontend:     <Rocket     size={13} />,
  Architecture: <Lightbulb  size={13} />,
  DevOps:       <TrendingUp size={13} />,
  'AI & ML':    <Brain      size={13} />,
  Career:       <Briefcase  size={13} />,
  General:      <BookOpen   size={13} />,
};

/* Dark-theme category badge colours — using CSS custom properties */
const CAT_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Backend:      { color: '#818cf8', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.25)'  },
  Frontend:     { color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)'  },
  Architecture: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)'  },
  DevOps:       { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)'  },
  'AI & ML':    { color: '#f472b6', bg: 'rgba(244,114,182,0.12)',border: 'rgba(244,114,182,0.25)' },
  Career:       { color: '#fb923c', bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.25)'  },
  General:      { color: '#94a3b8', bg: 'rgba(148,163,184,0.10)',border: 'rgba(148,163,184,0.2)'  },
};

function getCatStyle(cat: string) {
  return CAT_STYLE[cat] ?? CAT_STYLE.General;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ─── Skeleton ────────────────────────────────────────────────────── */
function BlogSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: 'hsl(var(--surface) / 0.7)',
      border: '1px solid hsl(var(--border))',
      backdropFilter: 'blur(12px)',
    }}>
      <div className="h-1 w-full" style={{ background: 'hsl(var(--border))' }} />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full animate-pulse" style={{ background: 'hsl(var(--secondary))' }} />
          <div className="h-5 w-14 rounded-full animate-pulse ml-auto" style={{ background: 'hsl(var(--secondary))' }} />
        </div>
        <div className="h-6 rounded-lg w-3/4 animate-pulse" style={{ background: 'hsl(var(--secondary))' }} />
        <div className="h-4 rounded-lg w-full animate-pulse" style={{ background: 'hsl(var(--secondary))' }} />
        <div className="h-4 rounded-lg w-2/3 animate-pulse" style={{ background: 'hsl(var(--secondary))' }} />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-14 rounded-full animate-pulse" style={{ background: 'hsl(var(--secondary))' }} />
          <div className="h-5 w-16 rounded-full animate-pulse" style={{ background: 'hsl(var(--secondary))' }} />
        </div>
        <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid hsl(var(--border))' }}>
          <div className="h-4 w-24 rounded animate-pulse" style={{ background: 'hsl(var(--secondary))' }} />
          <div className="h-4 w-20 rounded animate-pulse" style={{ background: 'hsl(var(--secondary))' }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Post Card ───────────────────────────────────────────────────── */
function PostCard({ post, index, isInView }: { post: BlogPost; index: number; isInView: boolean }) {
  const hasContent = post.content?.trim().length > 0;
  const cs = getCatStyle(post.category);

  const cardStyle: React.CSSProperties = {
    background: 'hsl(var(--surface) / 0.7)',
    border: '1px solid hsl(var(--border))',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const inner = (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden group" style={cardStyle}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(var(--primary) / 0.35)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 40px hsl(var(--primary) / 0.1)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(var(--border))';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
        (e.currentTarget as HTMLDivElement).style.transform = '';
      }}
    >
      {/* Top accent bar */}
      <div className="h-[3px] w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))' }} />

      <div className="flex flex-col flex-1 p-6">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ color: cs.color, background: cs.bg, border: `1px solid ${cs.border}` }}
          >
            {CAT_ICON[post.category]} {post.category}
          </span>
          {post.featured && (
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: 'hsl(var(--accent-warm) / 0.15)', color: 'hsl(var(--accent-warm))', border: '1px solid hsl(var(--accent-warm) / 0.3)' }}>
              Featured
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={11} /> {post.reading_time} min
          </span>
        </div>

        <h3 className="font-display font-bold text-lg leading-snug mb-3 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-5 flex-1">
          {post.excerpt}
        </p>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.slice(0, 3).map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-muted-foreground"
                style={{ background: 'hsl(var(--surface-2) / 0.8)', border: '1px solid hsl(var(--border))' }}>
                <Tag size={9} />{t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4"
          style={{ borderTop: '1px solid hsl(var(--border))' }}>
          <time dateTime={post.published_at} className="text-xs text-muted-foreground">{fmtDate(post.published_at)}</time>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Read More
            {hasContent || !post.external_url
              ? <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              : <ExternalLink size={13} />}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.08 }}
      itemScope itemType="https://schema.org/BlogPosting"
      className="h-full"
    >
      <meta itemProp="datePublished" content={post.published_at} />
      <meta itemProp="author" content="Research Devkota" />
      <meta itemProp="headline" content={post.title} />

      {hasContent ? (
        <Link to={`/blog/${post.slug}`} className="block h-full" itemProp="url">{inner}</Link>
      ) : post.external_url ? (
        <a href={post.external_url} target="_blank" rel="noopener noreferrer" className="block h-full" itemProp="url">{inner}</a>
      ) : (
        <div className="h-full">{inner}</div>
      )}
    </motion.article>
  );
}

/* ─── Main Component ──────────────────────────────────────────────── */
export const Blog = () => {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [posts, setPosts]         = useState<BlogPost[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState('All');
  const [showAll, setShowAll]     = useState(false);

  useEffect(() => {
    blogService.getPublishedPosts()
      .then(setPosts)
      .catch(() => setError('Failed to load blog posts.'))
      .finally(() => setLoading(false));
  }, []);

  const availableCats = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
  const displayedCats = ALL_CATS.filter(c => availableCats.includes(c));

  const filtered  = posts.filter(p => activeCat === 'All' || p.category === activeCat);
  const displayed = showAll ? filtered : filtered.slice(0, 3);
  const featured  = posts.find(p => p.featured);

  return (
    <section
      id="blog"
      ref={ref}
      className="py-32 relative"
      aria-label="Blog articles by Research Devkota"
      itemScope itemType="https://schema.org/Blog"
    >
      {/* Subtle background glow */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] rounded-full blur-[160px] opacity-5 pointer-events-none"
        style={{ background: 'hsl(var(--primary))' }} />

      <div className="section-container relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="section-tag mb-5"><BookOpen size={12} /> Writing &amp; Insights</p>
          <h2 className="font-display text-5xl sm:text-6xl font-bold mb-6">
            Latest <span className="gradient-text">Blog Posts</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Technical deep-dives, architecture decisions, and lessons learned building
            production-grade software in Nepal and beyond.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
            <AlertCircle size={18} className="text-destructive" /> {error}
          </motion.div>
        )}

        {/* Featured post */}
        {!loading && !error && featured && (() => {
          const hasContent = featured.content?.trim().length > 0;
          const cs = getCatStyle(featured.category);
          const inner = (
            <article itemScope itemType="https://schema.org/BlogPosting" className="group">
              <meta itemProp="datePublished" content={featured.published_at} />
              <meta itemProp="author" content="Research Devkota" />
              <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  background: 'hsl(var(--surface) / 0.7)',
                  border: '1px solid hsl(var(--primary) / 0.25)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 60px hsl(var(--primary) / 0.08)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(var(--primary) / 0.5)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 24px 64px rgba(0,0,0,0.6), 0 0 80px hsl(var(--primary) / 0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(var(--primary) / 0.25)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.4), 0 0 60px hsl(var(--primary) / 0.08)';
                }}
              >
                {/* Left accent bar */}
                <div className="lg:w-1.5 flex-shrink-0 hidden lg:block"
                  style={{ background: 'linear-gradient(180deg, hsl(var(--primary)), hsl(var(--accent)))' }} />

                <div className="flex-1 p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                      style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(248 80% 58%))' }}>
                      ⭐ Featured
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ color: cs.color, background: cs.bg, border: `1px solid ${cs.border}` }}
                    >
                      {CAT_ICON[featured.category]} {featured.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />{featured.reading_time} min read
                    </span>
                    <time className="text-xs text-muted-foreground" dateTime={featured.published_at}>
                      {fmtDate(featured.published_at)}
                    </time>
                  </div>

                  <h3 className="font-display font-bold text-2xl lg:text-3xl mb-4 leading-snug text-foreground group-hover:text-primary transition-colors duration-300"
                    itemProp="headline">
                    {featured.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl text-base" itemProp="description">
                    {featured.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {featured.tags?.map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1 text-muted-foreground"
                          style={{ background: 'hsl(var(--surface-2) / 0.8)', border: '1px solid hsl(var(--border))' }}>
                          <Tag size={9} />{t}
                        </span>
                      ))}
                    </div>
                    <span className="btn-primary text-sm pointer-events-none">
                      Read Article <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );

          return (
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-14"
            >
              {hasContent
                ? <Link to={`/blog/${featured.slug}`}>{inner}</Link>
                : featured.external_url
                ? <a href={featured.external_url} target="_blank" rel="noopener noreferrer">{inner}</a>
                : <div>{inner}</div>
              }
            </motion.div>
          );
        })()}

        {/* Category filter */}
        {!loading && !error && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-3 mb-12" role="tablist"
          >
            {displayedCats.map(cat => (
              <button key={cat} role="tab" aria-selected={activeCat === cat}
                onClick={() => { setActiveCat(cat); setShowAll(false); }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
                style={activeCat === cat ? {
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(248 80% 58%))',
                  color: 'white',
                  boxShadow: '0 4px 24px hsl(var(--primary) / 0.45)',
                  transform: 'scale(1.05)',
                } : {
                  background: 'hsl(var(--surface) / 0.7)',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--muted-foreground))',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {cat !== 'All' && CAT_ICON[cat]}{cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <BlogSkeleton key={i} />)
            : displayed.map((p, i) => <PostCard key={p.id} post={p} index={i} isInView={isInView} />)
          }
        </div>

        {/* Empty state */}
        {!loading && !error && displayed.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'hsl(var(--surface-2))', border: '1px solid hsl(var(--border))' }}>
              <BookOpen size={28} className="text-muted-foreground opacity-50" />
            </div>
            <p className="font-semibold text-foreground mb-1">No posts in this category yet.</p>
            <p className="text-sm text-muted-foreground">Check back soon!</p>
          </motion.div>
        )}

        {/* CTA */}
        {!loading && !error && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14"
          >
            {filtered.length > 3 && (
              <button onClick={() => setShowAll(v => !v)} className="btn-secondary" aria-expanded={showAll}>
                {showAll ? 'Show Less' : `View All ${filtered.length} Posts`}
                <ChevronRight size={15} className={`transition-transform ${showAll ? 'rotate-90' : ''}`} />
              </button>
            )}
            <a href="https://medium.com/@devkotaresearch" target="_blank" rel="noopener noreferrer" className="btn-primary">
              <BookOpen size={15} /> Follow on Medium
            </a>
          </motion.div>
        )}

        {/* Schema.org author */}
        <div className="sr-only" itemProp="author" itemScope itemType="https://schema.org/Person">
          <span itemProp="name">Research Devkota</span>
          <a itemProp="url" href="https://github.com/itsresearch">github.com/itsresearch</a>
        </div>
      </div>
    </section>
  );
};
