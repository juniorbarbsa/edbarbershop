import React, { useState } from 'react';
import { Scissors, Lock, Menu, X, ArrowRight, Phone } from 'lucide-react';

export default function Navbar({ settings, onOpenAdmin, onScrollToBooking }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOnline = settings?.status === 'online';
  const phone = settings?.whatsapp?.replace(/\D/g, '') || '5573981164949';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c0e12]/95 border-b border-[#1f242e] backdrop-blur transition-all">
      {/* Barber Pole classic top stripe */}
      <div className="h-[2px] w-full barber-stripe-accent opacity-90"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img 
              src="/logo.png" 
              alt="Ed Barber Shop" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">
                  ED BARBER SHOP
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                Desde 1999 • Walter Hollenwerger, 119
              </p>
            </div>
          </div>

          {/* Center: Live Status Indicator */}
          <div className="hidden md:flex items-center">
            {isOnline ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Atendendo Agora</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Horários Pausados</span>
              </div>
            )}
          </div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={onScrollToBooking}
              className="text-xs font-semibold text-slate-300 hover:text-white transition tracking-wide cursor-pointer"
            >
              Agendar Horário
            </button>
            <button 
              onClick={() => document.getElementById('localizacao')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-semibold text-slate-300 hover:text-white transition tracking-wide cursor-pointer"
            >
              Endereço & Horários
            </button>

            {/* Direct WhatsApp Call */}
            <a
              href={`https://api.whatsapp.com/send?phone=${phone}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>(73) 98116-4949</span>
            </a>

            {/* Agendar CTA */}
            <button
              onClick={onScrollToBooking}
              className="px-4 py-2 rounded-lg bg-white text-slate-950 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <span>Agendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Barber Admin Access */}
            <button
              onClick={onOpenAdmin}
              title="Acesso com Senha do Barbeiro"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              title="Acesso com Senha do Barbeiro"
              className="p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#1f242e] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f242e]">
              <span className="text-xs text-slate-400">Status da barbearia:</span>
              {isOnline ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Atendendo Agora
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Pausado
                </span>
              )}
            </div>

            <button 
              onClick={() => { setMobileMenuOpen(false); onScrollToBooking(); }}
              className="text-left text-sm py-1.5 text-slate-300"
            >
              Agendar Horário
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); document.getElementById('localizacao')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left text-sm py-1.5 text-slate-300"
            >
              Endereço & Horários
            </button>
            
            <a
              href={`https://api.whatsapp.com/send?phone=${phone}`}
              target="_blank"
              rel="noreferrer"
              className="text-left text-sm py-1.5 text-emerald-400 font-medium flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>(73) 98116-4949</span>
            </a>

            <button 
              onClick={() => { setMobileMenuOpen(false); onScrollToBooking(); }}
              className="w-full py-2.5 mt-2 rounded-lg bg-white text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scissors className="w-4 h-4" />
              Agendar Horário
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
