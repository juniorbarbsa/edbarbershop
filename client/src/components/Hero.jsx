import React from 'react';
import { Calendar, Clock, MessageCircle, ArrowRight, MapPin, Mail, CheckCircle2 } from 'lucide-react';

export default function Hero({ settings, onScrollToBooking }) {
  const isOnline = settings?.status === 'online';
  const phone = settings?.whatsapp?.replace(/\D/g, '') || '5573981164949';

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(`Olá Ed! Gostaria de consultar horários disponíveis na barbearia.`);
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, '_blank');
  };

  return (
    <section className="relative pt-8 pb-14 lg:pt-14 lg:pb-18 border-b border-[#1f242e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Offline Alert if barber paused bookings */}
        {!isOnline && (
          <div className="mb-8 p-4 rounded-xl barber-card border-amber-500/30 bg-amber-500/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <p className="text-xs text-amber-200 font-medium">
                {settings?.closedMessage || "No momento os agendamentos online estão pausados. Para consultar horários, envie uma mensagem no WhatsApp."}
              </p>
            </div>
            <button
              onClick={handleWhatsAppDirect}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp (73) 98116-4949
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Direct Barbershop Presentation */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#161a22] border border-[#232834] text-[11px] font-semibold text-slate-300">
                <span>ED BARBER SHOP • DESDE 1999</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-['Outfit'] leading-tight">
                Agendamento de Horários
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Consulte a agenda, escolha o corte ou barba e confirme seu horário em poucos segundos. O agendamento é enviado diretamente para o WhatsApp do Ed.
              </p>
            </div>

            {/* Practical Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl barber-card text-left space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Aberto Todos os Dias</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Segunda a Domingo: 09:00 às 21:00h
                </p>
                <p className="text-[10px] text-slate-500">
                  Intervalo de almoço: 13:00 às 14:00h
                </p>
              </div>

              <div className="p-3.5 rounded-xl barber-card text-left space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Endereço</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Rua Walter Hollenwerger, 119
                </p>
                <p className="text-[10px] text-slate-500">
                  Antiga Batateira, Centro
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onScrollToBooking}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs sm:text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Meu Horário</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>

              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl barber-card hover:border-[#3b4356] text-slate-300 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp (73) 98116-4949</span>
              </button>
            </div>

          </div>

          {/* Right Column: Physical Wall Emblem Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="p-5 sm:p-7 rounded-2xl barber-card flex flex-col items-center text-center">
                
                {/* The Logo */}
                <div className="py-2">
                  <img
                    src="/logo.png"
                    alt="Ed Barber Shop"
                    className="w-40 h-40 sm:w-56 sm:h-56 object-contain drop-shadow-md"
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-[#1f242e] w-full flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tempo de atendimento:</span>
                  <span className="font-semibold text-slate-200">
                    30 a 40 minutos
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
