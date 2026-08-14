import { useRef } from 'react';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import { useStagger, useReveal } from '@/hooks/useGSAP';

const EDUCATION = [
  {
    degree: 'Bachelor of Information Management',
    institution: 'Nepal Commerce Campus',
    location: 'Kathmandu, Nepal',
    period: '2021 – 2026',
    logo: 'BIM',
    accent: 'hsl(var(--primary))',
    description: "Bachelor's in Information Management with strong focus on practical web development, software engineering, business management and entrepreneurship.",
    learnings: [
      'Web development with modern frameworks',
      'Database design and management',
      'Software engineering principles',
      'Problem-solving and algorithmic thinking',
    ],
  },
  {
    degree: '10 + 2 (Higher Secondary)',
    institution: 'Kathmandu Bernhardt Secondary School',
    location: 'Kathmandu, Nepal',
    period: '2018 – 2020',
    logo: '+2',
    accent: 'hsl(var(--accent))',
    description: 'Completed higher secondary education with a focus on science subjects and foundational computer science.',
    learnings: [
      'Strong foundation in mathematics and sciences',
      'Computer science fundamentals',
      'Problem-solving skills',
      'Academic excellence and discipline',
    ],
  },
  {
    degree: 'SEE (National Education Board)',
    institution: 'Standard CO-ED High School',
    location: 'Nepal',
    period: 'Until 2018',
    logo: 'SEE',
    accent: 'hsl(var(--accent-warm))',
    description: 'Completed secondary education with strong foundational knowledge across core academic subjects.',
    learnings: [
      'Core academic subjects',
      'Fundamental mathematics and science',
      'Language skills',
      'General knowledge and literacy',
    ],
  },
];

export const Education = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);

  useReveal(headerRef as React.RefObject<HTMLElement>);
  useStagger(gridRef as React.RefObject<HTMLElement>, ':scope > *', { stagger: 0.15, y: 50 });

  return (
    <section id="education" className="py-28 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'hsl(var(--surface) / 0.4)' }}
      />

      <div className="section-container relative z-10">
        <div ref={headerRef} className="text-center mb-16">
          <p className="section-tag mb-4"><GraduationCap size={12} /> Academic Background</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5">
            <span className="gradient-text">Education</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Academic foundation and continuous learning journey.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-6">
          {EDUCATION.map(edu => (
            <div
              key={edu.degree}
              className="flex flex-col p-6 rounded-2xl transition-all duration-400 hover:-translate-y-2 group"
              style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}
            >
              {/* Logo badge */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${edu.accent}18` }}
              >
                <span className="font-display font-black text-sm" style={{ color: edu.accent }}>
                  {edu.logo}
                </span>
              </div>

              {/* Degree */}
              <h3 className="font-display font-bold text-lg mb-1 text-foreground leading-snug">
                {edu.degree}
              </h3>
              <p className="font-semibold text-sm mb-3" style={{ color: edu.accent }}>
                {edu.institution}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: 'hsl(var(--surface-2))', color: 'hsl(var(--muted-foreground))' }}
                >
                  <Calendar size={11} /> {edu.period}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: 'hsl(var(--surface-2))', color: 'hsl(var(--muted-foreground))' }}
                >
                  <MapPin size={11} /> {edu.location}
                </span>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{edu.description}</p>

              {/* Learnings */}
              <div className="mt-auto">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">Key Learnings</p>
                <ul className="space-y-1.5">
                  {edu.learnings.map((l, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: edu.accent }} />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
