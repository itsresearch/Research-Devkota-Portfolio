import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReveal } from '@/hooks/useGSAP';
import { ExternalLink, Github, ChevronRight, FolderOpen, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ['All', 'Full-stack', 'Frontend', 'Backend'];

const PROJECTS = [
  {
    title: 'SaaS Chatbot Platform',
    description: 'Multi-tenant SaaS chatbot platform where businesses create chatbot widgets for their websites. Includes admin dashboards, client management, website integration, and automated conversation handling.',
    tags: ['Laravel', 'PHP', 'MySQL', 'SaaS', 'Fullstack'],
    category: 'Full-stack',
    github: 'https://github.com/itsresearch/Chatbot',
    live: '',
    image: '/projects/chatbot.png',
    accent: 'hsl(246 90% 68%)',
  },
  {
    title: 'Internal Banking System',
    description: 'Internal banking management system for customer accounts, transactions, and financial operations with role-based access control.',
    tags: ['Laravel', 'PHP', 'MySQL', 'RBAC'],
    category: 'Backend',
    github: 'https://github.com/itsresearch/Internal-Banking-System',
    live: '',
    image: '/projects/internalbanking.png',
    accent: 'hsl(192 100% 50%)',
  },
  {
    title: 'Restaurant Management System',
    description: 'Full restaurant operations management — orders, menu management, billing, table tracking, and admin controls.',
    tags: ['Laravel', 'PHP', 'MySQL', 'POS'],
    category: 'Full-stack',
    github: 'https://github.com/itsresearch/Restaurant-Management-System',
    live: '',
    image: '/projects/restaurant.png',
    accent: 'hsl(35 98% 58%)',
  },
  {
    title: 'Student Management System',
    description: 'Web-based system for managing student records, courses, grades, and academic information for educational institutions.',
    tags: ['Django', 'Python', 'Education'],
    category: 'Backend',
    github: 'https://github.com/itsresearch/Student-Management-System',
    live: '',
    image: '/projects/studentmanagement.png',
    accent: 'hsl(142 71% 50%)',
  },
  {
    title: 'GharSewa',
    description: 'Django-based marketplace for booking home services — painting, plumbing, electrical, cleaning, appliance repair. Connects users with verified service providers.',
    tags: ['Django', 'Python', 'Marketplace'],
    category: 'Full-stack',
    github: 'https://github.com/itsresearch/GharSewa-Online-Home-Service',
    live: '',
    image: '/projects/Gharsewa.png',
    accent: 'hsl(300 70% 60%)',
  },
  {
    title: 'Online News Portal',
    description: 'Dynamic news portal with category browsing, admin CMS for content management, and clean responsive UI built with Django.',
    tags: ['Django', 'Python', 'CMS'],
    category: 'Backend',
    github: 'https://github.com/itsresearch/News-Portal',
    live: '',
    image: '/projects/NewsPortal.png',
    accent: 'hsl(5 90% 60%)',
  },
  {
    title: 'Old Portfolio',
    description: 'Previous personal portfolio built with React showcasing earlier projects and design explorations.',
    tags: ['React', 'Frontend'],
    category: 'Frontend',
    github: 'https://github.com/itsresearch/old-portfolio',
    live: '',
    image: '/projects/oldportfolio.png',
    accent: 'hsl(220 80% 60%)',
  },
  {
    title: 'Ongoing Projects…',
    description: 'Several confidential client projects and open-source tools in progress. Screenshots and links coming soon.',
    tags: ['In Progress'],
    category: 'Full-stack',
    github: '',
    live: '',
    image: '/projects/ongoing-projects.png',
    accent: 'hsl(246 50% 50%)',
  },
];

const ProjectCard = ({ project, index }: { project: typeof PROJECTS[0]; index: number }) => {
  const cardRef  = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useReveal(cardRef as React.RefObject<HTMLElement>, { delay: (index % 3) * 0.1, y: 60 });

  return (
    <div
      ref={cardRef}
      className="group flex flex-col rounded-2xl overflow-hidden h-full transition-all duration-500"
      style={{
        background: 'hsl(var(--surface) / 0.7)',
        border: '1px solid hsl(var(--border))',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={() => {
        gsap.to(cardRef.current, { y: -8, duration: 0.4, ease: 'power2.out' });
        gsap.to(cardRef.current, {
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${project.accent}25`,
          borderColor: `${project.accent}50`,
          duration: 0.4,
        });
      }}
      onMouseLeave={() => {
        gsap.to(cardRef.current, { y: 0, duration: 0.5, ease: 'power2.inOut' });
        gsap.to(cardRef.current, {
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          borderColor: 'hsl(var(--border))',
          duration: 0.5,
        });
      }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden"
        style={{ background: 'hsl(var(--surface-2))' }}>
        <img
          ref={imageRef}
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 transition-opacity duration-500"
          style={{ background: `linear-gradient(to bottom, transparent 30%, ${project.accent}25 100%)` }} />
        {/* Accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-left"
          style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }} />
        {/* Category chip */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ background: `${project.accent}20`, color: project.accent, border: `1px solid ${project.accent}40`, backdropFilter: 'blur(8px)' }}>
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-display font-bold text-lg mb-2 text-foreground transition-colors duration-300 group-hover:text-white">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map(t => (
            <span key={t} className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
              style={{ background: `${project.accent}12`, color: project.accent, border: `1px solid ${project.accent}25` }}>
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 mt-auto pt-4"
          style={{ borderTop: '1px solid hsl(var(--border))' }}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-2.5"
              style={{ color: 'hsl(var(--muted-foreground))' }}
              onMouseEnter={e => e.currentTarget.style.color = project.accent}
              onMouseLeave={e => e.currentTarget.style.color = 'hsl(var(--muted-foreground))'}>
              <Github size={15} /> Code
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold ml-auto transition-all duration-200"
              style={{ color: project.accent }}>
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
          {!project.github && !project.live && (
            <span className="text-xs text-muted-foreground/40 italic">Coming soon…</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const Projects = () => {
  const headerRef  = useRef<HTMLDivElement>(null);
  const [activeCat, setActiveCat] = useState('All');
  const [showAll, setShowAll]     = useState(false);

  useReveal(headerRef as React.RefObject<HTMLElement>);

  const filtered = PROJECTS.filter(p => activeCat === 'All' || p.category === activeCat);
  const shown    = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="projects" className="py-32 relative">
      <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full blur-[180px] opacity-6 pointer-events-none"
        style={{ background: 'hsl(var(--accent) / 0.08)' }} />

      <div className="section-container">
        <div ref={headerRef} className="text-center mb-16">
          <p className="section-tag mb-5"><FolderOpen size={12} /> Portfolio</p>
          <h2 className="font-display text-5xl sm:text-6xl font-bold mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            A selection of Laravel, Django, and React projects built for real-world use.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCat(cat); setShowAll(false); }}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
              style={activeCat === cat ? {
                background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(248 80% 58%))',
                color: 'white',
                boxShadow: '0 4px 24px hsl(var(--primary) / 0.45)',
                transform: 'scale(1.05)',
              } : {
                background: 'hsl(var(--surface) / 0.7)',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--muted-foreground))',
                backdropFilter: 'blur(8px)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
        </div>

        {filtered.length > 6 && (
          <div className="text-center mt-14">
            <button onClick={() => setShowAll(v => !v)} className="btn-secondary">
              {showAll ? 'Show Less' : `View All ${filtered.length} Projects`}
              <ChevronRight size={16} className={`transition-transform duration-300 ${showAll ? 'rotate-90' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
