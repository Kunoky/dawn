import { defineStore } from 'pinia'
import * as service from '@/services/user'
import {
  setToken,
  getToken,
  removeToken,
  // ssoLogin, ssoLogout
} from '@/utils/auth'
import router, { dynamicRoutes } from '@/router'

const menuCache = useStorageC('menu', [])
const userCache = useStorageC('user', {})
// 选项式样例
export const useUserStore = defineStore('user', {
  state() {
    return {
      user: userCache.value,
      loading: {
        login: false,
        get: false,
      },
      menu: menuCache.value,
      menuTree: [],
      keyMenu: {},
      initialized: false,
    }
  },
  getters: {
    permission() {
      return this.user?.permissions || []
    },
  },
  actions: {
    async init() {
      if (!getToken()) return this.goLogin()
      await Promise.all([this.getUser(), this.listMenu()])
      this.genMenu()
      this.initialized = true
      return true
    },
    async login(user) {
      try {
        this.loading.login = true
        const res = await service.login(user)
        if (res.code === 200) {
          setToken(res.token)
          await this.init()
        }
        return res
      } catch (e) {
        console.error('login fail: ', e)
      } finally {
        this.loading.login = false
      }
    },
    async getUser(force) {
      if (!force && this.user?.userId) return this.user
      this.loading.get = true
      const { user, roles, permissions, code } = await service.getUser()
      this.loading.get = false
      if (code !== 200) return null
      this.user = {
        ...user,
        permissions,
        roles,
      }
      userCache.value = this.user
      return this.user
    },
    goLogin() {
      // ssoLogin()
      const route = router.currentRoute
      router.push({
        path: '/login',
        query: { redirect: route.value.fullPath },
      })
    },
    async logout(go2login) {
      removeToken()
      userCache.value = null
      menuCache.value = []
      this.user = {}
      this.menuTree = []
      this.initialized = false
      const route = router.currentRoute
      if (go2login || !route.value.meta?.public) {
        this.goLogin()
        // ssoLogout()
      }
    },
    hasPermission(permissions) {
      return this.permission.some(i => permissions?.some(j => utils.wildMatch(j, i)))
    },
    async listMenu() {
      if (menuCache.value.length) return
      const res = await service.listRoute()
      this.menu = res.data || []
    },
    transferRoute(routes, keyMenu = {}, pName = '') {
      routes.forEach(i => {
        i.pName = pName
        i.name = pName + i.name
        keyMenu[i.name] = i
        if (i.children) {
          this.transferRoute(i.children, keyMenu, i.name)
        }
      })
      return keyMenu
    },
    genMenu() {
      // const keyMenu = {}
      // const menu = this.menu.filter(i => {
      //   keyMenu[i.key] = i
      //   if (i.meta?.public || this.hasPermission(i.key)) return true
      //   return false
      // })
      // const [tree] = utils.arr2tree(menu)
      // this.keyMenu = keyMenu
      // this.menuTree = tree[0]?.children
      if (this.menu) {
        const keyMenu = this.transferRoute(this.menu)
        this.keyMenu = keyMenu
      }
      this.menuTree = this.menu
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
