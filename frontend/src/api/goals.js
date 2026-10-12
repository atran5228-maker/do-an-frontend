import api from './http'

export const goalApi = {
  getAll: () => api.get('/savings-goals'),
  create: (data) => api.post('/savings-goals', data),
  update: (id, data) => api.put(`/savings-goals/${id}`, data),
  updateProgress: (id, amount) => api.put(`/savings-goals/${id}/progress`, { amount }),
  remove: (id) => api.delete(`/savings-goals/${id}`),
}