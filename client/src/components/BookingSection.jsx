import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Scissors, 
  MessageCircle, 
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { getAvailableSlots, createAppointment } from '../api';

export default function BookingSection({ 
  services, 
  settings, 
  selectedService, 
  setSelectedService,
  onAppointmentCreated
}) {
  const isOnline = settings?.status === 'online';

  // Format today's date YYYY-MM-DD
  const today = new Date();
  const formatIsoDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(formatIsoDate(today));
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsData, setSlotsData] = useState({ slots: [], isWorkDay: true, isBlocked: false });
  const [errorMsg, setErrorMsg] = useState('');

  // Client form fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // Booking states
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Phone mask helper
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

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const currentYear = currentMonth.getFullYear();
  const currentMonthIdx = currentMonth.getMonth();
  const totalDays = getDaysInMonth(currentYear, currentMonthIdx);
  const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonthIdx);

  const prevMonth = () => {
    const prev = new Date(currentYear, currentMonthIdx - 1, 1);
    // Don't go to past months
    if (prev.getMonth() < today.getMonth() && prev.getFullYear() <= today.getFullYear()) return;
    setCurrentMonth(prev);
  };

  const nextMonth = () => {
    // Limit to next 2 months for barbershop planning
    const next = new Date(currentYear, currentMonthIdx + 1, 1);
    setCurrentMonth(next);
  };

  const handleDateSelect = (dayNum) => {
    const selected = new Date(currentYear, currentMonthIdx, dayNum);
    // Cannot select past date
    const todayAtZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (selected < todayAtZero) return;

    setSelectedDate(formatIsoDate(selected));
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

  const isDayWorkDay = (dayNum) => {
    const dayOfWeek = new Date(currentYear, currentMonthIdx, dayNum).getDay();
    const workDays = settings?.workDays || [1, 2, 3, 4, 5, 6];
    return workDays.includes(dayOfWeek);
  };

  // Submit appointment
  const handleConfirmAppointment = async (e) => {
    e.preventDefault();
    if (!isOnline) {
      setErrorMsg('O barbeiro não está atendendo no momento.');
      return;
    }
    if (!selectedService) {
      setErrorMsg('Por favor, selecione um serviço.');
      return;
    }
    if (!selectedDate) {
      setErrorMsg('Por favor, selecione uma data no calendário.');
      return;
    }
    if (!selectedTime) {
      setErrorMsg('Por favor, selecione um horário disponível.');
      return;
    }
    if (!clientName.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }
    if (!clientPhone.replace(/\D/g, '') || clientPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const result = await createAppointment({
        clientName,
        clientPhone,
        clientNotes,
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime
      });

      setBookingSuccess(result);
      if (onAppointmentCreated) onAppointmentCreated(result.appointment);

      // Open WhatsApp automatically
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
    setClientNotes('');
  };

  return (
    <section id="agendar" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border-white/10 text-xs font-bold text-red-400 uppercase tracking-widest">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Agendamento Interativo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
            Reserve Sua Cadeira
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Escolha o serviço, selecione a data no calendário e o horário ideal para você.
          </p>
        </div>

        {/* Offline Alert if barber paused bookings */}
        {!isOnline && (
          <div className="max-w-3xl mx-auto mb-10 p-6 rounded-3xl glass-card border-amber-500/40 bg-amber-500/10 text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-amber-300">Agendamentos Pausados no Momento</h3>
            <p className="text-sm text-amber-200/90 max-w-lg mx-auto">
              {settings?.closedMessage || "O barbeiro está em pausa no momento. Você ainda pode enviar uma mensagem direta no WhatsApp para consultar futuros horários."}
            </p>
            <div className="pt-2">
              <a
                href={`https://api.whatsapp.com/send?phone=${settings?.whatsapp?.replace(/\D/g, '') || ''}&text=${encodeURIComponent('Olá Ed! Gostaria de consultar disponibilidade de horários.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Falar Diretamente no WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Success Modal / Ticket View */}
        {bookingSuccess ? (
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl glass-card border-emerald-500/40 bg-emerald-950/20 text-center space-y-6 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Agendamento Concluído!
              </span>
              <h3 className="text-2xl font-black text-white font-['Outfit'] mt-1">
                Horário Reservado com Sucesso
              </h3>
              <p className="text-sm text-slate-300 mt-2">
                Sua vaga na barbearia foi garantida no sistema. Enviamos as informações para o WhatsApp do Ed Barber.
              </p>
            </div>

            {/* Ticket Summary Card */}
            <div className="p-5 rounded-2xl bg-black/50 border border-white/10 text-left space-y-3 font-mono text-xs text-slate-300">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">CLIENTE:</span>
                <span className="text-white font-bold">{bookingSuccess.appointment.clientName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">SERVIÇO:</span>
                <span className="text-white font-bold">{bookingSuccess.appointment.serviceName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">DATA & HORA:</span>
                <span className="text-emerald-400 font-bold">
                  {bookingSuccess.appointment.date.split('-').reverse().join('/')} às {bookingSuccess.appointment.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">VALOR:</span>
                <span className="text-white font-bold">
                  R$ {Number(bookingSuccess.appointment.price).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <a
                href={bookingSuccess.whatsappRedirectUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Abrir WhatsApp do Ed para Confirmar</span>
              </a>

              <button
                onClick={handleResetBooking}
                className="w-full py-3 rounded-xl glass-card text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Fazer Outro Agendamento</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Glass Wizard */
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Calendar & Time Slots */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Service selector pill */}
              <div className="p-5 sm:p-6 rounded-3xl glass-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>Escolha o Serviço</span>
                  </h3>
                  {selectedService && (
                    <span className="text-xs font-bold text-red-400">
                      R$ {Number(selectedService.price).toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {services.map((srv) => {
                    const isSelected = selectedService?.id === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-3 rounded-2xl cursor-pointer border transition-all text-left flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-red-600/20 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-white'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-white">{srv.name}</p>
                          <p className="text-[11px] text-slate-400">{srv.durationMinutes} min</p>
                        </div>
                        <span className="text-xs font-black text-white shrink-0">
                          R$ {Number(srv.price).toFixed(0)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Interactive Glass Calendar */}
              <div className="p-5 sm:p-6 rounded-3xl glass-card space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    <span>Escolha a Data</span>
                  </h3>

                  {/* Month Navigation */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">
                      {monthNames[currentMonthIdx]} {currentYear}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevMonth}
                        className="p-1.5 rounded-lg glass-card hover:bg-white/10 text-slate-300 transition cursor-pointer"
                        title="Mês Anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="p-1.5 rounded-lg glass-card hover:bg-white/10 text-slate-300 transition cursor-pointer"
                        title="Próximo Mês"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {dayNames.map((d, i) => (
                    <div key={i} className="text-[11px] font-bold text-slate-500 py-1 uppercase tracking-wider">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {/* Empty cells before month start */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10"></div>
                  ))}

                  {/* Month days */}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const dayNum = i + 1;
                    const isPast = isDayPast(dayNum);
                    const isWorkDay = isDayWorkDay(dayNum);
                    const selected = isDaySelected(dayNum);
                    const disabled = isPast || !isWorkDay;

                    return (
                      <button
                        key={`day-${dayNum}`}
                        disabled={disabled}
                        onClick={() => handleDateSelect(dayNum)}
                        className={`h-10 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                          selected
                            ? 'bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400'
                            : disabled
                            ? 'opacity-25 text-slate-600 cursor-not-allowed'
                            : 'bg-white/[0.04] text-slate-200 hover:bg-white/15 hover:border-white/20 border border-transparent'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {/* Dot indicator if today */}
                        {today.getDate() === dayNum && today.getMonth() === currentMonthIdx && today.getFullYear() === currentYear && (
                          <span className="w-1 h-1 rounded-full bg-blue-400 absolute bottom-1"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Data Selecionada</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>Hoje</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                    <span>Fechado / Folga</span>
                  </div>
                </div>

              </div>

              {/* Step 3: Available Time Slots */}
              <div className="p-5 sm:p-6 rounded-3xl glass-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    <span>Escolha o Horário</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {selectedDate.split('-').reverse().join('/')}
                  </span>
                </div>

                {slotsLoading ? (
                  <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Consultando horários disponíveis...</span>
                  </div>
                ) : !slotsData.isWorkDay ? (
                  <div className="py-6 text-center text-amber-400/90 text-xs bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    A barbearia não realiza atendimentos neste dia da semana.
                  </div>
                ) : slotsData.isBlocked ? (
                  <div className="py-6 text-center text-amber-400/90 text-xs bg-amber-500/10 rounded-2xl border border-amber-500/20">
                    Esta data está bloqueada para agendamentos.
                  </div>
                ) : slotsData.slots && slotsData.slots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {slotsData.slots.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-white/50'
                              : !slot.available
                              ? 'bg-white/[0.02] text-slate-600 border border-white/5 cursor-not-allowed opacity-40'
                              : 'bg-white/[0.05] text-slate-200 hover:bg-white/15 hover:text-white border border-white/10'
                          }`}
                        >
                          <span>{slot.time}</span>
                          {!slot.available && (
                            <span className="text-[9px] font-normal text-slate-500">
                              {slot.reason || 'Ocupado'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    Nenhum horário disponível para esta data.
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Client Form & Ticket Summary */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 sm:p-7 rounded-3xl glass-card space-y-6 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 text-xs flex items-center justify-center font-bold">
                    4
                  </span>
                  <h3 className="text-base font-bold text-white">Seus Dados</h3>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleConfirmAppointment} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-red-400" />
                      <span>Seu Nome Completo *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João da Silva"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp com DDD *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(11) 99999-9999"
                      value={clientPhone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      Enviaremos a confirmação direta para este número
                    </span>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Observação (Opcional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Degradê bem disfarçado na navalha"
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                  </div>

                  {/* Real-time Ticket Summary */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Serviço:</span>
                      <span className="text-white font-bold">{selectedService?.name || 'Não selecionado'}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Data:</span>
                      <span className="text-white font-bold">
                        {selectedDate.split('-').reverse().join('/')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Horário:</span>
                      <span className="text-emerald-400 font-bold">{selectedTime || 'Selecione um horário'}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-300">Total a pagar:</span>
                      <span className="font-black text-white text-base font-['Outfit']">
                        R$ {selectedService ? Number(selectedService.price).toFixed(2).replace('.', ',') : '0,00'}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button with WhatsApp Redirect */}
                  <button
                    type="submit"
                    disabled={submitting || !isOnline}
                    className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer ${
                      !isOnline
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-white shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Registrando Agendamento...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        <span>Confirmar & Abrir no WhatsApp</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400 leading-tight">
                    Ao confirmar, você será redirecionado para o WhatsApp da barbearia com a mensagem pronta.
                  </p>
                </form>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
