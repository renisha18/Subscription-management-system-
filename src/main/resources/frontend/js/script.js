'use strict';

// ── Config ─────────────────────────────────────────────────
const API = 'http://localhost:8080/subscriptions';

// ── State ──────────────────────────────────────────────────
let allSubscriptions = [];
let editingId = null;
let deleteTargetId = null;

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadSubscriptions();

  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('statusFilter').addEventListener('change', applyFilters);
});

// ── API Calls ──────────────────────────────────────────────
async function loadSubscriptions() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Failed to load');
    allSubscriptions = await res.json();
    applyFilters();
    updateStats();
  } catch (e) {
    showToast('Could not connect to server. Is Spring Boot running?', 'error');
  }
}

async function addSubscription(data) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(Object.values(err).join(', '));
  }
  return res.json();
}

async function updateSubscription(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(Object.values(err).join(', '));
  }
  return res.json();
}

async function deleteSubscription(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
}

// ── Filter & Render ────────────────────────────────────────
function applyFilters() {
  const search = document.getElementById('searchInput').value.trim().toLowerCase();
  const status = document.getElementById('statusFilter').value;

  let data = allSubscriptions.filter(s => {
    const matchSearch = !search ||
      s.subscriberName.toLowerCase().includes(search) ||
      s.email.toLowerCase().includes(search);
    const matchStatus = !status || s.status === status;
    return matchSearch && matchStatus;
  });

  renderTable(data);
}

function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');
  document.getElementById('recordCount').textContent = `${data.length} record${data.length !== 1 ? 's' : ''}`;

  if (!data.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = data.map(s => `
    <tr class="${s.status === 'Expired' ? 'row-expired' : ''}">
      <td>${s.id}</td>
      <td>${esc(s.subscriberName)}</td>
      <td>${esc(s.email)}</td>
      <td><span class="plan-badge">${esc(s.planType)}</span></td>
      <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
      <td>${s.startDate || '—'}</td>
      <td>${s.endDate || '—'}</td>
      <td>
        <button class="btn-edit" onclick="openEditForm(${s.id})">Edit</button>
        <button class="btn-danger" onclick="openDeleteConfirm(${s.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function updateStats() {
  document.getElementById('statTotal').textContent    = allSubscriptions.length;
  document.getElementById('statActive').textContent   = allSubscriptions.filter(s => s.status === 'Active').length;
  document.getElementById('statExpired').textContent  = allSubscriptions.filter(s => s.status === 'Expired').length;
  document.getElementById('statCancelled').textContent= allSubscriptions.filter(s => s.status === 'Cancelled').length;
}

// ── Form ───────────────────────────────────────────────────
function resetForm() {
  ['fName','fEmail','fStart','fEnd'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('fPlan').value   = '';
  document.getElementById('fStatus').value = 'Active';
  ['fName','fEmail','fPlan'].forEach(id => {
    document.getElementById(id).classList.remove('error');
  });
  ['errName','errEmail','errPlan'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
  document.getElementById('formTitle').textContent  = 'Add Subscription';
  document.getElementById('submitBtn').textContent  = 'Add';
  editingId = null;
}

function openEditForm(id) {
  const s = allSubscriptions.find(x => x.id === id);
  if (!s) return;
  resetForm();
  editingId = id;
  document.getElementById('formTitle').textContent  = 'Edit Subscription';
  document.getElementById('submitBtn').textContent  = 'Save';
  document.getElementById('fName').value   = s.subscriberName;
  document.getElementById('fEmail').value  = s.email;
  document.getElementById('fPlan').value   = s.planType;
  document.getElementById('fStatus').value = s.status;
  document.getElementById('fStart').value  = s.startDate || '';
  document.getElementById('fEnd').value    = s.endDate   || '';
  document.getElementById('fName').focus();
  document.getElementById('addCard').scrollIntoView({ behavior: 'smooth' });
}

async function submitForm() {
  if (!validateForm()) return;

  const data = {
    subscriberName: document.getElementById('fName').value.trim(),
    email:          document.getElementById('fEmail').value.trim(),
    planType:       document.getElementById('fPlan').value,
    status:         document.getElementById('fStatus').value,
    startDate:      document.getElementById('fStart').value || null,
    endDate:        document.getElementById('fEnd').value   || null,
  };

  try {
    if (editingId) {
      const updated = await updateSubscription(editingId, data);
      const idx = allSubscriptions.findIndex(s => s.id === editingId);
      if (idx !== -1) allSubscriptions[idx] = updated;
      showToast('Subscription updated.', 'success');
    } else {
      const created = await addSubscription(data);
      allSubscriptions.push(created);
      showToast('Subscription added.', 'success');
    }
    resetForm();
    applyFilters();
    updateStats();
  } catch (e) {
    showToast('Error: ' + e.message, 'error');
  }
}

function validateForm() {
  let ok = true;
  const name  = document.getElementById('fName').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const plan  = document.getElementById('fPlan').value;

  setFieldError('fName', 'errName', !name ? 'Required' : '');
  if (!name) ok = false;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  setFieldError('fEmail', 'errEmail', !email ? 'Required' : !emailOk ? 'Invalid email' : '');
  if (!email || !emailOk) ok = false;

  setFieldError('fPlan', 'errPlan', !plan ? 'Select a plan' : '');
  if (!plan) ok = false;

  return ok;
}

function setFieldError(inputId, errId, msg) {
  const el = document.getElementById(inputId);
  el.classList.toggle('error', !!msg);
  document.getElementById(errId).textContent = msg;
}

// ── Delete ─────────────────────────────────────────────────
function openDeleteConfirm(id) {
  const s = allSubscriptions.find(x => x.id === id);
  if (!s) return;
  deleteTargetId = id;
  document.getElementById('confirmMsg').textContent = `Delete "${s.subscriberName}"? This cannot be undone.`;
  document.getElementById('confirmOverlay').classList.add('open');
}

function closeDeleteConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
  deleteTargetId = null;
}

async function confirmDelete() {
  try {
    await deleteSubscription(deleteTargetId);
    allSubscriptions = allSubscriptions.filter(s => s.id !== deleteTargetId);
    showToast('Subscription deleted.', 'success');
    closeDeleteConfirm();
    applyFilters();
    updateStats();
  } catch (e) {
    showToast('Delete failed: ' + e.message, 'error');
  }
}

// ── Toast ──────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ── Utility ────────────────────────────────────────────────
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
