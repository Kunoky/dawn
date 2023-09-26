const map = new Map()

export function useStorageC(key, defaultValue, storage) {
  storage ||= localStorage
  if (!map.has(storage)) {
    map.set(storage, reactive({}))
  }
  const cache = map.get(storage)
  const str = storage.getItem(key)
  if (!Object.hasOwn(cache, key)) {
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
