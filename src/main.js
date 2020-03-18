import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {rtdbPlugin} from 'vuefire'
import VueCookie from 'vue-cookie'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

require('./firebase.config.js')

Vue.config.productionTip = false

Vue.use(rtdbPlugin)
Vue.use(VueCookie)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
