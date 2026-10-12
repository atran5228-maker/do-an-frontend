import axios from 'axios'

export const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.hash.includes('login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const getErrorMessage = (error, fallback = 'Có lỗi xảy ra, vui lòng thử lại') => {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') return 'Hết thời gian chờ — backend phản hồi quá lâu'
    return 'Không kết nối được backend! Hãy chắc chắn backend đang chạy: cd backend && nodemon index.js (cổng 5000)'
  }
  return error.response.data?.message || fallback
}

export default api