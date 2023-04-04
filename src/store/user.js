import { defineStore } from 'pinia'
import * as service from '@/services/user'
import { listDict } from '@/services/dict'
import { setToken, removeToken } from '@/utils/auth'
import router, { dynamicRoutes } from '@/router'

export const useUserStore = defineStore('user', {
  state() {
    const userStr = localStorage.getItem('user')
    let user = null
    if (userStr) {
      user = JSON.parse(userStr)
    }
    return {
      user: user,
      loading: {
        login: false,
        get: false,
      },
      menu: [],
      menuTree: [],
      keyMenu: {},
    }
  },
  getters: {
    permission() {
      return this.user?.permission || {}
    },
  },
  actions: {
    async init() {
      if (!this.user) return
      await Promise.all([this.getUser(), this.listMenu()])
      this.genMenu()
    },
    async login(user) {
      try {
        this.loading.login = true
        const res = await service.login(user)
        if (!res.code) {
          this.user = res.data
          localStorage.setItem('user', JSON.stringify(res.data))
          setToken(res.data.token)
          await this.init()
        }
        return res
      } catch (e) {
        console.error('login fail: ', e)
      } finally {
        this.loading.login = false
      }
    },
    async getUser() {
      if (this.user.permission) return this.user
      this.loading.get = true
      const res = await service.getUser(this.user.id)
      this.loading.get = false
      this.user = {
        ...this.user,
        ...res,
      }
      return this.user
    },
    logout(go2login) {
      removeToken()
      localStorage.removeItem('user')
      localStorage.removeItem('menu')
      this.user = null
      this.menuTree = []
      const route = router.currentRoute
      if (go2login || !route.value.meta?.public) {
        router.push({
          path: '/login',
          query: { redirect: route.value.fullPath },
        })
      }
    },
    hasPermission(name, num) {
      if (!Object.hasOwnProperty.call(this.permission, name)) return false
      if (num && !utils.hasBit(this.permission[name], num)) return false
      return true
    },
    async listMenu() {
      // const menuStr = localStorage.getItem('menu')
      // if (menuStr) {
      //   return this.menu = JSON.parse(menuStr)
      // }
      const res = await listDict({ category: 'menu' })
      this.menu = res.list
      // localStorage.setItem('menu', JSON.stringify(this.menu))
    },
    genMenu() {
      const keyMenu = {}
      const menu = this.menu.filter(i => {
        keyMenu[i.key] = i
        if (i.meta?.public || this.hasPermission(i.key)) return true
        return false
      })
      const [tree] = utils.arr2tree(menu)
      this.keyMenu = keyMenu
      this.menuTree = tree[0]?.children
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
