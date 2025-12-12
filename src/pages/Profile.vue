<template>
  <section class="section">
    <div class="card form" v-if="user">
      <h2>个人资料</h2>
      <div style="display:flex;gap:12px;align-items:center">
        <img :src="user.avatar ? '/' + user.avatar : '/public/avatar-placeholder.png'" style="width:96px;height:96px;border-radius:16px;object-fit:cover"/>
        <div>
          <div><strong>{{ user.nickname }}</strong> (@{{ user.username }})</div>
          <div class="muted">{{ user.email }}</div>
        </div>
      </div>
      <input v-model="form.nickname" class="input" placeholder="昵称"/>
      <textarea v-model="form.bio" class="input" rows="4" placeholder="简介"></textarea>
      <div style="display:flex;gap:8px">
        <input type="file" @change="uploadAvatar"/>
        <button class="btn" @click="save">保存</button>
      </div>
      <p class="muted">{{ status }}</p>
    </div>
    <div v-else class="muted">请先登录</div>
  </section>
</template>

<script>
import api from '../services/api'
import { useAuth } from '../stores/auth'
export default {
  data(){ return { user:null, form:{nickname:'',bio:''}, status:'' } },
  async mounted(){ const auth = useAuth(); await auth.fetchMe(); this.user = auth.user; if(this.user){ this.form.nickname = this.user.nickname; this.form.bio = this.user.bio } },
  methods:{
    async save(){
      try{
        const token = localStorage.getItem('token')
        await api.post('/api/user/me', this.form, { headers:{ Authorization: 'Bearer '+token }});
        this.status='保存成功'
      }catch(e){ this.status = '保存失败' }
    },
    async uploadAvatar(e){
      const f = e.target.files[0]
      if(!f) return
      const fd = new FormData(); fd.append('avatar', f)
      const token = localStorage.getItem('token')
      const res = await api.post('/api/auth/avatar', fd, { headers:{ Authorization:'Bearer '+token, 'Content-Type':'multipart/form-data' }})
      if(res.data && res.data.avatar){ this.user.avatar = res.data.avatar; this.status='头像上传成功' }
    }
  }
}
</script>
