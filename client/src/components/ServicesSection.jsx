import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

export default function ServicesSection({ services, onSelectService }) {
  const formatPrice = (price) => {
    return Number(price).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <section id="servicos" className="py-16 sm:py-24 relative border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
            Nossos Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-['Outfit']">
            Cuidado & Precisão
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Do corte clássico às técnicas modernas de navalha e barba terapia. Escolha seu procedimento para agendar.
          </p>
        </div>

        {/* Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            return (
              <div
                key={service.id}
                className="group relative rounded-2xl p-6 glass-card-interactive flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Badge & Duration */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {service.badge ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-white/[0.08] text-slate-200 border border-white/10">
                        {service.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                        Procedimento
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors font-['Outfit'] mb-2">
                    {service.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Bottom: Price & Button */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-medium text-slate-400 block">
                      Valor
                    </span>
                    <span className="text-xl font-bold text-white font-['Outfit']">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectService(service)}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.06] group-hover:bg-white group-hover:text-slate-950 text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Agendar</span>
                    <ArrowRight className="w-3 h-3" />
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
