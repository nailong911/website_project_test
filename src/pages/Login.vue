<template>
  <section class="section">
    <div class="card form">
      <h2>登录</h2>
      <input v-model="username" class="input" placeholder="用户名或邮箱"/>
      <input v-model="password" type="password" class="input" placeholder="密码"/>
      <div style="display:flex;gap:8px">
        <button class="btn" @click="doLogin">登录</button>
        <router-link to="/register">注册</router-link>
      </div>
      <p class="muted">{{ msg }}</p>
    </div>
  </section>
</template>

<script>
import api from '../services/api'
import { useAuth } from '../stores/auth'
export default {
  data(){ return { username:'', password:'', msg:'' } },
  setup(){ const auth = useAuth(); return { auth } },
  methods:{
    async doLogin(){
      try{
        const res = await api.post('/api/auth/login', { username:this.username, password:this.password });
        this.auth.setToken(res.data.token);
        await this.auth.fetchMe();
        this.msg='登录成功'; location.href='/'
      }catch(e){ this.msg = e.response?.data?.error || '登录失败' }
    }
  }
}
</script>
