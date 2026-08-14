import { useEffect, useRef } from 'react';
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
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [showAllCertifications, setShowAllCertifications] = useState(false);
  const lenisRef = useRef<{ raf: (t: number) => void; destroy: () => void } | null>(null);

  useEffect(() => {
    document.title = 'Research Devkota | Co-Founder, Navya EdTech';

    /* ── Lenis smooth scroll ───────────────────────────────────────── */
    let lenis: typeof lenisRef.current = null;

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
      }) as unknown as typeof lenisRef.current;

      lenisRef.current = lenis;

      /* Sync Lenis with GSAP ticker */
      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      /* Sync Lenis with ScrollTrigger */
      (lenis as unknown as { on: (event: string, cb: () => void) => void })
        .on('scroll', ScrollTrigger.update);
    });

    /* ── Scroll to hash on load ───────────────────────────────────── */
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }

    return () => {
      lenis?.destroy();
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Custom cursor — desktop only */}
      <CustomCursor />

      <Navbar />

      <main>
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
            <div className="text-center pb-16">
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
