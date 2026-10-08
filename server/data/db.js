const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '..', 'data_storage');
const DB_FILE = path.join(DB_DIR, 'barber_db.json');

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Default initial state
const defaultState = {
  settings: {
    shopName: "Ed Barber Shop",
    subtitle: "Desde 1999",
    barberName: "Ed",
    email: "edalves8127@gmail.com",
    whatsapp: "5573981164949",
    status: "online",
    closedMessage: "No momento não estamos atendendo. Chame no WhatsApp para dúvidas.",
    adminUsername: "ed",
    adminPasswordHash: "$2a$10$oMCi/c.PcnT4FnLkMNwFkehVSAtREe8VTYHohQCIUpQ.Ita48BjGe", // 'Ed5812'
    openingHour: "09:00",
    closingHour: "21:00",
    slotDurationMinutes: 35,
    workDays: [0, 1, 2, 3, 4, 5, 6], // Aberto todos os dias (Segunda a Domingo)
    lunchStart: "13:00",
    lunchEnd: "14:00",
    address: "Rua Walter Hollenwerger, 119 - Antiga Batateira, Centro",
    instagram: "@edbarbershop"
  },
  services: [
    {
      id: "srv-1",
      name: "Corte Clássico & Degradê",
      description: "Corte na tesoura ou máquina com degradê impecável (fade), acabamento na lâmina e alinhamento.",
      price: 35.00,
      durationMinutes: 35,
      active: true,
      popular: true,
      badge: "Mais Pedido"
    },
    {
      id: "srv-2",
      name: "Barba Terapia com Toalha Quente",
      description: "Design e alinhamento de barba, esfoliação facial, hidratação profunda com óleos essenciais e toalha quente.",
      price: 30.00,
      durationMinutes: 30,
      active: true,
      popular: false,
      badge: "Relaxante"
    },
    {
      id: "srv-3",
      name: "Combo VIP: Corte + Barba",
      description: "A experiência completa de transformação: corte degradê ou tradicional + barba terapia com toalha quente.",
      price: 60.00,
      durationMinutes: 60,
      active: true,
      popular: true,
      badge: "Melhor Custo/Benefício"
    },
    {
      id: "srv-4",
      name: "Acabamento & Pezinho",
      description: "Alinhamento das linhas do cabelo, costeletas e nuca na navalha com loção pós-barba.",
      price: 15.00,
      durationMinutes: 15,
      active: true,
      popular: false
    },
    {
      id: "srv-5",
      name: "Sobrancelha na Navalha",
      description: "Desenho e limpeza precisa da sobrancelha na lâmina para harmonizar seu visual.",
      price: 15.00,
      durationMinutes: 15,
      active: true,
      popular: false
    },
    {
      id: "srv-6",
      name: "Pigmentação de Barba ou Cabelo",
      description: "Disfarce de falhas e fios brancos com efeito natural e duradouro.",
      price: 25.00,
      durationMinutes: 25,
      active: true,
      popular: false
    },
    {
      id: "srv-7",
      name: "Platinado / Nevou",
      description: "Descoloração global com matização profissional para um tom platinado ou branco perfeito.",
      price: 110.00,
      durationMinutes: 120,
      active: true,
      popular: false,
      badge: "Estilo Único"
    }
  ],
  appointments: [
    {
      id: "apt-demo-1",
      clientName: "Marcos Vinicius",
      clientPhone: "11988887777",
      clientNotes: "Degradê navalhado alto",
      serviceId: "srv-1",
      serviceName: "Corte Clássico & Degradê",
      price: 35.00,
      durationMinutes: 35,
      date: new Date().toISOString().split('T')[0], // Hoje
      time: "10:30",
      status: "confirmed",
      createdAt: new Date().toISOString()
    }
  ],
  blockedSlots: []
};

// In-memory cache + file sync
let dbData = null;

function loadDb() {
  if (dbData) return dbData;
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbData = JSON.parse(raw);
      // Merge keys in case schema evolved
      dbData.settings = { ...defaultState.settings, ...(dbData.settings || {}) };
      if (!Array.isArray(dbData.services)) dbData.services = defaultState.services;
      if (!Array.isArray(dbData.appointments)) dbData.appointments = defaultState.appointments;
      if (!Array.isArray(dbData.blockedSlots)) dbData.blockedSlots = defaultState.blockedSlots;
    } else {
      dbData = JSON.parse(JSON.stringify(defaultState));
      saveDbSync();
    }
  } catch (err) {
    console.error("Erro ao carregar banco de dados, utilizando padrão:", err);
    dbData = JSON.parse(JSON.stringify(defaultState));
  }
  return dbData;
}

function saveDbSync() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error("Erro ao salvar banco de dados:", err);
  }
}

function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}

function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const m = (totalMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function hasTimeOverlap(startMinutesA, durationA, startMinutesB, durationB) {
  const endA = startMinutesA + durationA;
  const endB = startMinutesB + durationB;
  return startMinutesA < endB && startMinutesB < endA;
}

const db = {
  timeToMinutes,
  minutesToTime,
  hasTimeOverlap,

  getSettings() {
    return loadDb().settings;
  },
  updateSettings(newSettings) {
    const data = loadDb();
    data.settings = { ...data.settings, ...newSettings };
    saveDbSync();
    return data.settings;
  },
  getServices() {
    return loadDb().services;
  },
  getActiveServices() {
    return loadDb().services.filter(s => s.active !== false);
  },
  addService(service) {
    const data = loadDb();
    const id = "srv-" + Date.now();
    const newService = { ...service, id };
    data.services.push(newService);
    saveDbSync();
    return newService;
  },
  updateService(id, updates) {
    const data = loadDb();
    const index = data.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    data.services[index] = { ...data.services[index], ...updates };
    saveDbSync();
    return data.services[index];
  },
  deleteService(id) {
    const data = loadDb();
    data.services = data.services.filter(s => s.id !== id);
    saveDbSync();
    return true;
  },
  getAppointments() {
    return loadDb().appointments;
  },

  // Check if a slot or time interval has ANY conflict on a given date
  checkSlotConflict(date, time, durationMinutes) {
    const data = loadDb();
    const settings = data.settings;
    const duration = durationMinutes || settings.slotDurationMinutes || 35;
    const reqStart = timeToMinutes(time);
    const reqEnd = reqStart + duration;

    // 1. Business hours check
    const openMinutes = timeToMinutes(settings.openingHour || '09:00');
    const closeMinutes = timeToMinutes(settings.closingHour || '21:00');
    if (reqStart < openMinutes || reqEnd > closeMinutes) {
      return {
        hasConflict: true,
        reason: `Fora do horário de funcionamento (${settings.openingHour} às ${settings.closingHour}).`
      };
    }

    // 2. Lunch break check
    const lunchStart = timeToMinutes(settings.lunchStart || '13:00');
    const lunchEnd = timeToMinutes(settings.lunchEnd || '14:00');
    if (hasTimeOverlap(reqStart, duration, lunchStart, lunchEnd - lunchStart)) {
      return {
        hasConflict: true,
        reason: `Intervalo de almoço (${settings.lunchStart} às ${settings.lunchEnd}).`
      };
    }

    // 3. Blocked days or specific times
    const isDayBlocked = (data.blockedSlots || []).some(b => b.date === date && b.allDay);
    if (isDayBlocked) {
      return {
        hasConflict: true,
        reason: 'Data bloqueada na agenda pelo barbeiro.'
      };
    }

    const timeBlock = (data.blockedSlots || []).find(b => {
      if (b.date !== date || b.allDay) return false;
      const bStart = timeToMinutes(b.time);
      const bDuration = b.durationMinutes || settings.slotDurationMinutes || 35;
      return hasTimeOverlap(reqStart, duration, bStart, bDuration);
    });
    if (timeBlock) {
      return {
        hasConflict: true,
        reason: `Horário bloqueado (${timeBlock.reason || 'Indisponível'}).`
      };
    }

    // 4. Overlap with existing non-cancelled appointments
    const conflictingApt = (data.appointments || []).find(a => {
      if (a.date !== date || a.status === 'cancelled') return false;
      const aStart = timeToMinutes(a.time);
      const aDuration = a.durationMinutes || settings.slotDurationMinutes || 35;
      return hasTimeOverlap(reqStart, duration, aStart, aDuration);
    });

    if (conflictingApt) {
      return {
        hasConflict: true,
        conflictAppointment: conflictingApt,
        reason: `Horário já reservado (${conflictingApt.time}).`
      };
    }

    return { hasConflict: false };
  },

  // Atomic conflict-free booking method
  bookAppointment(appointment) {
    const data = loadDb();
    const settings = data.settings;

    if (settings.status === 'offline') {
      const err = new Error(settings.closedMessage || 'No momento o barbeiro não está aceitando novos agendamentos.');
      err.code = 'BARBER_OFFLINE';
      throw err;
    }

    const { date, time } = appointment;
    const duration = appointment.durationMinutes || settings.slotDurationMinutes || 35;

    // Strict conflict verification before adding to database
    const conflictResult = this.checkSlotConflict(date, time, duration);
    if (conflictResult.hasConflict) {
      const err = new Error(conflictResult.reason || 'Conflito de horário detectado.');
      err.code = 'SLOT_CONFLICT';
      err.detail = conflictResult;
      throw err;
    }

    const id = "apt-" + Date.now();
    const newAppointment = {
      ...appointment,
      id,
      durationMinutes: duration,
      status: appointment.status || "confirmed",
      createdAt: new Date().toISOString()
    };

    data.appointments.push(newAppointment);
    saveDbSync();
    return newAppointment;
  },

  addAppointment(appointment) {
    return this.bookAppointment(appointment);
  },

  updateAppointmentStatus(id, status) {
    const data = loadDb();
    const index = data.appointments.findIndex(a => a.id === id);
    if (index === -1) return null;
    data.appointments[index].status = status;
    saveDbSync();
    return data.appointments[index];
  },
  deleteAppointment(id) {
    const data = loadDb();
    data.appointments = data.appointments.filter(a => a.id !== id);
    saveDbSync();
    return true;
  },
  getBlockedSlots() {
    return loadDb().blockedSlots;
  },
  addBlockedSlot(block) {
    const data = loadDb();
    const id = "blk-" + Date.now();
    const newBlock = { ...block, id, createdAt: new Date().toISOString() };
    data.blockedSlots.push(newBlock);
    saveDbSync();
    return newBlock;
  },
  deleteBlockedSlot(id) {
    const data = loadDb();
    data.blockedSlots = data.blockedSlots.filter(b => b.id !== id);
    saveDbSync();
    return true;
  }
};

module.exports = db;
