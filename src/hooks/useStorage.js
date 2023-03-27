export function useStorage(key, defaultValue, storage) {
  storage ||= localStorage
  const str = storage.getItem(key)
  const val = ref(str ? JSON.parse(str) : defaultValue)
  const value = computed({
    get() {
      return val.value
    },
    set(v) {
      storage.setItem(key, JSON.stringify(v))
      val.value = v
    },
  })
  return value
}
