import React from 'react';
import { Calendar, Clock, MessageCircle, ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function Hero({ settings, onScrollToBooking }) {
  const isOnline = settings?.status === 'online';

  const handleWhatsAppDirect = () => {
    const phone = settings?.whatsapp?.replace(/\D/g, '') || '';
    const text = encodeURIComponent(`Olá ${settings?.barberName || 'Ed Barber'}! Gostaria de consultar horários.`);
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-28">
      {/* Subtle Background Ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/[0.04] rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-blue-600/[0.04] rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Offline Alert if barber paused bookings */}
        {!isOnline && (
          <div className="mb-10 p-4 rounded-2xl glass-card border-amber-500/25 bg-amber-500/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <AlertCircle className="w-4 h-4" />
              </div>
              <p className="text-xs text-amber-200/90 font-medium">
                {settings?.closedMessage || "No momento os agendamentos online estão pausados. Fale conosco no WhatsApp."}
              </p>
            </div>
            <button
              onClick={handleWhatsAppDirect}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Falar no WhatsApp
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & Action */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border-white/[0.08] text-[11px] font-semibold text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span>Barbearia Clássica & Contemporânea • Desde {settings?.since || '1999'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] font-['Outfit']">
              Precisão no corte. <br />
              <span className="text-slate-400 font-light">
                Tradição na navalha.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Reserve sua cadeira na <strong className="text-slate-200 font-medium">{settings?.shopName || 'Ed Barber Shop'}</strong> de forma rápida e intuitiva. Sem filas, com horário pontual e confirmação instantânea.
            </p>

            {/* Clean Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 pt-1 text-xs text-slate-300">
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Navalha & Toalha Quente
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Pontualidade Rigorosa
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Ambiente Climatizado & Café
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onScrollToBooking}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Horário Online</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>

              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-card hover:bg-white/[0.08] text-slate-300 hover:text-white font-medium text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Conversar no WhatsApp</span>
              </button>
            </div>

            {/* Clean Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/[0.06] max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">+25 Anos</p>
                <p className="text-[11px] text-slate-400">De Tradição</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">+15.000</p>
                <p className="text-[11px] text-slate-400">Atendimentos</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-200 font-['Outfit']">4.9 ★</p>
                <p className="text-[11px] text-slate-400">Avaliação Média</p>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Logo Pedestal */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              
              <div className="relative p-8 rounded-3xl glass-card flex flex-col items-center text-center">
                
                {/* Logo with clean styling */}
                <div className="relative py-2">
                  <img
                    src="/logo.png"
                    alt="Ed Barber Shop"
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
                  />
                </div>

                {/* Subtitle capsule */}
                <div className="mt-4 pt-4 border-t border-white/[0.06] w-full flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Terça a Sábado</span>
                  </div>
                  <span className="font-semibold text-slate-200">
                    {settings?.openingHour || '09:00'} - {settings?.closingHour || '19:30'}
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
