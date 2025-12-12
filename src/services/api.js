import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
})

// request interceptor: attach token
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = 'Bearer ' + token
  return cfg
}, err => Promise.reject(err))

// response interceptor: handle errors globally
api.interceptors.response.use(res => res, err => {
  const msg = err.response?.data?.error || err.message || '网络或服务器错误'
  return Promise.reject(new Error(msg))
})

export default api
