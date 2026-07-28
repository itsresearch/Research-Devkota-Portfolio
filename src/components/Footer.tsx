import { Github, Linkedin, Mail, BookOpen, Code2, Building2 } from 'lucide-react';

const socialLinks = [
  { icon: Building2, href: 'https://navyaedtech.com', label: 'Navya EdTech' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/researchdevkota/', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/itsresearch', label: 'GitHub' },
  { icon: BookOpen, href: 'https://medium.com/@devkotaresearch', label: 'Medium' },
  { icon: Code2, href: 'https://codeforces.com/profile/research_dev', label: 'Codeforces' },
  { icon: Mail, href: 'mailto:devkotaresearch@gmail.com', label: 'Email' },
];

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact', label: 'Contact' },
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 bg-card/30" itemScope itemType="https://schema.org/WPFooter">
      {/* Navya top accent bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-primary via-blue-400 to-accent" />

      <div className="section-container py-14">
        <div className="flex flex-col items-center">

          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <a href="#" className="flex items-center gap-2 mb-2">
              <span className="font-display text-2xl font-bold gradient-text tracking-tight">
                Research Devkota
              </span>
            </a>
            <a
              href="https://navyaedtech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Co-Founder @ Navya EdTech
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title={link.label}
                aria-label={link.label}
              >
                <link.icon size={18} />
              </a>
            ))}
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>© {new Date().getFullYear()} Research Devkota. All rights reserved.</p>
            <p>
              Co-Founder at{' '}
              <a
                href="https://navyaedtech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Navya EdTech
              </a>
              {' '}· Fullstack Developer · Lalitpur, Nepal 🇳🇵
            </p>
          </div>

          {/* Screen-reader + crawler entity summary */}
          <p className="sr-only" itemScope itemType="https://schema.org/Person">
            <span itemProp="name">Research Devkota</span> is the Co-Founder of{' '}
            <span itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
              <span itemProp="name">Navya EdTech</span>{' '}
              (<span itemProp="url">https://navyaedtech.com</span>)
            </span>.
            Portfolio:{' '}
            <a itemProp="url" href="https://devkotaresearch.com.np">devkotaresearch.com.np</a>.
            Email:{' '}
            <a itemProp="email" href="mailto:devkotaresearch@gmail.com">devkotaresearch@gmail.com</a>.
            LinkedIn:{' '}
            <a itemProp="sameAs" href="https://www.linkedin.com/in/researchdevkota">linkedin.com/in/researchdevkota</a>.
            GitHub:{' '}
            <a itemProp="sameAs" href="https://github.com/itsresearch">github.com/itsresearch</a>.
            <span itemProp="jobTitle">Co-Founder &amp; Fullstack Developer</span>.
            <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              <span itemProp="addressLocality">Kathmandu</span>,{' '}
              <span itemProp="addressCountry">Nepal</span>.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
