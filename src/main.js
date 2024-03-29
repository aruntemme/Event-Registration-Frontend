import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
import { securedAxiosInstance, plainAxiosInstance } from './connection/axios'
import './main.css'
import Unicon from 'vue-unicons'
import {
  uniStopwatch,
  uniRupeeSign,
  uniUsersAlt,
  uniUserPlus,
  uniAngleDown,
  uniUserCircle,
  uniMapMarkerAlt,
  uniBell
} from 'vue-unicons/dist/icons'

Unicon.add([
  uniStopwatch,
  uniRupeeSign,
  uniUsersAlt,
  uniUserPlus,
  uniAngleDown,
  uniUserCircle,
  uniMapMarkerAlt,
  uniBell
])

createApp({
  securedAxiosInstance,
  plainAxiosInstance,
  render: () => h(App)
})
  .use(Unicon)
  .use(router)
  .use(store)
  .use(VueAxios, {
    secured: securedAxiosInstance,
    plain: plainAxiosInstance
  })
  .mount('#app')
