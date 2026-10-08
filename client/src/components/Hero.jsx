import React from 'react';
import { Calendar, Clock, Sparkles, MessageCircle, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Hero({ settings, onScrollToBooking }) {
  const isOnline = settings?.status === 'online';

  const handleWhatsAppDirect = () => {
    const phone = settings?.whatsapp?.replace(/\D/g, '') || '';
    const text = encodeURIComponent(`Olá ${settings?.barberName || 'Ed Barber'}! Gostaria de tirar uma dúvida sobre horários.`);
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-24">
      {/* Background Radial Glows based on Logo colors (Crimson Red & Deep Blue) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[380px] h-[380px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Offline notice if barber paused bookings */}
        {!isOnline && (
          <div className="mb-8 p-4 rounded-2xl glass-card border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-[0_0_25px_rgba(245,158,11,0.15)]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-300">Aviso do Barbeiro: Horários Temporariamente Fechados</h4>
                <p className="text-xs text-amber-200/80">
                  {settings?.closedMessage || "No momento os agendamentos online estão pausados. Por favor, entre em contato via WhatsApp."}
                </p>
              </div>
            </div>
            <button
              onClick={handleWhatsAppDirect}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Falar com o Barbeiro
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border-white/10 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Barbearia Clássica & Moderna • Desde {settings?.since || '1999'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] font-['Outfit']">
              Estilo impecável. <br />
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-blue-500 bg-clip-text text-transparent">
                Tradição que se renova.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Agende seu corte e barba na <strong className="text-white font-semibold">{settings?.shopName || 'Ed Barber Shop'}</strong> em poucos cliques. Sem filas, com pontualidade e confirmação instantânea no seu WhatsApp.
            </p>

            {/* Benefits check list */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2 text-xs sm:text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Navalha & Toalha Quente</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ambiente Climatizado & Café</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Horário 100% Garantido</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onScrollToBooking}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>Agendar Meu Horário</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-6 py-4 rounded-xl glass-card hover:border-emerald-500/40 text-slate-200 hover:text-white font-semibold text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>WhatsApp do Ed</span>
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div className="p-3 rounded-xl glass-card text-center">
                <div className="text-xl sm:text-2xl font-black text-white font-['Outfit']">+25 Anos</div>
                <div className="text-[11px] text-slate-400 font-medium">De Tradição</div>
              </div>
              <div className="p-3 rounded-xl glass-card text-center">
                <div className="text-xl sm:text-2xl font-black text-white font-['Outfit']">+15.000</div>
                <div className="text-[11px] text-slate-400 font-medium">Cortes & Barbas</div>
              </div>
              <div className="p-3 rounded-xl glass-card text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-['Outfit']">4.9 ★★★★★</div>
                <div className="text-[11px] text-slate-400 font-medium">Clientes Satisfeitos</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Glass Showcase with Transparent Logo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Outer Decorative Glow Ring */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-red-600/30 via-slate-800 to-blue-600/30 rounded-3xl blur-xl opacity-60"></div>
              
              {/* Main Glass Card container */}
              <div className="relative p-6 sm:p-8 rounded-3xl glass-card border border-white/15 shadow-2xl flex flex-col items-center text-center">
                
                {/* Barber pole stripes top mini badge */}
                <div className="w-20 h-2 rounded-full barber-stripe-accent mb-6 shadow-md"></div>

                {/* The Clean Transparent Logo */}
                <div className="relative group cursor-pointer my-2">
                  <div className="absolute -inset-4 bg-gradient-to-r from-red-600/40 via-blue-600/40 to-white/20 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition duration-500"></div>
                  <img
                    src="/logo.png"
                    alt="Ed Barber Shop Logo"
                    className="relative w-56 h-56 sm:w-64 sm:h-64 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Subtext under logo */}
                <div className="mt-4 space-y-1">
                  <h3 className="text-2xl font-extrabold text-white tracking-wide font-['Outfit']">
                    ED BARBER SHOP
                  </h3>
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-widest">
                    DESDE 1999 • SALÃO EXCLUSIVO
                  </p>
                </div>

                {/* Quick Info Capsule */}
                <div className="mt-6 w-full p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span>Terça a Sábado</span>
                  </div>
                  <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                    09:00 - 19:30
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Ambiente seguro, pontual e profissional</span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
