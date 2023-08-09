// import { h } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router/auto'
// import { ElLoading, ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { useUserStore } from '../store/user'

const baseRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      public: true,
    },
    component: () => import('@/views/user/login.vue'),
  },
  {
    path: '/',
    name: 'Layout',
    meta: {
      title: '',
    },
    component: () => import('../layouts/BaseLayout.vue'),
    redirect: '/home',
  },
]

// 若路由组件存在嵌套，请确保父组件在前，子组件在后；父组件有且唯一的name属性，子组件使用pName指向父组件的name属性，以便于后面迭代此数组一遍便可完成动态添加
export const dynamicRoutes = [
  // { path: 'path6', pName: 'layout', component: h('h1', 'path6') },
  // { path: 'path7', pName: 'layout', component: h('h1', 'path7') },
]

const router = createRouter({
  history: import.meta.env.DEV
    ? createWebHashHistory(import.meta.env.VITE_BASE_URL)
    : createWebHistory(import.meta.env.VITE_BASE_URL),
  extendRoutes: routes => {
    baseRoutes[1].children = routes
    return baseRoutes
  },
})
let loadingInstance, timer
router.beforeEach(async (to, from) => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    loadingInstance = ElLoading.service({
      target: '.el-main',
    })
  }, 200)
  const hasToken = !!getToken()
  if (to.path === '/login') {
    if (hasToken) {
      return '/'
    }
  }
  const userStore = useUserStore()
  const meta = userStore.keyMenu[to.name]?.meta
  to.meta = {
    ...to.meta,
    ...meta,
  }
  if (to.meta.public) return
  const hasAuth = true // userStore.hasPermission(to.name)
  if (hasAuth) return
  if (hasToken) {
    if (from.name === 'Login') return '/'
    ElMessage({
      message: '权限不足',
      type: 'error',
      duration: 5 * 1000,
    })
    return false
  }
  return {
    path: '/login',
    query: { redirect: to.fullPath },
  }
})

router.afterEach(to => {
  clearTimeout(timer)
  timer = 0
  loadingInstance?.close()
  let i = to.matched.length - 1,
    item,
    title = __APP_NAME__
  for (; i > -1; i--) {
    item = to.matched[i]
    if (item.meta.title) {
      title += '-' + to.meta.title
      break
    }
  }
  if (title !== document.title) {
    document.title = title
  }
})

router.scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    return { left: 0, top: 0 }
  }
}

router.onError(error => {
  console.error(error)
  const pattern = /Loading chunk (\d) + failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    location.reload()
  }
})

export default router
