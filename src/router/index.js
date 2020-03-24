import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

// VERY BASIC ADMIN PAGE PROTECTION
function guard(a, b, next) {
  if (Vue.cookie.get('adminAllowed')|| prompt('Please enter the password to view this page:') === 'admin1234') {
    next()
    Vue.cookie.set('adminAllowed', true)
  } else {
    next('/')
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  {
    path: '/game',
    name: 'Play',
    component: () => import('../views/Play.vue')
  },
  {
    beforeEnter: guard,
    path: '/admin',
    name: 'Admin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Admin.vue')
  },
  {
    beforeEnter: guard,
    path: '/admin/:gameID',
    name: 'Play - Admin',
    component: () => import('../views/Game.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
