export const source = ref([])

export const dict = ref({})

export const _dict = new Proxy(
  {},
  {
    get(t, k) {
      return (
        dict.value[k] || {
          kv: {},
          ko: {},
          options: [],
        }
      )
    },
  }
)

const loading = ref(false)
export async function init() {
  if (loading.value) return
  loading.value = true
  const data = await req.get('dict/list')
  loading.value = false
  source.value = data
  const dictMap = {}
  data.forEach(i => {
    if (!i.pid || i.pid === '0') {
      i = {
        ...i,
        type: 'type',
      }
      // data必须pid为0的在前
    } else if (dictMap.type.ko[i.type]) {
      switch (dictMap.type.ko[i.type].valueType) {
        case 1:
          i.value = +i.value
          break
        case 3:
          i.value = i.value === 'true'
          break
        default:
      }
    } else {
      console.warn('数据找不到父节点: ', i)
    }
    const map = (dictMap[i.type] ??= {
      kv: {},
      ko: {},
      options: [],
    })
    map.kv[i.value] = i.label
    map.ko[i.value] = i
    i.status && map.options.push({ label: i.label, value: i.value })
  })
  dict.value = dictMap
}
export function useDict(type) {
  if (!source.value.length) {
    init()
  }
  const dictData = computed(() => {
    return (
      dict.value[type] || {
        kv: {},
        ko: {},
        options: [],
      }
    )
  })

  return dictData
}
