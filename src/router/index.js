// import { h } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// import { ElLoading, ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { useUserStore } from '../store/user'

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      public: true,
    },
    component: () => import('@/view/user/login.vue'),
  },
  {
    path: '/',
    name: 'layout',
    meta: {
      title: '',
    },
    component: () => import('../layouts/BaseLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          title: 'demo',
          public: true,
        },
        component: () => import('@/view/Home.vue'),
      },
      {
        path: 'demo',
        name: 'demo',
        meta: {
          title: 'demo',
        },
        component: () => import('@/view/demo/index.vue'),
      },
      {
        path: 'component/page-wrapper',
        name: 'componentPageWrapper',
        meta: {
          title: '分页容器',
        },
        component: () => import('@/view/components/PageWrapperView.vue'),
      },
      {
        path: 'component/c-table',
        name: 'componentCTable',
        meta: {
          title: '通用表格',
        },
        component: () => import('@/view/components/CTableView.vue'),
      },
      {
        path: 'setting/dict',
        name: 'settingDict',
        meta: {
          title: '字典管理',
        },
        component: () => import('@/view/dict/index.vue'),
      },
      {
        path: 'setting/permission',
        name: 'settingPermission',
        meta: {
          title: '权限管理',
        },
        component: () => import('@/view/setting/permission/index.vue'),
      },
      {
        path: 'setting/role',
        name: 'settingRole',
        meta: {
          title: '角色管理',
        },
        component: () => import('@/view/setting/role/index.vue'),
      },
      {
        path: 'setting/user',
        name: 'settingUser',
        meta: {
          title: '用户管理',
        },
        component: () => import('@/view/setting/user/index.vue'),
      },
      { path: 'path1', name: 'path1', component: h('h1', 'path1') },
      { path: 'path2', name: 'path2', component: h('h1', 'path2') },
      { path: 'path3', name: 'path3', component: h('h1', 'path3') },
      { path: 'path4', name: 'path4', component: h('h1', 'path4') },
      { path: 'path5', name: 'path5', component: h('h1', 'path5') },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: {
      public: true,
    },
    component: () => import('@/view/NotFound.vue'),
  },
]

// 若路由组件存在嵌套，请确保父组件在前，子组件在后；父组件有且唯一的name属性，子组件使用pName指向父组件的name属性，以便于后面迭代此数组一遍便可完成动态添加
export const dynamicRoutes = [
  { path: 'path6', pName: 'layout', component: h('h1', 'path6') },
  { path: 'path7', pName: 'layout', component: h('h1', 'path7') },
]

const router = createRouter({
  history: import.meta.env.DEV
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes,
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
  const hasAuth = userStore.hasPermission(to.name)
  if (hasAuth) return
  if (hasToken) {
    if (from.name === 'login') return '/'
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
