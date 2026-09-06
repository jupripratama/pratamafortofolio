import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  Briefcase, 
  Mail, 
  Database, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Code2,
  Tag,
  Terminal,
  MessageSquareQuote
} from 'lucide-react';
import { ProfileSettings } from '../types';
import { soundFx } from '../lib/audio';

interface NavbarProps {
  profile: ProfileSettings;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenHireModal: () => void;
  onReboot?: () => void;
  isReady?: boolean;
}

export function Navbar({
  profile,
  activeSection,
  onSelectSection,
  onOpenAdmin,
  onOpenHireModal,
  onReboot,
  isReady = true,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const navItems = [
    { id: 'about', label: 'Tentang' },
    { id: 'skills', label: 'Teknologi' },
    { id: 'experience', label: 'Pengalaman' },
    { id: 'projects', label: 'Proyek' },
    { id: 'pricing', label: 'Jasa' },
    { id: 'contact', label: 'Kontak' },
  ];

  const handleNavClick = (id: string) => {
    soundFx.playClick();
    onSelectSection(id);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    soundFx.setMuted(next);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-10 lg:px-14 xl:px-20 py-3.5 transition-all duration-300"
    >
      <div className="w-full flex items-center justify-between">
        
        {/* JEP identity and location. */}
        <button
          id="navbar-brand-btn"
          onClick={() => {
            soundFx.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="JEP. — Kembali ke awal"
          className="flex shrink-0 items-center gap-3 rounded-lg bg-[#090d16]/90 px-2 py-2 text-left backdrop-blur-xl transition-colors hover:bg-cyan-500/10 focus-visible:outline-2 focus-visible:outline-cyan-400"
        >
          <span className="text-xl font-black tracking-tighter text-slate-100">JEP.</span>
          <span className="hidden sm:flex flex-col text-[10px] leading-4 tracking-[0.16em] text-cyan-300">
            <span className="font-bold">BASED IN</span>
            <span>SANGATTA, EAST KALIMANTAN</span>
          </span>
        </button>

        {/* Desktop Center Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#090d16]/85 backdrop-blur-2xl border border-white/10 shadow-xl shadow-black/40">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => soundFx.playHover()}
                className={`relative px-3.5 py-1 text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'text-cyan-300 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavDockPill"
                    className="absolute inset-0 rounded-full bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Reboot Linux Terminal Button */}
          {onReboot && (
            <button
              id="nav-reboot-terminal-btn"
              onClick={() => {
                soundFx.playClick();
                onReboot();
              }}
              aria-label="Reboot Linux Terminal"
              className="p-1.5 px-2 rounded-xl bg-[#090d16]/90 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-all shadow-md shadow-black/30 font-mono text-[11px]"
              title="Jalankan ulang Linux Boot Sequence"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline text-[10px]">BOOT</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle-btn"
            onClick={toggleSound}
            aria-label={isAudioMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
            className="w-8 h-8 rounded-xl bg-[#090d16]/90 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md shadow-black/30"
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>

          {/* Admin CMS Studio Button */}
          <button
            id="open-admin-studio-btn"
            onClick={() => {
              soundFx.playClick();
              onOpenAdmin();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-[#090d16]/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1.5 transition-all shadow-md shadow-black/30"
            title="Buka Supabase Admin CMS Studio"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">CMS</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Menu"
            className="xl:hidden w-8 h-8 rounded-xl bg-[#090d16]/90 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:hidden mt-3 p-4 rounded-2xl bg-[#090d16]/98 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl space-y-1.5"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-4 py-2 rounded-xl text-xs font-mono text-left transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </motion.div>
      )}
    </motion.header>
  );
}
