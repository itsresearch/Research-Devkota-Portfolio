import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Download, ExternalLink, MapPin, Building2 } from 'lucide-react';
import { TypeWriter } from './TypeWriter';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const stats = [
  { label: 'Company Founded', value: '2026' },
  { label: 'ERP · LMS · CRM', value: 'Built' },
  { label: 'Laravel · React · Python', value: 'Stack' },
];

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-24 pb-20 bg-background">

      {/* Subtle background: dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #2563eb14 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Soft blue wash top-right */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(37,99,235,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Soft gold wash bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(245,158,11,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 w-full">

        {/* ── Left: Text Content ── */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">

          {/* Status pill */}
          <motion.div custom={0} initial="hidden" animate="show" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200 mb-5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Available for Partnerships
            </span>
          </motion.div>

          {/* Founder badge */}
          <motion.div custom={1} initial="hidden" animate="show" variants={fadeUp} className="mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-primary/5 border border-primary/15 text-sm font-medium text-slate-700">
              <img src="/logos/navyaedtech.webp" alt="Navya EdTech" className="h-5 w-5 object-contain rounded" />
              <span>Co-Founder · Navya EdTech</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div custom={2} initial="hidden" animate="show" variants={fadeUp}>
            <h1 className="font-display font-bold tracking-tight leading-[1.06] mb-6 text-foreground"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
              Research{' '}
              <span className="gradient-text">Devkota</span>
            </h1>
          </motion.div>

          {/* Typewriter subtitle */}
          <motion.div custom={3} initial="hidden" animate="show" variants={fadeUp}
            className="text-xl md:text-2xl text-muted-foreground mb-5 font-medium">
            <TypeWriter
              words={[
                'Co-Founder, Navya EdTech',
                'Fullstack Developer',
                'Laravel Specialist',
                'Python Instructor',
                'Backend Developer',
                'Problem Solver',
              ]}
              className="text-primary font-semibold"
            />
          </motion.div>

          {/* Bio */}
          <motion.p custom={4} initial="hidden" animate="show" variants={fadeUp}
            className="speakable-bio text-muted-foreground mb-7 leading-relaxed text-base max-w-xl">
            I co-founded{' '}
            <a href="https://navyaedtech.com" target="_blank" rel="noopener noreferrer"
              className="text-primary font-medium hover:underline underline-offset-2">
              Navya EdTech
            </a>
            , where we build custom software, ERP &amp; LMS platforms, and cloud systems for businesses across Nepal.
            I'm a fullstack developer building with Laravel and React daily, and teach Python at Mero Coding Class.
          </motion.p>

          {/* Location chip */}
          <motion.div custom={5} initial="hidden" animate="show" variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary" />
              Kathmandu, Nepal 🇳🇵
            </span>
          </motion.div>

          {/* Social links */}
          <motion.div custom={6} initial="hidden" animate="show" variants={fadeUp}
            className="flex gap-3 mb-8 justify-center lg:justify-start">
            {[
              { href: 'https://github.com/itsresearch', icon: <Github size={18} />, label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/researchdevkota', icon: <Linkedin size={18} />, label: 'LinkedIn' },
              { href: 'mailto:devkotaresearch@gmail.com', icon: <Mail size={18} />, label: 'Email' },
            ].map((s) => (
              <a key={s.label} href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="social-icon">
                {s.icon}
              </a>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div custom={7} initial="hidden" animate="show" variants={fadeUp}
            className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a href="#projects" className="btn-primary">
              View Projects
              <ArrowRight size={16} />
            </a>
            <a href="/Research_Resume.pdf" download="Research_Resume.pdf"
              className="btn-secondary">
              <Download size={16} />
              Resume
            </a>
            <a href="https://navyaedtech.com/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:-translate-y-0.5 transition-all duration-200">
              <Building2 size={15} />
              Navya EdTech
              <ExternalLink size={13} />
            </a>
          </motion.div>
        </div>

        {/* ── Right: Photo + Stats ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-shrink-0 flex flex-col items-center gap-8">

          {/* Photo */}
          <div className="relative">
            {/* Decorative ring */}
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-primary/10 to-amber-400/10 rotate-3" />
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-primary/8 to-transparent -rotate-3" />

            {/* Photo container */}
            <motion.div
              whileHover={{ scale: 1.03, rotate: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl bg-white z-10">
              <img
                src="https://avatars.githubusercontent.com/u/134274596?v=4"
                alt="Research Devkota — Co-Founder of Navya EdTech"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Floating badge — Co-Founder */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 -right-5 z-20 bg-white border border-slate-200 shadow-lg rounded-2xl px-4 py-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 size={15} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Co-Founder</p>
                <p className="text-xs font-bold text-foreground">Navya EdTech</p>
              </div>
            </motion.div>

            {/* Floating badge — Location */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -top-5 -left-5 z-20 bg-white border border-slate-200 shadow-lg rounded-2xl px-4 py-2.5">
              <p className="text-xs font-semibold text-foreground">Nepal 🇳🇵</p>
              <p className="text-[10px] text-muted-foreground">Kathmandu</p>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.7 }}
            className="flex gap-4 justify-center">
            {stats.map((s, i) => (
              <motion.div key={s.label}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="text-center px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm min-w-[90px]">
                <p className="text-base font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};
