const c = useCookie()
export function getToken() {
  const token = c.value[__TOKEN_KEY__] || localStorage.getItem(__TOKEN_KEY__)
  return token
}

export function setToken(token) {
  c.value = {
    ...c.value,
    [__TOKEN_KEY__]: token,
  }
  return localStorage.setItem(__TOKEN_KEY__, token)
}

export function removeToken() {
  c.value = {
    ...c.value,
    [__TOKEN_KEY__]: '',
  }
  return localStorage.removeItem(__TOKEN_KEY__)
}

export function ssoLogin() {
  location.href = import.meta.env.VITE_SERVER_PATH + '/sso/login'
}

export function ssoLogout() {
  location.href = import.meta.env.VITE_SERVER_PATH + '/sso/logout'
}
