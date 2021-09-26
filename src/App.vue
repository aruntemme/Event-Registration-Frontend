<template>
  <div id="app">
    <router-view/>
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
