import React, { useState, useEffect } from 'react';
import { 
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

export default function BookingSection({ 
  settings, 
  onAppointmentCreated
}) {
  const isOnline = settings?.status === 'online';

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

  // Fetch slots
  useEffect(() => {
    if (!selectedDate) return;
    
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
  }, [selectedDate]);

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
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetBooking = () => {
    setBookingSuccess(null);
    setSelectedTime(null);
    setClientName('');
    setClientPhone('');
    setSelectedProcedure('Corte Clássico & Degradê');
    setCustomProcedure('');
    setServiceNote('');
  };

  return (
    <section id="agendar" className="py-12 sm:py-16 border-b border-[#1f242e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-lg mx-auto mb-10 space-y-2">
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            Agenda Online
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit']">
            Agende Seu Horário
          </h2>
          <p className="text-xs text-slate-400">
            Escolha o dia, selecione o horário e envie direto para o WhatsApp do Ed.
          </p>
        </div>

        {/* Offline Alert */}
        {!isOnline && (
          <div className="mb-8 p-4 rounded-xl barber-card border-amber-500/30 text-center space-y-2">
            <h3 className="text-sm font-bold text-amber-300">Agendamentos Pausados</h3>
            <p className="text-xs text-amber-200/80 max-w-md mx-auto">
              {settings?.closedMessage || "O barbeiro está em pausa no momento. Você ainda pode chamar no WhatsApp."}
            </p>
          </div>
        )}

        {/* Success Modal / Clean Ticket View */}
        {bookingSuccess ? (
          <div className="max-w-md mx-auto p-6 sm:p-8 rounded-2xl barber-card text-center space-y-5 animate-fade-in shadow-xl">
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
                Seu horário foi salvo no sistema da barbearia.
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
              {bookingSuccess.appointment.clientNotes && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Procedimento:</span>
                  <span className="text-slate-200">{bookingSuccess.appointment.clientNotes}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <a
                href={bookingSuccess.whatsappRedirectUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir WhatsApp do Ed para Confirmar</span>
              </a>

              <button
                onClick={handleResetBooking}
                className="w-full py-2.5 rounded-lg text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Agendar outro horário</span>
              </button>
            </div>
          </div>
        ) : (
          /* Intuitive Step-by-Step Flow */
          <div className="space-y-6">
            
            {/* ETAPA 1: ESCOLHA O DIA */}
            <div className="p-5 sm:p-6 rounded-2xl barber-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f242e]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-slate-950 text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Escolha o Dia
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-300">
                  {selectedDate.split('-').reverse().join('/')}
                </span>
              </div>

              {/* Quick Day Shortcuts */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setSelectedDate(todayIso); setSelectedTime(null); }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
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
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
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
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedDate === afterTomorrowIso
                      ? 'bg-white text-slate-950 shadow'
                      : 'bg-[#181c26] text-slate-300 hover:bg-[#232834]'
                  }`}
                >
                  Depois de amanhã
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-300">
                  <span className="font-semibold">
                    {monthNames[currentMonthIdx]} de {currentYear}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevMonth}
                      className="p-1 rounded hover:bg-[#232834] text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-1 rounded hover:bg-[#232834] text-slate-400 hover:text-white transition cursor-pointer"
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
                    <div key={`empty-${i}`} className="h-8"></div>
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
                        className={`h-8 rounded-md text-xs font-semibold transition flex items-center justify-center cursor-pointer ${
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
            <div className="p-5 sm:p-6 rounded-2xl barber-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f242e]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-slate-950 text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Escolha o Horário
                  </h3>
                </div>
                {selectedTime ? (
                  <span className="text-xs font-bold text-emerald-400">
                    Horário escolhido: {selectedTime}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Toque no horário desejado
                  </span>
                )}
              </div>

              {slotsLoading ? (
                <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Consultando horários...</span>
                </div>
              ) : slotsData.isBlocked ? (
                <div className="py-4 text-center text-slate-400 text-xs bg-[#0f1217] rounded-lg">
                  Esta data está bloqueada para agendamentos.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Manhã */}
                  {morningSlots.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-400">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Manhã</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {morningSlots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-2 px-1 rounded-lg text-xs font-semibold transition flex flex-col items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-slate-950 font-bold shadow-md'
                                  : !slot.available
                                  ? 'bg-[#10131a] text-slate-600 cursor-not-allowed opacity-30'
                                  : 'bg-[#181c26] text-slate-200 hover:bg-[#232834]'
                              }`}
                            >
                              <span>{slot.time}</span>
                              {!slot.available && (
                                <span className="text-[8px] font-normal text-slate-500">
                                  {slot.reason || 'Ocupado'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tarde */}
                  {afternoonSlots.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-400">
                        <Sunset className="w-3.5 h-3.5 text-orange-400" />
                        <span>Tarde</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {afternoonSlots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-2 px-1 rounded-lg text-xs font-semibold transition flex flex-col items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-slate-950 font-bold shadow-md'
                                  : !slot.available
                                  ? 'bg-[#10131a] text-slate-600 cursor-not-allowed opacity-30'
                                  : 'bg-[#181c26] text-slate-200 hover:bg-[#232834]'
                              }`}
                            >
                              <span>{slot.time}</span>
                              {!slot.available && (
                                <span className="text-[8px] font-normal text-slate-500">
                                  {slot.reason || 'Ocupado'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Noite */}
                  {eveningSlots.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-400">
                        <Moon className="w-3.5 h-3.5 text-blue-400" />
                        <span>Noite</span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {eveningSlots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-2 px-1 rounded-lg text-xs font-semibold transition flex flex-col items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-slate-950 font-bold shadow-md'
                                  : !slot.available
                                  ? 'bg-[#10131a] text-slate-600 cursor-not-allowed opacity-30'
                                  : 'bg-[#181c26] text-slate-200 hover:bg-[#232834]'
                              }`}
                            >
                              <span>{slot.time}</span>
                              {!slot.available && (
                                <span className="text-[8px] font-normal text-slate-500">
                                  {slot.reason || 'Ocupado'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ETAPA 3: SEUS DADOS & CONFIRMAÇÃO */}
            <div className="p-5 sm:p-6 rounded-2xl barber-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f242e]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-slate-950 text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Seus Dados & Finalização
                  </h3>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleConfirmAppointment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Procedimento */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-200 block mb-1.5 flex items-center justify-between">
                      <span>Escolha o Procedimento *</span>
                      <span className="text-[10px] text-emerald-400 font-bold truncate max-w-[170px]">
                        {selectedProcedure === 'Outro Procedimento' && customProcedure ? customProcedure : selectedProcedure}
                      </span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
                      {DEFAULT_PROCEDURES.map((proc) => {
                        const isSelected = selectedProcedure === proc;
                        return (
                          <button
                            key={proc}
                            type="button"
                            onClick={() => setSelectedProcedure(proc)}
                            className={`p-2 rounded-lg text-left text-xs font-medium transition cursor-pointer flex items-center justify-between border ${
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
                      <input
                        type="text"
                        required
                        placeholder="Digite o procedimento desejado..."
                        value={customProcedure}
                        onChange={(e) => setCustomProcedure(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg barber-input text-xs placeholder:text-slate-500 mb-2"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg barber-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(73) 98116-4949"
                      value={clientPhone}
                      onChange={handlePhoneChange}
                      className="w-full px-3.5 py-2.5 rounded-lg barber-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Observação Adicional (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: degradê navalhado, barba desenhada..."
                    value={serviceNote}
                    onChange={(e) => setServiceNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg barber-input text-xs"
                  />
                </div>

                {/* Resumo do Horário Selecionado */}
                <div className="p-3.5 rounded-xl bg-[#0e1117] border border-[#1f242e] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Data & Horário: </span>
                    <strong className="text-white">
                      {selectedDate.split('-').reverse().join('/')} às {selectedTime ? selectedTime : 'Selecione'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Procedimento: </span>
                    <strong className="text-emerald-400">
                      {selectedProcedure === 'Outro Procedimento' && customProcedure ? customProcedure : selectedProcedure}
                    </strong>
                  </div>
                </div>

                {/* Botão de Finalização */}
                <button
                  type="submit"
                  disabled={submitting || !isOnline || !selectedTime}
                  className={`w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                    !selectedTime
                      ? 'bg-[#181c26] text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95'
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

                <p className="text-[10px] text-center text-slate-500">
                  Ao clicar, o horário é gravado na agenda do Ed e o WhatsApp abre automaticamente com a mensagem pronta.
                </p>
              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
