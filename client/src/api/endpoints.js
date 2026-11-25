import { api } from './client.js';

// ─── Auth ───────────────────────────────────────────────
export const authApi = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }, { auth: false }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }, { auth: false }),
  me: () => api.get('/auth/me'),
};

// ─── Workspaces ─────────────────────────────────────────
export const workspaceApi = {
  list: () => api.get('/workspaces'),
  create: (name, color) => api.post('/workspaces', { name, color }),
  get: (id) => api.get(`/workspaces/${id}`),
  update: (id, patch) => api.patch(`/workspaces/${id}`, patch),
  remove: (id) => api.del(`/workspaces/${id}`),
};

// ─── Cards (nested under a workspace) ───────────────────
export const cardApi = {
  list: (wsId) => api.get(`/workspaces/${wsId}/cards`),
  create: (wsId, card) => api.post(`/workspaces/${wsId}/cards`, card),
  update: (wsId, cardId, patch) => api.patch(`/workspaces/${wsId}/cards/${cardId}`, patch),
  move: (wsId, cardId, to) => api.patch(`/workspaces/${wsId}/cards/${cardId}/move`, to),
  remove: (wsId, cardId) => api.del(`/workspaces/${wsId}/cards/${cardId}`),
};
