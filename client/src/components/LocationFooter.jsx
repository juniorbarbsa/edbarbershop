import React from 'react';
import { MapPin, Clock, MessageCircle, Lock, ArrowUp } from 'lucide-react';

export default function LocationFooter({ settings, onOpenAdmin }) {
  const currentYear = new Date().getFullYear();
  const phone = settings?.whatsapp?.replace(/\D/g, '') || '';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="localizacao" className="relative bg-[#06080b] border-t border-white/[0.06] pt-14 pb-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Ed Barber Shop" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="text-base font-bold text-white font-['Outfit'] block">
                  {settings?.shopName || 'ED BARBER SHOP'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  DESDE 1999
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Tradição, cuidado e excelência em cada detalhe. O melhor espaço para você manter seu estilo em dia com pontualidade.
            </p>
          </div>

          {/* Col 2: Horários */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Funcionamento</span>
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400 font-normal">
              <div className="flex justify-between pb-1 border-b border-white/[0.04]">
                <span>Terça a Sábado:</span>
                <span className="text-slate-200 font-medium">
                  {settings?.openingHour || '09:00'} - {settings?.closingHour || '19:30'}
                </span>
              </div>
              <div className="flex justify-between pb-1 border-b border-white/[0.04]">
                <span>Domingo e Segunda:</span>
                <span className="text-slate-500">Fechado</span>
              </div>
              <div className="flex justify-between">
                <span>Almoço:</span>
                <span className="text-slate-300">
                  {settings?.lunchStart || '12:00'} - {settings?.lunchEnd || '13:00'}
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Localização & Contato */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Localização</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="text-slate-300 font-normal">
                {settings?.address || 'Rua Principal, 1999 - Centro'}
              </p>
              <div className="pt-1 flex flex-col gap-1.5">
                <a
                  href={`https://api.whatsapp.com/send?phone=${phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chamar no WhatsApp</span>
                </a>
                {settings?.instagram && (
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

          {/* Col 4: Painel do Barbeiro */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Área do Barbeiro</span>
            </h4>
            <p className="text-xs text-slate-400 font-normal">
              Painel para gerenciar agendamentos, clientes e definir horários de atendimento.
            </p>
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5 cursor-pointer border border-white/[0.06]"
            >
              <Lock className="w-3 h-3" />
              <span>Acessar Painel com Senha</span>
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {currentYear} {settings?.shopName || 'Ed Barber Shop'}. Todos os direitos reservados.
          </div>
          <button
            onClick={scrollToTop}
            className="text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <span>Voltar ao Topo</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
}
