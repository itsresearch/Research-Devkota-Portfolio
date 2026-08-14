import { useRef } from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import { useReveal } from '@/hooks/useGSAP';

const MARQUEE_ITEMS = [
  'Enterprise ERP', 'LMS Platforms', 'CRM Systems', 'SaaS Products',
  'REST APIs', 'Cloud Infrastructure', 'Laravel', 'React', 'Python',
  'EdTech Nepal', 'Custom Software', 'Mobile Apps',
];

export const VisionBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref as React.RefObject<HTMLElement>, { y: 20 });

  return (
    <div ref={ref}
      className="vision-strip py-0 overflow-hidden"
    >
      {/* Top content row */}
      <div className="section-container py-5 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
            style={{ border: '1px solid hsl(var(--border))' }}>
            <img src="/logos/navyaedtech.webp" alt="Navya EdTech" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-base leading-tight">Navya EdTech</p>
            <p className="text-xs text-muted-foreground">Empowering Businesses · Nepal</p>
          </div>
        </div>

        {/* Pills */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-semibold">
          {['Enterprise IT', 'ERP · LMS · CRM', 'Nepal\'s Tech'].map((t, i) => (
            <div key={t} className="flex items-center gap-3">
              {i > 0 && <div className="w-px h-4" style={{ background: 'hsl(var(--border))' }} />}
              <span className="text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://navyaedtech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs py-2 px-4 flex-shrink-0"
        >
          <Zap size={12} />
          Visit navyaedtech.com
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Marquee strip */}
      <div
        className="relative overflow-hidden py-3"
        style={{ background: 'hsl(var(--primary) / 0.06)', borderTop: '1px solid hsl(var(--border))' }}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, hsl(var(--surface)), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, hsl(var(--surface)), transparent)' }} />

        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'hsl(var(--primary))' }} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
