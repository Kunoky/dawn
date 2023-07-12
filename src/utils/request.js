import axios from 'axios'
import { useUserStore } from '@/store/user'
import { getToken } from '@/utils/auth'
import { i18n } from '@/i18nSetup'
// import axiosTauriApiAdapter from 'axios-tauri-api-adapter'

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_SERVER_PATH, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  // adapter: ['http'], // polyfill tauri
  // adapter: axiosTauriApiAdapter， // polyfill tauri
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers = {
      Authorization: 'Bearer ' + getToken(),
      'Call-Source': 'WEB',
      'Api-Version': 1.0,
      'Content-Type': 'application/json;charset=utf-8',
      ...config.headers,
    }
    return config
  },
  error => {
    // do something with request error
    console.error(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { data, status, config } = response
    const code = data?.code || status
    const msg = i18n.global.t('httpCode.' + code)
    // 业务异常
    if (code === 401) {
      useUserStore().logout(true)
    } else if (code !== 200) {
      ElMessage({
        message: data.msg || msg || '操作失败',
        type: 'warning',
        duration: 5 * 1000,
      })
    } else if (config.method !== 'get') {
      ElMessage({
        message: data.msg || msg || '操作成功',
        type: 'success',
        duration: 5 * 1000,
      })
    }
    return data
  },
  error => {
    console.error(error) // for debug
    let msg = error.message
    if (error.response) {
      const { status, data } = error.response
      const code = data?.code || status

      msg = code + ' ' + i18n.global.t('httpCode.' + code)
      let store
      switch (code) {
        case 401:
          store = useUserStore()
          store.logout(true)
          break
        default:
      }
    }
    ElMessage({
      message: msg,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
