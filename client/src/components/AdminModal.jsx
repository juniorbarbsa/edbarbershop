import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginAdmin } from '../api';
import AdminDashboard from './AdminDashboard';

export default function AdminModal({ isOpen, onClose, onSettingsUpdated }) {
  const [token, setToken] = useState(() => localStorage.getItem('ed_barber_admin_token') || null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setPassword('');
    }
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Informe a senha de acesso.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await loginAdmin(password);
      if (res.token) {
        localStorage.setItem('ed_barber_admin_token', res.token);
        setToken(res.token);
        setPassword('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Senha incorreta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ed_barber_admin_token');
    setToken(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      <div className={`relative w-full ${token ? 'max-w-5xl my-8' : 'max-w-sm'} rounded-3xl glass-card border border-white/10 p-6 sm:p-8 shadow-2xl transition-all`}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer z-10"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {token ? (
          <div>
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/[0.05] text-slate-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Outfit']">
                    Painel do Barbeiro
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Sessão administrativa autenticada
                  </p>
                </div>
              </div>
            </div>

            <AdminDashboard
              token={token}
              onLogout={handleLogout}
              onStatusChange={onSettingsUpdated}
            />
          </div>
        ) : (
          <div className="space-y-6 text-center">
            
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300">
                <Lock className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Acesso do Barbeiro
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Digite sua senha de acesso para gerenciar agendamentos e horários.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
                <p className="text-[10px] text-slate-500 pt-1">
                  Senha inicial: <strong className="text-slate-300">ed1999</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-md"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Entrar no Painel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                Voltar ao site
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
