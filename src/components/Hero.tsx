import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ArrowRight, 
  Globe, 
  Code2, 
  Mail, 
  Linkedin,
  FileDown
} from 'lucide-react';
import { ProfileSettings } from '../types';
import { HangingTagCard } from './HangingTagCard';
import { soundFx } from '../lib/audio';

interface HeroProps {
  profile: ProfileSettings;
  onOpenHireModal: () => void;
  onSelectSection: (sectionId: string) => void;
  isReady?: boolean;
}

export function Hero({ profile, onOpenHireModal, onSelectSection, isReady = true }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  );
  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const roleText = 'Backend & Full-stack Developer';
  const [displayedText, setDisplayedText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = '01#%&@*?<>_{}/[]~+=^$!XYZK97';

  // Initial typewriter effect - runs only after landing page is ready
  useEffect(() => {
    if (!isReady) {
      setDisplayedText('');
      return;
    }
    if (reduceMotion) {
      setDisplayedText(roleText);
      return;
    }

    let index = 0;
    let interval: ReturnType<typeof setInterval>;
    setDisplayedText('');
    const delayTimer = setTimeout(() => {
      interval = setInterval(() => {
        if (index <= roleText.length) {
          setDisplayedText(roleText.substring(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 45);

    }, 450);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(interval);
    };
  }, [isReady, reduceMotion]);

  // Cyber scramble / decode effect on mouse hover
  const triggerScramble = () => {
    if (isScrambling || reduceMotion) return;
    setIsScrambling(true);
    soundFx.playKeyTick();

    let iteration = 0;
    const maxIterations = roleText.length;

    const scrambleInterval = setInterval(() => {
      soundFx.playKeyTick();
      setDisplayedText(() => {
        return roleText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return roleText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      if (iteration >= maxIterations) {
        clearInterval(scrambleInterval);
        setDisplayedText(roleText);
        setIsScrambling(false);
      }

      iteration += 1 / 2;
    }, 30);
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-0 lg:pb-16 overflow-hidden bg-transparent"
    >
      {/* Interaction spans the entire opening screen, including its gutters. */}
      {!isCompact && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <HangingTagCard profile={profile} isReady={isReady} />
        </div>
      )}

      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 relative z-20 pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center w-full">
          
          {/* ================= LEFT COLUMN: KEYNOTE PRESENTATION SLIDE-IN FROM RIGHT ================= */}
          <div className="lg:col-span-6 xl:col-span-6 text-left space-y-6 pointer-events-auto">
            
            {/* Status & Location Pill */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
              transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#090d16]/90 border border-cyan-500/30 text-xs font-mono select-none shadow-lg shadow-black/40"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-cyan-300 font-bold tracking-wider">AVAILABLE FOR PROJECTS</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">SANGATTA, WITA</span>
            </motion.div>

            {/* Brand Title: Jupri Eka Pratama with Gradient Accent */}
            <div className="space-y-2 select-none">
              <motion.h1
                initial={{ opacity: 0, x: 70 }}
                animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 70 }}
                transition={{ duration: 0.8, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white flex items-baseline gap-2 flex-wrap cursor-default"
              >
                <span>Jupri</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                  Eka Pratama
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, x: 70 }}
                animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 70 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={triggerScramble}
                className="inline-flex items-center gap-2 text-base sm:text-lg font-mono text-cyan-300 font-medium select-none min-h-[2.25rem] px-3 py-1 -ml-3 rounded-lg border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-200 cursor-pointer group"
                title="Hover to decode random cyber code"
              >
                <span className="text-cyan-400 font-bold group-hover:text-emerald-400 transition-colors">&gt;</span>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isScrambling ? 'from-emerald-300 via-cyan-200 to-sky-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]' : 'from-cyan-300 via-sky-200 to-emerald-300'} font-semibold tracking-wide transition-all`}>
                  {displayedText}
                </span>
                <span className={`inline-block w-2 h-4 ${isScrambling ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]' : 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]'} animate-pulse rounded-[1px] ml-0.5 transition-colors`} />
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: 60 }}
              animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
              transition={{ duration: 0.8, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed font-sans"
            >
              Mengembangkan aplikasi web dan mobile dengan pengalaman di bidang backend serta infrastruktur IT. Menghubungkan kebutuhan pengguna dengan solusi teknologi yang praktis.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
              transition={{ duration: 0.8, delay: 0.74, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <button
                id="hero-view-projects-btn"
                onClick={() => {
                  soundFx.playClick();
                  onSelectSection('projects');
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-mono font-bold text-xs sm:text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>LIHAT PROYEK</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-contact-btn"
                onClick={() => {
                  soundFx.playClick();
                  onSelectSection('contact');
                }}
                className="px-6 py-3.5 rounded-xl bg-[#0b101b] hover:bg-[#131c2e] text-slate-200 hover:text-white border border-cyan-500/30 hover:border-cyan-400 font-mono font-bold text-xs sm:text-sm tracking-wide transition-all active:scale-95 cursor-pointer shadow-lg shadow-black/40"
              >
                <span>KONTAK SAYA</span>
              </button>
            </motion.div>

            {/* Social & Download CV Row */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.86, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-2.5 pt-2"
            >
              <a
                href={profile.resumeUrl || '/assets/CV Jupri Eka Pratama.pdf'}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                className="p-2.5 rounded-xl bg-[#090d16] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-all text-xs"
                title="Website Portofolio"
              >
                <Globe className="w-4 h-4" />
              </a>

              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                className="p-2.5 rounded-xl bg-[#090d16] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-all text-xs"
                title="GitHub Repositories"
              >
                <Code2 className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${profile.email}`}
                onClick={() => soundFx.playClick()}
                className="p-2.5 rounded-xl bg-[#090d16] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-all text-xs"
                title="Kirim Email"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                className="p-2.5 rounded-xl bg-[#090d16] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-all text-xs"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {/* Download CV Button */}
              <a
                href="/assets/CV Jupri Eka Pratama.pdf"
                download="CV_Jupri_Eka_Pratama.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFx.playClick()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-emerald-500/10 hover:from-cyan-500/20 hover:to-emerald-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono font-semibold transition-all shadow-md shadow-black/30 hover:shadow-cyan-500/20 active:scale-95 cursor-pointer ml-1"
                title="Download CV Jupri Eka Pratama (PDF)"
              >
                <FileDown className="w-4 h-4 text-cyan-400" />
                <span>Download CV</span>
              </a>
            </motion.div>

          </div>

          {/* ================= RIGHT COLUMN: RESERVED SPACE FOR 3D LANYARD ================= */}
          {isCompact ? (
            <div className="relative h-[600px] sm:h-[680px] -mx-6 sm:-mx-10 overflow-hidden pointer-events-none" aria-label="Kartu identitas interaktif">
              <HangingTagCard profile={profile} isReady={isReady} />
            </div>
          ) : (
            <div className="lg:col-span-6 min-h-[520px] pointer-events-none" />
          )}

        </div>
      </div>
    </section>
  );
}
