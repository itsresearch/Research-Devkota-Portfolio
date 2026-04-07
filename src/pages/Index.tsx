import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { Experience } from '@/components/Experience';
import { Education } from '@/components/Education';
import { Certifications } from '@/components/Certifications';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Index = () => {
  const [showAllCertifications, setShowAllCertifications] = useState(false);

  useEffect(() => {
    document.title = 'Research Devkota | Full Stack Developer Portfolio';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Portfolio of Research Devkota - Full Stack Developer, Laravel Expert based in Kathmandu, Nepal. Expertise in Laravel, React, Python and modern web technologies.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />

        {showAllCertifications ? (
          <Certifications />
        ) : (
          <>
            <Certifications limit={6} />
            <div className="text-center pb-12">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setShowAllCertifications(true)}
                className="btn-primary"
              >
                View All Certifications
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </>
        )}

        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
