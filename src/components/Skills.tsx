import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const skillCategories = [
  {
    title: 'Backend Development',
    skills: ['Laravel', 'PHP', 'Python','Django', 'MySQL', 'PostgreSQL', 'REST APIs', 'MVC Pattern', 'Authentication', 'Authorization'],
  },
  {
    title: 'Frontend Development',
    skills: ['JavaScript', 'HTML/CSS', 'React', 'Responsive Design', 'DOM Manipulation', 'Tailwind CSS'],
  },
  {
    title: 'Database & ORM',
    skills: ['MySQL', 'PostgreSQL', 'Eloquent ORM', 'Database Design', 'Query Optimization', 'Migrations', 'Relationships'],
  },
  {
    title: 'Tools & Platforms',
    skills: ['Git/GitHub', 'VS Code', 'Docker', 'Composer', 'Npm/Bun', 'Linux', 'POSTMAN', 'MySQL Workbench', 'Cyprus','Sentry'],
  },
  {
    title: 'Programming Fundamentals',
    skills: ['Object-Oriented Programming', 'Data Structures', 'Algorithms', 'Design Patterns', 'Clean Code', 'Version Control'],
  },
  {
    title: 'Other Skills',
    skills: ['SaaS systems','Leadership','Teaching & Mentoring', 'Problem Solving', 'Project Management', 'Collaboration','RBAC','OAuth','API Development','Quality Assurance','Unit Testing','Debugging','Performance Optimization'],
  },
];

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-24 relative bg-secondary/20" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technologies and skills I've developed through practical projects and professional experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-primary">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    className="skill-badge"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
