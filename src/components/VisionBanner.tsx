import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ExternalLink, Zap, Building2, Code2, GraduationCap } from 'lucide-react';
import { useReveal } from '@/hooks/useGSAP';

const MARQUEE_ITEMS = [
  { label: 'Enterprise ERP', icon: '⚡' },
  { label: 'LMS Platforms', icon: '📚' },
  { label: 'CRM Systems', icon: '🔗' },
  { label: 'SaaS Products', icon: '🚀' },
  { label: 'REST APIs', icon: '🔌' },
  { label: 'Cloud Infrastructure', icon: '☁️' },
  { label: 'Laravel', icon: '🔴' },
  { label: 'React', icon: '⚛️' },
  { label: 'Python', icon: '🐍' },
  { label: 'EdTech Nepal', icon: '🇳🇵' },
  { label: 'Custom Software', icon: '💻' },
  { label: 'Mobile Apps', icon: '📱' },
];

const PILLARS = [
  { icon: Building2, label: 'Enterprise IT', sub: 'ERP · CRM · LMS' },
  { icon: Code2,     label: 'Full-Stack Dev', sub: 'Laravel · React · Python' },
  { icon: GraduationCap, label: 'EdTech Nepal', sub: 'Education × Technology' },
];

export const VisionBanner = () => {
  const ref        = useRef<HTMLDivElement>(null);
  const track1Ref  = useRef<HTMLDivElement>(null);
  const track2Ref  = useRef<HTMLDivElement>(null);

  useReveal(ref as React.RefObject<HTMLElement>, { y: 20 });

  // Two-direction marquee with GSAP for buttery smoothness
  useEffect(() => {
    const t1 = track1Ref.current;
    const t2 = track2Ref.current;
    if (!t1 || !t2) return;
    const w1 = t1.scrollWidth / 2;
    const w2 = t2.scrollWidth / 2;
    const tl1 = gsap.to(t1, { x: -w1, duration: 28, ease: 'none', repeat: -1, modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % w1) } });
    const tl2 = gsap.to(t2, { x: w2, duration: 32, ease: 'none', repeat: -1, modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % w2 - w2) } });
    return () => { tl1.kill(); tl2.kill(); };
  }, []);

  return (
    <div ref={ref} className="vision-strip overflow-hidden py-0 relative">
      {/* Top row */}
      <div className="section-container py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-lg"
            style={{ border: '1px solid hsl(var(--border))' }}>
            <img src="/logos/navyaedtech.webp" alt="Navya EdTech"
              className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-base leading-tight tracking-tight">
              Navya EdTech
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Empowering Businesses · Kathmandu, Nepal
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="hidden lg:flex items-center gap-8">
          {PILLARS.map((p, i) => (
            <div key={p.label} className="flex items-center gap-6">
              {i > 0 && (
                <div className="w-px h-10" style={{ background: 'hsl(var(--border))' }} />
              )}
              <div className="flex items-center gap-2.5 group cursor-default">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' }}>
                  <p.icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight">{p.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{p.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://navyaedtech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs py-2.5 px-5 flex-shrink-0"
        >
          <Zap size={13} />
          Visit navyaedtech.com
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Marquee strip 1 */}
      <div
        className="relative overflow-hidden py-3"
        style={{ background: 'hsl(var(--primary) / 0.05)', borderTop: '1px solid hsl(var(--border))' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, hsl(var(--surface)), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, hsl(var(--surface)), transparent)' }} />

        <div ref={track1Ref} className="flex gap-10 whitespace-nowrap w-max">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
