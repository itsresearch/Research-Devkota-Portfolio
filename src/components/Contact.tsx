import { useRef, useState } from 'react';
import { useReveal } from '@/hooks/useGSAP';
import { Mail, Send, MapPin, Linkedin, Github, Building2, BookOpen, Code2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

const CONTACTS = [
  { icon: <Mail size={17} />,      label: 'Email',       value: 'devkotaresearch@gmail.com', href: 'mailto:devkotaresearch@gmail.com', color: 'hsl(var(--primary))' },
  { icon: <Linkedin size={17} />,  label: 'LinkedIn',    value: '/in/researchdevkota',        href: 'https://www.linkedin.com/in/researchdevkota', color: 'hsl(192 100% 52%)' },
  { icon: <Github size={17} />,    label: 'GitHub',      value: 'github.com/itsresearch',     href: 'https://github.com/itsresearch', color: 'hsl(246 90% 68%)' },
  { icon: <Building2 size={17} />, label: 'Company',     value: 'navyaedtech.com',            href: 'https://navyaedtech.com', color: 'hsl(35 98% 58%)' },
  { icon: <MapPin size={17} />,    label: 'Location',    value: 'Kathmandu, Nepal 🇳🇵',       href: null, color: 'hsl(142 71% 55%)' },
  { icon: <BookOpen size={17} />,  label: 'Medium',      value: '@devkotaresearch',           href: 'https://medium.com/@devkotaresearch', color: 'hsl(5 90% 60%)' },
];

const INPUT_CLS = `
  w-full px-4 py-3 rounded-xl text-sm text-foreground placeholder-muted-foreground/50
  bg-[hsl(var(--surface-2))] border border-[hsl(var(--border))]
  focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.4)] focus:border-[hsl(var(--primary)/0.5)]
  transition-all duration-200
`;

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  useReveal(sectionRef as React.RefObject<HTMLElement>);
  useReveal(leftRef  as React.RefObject<HTMLElement>, { delay: 0.1, y: 40 });
  useReveal(rightRef as React.RefObject<HTMLElement>, { delay: 0.25, y: 40 });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await emailjs.sendForm(
        'service_rus0kuj',
        'template_tlvoipb',
        e.currentTarget,
        'GucQZNTsN9ZVLCPg7',
      );
      if (res.text === 'OK') {
        toast.success("Message sent! I'll get back to you soon 🙌");
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      toast.error('Failed to send. Email me directly at devkotaresearch@gmail.com');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-28 relative">
      {/* Aurora blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-[140px] opacity-10"
          style={{ background: 'hsl(var(--primary))' }} />
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full blur-[120px] opacity-8"
          style={{ background: 'hsl(var(--accent) / 0.08)' }} />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-tag mb-4"><Mail size={12} /> Get In Touch</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5">
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Have a project in mind? Building an EdTech platform, ERP system, or custom software?
            I'd love to hear about it.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — Contact info */}
          <div ref={leftRef} className="space-y-5">
            <div className="p-6 rounded-2xl mb-6"
              style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}>
              <h3 className="font-display font-bold text-xl mb-2 text-foreground">Let's build something great</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of something meaningful. Whether it's a quick question or a big product — reach out.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONTACTS.map(c => (
                <div key={c.label}
                  className="group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{ background: `${c.color}15`, color: c.color }}>
                    {c.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{c.label}</p>
                    {c.href
                      ? <a href={c.href} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground hover:underline truncate block transition-colors"
                          style={{ '--hover': c.color } as React.CSSProperties}
                          onMouseEnter={e => e.currentTarget.style.color = c.color}
                          onMouseLeave={e => e.currentTarget.style.color = ''}>
                          {c.value}
                        </a>
                      : <p className="text-sm font-medium text-foreground truncate">{c.value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Availability badge */}
            <div className="flex items-center gap-3 p-4 rounded-xl mt-4"
              style={{ background: 'hsl(142 71% 45% / 0.08)', border: '1px solid hsl(142 71% 45% / 0.2)' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-400">Available for partnerships</p>
                <p className="text-xs text-muted-foreground mt-0.5">Open to freelance projects and technical collaborations</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div ref={rightRef}>
            <form onSubmit={handleSubmit} className="p-7 rounded-2xl space-y-5"
              style={{ background: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))' }}>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Name</label>
                  <input type="text" name="from_name" required placeholder="Your name" className={INPUT_CLS} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Email</label>
                  <input type="email" name="reply_to" required placeholder="your@email.com" className={INPUT_CLS} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Subject</label>
                <input type="text" name="subject" required placeholder="What's this about?" className={INPUT_CLS} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Message</label>
                <textarea name="message" required rows={5} placeholder="Tell me about your project, idea, or question…" className={`${INPUT_CLS} resize-none`} />
              </div>

              <button type="submit" disabled={sending}
                className="w-full btn-primary justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                {sending
                  ? <><RefreshCw size={16} className="animate-spin" /> Sending…</>
                  : <><Send size={16} /> Send Message</>}
              </button>

              <p className="text-xs text-center text-muted-foreground/60">
                Or email directly:{' '}
                <a href="mailto:devkotaresearch@gmail.com" className="text-primary hover:underline">
                  devkotaresearch@gmail.com
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
