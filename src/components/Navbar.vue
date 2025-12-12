<template>
  <nav class="nav">
    <div class="brand">UltraPortfolio</div>
    <div class="links">
      <router-link to="/">首页</router-link>
      <router-link to="/notes">备忘录</router-link>
      <router-link to="/works">作品</router-link>
      <router-link to="/schedule">课程表</router-link>
      <router-link to="/profile">我的</router-link>
      <button class="btn" @click="handleAuth">{{ auth.token ? '登出' : '登录' }}</button>
    </div>
  </nav>
</template>

<script>
import { useAuth } from '../stores/auth'
export default {
  setup(){
    const auth = useAuth()
    function handleAuth(){
      if(auth.token){ auth.logout(); location.href='/' } else { location.href='/login' }
    }
    return { auth, handleAuth }
  }
}
</script>
