<template>
  <section class="section">
    <div class="card">
      <h2>课程表</h2>
      <textarea v-model="data" rows="12" class="input"></textarea>
      <div style="margin-top:8px"><button class="btn" @click="save">保存课程表</button></div>
      <div style="margin-top:12px"><h3>预览</h3><pre>{{ data }}</pre></div>
    </div>
  </section>
</template>

<script>
import api from '../services/api'
export default {
  data(){ return { data:'' } },
  async mounted(){ const res = await api.get('/api/schedule'); this.data = res.data.data || '' },
  methods:{
    async save(){ await api.post('/api/schedule', { data:this.data }); alert('已保存') }
  }
}
</script>
