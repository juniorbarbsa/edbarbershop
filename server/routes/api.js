const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../data/db');

const JWT_SECRET = process.env.JWT_SECRET || 'ed-barber-secret-key-since-1999';

// Middleware to authenticate admin JWT
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sessão expirada ou token inválido. Faça login novamente.' });
  }
}

// Helper: format phone number to standard digits
function cleanPhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

// Helper: build WhatsApp URL with pre-filled message
function buildWhatsAppUrl(barberPhone, appointment, settings) {
  const cleanBarber = cleanPhone(barberPhone);
  
  // Format Date DD/MM/YYYY
  const [year, month, day] = appointment.date.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  const message = [
    `💈 *NOVO AGENDAMENTO - ${settings.shopName.toUpperCase()}* 💈`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Cliente:* ${appointment.clientName}`,
    `📱 *WhatsApp:* ${appointment.clientPhone}`,
    `📅 *Data:* ${formattedDate}`,
    `⏰ *Horário:* ${appointment.time}`,
    appointment.serviceName ? `✂️ *Procedimento:* ${appointment.serviceName}` : null,
    appointment.price ? `💰 *Valor:* R$ ${Number(appointment.price).toFixed(2).replace('.', ',')}` : null,
    appointment.clientNotes ? `📝 *Observação:* ${appointment.clientNotes}` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Olá ${settings.barberName}! Acabei de agendar meu horário pelo site e gostaria de confirmar.`
  ].filter(Boolean).join('\n');

  return `https://api.whatsapp.com/send?phone=${cleanBarber}&text=${encodeURIComponent(message)}`;
}

// -------------------------------------------------------------
// PUBLIC ENDPOINTS
// -------------------------------------------------------------

// 1. Get Public Shop Info & Services & Barber Status
router.get('/public-info', (req, res) => {
  try {
    const settings = db.getSettings();
    const services = db.getActiveServices();

    // Do not leak admin password hash
    const { adminPasswordHash, ...safeSettings } = settings;

    res.json({
      settings: safeSettings,
      services
    });
  } catch (err) {
    console.error('Erro em /public-info:', err);
    res.status(500).json({ error: 'Erro ao carregar informações da barbearia.' });
  }
});

// 2. Get Available Slots for a Given Date (YYYY-MM-DD)
router.get('/available-slots', (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Data inválida. Formato esperado: AAAA-MM-DD' });
    }

    const settings = db.getSettings();
    const dateObj = new Date(date + 'T12:00:00'); // Midday to prevent timezone shifts
    const dayOfWeek = dateObj.getDay(); // 0 = Dom, 1 = Seg, ...

    // Check if barber works on this day
    const isWorkDay = settings.workDays.includes(dayOfWeek);
    if (!isWorkDay) {
      return res.json({
        date,
        isWorkDay: false,
        isBlocked: false,
        status: settings.status,
        message: 'A barbearia não abre neste dia da semana.',
        slots: []
      });
    }

    // Check if whole day is blocked
    const blockedSlots = db.getBlockedSlots();
    const isDayBlocked = blockedSlots.some(b => b.date === date && b.allDay);
    if (isDayBlocked) {
      return res.json({
        date,
        isWorkDay: true,
        isBlocked: true,
        status: settings.status,
        message: 'Dia bloqueado para agendamentos (folga ou evento).',
        slots: []
      });
    }

    // Generate time slots based on opening and closing hours
    const [openH, openM] = settings.openingHour.split(':').map(Number);
    const [closeH, closeM] = settings.closingHour.split(':').map(Number);
    const duration = settings.slotDurationMinutes || 30;

    const startMinutes = openH * 60 + openM;
    const endMinutes = closeH * 60 + closeM;

    let [lunchStartH, lunchStartM] = (settings.lunchStart || '12:00').split(':').map(Number);
    let [lunchEndH, lunchEndM] = (settings.lunchEnd || '13:00').split(':').map(Number);
    const lunchStartMinutes = lunchStartH * 60 + lunchStartM;
    const lunchEndMinutes = lunchEndH * 60 + lunchEndM;

    // Existing appointments on this date (not cancelled)
    const appointments = db.getAppointments().filter(
      a => a.date === date && a.status !== 'cancelled'
    );

    // Blocked specific times on this date
    const dayBlocks = blockedSlots.filter(b => b.date === date && !b.allDay);

    // Current time check if date is today
    const now = new Date();
    // Brazil/Local comparison:
    const todayStr = now.toLocaleDateString('sv'); // 'YYYY-MM-DD'
    const isToday = date === todayStr;
    const currentMinutesNow = now.getHours() * 60 + now.getMinutes();

    const slots = [];

    for (let m = startMinutes; m + duration <= endMinutes; m += duration) {
      const h = Math.floor(m / 60).toString().padStart(2, '0');
      const min = (m % 60).toString().padStart(2, '0');
      const timeStr = `${h}:${min}`;

      // Check lunch time
      const isLunch = (m >= lunchStartMinutes && m < lunchEndMinutes);

      // Check booked
      const isBooked = appointments.some(a => a.time === timeStr);

      // Check specifically blocked
      const isBlocked = dayBlocks.some(b => b.time === timeStr);

      // Check past time if today (with 10-minute buffer)
      const isPast = isToday && (m <= currentMinutesNow + 10);

      let available = true;
      let reason = null;

      if (isLunch) {
        available = false;
        reason = 'Almoço';
      } else if (isPast) {
        available = false;
        reason = 'Horário passado';
      } else if (isBooked) {
        available = false;
        reason = 'Ocupado';
      } else if (isBlocked) {
        available = false;
        reason = 'Indisponível';
      }

      slots.push({
        time: timeStr,
        available,
        reason
      });
    }

    res.json({
      date,
      isWorkDay: true,
      isBlocked: false,
      status: settings.status,
      slots
    });
  } catch (err) {
    console.error('Erro em /available-slots:', err);
    res.status(500).json({ error: 'Erro ao consultar horários disponíveis.' });
  }
});

// 3. Create Appointment (Book Slot & Get WhatsApp Redirect Link)
router.post('/appointments', (req, res) => {
  try {
    const { clientName, clientPhone, clientNotes, serviceName, serviceId, date, time } = req.body;

    if (!clientName || !clientPhone || !date || !time) {
      return res.status(400).json({ error: 'Nome, telefone, data e horário são obrigatórios.' });
    }

    const settings = db.getSettings();

    // Check if barber is currently accepting bookings
    if (settings.status === 'offline') {
      return res.status(400).json({
        error: settings.closedMessage || 'No momento o barbeiro não está recebendo novos agendamentos.'
      });
    }

    // Check slot availability (conflict check)
    const existingAppointments = db.getAppointments();
    const isConflict = existingAppointments.some(
      a => a.date === date && a.time === time && a.status !== 'cancelled'
    );

    if (isConflict) {
      return res.status(409).json({ error: 'Este horário acabou de ser reservado por outro cliente. Por favor, escolha outro horário.' });
    }

    // Check blocked slots
    const blockedSlots = db.getBlockedSlots();
    const isBlocked = blockedSlots.some(
      b => b.date === date && (b.allDay || b.time === time)
    );
    if (isBlocked) {
      return res.status(409).json({ error: 'Este horário não está disponível para agendamento.' });
    }

    // Create appointment
    const newAppointment = db.addAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientNotes: clientNotes ? clientNotes.trim() : '',
      serviceId: serviceId || 'atendimento-geral',
      serviceName: serviceName || 'Corte / Barba',
      price: null,
      durationMinutes: 35,
      date,
      time,
      status: 'confirmed'
    });

    // Build WhatsApp Redirect URL
    const whatsappRedirectUrl = buildWhatsAppUrl(settings.whatsapp, newAppointment, settings);

    res.status(201).json({
      success: true,
      message: 'Agendamento registrado com sucesso!',
      appointment: newAppointment,
      whatsappRedirectUrl
    });
  } catch (err) {
    console.error('Erro em POST /appointments:', err);
    res.status(500).json({ error: 'Erro ao processar o agendamento.' });
  }
});

// -------------------------------------------------------------
// ADMIN ENDPOINTS
// -------------------------------------------------------------

// Admin Login
router.post('/admin/login', (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'A senha é obrigatória.' });
    }

    const settings = db.getSettings();
    const isMatch = bcrypt.compareSync(password, settings.adminPasswordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
    }

    const token = jwt.sign({ role: 'admin', shopName: settings.shopName }, JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      success: true,
      token,
      message: 'Login realizado com sucesso!'
    });
  } catch (err) {
    console.error('Erro em /admin/login:', err);
    res.status(500).json({ error: 'Erro no servidor ao autenticar.' });
  }
});

// Admin Dashboard Summary
router.get('/admin/dashboard', authenticateAdmin, (req, res) => {
  try {
    const settings = db.getSettings();
    const { adminPasswordHash, ...safeSettings } = settings;
    const services = db.getServices();
    const appointments = db.getAppointments();
    const blockedSlots = db.getBlockedSlots();

    const todayStr = new Date().toLocaleDateString('sv');

    // Metrics
    const todayAppointments = appointments.filter(a => a.date === todayStr && a.status !== 'cancelled');
    const todayRevenue = todayAppointments.reduce((acc, a) => acc + (Number(a.price) || 0), 0);
    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
    const totalAppointments = appointments.length;

    res.json({
      settings: safeSettings,
      services,
      appointments: appointments.slice().reverse(), // newest first
      blockedSlots,
      metrics: {
        todayCount: todayAppointments.length,
        todayRevenue,
        confirmedCount,
        totalAppointments
      }
    });
  } catch (err) {
    console.error('Erro em /admin/dashboard:', err);
    res.status(500).json({ error: 'Erro ao buscar dados do painel.' });
  }
});

// Admin Toggle Barber Status ("Atendendo" / "Não está atendendo")
router.patch('/admin/status', authenticateAdmin, (req, res) => {
  try {
    const { status, statusMessage, closedMessage } = req.body;
    if (status !== 'online' && status !== 'offline') {
      return res.status(400).json({ error: "Status inválido. Deve ser 'online' ou 'offline'." });
    }

    const updates = { status };
    if (typeof statusMessage === 'string') updates.statusMessage = statusMessage;
    if (typeof closedMessage === 'string') updates.closedMessage = closedMessage;

    const updated = db.updateSettings(updates);
    const { adminPasswordHash, ...safeSettings } = updated;

    res.json({
      success: true,
      message: status === 'online' ? 'Status alterado para ATENDENDO.' : 'Status alterado para NÃO ESTÁ ATENDENDO.',
      settings: safeSettings
    });
  } catch (err) {
    console.error('Erro em /admin/status:', err);
    res.status(500).json({ error: 'Erro ao atualizar status do barbeiro.' });
  }
});

// Admin Update General Settings (WhatsApp, Opening Hours, etc.)
router.put('/admin/settings', authenticateAdmin, (req, res) => {
  try {
    const {
      shopName,
      barberName,
      whatsapp,
      openingHour,
      closingHour,
      slotDurationMinutes,
      workDays,
      lunchStart,
      lunchEnd,
      address,
      instagram
    } = req.body;

    const updates = {};
    if (shopName) updates.shopName = shopName;
    if (barberName) updates.barberName = barberName;
    if (whatsapp) updates.whatsapp = cleanPhone(whatsapp);
    if (openingHour) updates.openingHour = openingHour;
    if (closingHour) updates.closingHour = closingHour;
    if (slotDurationMinutes) updates.slotDurationMinutes = Number(slotDurationMinutes);
    if (Array.isArray(workDays)) updates.workDays = workDays;
    if (lunchStart) updates.lunchStart = lunchStart;
    if (lunchEnd) updates.lunchEnd = lunchEnd;
    if (address) updates.address = address;
    if (instagram) updates.instagram = instagram;

    const updated = db.updateSettings(updates);
    const { adminPasswordHash, ...safeSettings } = updated;

    res.json({
      success: true,
      message: 'Configurações salvas com sucesso!',
      settings: safeSettings
    });
  } catch (err) {
    console.error('Erro em /admin/settings:', err);
    res.status(500).json({ error: 'Erro ao atualizar configurações.' });
  }
});

// Admin Change Password
router.put('/admin/password', authenticateAdmin, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'A senha atual e a nova senha são obrigatórias.' });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ error: 'A nova senha deve ter no mínimo 4 caracteres.' });
    }

    const settings = db.getSettings();
    const isMatch = bcrypt.compareSync(currentPassword, settings.adminPasswordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.updateSettings({ adminPasswordHash: newHash });

    res.json({
      success: true,
      message: 'Senha administrativa atualizada com sucesso!'
    });
  } catch (err) {
    console.error('Erro em /admin/password:', err);
    res.status(500).json({ error: 'Erro ao alterar a senha.' });
  }
});

// Admin Services CRUD
router.post('/admin/services', authenticateAdmin, (req, res) => {
  try {
    const { name, description, price, durationMinutes, badge, popular } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Nome e preço do serviço são obrigatórios.' });
    }

    const created = db.addService({
      name,
      description: description || '',
      price: Number(price),
      durationMinutes: Number(durationMinutes) || 30,
      badge: badge || '',
      popular: Boolean(popular),
      active: true
    });

    res.status(201).json({ success: true, service: created });
  } catch (err) {
    console.error('Erro em POST /admin/services:', err);
    res.status(500).json({ error: 'Erro ao criar serviço.' });
  }
});

router.put('/admin/services/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateService(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Serviço não encontrado.' });
    res.json({ success: true, service: updated });
  } catch (err) {
    console.error('Erro em PUT /admin/services:', err);
    res.status(500).json({ error: 'Erro ao atualizar serviço.' });
  }
});

router.delete('/admin/services/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.deleteService(id);
    res.json({ success: true, message: 'Serviço removido com sucesso.' });
  } catch (err) {
    console.error('Erro em DELETE /admin/services:', err);
    res.status(500).json({ error: 'Erro ao remover serviço.' });
  }
});

// Admin Appointments Status & Delete
router.patch('/admin/appointments/:id/status', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed', 'completed', 'cancelled'
    const updated = db.updateAppointmentStatus(id, status);
    if (!updated) return res.status(404).json({ error: 'Agendamento não encontrado.' });
    res.json({ success: true, appointment: updated });
  } catch (err) {
    console.error('Erro em /admin/appointments status:', err);
    res.status(500).json({ error: 'Erro ao alterar status do agendamento.' });
  }
});

router.delete('/admin/appointments/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.deleteAppointment(id);
    res.json({ success: true, message: 'Agendamento excluído com sucesso.' });
  } catch (err) {
    console.error('Erro em DELETE /admin/appointments:', err);
    res.status(500).json({ error: 'Erro ao excluir agendamento.' });
  }
});

// Admin Block Slots
router.post('/admin/blocks', authenticateAdmin, (req, res) => {
  try {
    const { date, time, allDay, reason } = req.body;
    if (!date) return res.status(400).json({ error: 'A data do bloqueio é obrigatória.' });

    const newBlock = db.addBlockedSlot({
      date,
      time: allDay ? null : time,
      allDay: Boolean(allDay),
      reason: reason || 'Horário Bloqueado'
    });

    res.status(201).json({ success: true, block: newBlock });
  } catch (err) {
    console.error('Erro em POST /admin/blocks:', err);
    res.status(500).json({ error: 'Erro ao bloquear horário.' });
  }
});

router.delete('/admin/blocks/:id', authenticateAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.deleteBlockedSlot(id);
    res.json({ success: true, message: 'Bloqueio removido com sucesso.' });
  } catch (err) {
    console.error('Erro em DELETE /admin/blocks:', err);
    res.status(500).json({ error: 'Erro ao remover bloqueio.' });
  }
});

module.exports = router;
