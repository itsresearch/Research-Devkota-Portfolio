import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, ExternalLink, FileText } from 'lucide-react';

type CertificateKind = 'image' | 'pdf';

interface Certificate {
  name: string;
  authority: string;
  href: string;
  kind: CertificateKind;
  preview?: string;
  description: string[];
}

const certificates: Certificate[] = [
  {
    name: 'AWS Summit India Online',
    authority: 'AWS',
    href: '/Certificates/AWS%20summit.png',
    kind: 'image',
    preview: '/Certificates/AWS%20summit.png',
    description: ['Certificate of attendance from AWS Summit India Online', 'Cloud fundamentals and modern AWS ecosystem exposure'],
  },

  {
    name: 'Crash Course on Python',
    authority: 'Google / Coursera',
    href: '/Certificates/crash_course_on%20_python.pdf',
    kind: 'pdf',
    preview: '/Certificates/python.png',
    description: ['Python fundamentals certificate', 'Programming basics and problem-solving practice'],
  },
    {
    name: 'Broadway',
    authority: 'Broadway',
    href: '/Certificates/Broadway.pdf',
    kind: 'image',
    preview: '/Certificates/broadway.png',
    description: ['Certificate document stored as PDF', 'Open the file to view the full certificate content'],
  },

  {
    name: 'Coursera HTML',
    authority: 'Coursera',
    href: '/Certificates/Coursera%20HTML.pdf',
    kind: 'pdf',
    preview: '/Certificates/courserahtml.png',
    description: ['HTML course completion certificate', 'Web structure and markup fundamentals'],
  },
    {
    name: 'GitHub Campus Expert Workshop',
    authority: 'NCC BIM Connect',
    href: '/Certificates/NCC_github_workshop.png',
    kind: 'image',
    preview: '/Certificates/NCC_github_workshop.png',
    description: ['Participation certificate for the Git and GitHub workshop', 'Hands-on collaboration and version control training'],
  },

  {
    name: 'Meta Version Control',
    authority: 'Meta',
    href: '/Certificates/Meta-Version-Control.pdf',
    kind: 'pdf',
    preview: '/Certificates/metaversion.png',
    description: ['Version control fundamentals certificate', 'Git workflows and collaborative development'],
  },
    {
    name: 'Introduction to frontend',
    authority: 'Online Course',
    href: '/Certificates/Introduction%20to%20frontend.pdf',
    kind: 'pdf',
    preview: '/Certificates/introfrontend.png',
    description: ['Frontend development introduction certificate', 'HTML, CSS, JavaScript, and UI fundamentals'],
  },

  {
    name: 'Techniques for Big Data Analytics',
    authority: 'Skillsoft',
    href: '/Certificates/badge.png',
    kind: 'image',
    preview: '/Certificates/badge.png',
    description: ['Skillsoft completion badge for big data analytics techniques', 'Learning focused on large-scale data analysis concepts'],
  },

  {
    name: 'Digital Strategy Brand Marketing Workshop',
    authority: 'Mindluster',
    href: '/Certificates/digital-marketing.jpg',
    kind: 'image',
    preview: '/Certificates/digital-marketing.jpg',
    description: ['Workshop completion certificate for digital strategy and branding', 'Marketing fundamentals and practical strategy concepts'],
  },

  {
    name: 'Coursera Wordpress',
    authority: 'Coursera',
    href: '/Certificates/Coursera%20Wordpress.pdf',
    kind: 'pdf',
    preview: '/Certificates/courserawordpress.png',
    description: ['WordPress course completion certificate', 'Website creation and content management basics'],
  },


  {
    name: 'Program and Project Management',
    authority: 'Professional Development',
    href: '/Certificates/Program%20and%20project%20management.pdf',
    kind: 'pdf',
    preview: '/Certificates/programmgmt.png',
    description: ['Program and project management certificate', 'Planning, coordination, and execution skills'],
  },
  {
    name: 'UI-UX',
    authority: 'Design Course',
    href: '/Certificates/UI-UX.pdf',
    kind: 'pdf',
    preview: '/Certificates/uiux.png',
    description: ['UI/UX design certificate', 'User interface principles and experience design'],
  },

];

export const Certifications = ({ limit }: { limit?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const displayedCertificates = limit ? certificates.slice(0, limit) : certificates;

  return (
    <section id="certifications" className="py-24 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Certificates & <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated collection of my certificate files, workshops, and course completions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {displayedCertificates.map((certificate, index) => (
            <motion.a
              key={certificate.name}
              href={certificate.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="glass-card p-5 hover:border-primary/30 transition-all duration-300 group cursor-pointer hover:translate-y-[-4px] hover:shadow-lg"
            >
              <div className="mb-5 overflow-hidden rounded-2xl border border-border/50 bg-secondary/20">
                {certificate.preview ? (
                  <img
                    src={certificate.preview}
                    alt={certificate.name}
                    className="h-52 w-full object-contain bg-white p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/40 to-background p-6">
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <FileText className="h-7 w-7" />
                      </div>
                      <p className="text-sm font-medium text-foreground">PDF Certificate</p>
                      <p className="text-xs text-muted-foreground">Open to view the document</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 mb-3">
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                    {certificate.kind === 'image' ? 'Image Certificate' : 'PDF Certificate'}
                  </p>
                  <h3 className="font-display font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {certificate.name}
                  </h3>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {certificate.authority}
                  </p>
                </div>
                <ExternalLink size={16} className="mt-1 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <ul className="space-y-2">
                {certificate.description.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">▹</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
