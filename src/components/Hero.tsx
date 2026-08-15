import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Mail, ArrowRight, Download, ExternalLink, MapPin, Building2, Code2, Server, Cpu, Sparkles } from 'lucide-react';
import { TypeWriter } from './TypeWriter';

gsap.registerPlugin(ScrollTrigger);

const FloatingBadge = ({
  className, children, delay = 0,
}: { className: string; children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: -14, duration: 2.8 + delay * 0.4,
      repeat: -1, yoyo: true,
      ease: 'sine.inOut', delay,
    });
  }, [delay]);
  return (
    <div
      ref={ref}
      className={`absolute z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-2xl ${className}`}
      style={{
        background: 'hsl(var(--surface) / 0.85)',
        border: '1px solid hsl(var(--border))',
        backdropFilter: 'blur(16px)',
      }}
    >
      {children}
    </div>
  );
};

const SplitTitle = ({ text1, text2 }: { text1: string; text2: string }) => {
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
        duration: 0.65, stagger: 0.03,
        ease: 'back.out(1.6)', delay: 0.5,
      },
    );
  }, []);

  const renderChars = (word: string) =>
    word.split('').map((ch, i) => (
      <span key={i} className="char inline-block" style={{ perspective: '400px' }}>
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ));

  // Apply gradient directly on each span so background-clip:text works on inline-block
  const renderGradientChars = (word: string) =>
    word.split('').map((ch, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{
          perspective: '400px',
          background: 'linear-gradient(135deg, hsl(248 90% 68%) 0%, hsl(190 100% 52%) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {ch}
      </span>
    ));

  return (
    <h1
      ref={containerRef}
      className="font-display font-bold tracking-tight leading-[1.04] mb-8 text-foreground overflow-visible"
      style={{ fontSize: 'clamp(3.2rem, 8.5vw, 6.5rem)', perspective: '600px' }}
    >
      {renderChars(text1 + ' ')}
      {renderGradientChars(text2)}
    </h1>
  );
};

export const Hero = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const photoRef    = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        contentRef.current?.querySelectorAll('.hero-item') ?? [],
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 },
        0.4,
      );

      tl.fromTo(
        photoRef.current,
        { opacity: 0, x: 60, scale: 0.93 },
        { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power2.out' },
        0.3,
      );

      // Parallax on scroll
      gsap.to(photoRef.current, {
        y: -60,
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 },
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
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-24"
    >
      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, hsl(var(--primary) / 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-20 w-full">

        {/* ── LEFT — Text ───────────────────────────────────── */}
        <div
          ref={contentRef}
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl"
        >

          {/* Live status pill */}
          <div className="hero-item mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'hsl(152 70% 50% / 0.1)',
                border: '1px solid hsl(152 70% 50% / 0.25)',
                color: 'hsl(152 70% 60%)',
              }}
            >
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
            <SplitTitle text1="Research" text2="Devkota" />
          </div>

          {/* Typewriter */}
          <div
            className="hero-item text-xl md:text-2xl mb-6 font-medium"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            <TypeWriter
              words={['Co-Founder, Navya EdTech', 'Fullstack Developer', 'Laravel Specialist', 'Python Instructor', 'Backend Engineer', 'Problem Solver']}
              className="font-semibold"
              style={{ color: 'hsl(var(--accent))' }}
            />
          </div>

          {/* Bio */}
          <p className="hero-item text-muted-foreground mb-8 leading-relaxed max-w-xl text-base">
            I co-founded{' '}
            <a href="https://navyaedtech.com" target="_blank" rel="noopener noreferrer"
              className="font-medium hover:underline underline-offset-2"
              style={{ color: 'hsl(var(--primary))' }}>
              Navya EdTech
            </a>
            , building custom ERP, LMS, and cloud systems for businesses across Nepal.
            I code daily in Laravel and React, and teach Python at Mero Coding Class.
          </p>

          {/* Location */}
          <div className="hero-item mb-8 flex items-center gap-1.5 text-sm text-muted-foreground justify-center lg:justify-start">
            <MapPin size={14} style={{ color: 'hsl(var(--primary))' }} />
            Kathmandu, Nepal 🇳🇵
          </div>

          {/* Socials */}
          <div className="hero-item flex gap-3 mb-9 justify-center lg:justify-start">
            {socials.map(s => (
              <a key={s.label} href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="social-icon">
                {s.icon}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="hero-item flex flex-wrap gap-3 justify-center lg:justify-start">
            <a href="#projects" className="btn-primary">
              View Projects <ArrowRight size={16} />
            </a>
            <a href="/Research_Resume.pdf" download className="btn-secondary">
              <Download size={15} /> Resume
            </a>
            <a href="https://navyaedtech.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'hsl(35 98% 58% / 0.1)', border: '1px solid hsl(35 98% 58% / 0.25)', color: 'hsl(35 98% 68%)' }}>
              <Building2 size={14} /> Navya EdTech <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* ── RIGHT — Photo ──────────────────────────────────── */}
        <div ref={photoRef} className="flex-shrink-0 flex flex-col items-center gap-10">
          <div className="relative">

            {/* Outer rotating ring */}
            <div
              className="absolute ring-spin pointer-events-none"
              style={{
                inset: '-24px',
                borderRadius: '2.5rem',
                border: '1px solid transparent',
                background: 'linear-gradient(hsl(var(--surface)), hsl(var(--surface))) padding-box, linear-gradient(135deg, hsl(var(--primary) / 0.7), hsl(var(--accent) / 0.5), transparent 60%, hsl(var(--accent-warm) / 0.4)) border-box',
              }}
            />

            {/* Inner counter-ring */}
            <div
              className="absolute ring-spin-reverse pointer-events-none"
              style={{
                inset: '-12px',
                borderRadius: '2.25rem',
                border: '1px dashed hsl(var(--primary) / 0.25)',
              }}
            />

            {/* Glow pulse */}
            <div
              className="absolute -inset-6 rounded-[2.75rem] animate-pulse-glow pointer-events-none"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.25), hsl(var(--accent) / 0.15))' }}
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
                className={`w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(160deg, hsl(var(--primary) / 0.08), transparent 50%, hsl(var(--accent) / 0.06))' }}
              />
            </div>

            {/* Badge: Co-Founder */}
            <FloatingBadge className="-bottom-5 -right-8" delay={0}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'hsl(var(--primary) / 0.18)', color: 'hsl(var(--primary))' }}>
                <Building2 size={14} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Co-Founder</p>
                <p className="text-xs font-bold text-foreground">Navya EdTech</p>
              </div>
            </FloatingBadge>

            {/* Badge: Stack */}
            <FloatingBadge className="-top-5 -left-8" delay={1.1}>
              <div className="flex gap-1.5">
                <Code2 size={13} style={{ color: 'hsl(var(--accent))' }} />
                <Server size={13} style={{ color: 'hsl(var(--primary))' }} />
                <Cpu size={13} style={{ color: 'hsl(var(--accent-warm))' }} />
              </div>
              <p className="text-xs font-bold text-foreground">Fullstack</p>
            </FloatingBadge>

            {/* Badge: Nepal */}
            <FloatingBadge className="-top-3 -right-6" delay={0.5}>
              <p className="text-xs font-semibold text-foreground">Nepal 🇳🇵</p>
            </FloatingBadge>

            {/* Badge: Currently Building */}
            <FloatingBadge className="-bottom-5 -left-10" delay={1.6}>
              <Sparkles size={12} style={{ color: 'hsl(var(--accent-warm))' }} />
              <p className="text-[10px] font-semibold" style={{ color: 'hsl(var(--accent-warm))' }}>Building EdTech</p>
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
                className="text-center px-3 py-2.5 rounded-xl min-w-[80px] transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{ background: 'hsl(var(--surface) / 0.8)', border: '1px solid hsl(var(--border))', backdropFilter: 'blur(8px)' }}>
                <p className="text-sm font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="scroll-line" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Scroll</p>
      </div>
    </section>
  );
};
