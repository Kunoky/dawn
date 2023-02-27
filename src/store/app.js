import { defineStore } from 'pinia'
import * as service from '@/services/app'
import { loadLanguageAsync } from '@/i18nSetup'
import { arr2tree } from '@/utils/common'

export const useAppStore = defineStore('app', {
  state: () => {
    const menuStr = localStorage.getItem('menuTree')
    let menuTree = []
    if (menuStr) {
      menuTree = JSON.parse(menuStr)
    }
    return {
      posts: [],
      user: {},
      lang: 'zh-CN',
      menuTree,
      langs: [
        {
          value: 'zh-CN',
          label: '简体中文',
        },
        {
          value: 'en',
          label: 'English',
        },
      ],
      loading: {
        posts: false,
        lang: false,
      },
    }
  },
  getters: {
    total: state => state.posts.length,
  },
  actions: {
    async listPost() {
      this.loading.posts = true
      try {
        const posts = await service.listPost()
        this.posts = posts
      } catch (e) {
        console.error('load post fail: ', e)
      } finally {
        this.loading.posts = false
      }
    },
    async getUser(id, force) {
      if (this.user[id] && !force) return
      this.user[id] = true
      try {
        const user = await service.getUser(id)
        this.user = { ...this.user, [id]: user }
      } catch (e) {
        console.error('load post fail: ', e)
      } finally {
        if (this.user[id] === true) {
          this.user[id] = null
        }
      }
    },
    async setLang(lang) {
      this.loading.lang = true
      try {
        await loadLanguageAsync(lang)
        this.lang = lang
      } finally {
        this.loading.lang = false
      }
    },
    genMenu() {
      const menu = [
        {
          id: 1,
          key: '/',
          val: '导航一',
          meta: '{"title":"导航一","icon":"message"}',
        },
        {
          id: 2,
          key: '/demo',
          val: 'demo',
          pId: 1,
        },
        {
          id: 3,
          key: '/path1',
          val: '二级-选项1',
          pId: 1,
        },
        {
          id: 4,
          key: '/path2',
          val: '二级-选项2',
          pId: 1,
        },
        {
          id: 5,
          key: '/path2/path3',
          val: '三级-选项3',
          pId: 4,
        },
        {
          id: 6,
          key: '/path2/path4',
          val: '三级-选项4',
          pId: 4,
        },
        {
          id: 7,
          key: 'https://cn.vitejs.dev/',
          val: 'Vite',
        },
        {
          id: 8,
          key: 'https://pinia.vuejs.org/zh/',
          val: 'Pinia',
        },
        {
          id: 9,
          key: 'https://vitest.dev/',
          val: 'Vitest',
        },
      ]

      const [menuTree] = arr2tree(menu)
      this.menuTree = menuTree
      localStorage.setItem('menuTree', JSON.stringify(menuTree))
    },
  },
})
