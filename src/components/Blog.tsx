import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Tag,
  ExternalLink,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Code2,
  Lightbulb,
  Rocket,
  AlertCircle,
  Brain,
  Briefcase,
} from 'lucide-react';
import { blogService } from '@/lib/blogService';
import type { BlogPost } from '@/types/blog';

/* ─── Category config ─────────────────────────────────────────────── */
const ALL_CATEGORIES = ['All', 'Backend', 'Frontend', 'Architecture', 'DevOps', 'AI & ML', 'Career', 'General'];

const categoryIcons: Record<string, React.ReactNode> = {
  Backend:      <Code2 size={13} />,
  Frontend:     <Rocket size={13} />,
  Architecture: <Lightbulb size={13} />,
  DevOps:       <TrendingUp size={13} />,
  'AI & ML':    <Brain size={13} />,
  Career:       <Briefcase size={13} />,
  General:      <BookOpen size={13} />,
};

const categoryColors: Record<string, string> = {
  Backend:      'bg-blue-50 text-blue-700 border-blue-200',
  Frontend:     'bg-violet-50 text-violet-700 border-violet-200',
  Architecture: 'bg-amber-50 text-amber-700 border-amber-200',
  DevOps:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  'AI & ML':    'bg-pink-50 text-pink-700 border-pink-200',
  Career:       'bg-orange-50 text-orange-700 border-orange-200',
  General:      'bg-slate-50 text-slate-600 border-slate-200',
};

/* ─── Helpers ─────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

/* ─── Skeleton Card ───────────────────────────────────────────────── */
const BlogSkeleton = () => (
  <div className="rounded-2xl border border-border bg-white overflow-hidden">
    <div className="h-1 w-full bg-secondary animate-shimmer" />
    <div className="p-6 space-y-3">
      <div className="flex gap-2">
        <div className="h-5 w-20 bg-secondary rounded-full animate-pulse" />
        <div className="h-5 w-16 bg-secondary rounded-full animate-pulse ml-auto" />
      </div>
      <div className="h-6 bg-secondary rounded-lg w-3/4 animate-pulse" />
      <div className="h-4 bg-secondary rounded-lg w-full animate-pulse" />
      <div className="h-4 bg-secondary rounded-lg w-2/3 animate-pulse" />
      <div className="flex gap-2 pt-2">
        <div className="h-5 w-14 bg-secondary rounded-full animate-pulse" />
        <div className="h-5 w-18 bg-secondary rounded-full animate-pulse" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-border/50">
        <div className="h-4 w-24 bg-secondary rounded animate-pulse" />
        <div className="h-4 w-20 bg-secondary rounded animate-pulse" />
      </div>
    </div>
  </div>
);

/* ─── Post Card ────────────────────────────────────────────────────── */
const PostCard = ({ post, index, isInView }: { post: BlogPost; index: number; isInView: boolean }) => {
  const hasContent = post.content?.trim().length > 0;
  const linkTo = hasContent ? `/blog/${post.slug}` : (post.external_url || '#');
  const isExternal = !hasContent && !!post.external_url;

  const CardContent = () => (
    <div className="flex flex-col flex-1 p-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${categoryColors[post.category] ?? categoryColors.General}`}>
          {categoryIcons[post.category]}
          {post.category}
        </span>
        {post.featured && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-semibold">
            Featured
          </span>
        )}
        <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={11} />
          {post.reading_time} min
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
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/50">
              <Tag size={9} />{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <time dateTime={post.published_at} className="text-xs text-muted-foreground">
          {formatDate(post.published_at)}
        </time>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover/link:gap-2 transition-all duration-200">
          Read More
          {isExternal ? <ExternalLink size={13} /> : <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />}
        </span>
      </div>
    </div>
  );

  const wrapperClass = "flex flex-col bg-white rounded-2xl border border-border hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group group/link";

  return (
    <motion.article
      key={post.id}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.08 }}
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <meta itemProp="datePublished" content={post.published_at} />
      <meta itemProp="author" content="Research Devkota" />
      <meta itemProp="headline" content={post.title} />
      {isExternal ? (
        <a href={linkTo} target="_blank" rel="noopener noreferrer" className={wrapperClass} itemProp="url">
          <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent />
        </a>
      ) : (
        <Link to={linkTo} className={wrapperClass} itemProp="url">
          <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-400 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent />
        </Link>
      )}
    </motion.article>
  );
};

/* ─── Main Component ──────────────────────────────────────────────── */
export const Blog = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    blogService.getPublishedPosts()
      .then(setPosts)
      .catch(() => setError('Failed to load blog posts.'))
      .finally(() => setLoading(false));
  }, []);

  /* derive unique categories from actual posts */
  const availableCategories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];
  const displayedCategories = ALL_CATEGORIES.filter((c) => availableCategories.includes(c));

  const filtered = posts.filter((p) => activeCategory === 'All' || p.category === activeCategory);
  const displayed = showAll ? filtered : filtered.slice(0, 3);
  const featuredPost = posts.find((p) => p.featured);

  return (
    <section
      id="blog"
      ref={ref}
      className="py-24 relative bg-gradient-to-b from-white to-slate-50/60"
      aria-label="Blog articles by Research Devkota"
      itemScope
      itemType="https://schema.org/Blog"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="section-container relative">

        {/* ── Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="section-tag mb-4">
            <BookOpen size={12} />
            Writing &amp; Insights
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Latest <span className="gradient-text">Blog Posts</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technical deep-dives, architecture decisions, and lessons learned building
            production-grade software in Nepal and beyond.
          </p>
        </motion.div>

        {/* ── Error State ─────────────────────────────────────────── */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 py-12 text-muted-foreground"
          >
            <AlertCircle size={20} className="text-destructive" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* ── Featured Post ───────────────────────────────────────── */}
        {!loading && !error && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-14"
          >
            {(() => {
              const hasContent = featuredPost.content?.trim().length > 0;
              const Wrapper = ({ children }: { children: React.ReactNode }) =>
                hasContent
                  ? <Link to={`/blog/${featuredPost.slug}`} className="block">{children}</Link>
                  : featuredPost.external_url
                  ? <a href={featuredPost.external_url} target="_blank" rel="noopener noreferrer" className="block">{children}</a>
                  : <div>{children}</div>;

              return (
                <Wrapper>
                  <article
                    className="rounded-2xl overflow-hidden border border-primary/20 bg-white shadow-lg hover:shadow-xl transition-all duration-500 group"
                    itemScope
                    itemType="https://schema.org/BlogPosting"
                  >
                    <meta itemProp="datePublished" content={featuredPost.published_at} />
                    <meta itemProp="author" content="Research Devkota" />
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-2 bg-gradient-to-b from-primary to-blue-400 hidden lg:block flex-shrink-0" />
                      <div className="flex-1 p-8 lg:p-10">
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white shadow-sm shadow-primary/30">
                            ⭐ Featured
                          </span>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[featuredPost.category] ?? categoryColors.General}`}>
                            {categoryIcons[featuredPost.category]}
                            {featuredPost.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={12} />{featuredPost.reading_time} min read
                          </span>
                          <time dateTime={featuredPost.published_at} className="text-xs text-muted-foreground">
                            {formatDate(featuredPost.published_at)}
                          </time>
                        </div>
                        <h3 className="font-display font-bold text-2xl lg:text-3xl mb-4 leading-snug group-hover:text-primary transition-colors duration-300" itemProp="headline">
                          {featuredPost.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl" itemProp="description">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            {featuredPost.tags?.map((tag) => (
                              <span key={tag} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary/60 text-muted-foreground border border-border/60">
                                <Tag size={10} />{tag}
                              </span>
                            ))}
                          </div>
                          <span className="btn-primary text-sm pointer-events-none">
                            Read Article <ChevronRight size={15} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Wrapper>
              );
            })()}
          </motion.div>
        )}

        {/* ── Category Filter ──────────────────────────────────────── */}
        {!loading && !error && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
            role="tablist"
            aria-label="Filter blog posts by category"
          >
            {displayedCategories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => { setActiveCategory(cat); setShowAll(false); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {cat !== 'All' && categoryIcons[cat]}
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* ── Post Grid (skeletons while loading) ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <BlogSkeleton key={i} />)
            : displayed.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} isInView={isInView} />
              ))}
        </div>

        {/* ── Empty state ─────────────────────────────────────────── */}
        {!loading && !error && displayed.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground"
          >
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No posts in this category yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </motion.div>
        )}

        {/* ── Show More / CTA ──────────────────────────────────────── */}
        {!loading && !error && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            {filtered.length > 3 && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="btn-secondary"
                aria-expanded={showAll}
              >
                {showAll ? 'Show Less' : `View All ${filtered.length} Posts`}
                <ChevronRight size={16} className={`transition-transform duration-300 ${showAll ? 'rotate-90' : ''}`} />
              </button>
            )}
            <a
              href="https://medium.com/@devkotaresearch"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <BookOpen size={16} />
              Follow on Medium
            </a>
          </motion.div>
        )}

        {/* ── Schema.org invisible metadata ───────────────────────── */}
        <div className="sr-only" itemProp="author" itemScope itemType="https://schema.org/Person">
          <span itemProp="name">Research Devkota</span>
          <a itemProp="url" href="https://github.com/itsresearch">github.com/itsresearch</a>
        </div>
      </div>
    </section>
  );
};
