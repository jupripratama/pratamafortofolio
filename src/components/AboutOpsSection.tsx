import { motion } from 'motion/react';
import {
  ShieldCheck,
  Radio,
  ArrowRight,
  Layers
} from 'lucide-react';
import { ProfileSettings } from '../types';
import { soundFx } from '../lib/audio';

interface AboutOpsSectionProps {
  profile: ProfileSettings;
  onOpenHireModal: () => void;
}

export function AboutOpsSection({ profile, onOpenHireModal }: AboutOpsSectionProps) {
  return (
    <section id="about" className="pt-6 pb-20 lg:pt-20 relative overflow-hidden bg-transparent">
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Narrative Statement with Presentation Slide-In */}
          <motion.div
            initial={{ opacity: 0, x: -40, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight leading-tight">
              Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">Saya</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Saya Jupri Eka Pratama, lulusan Sistem Informasi dengan pengalaman lebih dari empat tahun di bidang pemrograman. Saya mengembangkan aplikasi backend dan mobile menggunakan TypeScript, PHP, SQL, Go, dan .NET.
            </p>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Selain pengembangan aplikasi, saya berpengalaman menangani infrastruktur IT, jaringan, CCTV, dan radio komunikasi. Saat ini saya bekerja di bagian PM dan dokumentasi di PT Multi Kontrol Nusantara serta berkontribusi sebagai backend developer di PinisiDev Tech.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="ops-learn-more-btn"
                onClick={() => {
                  soundFx.playClick();
                  onOpenHireModal();
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold transition-all shadow-md shadow-black/30 hover:border-cyan-400 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Konsultasi Kebutuhan Sistem</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: SYSTEM_INFO Cyber Terminal Card with Presentation Perspective Slide-In */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.94, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl bg-[#090d14]/95 border border-emerald-500/40 p-5 sm:p-6 font-mono text-xs shadow-[0_0_30px_rgba(16,185,129,0.12)] relative group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-emerald-400 uppercase tracking-wider">SYSTEM_INFO</span>
                </div>
                <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">v2.0</span>
              </div>

              {/* Specs Table List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-500 uppercase tracking-wider text-[11px]">Operator</span>
                  <span className="font-bold text-white text-right">Jupri Eka Pratama</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-slate-500 uppercase tracking-wider text-[11px]">Base / Dom</span>
                  <span className="text-cyan-300 font-medium text-right text-[11px]">KPC Sangatta & Remote</span>
                </div>

                {/* Active Assignments Header */}
                <div className="pt-1.5">
                  <div className="flex items-center justify-between pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      <span>Current Deployments</span>
                    </span>
                    <span className="text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[9px] font-semibold">
                      2 Active Roles
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Node 1: PT Multi Kontrol Nusantara */}
                    <div className="p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/25 hover:border-emerald-500/40 transition-colors">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-medium truncate">PT Multi Kontrol Nusantara</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 shrink-0">On-Site</span>
                      </div>
                      <div className="text-white font-bold text-xs mt-1.5 flex items-center gap-1.5">
                        <span className="text-emerald-400">›</span>
                        <span>PM & Documentation</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 pl-3">
                        Telecom, CCTV & IT Infrastructure
                      </div>
                    </div>

                    {/* Node 2: PinisiDev */}
                    <div className="p-3 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/25 hover:border-cyan-500/40 transition-colors">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-medium truncate">PinisiDev Tech</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 shrink-0">Remote</span>
                      </div>
                      <div className="text-white font-bold text-xs mt-1.5 flex items-center gap-1.5">
                        <span className="text-cyan-400">›</span>
                        <span>Backend Developer</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 pl-3">
                        Golang, NestJS, .NET & API Services
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
                  <span className="text-slate-500 uppercase tracking-wider text-[11px]">Status</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>+ online (dual active)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Micro Grid */}
              <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span>LATENCY: 12ms</span>
                </span>
                <span className="text-emerald-400/80">FREQ: 433.92 MHz</span>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
