import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useAuth = defineStore('auth', ()=>{
  const token = ref(localStorage.getItem('token')||'')
  const user = ref(null)

  async function fetchMe(){
    if(!token.value) return null
    try{
      const res = await api.get('/api/auth/me', { headers: { Authorization: 'Bearer '+token.value }})
      user.value = res.data
      return user.value
    }catch(e){ console.error(e); logout(); return null }
  }
  async function register(data){
    try{
      const res = await api.post('/api/auth/register', data)
      return res.data
    }catch(e){ console.error('register error', e); throw e }
  }
  async function login(data){
    try{
      const res = await api.post('/api/auth/login', data)
      const t = res.data.token || res.data?.token
      if(t){ setToken(t); await fetchMe(); return true }
      return false
    }catch(e){ console.error('login error', e); throw e }
  }
  function setToken(t){ token.value = t; localStorage.setItem('token', t) }
  function logout(){ token.value=''; user.value=null; localStorage.removeItem('token') }

  return { token, user, fetchMe, register, login, setToken, logout }
})
