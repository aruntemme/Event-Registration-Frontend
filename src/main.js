import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
import { securedAxiosInstance, plainAxiosInstance } from './server/axios'
import './main.css'

createApp({
  securedAxiosInstance,
  plainAxiosInstance,
  render: () => h(App)
}).use(router).use(store).use(VueAxios, {
  secured: securedAxiosInstance,
  plain: plainAxiosInstance
}).mount('#app')
