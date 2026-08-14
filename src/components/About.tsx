import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStagger, useReveal } from '@/hooks/useGSAP';
import { Code2, Server, Globe, Award, BookOpen, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { icon: <Rocket size={18} />, value: '2026', label: 'Company Founded', color: 'hsl(var(--primary))' },
  { icon: <Code2  size={18} />, value: '3+',   label: 'Years Coding',    color: 'hsl(var(--accent))' },
  { icon: <Server size={18} />, value: '10+',  label: 'Projects Built',  color: 'hsl(var(--accent-warm))' },
  { icon: <Globe  size={18} />, value: 'Nepal', label: 'Based In',       color: 'hsl(142 71% 55%)' },
];

const HIGHLIGHTS = [
  { icon: <Award size={15} />,    text: 'Co-Founder @ Navya EdTech' },
  { icon: <BookOpen size={15} />, text: 'Python Instructor @ Mero Coding Class' },
  { icon: <Code2 size={15} />,    text: 'Laravel + React + Python daily stack' },
];

export const About = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);
  const hlRef       = useRef<HTMLDivElement>(null);

  useReveal(sectionRef as React.RefObject<HTMLElement>);
  useStagger(statsRef as React.RefObject<HTMLElement>, ':scope > *', { stagger: 0.1, y: 30 });
  useReveal(textRef as React.RefObject<HTMLElement>, { delay: 0.1, y: 30 });
  useStagger(hlRef as React.RefObject<HTMLElement>, ':scope > *', { stagger: 0.12, y: 20 });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-28 relative"
      aria-label="About Research Devkota"
    >
      {/* subtle gradient blob */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none blur-[120px] opacity-10"
        style={{ background: 'hsl(var(--primary))' }}
      />

      <div className="section-container">

        {/* Header */}
        <div className="mb-14 text-center">
          <p className="section-tag mb-4">👋 About Me</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5">
            Building for the <span className="gradient-text">future</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            A fullstack developer and co-founder who writes clean code, ships real products, and builds the EdTech ecosystem of Nepal.
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {STATS.map(s => (
            <div key={s.label}
              className="glow-card p-5 text-center group cursor-default"
              style={{ '--card-glow': s.color } as React.CSSProperties}>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 mx-auto"
                style={{ background: `${s.color}20`, color: s.color }}>
                {s.icon}
              </div>
              <p className="font-display font-bold text-2xl text-foreground mb-0.5">{s.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <div ref={textRef}>
            <h3 className="font-display text-2xl font-bold mb-5 text-foreground">
              Turning ideas into <span className="gradient-text">scalable software</span>
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm <strong className="text-foreground font-semibold">Research Devkota</strong>, a fullstack developer and co-founder of Navya EdTech,
                a software company based in Kathmandu, Nepal. I specialize in building enterprise-grade ERP systems, LMS platforms,
                and cloud-based business tools that actually solve real problems.
              </p>
              <p>
                My daily stack is Laravel (PHP), React, and Python — technologies I've used to build systems from scratch for educational
                institutions, trading companies, and startups across Nepal. I believe great software should be fast, reliable, and maintainable.
              </p>
              <p>
                When I'm not building products, I teach Python programming at Mero Coding Class, helping the next generation of developers
                in Nepal learn to code with confidence.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <a href="#projects" className="btn-primary text-sm py-2.5">See Projects</a>
              <a href="https://navyaedtech.com" target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2.5">Navya EdTech</a>
            </div>
          </div>

          {/* Highlights */}
          <div ref={hlRef} className="space-y-4">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i}
                className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}>
                  {h.icon}
                </div>
                <p className="text-foreground font-medium">{h.text}</p>
              </div>
            ))}

            {/* Code block decoration */}
            <div className="p-5 rounded-2xl font-mono text-sm"
              style={{ background: 'hsl(var(--surface-2))', border: '1px solid hsl(var(--border))' }}>
              <div className="flex gap-2 mb-4">
                {['#ff5f57','#febc2e','#28c840'].map(c => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="space-y-1.5">
                <p><span style={{ color: 'hsl(var(--accent))' }}>const</span> <span style={{ color: 'hsl(246 90% 78%)' }}>developer</span> = {'{'}</p>
                <p className="pl-4"><span style={{ color: 'hsl(var(--accent))' }}>name</span>: <span className="text-emerald-400">"Research Devkota"</span>,</p>
                <p className="pl-4"><span style={{ color: 'hsl(var(--accent))' }}>role</span>: <span className="text-emerald-400">"Co-Founder & Fullstack Dev"</span>,</p>
                <p className="pl-4"><span style={{ color: 'hsl(var(--accent))' }}>location</span>: <span className="text-emerald-400">"Kathmandu, Nepal 🇳🇵"</span></p>
                <p>{'}'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
