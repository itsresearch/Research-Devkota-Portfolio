import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Github, Linkedin, Mail, BookOpen, Code2, Building2, ArrowUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const SOCIALS = [
  { icon: Building2, href: 'https://navyaedtech.com',                    label: 'Navya EdTech' },
  { icon: Linkedin,  href: 'https://www.linkedin.com/in/researchdevkota/', label: 'LinkedIn' },
  { icon: Github,    href: 'https://github.com/itsresearch',               label: 'GitHub' },
  { icon: BookOpen,  href: 'https://medium.com/@devkotaresearch',           label: 'Medium' },
  { icon: Code2,     href: 'https://codeforces.com/profile/research_dev',   label: 'Codeforces' },
  { icon: Mail,      href: 'mailto:devkotaresearch@gmail.com',              label: 'Email' },
];

const NAV = [
  { href: '#about',      label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects',   label: 'Projects' },
  { href: '#skills',     label: 'Skills' },
  { href: '#blog',       label: 'Blog' },
  { href: '#contact',    label: 'Contact' },
];

export const Footer = () => {
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = backRef.current;
    if (!btn) return;
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { y: -4, scale: 1.1, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { y: 0, scale: 1, duration: 0.4, ease: 'power2.inOut' });
    });
  }, []);

  return (
    <footer
      className="relative overflow-hidden"
      itemScope itemType="https://schema.org/WPFooter"
      style={{ background: 'hsl(var(--surface) / 0.8)', borderTop: '1px solid hsl(var(--border))', backdropFilter: 'blur(12px)' }}
    >
      {/* Top gradient line */}
      <div className="h-[2px] w-full navya-progress-bar" />

      {/* Atmospheric bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[120px] opacity-8"
          style={{ background: 'hsl(var(--primary) / 0.1)' }} />
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-display font-black whitespace-nowrap leading-none"
          style={{ fontSize: '11vw', color: 'hsl(var(--foreground) / 0.018)' }}
        >
          RESEARCH DEVKOTA
        </span>
      </div>

      <div className="section-container relative z-10 py-20">
        <div className="flex flex-col items-center">

          {/* Brand */}
          <a href="#" className="flex items-center gap-3 mb-5 group">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl transition-all duration-300 group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', boxShadow: '0 4px 20px hsl(var(--primary) / 0.4)' }}
            >
              R
            </div>
            <span className="font-display text-2xl font-bold text-foreground tracking-tight">
              Research <span className="gradient-text">Devkota</span>
            </span>
          </a>

          <a
            href="https://navyaedtech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold mb-12 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
            style={{ background: 'hsl(var(--primary) / 0.1)', border: '1px solid hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'hsl(var(--primary))' }} />
            Co-Founder @ Navya EdTech
          </a>

          {/* Socials */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="social-icon" title={s.label} aria-label={s.label}>
                <s.icon size={18} />
              </a>
            ))}
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-2 mb-12 text-sm">
            {NAV.map(l => (
              <a key={l.href} href={l.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-full max-w-sm h-px mb-10"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--border)), transparent)' }} />

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>© {new Date().getFullYear()} Research Devkota. All rights reserved.</p>
            <p>
              Co-Founder at{' '}
              <a href="https://navyaedtech.com" target="_blank" rel="noopener noreferrer"
                className="hover:underline transition-colors" style={{ color: 'hsl(var(--primary))' }}>
                Navya EdTech
              </a>
              {' '}· Fullstack Developer · Kathmandu, Nepal 🇳🇵
            </p>
            <p className="flex items-center justify-center gap-1.5 font-medium text-foreground/50 pt-1">
              Built with <Heart size={13} className="text-red-400 fill-red-400" /> in Nepal
            </p>
            <p className="pt-2">
              <Link to="/admin"
                className="text-xs transition-colors"
                style={{ color: 'hsl(var(--muted-foreground) / 0.25)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'hsl(var(--muted-foreground) / 0.55)'}
                onMouseLeave={e => e.currentTarget.style.color = 'hsl(var(--muted-foreground) / 0.25)'}>
                Admin
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        ref={backRef}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute bottom-8 right-8 w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{ background: 'hsl(var(--surface-2))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
        aria-label="Back to top"
      >
        <ArrowUp size={16} />
      </button>

      {/* Schema.org */}
      <p className="sr-only" itemScope itemType="https://schema.org/Person">
        <span itemProp="name">Research Devkota</span> is Co-Founder of{' '}
        <span itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
          <span itemProp="name">Navya EdTech</span>{' '}
          (<span itemProp="url">https://navyaedtech.com</span>)
        </span>.
        Portfolio: <a itemProp="url" href="https://devkotaresearch.com.np">devkotaresearch.com.np</a>.
        Email: <a itemProp="email" href="mailto:devkotaresearch@gmail.com">devkotaresearch@gmail.com</a>.
        <span itemProp="jobTitle">Co-Founder &amp; Fullstack Developer</span>.
        <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="addressLocality">Kathmandu</span>,{' '}
          <span itemProp="addressCountry">Nepal</span>.
        </span>
      </p>
    </footer>
  );
};
