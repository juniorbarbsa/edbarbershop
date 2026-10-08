import React from 'react';
import { Award, Shield, Sparkles, Coffee, Music, Clock } from 'lucide-react';

export default function AboutSection({ settings }) {
  return (
    <section id="sobre" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background radial accents */}
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 via-blue-600/20 to-white/10 rounded-3xl blur-xl"></div>
              
              <div className="relative p-8 rounded-3xl glass-card space-y-6 text-center lg:text-left">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-red-600/30 mx-auto lg:mx-0">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                    Nossa Trajetória
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                    Desde 1999 Elevando a Autoestima Masculina
                  </h3>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Fundada no final dos anos 90, a <strong className="text-white">Ed Barber Shop</strong> nasceu com o propósito de unir o clássico atendimento das barbearias tradicionais com a precisão dos cortes modernos.
                </p>

                <div className="pt-4 border-t border-white/10 flex items-center justify-around text-center">
                  <div>
                    <p className="text-2xl font-black text-white font-['Outfit']">1999</p>
                    <p className="text-[11px] text-slate-400">Ano de Fundação</p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div>
                    <p className="text-2xl font-black text-white font-['Outfit']">100%</p>
                    <p className="text-[11px] text-slate-400">Foco no Cliente</p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div>
                    <p className="text-2xl font-black text-white font-['Outfit']">+25</p>
                    <p className="text-[11px] text-slate-400">Anos na Cadeira</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Pillars / Experience */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                A Experiência Ed Barber
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
                Mais do que um corte, um momento só seu.
              </h2>
              <p className="text-sm sm:text-base text-slate-300">
                Aqui você não é apenas mais um número na fila. Você tem hora marcada, atenção dedicada em cada detalhe e produtos de primeira linha para valorizar seu visual.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl glass-card space-y-2">
                <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 w-fit">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Pontualidade Britânica</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Respeitamos seu tempo. Agende pelo site e seja atendido sem espera cansativa.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card space-y-2">
                <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 w-fit">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Navalha & Toalha Quente</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ritual completo de barboterapia com hidratação, óleos aromáticos e pele macia.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card space-y-2">
                <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 w-fit">
                  <Coffee className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Café Expresso & Cerveja</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aproveite nosso espaço com café de qualidade e bebidas para relaxar enquanto espera ou é atendido.
                </p>
              </div>

              <div className="p-5 rounded-2xl glass-card space-y-2">
                <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 w-fit">
                  <Music className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Ambiente Exclusivo</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Som ambiente selecionado, ar-condicionado e a autêntica atmosfera de barbearia clássica.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
