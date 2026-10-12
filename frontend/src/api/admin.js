import api from './http'

// API quản trị hệ thống (chỉ tài khoản admin)
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (search = '') => api.get('/admin/users', { params: search ? { search } : {} }),
  setStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  resetPassword: (id, newPassword) => api.patch(`/admin/users/${id}/reset-password`, { newPassword }),
  remove: (id) => api.delete(`/admin/users/${id}`),
}
