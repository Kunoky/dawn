<template>
  <slot v-if="placement === 'bottom'" :data="data" :total="total" :loading="loading" :error="error"></slot>
  <el-pagination
    v-show="!hidePager"
    class="mgv-s"
    :style="{ justifyContent }"
    layout="total, prev, pager, next, sizes, jumper"
    v-bind="$attrs"
    v-model:current-page="page"
    v-model:page-size="size"
    :total="total"
  />
  <slot v-if="placement === 'top'" :data="data" :total="total" :loading="loading" :error="error"></slot>
</template>
<script setup>
const props = defineProps({
  // 默认分页尺寸
  defaultSize: {
    type: Number,
    default: 10,
  },
  // 对于标准分页接口可直接使用path，自定义函数请返回{[dataKey], [totalKey]}
  action: {
    type: [String, Function],
    required: true,
  },
  params: Object, // 请求参数
  delay: Number, // 防抖延时
  // 从action返回的对象中获取data的key值，缺省则是对象自身
  dataKey: {
    type: String,
    default: 'rows',
  },
  // 从action返回的对象中获取total的key值
  totalKey: {
    type: String,
    default: 'total',
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
  // 分页位置： top|bottom
  placement: {
    type: String,
    default: 'bottom',
  },
  // 分页水平位置，同justify-content
  justifyContent: {
    type: String,
    default: 'end',
  },
  // 隐藏分页
  hidePager: {
    type: Boolean,
    default: false,
  },
})

const page = ref(1)
const size = ref(props.defaultSize)
const total = ref(0)

const load = typeof props.action === 'function' ? props.action : params => req.get(props.action, { params })
const { data, loading, run, error } = useAsync(
  () =>
    load({
      [props.pageKey]: page.value,
      [props.sizeKey]: size.value,
      ...props.params,
    }).then(res => {
      total.value = res[props.totalKey] || 0
      if (props.dataKey) return res[props.dataKey]
      return res
    }),
  {
    delay: props.delay,
  }
)

const refresh = () => {
  if (page.value !== 1) {
    page.value = 1
  } else {
    run()
  }
}

watch([page, size], run, { immediate: true })

watch(() => props.params, refresh, { deep: true })

defineExpose({
  run,
  refresh,
  data,
  loading,
  total,
  page,
  size,
  error,
})
</script>
