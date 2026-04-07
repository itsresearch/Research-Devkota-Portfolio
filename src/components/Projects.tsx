import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Github, ChevronRight } from 'lucide-react';

const categories = [
  'All',
  'Full-stack projects',
  'Front-end projects',
  'Back-end projects',
];

const projects = [
  {
    title: 'SaaS Chatbot Platform',
    description:
      'A multi-tenant SaaS chatbot platform where businesses can create chatbot widgets for their websites. It includes admin dashboards, client management, website integration, and automated conversation handling.',
    tags: ['Laravel', 'PHP', 'MySQL', 'SaaS', 'Fullstack'],
    categories: ['Full-stack projects'],
    github: 'https://github.com/itsresearch/Chatbot',
    live: '',
    image: '/projects/chatbot.png',
  },
  {
    title: 'Internal Banking System',
    description:
      'An internal banking management system designed to handle customer accounts, transactions, and internal financial operations with role-based access control.',
    tags: ['Laravel', 'PHP', 'MySQL', 'RBAC', 'Backend'],
    categories: ['Back-end projects'],
    github: 'https://github.com/itsresearch/Internal-Banking-System',
    live: '',
    image: '/projects/internalbanking.png',
  },
  {
    title: 'Restaurant Management System',
    description:
      'A system designed to manage restaurant operations including orders, menu management, billing, and basic administrative controls.',
    tags: ['Laravel', 'PHP', 'MySQL', 'POS', 'Fullstack'],
    categories: ['Full-stack projects'],
    github: 'https://github.com/itsresearch/Restaurant-Management-System',
    live: '',
    image: '/projects/restaurant.png',
  },
  {
    title: 'Student Management System',
    description:
      'A web-based system for managing student records, courses, and academic information.',
    tags: ['Django', 'Python', 'Backend', 'Education'],
    categories: ['Back-end projects'],
    github: 'https://github.com/itsresearch/Student-Management-System',
    live: '',
    image: '/projects/studentmanagement.png',
  },
  {
    title: 'GharSewa',
    description:
      'GharSewa is a Django-based web platform for booking and managing home services such as painting, plumbing, electrical work, cleaning, appliance repair, and more. It connects users with verified service providers and streamlines finding, booking, and reviewing services.',
    tags: ['Django', 'Python', 'Marketplace', 'Fullstack'],
    categories: ['Full-stack projects'],
    github: 'https://github.com/itsresearch/GharSewa-Online-Home-Service',
    live: '',
    image: '/projects/Gharsewa.png',
  },
  {
    title: 'Online News Portal',
    description:
      'A dynamic online news portal built with Django, where users can browse and read the latest news across categories with an admin panel for content management and a clean responsive UI.',
    tags: ['Django', 'Python', 'CMS', 'Backend'],
    categories: ['Back-end projects'],
    github: 'https://github.com/itsresearch/News-Portal',
    live: '',
    image: '/projects/NewsPortal.png',
  },
  {
    title: 'Old Portfolio',
    description: 'My previous portfolio project built with React.',
    tags: ['React', 'Frontend', 'Portfolio'],
    categories: ['Front-end projects'],
    github: 'https://github.com/itsresearch/old-portfolio',
    live: '',
    image: '/projects/oldportfolio.png',
  },
  {
    title: 'On going Projects....',
    description: 'In-progress projects. Screenshots and links will be added as development continues.',
    tags: ['In Progress'],
    categories: ['Front-end projects'],
    github: '',
    live: '',
    image: '/projects/ongoing-projects.png',
  },
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = projects.filter(
    (project) => activeCategory === 'All' || project.categories.includes(activeCategory)
  );

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);

  return (
    <section id="projects" className="py-24 relative" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of my Laravel, Django, and frontend projects
          </p>
        </motion.div>

        {/* Category Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setShowAll(false); // Reset show all when changing category
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border group min-h-[500px]"
              style={{ boxShadow: '0 8px 32px 0 hsl(var(--card) / 0.16)' }}
            >
              <div className="relative w-full aspect-[4/2.2] bg-secondary overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col flex-1 px-6 pt-6 pb-7">
                <h3 className="font-display font-bold text-xl lg:text-2xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-normal line-clamp-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mt-auto">
                  {project.github?.trim() && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Github size={18} />
                      View Code
                    </a>
                  )}
                  {project.live?.trim() && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                      <ExternalLink size={18} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More Button */}
        {filteredProjects.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-16"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-secondary"
            >
              {showAll ? 'Show Less' : 'View All Projects'}
              <ChevronRight size={18} className={`transition-transform ${showAll ? 'rotate-90' : ''}`} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
