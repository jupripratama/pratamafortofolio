import { motion } from 'motion/react';
import { Project } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header Matching Design */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-sans"
          >
            <span>Proyek </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400">
              Terpilih
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

          <motion.p 
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-300 text-sm sm:text-base font-sans"
          >
            Beberapa karya yang menyoroti keahlian full-stack saya.
          </motion.p>
        </div>

        {/* 2x2 Grid of Clean Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.slice(0, 4).map((project, idx) => {
            const indexNumber = String(idx + 1).padStart(2, '0');

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
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#080b10] border-b border-white/[0.06]">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Corner Number Badge (01, 02, 03, 04) */}
                  <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] font-bold flex items-center justify-center shadow-lg pointer-events-none">
                    {indexNumber}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 text-left flex-1 flex flex-col justify-start">
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

        {/* Bottom CTA Button: Lihat Semua Proyek -> */}
        <div className="mt-12 text-center">
          <a
            id="view-all-projects-btn"
            href="https://github.com/jupriekapratama"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-2.5 rounded-xl bg-black/40 hover:bg-cyan-500/10 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 font-medium text-sm transition-all duration-200 inline-flex items-center gap-2 font-sans shadow-lg shadow-black/40 cursor-pointer"
          >
            <span>Lihat Semua Proyek</span>
            <span className="text-base font-normal">→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
