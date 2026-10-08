import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginAdmin } from '../api';
import AdminDashboard from './AdminDashboard';

export default function AdminModal({ isOpen, onClose, onSettingsUpdated }) {
  const [token, setToken] = useState(() => localStorage.getItem('ed_barber_admin_token') || null);
  const [username, setUsername] = useState('');
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
    if (!username.trim()) {
      setErrorMsg('Informe o usuário ou e-mail de acesso.');
      return;
    }
    if (!password) {
      setErrorMsg('Informe a senha de acesso.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await loginAdmin({ username: username.trim(), password });
      if (res.token) {
        localStorage.setItem('ed_barber_admin_token', res.token);
        setToken(res.token);
        setPassword('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Usuário ou senha incorretos.');
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
      
      <div className={`relative w-full ${token ? 'max-w-5xl h-[95vh] sm:h-auto sm:max-h-[92vh]' : 'max-w-sm max-h-[92vh]'} flex flex-col rounded-t-3xl sm:rounded-2xl barber-card border border-[#2b3342] shadow-2xl transition-all overflow-hidden`}>
        
        {/* Sticky Header with Close button */}
        <div className="shrink-0 bg-[#0e1117] border-b border-[#1f242e] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/[0.05] text-slate-300">
              {token ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-300" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit'] leading-tight">
                {token ? 'Painel do Barbeiro' : 'Área Restrita'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                {token ? 'Gerenciamento de agenda e horários' : 'Acesso com usuário e senha'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a202c] transition cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6">
          {token ? (
            <AdminDashboard
              token={token}
              onLogout={handleLogout}
              onStatusChange={onSettingsUpdated}
            />
          ) : (
            <div className="space-y-5 text-center py-2">
            
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300">
                <Lock className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Acesso do Barbeiro
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Digite suas credenciais de acesso para gerenciar agendamentos e horários.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5 text-left">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">
                  Usuário ou E-mail
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="Seu usuário ou e-mail"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg barber-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  placeholder="Sua senha de acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg barber-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-md mt-2"
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
    </div>
  );
}
