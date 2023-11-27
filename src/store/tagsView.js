import { defineStore } from 'pinia'

export const useTagsViewStore = defineStore('tagsView', () => {
  // const list = ref([{ name: 'Home', meta: { title: '首页', affix: true } }])
  // const names = ref(['Home'])
  const list = ref([])
  const names = ref([])
  watch(
    () => list.value.length,
    () => {
      names.value = list.value.map(i => i.name)
    }
  )

  const userStore = useUserStore()

  const add = route => {
    if (!route.name) return
    const routeInfo = userStore.keyMenu[route.name]
    if (!routeInfo) return
    if (names.value.includes(route.name) || !routeInfo.meta.isCache) return
    const isExist = list.value.some(i => i.name === route.name)
    if (isExist) {
      names.value = list.value.map(i => i.name)
    } else {
      list.value.push(routeInfo)
    }
  }

  const route = useRoute()
  const router = useRouter()
  const close = idx => {
    const r = list.value.splice(idx, 1)[0]
    if (r.name === route.name) {
      router.push({ name: list.value[idx - 1].name })
    }
  }

  function closeLeft(idx) {
    const home = list.value[0]
    list.value = [home, ...list.value.slice(idx)]
    checkCurrent(1)
  }
  function closeRight(idx) {
    list.value = list.value.slice(0, idx + 1)
    checkCurrent(idx)
  }
  function closeOther(idx) {
    list.value = [list.value[0], list.value[idx]]
    checkCurrent(1)
  }
  function closeAll() {
    list.value = [list.value[0]]
    router.push({ name: 'Home' })
  }
  function checkCurrent(fallback = 0) {
    const currentAvailable = list.value.some(i => i.name === route.name)
    if (!currentAvailable) {
      router.push({ name: list.value[fallback].name })
    }
  }
  function refresh() {
    const index = names.value.indexOf(route.name)
    names.value.splice(index, 1)
    router.push('/redirect?path=' + route.fullPath)
  }
  return {
    list,
    names,
    add,
    close,
    closeLeft,
    closeRight,
    closeOther,
    closeAll,
    checkCurrent,
    refresh,
  }
})
