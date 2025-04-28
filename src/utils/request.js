import axios from 'axios'
import { useUserStore } from '@/store/user'
import { getToken } from '@/utils/auth'
import { i18n } from '@/i18nSetup'
import { endlessCheck } from './common'
import { debounce } from 'lodash-es'
// import axiosTauriApiAdapter from 'axios-tauri-api-adapter'
const logout = debounce(
  () => {
    useUserStore().logout(true)
  },
  2000
  // { leading: true }
)

const endlessChecker = endlessCheck()
// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_SERVER_PATH, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000, // request timeout
  // adapter: ['http'], // polyfill tauri
  // adapter: axiosTauriApiAdapter， // polyfill tauri
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (!config.noEndlessCheck && !endlessChecker(config.url + JSON.stringify(config.params)))
      return Promise.reject({
        config,
        status: 423,
        message: '频繁请求已被取消',
      })
    // do something before request is sent
    config.headers = {
      Authorization: getToken(),
      'Call-Source': 'WEB',
      'Api-Version': 1.0,
      'Content-Type': 'application/json;charset=utf-8',
      ...config.headers,
    }
    if (config.params) {
      config.params = { ...config.params }
      for (let key in config.params) {
        if (config.params[key] === '') {
          config.params[key] = undefined
        } else if (Array.isArray(config.params[key])) {
          config.params[key] = config.params[key].length ? config.params[key].toString() : undefined
        }
      }
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
      logout()
    } else if (!config.silent) {
      if (code !== 200) {
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
    }
    return data
  },
  error => {
    console.error(error) // for debug
    let msg = error.message
    if (error.response) {
      const { status, data } = error.response
      msg = data?.msg || status + ' ' + i18n.global.t('httpCode.' + status)
      switch (status) {
        case 401:
          logout()
          return Promise.reject(error)
        default:
      }
    }
    error.config.silent ||
      ElMessage({
        message: msg,
        type: 'error',
        duration: 5 * 1000,
      })
    return Promise.reject(error)
  }
)

// export default service

import { createAlova } from 'alova'
import vueHook from 'alova/vue'
import adapterFetch from 'alova/fetch'

function parseResponse(data) {
  return data.data
}
async function onError(error, method) {
  console.error(error, method) // for debug
  const { meta = {} } = method
  let msg = error.message
  if (error.status) {
    const { status } = error
    const data = await error.json()
    msg = data?.msg || status + ' ' + i18n.global.t('httpCode.' + status)
    switch (status) {
      case 401:
        logout()
        return Promise.reject(error)
      default:
    }
  }
  meta.silent ||
    ElMessage({
      message: msg,
      type: 'error',
      duration: 5 * 1000,
    })
  return Promise.reject(error)
}
const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_SERVER_PATH,
  timeout: 60000,
  statesHook: vueHook,
  requestAdapter: adapterFetch(),
  beforeRequest: method => {
    const { config } = method

    if (!config.noEndlessCheck && !endlessChecker(config.url + JSON.stringify(config.params))) {
      method.abort()
    }
    config.headers = {
      Authorization: getToken(),
      'Call-Source': 'WEB',
      'Api-Version': 1.0,
      'Content-Type': 'application/json;charset=utf-8',
      ...config.headers,
    }
    if (config.params) {
      config.params = { ...config.params }
      for (let key in config.params) {
        if (config.params[key] === '') {
          config.params[key] = undefined
        } else if (Array.isArray(config.params[key])) {
          config.params[key] = config.params[key].length ? config.params[key].toString() : undefined
        }
      }
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      const { status } = response
      if (status !== 200) {
        return onError(response, method)
      }
      const { meta = {}, type } = method
      const parseData = meta.parseResponse || parseResponse

      const data = await response.json()
      if (!meta.noHandle) {
        const code = data?.code || status
        const msg = i18n.global.t('httpCode.' + code)
        // 业务异常
        if (code === 401) {
          logout()
        } else if (!meta.silent) {
          if (code !== 200) {
            ElMessage({
              message: data.msg || msg || '操作失败',
              type: 'warning',
              duration: 5 * 1000,
            })
          } else if (type !== 'GET') {
            ElMessage({
              message: data.msg || msg || '操作成功',
              type: 'success',
              duration: 5 * 1000,
            })
          }
        }
      }
      return meta.full ? data : parseData(data, response, method)
    },
    //当你使用alova/fetch请求适配器时，由于window.fetch的特点，只有在连接超时或连接中断时才会触发onError拦截器，其他情况均会触发onSuccess拦截器
    onError,
  },
})

alovaInstance.get = alovaInstance.Get
alovaInstance.post = alovaInstance.Post
alovaInstance.put = alovaInstance.Put
alovaInstance.delete = alovaInstance.Delete
alovaInstance.patch = alovaInstance.Patch

export { alovaInstance, service }

export default alovaInstance
