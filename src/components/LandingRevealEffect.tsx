import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../lib/audio';

interface LandingRevealEffectProps {
  onFinish?: () => void;
}

export function LandingRevealEffect({ onFinish }: LandingRevealEffectProps) {
  const [showHudNotice, setShowHudNotice] = useState(true);

  useEffect(() => {
    // Play high-tech presence audio
    soundFx.playSuccess();

    const timer = setTimeout(() => {
      setShowHudNotice(false);
      onFinish?.();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      
      {/* 1. Dramatic Laser Sweep Line (Top to Bottom) */}
      <motion.div
        initial={{ top: '-10%', opacity: 1 }}
        animate={{ top: '110%', opacity: [0, 1, 1, 0.4, 0] }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_24px_rgba(6,182,212,1),0_0_50px_rgba(52,211,153,0.8)] z-50"
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-96 h-12 bg-cyan-400/20 blur-xl rounded-full" />
      </motion.div>

      {/* 2. Cyber Aperture Shockwave Pulse */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0.9 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 1.3, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.25)_0%,rgba(16,185,129,0.15)_40%,transparent_70%)] blur-2xl z-40"
      />

      {/* 3. High-Tech Grid Flash Overlay */}
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute inset-0 bg-cyan-500/10 backdrop-contrast-125 z-30"
      />

      {/* 4. Top Presentation HUD Status Badge */}
      <AnimatePresence>
        {showHudNotice && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.2 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="px-4 py-2 rounded-full bg-[#080d18]/90 backdrop-blur-xl border border-emerald-400/40 shadow-[0_0_25px_rgba(52,211,153,0.3)] flex items-center gap-2.5 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-white font-bold tracking-wider">SYSTEM ONLINE</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-300">JUPRI_OPS V2.4 LOADED</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
