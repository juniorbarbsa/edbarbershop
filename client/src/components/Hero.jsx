import React from 'react';
import { Calendar, Clock, MessageCircle, ArrowRight, MapPin, CheckCircle } from 'lucide-react';

export default function Hero({ settings, onScrollToBooking }) {
  const isOnline = settings?.status === 'online';

  const handleWhatsAppDirect = () => {
    const phone = settings?.whatsapp?.replace(/\D/g, '') || '';
    const text = encodeURIComponent(`Olá ${settings?.barberName || 'Ed Barber'}! Gostaria de consultar horários disponíveis.`);
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-20">
      {/* Subtle Ambient Light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-red-600/[0.03] rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Offline Alert if barber paused bookings */}
        {!isOnline && (
          <div className="mb-8 p-4 rounded-2xl glass-card border-amber-500/25 bg-amber-500/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <p className="text-xs text-amber-200/90 font-medium">
                {settings?.closedMessage || "No momento os agendamentos online estão pausados. Para urgências, entre em contato via WhatsApp."}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Direct Operational Information */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border-white/[0.08] text-[11px] font-semibold text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>{settings?.shopName || 'Ed Barber Shop'} • Desde {settings?.since || '1999'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-['Outfit']">
                Agendamento Online de Horários
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Consulte a disponibilidade em tempo real, escolha o serviço e reserve seu horário com confirmação automática pelo WhatsApp do barbeiro.
              </p>
            </div>

            {/* Quick Operational Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl glass-card flex items-start gap-3 text-left">
                <Clock className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-200">Horário de Atendimento</p>
                  <p className="text-slate-400 text-[11px]">
                    Terça a Sábado: {settings?.openingHour || '09:00'} às {settings?.closingHour || '19:30'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl glass-card flex items-start gap-3 text-left">
                <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-200">Localização</p>
                  <p className="text-slate-400 text-[11px] truncate">
                    {settings?.address || 'Rua Principal, 1999 - Centro'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onScrollToBooking}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Escolher Serviço & Horário</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>

              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl glass-card hover:bg-white/[0.08] text-slate-300 hover:text-white font-medium text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp da Barbearia</span>
              </button>
            </div>

          </div>

          {/* Right Column: Clean Logo Pedestal */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="relative p-6 sm:p-8 rounded-3xl glass-card flex flex-col items-center text-center">
                
                {/* Logo with clean styling */}
                <div className="py-2">
                  <img
                    src="/logo.png"
                    alt="Ed Barber Shop"
                    className="w-52 h-52 sm:w-60 sm:h-60 object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
                  />
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/[0.06] w-full flex items-center justify-between text-[11px] text-slate-400">
                  <span>Atendimento com hora marcada</span>
                  <span className="font-semibold text-slate-200">
                    Ed Barber
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
