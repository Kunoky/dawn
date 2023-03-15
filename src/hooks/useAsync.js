import { debounce } from 'lodash'
import { ref, watch } from 'vue'

/**
 * 通用异步函数逻辑处理
 *
 * @param {function} service 异步函数
 * @param {object} options {
 *  manual: boolean                           默认 true，需要手动调用 run 触发执行， 如果设置为 false， 则在初始化时自动执行 service。
 *  initialData: any                          data默认值
 *  source: ref | getter                      监听数据源, 在 manual = false 时，watchSource 变化后，会使用之前的 params 重新执行 service
 *  onSuccess: function(data, params)         service resolve 时触发，参数为 data 和 params
 *  onError: function(e, params)              service 报错时触发，参数为 error 和 params
 *  onFinally: function()                     service 结束时触发
 *  delay: number                             防抖延迟时间
 * }
 * @returns {object} {
 *  data: any               service 返回的数据，默认为 null
 *  error：Error            service 抛出的异常，默认为 null
 *  loading：boolean        service 是否正在执行
 *  run: function           参数传递给 service 并执行
 *  params: array           当次执行的 service 的参数数组。比如你执行了 run(1, 2, 3)，则 params 等于 [1, 2, 3]
 *  refresh: function       使用上一次的 params，重新执行 service
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
    } catch (e) {
      console.error(e)
      error.value = e
      onError?.(data.value, p)
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
    run(...params.value)
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
