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
async function getData(key) {
  let data = cache[key]
  if (!data) {
    if (loading[key]) {
      return await new Promise(resolve => {
        const timer = setInterval(() => {
          if (!loading[key]) {
            resolve(cache[key])
            clearInterval(timer)
          }
        }, 20)
      })
    }
    loading[key] = true
    try {
      data = await loader[key]()
    } catch (e) {
      console.error('get catch data: ', e)
    }
    cache[key] = data
    loading[key] = false
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
    if (!d && !loading[key]) {
      getData(key)
    }
    d ??= options.defaultValue
    return d
  })
  return data
}
