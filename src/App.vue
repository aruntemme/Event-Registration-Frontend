<template>
  <div id="app" class="flex flex-col h-screen justify-between">
    <router-view class="mb-auto "/>
    <Footer />
  </div>
</template>

<script>
import Footer from './components/Footer.vue'
// import Header from '@/components/Header.vue'

export default {
  components: { Footer },
  name: 'App'
  // components: {
  //   Header
  //    <Header />
  // }
}
</script>
