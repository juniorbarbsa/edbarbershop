// API service for Ed Barber Shop

const API_BASE = '/api';

export async function getPublicInfo() {
  const res = await fetch(`${API_BASE}/public-info`);
  if (!res.ok) throw new Error('Falha ao carregar informações da barbearia');
  return res.json();
}

export async function getAvailableSlots(date) {
  const res = await fetch(`${API_BASE}/available-slots?date=${date}`);
  if (!res.ok) throw new Error('Falha ao consultar horários disponíveis');
  return res.json();
}

export async function createAppointment(data) {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Erro ao realizar agendamento');
  }
  return json;
}

export async function loginAdmin(credentials) {
  const payload = typeof credentials === 'string'
    ? { username: 'ed', password: credentials }
    : credentials;

  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Usuário ou senha incorretos');
  }
  return json;
}

export async function getAdminDashboard(token) {
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Sessão expirada ou não autorizada');
  return res.json();
}

export async function updateBarberStatus(token, statusData) {
  const res = await fetch(`${API_BASE}/admin/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(statusData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao atualizar status');
  return json;
}

export async function updateAdminSettings(token, settingsData) {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(settingsData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao salvar configurações');
  return json;
}

export async function changeAdminPassword(token, currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/admin/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao alterar senha');
  return json;
}

export async function saveService(token, serviceData, id = null) {
  const url = id ? `${API_BASE}/admin/services/${id}` : `${API_BASE}/admin/services`;
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(serviceData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao salvar serviço');
  return json;
}

export async function deleteService(token, id) {
  const res = await fetch(`${API_BASE}/admin/services/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao excluir serviço');
  return json;
}

export async function updateAppointmentStatus(token, id, status) {
  const res = await fetch(`${API_BASE}/admin/appointments/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao alterar status');
  return json;
}

export async function deleteAppointment(token, id) {
  const res = await fetch(`${API_BASE}/admin/appointments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao excluir agendamento');
  return json;
}

export async function addBlockedSlot(token, blockData) {
  const res = await fetch(`${API_BASE}/admin/blocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(blockData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao bloquear horário');
  return json;
}

export async function deleteBlockedSlot(token, id) {
  const res = await fetch(`${API_BASE}/admin/blocks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao remover bloqueio');
  return json;
}
