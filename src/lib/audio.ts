// Web Audio API Synthesizer for UI sound effects and generative ambient Lo-Fi audio

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private unlocked = false;
  private resuming: Promise<void> | null = null;
  private ambientTimer: ReturnType<typeof setTimeout> | undefined;

  public attach() {
    this.initCtx();
    if (this.ctx && this.ctx.state === 'running') {
      this.unlocked = true;
    }

    const unlock = () => {
      this.unlocked = true;
      this.initCtx();
      if (this.ctx && this.ctx.state === 'suspended') {
        if (!this.resuming) {
          this.resuming = this.ctx.resume().finally(() => { this.resuming = null; });
        }
      }
    };

    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('pointerup', unlock, true);
    window.addEventListener('keydown', unlock, true);
    window.addEventListener('touchstart', unlock, true);
    window.addEventListener('click', unlock, true);

    return () => {
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('pointerup', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('click', unlock, true);
      this.stopAmbient();
    };
  }

  public unlock() {
    this.unlocked = true;
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      if (!this.resuming) {
        this.resuming = this.ctx.resume().finally(() => { this.resuming = null; });
      }
    }
  }

  private async ready(): Promise<boolean> {
    if (this.isMuted || (typeof document !== 'undefined' && document.hidden)) return false;

    this.initCtx();
    if (!this.ctx) return false;

    // If already running (browser permitted autoplay), mark unlocked and proceed immediately
    if (this.ctx.state === 'running') {
      this.unlocked = true;
      return true;
    }

    // If unlocked by user gesture and suspended, resume
    if (this.unlocked) {
      const requestedAt = performance.now();
      try {
        if (!this.resuming) {
          this.resuming = this.ctx.resume().finally(() => { this.resuming = null; });
        }
        await this.resuming;
        const currentState: string = this.ctx.state;
        return currentState === 'running' && !this.isMuted && (!document || !document.hidden)
          && performance.now() - requestedAt < 400;
      } catch {
        return false;
      }
    }

    return false;
  }

  private initCtx() {
    if ((!this.ctx || this.ctx.state === 'closed') && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass({ latencyHint: 'interactive' });
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isAmbientPlaying) {
      this.stopAmbient();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Futuristic subtle hover blip
  public async playHover() {
    if (this.isMuted) return;
    try {
      if (!(await this.ready()) || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Cyber Click
  public async playClick() {
    if (this.isMuted) return;
    try {
      if (!(await this.ready()) || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 3D Card Flip Swoosh & Snap
  public async playCardFlip() {
    if (this.isMuted) return;
    try {
      if (!(await this.ready()) || !this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // silent catch
    }
  }

  // Realistic Lanyard / Ball-chain Elastic Snap & Bounce Clink
  public async playSnap(intensity: number = 1.0) {
    if (this.isMuted) return;
    try {
      if (!(await this.ready()) || !this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Crisp metallic clink pitch
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.045);

      const vol = Math.min(0.05, 0.025 * intensity);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // silent catch
    }
  }

  // Success Chime
  public async playSuccess() {
    if (this.isMuted) return;
    try {
      if (!(await this.ready()) || !this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.04, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } catch {
      // silent catch
    }
  }

  // Terminal keystroke tick
  public async playKeyTick() {
    if (this.isMuted) return;
    try {
      if (!(await this.ready()) || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // silent catch
    }
  }

  // Generative Lo-Fi Ambient Synth chord player
  public async toggleAmbientMusic(): Promise<boolean> {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      await this.startAmbient();
      return this.isAmbientPlaying;
    }
  }

  public isMusicPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  public async startAmbient() {
    try {
      if (!(await this.ready()) || !this.ctx) return;
      this.stopAmbient();

      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ];

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);
      this.ambientGain = masterGain;

      let chordIndex = 0;
      const playNextChord = () => {
        if (!this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;

        const currentNotes = chords[chordIndex % chords.length];
        chordIndex++;

        // Clean up previous
        this.ambientOscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch {}
        });
        this.ambientOscillators = [];

        currentNotes.forEach(freq => {
          if (!this.ctx || !this.ambientGain) return;
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * 0.5, this.ctx.currentTime); // Deep octave

          const now = this.ctx.currentTime;
          noteGain.gain.setValueAtTime(0.001, now);
          noteGain.gain.linearRampToValueAtTime(0.04, now + 1.2);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

          osc.connect(noteGain);
          noteGain.connect(this.ambientGain);

          osc.start(now);
          osc.stop(now + 4.0);
          this.ambientOscillators.push(osc);
        });

        if (this.isAmbientPlaying) {
          this.ambientTimer = setTimeout(playNextChord, 3800);
        }
      };

      this.isAmbientPlaying = true;
      playNextChord();
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  public stopAmbient() {
    clearTimeout(this.ambientTimer);
    this.isAmbientPlaying = false;
    this.ambientOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    this.ambientOscillators = [];
    if (this.ambientGain) {
      try { this.ambientGain.disconnect(); } catch {}
      this.ambientGain = null;
    }
  }
}

export const soundFx = new SoundEngine();
