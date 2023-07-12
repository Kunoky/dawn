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
    component: () => import('@/views/user/login.vue'),
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
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'demo',
        name: 'demo',
        meta: {
          title: 'demo',
        },
        component: () => import('@/views/demo/index.vue'),
      },
      {
        path: 'component/page-wrapper',
        name: 'componentPageWrapper',
        meta: {
          title: '分页容器',
        },
        component: () => import('@/views/components/PageWrapperView.vue'),
      },
      {
        path: 'component/c-table',
        name: 'componentCTable',
        meta: {
          title: '通用表格',
        },
        component: () => import('@/views/components/CTableView.vue'),
      },
      {
        path: 'setting/dict',
        name: 'settingDict',
        meta: {
          title: '字典管理',
        },
        component: () => import('@/views/dict/index.vue'),
      },
      {
        path: 'setting/permission',
        name: 'settingPermission',
        meta: {
          title: '权限管理',
        },
        component: () => import('@/views/setting/permission/index.vue'),
      },
      {
        path: 'setting/role',
        name: 'settingRole',
        meta: {
          title: '角色管理',
        },
        component: () => import('@/views/setting/role/index.vue'),
      },
      {
        path: 'setting/user',
        name: 'settingUser',
        meta: {
          title: '用户管理',
        },
        component: h('h1', 'TODO'),
      },
      {
        path: '/system/menu',
        component: () => import('@/views/system/menu/index.vue'),
        name: 'SystemMenu',
        meta: { title: '菜单管理', activeMenu: '/system/menu' },
      },
      {
        path: '/system/user-auth/role/:userId(\\d+)',
        component: h('h1', 'TODO'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' },
      },
      {
        path: '/system/role-auth/user/:roleId(\\d+)',
        component: h('h1', 'TODO'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' },
      },
      {
        path: '/system/dict-data/index/:dictId(\\d+)',
        component: h('h1', 'TODO'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' },
      },
      {
        path: '/monitor/job-log/index/:jobId(\\d+)',
        component: h('h1', 'TODO'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' },
      },
      {
        path: '/tool/gen-edit/index/:tableId(\\d+)',
        component: h('h1', 'TODO'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: {
      public: true,
    },
    component: () => import('@/views/NotFound.vue'),
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
  const hasAuth = true // userStore.hasPermission(to.name)
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
