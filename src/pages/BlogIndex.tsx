import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Tag, Search, BookOpen, ChevronRight,
  ArrowRight, TrendingUp, Code2, Lightbulb, Rocket,
  Brain, Briefcase, AlertCircle, Calendar, Rss,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { blogService } from '@/lib/blogService';
import type { BlogPost } from '@/types/blog';

/* ─── Category icons ──────────────────────────────────────────────── */
const CAT_ICON: Record<string, React.ReactNode> = {
  Backend:      <Code2      size={12} />,
  Frontend:     <Rocket     size={12} />,
  Architecture: <Lightbulb  size={12} />,
  DevOps:       <TrendingUp size={12} />,
  'AI & ML':    <Brain      size={12} />,
  Career:       <Briefcase  size={12} />,
  General:      <BookOpen   size={12} />,
};

const CAT_COLOR: Record<string, string> = {
  Backend:      'bg-indigo-50 text-indigo-700 border-indigo-200',
  Frontend:     'bg-violet-50 text-violet-700 border-violet-200',
  Architecture: 'bg-amber-50 text-amber-700 border-amber-200',
  DevOps:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  'AI & ML':    'bg-pink-50 text-pink-700 border-pink-200',
  Career:       'bg-orange-50 text-orange-700 border-orange-200',
  General:      'bg-slate-100 text-slate-600 border-slate-200',
};

function catCls(cat: string) {
  return CAT_COLOR[cat] ?? CAT_COLOR.General;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function fmtDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

const ALL_CATS = ['All', 'General', 'DevOps', 'Backend', 'Frontend', 'Architecture', 'AI & ML', 'Career'];
const PER_PAGE = 9;

/* ─── Skeleton ────────────────────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-100" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-20 bg-slate-100 rounded-full" />
        <div className="h-6 bg-slate-100 rounded-lg w-5/6" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-14 bg-slate-100 rounded-full" />
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ─── Featured Hero Card ──────────────────────────────────────────── */
function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block"
      itemProp="url"
    >
      <article
        className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
        itemScope
        itemType="https://schema.org/BlogPosting"
      >
        <meta itemProp="datePublished" content={post.published_at} />
        <meta itemProp="author" content="Research Devkota" />
        <meta itemProp="headline" content={post.title} />

        {/* Cover image */}
        {post.cover_image_url ? (
          <div className="relative h-72 md:h-80 overflow-hidden">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
              itemProp="image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Overlay text */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  ⭐ Featured
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-white/90 ${catCls(post.category)}`}>
                  {CAT_ICON[post.category]} {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-white/80 ml-auto">
                  <Clock size={11} /> {post.reading_time} min read
                </span>
              </div>
              <h2 className="font-bold text-2xl md:text-3xl text-white leading-snug mb-2 group-hover:text-white/90 transition-colors" itemProp="headline">
                {post.title}
              </h2>
              <p className="text-white/75 text-sm line-clamp-2 hidden sm:block" itemProp="description">
                {post.excerpt}
              </p>
            </div>
          </div>
        ) : (
          /* No cover image fallback */
          <div className="p-8 md:p-10 bg-gradient-to-br from-indigo-600 to-violet-700 text-white min-h-[260px] flex flex-col justify-end">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                ⭐ Featured
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-indigo-700 border border-white/30">
                {CAT_ICON[post.category]} {post.category}
              </span>
            </div>
            <h2 className="font-bold text-2xl md:text-3xl leading-snug mb-2" itemProp="headline">
              {post.title}
            </h2>
            <p className="text-white/80 text-sm line-clamp-2" itemProp="description">{post.excerpt}</p>
          </div>
        )}

        {/* Bottom meta */}
        <div className="px-8 py-5 flex items-center justify-between border-t border-slate-100 bg-white">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              Research Devkota
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              <time dateTime={post.published_at}>{fmtDateLong(post.published_at)}</time>
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 group-hover:gap-2.5 transition-all">
            Read Article <ArrowRight size={14} />
          </span>
        </div>
      </article>
    </Link>
  );
}

/* ─── Post Card ───────────────────────────────────────────────────── */
function PostCard({ post }: { post: BlogPost }) {
  const hasContent = post.content?.trim().length > 0;

  const inner = (
    <article
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      <meta itemProp="datePublished" content={post.published_at} />
      <meta itemProp="author" content="Research Devkota" />
      <meta itemProp="headline" content={post.title} />

      {/* Cover image */}
      {post.cover_image_url && (
        <div className="h-44 overflow-hidden flex-shrink-0">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            itemProp="image"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Category + reading time */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${catCls(post.category)}`}>
            {CAT_ICON[post.category]} {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={11} /> {post.reading_time} min
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-lg text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors"
          itemProp="headline"
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1" itemProp="description">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map(t => (
              <span
                key={t}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200"
              >
                <Tag size={9} />{t}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <time
            dateTime={post.published_at}
            className="text-xs text-slate-400"
          >
            {fmtDate(post.published_at)}
          </time>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:gap-2 transition-all">
            Read More <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </article>
  );

  if (hasContent) {
    return <Link to={`/blog/${post.slug}`} className="block h-full" itemProp="url">{inner}</Link>;
  }
  if (post.external_url) {
    return <a href={post.external_url} target="_blank" rel="noopener noreferrer" className="block h-full" itemProp="url">{inner}</a>;
  }
  return <div className="h-full">{inner}</div>;
}

/* ─── Main Page ───────────────────────────────────────────────────── */
const BlogIndex = () => {
  const [posts, setPosts]     = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [search, setSearch]   = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [page, setPage]       = useState(1);

  /* SEO */
  useEffect(() => {
    document.title = 'Blog — Research Devkota';
    const setMeta = (sel: string, attr: string, val: string, content: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, val); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('meta[name="description"]', 'name', 'description',
      'Technical articles, tutorials, and insights by Research Devkota — Co-Founder of Navya EdTech. Topics: DevOps, Laravel, React, Python, Nepal tech scene, and more.');
    setMeta('meta[property="og:title"]', 'property', 'og:title', 'Blog — Research Devkota');
    setMeta('meta[property="og:type"]',  'property', 'og:type',  'website');
    setMeta('meta[name="robots"]', 'name', 'robots', 'index, follow');

    /* JSON-LD breadcrumb */
    const s = document.createElement('script');
    s.id = 'blog-index-jsonld';
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Research Devkota Blog',
      description: 'Technical articles by Research Devkota',
      url: window.location.href,
      author: {
        '@type': 'Person',
        name: 'Research Devkota',
        url: 'https://devkotaresearch.com.np',
      },
    });
    document.head.appendChild(s);

    return () => {
      document.title = 'Research Devkota | Co-Founder, Navya EdTech';
      document.getElementById('blog-index-jsonld')?.remove();
    };
  }, []);

  useEffect(() => {
    blogService.getPublishedPosts()
      .then(setPosts)
      .catch(() => setError('Could not load posts. Please check your connection and try again.'))
      .finally(() => setLoading(false));
  }, []);

  /* Filter + search */
  const filtered = useMemo(() => {
    let list = posts;
    if (activeCat !== 'All') list = list.filter(p => p.category === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, activeCat, search]);

  const featured   = posts.find(p => p.featured);
  const nonFeatured = filtered.filter(p => !p.featured || activeCat !== 'All' || search.trim());
  const totalPages  = Math.ceil(nonFeatured.length / PER_PAGE);
  const paginated   = nonFeatured.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const availableCats = useMemo(() => {
    const cats = new Set(posts.map(p => p.category));
    return ALL_CATS.filter(c => c === 'All' || cats.has(c));
  }, [posts]);

  const handleCat = (cat: string) => { setActiveCat(cat); setPage(1); };
  const handleSearch = (q: string) => { setSearch(q); setPage(1); };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <Navbar />

      {/* ── Hero header ───────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 mb-4">
                <Rss size={11} /> Research Devkota's Blog
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                Articles & Insights
              </h1>
              <p className="mt-3 text-slate-500 text-lg max-w-2xl leading-relaxed">
                Technical deep-dives, tutorials, and lessons learned building
                production software in Nepal and beyond.
              </p>
            </div>

            {/* Search */}
            <div className="relative flex-shrink-0 w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search articles…"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all shadow-sm"
                aria-label="Search articles"
              />
            </div>
          </div>

          {/* Category pills */}
          {!loading && !error && (
            <div className="flex flex-wrap gap-2 mt-8" role="tablist" aria-label="Filter by category">
              {availableCats.map(cat => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCat === cat}
                  onClick={() => handleCat(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                    ${activeCat === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                >
                  {cat !== 'All' && CAT_ICON[cat]}{cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertCircle size={40} className="text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Could not load posts</h2>
            <p className="text-slate-500 text-sm max-w-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-pulse mb-10">
              <div className="h-72 bg-slate-100" />
              <div className="p-8 space-y-3">
                <div className="h-4 w-24 bg-slate-100 rounded-full" />
                <div className="h-8 bg-slate-100 rounded-lg w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          </>
        )}

        {!loading && !error && (
          <>
            {/* Stats bar */}
            {posts.length > 0 && (
              <div className="flex items-center justify-between mb-8 text-sm text-slate-500">
                <span>
                  {search || activeCat !== 'All'
                    ? `${filtered.length} article${filtered.length !== 1 ? 's' : ''} found`
                    : `${posts.length} article${posts.length !== 1 ? 's' : ''} published`}
                </span>
                {(search || activeCat !== 'All') && (
                  <button
                    onClick={() => { handleSearch(''); handleCat('All'); }}
                    className="text-indigo-600 hover:underline text-xs font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Featured post — only show when no filter/search */}
            {featured && !search.trim() && activeCat === 'All' && (
              <div className="mb-10" itemScope itemType="https://schema.org/Blog">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Featured Article
                </p>
                <FeaturedCard post={featured} />
              </div>
            )}

            {/* Grid */}
            {paginated.length > 0 && (
              <>
                {(!search.trim() && activeCat === 'All' && featured) && (
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    Latest Articles
                  </p>
                )}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  itemScope
                  itemType="https://schema.org/Blog"
                >
                  {paginated.map(p => <PostCard key={p.id} post={p} />)}
                </div>
              </>
            )}

            {/* Empty */}
            {filtered.length === 0 && (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
                  <BookOpen size={28} className="text-slate-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-700 mb-2">No articles found</h2>
                <p className="text-slate-400 text-sm">
                  {search ? `No results for "${search}".` : 'No posts in this category yet.'}
                </p>
                <button
                  onClick={() => { handleSearch(''); handleCat('All'); }}
                  className="mt-5 text-sm text-indigo-600 hover:underline font-medium"
                >
                  View all articles
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all border
                      ${page === n
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Newsletter / CTA */}
            {posts.length > 0 && (
              <div className="mt-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-10 text-center text-white">
                <h2 className="text-2xl font-bold mb-2">Enjoyed the articles?</h2>
                <p className="text-white/80 mb-6 text-sm max-w-md mx-auto">
                  Follow on Medium for more technical writing, or get in touch to collaborate.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://medium.com/@devkotaresearch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/30"
                  >
                    <BookOpen size={15} /> Follow on Medium
                  </a>
                  <Link
                    to="/#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
                  >
                    Get in Touch <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogIndex;
