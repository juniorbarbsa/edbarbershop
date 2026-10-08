import React, { useState } from 'react';
import { Scissors, Lock, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar({ settings, onOpenAdmin, onScrollToBooking }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOnline = settings?.status === 'online';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090b0e]/80 border-b border-white/[0.06] transition-all">
      {/* Barber Pole subtle top line */}
      <div className="h-[2px] w-full barber-stripe-accent opacity-75"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Ed Barber Shop" 
                className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">
                  ED BARBER
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10">
                  SHOP
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">
                Desde 1999 • Tradição & Estilo
              </p>
            </div>
          </div>

          {/* Center: Clean Live Status Badge */}
          <div className="hidden md:flex items-center">
            {isOnline ? (
              <div className="flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Atendendo Hoje</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill border-amber-500/20 text-amber-400 text-xs font-medium">
                <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span>
                <span>Horários Pausados</span>
              </div>
            )}
          </div>

          {/* Right Navigation */}
          <div className="hidden md:flex items-center gap-5">
            <button 
              onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-medium text-slate-300 hover:text-white transition tracking-wide cursor-pointer"
            >
              Serviços & Preços
            </button>
            <button 
              onClick={onScrollToBooking}
              className="text-xs font-medium text-slate-300 hover:text-white transition tracking-wide cursor-pointer"
            >
              Agendar Horário
            </button>
            <button 
              onClick={() => document.getElementById('localizacao')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-medium text-slate-300 hover:text-white transition tracking-wide cursor-pointer"
            >
              Localização
            </button>

            {/* Agendar CTA */}
            <button
              onClick={onScrollToBooking}
              className="px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <span>Agendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Barber Admin Access */}
            <button
              onClick={onOpenAdmin}
              title="Acesso Administrativo"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              title="Acesso Administrativo"
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
          <div className="md:hidden py-4 border-t border-white/[0.06] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
              <span className="text-xs text-slate-400">Status atual:</span>
              {isOnline ? (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Atendendo
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Pausado
                </span>
              )}
            </div>

            <button 
              onClick={() => { setMobileMenuOpen(false); document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left text-sm py-1.5 text-slate-300"
            >
              Serviços & Preços
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); document.getElementById('localizacao')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-left text-sm py-1.5 text-slate-300"
            >
              Localização & Horários
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onScrollToBooking(); }}
              className="w-full py-2.5 mt-2 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
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
