import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginAdmin } from '../api';
import AdminDashboard from './AdminDashboard';

export default function AdminModal({ isOpen, onClose, onSettingsUpdated }) {
  const [token, setToken] = useState(() => localStorage.getItem('ed_barber_admin_token') || null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset error when modal opens
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      
      {/* Outer container */}
      <div className={`relative w-full ${token ? 'max-w-6xl my-8' : 'max-w-md'} rounded-3xl glass-card border border-white/15 p-6 sm:p-8 shadow-2xl transition-all`}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl glass-card hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer z-10"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {token ? (
          /* Logged In: Show Admin Dashboard */
          <div>
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Acesso Administrativo
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sessão segura autenticada
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
          /* Login Form */
          <div className="space-y-6 text-center">
            
            {/* Header */}
            <div className="space-y-3">
              <div className="relative mx-auto w-16 h-16 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition"></div>
                <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-red-500">
                  <KeyRound className="w-8 h-8" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-white font-['Outfit']">
                Painel do Barbeiro
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Digite sua senha de acesso para gerenciar agendamentos, clientes e disponibilidade.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  <span>Senha de Acesso</span>
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="Digite a senha..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                />
                <p className="text-[11px] text-slate-400 pt-1">
                  💡 Senha padrão: <strong className="text-white">ed1999</strong> (pode ser alterada no painel)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Entrar no Painel</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                Voltar para o site da Barbearia
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
