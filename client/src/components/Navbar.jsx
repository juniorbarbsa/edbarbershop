import React, { useState } from 'react';
import { Scissors, Lock, Clock, MessageSquare, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar({ settings, onOpenAdmin, onScrollToBooking }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOnline = settings?.status === 'online';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#080a0f]/80 border-b border-white/10 transition-all">
      {/* Barber Pole subtle top line */}
      <div className="h-1 w-full barber-stripe-accent opacity-90"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Name */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-white to-blue-600 rounded-full blur-sm opacity-40 group-hover:opacity-80 transition duration-300"></div>
              <img 
                src="/logo.png" 
                alt="Ed Barber Shop" 
                className="relative w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit']">
                  ED BARBER
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  SHOP
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wider">
                TRADIÇÃO & ESTILO DESDE 1999
              </p>
            </div>
          </div>

          {/* Center: Live Status Badge (Desktop) */}
          <div className="hidden md:flex items-center">
            {isOnline ? (
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Atendendo Agora</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>Horários Pausados</span>
              </div>
            )}
          </div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition"
            >
              Serviços
            </button>
            <button 
              onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition"
            >
              Sobre Nós
            </button>
            <button 
              onClick={() => document.getElementById('localizacao')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition"
            >
              Contato
            </button>

            {/* Agendar CTA */}
            <button
              onClick={onScrollToBooking}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-bold rounded-xl group bg-gradient-to-br from-red-600 via-rose-500 to-blue-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="relative px-4 py-2.5 transition-all ease-in duration-75 bg-[#0b0e14] rounded-[10px] group-hover:bg-opacity-0 flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-red-400 group-hover:text-white transition" />
                <span>Agendar Horário</span>
              </span>
            </button>

            {/* Barber Admin Access */}
            <button
              onClick={onOpenAdmin}
              title="Acesso do Barbeiro"
              className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-white hover:border-white/30 transition cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              title="Acesso do Barbeiro"
              className="p-2 rounded-lg glass-card text-slate-400 hover:text-white"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg glass-card text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs text-slate-400 font-medium">Status da Barbearia:</span>
              {isOnline ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Atendendo Agora
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Horários Pausados
                </span>
              )}
            </div>

            <button 
              onClick={() => { setMobileMenuOpen(false); document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left text-sm py-2 text-slate-300 font-medium"
            >
              💈 Nossos Serviços
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left text-sm py-2 text-slate-300 font-medium"
            >
              📖 História & Tradição (1999)
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); document.getElementById('localizacao')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left text-sm py-2 text-slate-300 font-medium"
            >
              📍 Localização & Horários
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onScrollToBooking(); }}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
            >
              <Scissors className="w-4 h-4" />
              Agendar Horário Online
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
