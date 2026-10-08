import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Phone, 
  Calendar, 
  Trash2, 
  Plus, 
  Power, 
  Settings, 
  Scissors, 
  Lock, 
  DollarSign, 
  MessageSquare, 
  AlertTriangle,
  LogOut,
  RefreshCw,
  Ban,
  Check,
  ChevronRight
} from 'lucide-react';
import { 
  getAdminDashboard, 
  updateBarberStatus, 
  updateAdminSettings, 
  changeAdminPassword, 
  saveService, 
  deleteService, 
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

  // Active Tab
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'services' | 'blocks' | 'settings'
  const [appointmentFilter, setAppointmentFilter] = useState('today'); // 'today' | 'upcoming' | 'all'

  // Edit/Add service modal/form
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationMinutes: 30,
    badge: '',
    popular: false
  });

  // Block slot form
  const [blockDate, setBlockDate] = useState(new Date().toISOString().split('T')[0]);
  const [blockTime, setBlockTime] = useState('14:00');
  const [blockAllDay, setBlockAllDay] = useState(false);
  const [blockReason, setBlockReason] = useState('Compromisso particular');

  // Settings form
  const [settingsForm, setSettingsForm] = useState({});

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status message
  const [customClosedMessage, setCustomClosedMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await getAdminDashboard(token);
      setData(res);
      setSettingsForm(res.settings);
      setCustomClosedMessage(res.settings.closedMessage || '');
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

  // Flash message helper
  const flashSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Toggle Barber Status ("Atendendo" / "Não está atendendo")
  const handleToggleStatus = async (newStatus) => {
    try {
      setErrorMsg('');
      const res = await updateBarberStatus(token, {
        status: newStatus,
        closedMessage: customClosedMessage
      });
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

  // Service actions
  const handleOpenServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceFormData({
        name: service.name,
        description: service.description || '',
        price: service.price,
        durationMinutes: service.durationMinutes,
        badge: service.badge || '',
        popular: Boolean(service.popular)
      });
    } else {
      setEditingService(null);
      setServiceFormData({
        name: '',
        description: '',
        price: '',
        durationMinutes: 30,
        badge: '',
        popular: false
      });
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      await saveService(token, serviceFormData, editingService ? editingService.id : null);
      flashSuccess(editingService ? 'Serviço atualizado!' : 'Novo serviço adicionado!');
      setEditingService(null);
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao salvar serviço.');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Deseja realmente excluir este serviço da tabela?')) return;
    try {
      await deleteService(token, id);
      flashSuccess('Serviço removido.');
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao excluir serviço.');
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
  const filteredAppointments = (data?.appointments || []).filter((apt) => {
    if (appointmentFilter === 'today') {
      return apt.date === todayStr;
    }
    if (appointmentFilter === 'upcoming') {
      return apt.date >= todayStr;
    }
    return true;
  });

  if (loading && !data) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-red-500 font-bold">
          <div className="w-6 h-6 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Carregando painel do barbeiro...</span>
        </div>
      </div>
    );
  }

  const isOnline = data?.settings?.status === 'online';

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      
      {/* Top Bar with Status and Logout */}
      <div className="p-6 rounded-3xl glass-card flex flex-col md:flex-row items-center justify-between gap-6 border-white/10">
        
        {/* Barber Info */}
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain filter drop-shadow" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white font-['Outfit']">
                Painel Administrativo do Ed
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                Desde 1999
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Gerencie seus agendamentos, defina sua disponibilidade e personalize seu atendimento.
            </p>
          </div>
        </div>

        {/* Big Barber Status Switch */}
        <div className="flex items-center gap-4 bg-black/40 p-2.5 rounded-2xl border border-white/10">
          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-medium">Status de Atendimento:</p>
            <p className={`text-xs font-bold ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
              {isOnline ? '● Atendendo Agora' : '○ Pausado / Fechado'}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => handleToggleStatus('online')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isOnline
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Atendendo</span>
            </button>

            <button
              onClick={() => handleToggleStatus('offline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                !isOnline
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
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
            className="p-2 rounded-xl glass-card hover:bg-red-600/20 hover:text-red-400 text-slate-400 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card space-y-1">
          <p className="text-xs text-slate-400 font-medium">Agendamentos Hoje</p>
          <p className="text-2xl font-black text-white font-['Outfit']">
            {data?.metrics?.todayCount || 0}
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <p className="text-xs text-slate-400 font-medium">Faturamento Estimado Hoje</p>
          <p className="text-2xl font-black text-emerald-400 font-['Outfit']">
            R$ {Number(data?.metrics?.todayRevenue || 0).toFixed(2).replace('.', ',')}
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <p className="text-xs text-slate-400 font-medium">Confirmados no Total</p>
          <p className="text-2xl font-black text-blue-400 font-['Outfit']">
            {data?.metrics?.confirmedCount || 0}
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <p className="text-xs text-slate-400 font-medium">Histórico Total</p>
          <p className="text-2xl font-black text-slate-300 font-['Outfit']">
            {data?.metrics?.totalAppointments || 0}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-4">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-white text-slate-950 shadow-md'
              : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Agendamentos ({data?.appointments?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'services'
              ? 'bg-white text-slate-950 shadow-md'
              : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Serviços ({data?.services?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('blocks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'blocks'
              ? 'bg-white text-slate-950 shadow-md'
              : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          <Ban className="w-3.5 h-3.5" />
          <span>Bloqueios & Folgas ({data?.blockedSlots?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-white text-slate-950 shadow-md'
              : 'glass-card text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Configurações & WhatsApp</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {/* Subfilter & Refresh */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAppointmentFilter('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  appointmentFilter === 'today'
                    ? 'bg-white/20 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hoje ({data?.appointments?.filter(a => a.date === todayStr).length || 0})
              </button>
              <button
                onClick={() => setAppointmentFilter('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  appointmentFilter === 'upcoming'
                    ? 'bg-white/20 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Próximos
              </button>
              <button
                onClick={() => setAppointmentFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  appointmentFilter === 'all'
                    ? 'bg-white/20 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
            </div>

            <button
              onClick={loadData}
              className="px-3 py-1.5 rounded-lg glass-card text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Atualizar Lista</span>
            </button>
          </div>

          {/* Appointments Table / Cards */}
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-card text-slate-400 text-sm">
              Nenhum agendamento encontrado para este filtro.
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
                    className="p-5 rounded-2xl glass-card hover:border-white/20 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Time & Client info */}
                    <div className="flex items-start gap-4">
                      <div className="px-3.5 py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-center shrink-0">
                        <span className="text-base font-black text-red-400 font-['Outfit'] block">
                          {apt.time}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {apt.date.split('-').reverse().join('/')}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{apt.clientName}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isConfirmed
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {isConfirmed ? 'Confirmado' : isCompleted ? 'Concluído' : 'Cancelado'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="text-white font-medium">{apt.serviceName}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">
                            R$ {Number(apt.price).toFixed(2).replace('.', ',')}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            {apt.clientPhone}
                          </span>
                        </div>

                        {apt.clientNotes && (
                          <p className="text-[11px] text-amber-300/80 italic">
                            Obs: "{apt.clientNotes}"
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
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-emerald-500/30 cursor-pointer"
                        title="Abrir WhatsApp do Cliente"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Conversar</span>
                      </a>

                      {/* Complete */}
                      {!isCompleted && !isCancelled && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'completed')}
                          className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-blue-500/30 cursor-pointer"
                          title="Concluir Atendimento"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Concluir</span>
                        </button>
                      )}

                      {/* Cancel */}
                      {!isCancelled && !isCompleted && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'cancelled')}
                          className="p-2 rounded-xl glass-card text-amber-400 hover:bg-amber-600/20 text-xs transition cursor-pointer"
                          title="Cancelar Agendamento"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="p-2 rounded-xl glass-card text-red-400 hover:bg-red-600/20 text-xs transition cursor-pointer"
                        title="Excluir do Histórico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Catálogo de Serviços da Barbearia</h3>
            <button
              onClick={() => handleOpenServiceModal(null)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Novo Serviço</span>
            </button>
          </div>

          {/* Service modal form if active */}
          {(editingService !== null || serviceFormData.name !== '') && (
            <form onSubmit={handleSaveService} className="p-6 rounded-3xl glass-card border-red-500/30 space-y-4">
              <h4 className="text-sm font-bold text-white">
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Nome do Serviço *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Barba Terapia"
                    value={serviceFormData.name}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="35"
                    value={serviceFormData.price}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Duração (Minutos) *</label>
                  <input
                    type="number"
                    step="5"
                    required
                    placeholder="30"
                    value={serviceFormData.durationMinutes}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Acabamento na lâmina e toalha quente com óleos essenciais"
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Destaque / Badge (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: Mais Pedido, Exclusivo"
                    value={serviceFormData.badge}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="popularCheck"
                    checked={serviceFormData.popular}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, popular: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <label htmlFor="popularCheck" className="text-xs text-slate-300 font-medium cursor-pointer">
                    Destacar como Popular na Página
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setEditingService(null); setServiceFormData({ name: '', description: '', price: '', durationMinutes: 30, badge: '', popular: false }); }}
                  className="px-4 py-2 rounded-xl glass-card text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          )}

          {/* List Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.services?.map((srv) => (
              <div key={srv.id} className="p-5 rounded-2xl glass-card flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{srv.name}</h4>
                    {srv.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                        {srv.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{srv.description}</p>
                  <p className="text-xs text-slate-300 font-bold pt-1">
                    R$ {Number(srv.price).toFixed(2).replace('.', ',')} • {srv.durationMinutes} minutos
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenServiceModal(srv)}
                    className="p-2 rounded-xl glass-card hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
                    title="Editar"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    className="p-2 rounded-xl glass-card hover:bg-red-600/20 text-xs text-red-400 cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: BLOCKS */}
      {activeTab === 'blocks' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Ban className="w-4 h-4 text-red-400" />
              <span>Bloquear Horário Específico ou Dia Inteiro</span>
            </h3>
            <p className="text-xs text-slate-400">
              Use esta ferramenta para bloquear horários quando precisar sair para almoçar, compromisso particular ou tirar um dia de folga.
            </p>

            <form onSubmit={handleAddBlock} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Data *</label>
                <input
                  type="date"
                  required
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Horário (se não for dia inteiro)</label>
                <input
                  type="time"
                  disabled={blockAllDay}
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm disabled:opacity-30"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Motivo</label>
                <input
                  type="text"
                  placeholder="Ex: Almoço, Médico, Folga"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allDayCheck"
                    checked={blockAllDay}
                    onChange={(e) => setBlockAllDay(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <label htmlFor="allDayCheck" className="text-xs text-slate-300 cursor-pointer font-medium">
                    Bloquear o Dia Inteiro
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
                >
                  Confirmar Bloqueio
                </button>
              </div>
            </form>
          </div>

          {/* List Blocks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bloqueios Ativos ({data?.blockedSlots?.length || 0})
            </h4>

            {(!data?.blockedSlots || data.blockedSlots.length === 0) ? (
              <p className="text-xs text-slate-500">Nenhum horário bloqueado no momento.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.blockedSlots.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl glass-card flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-white">
                        {b.date.split('-').reverse().join('/')} {b.allDay ? '(Dia Inteiro)' : `às ${b.time}`}
                      </p>
                      <p className="text-[11px] text-slate-400">{b.reason || 'Bloqueado'}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBlock(b.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-600/20 transition cursor-pointer"
                      title="Remover Bloqueio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl glass-card space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-red-400" />
              <span>Configurações Gerais & WhatsApp</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  WhatsApp do Barbeiro (com DDD) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="5511999999999"
                  value={settingsForm.whatsapp || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
                <span className="text-[10px] text-slate-500">
                  Para onde todos os agendamentos dos clientes serão enviados!
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Nome do Barbeiro / Atendente
                </label>
                <input
                  type="text"
                  value={settingsForm.barberName || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, barberName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Horário de Abertura
                </label>
                <input
                  type="time"
                  value={settingsForm.openingHour || '09:00'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, openingHour: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Horário de Fechamento
                </label>
                <input
                  type="time"
                  value={settingsForm.closingHour || '19:30'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, closingHour: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Início do Intervalo de Almoço
                </label>
                <input
                  type="time"
                  value={settingsForm.lunchStart || '12:00'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, lunchStart: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Fim do Intervalo de Almoço
                </label>
                <input
                  type="time"
                  value={settingsForm.lunchEnd || '13:00'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, lunchEnd: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Intervalo Padrão entre Clientes (Minutos)
                </label>
                <select
                  value={settingsForm.slotDurationMinutes || 30}
                  onChange={(e) => setSettingsForm({ ...settingsForm, slotDurationMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                >
                  <option value={20} className="bg-slate-900 text-white">20 minutos</option>
                  <option value={30} className="bg-slate-900 text-white">30 minutos</option>
                  <option value={40} className="bg-slate-900 text-white">40 minutos</option>
                  <option value={45} className="bg-slate-900 text-white">45 minutos</option>
                  <option value={60} className="bg-slate-900 text-white">60 minutos (1 hora)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Endereço da Barbearia
                </label>
                <input
                  type="text"
                  value={settingsForm.address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Mensagem quando estiver com status "Não está atendendo"
              </label>
              <textarea
                rows={2}
                value={settingsForm.closedMessage || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, closedMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                placeholder="Ex: No momento estamos em pausa para almoço. Retornaremos às 13:30."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-red-600/30"
              >
                Salvar Configurações
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Alterar Senha do Barbeiro</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Senha Atual *</label>
                <input
                  type="password"
                  required
                  placeholder="Senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Nova Senha *</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 4 dígitos"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
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
