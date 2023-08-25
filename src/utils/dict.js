export const source = ref([])

export const dict = ref({})

const loading = ref(false)
export async function init() {
  if (loading.value) return
  loading.value = true
  const { data } = await req.get('dict')
  loading.value = false
  source.value = data
  const dictMap = {}
  data.forEach(i => {
    if (!i.parentId || i.parentId === '0') {
      i = {
        ...i,
        category: 'category',
      }
      // data必须id升序
    } else if (dictMap.category.ko[i.category].valueType === 'number') {
      i.value = +i.value
    }
    const map = (dictMap[i.category] ??= {
      kv: {},
      ko: {},
      options: [],
    })
    map.kv[i.value] = i.label
    map.ko[i.value] = i
    map.options.push({ label: i.label, value: i.value })
  })
  dict.value = dictMap
}
export function useDict(category) {
  if (!source.value.length) {
    init()
  }
  const dictData = computed(() => {
    return (
      dict.value[category] || {
        kv: {},
        ko: {},
        options: [],
      }
    )
  })

  return dictData
}
