import { defineStore } from 'pinia'

export const useTagsViewStore = defineStore('tagsView', () => {
  const list = ref([{ name: 'Home', meta: { title: '首页', affix: true } }])
  const names = computed(() => list.value.map(i => i.name))

  const userStore = useUserStore()

  const add = route => {
    if (!route.name) return
    const routeInfo = userStore.keyMenu[route.name]
    if (!routeInfo) return
    if (list.value.some(i => i.name === route.name) || routeInfo.meta.noCatch) return
    list.value.push(routeInfo)
  }

  const route = useRoute()
  const router = useRouter()
  const close = idx => {
    const r = list.value.splice(idx, 1)[0]
    if (r.name === route.name) {
      router.push({ name: list.value[idx - 1].name })
    }
  }
  return {
    list,
    names,
    add,
    close,
  }
})
