import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  Github, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Calendar, 
  UserCheck, 
  Layers,
  Activity
} from 'lucide-react';
import { Project } from '../types';
import { soundFx } from '../lib/audio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl rounded-3xl border border-cyan-500/30 bg-[#0c101c] shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header Image with Gradient */}
          <div className="relative h-56 sm:h-72 w-full overflow-hidden flex-shrink-0 bg-slate-900">
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c101c] via-[#0c101c]/40 to-transparent" />

            {/* Close Button */}
            <button
              id="close-project-modal-btn"
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category Pill */}
            <div className="absolute bottom-4 left-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-black font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-cyan-500/40">
                {project.category}
              </span>
              {project.year && (
                <span className="px-2.5 py-1 rounded-full bg-black/60 text-slate-300 font-mono text-xs border border-white/10 backdrop-blur-md flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {project.year}
                </span>
              )}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* Title and Subtitle */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base text-cyan-300 font-medium mt-1">
                {project.subtitle}
              </p>
            </div>

            {/* Action Demo & GitHub Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Project</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs font-mono border border-white/10 transition-all flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>View Source Code</span>
                </a>
              )}

              {project.role && (
                <span className="ml-auto text-xs font-mono text-slate-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Role: {project.role}</span>
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                System Overview
              </h4>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Metrics (if available) */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.metrics.map((m, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
                    <p className="text-xl font-black text-cyan-300">{m.value}</p>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Feature List */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Key Architecture & Features</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-normal">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Tags */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
