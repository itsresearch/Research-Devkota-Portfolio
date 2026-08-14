import { useRef } from 'react';
import { Award, ExternalLink, FileText } from 'lucide-react';
import { useStagger, useReveal } from '@/hooks/useGSAP';

type Kind = 'image' | 'pdf';
interface Cert { name: string; authority: string; href: string; kind: Kind; preview?: string; description: string[]; }

const CERTS: Cert[] = [
  { name: 'AWS Summit India Online',              authority: 'AWS',                  href: '/Certificates/AWS%20summit.png',                      kind: 'image', preview: '/Certificates/AWS%20summit.png',          description: ['Certificate of attendance from AWS Summit India Online', 'Cloud fundamentals and modern AWS ecosystem exposure'] },
  { name: 'Crash Course on Python',               authority: 'Google / Coursera',    href: '/Certificates/crash_course_on%20_python.pdf',         kind: 'pdf',   preview: '/Certificates/python.png',               description: ['Python fundamentals certificate', 'Programming basics and problem-solving practice'] },
  { name: 'Broadway',                             authority: 'Broadway',             href: '/Certificates/Broadway.pdf',                          kind: 'image', preview: '/Certificates/broadway.png',             description: ['Participation certificate', 'Open the file to view the full certificate content'] },
  { name: 'Coursera HTML',                        authority: 'Coursera',             href: '/Certificates/Coursera%20HTML.pdf',                   kind: 'pdf',   preview: '/Certificates/courserahtml.png',          description: ['HTML course completion certificate', 'Web structure and markup fundamentals'] },
  { name: 'GitHub Campus Expert Workshop',        authority: 'NCC BIM Connect',      href: '/Certificates/NCC_github_workshop.png',               kind: 'image', preview: '/Certificates/NCC_github_workshop.png',  description: ['Git and GitHub workshop participation', 'Hands-on collaboration and version control training'] },
  { name: 'Meta Version Control',                 authority: 'Meta',                 href: '/Certificates/Meta-Version-Control.pdf',              kind: 'pdf',   preview: '/Certificates/metaversion.png',           description: ['Version control fundamentals certificate', 'Git workflows and collaborative development'] },
  { name: 'Introduction to Frontend',             authority: 'Online Course',        href: '/Certificates/Introduction%20to%20frontend.pdf',      kind: 'pdf',   preview: '/Certificates/introfrontend.png',         description: ['Frontend development introduction certificate', 'HTML, CSS, JavaScript, and UI fundamentals'] },
  { name: 'Techniques for Big Data Analytics',    authority: 'Skillsoft',            href: '/Certificates/badge.png',                             kind: 'image', preview: '/Certificates/badge.png',                description: ['Skillsoft completion badge', 'Large-scale data analysis concepts'] },
  { name: 'Digital Strategy Brand Marketing',     authority: 'Mindluster',           href: '/Certificates/digital-marketing.jpg',                 kind: 'image', preview: '/Certificates/digital-marketing.jpg',    description: ['Digital strategy and branding workshop', 'Marketing fundamentals and practical strategy'] },
  { name: 'Coursera WordPress',                   authority: 'Coursera',             href: '/Certificates/Coursera%20Wordpress.pdf',              kind: 'pdf',   preview: '/Certificates/courserawordpress.png',     description: ['WordPress course completion certificate', 'Website creation and CMS basics'] },
  { name: 'Program and Project Management',       authority: 'Professional Dev',     href: '/Certificates/Program%20and%20project%20management.pdf', kind: 'pdf', preview: '/Certificates/programmgmt.png',        description: ['Program and project management certificate', 'Planning, coordination, and execution skills'] },
  { name: 'UI/UX Design',                         authority: 'Design Course',        href: '/Certificates/UI-UX.pdf',                             kind: 'pdf',   preview: '/Certificates/uiux.png',                 description: ['UI/UX design certificate', 'User interface principles and experience design'] },
];

export const Certifications = ({ limit }: { limit?: number }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);

  useReveal(headerRef as React.RefObject<HTMLElement>);
  useStagger(gridRef as React.RefObject<HTMLElement>, ':scope > *', { stagger: 0.07, y: 40 });

  const shown = limit ? CERTS.slice(0, limit) : CERTS;

  return (
    <section id="certifications" className="py-28 relative">
      <div className="section-container">
        <div ref={headerRef} className="text-center mb-16">
          <p className="section-tag mb-4"><Award size={12} /> Credentials</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5">
            Certificates &amp; <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A curated collection of certifications, workshops, and course completions.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map(cert => (
            <a
              key={cert.name}
              href={cert.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2"
              style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}
            >
              {/* Preview image */}
              <div className="relative overflow-hidden"
                style={{ background: 'hsl(var(--surface-2))', borderBottom: '1px solid hsl(var(--border))' }}>
                {cert.preview ? (
                  <img src={cert.preview} alt={cert.name} loading="lazy"
                    className="h-44 w-full object-contain bg-white/5 p-3 transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-44 items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}>
                        <FileText size={22} />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">PDF Certificate</p>
                    </div>
                  </div>
                )}
                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: 'hsl(var(--primary) / 0.08)' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'hsl(var(--primary))', boxShadow: '0 4px 20px hsl(var(--primary) / 0.5)' }}>
                    <ExternalLink size={16} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}>
                    <Award size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                      style={{ color: 'hsl(var(--primary) / 0.7)' }}>
                      {cert.kind === 'image' ? 'Certificate' : 'PDF Certificate'} · {cert.authority}
                    </p>
                    <h3 className="font-display font-bold text-base leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {cert.name}
                    </h3>
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {cert.description.map(p => (
                    <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'hsl(var(--primary))' }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
