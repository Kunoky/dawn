import { createApp } from 'vue'
import router from './router'
import ElementPlus from 'element-plus'
import { i18n } from './i18nSetup'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'oocss/src/index.css'
import './style.css'
import IconFont from '@/components/IconFont.vue'

const pinia = createPinia()
const app = createApp(App)

app.component('icon-font', IconFont)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ElementPlus, { size: 'small', zIndex: 999 })

app.config.errorHandler = err => {
  console.error(err)
}
app.mount('#app')
