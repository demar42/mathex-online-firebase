import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

require('./firebase.config.js')

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
