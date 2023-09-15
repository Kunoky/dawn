const map = new Map()

export function useStorageC(key, defaultValue, storage) {
  storage ||= localStorage
  if (!map.has(storage)) {
    map.set(storage, reactive({}))
  }
  const cache = map.get(storage)
  const str = storage.getItem(key)
  cache[key] ??= str ? JSON.parse(str) : defaultValue
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
