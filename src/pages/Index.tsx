import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomCursor } from '@/components/CustomCursor';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { VisionBanner } from '@/components/VisionBanner';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { Experience } from '@/components/Experience';
import { Education } from '@/components/Education';
import { Certifications } from '@/components/Certifications';
import { Blog } from '@/components/Blog';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { FloatingBackground } from '@/components/FloatingBackground';
import { WebGLBackground } from '@/components/WebGLBackground';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.35,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2.4,
      }) as unknown as typeof lenisRef.current;

      lenisRef.current = lenis;

      gsap.ticker.add((time) => { lenis?.raf(time * 1000); });
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
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Three.js WebGL galaxy background */}
      <WebGLBackground />

      {/* Floating tech icons background layer */}
      <FloatingBackground />

      {/* Custom cursor (desktop) */}
      <CustomCursor />

      <Navbar />

      <main style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <VisionBanner />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />

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

        <Blog />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
