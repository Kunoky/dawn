import { defineStore } from 'pinia'
import * as service from '@/services/app'
import { loadLanguageAsync } from '@/i18nSetup'
import zhCn from 'element-plus/dist/locale/zh-cn'

export const useAppStore = defineStore('app', () => {
  const loading = reactive({
    posts: false,
    lang: false,
  })
  const posts = ref([])
  const total = computed(() => posts.value.length)
  async function listPost() {
    loading.posts = true
    try {
      const res = await service.listPost()
      posts.value = res
    } catch (e) {
      console.error('load post fail: ', e)
    } finally {
      loading.posts = false
    }
  }

  const user = reactive({})
  const getUserById = computed(() => id => {
    if (!Object.hasOwn(user, id)) {
      getUser(id)
    }
    return user[id]
  })
  async function getUser(id, force) {
    if (user[id] && !force) return
    user[id] = null
    try {
      const res = await service.getUser(id)
      user[id] = res
    } catch (e) {
      console.error('load post fail: ', e)
    }
  }

  const lang = ref('zh-CN')
  const langs = ref([
    {
      value: 'zh-CN',
      label: '简体中文',
    },
    {
      value: 'en',
      label: 'English',
    },
  ])
  const elLangs = reactive({
    'zh-CN': {
      value: zhCn,
      name: 'zh-cn',
    },
    en: {
      value: null,
      name: 'en',
      loader: () => import('element-plus/dist/locale/en'),
    },
  })
  const elLang = computed(() => elLangs[lang.value].value)
  async function setLang(v) {
    loading.lang = true
    try {
      const loaders = [loadLanguageAsync(v)]
      if (!elLangs[v].value) {
        // loaders.push(import(`../../node_modules/element-plus/dist/locale/${elLangs[lang].name}.mjs`))
        loaders.push(elLangs[v].loader())
      }
      const [, res] = await Promise.all(loaders)
      if (res) {
        elLangs[v].value = res.default
      }
      lang.value = v
    } finally {
      loading.lang = false
    }
  }

  return {
    posts,
    total,
    user,
    getUserById,
    lang,
    langs,
    elLang,
    loading,
    listPost,
    getUser,
    setLang,
  }
})
