import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { href: '#about',        label: 'About' },
  { href: '#experience',   label: 'Experience' },
  { href: '#projects',     label: 'Projects' },
  { href: '#skills',       label: 'Skills' },
  { href: '#blog',         label: 'Blog' },
  { href: '#contact',      label: 'Contact' },
];

export const Navbar = () => {
  const navRef    = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    /* Slide nav down on load */
    gsap.fromTo(nav, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: 'power3.out' });

    /* Progress bar on scroll */
    const progressBar = nav.querySelector<HTMLElement>('.nav-progress');
    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        if (progressBar) progressBar.style.transform = `scaleX(${self.progress})`;
        setScrolled(self.progress > 0.01);
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  /* Close mobile menu on resize */
  useEffect(() => {
    const handle = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'hsl(var(--background) / 0.85)'
          : 'transparent',
        borderBottom: scrolled ? '1px solid hsl(var(--border))' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.8)' : 'none',
      }}
    >
      {/* Progress bar */}
      <div
        className="nav-progress navya-progress-bar h-[2px] absolute bottom-0 left-0 right-0 origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      <nav className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group" aria-label="Research Devkota portfolio home">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}
          >
            R
          </div>
          <span className="font-display font-bold text-foreground hidden sm:block">
            Research <span className="gradient-text">Devkota</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:flex btn-primary py-2 px-4 text-xs"
          >
            Hire Me
          </a>
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{ background: 'hsl(var(--surface-2))', border: '1px solid hsl(var(--border))' }}
            aria-label="Toggle menu"
          >
            {open ? <X size={17} className="text-foreground" /> : <Menu size={17} className="text-foreground" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? '400px' : '0',
          background: 'hsl(var(--background) / 0.97)',
          borderTop: open ? '1px solid hsl(var(--border))' : 'none',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="section-container py-5 flex flex-col gap-1">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2.5 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/5 mt-2">
            <Link to="/admin" className="text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </header>
  );
};
