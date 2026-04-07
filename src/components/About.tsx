import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { TrendingUp, Brain, Code2, Trophy, Zap, Users } from 'lucide-react';

const highlights = [
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
    icon: Zap,
    title: 'Continuous Learner',
    description: 'Always eager to learn new technologies, patterns, and methodologies to improve my craft.',
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
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Building fullstack web applications & empowering developers
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
                I'm <span className="text-foreground font-medium">Research Devkota</span>, a fullstack developer currently completing my Bachelor's in Information Management at Nepal Commerce Campus. My passion lies in <span className="text-primary font-medium">building robust, scalable web applications</span> with Laravel and modern frontend technologies. I specialize in backend API development, database design, and creating responsive user interfaces that users love.
              </p>
              <p>
                Beyond development, I'm committed to <span className="text-primary font-medium">giving back to the tech community</span> as a Coding instructor at Mero Coding Class, helping beginners build a strong foundation in programming. I'm currently doing a 2-month fullstack internship at Miraai Solutions, where I contribute to real product features and backend development. What drives me is <span className="text-foreground font-medium">delivering practical solutions that create impact</span>, continuous learning, and collaborating with teams to ship products that matter. I'm adaptable, consistent under pressure, and always eager to learn fast and tackle new challenges.
              </p>
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
      </div>
    </section>
  );
};
