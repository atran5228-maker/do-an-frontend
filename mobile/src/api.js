import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const BASE_URL = 'http://192.168.1.5:5000/api'

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 })

let onUnauthorized = null
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn
}

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login') && onUnauthorized) {
      onUnauthorized()
    }
    return Promise.reject(error)
  }
)

export const getErrorMessage = (error, fallback = 'Có lỗi xảy ra, vui lòng thử lại') => {
  if (!error.response) {
    return 'Không kết nối được máy chủ. Hãy kiểm tra backend đang chạy và địa chỉ IP trong api.js'
  }
  return error.response.data?.message || fallback
}

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
}

export const walletApi = {
  getAll: () => api.get('/wallets'),
}

export const transactionApi = {
  getAll: (params = {}) => api.get('/transactions', { params }),
}

export default api