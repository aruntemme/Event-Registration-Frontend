import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin.vue'
import Signup from '@/components/Signup.vue'
import Dashboard from '@/components/Dashboard.vue'
import Events from '@/components/Events.vue'
import CreateEvent from '@/components/CreateEvent.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/events',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/events/new',
      name: 'CreateEvent',
      component: CreateEvent
    },
    {
      path: '/events/:id',
      name: 'event',
      component: Events
    },
    {
      path: '/',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ]
})
