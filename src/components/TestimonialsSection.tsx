import { motion } from 'motion/react';
import { MessageSquare, Star, Quote, ShieldCheck } from 'lucide-react';
import { Testimonial } from '../types';
import { SpotlightCard } from './SpotlightCard';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>ENDORSEMENTS & REVIEWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Client & Leader <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">Testimonials</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            What founders, engineering managers, and product leads say about collaborating together.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <SpotlightCard
              key={test.id}
              className="p-7 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              spotlightColor="rgba(168, 85, 247, 0.12)"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-purple-400/40" />
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{test.content}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-cyan-400/30"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      {test.name}
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {test.role}, {test.company}
                    </p>
                  </div>
                </div>

                {test.projectRelation && (
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 hidden sm:inline">
                    {test.projectRelation}
                  </span>
                )}
              </div>
            </SpotlightCard>
          ))}
        </div>

      </div>
    </section>
  );
}
