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
    <section id="servicos" className="py-14 sm:py-20 border-b border-[#1f242e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1.5">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            Tabela de Preços
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit']">
            Serviços & Procedimentos
          </h2>
          <p className="text-xs text-slate-400">
            Selecione o serviço para visualizar os horários disponíveis e reservar sua cadeira.
          </p>
        </div>

        {/* Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            return (
              <div
                key={service.id}
                className="barber-card-interactive rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Badge & Duration */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {service.badge ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-[#232834] text-slate-200">
                        {service.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                        Atendimento
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white font-['Outfit'] mb-1.5">
                    {service.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed mb-5 font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Bottom: Price & Button */}
                <div className="pt-3.5 border-t border-[#1f242e] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-medium text-slate-400 block">
                      Valor
                    </span>
                    <span className="text-lg font-bold text-white font-['Outfit']">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectService(service)}
                    className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white hover:text-slate-950 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
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
