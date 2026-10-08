import React from 'react';
import { MapPin, Clock, MessageCircle, Lock, ArrowUp, Mail, Phone } from 'lucide-react';

export default function LocationFooter({ settings, onOpenAdmin }) {
  const currentYear = new Date().getFullYear();
  const phone = settings?.whatsapp?.replace(/\D/g, '') || '5573981164949';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="localizacao" className="relative bg-[#080a0e] border-t border-[#1f242e] pt-12 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
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
            <p className="text-xs text-slate-400 leading-relaxed">
              Atendimento profissional com hora marcada. Tradição e precisão desde 1999.
            </p>
          </div>

          {/* Col 2: Horários */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Funcionamento</span>
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between pb-1 border-b border-[#1f242e]">
                <span>Segunda a Domingo:</span>
                <span className="text-slate-200 font-semibold">
                  09:00 às 21:00h
                </span>
              </div>
              <div className="flex justify-between pb-1 border-b border-[#1f242e]">
                <span>Almoço:</span>
                <span className="text-slate-300">
                  13:00 às 14:00h
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tempo do corte:</span>
                <span className="text-slate-300">
                  30 a 40 minutos
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Localização & Contato */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Endereço & Contato</span>
            </h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="text-slate-200 font-medium">
                Rua Walter Hollenwerger, 119
              </p>
              <p className="text-slate-400 text-[11px]">
                Antiga Batateira, Centro
              </p>
              <div className="pt-2 flex flex-col gap-1.5">
                <a
                  href={`https://api.whatsapp.com/send?phone=${phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>(73) 98116-4949</span>
                </a>
                <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>edalves8127@gmail.com</span>
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Painel do Barbeiro */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Área do Barbeiro</span>
            </h4>
            <p className="text-xs text-slate-400">
              Acesso restrito para o Ed gerenciar agendamentos, folgas e horários.
            </p>
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-lg bg-[#161a22] hover:bg-[#1e2430] text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border border-[#262c3b]"
            >
              <Lock className="w-3 h-3" />
              <span>Acessar Painel</span>
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#1f242e] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} Ed Barber Shop • Todos os direitos reservados.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span>Desenvolvido por</span>
            <strong className="text-slate-200 font-bold">SCTECH</strong>
            <span className="text-slate-600">•</span>
            <a 
              href="https://sctechinova.com.br" 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-300 hover:text-white transition underline underline-offset-4 decoration-slate-600 hover:decoration-white font-medium"
            >
              sctechinova.com.br
            </a>
            <span className="text-slate-600">•</span>
            <span>CNPJ: 59.070.203/0001-05</span>
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
