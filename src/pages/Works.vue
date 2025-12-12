<template>
  <section class="section">
    <div class="card">
      <h2>作品</h2>
      <form @submit.prevent="upload">
        <input v-model="title" class="input" placeholder="作品标题"/>
        <input v-model="desc" class="input" placeholder="描述"/>
        <input type="file" ref="file" />
        <div style="margin-top:8px"><button class="btn" type="submit">上传</button></div>
      </form>
      <div style="margin-top:12px">
        <div v-for="w in works" :key="w.id" class="card" style="margin-bottom:8px">
          <div><strong>{{ w.title }}</strong></div>
          <div class="muted">{{ w.description }}</div>
          <div v-if="w.file_path"><a :href="'/'+w.file_path" target="_blank">查看文件</a></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../services/api'
export default {
  data(){ return { title:'', desc:'', works:[] } },
  async mounted(){ await this.load() },
  methods:{
    async load(){ const res = await api.get('/api/works'); this.works = res.data || [] },
    async upload(){
      const f = this.$refs.file.files[0]; if(!f) return alert('请选择文件');
      const fd = new FormData(); fd.append('file', f); fd.append('title', this.title); fd.append('description', this.desc);
      const res = await api.post('/api/works/upload', fd, { headers:{ 'Content-Type':'multipart/form-data' }});
      if(res.data.ok){ this.title=''; this.desc=''; await this.load() }
    }
  }
}
</script>
