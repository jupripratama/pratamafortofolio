import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, Radio, Sparkles } from 'lucide-react';
import { soundFx } from '../lib/audio';

const PLAYLIST = [
  { id: '1', title: 'Midnight Code Lofi', artist: 'Rizal × Chill Synth', vibe: 'Deep Focus' },
  { id: '2', title: 'Cyberpunk Rain in Jakarta', artist: 'DevCraft FM', vibe: 'Atmospheric' },
  { id: '3', title: 'Synthesized Serenity', artist: 'Web Audio Ambient', vibe: 'Chillout' },
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  const handleTogglePlay = () => {
    soundFx.playClick();
    const playing = soundFx.toggleAmbientMusic();
    setIsPlaying(playing);
  };

  const handleNextTrack = () => {
    soundFx.playClick();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    if (!isPlaying) {
      const playing = soundFx.toggleAmbientMusic();
      setIsPlaying(playing);
    }
  };

  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
  };

  return (
    <div className="relative group">
      <div className="relative rounded-2xl border border-white/10 bg-[#0d121e]/90 backdrop-blur-xl p-3.5 flex items-center justify-between gap-3 shadow-lg shadow-black/40">
        {/* Left Track Info with Spinning Vinyl */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-md ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            >
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-cyan-400">
                <Disc3 className="w-5 h-5" />
              </div>
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Spotify Ambient
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                {currentTrack.vibe}
              </span>
            </div>
            <p className="text-xs font-semibold text-white truncate max-w-[140px] sm:max-w-[180px]">
              {currentTrack.title}
            </p>
            <p className="text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-[180px]">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Dynamic Equalizer Spectrum Bars */}
        <div className="hidden md:flex items-end gap-1 h-5 px-2">
          {[40, 80, 50, 95, 60, 100, 70, 45].map((height, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-cyan-500 to-purple-400 rounded-full"
              animate={{
                height: isPlaying ? [`${height * 0.2}%`, `${height}%`, `${height * 0.4}%`] : '20%',
              }}
              transition={{
                duration: 0.8 + (i % 3) * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            id="play-music-btn"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pause Ambient Beats' : 'Play Ambient Beats'}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            id="next-music-track-btn"
            onClick={handleNextTrack}
            aria-label="Next Lofi Track"
            title="Next Track"
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/5"
          >
            <Radio className="w-3.5 h-3.5" />
          </button>

          <button
            id="mute-sound-btn"
            onClick={handleMuteToggle}
            aria-label="Toggle UI Audio Mute"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/5"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>
      </div>
    </div>
  );
}
