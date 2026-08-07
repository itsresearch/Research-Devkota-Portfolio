import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact', label: 'Contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      let current = '';
      for (const link of navLinks) {
        const section = document.querySelector(link.href);
        if (section) {
          const sectionTop = section.getBoundingClientRect().top;
          if (sectionTop <= 150) {
            current = link.href;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm' : 'bg-white/60 backdrop-blur-md'
        }`}
    >
      {/* Scroll Progress Indicator Bar */}
      <div 
        className="h-[3px] navya-progress-bar absolute top-0 left-0 z-50" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      {/* Fallback bar if progress is 0 */}
      <div className="h-[1px] w-full bg-gradient-to-r from-primary/10 via-blue-400/10 to-accent/10" />

      <nav className="section-container py-3">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <span className="font-display text-lg font-bold gradient-text tracking-tight">
              Research Devkota
            </span>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <img src="/logos/navyaedtech.webp" alt="Navya" className="h-4 w-4 object-contain" />
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Navya EdTech</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className={`nav-link text-sm font-medium ${activeSection === link.href ? 'text-primary after:w-full' : ''}`}
              >
                {link.label}
              </a>
            ))}
            <a href="#contact" className="btn-primary text-sm">
              Get in Touch
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`transition-colors py-2 ${activeSection === link.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {link.label}
                  </a>
                ))}
                <a href="#contact" className="btn-primary text-sm w-fit mt-2">
                  Get in Touch
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};
