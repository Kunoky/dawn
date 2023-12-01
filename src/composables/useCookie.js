let handler = {
  get: function (target, key) {
    let val
    document.cookie.split(';').forEach(i => {
      i = i.trim()
      const [k, v] = i.split('=')
      if (k === key) val = v
    })
    return val
  },
  set: function (target, key, value) {
    document.cookie = key + '=' + value
  },
}
let cookie = new Proxy({}, handler)

export function useCookie() {
  return cookie
}
