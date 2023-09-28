const map = new Map()

/**
 * @description 和vueuse中useStoreage最大的区别是：只有赋值时才会缓存，初始值和修改引用对象不会缓存
 * @author kuroky <1048413674@qq.com>
 * @date 2023-09-28
 * @param {String} key 缓存键
 * @param {*?} defaultValue 默认值
 * @param {Storage?} storage 缓存对象
 * @returns {VueElement.computed} 响应式缓存数据
 */
export function useStorageC(key, defaultValue, storage) {
  storage ||= localStorage
  if (!map.has(storage)) {
    map.set(storage, reactive({}))
  }
  const cache = map.get(storage)
  const str = storage.getItem(key)
  if (!cache[key]) {
    if (str) {
      cache[key] = JSON.parse(str)
    }
    cache[key] ??= defaultValue
  }
  const value = computed({
    get() {
      return cache[key]
    },
    set(v) {
      storage.setItem(key, JSON.stringify(v))
      cache[key] = v
    },
  })
  return value
}
