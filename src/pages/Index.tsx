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
    document.title = 'Research Devkota | Co-Founder, Navya EdTech';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Research Devkota - Co-founder of Navya EdTech and fullstack developer based in Kathmandu, Nepal. Building custom enterprise software, ERP and LMS platforms, and cloud systems with Laravel, React, and Python.'
      );
    }

    // The browser gives up scrolling to the hash target on load — React hasn't
    // rendered the section yet. Do it once the page is mounted.
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'instant' });
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
