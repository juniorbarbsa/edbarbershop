import React, { useState, useEffect } from 'react';
import { 
  X,
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  ArrowRight, 
  RotateCcw,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import { getAvailableSlots, createAppointment } from '../api';

export default function BookingModal({ 
  isOpen, 
  onClose, 
  settings, 
  services = [],
  onAppointmentCreated 
}) {
  const isOnline = settings?.status === 'online';

  const DEFAULT_PROCEDURES = [
    'Corte Clássico & Degradê',
    'Barba Terapia com Toalha Quente',
    'Combo VIP: Corte + Barba',
    'Acabamento & Pezinho',
    'Sobrancelha na Navalha',
    'Pigmentação de Barba ou Cabelo',
    'Platinado / Nevou',
    'Outro Procedimento'
  ];

  const procedureOptions = services && services.length > 0
    ? [...services.map(s => s.name), 'Outro Procedimento']
    : DEFAULT_PROCEDURES;

  const today = new Date();
  const formatIsoDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayIso = formatIsoDate(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowIso = formatIsoDate(tomorrow);

  const afterTomorrow = new Date(today);
  afterTomorrow.setDate(today.getDate() + 2);
  const afterTomorrowIso = formatIsoDate(afterTomorrow);

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState('Corte Clássico & Degradê');
  const [customProcedure, setCustomProcedure] = useState('');
  const [serviceNote, setServiceNote] = useState('');
  
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsData, setSlotsData] = useState({ slots: [], isWorkDay: true, isBlocked: false });
  const [errorMsg, setErrorMsg] = useState('');

  // Client form
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (!bookingSuccess) {
        setSelectedDate(todayIso);
      }
    }
  }, [isOpen]);

  // Phone mask
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    
    if (val.length > 10) {
      val = val.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (val.length > 6) {
      val = val.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (val.length > 2) {
      val = val.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }
    setClientPhone(val);
  };

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate || !isOpen) return;
    
    let isMounted = true;
    setSlotsLoading(true);
    setErrorMsg('');
    setSelectedTime(null);

    getAvailableSlots(selectedDate)
      .then((data) => {
        if (isMounted) {
          setSlotsData(data);
          setSlotsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorMsg(err.message || 'Erro ao carregar horários');
          setSlotsLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [selectedDate, isOpen]);

  if (!isOpen) return null;

  // Calendar calculations
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const currentYear = currentMonth.getFullYear();
  const currentMonthIdx = currentMonth.getMonth();
  const totalDays = getDaysInMonth(currentYear, currentMonthIdx);
  const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonthIdx);

  const prevMonth = () => {
    const prev = new Date(currentYear, currentMonthIdx - 1, 1);
    if (prev.getMonth() < today.getMonth() && prev.getFullYear() <= today.getFullYear()) return;
    setCurrentMonth(prev);
  };

  const nextMonth = () => {
    const next = new Date(currentYear, currentMonthIdx + 1, 1);
    setCurrentMonth(next);
  };

  const handleDateSelect = (dayNum) => {
    const selected = new Date(currentYear, currentMonthIdx, dayNum);
    const todayAtZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (selected < todayAtZero) return;
    setSelectedDate(formatIsoDate(selected));
    setSelectedTime(null);
  };

  const isDayPast = (dayNum) => {
    const d = new Date(currentYear, currentMonthIdx, dayNum);
    const todayAtZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayAtZero;
  };

  const isDaySelected = (dayNum) => {
    const target = formatIsoDate(new Date(currentYear, currentMonthIdx, dayNum));
    return target === selectedDate;
  };

  // Group slots by period
  const morningSlots = (slotsData.slots || []).filter(s => {
    const h = parseInt(s.time.split(':')[0], 10);
    return h < 13;
  });

  const afternoonSlots = (slotsData.slots || []).filter(s => {
    const h = parseInt(s.time.split(':')[0], 10);
    return h >= 14 && h < 18;
  });

  const eveningSlots = (slotsData.slots || []).filter(s => {
    const h = parseInt(s.time.split(':')[0], 10);
    return h >= 18;
  });

  const handleConfirmAppointment = async (e) => {
    e.preventDefault();
    if (!isOnline) {
      setErrorMsg('O barbeiro não está atendendo no momento.');
      return;
    }
    if (!selectedDate) {
      setErrorMsg('Por favor, selecione um dia.');
      return;
    }
    if (!selectedTime) {
      setErrorMsg('Por favor, selecione um horário disponível.');
      return;
    }
    if (!clientName.trim()) {
      setErrorMsg('Por favor, digite seu nome.');
      return;
    }
    if (!clientPhone.replace(/\D/g, '') || clientPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe seu WhatsApp com DDD.');
      return;
    }

    if (!selectedProcedure) {
      setErrorMsg('Por favor, selecione o procedimento que deseja realizar.');
      return;
    }

    const procedureFinal = selectedProcedure === 'Outro Procedimento'
      ? (customProcedure.trim() || 'Procedimento Personalizado')
      : selectedProcedure;

    try {
      setSubmitting(true);
      setErrorMsg('');

      const result = await createAppointment({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientNotes: serviceNote ? serviceNote.trim() : '',
        serviceName: procedureFinal,
        date: selectedDate,
        time: selectedTime
      });

      setBookingSuccess(result);
      if (onAppointmentCreated) onAppointmentCreated(result.appointment);

      if (result.whatsappRedirectUrl) {
        window.open(result.whatsappRedirectUrl, '_blank');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao realizar o agendamento.');
      // Atualiza os horários em tempo real para refletir a nova disponibilidade imediatamente
      getAvailableSlots(selectedDate)
        .then((data) => setSlotsData(data))
        .catch(() => {});
      setSelectedTime(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetBooking = () => {
    setBookingSuccess(null);
    setSelectedTime(null);
    setClientName('');
    setClientPhone('');
    setSelectedProcedure(procedureOptions[0] || 'Corte Clássico & Degradê');
    setCustomProcedure('');
    setServiceNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm overflow-hidden">
      
      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-xl max-h-[93vh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl barber-card border border-[#2b3342] shadow-2xl animate-fade-in text-slate-100 overflow-hidden">
        
        {/* Sticky Header with Mobile Handle & Close */}
        <div className="shrink-0 bg-[#0e1117] border-b border-[#1f242e] px-4 sm:px-6 pt-3 pb-3 sm:py-4 flex items-center justify-between z-10">
          <div className="pr-3">
            {/* Mobile swipe/drag bar indicator */}
            <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto mb-2 sm:hidden"></div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit'] leading-tight">
                Agendar Horário • Ed Barber Shop
              </h2>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
              Walter Hollenwerger, 119 - Centro • 09h às 21h todos os dias
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#181c26] sm:bg-white/[0.05] hover:bg-white/[0.1] transition cursor-pointer shrink-0"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain safe-bottom">

          {/* Offline Alert */}
          {!isOnline && (
            <div className="p-4 rounded-xl barber-card border-amber-500/30 text-center space-y-2">
              <h3 className="text-sm font-bold text-amber-300">Agendamentos Pausados</h3>
              <p className="text-xs text-amber-200/80 max-w-md mx-auto">
                {settings?.closedMessage || "O barbeiro está em pausa no momento. Você ainda pode chamar no WhatsApp."}
              </p>
            </div>
          )}

        {/* Success Modal / Clean Ticket View */}
        {bookingSuccess ? (
          <div className="p-4 sm:p-6 text-center space-y-5 animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Horário Reservado
              </span>
              <h3 className="text-xl font-bold text-white font-['Outfit'] mt-1">
                Agendamento Concluído!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Seu horário foi salvo na agenda do Ed.
              </p>
            </div>

            {/* Clean Ticket Card */}
            <div className="p-4 rounded-xl bg-[#0d1015] border border-[#232834] text-left space-y-2 text-xs text-slate-300">
              <div className="flex justify-between pb-1.5 border-b border-[#1f242e]">
                <span className="text-slate-400">Cliente:</span>
                <span className="text-white font-semibold">{bookingSuccess.appointment.clientName}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-[#1f242e]">
                <span className="text-slate-400">Data & Horário:</span>
                <span className="text-emerald-400 font-bold">
                  {bookingSuccess.appointment.date.split('-').reverse().join('/')} às {bookingSuccess.appointment.time}
                </span>
              </div>
              {bookingSuccess.appointment.serviceName && (
                <div className="flex justify-between pb-1.5 border-b border-[#1f242e]">
                  <span className="text-slate-400">Procedimento:</span>
                  <span className="text-emerald-400 font-semibold">{bookingSuccess.appointment.serviceName}</span>
                </div>
              )}
              {bookingSuccess.appointment.clientNotes && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Observação:</span>
                  <span className="text-slate-300">{bookingSuccess.appointment.clientNotes}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <a
                href={bookingSuccess.whatsappRedirectUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir WhatsApp do Ed para Confirmar</span>
              </a>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleResetBooking}
                  className="w-1/2 py-2.5 rounded-lg bg-[#181c26] text-xs text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Novo Horário</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-1/2 py-2.5 rounded-lg bg-white text-slate-950 font-bold text-xs transition flex items-center justify-center cursor-pointer"
                >
                  <span>Concluir</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Intuitive 3-Step Wizard Inside Modal */
          <div className="space-y-5">
            
            {/* ETAPA 1: ESCOLHA O DIA */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0e1117] border border-[#1f242e] space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#1f242e]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-slate-950 text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Escolha o Dia
                  </h3>
                </div>
                <span className="text-xs font-bold text-white">
                  {selectedDate.split('-').reverse().join('/')}
                </span>
              </div>

              {/* Quick Day Shortcuts */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => { setSelectedDate(todayIso); setSelectedTime(null); }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center cursor-pointer active:scale-95 ${
                    selectedDate === todayIso
                      ? 'bg-white text-slate-950 shadow'
                      : 'bg-[#181c26] text-slate-300 hover:bg-[#232834]'
                  }`}
                >
                  Hoje
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedDate(tomorrowIso); setSelectedTime(null); }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center cursor-pointer active:scale-95 ${
                    selectedDate === tomorrowIso
                      ? 'bg-white text-slate-950 shadow'
                      : 'bg-[#181c26] text-slate-300 hover:bg-[#232834]'
                  }`}
                >
                  Amanhã
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedDate(afterTomorrowIso); setSelectedTime(null); }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center cursor-pointer active:scale-95 truncate ${
                    selectedDate === afterTomorrowIso
                      ? 'bg-white text-slate-950 shadow'
                      : 'bg-[#181c26] text-slate-300 hover:bg-[#232834]'
                  }`}
                >
                  Depois
                </button>
              </div>

              {/* Month Header & Days Grid */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2 text-xs text-slate-300">
                  <span className="font-semibold">
                    {monthNames[currentMonthIdx]} de {currentYear}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevMonth}
                      className="p-1.5 rounded-lg hover:bg-[#232834] text-slate-400 hover:text-white transition cursor-pointer active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-1.5 rounded-lg hover:bg-[#232834] text-slate-400 hover:text-white transition cursor-pointer active:scale-95"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {dayNames.map((d, i) => (
                    <div key={i} className="text-[10px] font-bold text-slate-500 py-1 uppercase">
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-9 sm:h-8"></div>
                  ))}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const dayNum = i + 1;
                    const isPast = isDayPast(dayNum);
                    const selected = isDaySelected(dayNum);

                    return (
                      <button
                        key={`day-${dayNum}`}
                        disabled={isPast}
                        onClick={() => handleDateSelect(dayNum)}
                        className={`h-9 sm:h-8 rounded-lg text-xs font-semibold transition flex items-center justify-center cursor-pointer active:scale-95 ${
                          selected
                            ? 'bg-white text-slate-950 font-bold shadow'
                            : isPast
                            ? 'opacity-20 text-slate-600 cursor-not-allowed'
                            : 'text-slate-300 hover:bg-[#232834] hover:text-white'
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ETAPA 2: ESCOLHA O HORÁRIO */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0e1117] border border-[#1f242e] space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#1f242e]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-slate-950 text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Escolha o Horário
                  </h3>
                </div>
                {selectedTime ? (
                  <span className="text-xs font-bold text-emerald-400">
                    Selecionado: {selectedTime}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Toque no horário
                  </span>
                )}
              </div>

              {slotsLoading ? (
                <div className="py-6 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Consultando horários...</span>
                </div>
              ) : slotsData.isBlocked ? (
                <div className="py-4 text-center text-slate-400 text-xs bg-[#0f1217] rounded-lg">
                  Esta data está bloqueada para agendamentos.
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Manhã */}
                  {morningSlots.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                        <Sun className="w-3 h-3 text-amber-400" />
                        <span>Manhã</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                        {morningSlots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              title={!slot.available ? (slot.reason ? `${slot.time} - ${slot.reason}` : `${slot.time} - Indisponível`) : `Agendar ${slot.time}`}
                              className={`py-1.5 px-1 rounded-md text-xs font-semibold transition flex flex-col items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-slate-950 font-bold shadow'
                                  : !slot.available
                                  ? 'bg-[#10131a] text-slate-600 cursor-not-allowed opacity-35 line-through'
                                  : 'bg-[#181c26] text-slate-200 hover:bg-[#232834]'
                              }`}
                            >
                              <span>{slot.time}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tarde */}
                  {afternoonSlots.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                        <Sunset className="w-3 h-3 text-orange-400" />
                        <span>Tarde</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                        {afternoonSlots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              title={!slot.available ? (slot.reason ? `${slot.time} - ${slot.reason}` : `${slot.time} - Indisponível`) : `Agendar ${slot.time}`}
                              className={`py-1.5 px-1 rounded-md text-xs font-semibold transition flex flex-col items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-slate-950 font-bold shadow'
                                  : !slot.available
                                  ? 'bg-[#10131a] text-slate-600 cursor-not-allowed opacity-35 line-through'
                                  : 'bg-[#181c26] text-slate-200 hover:bg-[#232834]'
                              }`}
                            >
                              <span>{slot.time}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Noite */}
                  {eveningSlots.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400">
                        <Moon className="w-3 h-3 text-blue-400" />
                        <span>Noite</span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                        {eveningSlots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              title={!slot.available ? (slot.reason ? `${slot.time} - ${slot.reason}` : `${slot.time} - Indisponível`) : `Agendar ${slot.time}`}
                              className={`py-1.5 px-1 rounded-md text-xs font-semibold transition flex flex-col items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-slate-950 font-bold shadow'
                                  : !slot.available
                                  ? 'bg-[#10131a] text-slate-600 cursor-not-allowed opacity-35 line-through'
                                  : 'bg-[#181c26] text-slate-200 hover:bg-[#232834]'
                              }`}
                            >
                              <span>{slot.time}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Reassurance anti-conflict notice */}
                  <div className="pt-2 border-t border-[#1a1e28] flex items-center gap-2 text-[11px] text-emerald-400/90">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>Horário individual e pontual: sem filas, sem sobreposição e sem cliente esperando.</span>
                  </div>
                </div>
              )}
            </div>

            {/* ETAPA 3: PROCEDIMENTO & SEUS DADOS */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0e1117] border border-[#1f242e] space-y-3.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#1f242e]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-slate-950 text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Procedimento & Seus Dados
                  </h3>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleConfirmAppointment} className="space-y-3.5">
                {/* Seleção do Procedimento */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-200 block mb-1.5 flex items-center justify-between">
                    <span>Escolha o Procedimento *</span>
                    <span className="text-[10px] text-emerald-400 font-bold truncate max-w-[170px]">
                      {selectedProcedure === 'Outro Procedimento' && customProcedure ? customProcedure : selectedProcedure}
                    </span>
                  </label>

                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {procedureOptions.map((proc) => {
                      const isSelected = selectedProcedure === proc;
                      return (
                        <button
                          key={proc}
                          type="button"
                          onClick={() => setSelectedProcedure(proc)}
                          className={`p-2.5 rounded-xl text-left text-xs font-medium transition cursor-pointer flex items-center justify-between border ${
                            isSelected
                              ? 'bg-white text-slate-950 font-bold border-white shadow-md'
                              : 'bg-[#181c26] text-slate-300 border-[#232834] hover:bg-[#202532] hover:text-white'
                          }`}
                        >
                          <span className="truncate pr-1">{proc}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {selectedProcedure === 'Outro Procedimento' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        required
                        placeholder="Digite o procedimento desejado..."
                        value={customProcedure}
                        onChange={(e) => setCustomProcedure(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl barber-input text-xs placeholder:text-slate-500"
                      />
                    </div>
                  )}
                </div>

                {/* Dados do Cliente */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl barber-input text-base sm:text-xs placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      placeholder="(73) 98116-4949"
                      value={clientPhone}
                      onChange={handlePhoneChange}
                      className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl barber-input text-base sm:text-xs placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Observação Adicional Opcional */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Observação Adicional (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: disfarçado na zero, barba desenhada..."
                    value={serviceNote}
                    onChange={(e) => setServiceNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl barber-input text-xs placeholder:text-slate-500"
                  />
                </div>

                {/* Resumo do Agendamento */}
                <div className="p-3 rounded-xl bg-[#14171f] border border-[#232834] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Data & Horário:</span>
                    <strong className="text-white">
                      {selectedDate.split('-').reverse().join('/')} às {selectedTime || '--:--'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Procedimento:</span>
                    <strong className="text-emerald-400 font-semibold truncate max-w-[200px]">
                      {selectedProcedure === 'Outro Procedimento' && customProcedure ? customProcedure : selectedProcedure}
                    </strong>
                  </div>
                </div>

                {/* Botão de Finalização */}
                <button
                  type="submit"
                  disabled={submitting || !isOnline || !selectedTime}
                  className={`w-full py-3.5 sm:py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-[0.98] ${
                    !selectedTime
                      ? 'bg-[#181c26] text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                  }`}
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirmar & Abrir no WhatsApp do Ed</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        )}

        </div>

      </div>
    </div>
  );
}
