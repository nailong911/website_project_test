<template>
  <section class="section">
    <div class="card">
      <h2>备忘录</h2>
      <div style="display:flex;gap:12px">
        <input v-model="title" class="input" placeholder="标题"/>
        <button class="btn" @click="create">新建</button>
      </div>
      <div style="margin-top:12px">
        <div v-for="n in notes" :key="n.id" class="card" style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between">
            <strong>{{ n.title }}</strong>
            <div><button @click="del(n.id)">删除</button></div>
          </div>
          <textarea v-model="n.content" class="input" rows="4" @blur="save(n)"></textarea>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../services/api'
export default {
  data(){ return { notes:[], title:'' } },
  async mounted(){ await this.load() },
  methods:{
    async load(){ const res = await api.get('/api/notes'); this.notes = res.data || [] },
    async create(){ const res = await api.post('/api/notes', { title:this.title, content:'' }); this.title=''; await this.load() },
    async save(n){ await api.put('/api/notes/'+n.id, n) },
    async del(id){ await api.delete('/api/notes/'+id); await this.load() }
  }
}
</script>
