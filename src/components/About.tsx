import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { TrendingUp, Brain, Code2, Trophy, Rocket, Users, ExternalLink, Globe } from 'lucide-react';

const highlights = [
  {
    icon: Rocket,
    title: 'Co-Founder, Navya EdTech',
    description: 'Co-founded a software company delivering custom systems, ERP and LMS platforms, and cloud infrastructure to businesses.',
  },
  {
    icon: Code2,
    title: 'Fullstack Development',
    description: 'Building complete web applications with Laravel backend and modern frontend technologies.',
  },
  {
    icon: Brain,
    title: 'Laravel Expertise',
    description: 'Specialized in Laravel framework for backend APIs, database design, SaaS systems and robust server-side development.',
  },
  {
    icon: TrendingUp,
    title: 'Frontend Development',
    description: 'Creating responsive, user-friendly interfaces with modern tools and best practices.',
  },
  {
    icon: Trophy,
    title: 'Problem Solver',
    description: 'Breaking down complex problems into scalable, efficient solutions with practical thinking.',
  },
  {
    icon: Users,
    title: 'Team Player & Educator',
    description: 'Collaborative developer who enjoys mentoring and teaching others, currently instructing Python at Mero Coding Class.',
  },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest mb-4">
            About
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Co-founder, fullstack developer, and instructor
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8"
          >
            <h3 className="font-display text-xl font-semibold mb-4 gradient-text">Background</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm <span className="text-foreground font-medium">Research Devkota</span>, co-founder of <a href="https://navyaedtech.com" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">Navya EdTech</a>, a Lalitpur-based software company. We build <span className="text-primary font-medium">custom digital systems for businesses</span>: enterprise web platforms, ERP, CRM and LMS software, mobile apps, and cloud infrastructure for clients across education, healthcare, retail, and hospitality.
              </p>
              <p>
                I came to this as an engineer and I still build. My core is <span className="text-primary font-medium">Laravel and React</span>: backend API development, database design, and responsive interfaces. Before Navya, I worked as a fullstack developer at Miraai Solutions, shipping production features in a Laravel codebase. I'm also completing my Bachelor's in Information Management at Nepal Commerce Campus.
              </p>
              <p>
                Alongside the company, I teach Python at <span className="text-foreground font-medium">Mero Coding Class</span>, helping beginners build a real foundation in programming. What drives me is <span className="text-foreground font-medium">delivering practical solutions that create impact</span>, and building a team that ships work worth standing behind.
              </p>
            </div>

            {/* Navya EdTech Company Card */}
            <div className="mt-6 relative rounded-2xl overflow-hidden border border-primary/30 bg-primary/5 p-5"
              style={{ boxShadow: '0 0 40px -15px hsl(220 100% 56% / 0.3)' }}
            >
              {/* Subtle glow blob */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
              <div className="relative flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">My Company</p>
                    <p className="font-display font-bold text-foreground text-base leading-tight">Navya EdTech</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Enterprise IT &amp; Software Development · Nepal</p>
                  </div>
                </div>
                <a
                  href="https://navyaedtech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200 shrink-0"
                  style={{ boxShadow: '0 4px 16px hsl(220 100% 56% / 0.35)' }}
                >
                  Visit Site
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Entity summary — readable by AI crawlers, screen readers, and non-JS bots */}
        <div className="sr-only" aria-label="About Research Devkota — entity summary for accessibility">
          <p>
            Research Devkota is the Co-Founder of Navya EdTech (navyaedtech.com),
            an enterprise software development company in Lalitpur, Nepal.
            He is a fullstack developer specializing in Laravel, React.js, and Python.
            Research Devkota builds ERP systems, LMS platforms, CRM software, and cloud infrastructure for businesses.
            His portfolio is at devkotaresearch.com.np.
            His email is devkotaresearch@gmail.com.
            He is on LinkedIn at linkedin.com/in/researchdevkota and GitHub at github.com/itsresearch.
            He also teaches Python at Mero Coding Class and previously worked at Miraai Solutions as a Fullstack Developer.
            Navya EdTech was co-founded by Research Devkota.
            Navya EdTech contact: navyaedtech26@gmail.com.
            Research Devkota is based in Kirtipur, Kathmandu, Nepal.
          </p>
        </div>
      </div>
    </section>
  );
};
