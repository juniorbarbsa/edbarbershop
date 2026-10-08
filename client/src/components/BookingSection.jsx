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

  // Client form
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

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
    <section id="agendar" className="py-16 sm:py-24 relative border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
            Agenda Online
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-['Outfit']">
            Reserve Seu Horário
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Selecione o serviço, data e horário. Os dados serão confirmados diretamente no WhatsApp do barbeiro.
          </p>
        </div>

        {/* Offline Alert */}
        {!isOnline && (
          <div className="max-w-2xl mx-auto mb-10 p-5 rounded-2xl glass-card border-amber-500/30 text-center space-y-3">
            <div className="inline-flex p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-amber-300">Agendamentos Pausados</h3>
            <p className="text-xs text-amber-200/80 max-w-md mx-auto">
              {settings?.closedMessage || "O barbeiro está em pausa no momento. Você ainda pode enviar uma mensagem no WhatsApp."}
            </p>
            <div className="pt-2">
              <a
                href={`https://api.whatsapp.com/send?phone=${settings?.whatsapp?.replace(/\D/g, '') || ''}&text=${encodeURIComponent('Olá Ed! Gostaria de consultar futuros horários.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Success Modal / Clean Ticket View */}
        {bookingSuccess ? (
          <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl glass-card border-white/10 text-center space-y-6 animate-fade-in shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Horário Reservado
              </span>
              <h3 className="text-2xl font-bold text-white font-['Outfit'] mt-1">
                Agendamento Concluído!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Seu horário está gravado no sistema da barbearia.
              </p>
            </div>

            {/* Clean Ticket Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] text-left space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Cliente:</span>
                <span className="text-white font-medium">{bookingSuccess.appointment.clientName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Serviço:</span>
                <span className="text-white font-medium">{bookingSuccess.appointment.serviceName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Data & Hora:</span>
                <span className="text-slate-100 font-bold">
                  {bookingSuccess.appointment.date.split('-').reverse().join('/')} às {bookingSuccess.appointment.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total:</span>
                <span className="text-white font-bold">
                  R$ {Number(bookingSuccess.appointment.price).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <a
                href={bookingSuccess.whatsappRedirectUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmar no WhatsApp do Ed</span>
              </a>

              <button
                onClick={handleResetBooking}
                className="w-full py-2.5 rounded-xl bg-white/[0.04] text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Novo Agendamento</span>
              </button>
            </div>
          </div>
        ) : (
          /* Clean 2-Column Booking Studio */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Step 1 (Services) + Step 2 (Calendar) + Step 3 (Times) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Services Selector */}
              <div className="p-6 rounded-2xl barber-card space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    1. Escolha o Serviço
                  </span>
                  {selectedService && (
                    <span className="text-xs font-semibold text-slate-200">
                      R$ {Number(selectedService.price).toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1">
                  {services.map((srv) => {
                    const isSelected = selectedService?.id === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-3 rounded-xl cursor-pointer border transition-all text-left flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-white text-slate-950 border-white shadow-md'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14] text-slate-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className={`text-xs font-semibold truncate ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                            {srv.name}
                          </p>
                          <p className={`text-[11px] ${isSelected ? 'text-slate-600' : 'text-slate-400'}`}>
                            {srv.durationMinutes} min
                          </p>
                        </div>
                        <span className={`text-xs font-bold shrink-0 ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                          R$ {Number(srv.price).toFixed(0)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Minimalist Calendar */}
              <div className="p-6 rounded-2xl barber-card space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    2. Escolha a Data
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-300">
                      {monthNames[currentMonthIdx]} {currentYear}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevMonth}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Mês Anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Próximo Mês"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Day of Week Labels */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {dayNames.map((d, i) => (
                    <div key={i} className="text-[10px] font-bold text-slate-400 py-1 uppercase">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-9"></div>
                  ))}

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
                        className={`h-9 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                          selected
                            ? 'bg-white text-slate-950 font-bold shadow-md'
                            : disabled
                            ? 'opacity-20 text-slate-600 cursor-not-allowed'
                            : 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {today.getDate() === dayNum && today.getMonth() === currentMonthIdx && today.getFullYear() === currentYear && !selected && (
                          <span className="w-1 h-1 rounded-full bg-red-400 absolute bottom-1"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span>Selecionado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span>Hoje</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    <span>Folga</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Time Chips */}
              <div className="p-6 rounded-2xl barber-card space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    3. Horários Disponíveis
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedDate.split('-').reverse().join('/')}
                  </span>
                </div>

                {slotsLoading ? (
                  <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Consultando horários...</span>
                  </div>
                ) : !slotsData.isWorkDay ? (
                  <div className="py-4 text-center text-slate-400 text-xs bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    Barbearia fechada neste dia.
                  </div>
                ) : slotsData.isBlocked ? (
                  <div className="py-4 text-center text-slate-400 text-xs bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    Data bloqueada para agendamentos.
                  </div>
                ) : slotsData.slots && slotsData.slots.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {slotsData.slots.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2 px-1.5 rounded-xl text-xs font-medium transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-white text-slate-950 font-bold shadow-md'
                              : !slot.available
                              ? 'bg-white/[0.01] text-slate-600 border border-transparent cursor-not-allowed opacity-35'
                              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.05]'
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
                ) : (
                  <div className="py-4 text-center text-slate-400 text-xs">
                    Nenhum horário disponível para esta data.
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Step 4 (Client Data) & Ticket Summary */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 sm:p-7 rounded-2xl barber-card space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  4. Confirmação do Cliente
                </span>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleConfirmAppointment} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg barber-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      WhatsApp com DDD *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="(73) 99999-9999"
                      value={clientPhone}
                      onChange={handlePhoneChange}
                      className="w-full px-3.5 py-2.5 rounded-lg barber-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Observação (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Corte tradicional ou degradê"
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg barber-input text-xs"
                    />
                  </div>

                  {/* Clean Receipt / Ticket */}
                  <div className="p-4 rounded-2xl bg-black/35 border border-white/[0.06] space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Serviço:</span>
                      <span className="text-white font-medium">{selectedService?.name || 'Selecione um serviço'}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Data:</span>
                      <span className="text-white font-medium">
                        {selectedDate.split('-').reverse().join('/')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Horário:</span>
                      <span className="text-white font-medium">{selectedTime || 'Selecione um horário'}</span>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center">
                      <span className="text-slate-300 font-medium">Total:</span>
                      <span className="font-bold text-white text-base font-['Outfit']">
                        R$ {selectedService ? Number(selectedService.price).toFixed(2).replace('.', ',') : '0,00'}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    disabled={submitting || !isOnline}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                      !isOnline
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-white text-slate-950 hover:bg-slate-200 active:scale-95 shadow-md'
                    }`}
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Confirmar & Abrir no WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-slate-500">
                    O sistema confirmará seu agendamento e abrirá a conversa do WhatsApp.
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
