<template>
  <div class="py-12 px-6 uppercase font-semibold"> page not found, <router-link to="/events" class="text-primary">go home</router-link></div>
</template>

<script>
// fallback page for 404 route
export default {
  name: 'NotFound'
}
</script>
<style lang="scss" scoped>
.text-primary {
  color: #7a2ad6;
}
</style>
