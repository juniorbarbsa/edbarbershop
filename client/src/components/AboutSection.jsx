import React from 'react';
import { Clock, Sparkles, Coffee, ShieldCheck } from 'lucide-react';

export default function AboutSection({ settings }) {
  return (
    <section id="sobre" className="py-16 sm:py-24 relative border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl glass-card space-y-6 text-center lg:text-left">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Nossa Trajetória
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit'] leading-tight">
                Mais de 25 anos dedicados à arte da barbearia.
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                Fundada em 1999, a <strong className="text-slate-200">Ed Barber Shop</strong> preserva o ritual da navalha afiada e o atendimento personalizado, adaptando cortes modernos ao perfil único de cada cliente.
              </p>

              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold text-white font-['Outfit']">1999</p>
                  <p className="text-[10px] text-slate-400">Fundação</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white font-['Outfit']">+25</p>
                  <p className="text-[10px] text-slate-400">Anos na Cadeira</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white font-['Outfit']">100%</p>
                  <p className="text-[10px] text-slate-400">Dedicação</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Experience Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                O Padrão Ed Barber
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit']">
                Conforto, pontualidade e resultado.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl glass-card space-y-2">
                <div className="p-2 rounded-xl bg-white/[0.04] text-slate-300 w-fit">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Pontualidade no Horário</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Seu horário agendado é respeitado para você não perder tempo com esperas desnecessárias.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card space-y-2">
                <div className="p-2 rounded-xl bg-white/[0.04] text-slate-300 w-fit">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Navalha & Toalha Quente</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tratamento clássico para barba e pele macia com produtos profissionais de alta performance.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card space-y-2">
                <div className="p-2 rounded-xl bg-white/[0.04] text-slate-300 w-fit">
                  <Coffee className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Café & Bebidas</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Espaço pensado para você relaxar com café e cerveja enquanto cuida do seu estilo.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card space-y-2">
                <div className="p-2 rounded-xl bg-white/[0.04] text-slate-300 w-fit">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Higiene & Precisão</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Materiais descartáveis, esterilização contínua e técnica apurada em cada movimento.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
