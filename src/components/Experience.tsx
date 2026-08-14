import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal, useStagger } from '@/hooks/useGSAP';
import { ChevronDown, MapPin, ExternalLink, Briefcase, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: 'Co-Founder',
    company: 'Navya EdTech',
    image: '/logos/navyaedtech.webp',
    period: '2026 – Present',
    location: 'Lalitpur, Nepal',
    current: true,
    description: 'Co-founded a software company that builds custom digital systems for businesses. We deliver enterprise web platforms, ERP, CRM and LMS systems, mobile apps, and cloud infrastructure for clients across education, healthcare, retail, and hospitality.',
    achievements: [
      'Co-founded Navya EdTech and set its technical direction across custom software, web, mobile, and cloud',
      'Delivered client platforms end to end, including the Kabita Shooting Studio booking and e-commerce site',
      'Built enterprise solutions: ERP, CRM, billing, inventory, and learning management systems',
      'Established engineering standards for security, testing, deployment, and post-launch support',
    ],
    technologies: ['Laravel', 'React', 'Next.js', 'PHP', 'Python', 'MySQL', 'PostgreSQL', 'REST APIs', 'AWS', 'Docker', 'CI/CD'],
  },
  {
    title: 'Python Instructor',
    company: 'Mero Coding Class',
    image: '/logos/merocodingclass_logo.png',
    period: '2025 – Present',
    location: 'Nepal · Remote (Part-time)',
    current: true,
    description: 'Teaching Python to beginners as a remote instructor, helping students build strong foundational programming skills through practical exercises and real-world examples.',
    achievements: [
      'Created structured curriculum and lesson plans for Python fundamentals',
      'Guided students through practical coding exercises and real-world examples',
      'Provided mentorship and support to help students build programming confidence',
      'Made learning Python simple, engaging, and effective for beginners',
    ],
    technologies: ['Python', 'tkinter', 'OOP', 'Data Structures', 'Curriculum Design'],
  },
  {
    title: 'Fullstack Developer',
    company: 'Miraai Solutions',
    image: '/logos/miraai.png',
    period: '2025 – 2026',
    location: 'Nepal · On-site',
    current: false,
    description: 'Contributed to real product features and backend development in a fullstack Laravel environment. Worked on API development, database design, and frontend integration.',
    achievements: [
      'Developed and deployed backend APIs for core product features using Laravel and React',
      'Contributed to database design and optimization for high-traffic endpoints',
      'Implemented responsive frontend components and integrated with backend APIs',
      'Collaborated on product features, code reviews, and release pipelines',
    ],
    technologies: ['Laravel', 'PHP', 'React', 'MySQL', 'PostgreSQL', 'Docker', 'Git'],
  },
  {
    title: 'Fullstack Developer (Internship)',
    company: 'Personal Projects',
    image: '/logos/miraai.png',
    period: '3 months (2025)',
    location: 'Nepal · On-site',
    current: false,
    description: 'Built fullstack web applications with Laravel and modern frontend technologies. Focused on creating reliable, scalable products that solve real problems.',
    achievements: [
      'Built multiple fullstack projects using Laravel and frontend frameworks',
      'Designed and implemented robust backend APIs and database schemas',
      'Created responsive and user-friendly frontend interfaces',
      'Applied modern development practices and patterns throughout',
    ],
    technologies: ['Laravel', 'PHP', 'React', 'MySQL', 'JavaScript', 'HTML/CSS', 'Git'],
  },
];

const ExperienceCard = ({ exp, index }: { exp: typeof experiences[0]; index: number }) => {
  const [open, setOpen] = useState(index === 0);
  const cardRef = useRef<HTMLDivElement>(null);
  useReveal(cardRef as React.RefObject<HTMLElement>, { delay: index * 0.08, y: 40 });

  return (
    <div ref={cardRef}
      className="relative pl-10 pb-10 last:pb-0"
    >
      {/* Vertical timeline line */}
      <div
        className="absolute left-[5px] top-5 bottom-0 w-[2px]"
        style={{ background: 'linear-gradient(180deg, hsl(var(--primary) / 0.5), transparent)' }}
      />

      {/* Timeline dot */}
      <div
        className="absolute left-0 top-4 w-3 h-3 rounded-full border-2 z-10"
        style={{
          background: exp.current ? 'hsl(var(--primary))' : 'hsl(var(--surface-2))',
          borderColor: 'hsl(var(--primary))',
          boxShadow: exp.current ? '0 0 12px hsl(var(--primary) / 0.6)' : 'none',
        }}
      />

      <div
        className="rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 cursor-pointer"
        style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}
        onClick={() => setOpen(v => !v)}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0"
              style={{ background: 'hsl(var(--surface-2))', border: '1px solid hsl(var(--border))' }}>
              <img src={exp.image} alt={exp.company} className="w-full h-full object-contain p-1.5"
                onError={e => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-lg text-foreground">{exp.title}</h3>
                {exp.current && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                    style={{ background: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))' }}>
                    Current
                  </span>
                )}
              </div>
              <p className="text-muted-foreground font-medium text-sm mt-0.5">{exp.company}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                  <Calendar size={11} /> {exp.period}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
                  <MapPin size={11} /> {exp.location}
                </span>
              </div>
            </div>
          </div>
          <ChevronDown
            size={18}
            className="text-muted-foreground flex-shrink-0 transition-transform duration-300 mt-1"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          />
        </div>

        {/* Expandable content */}
        <div
          className="overflow-hidden transition-all duration-400"
          style={{ maxHeight: open ? '600px' : '0', marginTop: open ? '16px' : '0' }}
        >
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{exp.description}</p>

          <ul className="space-y-2 mb-5">
            {exp.achievements.map((a, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                  style={{ background: 'hsl(var(--primary))' }} />
                <span className="text-muted-foreground">{a}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {exp.technologies.map(t => (
              <span key={t} className="skill-badge text-xs py-1">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Experience = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  useReveal(headerRef as React.RefObject<HTMLElement>);

  return (
    <section id="experience" className="py-28 relative">
      <div
        className="absolute right-0 top-1/3 w-80 h-80 rounded-full blur-[130px] opacity-10 pointer-events-none"
        style={{ background: 'hsl(var(--primary))' }}
      />

      <div className="section-container">
        <div ref={headerRef} className="text-center mb-16">
          <p className="section-tag mb-4"><Briefcase size={12} /> Work Experience</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5">
            My <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From internship to co-founder — building real products for real businesses.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.company + exp.title} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
