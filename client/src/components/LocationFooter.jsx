import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, Lock, ArrowUp } from 'lucide-react';

export default function LocationFooter({ settings, onOpenAdmin }) {
  const currentYear = new Date().getFullYear();
  const phone = settings?.whatsapp?.replace(/\D/g, '') || '';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="localizacao" className="relative bg-[#05070a] border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 barber-stripe-accent opacity-80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Ed Barber Shop" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <span className="text-xl font-black text-white font-['Outfit'] block">
                  {settings?.shopName || 'ED BARBER SHOP'}
                </span>
                <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">
                  DESDE 1999
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tradição, cuidado e excelência em cada detalhe. O melhor espaço para você manter seu estilo em dia com facilidade e conforto.
            </p>
          </div>

          {/* Col 2: Horários */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-400" />
              <span>Horário de Funcionamento</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between pb-1 border-b border-white/5">
                <span>Segunda a Sábado:</span>
                <span className="text-white font-semibold">
                  {settings?.openingHour || '09:00'} às {settings?.closingHour || '19:30'}
                </span>
              </div>
              <div className="flex justify-between pb-1 border-b border-white/5">
                <span>Domingo:</span>
                <span className="text-slate-500">Fechado</span>
              </div>
              <div className="flex justify-between">
                <span>Intervalo Almoço:</span>
                <span className="text-slate-300">
                  {settings?.lunchStart || '12:00'} - {settings?.lunchEnd || '13:00'}
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Localização & Contato */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Localização & Contato</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="text-slate-300">
                {settings?.address || 'Rua Principal, 1999 - Centro'}
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp da Barbearia</span>
                </a>
                {settings?.instagram && (
                  <span className="inline-flex items-center gap-2 text-rose-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                    <span>{settings.instagram}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Col 4: Acesso do Barbeiro */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Área do Barbeiro</span>
            </h4>
            <p className="text-xs text-slate-400">
              Painel exclusivo para o Ed gerenciar agendamentos, status de atendimento e horários.
            </p>
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2.5 rounded-xl glass-card hover:border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acessar Painel com Senha</span>
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} {settings?.shopName || 'Ed Barber Shop'}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg glass-card hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <span>Voltar ao Topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
