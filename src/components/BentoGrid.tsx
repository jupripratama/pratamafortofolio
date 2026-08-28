import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Clock, 
  Sparkles, 
  Layers, 
  Code2, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Server,
  Terminal,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { ProfileSettings, Skill } from '../types';
import { soundFx } from '../lib/audio';

interface BentoGridProps {
  profile: ProfileSettings;
  skills: Skill[];
  onOpenHireModal: () => void;
  onSelectSection: (sectionId: string) => void;
}

export function BentoGrid({ profile, skills, onOpenHireModal, onSelectSection }: BentoGridProps) {
  // Live Clock for Local Timezone (WITA / UTC+8)
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tz = 'Asia/Makassar';
      const formatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setTimeString(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const popularSkills = skills.filter(s => s.isPopular).slice(0, 8);

  return (
    <section id="about" className="py-16 sm:py-20 relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple & Clean Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>TENTANG SAYA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Ringkasan Profil & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">Keahlian</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Kombinasi keahlian rekayasa perangkat lunak modern (Full-Stack / Backend) dengan pengalaman praktis infrastruktur IT & telekomunikasi.
          </p>
        </div>

        {/* Clean & Simple Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Card 1: Profil Utama (lg: col-span-7) */}
          <SpotlightCard className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between" spotlightColor="rgba(6, 182, 212, 0.12)">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      {profile.name}
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    </h3>
                    <p className="text-xs font-mono text-cyan-300">{profile.tagline}</p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-300 font-medium">Tersedia untuk Pekerjaan</span>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {profile.bio}
              </p>

              {/* Info Pills: Lokasi & Waktu Lokal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Domisili</p>
                    <p className="text-xs font-medium text-white">{profile.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Waktu Lokal (WITA / UTC+8)</p>
                    <p className="text-xs font-mono font-semibold text-cyan-300">
                      {timeString || 'WITA'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-5 mt-5 border-t border-white/5">
              <button
                id="bento-hire-btn"
                onClick={() => {
                  soundFx.playClick();
                  onOpenHireModal();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
              >
                <span>Hubungi Saya</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="bento-projects-btn"
                onClick={() => {
                  soundFx.playClick();
                  onSelectSection('projects');
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition-all flex items-center gap-1.5"
              >
                <span>Lihat Portofolio Proyek</span>
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </SpotlightCard>

          {/* Card 2: Metrik & Statistik Kunci (lg: col-span-5) */}
          <SpotlightCard className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between" spotlightColor="rgba(14, 165, 233, 0.12)">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono font-semibold uppercase text-slate-300 tracking-wider">
                  Statistik & Kredensial
                </span>
                <GraduationCap className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {profile.stats.yearsExperience}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Pengalaman Kerja</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-2xl sm:text-3xl font-bold text-cyan-300">
                    {profile.stats.completedProjects}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Proyek Selesai</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-300">
                    {profile.stats.satisfiedClients}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Kepuasan Klien</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-xl sm:text-2xl font-bold text-sky-300">
                    {profile.stats.githubContributions}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Sertifikasi Profesi</p>
                </div>
              </div>
            </div>

            {/* Keahlian Populer Chips */}
            <div className="mt-5 pt-4 border-t border-white/5">
              <p className="text-[11px] font-mono text-slate-400 mb-2">Teknologi Utama:</p>
              <div className="flex flex-wrap gap-1.5">
                {popularSkills.map((sk) => (
                  <span
                    key={sk.id}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                  >
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3: Pilar Keahlian Teknis (lg: col-span-6) */}
          <SpotlightCard className="lg:col-span-6 p-6 flex flex-col justify-between" spotlightColor="rgba(6, 182, 212, 0.1)">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold mb-3">
                <Code2 className="w-4 h-4" />
                <span>KOMPETENSI UTAMA</span>
              </div>
              <h4 className="text-base font-bold text-white mb-3">
                Software Engineering & Backend Architecture
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>Backend & API:</strong> C# .NET 8 Web API, Golang, NestJS, Laravel, RESTful Architecture.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>Frontend:</strong> React 19, TypeScript, Vite, Tailwind CSS, State Management.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span><strong>Basis Data:</strong> PostgreSQL, Microsoft SQL Server, MySQL, Supabase.</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Sistem Terstruktur & Bersih</span>
              <span className="text-cyan-400">Type-Safe & Scalable</span>
            </div>
          </SpotlightCard>

          {/* Card 4: Infrastruktur & Telekomunikasi (lg: col-span-6) */}
          <SpotlightCard className="lg:col-span-6 p-6 flex flex-col justify-between" spotlightColor="rgba(14, 165, 233, 0.1)">
            <div>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-semibold mb-3">
                <Cpu className="w-4 h-4" />
                <span>INFRASTRUKTUR & TELEKOMUNIKASI</span>
              </div>
              <h4 className="text-base font-bold text-white mb-3">
                Hardware, Surveillance & Radio Network
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                  <span><strong>CCTV Surveillance:</strong> Instalasi, konfigurasi IP camera, monitoring & pemeliharaan berkala.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                  <span><strong>Radio Komunikasi:</strong> Perangkat radio VHF/UHF Motorola, Hytera, antena repeater, & RF testing.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                  <span><strong>Jaringan Lapangan:</strong> Troubleshooting kabel fiber optik, UTP, dan kelancaran data operasional.</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>PT. Multi Kontrol Nusantara</span>
              <span className="text-emerald-400">Keandalan 99.9%</span>
            </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
}
