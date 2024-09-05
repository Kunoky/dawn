import { ElInput, ElButton, ElDrawer, ElForm, ElFormItem } from 'element-plus'
import CIcon from './CIcon.vue'

export default {
  name: 'CList',
  component: { ElInput, ElButton, CIcon, ElDrawer, ElForm, ElFormItem },
  props: {
    // 默认分页尺寸
    defaultSize: {
      type: Number,
      default: 10,
    },
    // 对于标准分页接口可直接使用path，自定义函数请返回{[dataKey], [totalKey]}
    action: {
      type: [String, Function],
      // required: true,
    },
    params: Object, // 请求参数
    delay: Number, // 防抖延时
    // 从action返回的对象中获取data的key值，缺省则是对象自身
    dataKey: {
      type: String,
      default: 'data.records',
    },
    // 从action返回的对象中获取total的key值
    totalKey: {
      type: String,
      default: 'data.total',
    },
    // 分页页码key值
    pageKey: {
      type: String,
      default: 'pageNum',
    },
    // 分页尺寸key值
    sizeKey: {
      type: String,
      default: 'pageSize',
    },
    defaultForm: {
      type: Object,
    },
    // 分页容器设置
    pageConf: {
      type: Object,
      required: true,
    },
    formConf: Object,
    // 搜索框配置
    searchProps: {
      type: Object,
      // required: true,
      default() {
        return {
          placeholder: ' ',
          key: 's',
        }
      },
    },
  },
  emits: ['refresh', 'load', 'loaded', 'reset', 'query', 'error'],
  setup(p, { slots, expose, emit }) {
    onMounted(() => {
      useInfiniteScroll(ulRef.value, () => loadData(), {
        canLoadMore: () => !noMore.value,
      })
    })
    const props = reactive({ ...p, ...p.pageConf })
    watch(p, () => {
      Object.assign(props, { ...p, ...p.pageConf })
    })
    const ulRef = ref(null)
    const { getNestProp } = utils
    const state = reactive({
      height: innerHeight - 92,
    })
    const page = ref(0)
    const size = ref(props.defaultSize)
    const total = ref(0)
    const noMore = ref(false)
    const form = reactive(props.defaultForm ? JSON.parse(JSON.stringify(props.defaultForm)) : {})
    const mergedParams = reactive({ ...form, ...props.params })
    const visible = reactive({
      form: false,
      moreForm: false,
    })
    watch([form, () => props.params], () => {
      Object.assign(mergedParams, form, props.params)
    })
    const load = typeof props.action === 'function' ? props.action : params => req.get(props.action, { params })
    const { data, loading, run, error } = useAsync(
      () => {
        const params = {
          [props.pageKey]: page.value,
          [props.sizeKey]: size.value,
          ...form,
          ...props.params,
        }
        emit('load', params)
        emit('query', params)
        return load(params)
          .then(res => {
            total.value = getNestProp(res, props.totalKey) || 0
            const rows = props.dataKey ? getNestProp(res, props.dataKey) : res
            data.value.push(...rows)
            if (data.value.length >= total.value) {
              noMore.value = true
            }
            emit('loaded', rows, data.value)
            return data.value
          })
          .catch(e => {
            noMore.value = true
            emit('error', e)
          })
      },
      {
        delay: props.delay,
        initialData: [],
      }
    )
    const loadData = force => {
      if (force) {
        page.value = 0
        total.value = 0
        noMore.value = false
        data.value = []
      }
      if (noMore.value || loading.value) return
      page.value++
      run()
    }
    // const disabled = computed(() => loading.value || noMore.value)
    const refresh = () => {
      emit('refresh')
      loadData(true)
    }

    const handleQuery = () => {
      refresh()
      hideMoreForm()
    }
    watch(() => props.params, refresh, { deep: true })
    function handleQueryReset() {
      const defaultForm = props.defaultForm ? JSON.parse(JSON.stringify(props.defaultForm)) : []
      for (let key in form) {
        form[key] = defaultForm[key]
      }
      emit('reset')
      refresh()
    }
    // let isActivated = true
    // onActivated(() => {
    //   isActivated = true
    // })
    // onDeactivated(() => {
    //   isActivated = false
    // })

    // function updateHeight() {
    //   // 由于keepalive和transition机制的存在，在切换的瞬间，会有2个组件同时存在，因此导致计算高度不准确
    //   setTimeout(() => {
    //     if (!isActivated) return
    //     const rect = ulRef.value?.getBoundingClientRect()
    //     const body = document.body.getBoundingClientRect()

    //     let height = body.height - rect.top - 24
    //     state.height = Math.max(height, innerHeight / 2)
    //   }, 300)
    // }
    // const mitter = useMitt()
    // mitter.on('main-size-change', updateHeight)
    // onBeforeUnmount(() => {
    //   mitter.off('main-size-change', updateHeight)
    // })

    function showMoreForm() {
      visible.moreForm = true
    }

    function hideMoreForm() {
      visible.moreForm = false
    }
    expose({
      run,
      loadData,
      refresh,
      handleQueryReset,
      showMoreForm,
      hideMoreForm,
      form,
      data,
      loading,
      total,
      page,
      size,
      error,
      mergedParams,
    })

    return p => {
      let cols = []
      slots.default()?.forEach(i => {
        if (typeof i.type === 'symbol') {
          if (Array.isArray(i.children)) {
            cols.push(...i.children)
          }
        } else {
          cols.push(i)
        }
      })

      return (
        <ul ref={ulRef} class='c-list of-a pt-r' style={{ height: state.height + 'px' }}>
          <li class='pt-s tp-0 bg '>
            <div class=''>{slots.title?.()}</div>
            <div class='mgt-s'>{slots.actions?.()}</div>
            <div class='dp-f mgt-s'>
              <ElInput
                class='fx-1'
                modelValue={form[props.searchProps.key]}
                onUpdate:modelValue={v => (form[props.searchProps.key] = v)}
                clearable
                {...props.searchProps}
              >
                {{
                  append: () => (
                    <ElButton onClick={handleQuery} loading={loading.value}>
                      <CIcon icon='ep:search' />
                    </ElButton>
                  ),
                }}
              </ElInput>
              <ElButton class='mgl-s' link onClick={showMoreForm}>
                <CIcon icon='ep:filter' />
              </ElButton>
            </div>
            <ElDrawer
              title='筛选数据'
              size='80%'
              modelValue={visible.moreForm}
              onUpdate:modelValue={v => (visible.moreForm = v)}
              class='c-list__drawer'
            >
              <ElForm
                {...props.formConf}
                model={form}
                onKeydown={e => e.key === 'Enter' && handleQuery()}
                class='c-list__form'
              >
                {/* <slot name="form" form={form}></slot> */}
                {slots.form?.({ form })}
                <ElFormItem class=''>
                  <ElButton type='primary' onClick={handleQuery} loading={loading.value}>
                    {p.$t('common.query')}
                  </ElButton>
                  <ElButton onClick={handleQueryReset} disabled={loading.value}>
                    {p.$t('common.reset')}
                  </ElButton>
                </ElFormItem>
              </ElForm>
            </ElDrawer>
          </li>
          {data.value.map((i, idx) => (
            <li key={i[p.$attrs.rowKey || 'id']}>
              <ul class='bg kv mgt-m lh-3'>
                {cols?.map((j, jdx) => {
                  let label = j.props.label
                  let cellValue = j.props.prop && getNestProp(i, j.props.prop)
                  if (j.children?.header) {
                    label = j.children.header({
                      column: j,
                      $index: jdx,
                    })
                  }
                  if (j.children?.default) {
                    cellValue = j.children.default({
                      row: i,
                      column: j,
                      $index: idx,
                    })
                  } else if (j.props.formatter) {
                    cellValue = j.props.formatter(i, j, cellValue, idx)
                  }
                  return (
                    <li>
                      <span>{label}</span>
                      <span>{cellValue}</span>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
          {noMore.value && <li class='ta-c pd-m'>我是有底线的</li>}
          {loading.value && <li class='ta-c pd-m'>加载中...</li>}
        </ul>
      )
    }
  },
}
