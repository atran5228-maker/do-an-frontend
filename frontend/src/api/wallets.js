import api from './http'

export const walletApi = {
  getAll: () => api.get('/wallets'),
  create: (data) => api.post('/wallets', data),
  update: (id, data) => api.put(`/wallets/${id}`, data),
  remove: (id) => api.delete(`/wallets/${id}`),
  transfer: (from_wallet_id, to_wallet_id, amount) =>
    api.post('/wallets/transfer', { from_wallet_id, to_wallet_id, amount }),
}
