import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Mediator from '../pages/Mediator.vue'
import Login from '../pages/Login.vue'
import Callback from '../pages/Callback.vue'
import Dashboard from '../pages/Admin/DashBoard.vue'
import { authGuard } from './authGuard'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ============================================
    // ROTAS ABERTAS (Públicas)
    // ============================================
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
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback
    },
    
    // ============================================
    // ROTAS AUTENTICADAS (Requerem login)
    // ============================================
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      beforeEnter: authGuard
    }
  ]
})

export default router

