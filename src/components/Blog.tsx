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

const CAT_CLS: Record<string, string> = {
  Backend:      'bg-blue-50   text-blue-700   border-blue-200',
  Frontend:     'bg-violet-50 text-violet-700 border-violet-200',
  Architecture: 'bg-amber-50  text-amber-700  border-amber-200',
  DevOps:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  'AI & ML':    'bg-pink-50   text-pink-700   border-pink-200',
  Career:       'bg-orange-50 text-orange-700 border-orange-200',
  General:      'bg-slate-50  text-slate-600  border-slate-200',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* ─── Skeleton ────────────────────────────────────────────────────── */
function BlogSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      <div className="h-1 w-full bg-secondary" />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-secondary rounded-full animate-pulse" />
          <div className="h-5 w-14 bg-secondary rounded-full animate-pulse ml-auto" />
        </div>
        <div className="h-6 bg-secondary rounded-lg w-3/4 animate-pulse" />
        <div className="h-4 bg-secondary rounded-lg w-full animate-pulse" />
        <div className="h-4 bg-secondary rounded-lg w-2/3 animate-pulse" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-14 bg-secondary rounded-full animate-pulse" />
          <div className="h-5 w-16 bg-secondary rounded-full animate-pulse" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-border/50">
          <div className="h-4 w-24 bg-secondary rounded animate-pulse" />
          <div className="h-4 w-20 bg-secondary rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ─── Post Card ───────────────────────────────────────────────────── */
function PostCard({ post, index, isInView }: { post: BlogPost; index: number; isInView: boolean }) {
  const hasContent = post.content?.trim().length > 0;
  const cls = "flex flex-col bg-white rounded-2xl border border-border hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group h-full";

  const inner = (
    <>
      <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex flex-col flex-1 p-6">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${CAT_CLS[post.category] ?? CAT_CLS.General}`}>
            {CAT_ICON[post.category]} {post.category}
          </span>
          {post.featured && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-semibold">Featured</span>
          )}
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={11} /> {post.reading_time} min
          </span>
        </div>

        <h3 className="font-display font-bold text-lg leading-snug mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-5">
          {post.excerpt}
        </p>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.slice(0, 3).map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/50">
                <Tag size={9} />{t}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <time dateTime={post.published_at} className="text-xs text-muted-foreground">{fmtDate(post.published_at)}</time>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all">
            Read More
            {hasContent || !post.external_url
              ? <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              : <ExternalLink size={13} />}
          </span>
        </div>
      </div>
    </>
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
        <Link to={`/blog/${post.slug}`} className={cls} itemProp="url">{inner}</Link>
      ) : post.external_url ? (
        <a href={post.external_url} target="_blank" rel="noopener noreferrer" className={cls} itemProp="url">{inner}</a>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </motion.article>
  );
}

/* ─── Main Component ──────────────────────────────────────────────── */
export const Blog = () => {
  const ref     = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [posts, setPosts]     = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState('All');
  const [showAll, setShowAll] = useState(false);

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
      className="py-24 relative bg-gradient-to-b from-white to-slate-50/60"
      aria-label="Blog articles by Research Devkota"
      itemScope itemType="https://schema.org/Blog"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="section-container relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="section-tag mb-4"><BookOpen size={12} /> Writing &amp; Insights</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Latest <span className="gradient-text">Blog Posts</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technical deep-dives, architecture decisions, and lessons learned building production-grade software in Nepal and beyond.
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
          const wrapCls = "block rounded-2xl overflow-hidden border border-primary/20 bg-white shadow-lg hover:shadow-xl transition-shadow duration-500 group mb-14";
          const inner = (
            <article itemScope itemType="https://schema.org/BlogPosting">
              <meta itemProp="datePublished" content={featured.published_at} />
              <meta itemProp="author" content="Research Devkota" />
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1.5 bg-gradient-to-b from-primary to-blue-400 hidden lg:block flex-shrink-0" />
                <div className="flex-1 p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white shadow-sm">⭐ Featured</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${CAT_CLS[featured.category] ?? CAT_CLS.General}`}>
                      {CAT_ICON[featured.category]} {featured.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{featured.reading_time} min read</span>
                    <time className="text-xs text-muted-foreground" dateTime={featured.published_at}>{fmtDate(featured.published_at)}</time>
                  </div>
                  <h3 className="font-display font-bold text-2xl lg:text-3xl mb-4 leading-snug group-hover:text-primary transition-colors duration-300" itemProp="headline">
                    {featured.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl" itemProp="description">{featured.excerpt}</p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {featured.tags?.map(t => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/60 flex items-center gap-1">
                          <Tag size={9} />{t}
                        </span>
                      ))}
                    </div>
                    <span className="btn-primary text-sm pointer-events-none">Read Article <ChevronRight size={14} /></span>
                  </div>
                </div>
              </div>
            </article>
          );
          return (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}>
              {hasContent
                ? <Link to={`/blog/${featured.slug}`} className={wrapCls}>{inner}</Link>
                : featured.external_url
                ? <a href={featured.external_url} target="_blank" rel="noopener noreferrer" className={wrapCls}>{inner}</a>
                : <div className={wrapCls}>{inner}</div>
              }
            </motion.div>
          );
        })()}

        {/* Category filter */}
        {!loading && !error && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-3 mb-10" role="tablist"
          >
            {displayedCats.map(cat => (
              <button key={cat} role="tab" aria-selected={activeCat === cat}
                onClick={() => { setActiveCat(cat); setShowAll(false); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCat === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <BookOpen size={40} className="mx-auto mb-4 opacity-20 text-muted-foreground" />
            <p className="font-medium text-muted-foreground">No posts in this category yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Check back soon!</p>
          </motion.div>
        )}

        {/* CTA */}
        {!loading && !error && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
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
