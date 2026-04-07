import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Send, MapPin, Linkedin, Github, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await emailjs.sendForm(
        'service_rus0kuj',
        'template_tlvoipb',
        e.currentTarget,
        'GucQZNTsN9ZVLCPg7'
      );

      if (result.text === 'OK') {
        toast({
          title: "Message sent!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Something went wrong. Please try again or email me directly.",
        variant: "destructive",
      });
      console.error('EmailJS Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative" ref={ref}>
      {/* Background Effect */}
      <div className="absolute inset-0 bg-radial-gradient opacity-50" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you! Let's build something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-display text-xl font-semibold mb-6">Get in Touch</h3>

            <div className="space-y-6">
              <a
                href="mailto:devkotaresearch@gmail.com"
                className="flex items-center gap-4 glass-card p-4 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium group-hover:text-primary transition-colors">devkotaresearch@gmail.com</p>
                </div>
              </a>

              <a
                href="tel:+9779862414236"
                className="flex items-center gap-4 glass-card p-4 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium group-hover:text-primary transition-colors">+977 9862414236</p>
                </div>
              </a>

              <div className="flex items-center gap-4 glass-card p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">Kirtipur, Kathmandu, Nepal 🇳🇵</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-4">Connect on social media</p>
              <div className="flex gap-3">
                <a href="https://www.linkedin.com/in/researchdevkota" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Linkedin size={20} />
                </a>
                <a href="https://github.com/itsresearch" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Github size={20} />
                </a>
                <a href="https://www.instagram.com/research_.dev" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="from_name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="from_name"
                    name="from_name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="from_email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="from_email"
                    name="from_email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Subject of your message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                    placeholder="Tell me about your project or opportunity..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
