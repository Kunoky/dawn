import { cloneDeep } from 'lodash-es'

const source = ref([])
const loading = {}
// ,
//   CACHE_KEY = 'dict_source'

async function fetchCategory(category) {
  // if (Array.isArray(category)) {
  //   category.forEach(i => {
  //     loading[i] = true
  //   })
  // } else {
  if (loading[category]) return []
  loading[category] = true
  // }

  const { data: list } = await axios.get('system/dict/data/type/' + category)
  // if (Array.isArray(category)) {
  //   category.forEach(i => {
  //     loading[i] = false
  //   })
  // } else {
  loading[category] = false
  // }
  source.value = [...source.value, ...list]
  // localStorage.setItem(CACHE_KEY, JSON.stringify(source.value))
  return list
}
function deleteCategory(category) {
  source.value = source.value.filter(i => i.dictType !== category)
}
export async function updateCategory(category) {
  deleteCategory(category)
  return await fetchCategory(category)
}
export async function init() {
  //   let cache = localStorage.getItem(CACHE_KEY)
  //   if (!cache) return
  //   source.value = JSON.parse(cache)
  //   const roots = source.value.filter(i => !i.pId)
  //   const res = await listDict({ id: roots.map(i => i.id), pId: 0 })
  //   const idNode = {}
  //   res.list.forEach(i => {
  //     idNode[i.id] = i
  //   })
  //   const updateQueue = []
  //   roots.forEach(i => {
  //     if (i.version !== idNode[i.id].version) {
  //       updateQueue.push(i.dictType)
  //     }
  //   })
  //   updateQueue.forEach(i => {
  //     deleteCategory(i)
  //   })
  //   await fetchCategory(updateQueue)
}
export function useDict(category) {
  const arr = ref([])
  watch(
    source,
    () => {
      arr.value = cloneDeep(source.value.filter(i => i.dictType === category))
    },
    { immediate: true }
  )
  if (!arr.value.length) {
    fetchCategory(category)
  }
  const dict = computed(() => {
    const kv = {},
      options = []
    arr.value.forEach(i => {
      kv[i.dictValue] = i.dictLabel
      options.push({
        key: i.dictValue,
        label: i.dictLabel,
        value: i.dictValue,
      })
    })
    // const [tree, idNode] = utils.arr2tree(arr.value, 'dictValue')
    // const leaves = tree[0]?.children || []
    return {
      // tree,
      // idNode,
      // leaves,
      kv,
      options,
    }
  })

  return dict
}
