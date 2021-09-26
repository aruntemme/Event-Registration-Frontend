import { createRouter, createWebHistory } from 'vue-router'
import Signin from '@/components/Signin.vue'
import Signup from '@/components/Signup.vue'
import Dashboard from '@/components/Dashboard.vue'
import Events from '@/components/Events.vue'
import CreateEvent from '@/components/CreateEvent.vue'
import NotFound from '@/components/NotFound.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Signin
    },
    {
      path: '/events',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/events/created',
      name: 'created',
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
      path: '/events/:id/edit',
      name: 'EditEvent',
      component: CreateEvent
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
    },
    {
      path: '/:catchAll(.*)',
      component: NotFound
    }
  ]
})
