<template>
  <div :class="['app', theme]">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import { useTheme } from './stores/theme'
export default {
  components: { Navbar },
  setup(){
    const theme = useTheme()
    return { theme: theme.current }
  }
}
</script>

<style>
/* global adjustments if needed */
.app{min-height:100vh}
main{padding-top:72px}
</style>
