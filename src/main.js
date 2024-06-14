import { createApp } from 'vue'
import router from './router'
import { i18n } from './i18nSetup'
import { createPinia } from 'pinia'
import App from './App.vue'
import { _dict, init as initDict } from './utils/dict'
import Permission from '@/plugins/permission'
import Role from '@/plugins/role'
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
app.config.globalProperties.$previewFile = file => {
  window.open(import.meta.env.VITE_SERVER_PATH + '/file/download?filePath=' + (file.path || file.url))
}
const dictFormatter = {}
app.config.globalProperties.$dictFormatter = function (type) {
  return (dictFormatter[type] ??= function (row, column) {
    return _dict[type].kv[row[column.property]]
  })
}

// router.beforeEach中权限判断需要在userStore初始化后
const userStore = useUserStore()
app.use(Permission, {
  hasPermission: userStore.hasPermission,
})
app.use(Role, {
  hasRole: userStore.hasRole,
})
// userStore.init().then(() => {
app.use(router)
app.mount('#app')
// })

// 阻止firefox打开新tab
document.body.ondrop = function (e) {
  e.stopPropagation()
  e.preventDefault()
}
// 阻止数字输入框悬浮时默认提示
document.body.addEventListener('mouseover', e => {
  if (e.target.tagName === 'INPUT' && e.target.type === 'number' && e.target.title !== ' ') {
    e.target.title = ' '
  }
})
