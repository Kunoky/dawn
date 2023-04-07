import { createApp } from 'vue'
import router from './router'
import ElementPlus from 'element-plus'
import { i18n } from './i18nSetup'
import { createPinia } from 'pinia'
import App from './App.vue'
import { init as initDict } from './utils/dict'
import Permission from '@/plugins/permission'
import { useUserStore } from './store/user'
import 'oocss/src/index.css'
import './styles/index.scss'

initDict()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(i18n)
app.use(ElementPlus, { size: 'default', zIndex: 999 })

app.config.errorHandler = err => {
  console.error(err)
}

// router.beforeEach中权限判断需要在userStore初始化后
const userStore = useUserStore()
app.use(Permission, {
  hasPermission: userStore.hasPermission,
})
userStore.init().then(() => {
  app.use(router)
  app.mount('#app')
})
