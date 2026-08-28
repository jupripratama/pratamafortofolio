import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, ShieldCheck, Check, CornerDownLeft, Sparkles } from 'lucide-react';
import { soundFx } from '../lib/audio';

interface LinuxBootLoaderProps {
  onComplete: () => void;
}

interface BootLog {
  timestamp: string;
  type: 'ok' | 'info' | 'sys' | 'success';
  text: string;
  detail?: string;
}

export function LinuxBootLoader({ onComplete }: LinuxBootLoaderProps) {
  const [logs, setLogs] = useState<BootLog[]>([]);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const rawLogs: Array<{ text: string; type: 'ok' | 'info' | 'sys' | 'success'; detail?: string; delay: number }> = [
    { text: 'BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable', type: 'sys', delay: 100 },
    { text: 'Linux version 6.8.0-jupri-ops (root@sangatta-kpc-node) (x86_64-linux-gnu)', type: 'sys', delay: 220 },
    { text: 'Command line: BOOT_IMAGE=/vmlinuz-jupri-ops root=UUID=7f4a-9b1c ro quiet splash', type: 'sys', delay: 350 },
    { text: 'Initializing cgroup subsys cpuset, cpu, memory, io, pids', type: 'info', delay: 500 },
    { text: 'Mounting root filesystem ext4 (rw,relatime,data=ordered)...', type: 'ok', detail: '[  OK  ]', delay: 650 },
    { text: 'Starting systemd-udevd [Kernel Device Manager]...', type: 'ok', detail: '[  OK  ]', delay: 800 },
    { text: 'Reached target System Initialization.', type: 'ok', detail: '[  OK  ]', delay: 950 },
    { text: 'Detecting network hardware: eth0 KPC_MINING_LAN [10.24.8.101]', type: 'info', delay: 1100 },
    { text: 'Starting PT. Multi Kontrol Nusantara Telemetry Daemon...', type: 'ok', detail: '[  OK  ]', delay: 1250 },
    { text: 'Connecting Supabase DataStore & Security Engine...', type: 'ok', detail: '[  OK  ]', delay: 1400 },
    { text: 'Loading .NET 8 / Golang Microservices & POS Interface...', type: 'ok', detail: '[  OK  ]', delay: 1550 },
    { text: 'Synchronizing CCTV & Radio RF Communication Matrix...', type: 'ok', detail: '[  OK  ]', delay: 1700 },
    { text: 'Starting Graphic Environment: JUPRI_OPS UI v2.4 (Tailwind + React)...', type: 'ok', detail: '[  OK  ]', delay: 1850 },
    { text: 'Authentication complete. Welcome operator: Jupri Eka Pratama', type: 'success', detail: '[ READY ]', delay: 2000 },
  ];

  useEffect(() => {
    // Play subtle startup audio
    soundFx.playHover();

    let currentIndex = 0;
    const startTime = Date.now();
    const totalDuration = 2300;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(pct);
    }, 40);

    const logTimers = rawLogs.map((item, idx) => {
      return setTimeout(() => {
        const timeStr = ((item.delay) / 1000).toFixed(6);
        setLogs((prev) => [
          ...prev,
          {
            timestamp: `[   ${timeStr} ]`,
            type: item.type,
            text: item.text,
            detail: item.detail,
          },
        ]);
        if (idx % 3 === 0) {
          soundFx.playKeyTick();
        }
      }, item.delay);
    });

    const finishTimer = setTimeout(() => {
      setIsDone(true);
      soundFx.playSuccess();
      setTimeout(() => {
        onComplete();
      }, 500);
    }, totalDuration + 200);

    return () => {
      clearInterval(progressInterval);
      logTimers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, []);

  const handleSkip = () => {
    soundFx.playClick();
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-[#04060a] text-slate-200 font-mono flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden"
    >
      {/* Background scanline & CRT effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.3))] bg-[size:100%_4px] pointer-events-none opacity-40 z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Bar / Kernel Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>GNU/LINUX BOOT SEQUENCE :: JUPRI_OPS v2.4</span>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="px-3 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>LEWATI</span>
          <span className="text-[10px] bg-white/10 px-1 py-0.2 rounded font-sans">ESC</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Main Terminal Output Area */}
      <div className="relative z-10 flex-1 my-4 overflow-y-auto space-y-1.5 text-[11px] sm:text-xs leading-relaxed max-w-5xl mx-auto w-full pt-2">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1 }}
            className="flex items-start gap-2.5"
          >
            <span className="text-slate-500 shrink-0 select-none font-mono">
              {log.timestamp}
            </span>

            {log.detail && (
              <span
                className={`font-bold shrink-0 px-1 rounded text-[10px] ${
                  log.type === 'success'
                    ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/40'
                    : 'text-emerald-400 bg-emerald-500/10'
                }`}
              >
                {log.detail}
              </span>
            )}

            <span
              className={`${
                log.type === 'sys'
                  ? 'text-slate-400'
                  : log.type === 'info'
                  ? 'text-cyan-300'
                  : log.type === 'success'
                  ? 'text-emerald-300 font-bold'
                  : 'text-slate-200'
              }`}
            >
              {log.text}
            </span>
          </motion.div>
        ))}

        {/* Blinking Cursor */}
        {!isDone && (
          <div className="flex items-center gap-2 pt-1 text-cyan-400">
            <span className="text-slate-500 select-none">[  BOOT  ]</span>
            <span className="animate-pulse font-bold">_</span>
          </div>
        )}
      </div>

      {/* Bottom Progress & Hardware Info */}
      <div className="relative z-10 border-t border-white/10 pt-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] text-slate-300">
              TARGET: <span className="text-cyan-400">graphic-session.target</span>
            </span>
          </div>
          <div className="font-mono text-xs font-bold text-cyan-300">
            {progress}% COMPLETED
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
