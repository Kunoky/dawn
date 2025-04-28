<template>
  <slot v-if="placement === 'bottom'" :data="data" :total="total" :loading="loading" :error="error"></slot>
  <el-pagination
    ref="pageRef"
    v-show="!hidePager"
    class="mgv-s"
    :style="{ justifyContent }"
    layout="total, prev, pager, next, sizes, jumper"
    v-bind="$attrs"
    v-model:current-page="page"
    v-model:page-size="size"
    :total="total"
    :disabled="loading"
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
    default: 'records',
  },
  // 从action返回的对象中获取total的key值
  totalKey: {
    type: String,
    default: 'totalRow',
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
    default: 'right',
  },
  // 隐藏分页
  hidePager: {
    type: Boolean,
    default: false,
  },
})

const { getNestProp } = utils

const pageRef = ref()
const page = ref(1)
const size = ref(props.defaultSize)
const total = ref(0)

const load = typeof props.action === 'function' ? props.action : params => req.get(props.action, { params })
const listData = params =>
  load({
    [props.pageKey]: page.value,
    [props.sizeKey]: size.value,
    ...props.params,
    ...params,
  }).then(res => {
    total.value = getNestProp(res, props.totalKey) || 0
    if (props.dataKey) return getNestProp(res, props.dataKey)
    return res
  })
const gain = useAsync(listData, {
  delay: props.delay,
})
const { data, loading, error } = toRefs(gain)
const run = gain.run
const refresh = () => {
  if (page.value !== 1) {
    page.value = 1
  } else {
    run()
  }
}

watch([page, size], () => run(), { immediate: true })

watch(() => props.params, refresh, { deep: true })

defineExpose({
  pageRef,
  run,
  refresh,
  data,
  loading,
  total,
  page,
  size,
  error,
  listData,
})
</script>
