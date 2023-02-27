import Vue from 'vue'
import './style.css'
import 'oocss/src/index.css'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from '@/utils/request'
import { createPinia, PiniaVuePlugin } from 'pinia'
import { i18n } from './i18nSetup'

Vue.prototype.$axios = axios

Vue.use(ElementUI)
Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  router,
  pinia,
  i18n,
  render: h => h(App),
}).$mount('#app')
