import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  X,
  Maximize2
} from 'lucide-react';
import { Certificate } from '../types';
import { SpotlightCard } from './SpotlightCard';
import { soundFx } from '../lib/audio';

interface CertificatesSectionProps {
  certificates: Certificate[];
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const [zoomedCert, setZoomedCert] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>LICENSES & CERTIFICATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">Credentials</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Industry certifications in Cloud Architecture, Frontend Performance, and Backend Distributed Systems.
          </p>
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <SpotlightCard
              key={cert.id}
              className="p-6 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              spotlightColor="rgba(6, 182, 212, 0.14)"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    {cert.date}
                  </span>
                </div>

                {/* Credential ID */}
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono text-slate-300">ID: {cert.credentialId}</span>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setZoomedCert(cert);
                    }}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Image</span>
                  </button>
                </div>
              </div>

              {/* Skills and verify link */}
              <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map((sk, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {cert.verifyUrl && (
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundFx.playClick()}
                    className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1 hover:underline"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </SpotlightCard>
          ))}
        </div>

      </div>

      {/* Image Preview Zoom Modal */}
      <AnimatePresence>
        {zoomedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedCert(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#0c101c] p-4 z-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <h4 className="text-sm font-bold text-white font-mono">{zoomedCert.title}</h4>
                <button
                  onClick={() => setZoomedCert(null)}
                  className="p-1 rounded-lg bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <img
                src={zoomedCert.image}
                alt={zoomedCert.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[70vh] object-contain rounded-2xl border border-white/10"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
