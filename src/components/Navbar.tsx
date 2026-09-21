import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* Hash links for portfolio sections (only relevant on homepage) */
const HASH_LINKS = [
  { href: '#about',      label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects',   label: 'Projects' },
  { href: '#skills',     label: 'Skills' },
  { href: '#contact',    label: 'Contact' },
];

export const Navbar = () => {
  const navRef  = useRef<HTMLElement>(null);
  const location = useLocation();
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';
  const isBlog = location.pathname === '/blog' || location.pathname.startsWith('/blog/');

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Slide-in on load
    gsap.fromTo(nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, delay: 0.15, ease: 'power3.out' },
    );

    // Nav links stagger
    const links = nav.querySelectorAll('.nav-link');
    gsap.fromTo(links,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.5, ease: 'power2.out' },
    );

    // Scroll progress bar
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

  // Always show scrolled style on non-home pages (light bg pages)
  useEffect(() => {
    if (!isHome) setScrolled(true);
  }, [isHome]);

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
          ? (isBlog ? 'rgba(255,255,255,0.95)' : 'hsl(var(--background) / 0.88)')
          : 'transparent',
        borderBottom: scrolled
          ? (isBlog ? '1px solid #e2e8f0' : '1px solid hsl(var(--border))')
          : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.8)' : 'none',
      }}
    >
      {/* Scroll progress bar */}
      <div
        className="nav-progress navya-progress-bar h-[2px] absolute bottom-0 left-0 right-0 origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      <nav className="section-container flex items-center justify-between h-[68px]">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="Research Devkota portfolio home">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
              boxShadow: '0 4px 20px hsl(var(--primary) / 0.4)',
            }}
          >
            R
          </div>
          <span
            className="font-display font-bold hidden sm:block tracking-tight"
            style={{ color: isBlog ? '#0f172a' : 'hsl(var(--foreground))' }}
          >
            Research <span className="gradient-text">Devkota</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {isHome
            ? HASH_LINKS.map(l => (
                <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
              ))
            : (
              /* On blog / other pages: link back to homepage sections */
              <>
                <a href="/#about"      className="nav-link" style={isBlog ? { color: '#475569' } : {}}>About</a>
                <a href="/#projects"   className="nav-link" style={isBlog ? { color: '#475569' } : {}}>Projects</a>
                <a href="/#skills"     className="nav-link" style={isBlog ? { color: '#475569' } : {}}>Skills</a>
                <a href="/#contact"    className="nav-link" style={isBlog ? { color: '#475569' } : {}}>Contact</a>
              </>
            )
          }
          {/* Blog link — always visible */}
          <Link
            to="/blog"
            className="nav-link"
            style={isBlog
              ? { color: '#4f46e5', fontWeight: 700 }
              : {}
            }
          >
            Blog
          </Link>
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a
            href={isHome ? '#contact' : '/#contact'}
            className="hidden sm:flex btn-primary py-2.5 px-5 text-sm"
          >
            Hire Me
          </a>
          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
            style={{
              background: isBlog ? '#f1f5f9' : 'hsl(var(--surface-2))',
              border: isBlog ? '1px solid #e2e8f0' : '1px solid hsl(var(--border))',
            }}
            aria-label="Toggle menu"
          >
            <div className={`transition-all duration-300 ${open ? 'rotate-90 scale-90' : ''}`}>
              {open
                ? <X size={17} style={{ color: isBlog ? '#0f172a' : 'hsl(var(--foreground))' }} />
                : <Menu size={17} style={{ color: isBlog ? '#0f172a' : 'hsl(var(--foreground))' }} />
              }
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? '500px' : '0',
          background: isBlog ? 'rgba(255,255,255,0.97)' : 'hsl(var(--background) / 0.96)',
          borderTop: open ? (isBlog ? '1px solid #e2e8f0' : '1px solid hsl(var(--border))') : 'none',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div className="section-container py-5 flex flex-col gap-1">
          {(isHome ? HASH_LINKS : [
            { href: '/#about',    label: 'About' },
            { href: '/#projects', label: 'Projects' },
            { href: '/#skills',   label: 'Skills' },
            { href: '/#contact',  label: 'Contact' },
          ]).map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-slate-100"
              style={{ color: isBlog ? '#475569' : 'hsl(var(--muted-foreground))' }}
            >
              {l.label}
            </a>
          ))}
          {/* Blog link in mobile */}
          <Link
            to="/blog"
            onClick={() => setOpen(false)}
            className="py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              color: isBlog ? '#4f46e5' : 'hsl(var(--primary))',
              background: isBlog ? '#eef2ff' : 'hsl(var(--primary) / 0.08)',
            }}
          >
            Blog
          </Link>

          <div className="pt-4 border-t mt-2" style={{ borderColor: isBlog ? '#e2e8f0' : 'hsl(var(--border))' }}>
            <a
              href={isHome ? '#contact' : '/#contact'}
              onClick={() => setOpen(false)}
              className="btn-primary w-full justify-center py-3"
            >
              Hire Me
            </a>
          </div>
          <div className="pt-3">
            <Link to="/admin" className="text-xs text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </header>
  );
};
