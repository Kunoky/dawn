const cookie = ref()

/**
 * @description cookie对象
 * @author kuroky <1048413674@qq.com>
 * @date 2023-11-14
 * @returns {VueElement.ref} 响应式缓存数据
 */

export function useCookie() {
  if (!cookie.value) {
    const c = {}
    document.cookie.split(';').forEach(i => {
      i = i.trim()
      const [k, v] = i.split('=')
      c[k] = v
    })
    cookie.value = c
  }
  const value = computed({
    get() {
      return cookie.value
    },
    set(v = {}) {
      cookie.value = v
      Object.entries(v).map(([k, v]) => (document.cookie = k + '=' + v))
    },
  })
  return value
}
