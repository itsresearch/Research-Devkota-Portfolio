import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Github, Linkedin, Mail, ArrowRight, Download, ExternalLink, MapPin, Building2, Code2, Server, Cpu } from 'lucide-react';
import { TypeWriter } from './TypeWriter';

/* ── Floating badge helper ─────────────────────────────────────────── */
const FloatingBadge = ({
  className, children, delay = 0,
}: { className: string; children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: -12, duration: 2.8 + delay * 0.5,
      repeat: -1, yoyo: true,
      ease: 'sine.inOut',
      delay,
    });
  }, [delay]);
  return (
    <div
      ref={ref}
      className={`absolute z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl ${className}`}
      style={{ background: 'hsl(var(--surface) / 0.9)' }}
    >
      {children}
    </div>
  );
};

/* ── Animated character title ──────────────────────────────────────── */
const AnimatedTitle = ({ text1, text2 }: { text1: string; text2: string }) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chars = el.querySelectorAll('.char');
    gsap.fromTo(
      chars,
      { opacity: 0, y: 80, rotateX: -90, transformOrigin: 'top center' },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'back.out(1.7)',
        delay: 0.4,
      },
    );
  }, []);

  const renderChars = (word: string, extra = '') =>
    word.split('').map((ch, i) => (
      <span key={i} className={`char inline-block ${extra}`} style={{ perspective: '400px' }}>
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ));

  return (
    <h1
      ref={containerRef}
      className="font-display font-bold tracking-tight leading-[1.04] mb-6 text-foreground overflow-visible"
      style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', perspective: '600px' }}
    >
      {renderChars(text1 + ' ')}
      <span className="gradient-text">{renderChars(text2)}</span>
    </h1>
  );
};

/* ── Main Hero ─────────────────────────────────────────────────────── */
export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* Content items stagger in */
      tl.fromTo(
        contentRef.current?.querySelectorAll('.hero-item') ?? [],
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
        0.3,
      );

      /* Photo slides in */
      tl.fromTo(
        photoRef.current,
        { opacity: 0, x: 60, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power2.out' },
        0.2,
      );

      /* Parallax on scroll */
      gsap.to(sectionRef.current, {
        backgroundPositionY: '30%',
        scrollTrigger: { trigger: sectionRef.current, scrub: 1.5 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const socials = [
    { href: 'https://github.com/itsresearch',             icon: <Github size={18} />,   label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/researchdevkota', icon: <Linkedin size={18} />, label: 'LinkedIn' },
    { href: 'mailto:devkotaresearch@gmail.com',            icon: <Mail size={18} />,     label: 'Email' },
  ];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-20"
    >
      {/* ── Aurora background ──────────────────────────────────── */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      {/* ── Dot grid ────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* ── Gradient overlay ────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--primary) / 0.14) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 w-full">

        {/* ── LEFT — Text ─────────────────────────────────────────── */}
        <div
          ref={contentRef}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl"
        >

          {/* Status pill */}
          <div className="hero-item mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'hsl(142 71% 45% / 0.12)', border: '1px solid hsl(142 71% 45% / 0.3)', color: 'hsl(142 71% 58%)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open to Collaboration
            </span>
          </div>

          {/* Founder badge */}
          <div className="hero-item mb-7">
            <div className="founder-badge">
              <img src="/logos/navyaedtech.webp" alt="Navya EdTech" className="h-5 w-5 object-contain rounded" />
              <span>Co-Founder · Navya EdTech</span>
            </div>
          </div>

          {/* Animated title */}
          <div className="hero-item w-full lg:text-left text-center">
            <AnimatedTitle text1="Research" text2="Devkota" />
          </div>

          {/* Typewriter */}
          <div className="hero-item text-xl md:text-2xl mb-5 font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <TypeWriter
              words={['Co-Founder, Navya EdTech', 'Fullstack Developer', 'Laravel Specialist', 'Python Instructor', 'Backend Engineer', 'Problem Solver']}
              className="text-[hsl(var(--accent))] font-semibold"
            />
          </div>

          {/* Bio */}
          <p className="hero-item text-muted-foreground mb-7 leading-relaxed max-w-xl">
            I co-founded{' '}
            <a href="https://navyaedtech.com" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary))] font-medium hover:underline underline-offset-2">
              Navya EdTech
            </a>
            , building custom ERP, LMS, and cloud systems for businesses across Nepal. I code daily in Laravel and React, and teach Python at Mero Coding Class.
          </p>

          {/* Location */}
          <div className="hero-item mb-8 flex items-center gap-1.5 text-sm text-muted-foreground justify-center lg:justify-start">
            <MapPin size={14} style={{ color: 'hsl(var(--primary))' }} />
            Kathmandu, Nepal 🇳🇵
          </div>

          {/* Social icons */}
          <div className="hero-item flex gap-3 mb-8 justify-center lg:justify-start">
            {socials.map(s => (
              <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer" aria-label={s.label} className="social-icon">
                {s.icon}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hero-item flex flex-wrap gap-3 justify-center lg:justify-start">
            <a href="#projects" className="btn-primary">
              View Projects <ArrowRight size={16} />
            </a>
            <a href="/Research_Resume.pdf" download className="btn-secondary">
              <Download size={15} /> Resume
            </a>
            <a href="https://navyaedtech.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{ background: 'hsl(35 98% 58% / 0.1)', border: '1px solid hsl(35 98% 58% / 0.3)', color: 'hsl(35 98% 68%)' }}>
              <Building2 size={14} /> Navya EdTech <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* ── RIGHT — Photo ───────────────────────────────────────── */}
        <div ref={photoRef} className="flex-shrink-0 flex flex-col items-center gap-8">
          <div className="relative">

            {/* Glow ring */}
            <div
              className="absolute -inset-4 rounded-[2.5rem] opacity-30 animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
            />

            {/* Rotating border */}
            <div
              className="absolute -inset-2 rounded-[2.25rem]"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary) / 0.6), hsl(var(--accent) / 0.4), hsl(var(--accent-warm) / 0.3))',
                animation: 'aurora-drift 12s ease-in-out infinite',
              }}
            />

            {/* Photo */}
            <div
              className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-[2rem] overflow-hidden z-10"
              style={{ border: '2px solid hsl(var(--border))' }}
            >
              {!imgLoaded && (
                <div className="absolute inset-0 animate-shimmer" />
              )}
              <img
                src="https://avatars.githubusercontent.com/u/134274596?v=4"
                alt="Research Devkota — Co-Founder of Navya EdTech, Fullstack Developer"
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
              />
              {/* Overlay shimmer */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), transparent 60%)' }}
              />
            </div>

            {/* Floating — Co-Founder */}
            <FloatingBadge className="-bottom-5 -right-6" delay={0}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'hsl(var(--primary) / 0.2)' }}>
                <Building2 size={14} style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Co-Founder</p>
                <p className="text-xs font-bold text-foreground">Navya EdTech</p>
              </div>
            </FloatingBadge>

            {/* Floating — Stack */}
            <FloatingBadge className="-top-4 -left-6" delay={1}>
              <div className="flex gap-1.5">
                <Code2 size={13} style={{ color: 'hsl(var(--accent))' }} />
                <Server size={13} style={{ color: 'hsl(var(--primary))' }} />
                <Cpu size={13} style={{ color: 'hsl(var(--accent-warm))' }} />
              </div>
              <p className="text-xs font-bold text-foreground">Fullstack</p>
            </FloatingBadge>

            {/* Floating — Location */}
            <FloatingBadge className="-top-3 -right-4" delay={0.6}>
              <p className="text-xs font-semibold text-foreground">Nepal 🇳🇵</p>
            </FloatingBadge>
          </div>

          {/* Stat chips */}
          <div className="flex gap-3">
            {[
              { label: 'Founded', value: '2026' },
              { label: 'Stack', value: 'Laravel + React' },
              { label: 'Domain', value: 'EdTech + ERP' },
            ].map(s => (
              <div key={s.label}
                className="text-center px-3 py-2.5 rounded-xl min-w-[80px] transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'hsl(var(--surface-2))', border: '1px solid hsl(var(--border))' }}>
                <p className="text-sm font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <div
          className="w-[1px] h-16"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--primary)), transparent)',
            animation: 'float 2s ease-in-out infinite',
          }}
        />
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll</p>
      </div>
    </section>
  );
};
