import { motion } from 'motion/react';
import { ArrowUp, Terminal, Code2 } from 'lucide-react';
import { ProfileSettings } from '../types';
import { soundFx } from '../lib/audio';

interface FooterProps {
  profile: ProfileSettings;
}

export function Footer({ profile }: FooterProps) {
  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-white/10 bg-[#070a0e] py-8 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-400">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight">JUPRI<span className="text-cyan-400">_OPS.</span></span>
        </div>

        {/* Center Copyright */}
        <div className="text-center text-[11px] text-slate-400 tracking-wider">
          © 2026 - DESIGNED &amp; BUILT WITH PASSION
        </div>

        {/* Back to top button */}
        <button
          id="footer-scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-center group cursor-pointer shadow-md shadow-black/40"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>

      </div>
    </motion.footer>
  );
}
