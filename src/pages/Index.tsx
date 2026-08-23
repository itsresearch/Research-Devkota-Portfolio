import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

// Critical above-fold — load immediately
import { Navbar }          from '@/components/Navbar';
import { Hero }            from '@/components/Hero';
import { CustomCursor }    from '@/components/CustomCursor';
import { FloatingBackground } from '@/components/FloatingBackground';
import { WebGLBackground } from '@/components/WebGLBackground';

// Below-fold — lazy loaded so they don't block initial paint
const VisionBanner   = lazy(() => import('@/components/VisionBanner').then(m => ({ default: m.VisionBanner })));
const About          = lazy(() => import('@/components/About').then(m => ({ default: m.About })));
const Experience     = lazy(() => import('@/components/Experience').then(m => ({ default: m.Experience })));
const Skills         = lazy(() => import('@/components/Skills').then(m => ({ default: m.Skills })));
const Projects       = lazy(() => import('@/components/Projects').then(m => ({ default: m.Projects })));
const Education      = lazy(() => import('@/components/Education').then(m => ({ default: m.Education })));
const Certifications = lazy(() => import('@/components/Certifications').then(m => ({ default: m.Certifications })));
const Blog           = lazy(() => import('@/components/Blog').then(m => ({ default: m.Blog })));
const Contact        = lazy(() => import('@/components/Contact').then(m => ({ default: m.Contact })));
const Footer         = lazy(() => import('@/components/Footer').then(m => ({ default: m.Footer })));

gsap.registerPlugin(ScrollTrigger);

// Minimal section placeholder shown while lazy chunks load
const SectionFallback = () => (
  <div className="py-32 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

const Index = () => {
  const [showAllCertifications, setShowAllCertifications] = useState(false);
  const lenisRef = useRef<{ raf: (t: number) => void; destroy: () => void } | null>(null);

  useEffect(() => {
    document.title = 'Research Devkota | Co-Founder, Navya EdTech';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Research Devkota — Co-Founder of Navya EdTech, Fullstack Developer (Laravel + React + Python), Python Instructor, building enterprise ERP, LMS & cloud systems in Nepal.'
    );

    /* ── Lenis smooth scroll ─────────────────────────────── */
    let lenis: typeof lenisRef.current = null;

    // Store tick reference so it can be properly removed on cleanup
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
      {/* Three.js WebGL galaxy background — lazy-loaded internally */}
      <WebGLBackground />

      {/* Floating tech icons background layer */}
      <FloatingBackground />

      {/* Custom cursor (desktop) */}
      <CustomCursor />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero is above-fold — always eager */}
        <Hero />

        <Suspense fallback={<SectionFallback />}>
          <VisionBanner />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>

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

        <Suspense fallback={<SectionFallback />}>
          <Blog />
        </Suspense>

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
