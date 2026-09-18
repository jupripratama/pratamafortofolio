import { motion } from 'motion/react';
import { Experience, Education } from '../types';

interface ExperienceSectionProps {
  experiences: Experience[];
  educations: Education[];
}

const referenceOrder = ['PM & Documentation', 'Backend Developer', 'Jr. Teknisi CCTV & Radio Komunikasi', 'IT Operator'];
const formatPeriod = (period: string) => period
  .replace(/Present/gi, 'Sekarang')
  .replace(/\bApr\b/g, 'April')
  .replace(/\bAug\b/g, 'Agustus')
  .replace(/\bFeb\b/g, 'Februari');

export function ExperienceSection({ experiences, educations }: ExperienceSectionProps) {
  const rank = (role: string) => {
    const index = referenceOrder.indexOf(role);
    return index < 0 ? referenceOrder.length : index;
  };
  const timeline = [...experiences].sort((a, b) => rank(a.role) - rank(b.role));
  const currentId = timeline.find((item) => /Present|Sekarang/i.test(item.period))?.id;

  return (
    <section id="experience" aria-label="Pendidikan dan pengalaman kerja" className="relative scroll-mt-24 bg-transparent py-20 lg:py-28">
      <div className="relative z-10 grid w-full grid-cols-1 items-start gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:px-14 xl:px-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="mb-6 text-lg font-bold font-mono text-cyan-300">Pendidikan</h2>
          <ol className="space-y-6">
            {educations.map((education) => (
              <li key={education.id} className="rounded-xl border border-white/10 bg-[#090d14]/90 p-5 transition-colors hover:border-cyan-400/40">
                <p className="mb-2 text-xs font-mono text-cyan-400">{formatPeriod(education.period)}</p>
                <h3 className="text-base font-semibold text-slate-100">{education.degree}</h3>
                <p className="mt-1 text-sm text-cyan-300">{education.institution}</p>
                {education.gpa && <p className="mt-2 text-sm text-slate-400">IPK {education.gpa}</p>}
                {education.description && <p className="mt-3 text-sm leading-7 text-slate-400">{education.description}</p>}
              </li>
            ))}
          </ol>
        </motion.div>
        <div>
          <h2 className="mb-6 text-lg font-bold font-mono text-emerald-300">Pengalaman</h2>
          <ol className="space-y-6">
            {timeline.map((experience, index) => (
              <motion.li
                key={experience.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative rounded-xl border border-white/10 bg-[#090d14]/90 px-5 py-5 transition-colors hover:border-emerald-400/40"
              >
                {experience.id === currentId && (
                  <span className="absolute -top-2 right-4 rounded-full bg-emerald-400 px-2.5 py-1 text-[9px] font-bold leading-none tracking-wide text-[#07090e]">CURRENT</span>
                )}
                <h3 className="text-base font-semibold text-slate-100">{experience.role}</h3>
                <p className="mt-0.5 text-sm text-emerald-300">{experience.company}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{formatPeriod(experience.period)}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
