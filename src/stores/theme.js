import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTheme = defineStore('theme', ()=>{
  const current = ref(localStorage.getItem('theme')||'light')
  function toggle(){
    current.value = current.value === 'light' ? 'dark':'light'
    localStorage.setItem('theme', current.value)
  }
  return { current, toggle }
})
