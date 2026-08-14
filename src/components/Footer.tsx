import { Github, Linkedin, Mail, BookOpen, Code2, Building2, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const SOCIALS = [
  { icon: Building2, href: 'https://navyaedtech.com',                              label: 'Navya EdTech' },
  { icon: Linkedin,  href: 'https://www.linkedin.com/in/researchdevkota/',         label: 'LinkedIn' },
  { icon: Github,    href: 'https://github.com/itsresearch',                       label: 'GitHub' },
  { icon: BookOpen,  href: 'https://medium.com/@devkotaresearch',                  label: 'Medium' },
  { icon: Code2,     href: 'https://codeforces.com/profile/research_dev',           label: 'Codeforces' },
  { icon: Mail,      href: 'mailto:devkotaresearch@gmail.com',                     label: 'Email' },
];

const NAV = [
  { href: '#about',    label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills',   label: 'Skills' },
  { href: '#blog',     label: 'Blog' },
  { href: '#contact',  label: 'Contact' },
];

export const Footer = () => (
  <footer
    className="relative overflow-hidden"
    itemScope itemType="https://schema.org/WPFooter"
    style={{ background: 'hsl(var(--surface))', borderTop: '1px solid hsl(var(--border))' }}
  >
    {/* Gradient top bar */}
    <div className="h-[2px] w-full navya-progress-bar" />

    {/* Watermark */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      <span
        className="font-display font-black whitespace-nowrap leading-none"
        style={{ fontSize: '12vw', color: 'hsl(var(--foreground) / 0.02)' }}
      >
        RESEARCH DEVKOTA
      </span>
    </div>

    <div className="section-container relative z-10 py-16">
      <div className="flex flex-col items-center">

        {/* Brand */}
        <a href="#" className="flex items-center gap-3 mb-5 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
          >
            R
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            Research <span className="gradient-text">Devkota</span>
          </span>
        </a>

        <a
          href="https://navyaedtech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-10 transition-all duration-300 hover:scale-105"
          style={{ background: 'hsl(var(--primary) / 0.12)', border: '1px solid hsl(var(--primary) / 0.25)', color: 'hsl(var(--primary))' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'hsl(var(--primary))' }} />
          Co-Founder @ Navya EdTech
        </a>

        {/* Socials */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {SOCIALS.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="social-icon" title={s.label} aria-label={s.label}>
              <s.icon size={18} />
            </a>
          ))}
        </div>

        {/* Nav */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 text-sm">
          {NAV.map(l => (
            <a key={l.href} href={l.href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Divider */}
        <div
          className="w-full max-w-sm h-px mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--border)), transparent)' }}
        />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground space-y-1.5">
          <p>© {new Date().getFullYear()} Research Devkota. All rights reserved.</p>
          <p>
            Co-Founder at{' '}
            <a href="https://navyaedtech.com" target="_blank" rel="noopener noreferrer"
              className="hover:underline transition-colors" style={{ color: 'hsl(var(--primary))' }}>
              Navya EdTech
            </a>{' '}
            · Fullstack Developer · Kathmandu, Nepal 🇳🇵
          </p>
          <p className="font-medium text-foreground/60 pt-1">Built with ❤️ in Nepal</p>
          <p className="pt-2">
            <Link to="/admin"
              className="text-xs transition-colors"
              style={{ color: 'hsl(var(--muted-foreground) / 0.3)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'hsl(var(--muted-foreground) / 0.6)'}
              onMouseLeave={e => e.currentTarget.style.color = 'hsl(var(--muted-foreground) / 0.3)'}>
              Admin
            </Link>
          </p>
        </div>
      </div>
    </div>

    {/* Back to top */}
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="absolute bottom-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-110"
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
