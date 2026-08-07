import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Rocket, Brain, Users, ExternalLink, Globe, Layout, Layers, Lightbulb, Server, Database, Smartphone, Cloud, Cog, BarChart3 } from 'lucide-react';

const highlights = [
  {
    icon: Rocket,
    title: 'Company Builder',
    description: 'Led Navya EdTech from idea to delivering enterprise client projects across Nepal.',
  },
  {
    icon: Layers,
    title: 'Technical Architect',
    description: 'Designs complete software systems: ERP, LMS, CRM, cloud infra.',
  },
  {
    icon: Brain,
    title: 'Laravel Expert',
    description: 'Deep Laravel expertise for SaaS, multi-tenant, and enterprise backends.',
  },
  {
    icon: Layout,
    title: 'Product Shipper',
    description: 'Ships complete, production-grade products end-to-end.',
  },
  {
    icon: Users,
    title: 'Educator',
    description: 'Teaching Python at Mero Coding Class; believes in growing Nepal\'s tech talent.',
  },
  {
    icon: Lightbulb,
    title: 'Visionary',
    description: 'Focused on building software that drives real business growth in Nepal.',
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

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 h-full"
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
          </motion.div>

          {/* Highlights Grid */}
          <div className="grid sm:grid-cols-2 gap-4 h-full">
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

        {/* Bottom Cards: The Company & What We Build */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: The Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative rounded-2xl overflow-hidden border border-primary/30 bg-primary/5 p-6 glass-card"
            style={{ boxShadow: '0 0 40px -15px hsl(220 100% 56% / 0.2)' }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <h3 className="font-display text-lg font-semibold mb-6 gradient-text">The Company</h3>
            <div className="relative flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                  <img src="/logos/navyaedtech.webp" alt="Navya EdTech" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <p className="font-display font-bold text-foreground text-lg leading-tight">Navya EdTech</p>
                  <p className="text-sm text-muted-foreground mt-1">Enterprise IT &amp; Software Development</p>
                </div>
              </div>
              <a
                href="https://navyaedtech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-200 shrink-0"
                style={{ boxShadow: '0 4px 16px hsl(220 100% 56% / 0.35)' }}
              >
                Visit Site
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>

          {/* Card 2: What We Build */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="glass-card p-6"
          >
            <h3 className="font-display text-lg font-semibold mb-6 gradient-text-gold">What We Build</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Server className="w-4 h-4 text-blue-400" /> ERP Systems
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Layout className="w-4 h-4 text-green-400" /> LMS Platforms
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="w-4 h-4 text-purple-400" /> CRM Software
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Cloud className="w-4 h-4 text-sky-400" /> Cloud Infra
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Smartphone className="w-4 h-4 text-pink-400" /> Mobile Apps
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <BarChart3 className="w-4 h-4 text-orange-400" /> BI Dashboards
              </div>
            </div>
          </motion.div>
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
