import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  Sprout, 
  Rocket, 
  Trophy, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { soundFx } from '../lib/audio';

interface PricingSectionProps {
  onOpenHireModal: (planName?: string) => void;
}

export function PricingSection({ onOpenHireModal }: PricingSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional' | 'enterprise'>('professional');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      icon: Sprout,
      price: '500K',
      priceUnit: '/ project',
      description: 'Cocok untuk bisnis atau personal yang baru mulai online',
      isPopular: false,
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      btnColor: 'bg-white/10 hover:bg-cyan-500/20 text-white hover:text-cyan-300 border border-white/15 hover:border-cyan-500/40',
      features: [
        'Landing page 1 halaman modern',
        'Responsive design (Mobile & Desktop)',
        'Contact form & link WhatsApp aktif',
        'Google Maps & Telemetri dasar',
        'Revisi 2x',
        'Delivery cepat 3-5 hari',
        'Source code & aset lengkap'
      ],
      notIncluded: [
        'CMS / Admin panel kustom',
        'Domain & Hosting (opsional add-on)'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: Rocket,
      price: '1.5Jt',
      priceUnit: '/ project',
      description: 'Ideal untuk bisnis yang ingin tampil profesional dengan sistem dinamis',
      isPopular: true,
      popularTag: '★ PALING POPULER',
      badgeColor: 'border-cyan-400/50 text-cyan-300 bg-cyan-500/15',
      btnColor: 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)]',
      features: [
        'Website multi-halaman (hingga 5 halaman)',
        'Custom UI/UX design premium & modern',
        'CMS / Admin panel data terintegrasi',
        'SEO On-Page dasar & optimasi kecepatan',
        'WhatsApp click-to-chat & email inquiry',
        'Revisi 5x',
        'Delivery 7-14 hari',
        'Garansi & Support 2 minggu'
      ],
      notIncluded: []
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Trophy,
      price: '3.5Jt+',
      priceUnit: '/ project',
      description: 'Solusi penuh untuk bisnis skala besar, sistem internal & backend khusus',
      isPopular: false,
      badgeColor: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
      btnColor: 'bg-white/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:border-sky-400',
      features: [
        'Full custom web app & arsitektur enterprise',
        'Backend C# .NET 8 / Golang / NestJS + Database',
        'REST API development & integrasi sistem',
        'Dashboard analytics & telemetri operasional',
        'Payment gateway / RFID / IoT monitoring',
        'Revisi fleksibel selama pengembangan',
        'Support & pemeliharaan prioritas 1 bulan',
        'Harga fleksibel sesuai cakupan proyek'
      ],
      notIncluded: []
    }
  ];

  return (
    <section id="pricing" className="py-20 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
            <span className="text-cyan-400 font-bold">+</span>
            <span>INVESTASI TERBAIK</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            Harga <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">Jasa</span>
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Pilih paket pengembangan yang sesuai dengan kebutuhan operasional dan budget proyek Anda.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  soundFx.playHover();
                  setSelectedPlan(plan.id as any);
                }}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl cursor-pointer ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-[#091523] via-[#09101b] to-[#070b12] border-2 border-cyan-400/60 shadow-[0_0_40px_rgba(6,182,212,0.2)] lg:-translate-y-2'
                    : 'bg-[#090d16]/90 border border-white/10 hover:border-cyan-500/30'
                }`}
              >
                {/* Popular Pill */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-black text-[10px] font-mono font-bold tracking-wider shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 fill-black" />
                    <span>{plan.popularTag}</span>
                  </div>
                )}

                <div>
                  {/* Plan Top Section */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${plan.badgeColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white font-mono">{plan.name}</h3>
                        <span className="text-[11px] text-slate-400 block">{plan.description}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="py-4 border-y border-white/10 my-4 flex items-baseline gap-1.5 font-mono">
                    <span className="text-xs text-slate-400">Rp</span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400">{plan.priceUnit}</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 py-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                      FITUR TERMASUK:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}

                    {/* Not Included (if any) */}
                    {plan.notIncluded.length > 0 && (
                      <div className="pt-2 space-y-1.5 opacity-60">
                        {plan.notIncluded.map((notFeat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-500">
                            <span className="w-3.5 h-3.5 text-slate-600 flex items-center justify-center shrink-0">-</span>
                            <span className="line-through">{notFeat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-6 mt-4 border-t border-white/10">
                  <button
                    id={`pricing-select-${plan.id}-btn`}
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playClick();
                      onOpenHireModal(plan.name);
                    }}
                    className={`w-full py-3.5 rounded-xl font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${plan.btnColor}`}
                  >
                    <span>PILIH PAKET INI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Custom Inquiry Callout */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-4 px-6 rounded-2xl bg-[#090d16]/80 border border-cyan-500/20 text-xs font-mono text-slate-300 shadow-lg">
            <span>Butuh arsitektur khusus atau integrasi hardware & IoT lapangan?</span>
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenHireModal('Custom Architecture');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Diskusikan Kebutuhan Custom</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
