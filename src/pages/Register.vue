<template>
  <section class="section">
    <div class="card form">
      <h2>注册</h2>
      <input v-model="username" class="input" placeholder="用户名"/>
      <input v-model="email" class="input" placeholder="邮箱"/>
      <input v-model="password" type="password" class="input" placeholder="密码"/>
      <input v-model="nickname" class="input" placeholder="昵称 (可选)"/>
      <button class="btn" :disabled="loading" @click="doRegister">{{ loading ? '注册中...' : '注册' }}</button>
      <p class="muted">{{ msg }}</p>
    </div>
  </section>
</template>

<script>
import { useAuth } from '../stores/auth'
export default {
  setup(){
    const auth = useAuth()
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const nickname = ref('')
    const msg = ref('')
    const loading = ref(false)

    async function doRegister(){
      msg.value=''
      loading.value = true
      try{
        await auth.register({ username: username.value, email: email.value, password: password.value, nickname: nickname.value })
        msg.value = '注册成功，请登录'
        setTimeout(()=>{ location.href='/login' }, 800)
      }catch(e){
        msg.value = e?.toString() || '注册失败'
      }finally{ loading.value = false }
    }

    return { username, email, password, nickname, msg, loading, doRegister }
  }
}
</script>
