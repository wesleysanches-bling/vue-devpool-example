import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Mediator from '../pages/Mediator.vue'
import Login from '../pages/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/mediator',
      name: 'Mediator',
      component: Mediator
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

export default router

