import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import Profile from './pages/Profile.vue'
import Notes from './pages/Notes.vue'
import Works from './pages/Works.vue'
import Schedule from './pages/Schedule.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile },
  { path: '/notes', component: Notes },
  { path: '/works', component: Works },
  { path: '/schedule', component: Schedule },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
