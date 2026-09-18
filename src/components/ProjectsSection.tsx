import { motion } from 'motion/react';
import { Project } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-transparent">
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 relative z-10">
        
        {/* Section Header Matching Design */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="mb-3 text-xs font-mono uppercase tracking-[0.22em] text-cyan-400">Proyek Saya</p>
          <motion.h2 
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-sans"
          >
            <span>Karya &amp; </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400">
              Kontribusi
            </span>
          </motion.h2>

          {/* Glowing Pill Divider Line */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-12 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 rounded-full mx-auto my-5 shadow-[0_0_12px_rgba(45,212,191,0.7)]"
          />


        </div>

        {/* Responsive grid of featured projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.filter((project) => project.featured).map((project, idx) => {

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(5px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group rounded-2xl bg-[#0c1017] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 overflow-hidden flex flex-col shadow-xl shadow-black/60 hover:-translate-y-1.5"
              >
                {/* Screenshot Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#080b10] border-b border-white/[0.06]">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-transparent to-transparent opacity-20 pointer-events-none" />


                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 text-left flex-1 flex flex-col justify-start">
                  <p className="text-xs uppercase tracking-widest text-cyan-400 mb-1">{project.subtitle}</p>
                  {project.role && <p className="text-xs text-slate-400 mb-4">{project.role}</p>}
                  {/* Tech Badges as Dot-separated Text */}
                  <div className="text-xs font-mono text-cyan-400 font-medium mb-2 tracking-wide flex items-center flex-wrap gap-1.5">
                    {project.tags.join(' • ')}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-sans mb-3 tracking-tight">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300/90 leading-relaxed font-sans">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
