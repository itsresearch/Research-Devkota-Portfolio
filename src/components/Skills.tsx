import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal } from '@/hooks/useGSAP';

gsap.registerPlugin(ScrollTrigger);

const SKILL_CATS = [
  {
    title: 'Backend Development',
    icon: '⚙️',
    color: 'hsl(248 90% 68%)',
    skills: ['Laravel', 'PHP', 'Python', 'Django', 'MySQL', 'PostgreSQL', 'REST APIs', 'MVC Pattern', 'Authentication', 'Authorization'],
  },
  {
    title: 'Frontend Development',
    icon: '🎨',
    color: 'hsl(190 100% 52%)',
    skills: ['JavaScript', 'TypeScript', 'React', 'HTML / CSS', 'Tailwind CSS', 'Responsive Design', 'DOM APIs'],
  },
  {
    title: 'Database & ORM',
    icon: '🗄️',
    color: 'hsl(35 98% 58%)',
    skills: ['MySQL', 'PostgreSQL', 'Eloquent ORM', 'Query Optimization', 'Migrations', 'Database Design'],
  },
  {
    title: 'Tools & Platforms',
    icon: '🛠️',
    color: 'hsl(142 71% 55%)',
    skills: ['Git / GitHub', 'Docker', 'Linux', 'VS Code', 'Postman', 'Composer', 'npm / Bun', 'Sentry'],
  },
  {
    title: 'Programming Fundamentals',
    icon: '📐',
    color: 'hsl(300 70% 65%)',
    skills: ['OOP', 'Data Structures', 'Algorithms', 'Design Patterns', 'Clean Code', 'Version Control'],
  },
  {
    title: 'Other Skills',
    icon: '🚀',
    color: 'hsl(5 90% 65%)',
    skills: ['SaaS Systems', 'Leadership', 'Teaching', 'Project Management', 'RBAC', 'OAuth', 'Unit Testing', 'Performance Optimization'],
  },
];

const SkillCard = ({ cat, index }: { cat: typeof SKILL_CATS[0]; index: number }) => {
  const cardRef   = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7, ease: 'power3.out',
          delay: index * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
      gsap.fromTo(
        badgesRef.current?.querySelectorAll('.badge') ?? [],
        { opacity: 0, scale: 0.6, y: 8 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: 0.35, stagger: 0.045, ease: 'back.out(1.6)',
          delay: index * 0.08 + 0.3,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={cardRef} className="glow-card p-6 h-full group">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-300 group-hover:scale-110"
          style={{ background: `${cat.color}15` }}>
          {cat.icon}
        </div>
        <h3 className="font-display font-bold text-base tracking-tight" style={{ color: cat.color }}>
          {cat.title}
        </h3>
      </div>
      <div ref={badgesRef} className="flex flex-wrap gap-2">
        {cat.skills.map(s => (
          <span key={s} className="badge skill-badge text-xs">{s}</span>
        ))}
      </div>
    </div>
  );
};

export const Skills = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  useReveal(headerRef as React.RefObject<HTMLElement>);

  return (
    <section id="skills" className="py-32 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-6 pointer-events-none"
        style={{ background: 'hsl(var(--accent) / 0.09)' }} />

      <div className="section-container">
        <div ref={headerRef} className="text-center mb-16">
          <p className="section-tag mb-5">⚡ Technical Toolkit</p>
          <h2 className="font-display text-5xl sm:text-6xl font-bold mb-6">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Technologies I've mastered through real-world projects, daily coding, and teaching others.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILL_CATS.map((cat, i) => (
            <SkillCard key={cat.title} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
