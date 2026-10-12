import api from './http'

export const accountApi = {
  getProfile: () => api.get('/account/profile'),
  updateProfile: (data) => api.put('/account/profile', data),
  changePassword: (currentPassword, newPassword) =>
    api.put('/account/password', { currentPassword, newPassword }),
}