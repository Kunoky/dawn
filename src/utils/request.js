import axios from 'axios'
import { Message } from 'element-ui'
import { useUserStore } from '@/store/user'
import { getToken } from '@/utils/auth'
import { i18n } from '@/i18nSetup'

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_SERVER_PATH, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    /* global __TOKEN_KEY__ */
    config.headers = {
      [__TOKEN_KEY__]: getToken(),
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
    const { locale, messages } = i18n
    const codeMessage = messages[locale].httpCode
    const msg = codeMessage[status]
    if (config.method !== 'get') {
      // 业务异常
      if (data?.code) {
        Message({
          message: data.msg || msg || '操作失败',
          type: 'warning',
          duration: 5 * 1000,
        })
      } else {
        Message({
          message: data.msg || msg || '操作成功',
          type: 'success',
          duration: 5 * 1000,
        })
      }
    }
    return data
  },
  error => {
    console.error(error) // for debug
    const { status } = error.response
    const { locale, messages } = i18n
    const codeMessage = messages[locale].httpCode
    let msg = status + ' ' + codeMessage[status] || error.message
    let store
    switch (status) {
      case 401:
        store = useUserStore()
        store.logout(true)
        break
      default:
    }
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
