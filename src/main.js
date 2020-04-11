import Vue from 'vue'
import App from './App.vue'
import router from './router'

import {rtdbPlugin} from 'vuefire'

import VueCookie from 'vue-cookie'

import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

require('./firebase.config.js')

Vue.config.productionTip = false

Vue.use(rtdbPlugin)
Vue.use(VueCookie)

Sentry.init({
  dsn: 'https://14d985b74ef84461a63ee2fee5d1ee1d@o374896.ingest.sentry.io/5196769',
  integrations: [new Integrations.Vue({Vue, attachProps: true})],
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
