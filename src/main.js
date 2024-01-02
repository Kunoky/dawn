import { createApp } from 'vue'
import router from './router'
import { i18n } from './i18nSetup'
import { createPinia } from 'pinia'
import App from './App.vue'
import { _dict, init as initDict } from './utils/dict'
import Permission from '@/plugins/permission'
import { useUserStore } from './store/user'
import 'oocss/src/index.css'
import './styles/index.scss'

initDict()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(i18n)

app.config.errorHandler = err => {
  console.error('App Error: ', err)
}

app.config.globalProperties.$baseUrl = import.meta.env.VITE_SERVER_PATH
app.config.globalProperties.$utils = utils
app.config.globalProperties.$dict = _dict
app.config.globalProperties.$dictFormatter = function (type) {
  return function (row, column) {
    return _dict[type].kv[row[column.property]]
  }
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
