import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Critical above-the-fold — eager
import { CustomCursor }   from '@/components/CustomCursor';
import { Navbar }         from '@/components/Navbar';
import { Hero }           from '@/components/Hero';
import { VisionBanner }   from '@/components/VisionBanner';
import { About }          from '@/components/About';

// Below-the-fold sections — lazy loaded to massively reduce initial JS
const Experience      = lazy(() => import('@/components/Experience').then(m => ({ default: m.Experience })));
const Skills          = lazy(() => import('@/components/Skills').then(m => ({ default: m.Skills })));
const Projects        = lazy(() => import('@/components/Projects').then(m => ({ default: m.Projects })));
const Education       = lazy(() => import('@/components/Education').then(m => ({ default: m.Education })));
const Certifications  = lazy(() => import('@/components/Certifications').then(m => ({ default: m.Certifications })));
const Blog            = lazy(() => import('@/components/Blog').then(m => ({ default: m.Blog })));
const Contact         = lazy(() => import('@/components/Contact').then(m => ({ default: m.Contact })));
const Footer          = lazy(() => import('@/components/Footer').then(m => ({ default: m.Footer })));

// Heavy animated backgrounds — lazy loaded, don't block paint
const FloatingBackground = lazy(() => import('@/components/FloatingBackground').then(m => ({ default: m.FloatingBackground })));
const WebGLBackground    = lazy(() => import('@/components/WebGLBackground').then(m => ({ default: m.WebGLBackground })));

gsap.registerPlugin(ScrollTrigger);

/** Invisible placeholder shown while lazy sections load — preserves layout */
const SectionFallback = () => <div style={{ minHeight: '200px' }} />;

const Index = () => {
  const [showAllCertifications, setShowAllCertifications] = useState(false);
  const lenisRef = useRef<{ raf: (t: number) => void; destroy: () => void } | null>(null);

  // Refresh ScrollTrigger when certifications expand (page height changes)
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(t);
  }, [showAllCertifications]);

  useEffect(() => {
    document.title = 'Research Devkota | Co-Founder, Navya EdTech';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Research Devkota — Co-Founder of Navya EdTech, Python & Django Developer, DevOps Engineer. Building enterprise ERP, LMS & cloud systems in Nepal. Python Instructor at Mero Coding Class.'
    );

    /* ── Lenis smooth scroll ─────────────────────────────── */
    let lenis: typeof lenisRef.current = null;

    const rafTick = (time: number) => { lenis?.raf(time * 1000); };

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.35,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2.4,
      }) as unknown as typeof lenisRef.current;

      lenisRef.current = lenis;

      gsap.ticker.add(rafTick);
      gsap.ticker.lagSmoothing(0);

      (lenis as unknown as { on: (event: string, cb: () => void) => void })
        .on('scroll', ScrollTrigger.update);
    });

    /* ── Scroll to hash ──────────────────────────────────── */
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    }

    return () => {
      lenis?.destroy();
      gsap.ticker.remove(rafTick);
      lenisRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Heavy animated backgrounds — deferred so they never block paint */}
      <Suspense fallback={null}>
        <WebGLBackground />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingBackground />
      </Suspense>

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* ── Above the fold — eager ── */}
        <Hero />
        <VisionBanner />
        <About />

        {/* ── Below the fold — lazy ── */}
        <Suspense fallback={<SectionFallback />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Education />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          {showAllCertifications ? (
            <Certifications />
          ) : (
            <>
              <Certifications limit={6} />
              <div className="text-center pb-20">
                <button
                  onClick={() => setShowAllCertifications(true)}
                  className="btn-secondary"
                >
                  View All Certifications
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </Suspense>

        {/* Blog preview section */}
        <Suspense fallback={<SectionFallback />}>
          <Blog />
        </Suspense>

        {/* "View All Posts" CTA below the blog section */}
        <div className="text-center pb-6" style={{ position: 'relative', zIndex: 2 }}>
          <Link to="/blog" className="btn-primary inline-flex items-center gap-2">
            View All Blog Posts <ChevronRight size={15} />
          </Link>
        </div>

        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
