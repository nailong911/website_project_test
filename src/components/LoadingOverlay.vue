<template>
  <div class="loading-overlay" v-if="visible">
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {
  props:{ visible:Boolean }
}
</script>

<style scoped>
</style>
