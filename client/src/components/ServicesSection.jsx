import React from 'react';
import { Scissors, Sparkles, Clock, Check, ArrowRight } from 'lucide-react';

export default function ServicesSection({ services, onSelectService }) {
  const formatPrice = (price) => {
    return Number(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <section id="servicos" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border-white/10 text-xs font-bold text-red-400 uppercase tracking-widest">
            <Scissors className="w-3.5 h-3.5" />
            <span>Nossos Procedimentos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
            Serviços & Especialidades
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Tradição na navalha, técnicas de fade modernas e tratamento de alto padrão para seu cabelo e barba.
          </p>
        </div>

        {/* Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const isPopular = service.popular || service.badge;

            return (
              <div
                key={service.id}
                className={`group relative rounded-3xl p-6 sm:p-7 glass-card-interactive flex flex-col justify-between overflow-hidden ${
                  isPopular ? 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.08)]' : ''
                }`}
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/25 transition-all"></div>

                <div>
                  {/* Top Badge & Duration */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {service.badge ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm">
                        {service.badge}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-400 bg-white/5 border border-white/5">
                        Ed Barber Shop
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-red-400" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors font-['Outfit'] mb-2">
                    {service.name}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Price & Button */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Valor
                    </span>
                    <span className="text-2xl font-black text-white font-['Outfit']">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectService(service)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-600 text-white text-xs font-bold transition-all duration-200 flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-red-600/30 cursor-pointer"
                  >
                    <span>Agendar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
