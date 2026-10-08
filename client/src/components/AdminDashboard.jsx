import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Phone, 
  Calendar, 
  Trash2, 
  Power, 
  Settings, 
  Lock, 
  MessageSquare, 
  AlertTriangle,
  LogOut,
  RefreshCw,
  Ban,
  Check
} from 'lucide-react';
import { 
  getAdminDashboard, 
  updateBarberStatus, 
  updateAdminSettings, 
  changeAdminPassword, 
  updateAppointmentStatus, 
  deleteAppointment, 
  addBlockedSlot, 
  deleteBlockedSlot 
} from '../api';

export default function AdminDashboard({ token, onLogout, onStatusChange }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Active Tab: 'appointments' | 'blocks' | 'settings'
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointmentFilter, setAppointmentFilter] = useState('today'); // 'today' | 'upcoming' | 'all'

  // Block slot form
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockTime, setBlockTime] = useState('15:00');
  const [blockAllDay, setBlockAllDay] = useState(false);
  const [blockReason, setBlockReason] = useState('Compromisso particular');

  // Settings form
  const [settingsForm, setSettingsForm] = useState({});

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await getAdminDashboard(token);
      setData(res);
      setSettingsForm(res.settings);
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao carregar dados do painel.');
      if (err.message?.includes('expirada') || err.message?.includes('autorizada')) {
        setTimeout(onLogout, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const flashSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Toggle Barber Status ("Atendendo" / "Pausar")
  const handleToggleStatus = async (newStatus) => {
    try {
      setErrorMsg('');
      const res = await updateBarberStatus(token, { status: newStatus });
      flashSuccess(res.message);
      loadData();
      if (onStatusChange) onStatusChange(res.settings);
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao alterar status.');
    }
  };

  // Appointment actions
  const handleStatusChange = async (id, status) => {
    try {
      await updateAppointmentStatus(token, id, status);
      flashSuccess('Status do agendamento atualizado!');
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao alterar status do agendamento.');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) return;
    try {
      await deleteAppointment(token, id);
      flashSuccess('Agendamento excluído.');
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao excluir.');
    }
  };

  // Block Slot actions
  const handleAddBlock = async (e) => {
    e.preventDefault();
    try {
      await addBlockedSlot(token, {
        date: blockDate,
        time: blockTime,
        allDay: blockAllDay,
        reason: blockReason
      });
      flashSuccess('Horário/Dia bloqueado com sucesso!');
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao bloquear horário.');
    }
  };

  const handleDeleteBlock = async (id) => {
    try {
      await deleteBlockedSlot(token, id);
      flashSuccess('Bloqueio removido com sucesso!');
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao remover bloqueio.');
    }
  };

  // Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await updateAdminSettings(token, settingsForm);
      flashSuccess('Configurações salvas!');
      if (onStatusChange) onStatusChange(res.settings);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao salvar configurações.');
    }
  };

  // Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changeAdminPassword(token, currentPassword, newPassword);
      flashSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao alterar senha.');
    }
  };

  // Filter appointments
  const todayStr = new Date().toLocaleDateString('sv');
  const appointmentsList = data?.appointments || [];
  
  const todayCount = appointmentsList.filter(a => a.date === todayStr && a.status !== 'cancelled').length;
  const upcomingCount = appointmentsList.filter(a => a.date > todayStr && a.status !== 'cancelled').length;

  const filteredAppointments = appointmentsList.filter((apt) => {
    if (appointmentFilter === 'today') {
      return apt.date === todayStr;
    }
    if (appointmentFilter === 'upcoming') {
      return apt.date > todayStr;
    }
    return true;
  });

  if (loading && !data) {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-slate-300 font-bold text-xs">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
          <span>Carregando agenda...</span>
        </div>
      </div>
    );
  }

  const isOnline = data?.settings?.status === 'online';

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Top Bar: Barber Status & Actions */}
      <div className="p-4 sm:p-5 rounded-2xl barber-card flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Barber Info */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h2 className="text-base font-bold text-white font-['Outfit']">
              Painel do Ed Barber
            </h2>
            <p className="text-[11px] text-slate-400">
              WhatsApp: (73) 98116-4949
            </p>
          </div>
        </div>

        {/* Big Barber Status Toggle */}
        <div className="flex items-center gap-3 bg-[#0d1015] p-2 rounded-xl border border-[#232834] w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-left sm:text-right pr-2">
            <p className="text-[10px] text-slate-400 font-medium">Status de Atendimento:</p>
            <p className={`text-xs font-bold ${isOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isOnline ? '● Atendendo' : '○ Pausado'}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleToggleStatus('online')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                isOnline
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Atendendo</span>
            </button>

            <button
              onClick={() => handleToggleStatus('offline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                !isOnline
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>Pausar</span>
            </button>
          </div>

          <button
            onClick={onLogout}
            title="Sair do Painel"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Clean Metrics: Only Agendamentos Count (Zero Money / Zero R$) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl barber-card text-center space-y-0.5">
          <p className="text-[11px] text-slate-400 font-medium">Agendamentos Hoje</p>
          <p className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            {todayCount}
          </p>
        </div>

        <div className="p-4 rounded-xl barber-card text-center space-y-0.5">
          <p className="text-[11px] text-slate-400 font-medium">Próximos Dias</p>
          <p className="text-xl sm:text-2xl font-black text-slate-300 font-['Outfit']">
            {upcomingCount}
          </p>
        </div>

        <div className="p-4 rounded-xl barber-card text-center space-y-0.5">
          <p className="text-[11px] text-slate-400 font-medium">Total Geral</p>
          <p className="text-xl sm:text-2xl font-black text-slate-300 font-['Outfit']">
            {appointmentsList.length}
          </p>
        </div>
      </div>

      {/* Simple Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1f242e] pb-3">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-white text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Agendamentos</span>
        </button>

        <button
          onClick={() => setActiveTab('blocks')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'blocks'
              ? 'bg-white text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Ban className="w-3.5 h-3.5" />
          <span>Bloquear Horário</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-white text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Configurações</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS LIST */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          
          {/* Subfilters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[#10131a] p-1 rounded-lg border border-[#1f242e]">
              <button
                onClick={() => setAppointmentFilter('today')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  appointmentFilter === 'today'
                    ? 'bg-white text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hoje ({todayCount})
              </button>
              <button
                onClick={() => setAppointmentFilter('upcoming')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  appointmentFilter === 'upcoming'
                    ? 'bg-white text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Próximos ({upcomingCount})
              </button>
              <button
                onClick={() => setAppointmentFilter('all')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  appointmentFilter === 'all'
                    ? 'bg-white text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({appointmentsList.length})
              </button>
            </div>

            <button
              onClick={loadData}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
              title="Atualizar lista"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>

          {/* List Cards */}
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center rounded-xl barber-card text-slate-400 text-xs">
              Nenhum agendamento para este filtro.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredAppointments.map((apt) => {
                const cleanPhone = (apt.clientPhone || '').replace(/\D/g, '');
                const isConfirmed = apt.status === 'confirmed';
                const isCompleted = apt.status === 'completed';
                const isCancelled = apt.status === 'cancelled';

                return (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl barber-card flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                  >
                    {/* Time & Client info */}
                    <div className="flex items-start gap-3">
                      <div className="px-3 py-2 rounded-lg bg-[#1a202c] border border-[#2d3748] text-center shrink-0">
                        <span className="text-base font-bold text-white block">
                          {apt.time}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {apt.date.split('-').reverse().join('/')}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{apt.clientName}</h4>
                          <span
                            className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                              isConfirmed
                                ? 'bg-blue-500/20 text-blue-400'
                                : isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {isConfirmed ? 'Agendado' : isCompleted ? 'Atendido' : 'Cancelado'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {apt.clientPhone}
                          </span>
                          {apt.serviceName && (
                            <>
                              <span>•</span>
                              <span>{apt.serviceName}</span>
                            </>
                          )}
                        </div>

                        {apt.clientNotes && (
                          <p className="text-[11px] text-slate-400 italic">
                            "{apt.clientNotes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      {/* WhatsApp direct talk */}
                      <a
                        href={`https://api.whatsapp.com/send?phone=${cleanPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Concluir */}
                      {!isCompleted && !isCancelled && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'completed')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 border border-blue-500/30 cursor-pointer"
                          title="Marcar como atendido"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Atendido</span>
                        </button>
                      )}

                      {/* Cancelar */}
                      {!isCancelled && !isCompleted && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'cancelled')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-600/30 text-amber-400 text-xs transition cursor-pointer"
                          title="Cancelar agendamento"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Excluir */}
                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: BLOCK SLOTS */}
      {activeTab === 'blocks' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-xl barber-card space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-amber-400" />
              <span>Bloquear Horário ou Folga</span>
            </h3>
            <p className="text-xs text-slate-400">
              Bloqueie horários se precisar sair para médico, compromisso particular ou folga.
            </p>

            <form onSubmit={handleAddBlock} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Data *</label>
                <input
                  type="date"
                  required
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg barber-input text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Horário</label>
                <input
                  type="time"
                  disabled={blockAllDay}
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg barber-input text-xs disabled:opacity-30"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Motivo</label>
                <input
                  type="text"
                  placeholder="Ex: Médico, Compromisso"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg barber-input text-xs"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allDayCheck"
                    checked={blockAllDay}
                    onChange={(e) => setBlockAllDay(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-white"
                  />
                  <label htmlFor="allDayCheck" className="text-xs text-slate-300 cursor-pointer">
                    Dia Inteiro
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-white text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Confirmar Bloqueio
                </button>
              </div>
            </form>
          </div>

          {/* Active Blocks */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bloqueios Cadastrados ({data?.blockedSlots?.length || 0})
            </h4>

            {(!data?.blockedSlots || data.blockedSlots.length === 0) ? (
              <p className="text-xs text-slate-500">Nenhum horário bloqueado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {data.blockedSlots.map((b) => (
                  <div key={b.id} className="p-3 rounded-lg barber-card flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-white">
                        {b.date.split('-').reverse().join('/')} {b.allDay ? '(Dia Inteiro)' : `às ${b.time}`}
                      </p>
                      <p className="text-[10px] text-slate-400">{b.reason || 'Bloqueado'}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBlock(b.id)}
                      className="p-1 rounded text-red-400 hover:bg-red-600/20 transition cursor-pointer"
                      title="Remover Bloqueio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS & PASSWORD */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <form onSubmit={handleSaveSettings} className="p-4 sm:p-5 rounded-xl barber-card space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Configurações do Barbeiro</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  WhatsApp para Receber Agendamentos *
                </label>
                <input
                  type="text"
                  required
                  placeholder="5573981164949"
                  value={settingsForm.whatsapp || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg barber-input text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">
                  Nome do Barbeiro
                </label>
                <input
                  type="text"
                  value={settingsForm.barberName || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, barberName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg barber-input text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-white text-slate-950 font-bold text-xs cursor-pointer shadow"
              >
                Salvar Configurações
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="p-4 sm:p-5 rounded-xl barber-card space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Alterar Senha de Acesso</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Senha Atual *</label>
                <input
                  type="password"
                  required
                  placeholder="Senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg barber-input text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Nova Senha *</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 4 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg barber-input text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-white text-slate-950 font-bold text-xs cursor-pointer"
              >
                Atualizar Senha
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
