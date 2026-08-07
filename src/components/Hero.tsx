import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, Download, ExternalLink } from 'lucide-react';
import { TypeWriter } from './TypeWriter';
import heroBg from '@/assets/hero-bg.png';

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-radial-gradient" />
      <div className="noise-overlay" />

      {/* Floating Orbs — Navya blue & gold */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(220 100% 56% / 0.15), transparent 70%)' }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(37 100% 57% / 0.10), transparent 70%)' }}
      />

      <div className="section-container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
        {/* Left Column: Text Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center lg:items-start gap-4 mb-6"
          >
            {/* Small animated status pill */}
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold tracking-tight">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Available for Partnerships
            </p>
            {/* Founder badge */}
            <div className="founder-badge">
              <img src="/logos/navyaedtech.webp" alt="Navya EdTech" className="h-5 w-5 object-contain" />
              <span>Co-Founder & CEO · Navya EdTech</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="font-display font-bold tracking-tight leading-[1.08] mb-6" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}>
              Research<br />
              <span className="gradient-text">Devkota</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl"
          >
            <TypeWriter
              words={[
                'Co-Founder, Navya EdTech',
                'Fullstack Developer',
                'Laravel Specialist',
                'Python Instructor',
                'Backend Developer',
                'Problem Solver'
              ]}
              className="text-primary font-semibold"
            />
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="speakable-bio text-muted-foreground mb-8 max-w-xl leading-relaxed text-lg"
          >
            I co-founded <a href="https://navyaedtech.com" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">Navya EdTech</a>, where we build custom software, ERP and LMS platforms, and cloud systems for businesses. I'm a fullstack developer at heart, still writing Laravel and React every day, and I teach Python at Mero Coding Class on the side.
          </motion.p>

          {/* Three STAT PILLS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
          >
            <span className="px-3 py-1.5 text-sm rounded-full border border-border/50 bg-card/50 text-foreground">Co-Founded 2026</span>
            <span className="px-3 py-1.5 text-sm rounded-full border border-border/50 bg-card/50 text-foreground">ERP · LMS · CRM</span>
            <span className="px-3 py-1.5 text-sm rounded-full border border-border/50 bg-card/50 text-foreground">Kathmandu, Nepal 🇳🇵</span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex gap-4 mb-10 justify-center lg:justify-start"
          >
            <a href="https://github.com/itsresearch" target="_blank" rel="noopener noreferrer" className="social-icon">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/researchdevkota" target="_blank" rel="noopener noreferrer" className="social-icon">
              <Linkedin size={20} />
            </a>
            <a href="mailto:devkotaresearch@gmail.com" className="social-icon">
              <Mail size={20} />
            </a>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <a href="#projects" className="btn-primary">
              View Our Work
              <ArrowDown size={18} className="-rotate-90" />
            </a>
            <a href="/Research_Resume.pdf"
              download="Research_Resume.pdf"
              className="btn-secondary flex items-center gap-2"
            >
              Resume
              <Download size={18} />
            </a>
            <a
              href="https://navyaedtech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 border border-accent/40 text-accent hover:bg-accent/10 hover:border-accent hover:shadow-[0_0_20px_hsl(37_100%_57%_/0.2)] hover:-translate-y-0.5"
            >
              Visit Navya EdTech
              <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>

        {/* Right Column: Image with Glowing Rings and Metrics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0 flex justify-center relative w-full lg:w-auto mt-16 lg:mt-0"
        >
          <div className="relative flex items-center justify-center w-[340px] h-[340px]">
            {/* Outer ring */}
            <div className="absolute w-[340px] h-[340px] rounded-full border-2 border-primary blur-[2px] opacity-60 animate-[ring-pulse_6s_infinite_linear_alternate]" />
            {/* Middle ring */}
            <div className="absolute w-[290px] h-[290px] rounded-full border-[1.5px] border-accent blur-[1px] opacity-80 animate-[ring-pulse_4s_infinite_linear_alternate-reverse]" />
            
            {/* Inner Image Container */}
            <div className="relative w-[240px] h-[240px] rounded-full overflow-hidden border-2 border-primary/30 z-10 shadow-2xl bg-card/50">
              <img
                src="https://avatars.githubusercontent.com/u/134274596?v=4"
                alt="Research Devkota"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>

            {/* Floating Metric Cards */}
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="founder-metric-card top-0 -left-12 z-20"
            >
              <p className="text-lg font-bold text-foreground">2026</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Founded</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="founder-metric-card bottom-12 -right-8 z-20"
            >
              <p className="text-lg font-bold text-foreground">ERP/LMS</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Systems Built</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="founder-metric-card top-16 -right-12 z-20"
            >
              <p className="text-lg font-bold text-foreground">Nepal 🇳🇵</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Based In</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
