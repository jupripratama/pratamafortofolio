import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Send, 
  Phone, 
  Globe, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Copy,
  Check,
  MapPin,
  Clock,
  Briefcase,
  Terminal,
  Layers,
  Code2
} from 'lucide-react';
import { ProfileSettings } from '../types';
import { soundFx } from '../lib/audio';

interface ContactSectionProps {
  profile: ProfileSettings;
}

export function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Full-Stack Project',
    message: ''
  });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const subjectOptions = [
    { id: 'Full-Stack Project', label: 'Full-Stack Web', icon: Code2 },
    { id: 'Backend API', label: 'Backend & API (.NET/Go)', icon: Terminal },
    { id: 'IoT & Telemetry', label: 'IoT & Telemetri Tambang', icon: Layers },
    { id: 'Consultation', label: 'Konsultasi / Lainnya', icon: Briefcase },
  ];

  const handleCopyEmail = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(profile.email || 'jupriekapratama@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    soundFx.playClick();
    setLoading(true);

    setTimeout(() => {
      soundFx.playSuccess();
      setLoading(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: 'Full-Stack Project', message: '' });
      setTimeout(() => setIsSubmitted(false), 8000);
    }, 900);
  };

  const waNumber = '6281258661601';
  const defaultWaMessage = encodeURIComponent(`Halo Mas Jupri, saya tertarik untuk mendiskusikan peluang proyek bersama Anda.`);
  const waUrl = `https://wa.me/${waNumber}?text=${defaultWaMessage}`;

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold">GET IN TOUCH</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">HUBUNGI SAYA</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-mono">
            Mari <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">Terhubung</span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Terbuka untuk kolaborasi proyek baru, pengembangan sistem internal perusahaan, atau peluang karir. Kirimkan pesan atau hubungi langsung melalui kanal favorit Anda.
          </p>
        </motion.div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ================= LEFT COLUMN: CONTACT CHANNELS & INFO ================= */}
          <motion.div 
            initial={{ opacity: 0, x: -35, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6"
          >
            
            {/* Direct Connect Box */}
            <div className="rounded-3xl bg-[#090d16]/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 p-6 sm:p-8 shadow-xl shadow-black/40 transition-all text-left">
              
              <div className="flex items-center justify-between gap-2 mb-6">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                    SALURAN KOMUNIKASI
                  </span>
                  <h3 className="text-2xl font-bold text-white font-mono mt-1">
                    Kontak Langsung
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>

              {/* Channels List */}
              <div className="space-y-3">
                
                {/* Email with Copy Action */}
                <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-cyan-500/[0.07] border border-white/10 hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">EMAIL RESMI</span>
                        <a 
                          href={`mailto:${profile.email}`}
                          className="text-xs sm:text-sm font-mono text-white hover:text-cyan-300 font-semibold truncate block transition-colors"
                        >
                          {profile.email}
                        </a>
                      </div>
                    </div>

                    <button
                      id="copy-email-btn"
                      onClick={handleCopyEmail}
                      className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all shrink-0"
                      title="Salin alamat email"
                    >
                      {copiedEmail ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {copiedEmail && (
                    <span className="text-[10px] font-mono text-emerald-400 mt-2 block animate-fade-in font-bold">
                      ✓ Email berhasil disalin ke clipboard!
                    </span>
                  )}
                </div>

                {/* WhatsApp Direct */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="p-4 rounded-2xl bg-white/[0.03] hover:bg-emerald-500/[0.08] border border-white/10 hover:border-emerald-500/30 flex items-center justify-between text-slate-300 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">WHATSAPP CHAT</span>
                      <span className="text-xs sm:text-sm font-mono text-white group-hover:text-emerald-300 font-semibold block">
                        +62 812-5866-1601
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>

                {/* Telegram Direct */}
                <a
                  href={profile.telegramUrl || 'https://t.me/jupriekapratama'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="p-4 rounded-2xl bg-white/[0.03] hover:bg-sky-500/[0.08] border border-white/10 hover:border-sky-500/30 flex items-center justify-between text-slate-300 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">TELEGRAM</span>
                      <span className="text-xs sm:text-sm font-mono text-white group-hover:text-sky-300 font-semibold block">
                        t.me/jupriekapratama
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>

              </div>

              {/* Location & Timezone */}
              <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-3 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Kutai Timur & Balikpapan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WITA (UTC+8)</span>
                </div>
              </div>

            </div>

            {/* Live Availability Status Card */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/30 p-4 flex items-center gap-3.5 text-left">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div className="text-xs font-mono">
                <span className="font-bold text-white block">Status: Siap Menerima Proyek Baru</span>
                <span className="text-slate-400 text-[11px]">Respon pesan rata-rata dalam waktu &lt; 24 jam.</span>
              </div>
            </div>

          </motion.div>

          {/* ================= RIGHT COLUMN: INTERACTIVE MESSAGE FORM ================= */}
          <motion.div 
            initial={{ opacity: 0, x: 35, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-3xl bg-[#090d16]/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 p-6 sm:p-8 flex flex-col justify-between text-left shadow-xl shadow-black/40"
          >
            <div>
              
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold uppercase tracking-wider text-white">FORMULIR PESAN & INQUIRY</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  FAST RESPONSE
                </span>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-14 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-mono">Pesan Anda Berhasil Terkirim!</h4>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Terima kasih telah menghubungi. Notifikasi telah diterima dan saya akan segera merespons ke email Anda dalam waktu maksimal 24 jam.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white font-bold transition-all"
                  >
                    Kirim Pesan Lain
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Topic / Subject Chips */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 uppercase mb-2.5 font-semibold">
                      TOPIK / KATEGORI PROYEK
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {subjectOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = formData.subject === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              soundFx.playClick();
                              setFormData({ ...formData, subject: opt.id });
                            }}
                            className={`p-2.5 rounded-xl text-[11px] font-mono flex flex-col items-center justify-center gap-1.5 border transition-all text-center ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                            <span className="truncate w-full">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sender Name & Email Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1.5 font-semibold">
                        NAMA LENGKAP <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 font-mono transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1.5 font-semibold">
                        ALAMAT EMAIL <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        id="contact-email-input"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@perusahaan.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 font-mono transition-all"
                      />
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-mono text-slate-300 uppercase font-semibold">
                        DETAIL PESAN ATAU KEBUTUHAN <span className="text-cyan-400">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">
                        {formData.message.length} karakter
                      </span>
                    </div>
                    <textarea
                      id="contact-message-input"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ceritakan gambaran proyek, target waktu, atau hal yang ingin Anda diskusikan..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 font-mono transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:via-sky-300 hover:to-emerald-300 text-black font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        MEMPROSES & MENGIRIM...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>KIRIM PESAN SEKARANG</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
