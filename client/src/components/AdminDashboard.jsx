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
      <div className="p-3.5 sm:p-5 rounded-2xl barber-card space-y-3">
        
        {/* Row 1: Barber Info & Logout */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img src="/logo.png" alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-['Outfit'] leading-tight">
                Painel do Ed Barber
              </h2>
              <p className="text-[11px] text-slate-400">
                WhatsApp: (73) 98116-4949
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sair do Painel"
            className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>

        {/* Row 2: Status Banner with 2 equal-width buttons */}
        <div className="bg-[#0d1015] p-2.5 rounded-xl border border-[#232834] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Status de Atendimento:</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {isOnline ? '● Atendendo' : '○ Pausado'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => handleToggleStatus('online')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isOnline
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Atendendo</span>
            </button>

            <button
              onClick={() => handleToggleStatus('offline')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                !isOnline
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>Pausar</span>
            </button>
          </div>
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
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="p-2.5 sm:p-4 rounded-xl barber-card text-center space-y-0.5">
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">Hoje</p>
          <p className="text-lg sm:text-2xl font-black text-white font-['Outfit']">
            {todayCount}
          </p>
        </div>

        <div className="p-2.5 sm:p-4 rounded-xl barber-card text-center space-y-0.5">
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">Próximos</p>
          <p className="text-lg sm:text-2xl font-black text-slate-300 font-['Outfit']">
            {upcomingCount}
          </p>
        </div>

        <div className="p-2.5 sm:p-4 rounded-xl barber-card text-center space-y-0.5">
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">Total</p>
          <p className="text-lg sm:text-2xl font-black text-slate-300 font-['Outfit']">
            {appointmentsList.length}
          </p>
        </div>
      </div>

      {/* Simple Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#1f242e] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
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
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
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
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
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
          
          {/* Subfilters & Refresh */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="grid grid-cols-3 gap-1 bg-[#10131a] p-1 rounded-lg border border-[#1f242e] w-full sm:w-auto">
              <button
                onClick={() => setAppointmentFilter('today')}
                className={`px-2 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition cursor-pointer text-center ${
                  appointmentFilter === 'today'
                    ? 'bg-white text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hoje ({todayCount})
              </button>
              <button
                onClick={() => setAppointmentFilter('upcoming')}
                className={`px-2 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition cursor-pointer text-center ${
                  appointmentFilter === 'upcoming'
                    ? 'bg-white text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Próximos ({upcomingCount})
              </button>
              <button
                onClick={() => setAppointmentFilter('all')}
                className={`px-2 py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition cursor-pointer text-center ${
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
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#10131a] border border-[#1f242e] text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5 text-xs w-full sm:w-auto shrink-0"
              title="Atualizar lista"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Atualizar</span>
            </button>
          </div>

          {/* List Cards */}
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center rounded-xl barber-card text-slate-400 text-xs">
              Nenhum agendamento para este filtro.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((apt) => {
                const cleanPhone = (apt.clientPhone || '').replace(/\D/g, '');
                const isConfirmed = apt.status === 'confirmed';
                const isCompleted = apt.status === 'completed';
                const isCancelled = apt.status === 'cancelled';

                return (
                  <div
                    key={apt.id}
                    className="p-3.5 sm:p-4 rounded-xl barber-card space-y-3 border border-[#232a3b]/60 hover:border-[#384259] transition"
                  >
                    {/* Header: Time, Name, Status, and Action Icons */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Time & Date Badge */}
                        <div className="px-2.5 py-1 rounded-lg bg-[#141824] border border-[#262f44] text-center shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-white block leading-tight">
                            {apt.time}
                          </span>
                          <span className="text-[9px] text-slate-400 block leading-tight mt-0.5">
                            {apt.date.split('-').reverse().join('/')}
                          </span>
                        </div>

                        {/* Client Name & Status Badge */}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate leading-snug">
                            {apt.clientName}
                          </h4>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold leading-none mt-0.5 ${
                              isConfirmed
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {isConfirmed ? 'Agendado' : isCompleted ? 'Atendido' : 'Cancelado'}
                          </span>
                        </div>
                      </div>

                      {/* Top-Right Secondary Actions: Cancel / Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        {!isCancelled && !isCompleted && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'cancelled')}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs transition cursor-pointer active:scale-95 border border-amber-500/20"
                            title="Cancelar agendamento"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAppointment(apt.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer active:scale-95 border border-red-500/20"
                          title="Excluir agendamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Info: Phone & Procedure */}
                    <div className="p-2.5 rounded-lg bg-[#0c0e14] border border-[#1b212e] space-y-1.5 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{apt.clientPhone}</span>
                        </span>
                        {apt.serviceName && (
                          <span className="px-2 py-0.5 rounded-md bg-[#161c29] border border-[#2b354c] text-white font-semibold text-[11px] truncate">
                            {apt.serviceName}
                          </span>
                        )}
                      </div>

                      {apt.clientNotes && (
                        <p className="text-[11px] text-slate-400 italic pt-1 border-t border-[#181d28]">
                          "{apt.clientNotes}"
                        </p>
                      )}
                    </div>

                    {/* Bottom Primary Actions: 2 Equal Columns Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      {/* WhatsApp direct talk */}
                      <a
                        href={`https://api.whatsapp.com/send?phone=${cleanPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-emerald-500/30 cursor-pointer active:scale-95 text-center"
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Concluir / Atendido */}
                      {!isCompleted && !isCancelled ? (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'completed')}
                          className="w-full py-2 px-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-blue-500/30 cursor-pointer active:scale-95 text-center"
                          title="Marcar como atendido"
                        >
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>Atendido</span>
                        </button>
                      ) : (
                        <div className="w-full py-2 px-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-500 text-xs font-medium flex items-center justify-center text-center">
                          {isCompleted ? '✓ Atendido' : '✕ Cancelado'}
                        </div>
                      )}
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
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-white text-slate-950 font-bold text-xs cursor-pointer shadow"
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
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-200 hover:bg-white text-slate-950 font-bold text-xs cursor-pointer"
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
