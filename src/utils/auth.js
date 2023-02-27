/* global __TOKEN_KEY__ */

export function getToken() {
  return localStorage.getItem(__TOKEN_KEY__)
}

export function setToken(token) {
  return localStorage.setItem(__TOKEN_KEY__, token)
}

export function removeToken() {
  return localStorage.removeItem(__TOKEN_KEY__)
}
