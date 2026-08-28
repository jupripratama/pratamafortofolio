import { useState, useRef, useEffect, ReactNode, KeyboardEvent } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft, Sparkles, Check, Copy } from 'lucide-react';
import { soundFx } from '../lib/audio';
import confetti from 'canvas-confetti';
import { ProfileSettings } from '../types';

interface TerminalWidgetProps {
  profile: ProfileSettings;
  onOpenHireModal: () => void;
  onSelectTab?: (sectionId: string) => void;
}

interface CommandHistoryItem {
  command: string;
  output: string | ReactNode;
}

export function TerminalWidget({ profile, onOpenHireModal, onSelectTab }: TerminalWidgetProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'neofetch',
      output: (
        <div className="text-xs font-mono text-cyan-300 leading-relaxed py-1">
          <p className="text-cyan-400 font-bold">rizal@devcraft-os ~ v4.2.0</p>
          <p className="text-slate-400">----------------------------------------</p>
          <p><span className="text-purple-400">OS:</span> DevCraft Arch-Linux x86_64</p>
          <p><span className="text-purple-400">Host:</span> High-Performance Web Engine</p>
          <p><span className="text-purple-400">Kernel:</span> 6.12.8-creative-motion</p>
          <p><span className="text-purple-400">Uptime:</span> 5+ years coding streak</p>
          <p><span className="text-purple-400">Shell:</span> zsh 5.9 (React 19 + TypeScript)</p>
          <p><span className="text-purple-400">Status:</span> <span className="text-emerald-400">🟢 Available for Contracts</span></p>
          <p className="text-slate-500 mt-1">Type <span className="text-amber-300 font-semibold">'help'</span> to see all available commands.</p>
        </div>
      )
    }
  ]);

  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistoryList, setCommandHistoryList] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdText: string) => {
    const rawCmd = cmdText.trim();
    const cmd = rawCmd.toLowerCase();
    soundFx.playKeyTick();

    if (!rawCmd) return;

    setCommandHistoryList(prev => [rawCmd, ...prev]);
    setHistoryIndex(-1);

    let outputNode: ReactNode = '';

    switch (cmd) {
      case 'help':
        outputNode = (
          <div className="text-xs font-mono space-y-1 text-slate-300 py-1">
            <p className="text-cyan-400 font-bold">⚡ Available Commands:</p>
            <p><span className="text-amber-300 font-semibold">whoami</span> - Display developer bio & role</p>
            <p><span className="text-amber-300 font-semibold">projects</span> - List flagship projects</p>
            <p><span className="text-amber-300 font-semibold">skills</span> - View primary technology matrix</p>
            <p><span className="text-amber-300 font-semibold">contact</span> - Show communication channels</p>
            <p><span className="text-amber-300 font-semibold">hire</span> - Open instant contract / inquiry form</p>
            <p><span className="text-amber-300 font-semibold">neofetch</span> - System specs & developer profile</p>
            <p><span className="text-amber-300 font-semibold">matrix</span> - Trigger cyberpunk particle rain</p>
            <p><span className="text-amber-300 font-semibold">clear</span> - Clear terminal screen</p>
          </div>
        );
        break;

      case 'whoami':
        outputNode = (
          <div className="text-xs font-mono text-slate-300 py-1">
            <p className="text-cyan-400 font-bold">{profile.name} ({profile.handle})</p>
            <p className="text-slate-300 mt-1">{profile.bio}</p>
            <p className="text-emerald-400 mt-1">📍 {profile.location} • {profile.timezone}</p>
          </div>
        );
        break;

      case 'projects':
        outputNode = (
          <div className="text-xs font-mono text-slate-300 py-1 space-y-1">
            <p className="text-cyan-400 font-bold">🚀 Featured Production Works:</p>
            <p>1. <span className="text-white font-semibold">Aetheria AI Studio</span> - Generative multi-modal workspace</p>
            <p>2. <span className="text-white font-semibold">ScriptMLBB Cloud</span> - High-speed gaming telemetry (150k+ req/day)</p>
            <p>3. <span className="text-white font-semibold">Nexium 3D Engine</span> - 60 FPS WebGL 3D commerce</p>
            <p>4. <span className="text-white font-semibold">VoltPulse Orchestrator</span> - High-throughput microservice queue</p>
            {onSelectTab && (
              <button 
                onClick={() => onSelectTab('projects')}
                className="text-cyan-400 underline hover:text-cyan-300 mt-1 block"
              >
                → Jump to interactive Project Grid
              </button>
            )}
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="text-xs font-mono text-slate-300 py-1">
            <p className="text-cyan-400 font-bold">⚡ Core Tech Stack:</p>
            <p className="text-slate-300">Frontend: React 19, Next.js, TypeScript, TailwindCSS, Motion, Three.js</p>
            <p className="text-slate-300">Backend: Node.js, Go (Golang), Python / FastAPI, Express</p>
            <p className="text-slate-300">Database: Supabase, PostgreSQL, Redis, pgvector</p>
            <p className="text-slate-300">Cloud/DevOps: Docker, Cloudflare Workers, AWS, GCP, CI/CD</p>
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="text-xs font-mono text-slate-300 py-1 space-y-0.5">
            <p className="text-cyan-400 font-bold">📫 Get in Touch:</p>
            <p>Email: <span className="text-white">{profile.email}</span></p>
            <p>Telegram: <span className="text-white">{profile.telegramUrl}</span></p>
            <p>WhatsApp: <span className="text-white">{profile.whatsappUrl}</span></p>
            <p>Discord: <span className="text-white">{profile.discordTag}</span></p>
          </div>
        );
        break;

      case 'hire':
      case 'sudo hire':
        soundFx.playSuccess();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onOpenHireModal();
        outputNode = (
          <div className="text-xs font-mono text-emerald-400 py-1">
            🎉 <span className="font-bold">Access Granted:</span> Opening Priority Contact & Hire Drawer...
          </div>
        );
        break;

      case 'matrix':
        soundFx.playSuccess();
        confetti({
          particleCount: 100,
          spread: 100,
          colors: ['#06b6d4', '#10b981', '#a855f7'],
          origin: { y: 0.5 }
        });
        outputNode = (
          <div className="text-xs font-mono text-emerald-400 py-1 animate-pulse">
            01000100 01000101 01010110 01000011 01010010 01000001 01000110 01010100 [CYBER_BURST_TRIGGERED]
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'neofetch':
        outputNode = (
          <div className="text-xs font-mono text-cyan-300 leading-relaxed py-1">
            <p className="text-cyan-400 font-bold">rizal@devcraft-os ~ v4.2.0</p>
            <p className="text-slate-400">----------------------------------------</p>
            <p><span className="text-purple-400">OS:</span> DevCraft Arch-Linux x86_64</p>
            <p><span className="text-purple-400">Host:</span> High-Performance Web Engine</p>
            <p><span className="text-purple-400">Kernel:</span> 6.12.8-creative-motion</p>
            <p><span className="text-purple-400">Uptime:</span> 5+ years coding streak</p>
            <p><span className="text-purple-400">Shell:</span> zsh 5.9 (React 19 + TypeScript)</p>
          </div>
        );
        break;

      default:
        outputNode = (
          <div className="text-xs font-mono text-rose-400 py-1">
            zsh: command not found: {rawCmd}. Type <span className="text-amber-300 font-semibold">'help'</span> for list of valid commands.
          </div>
        );
        break;
    }

    setHistory(prev => [...prev, { command: rawCmd, output: outputNode }]);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistoryList.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, commandHistoryList.length - 1);
        setHistoryIndex(nextIdx);
        setInput(commandHistoryList[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistoryList[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#080b12]/95 backdrop-blur-xl overflow-hidden font-mono shadow-2xl flex flex-col h-[380px]">
      {/* Terminal Titlebar */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:opacity-100 cursor-pointer" onClick={() => setHistory([])} title="Clear Screen" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs text-slate-400 font-medium ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>bash ~ zsh • interactive</span>
          </span>
        </div>

        {/* Quick Clickable Command Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {['help', 'projects', 'skills', 'hire', 'clear'].map((cmd) => (
            <button
              key={cmd}
              id={`cmd-preset-${cmd}`}
              onClick={() => handleCommand(cmd)}
              className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 transition-all"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Output Body */}
      <div 
        className="flex-1 p-4 overflow-y-auto space-y-3 select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-bold">❯</span>
              <span className="text-purple-300 font-semibold">devcraft</span>
              <span className="text-slate-500">git:(main)</span>
              <span className="text-white font-medium">{item.command}</span>
            </div>
            <div className="pl-4">{item.output}</div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Prompt */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-t border-white/5 flex items-center gap-2">
        <span className="text-cyan-400 font-bold text-sm">❯</span>
        <span className="text-purple-300 font-semibold text-xs hidden sm:inline">devcraft</span>
        <span className="text-slate-500 text-xs hidden sm:inline">git:(main)</span>
        <input
          ref={inputRef}
          id="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type 'help' or 'hire' and press Enter..."
          className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none font-mono"
        />
        <button
          id="terminal-submit-btn"
          onClick={() => handleCommand(input)}
          className="p-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 transition-all text-xs"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
