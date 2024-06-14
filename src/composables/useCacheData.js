const cache = reactive({})

const loader = {
  maintenanceType() {
    return req.get('/data/maintenanceType').then(res => {
      const [tree, idNode] = utils.arr2tree(res.data, 'id', 'pid')
      return [tree, idNode]
    })
  },
}
const loading = {}
async function getData(key, force) {
  let data = cache[key]
  if (!data || force) {
    try {
      if (!loading[key]?.pending) {
        loading[key] = loader[key]()
        loading[key].pending = true
      }
      data = await loading[key]
    } catch (e) {
      console.error('get cache data for key ', key, ': ', e)
    }
    if (loading[key].pending) {
      cache[key] = data
      loading[key].pending = false
    }
  }
  return data
}

/**
 * @description 缓存数据
 * @author kuroky <1048413674@qq.com>
 * @date 2023-09-28
 * @param {String} key 缓存键
 * @param {Object?} options 配置
 * @param {*} options.defaultValue 默认值
 * @param {Boolean} options.immediate 是否立即获取，computed只有在使用时才会执行
 * @returns {vue.computed} 缓存数据
 */
export function useCacheData(key, options = {}) {
  if (options.immediate) {
    getData(key)
  }
  const data = computed(() => {
    let d = cache[key]
    if (!d && !loading[key]?.pending) {
      getData(key)
    }
    d ??= options.defaultValue
    return d
  })
  return data
}

export function updateCacheData(key) {
  return getData(key, true)
}
