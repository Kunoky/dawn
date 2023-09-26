import { defineStore } from 'pinia'
import * as service from '@/services/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
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
      idMenu: {},
      keyMenu: {},
      permission: [],
    }
  },
  actions: {
    async init() {
      if (!getToken()) return
      await Promise.all([this.getUser(), this.listMenu()])
      this.genMenu()
    },
    async login(user) {
      try {
        this.loading.login = true
        const res = await service.login(user)
        if (res.code === 200) {
          setToken(res.data.tokenValue)
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
      const { data, code } = await service.getUser()
      this.loading.get = false
      if (code !== 200) return null
      this.user = data
      userCache.value = data
      return this.user
    },
    logout(go2login) {
      removeToken()
      userCache.value = null
      menuCache.value = []
      this.user = {}
      this.menuTree = []
      const route = router.currentRoute
      if (go2login || !route.value.meta?.public) {
        router.push({
          path: '/login',
          query: { redirect: route.value.fullPath },
        })
      }
    },
    hasPermission(permissions) {
      return this.permission.some(i => permissions?.some(j => utils.wildMatch(j, i)))
    },
    async listMenu() {
      if (menuCache.value.length) return
      const res = await service.listRoute()
      this.menu = res.data
      // menuCache.value = res.data
    },
    genMenu() {
      const perms = [],
        menus = [],
        keyMenu = {}
      let menuItem = {}
      this.menu.forEach(i => {
        perms.push(i.path)
        if (i.menuType !== 2) {
          menuItem = {
            id: i.menuId,
            pId: i.parentId,
            path: i.path,
            name: i.routeName,
            meta: {
              title: i.menuName,
              icon: i.icon,
              isCache: i.isCache,
              type: i.menuType,
              visible: i.visible,
            },
          }
          i.status && i.visible && menus.push(menuItem)
          if (i.menuType === 1) {
            keyMenu[menuItem.name] = menuItem
          }
        }
      })
      const [tree, idNode] = utils.arr2tree(menus)
      this.menuTree = tree
      this.keyMenu = keyMenu
      this.permission = this.user.permissions
      // this.permission = [...this.user.permissions, ...perms]
      this.idMenu = idNode
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
