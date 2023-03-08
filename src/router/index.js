import { h } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import('@/view/user/login.vue'),
  },
  {
    path: '/',
    name: 'layout',
    meta: {
      title: '',
    },
    component: () => import('../layouts/index.vue'),
    redirect: '/demo',
    children: [
      {
        path: 'demo',
        meta: {
          title: 'demo',
        },
        component: () => import('@/view/demo/index.vue'),
      },
      {
        path: 'component/page-wrapper',
        meta: {
          title: '分页容器',
        },
        component: () => import('@/view/components/PageWrapper.vue'),
      },
      { path: 'path1', component: h('h1', 'path1') },
      { path: 'path2', component: h('h1', 'path2') },
      { path: 'path2/path3', component: h('h1', 'path3') },
      { path: 'path2/path4', component: h('h1', 'path4') },
      { path: 'path2/path4/path5', component: h('h1', 'path4') },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
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

router.beforeEach((to, from, next) => {
  // TODO 真正的权限判断
  let hasLogin = true,
    hasAuth = true
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (hasAuth) return next()
    if (hasLogin) {
      ElMessage({
        message: '权限不足',
        type: 'error',
        duration: 5 * 1000,
      })
      return next(false)
    }
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  } else if (to.path === '/login') {
    if (getToken()) {
      return next('/')
    }
  }
  next()
})

router.afterEach(to => {
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
  const pattern = /Loading chunk (\d) + failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    location.reload()
  }
})

export default router
