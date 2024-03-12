import { debounce } from 'lodash-es'

/**
 * @typedef {Object} AsyncReturn
 * @property {*} data service 返回的数据，默认为 null
 * @property {Error} error service 抛出的异常，默认为 null
 * @property {Boolean} loading service 是否正在执行
 * @property {Array} params 当次执行的 service 的参数数组。比如你执行了 run(1, 2, 3)，则 params 等于 [1, 2, 3]
 * @property {Function} run 参数传递给 service 并执行
 * @property {Function} refresh 使用上一次的 params，重新执行 service
 */
/**
 * @description 通用异步函数逻辑处理
 * @author kuroky <1048413674@qq.com>
 * @date 2023-09-28
 * @param {function} service 异步函数
 * @param {object} options 配置项
 * @param {boolean} options.manual 默认 true，需要手动调用 run 触发执行， 如果设置为 false， 则在初始化时自动执行 service。
 * @param {*} options.initialData data默认值
 * @param {vue.getter} options.source 监听数据源, 在 manual = false 时，watchSource 变化后，会使用之前的 params 重新执行 service
 * @param {number} options.delay 防抖延迟时间
 * @param {function} options.onSuccess function(data: *, params: Array), service resolve 时触发
 * @param {function} options.onError function(e: Error, params: Array), service 报错时触发，参数为 error 和 params
 * @param {function} options.onFinally service 结束时触发

 * @returns {AsyncReturn} res {
 *  data: any               
 *  error：Error            
 *  loading：boolean        
 *  params: array           
 *  run: function           
 *  refresh: function       
 * }
 */
export function useAsync(service, options = {}) {
  const { manual = true, initialData, onSuccess, onError, onFinally, source, delay = 0 } = options

  const data = ref(initialData)
  const error = ref()
  const loading = ref(false)
  const params = ref([])

  const _run = async (...p) => {
    try {
      loading.value = true
      error.value = null
      params.value = p
      const d = await service(...p)
      data.value = d
      onSuccess?.(d, p)
      return d
    } catch (e) {
      console.error(e)
      error.value = e
      onError?.(data.value, p)
      return Promise.reject(e)
    } finally {
      loading.value = false
      onFinally?.(p)
    }
  }
  let run = _run
  if (delay) {
    run = debounce(_run, delay)
  }
  const refresh = () => {
    return run(...params.value)
  }
  if (!manual) {
    if (source) {
      watch(source, () => run(...params.value), { immediate: true })
    } else {
      run(...params.value)
    }
  }
  return {
    data,
    error,
    loading,
    params,
    run,
    refresh,
  }
}
