import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export const VisionBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="vision-strip"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
      <div className="section-container relative py-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Navya EdTech Logo & Tagline */}
        <div className="flex items-center gap-4">
          <img src="/logos/navyaedtech.webp" alt="Navya EdTech" className="h-10 object-contain" />
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-lg leading-none">Navya EdTech</span>
            <span className="text-sm text-muted-foreground">Empowering Businesses</span>
          </div>
        </div>

        {/* Center: 3 Stats */}
        <div className="flex items-center gap-4 md:gap-8 text-sm font-medium text-muted-foreground hidden lg:flex">
          <span className="text-foreground">Enterprise IT</span>
          <div className="w-[1px] h-4 bg-border/50" />
          <span className="text-foreground">ERP · LMS · CRM</span>
          <div className="w-[1px] h-4 bg-border/50" />
          <span className="text-foreground">Nepal's Tech</span>
        </div>

        {/* Right: CTA */}
        <a
          href="https://navyaedtech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
        >
          Visit navyaedtech.com
          <ExternalLink size={14} />
        </a>

      </div>
    </motion.div>
  );
};
