let handler = {
  get: function (target, key) {
    let val
    document.cookie.split('; ').forEach(i => {
      const [k, v] = i.split('=')
      if (k === key) val = v
    })
    return val
  },
  set: function (target, key, value) {
    document.cookie = key + '=' + value + ';path=/'
    return true
  },
  deleteProperty(target, key) {
    document.cookie = key + '=0;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    return true
  },
}
let cookie = new Proxy({}, handler)

export function useCookie() {
  return cookie
}
