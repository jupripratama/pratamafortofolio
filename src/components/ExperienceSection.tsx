import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  Building, 
  MapPin, 
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Experience, Education } from '../types';
import { soundFx } from '../lib/audio';

interface ExperienceSectionProps {
  experiences: Experience[];
  educations: Education[];
}

export function ExperienceSection({ experiences, educations }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
            <span className="font-bold">+</span>
            <span>LOG_SYSTEM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            Rekam Jejak <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">Operasional</span>
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Catatan kronologis pendidikan dan pengalaman profesional di industri telekomunikasi & pengembangan software.
          </p>
        </motion.div>

        {/* 2 Columns: Pendidikan on Left, Pengalaman on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: PENDIDIKAN ================= */}
          <motion.div 
            initial={{ opacity: 0, x: -35, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">Pendidikan</h3>
            </div>

            <div className="space-y-4">
              {/* Education 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => soundFx.playHover()}
                className="p-5 rounded-2xl bg-[#090d14]/90 border border-white/10 hover:border-amber-500/40 transition-all text-left group shadow-lg shadow-black/40"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>2015 - 2019</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Sarjana Sistem Informasi (S.Kom)
                </h4>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  STMIK Borneo Internasional Balikpapan
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Fokus Rekayasa Perangkat Lunak, Basis Data Relasional, dan Infrastruktur Jaringan. Publikasi riset ilmiah kepuasan game MOBA pada J-SIM (Okt 2019).
                </p>
              </motion.div>

              {/* Education 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => soundFx.playHover()}
                className="p-5 rounded-2xl bg-[#090d14]/90 border border-white/10 hover:border-amber-500/40 transition-all text-left group shadow-lg shadow-black/40"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400/60" />
                  <span>2012 - 2015</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Pendidikan Menengah Kejuruan / SMA
                </h4>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Dasar Komputer & Jaringan Telematika
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: PENGALAMAN ================= */}
          <motion.div 
            initial={{ opacity: 0, x: 35, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono">Pengalaman</h3>
            </div>

            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => soundFx.playHover()}
                  className="p-5 rounded-2xl bg-[#090d14]/90 border border-white/10 hover:border-emerald-500/40 transition-all text-left group shadow-lg shadow-black/40"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{exp.period}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                      {exp.type}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {exp.role}
                  </h4>
                  <p className="text-xs font-mono text-slate-300 mt-0.5">
                    {exp.company} • <span className="text-slate-400">{exp.location}</span>
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
                    {exp.description.map((desc, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">›</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                    {exp.skills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
