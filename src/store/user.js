import { defineStore } from 'pinia'
// import * as service from '@/services/user'
import { setToken, removeToken } from '@/utils/auth'
import router, { dynamicRoutes } from '@/router'

export const useUserStore = defineStore('user', {
  state: () => {
    const userStr = localStorage.getItem('user')
    let user = null,
      permission = []
    if (userStr) {
      user = JSON.parse(userStr)
      permission = user.permission
    }
    return {
      user: user,
      permission: permission,
      loading: {
        login: false,
      },
    }
  },
  getters: {},
  actions: {
    async login(user) {
      try {
        this.loading.login = true
        if (user.username === 'admin' && user.password === 'admin') {
          const data = {
            name: 'Admin',
            username: 'admin',
            permission: [],
            token: 'token',
          }
          localStorage.setItem('user', JSON.stringify(data))
          this.user = data
          this.permission = data.permission
          setToken(data.token)
        } else {
          return { msg: '用户名或密码错误' }
        }
        // const data = await service.login(user)
        // this.user = data
        return true
      } catch (e) {
        console.error('login fail: ', e)
        return e
      } finally {
        this.loading.login = false
      }
    },
    logout(go2login) {
      removeToken()
      localStorage.removeItem('user')
      localStorage.removeItem('menuTree')
      const route = router.history.current
      // TODO 当前路由是否需要登录
      const authRequired = true
      if (go2login || authRequired) {
        router.push({
          path: '/login',
          query: { redirect: route.fullPath },
        })
      }
    },
    addDynamicRoutes() {
      // TODO 如果需要，将此代码移至权限获取处，并完善动态添加路由
      dynamicRoutes.forEach(i => {
        let hasAuth = true
        if (!hasAuth) return
        if (i.pName) {
          router.addRoute(i.pName, i)
        } else {
          router.addRoute(i)
        }
      })
    },
  },
})
