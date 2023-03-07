<template>
  <slot v-if="placement === 'bottom'" :data="data" :total="total" :loading="loading"></slot>
  <el-pagination
    :style="{ justifyContent }"
    layout="total, prev, pager, next, sizes, jumper"
    v-bind="pagination"
    v-model:current-page="page"
    v-model:page-size="size"
    :total="total"
  />
  <slot v-if="placement === 'top'" :data="data" :total="total" :loading="loading"></slot>
</template>
<script setup>
import { ref, watch } from 'vue'

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
    default: 'record',
  },
  // 从action返回的对象中获取total的key值
  totalKey: {
    type: String,
    default: 'total',
  },
  // 分页页码key值
  pageKey: {
    type: String,
    default: 'page',
  },
  // 分页尺寸key值
  sizeKey: {
    type: String,
    default: 'size',
  },
  pagination: Object, // el-pagination配置项
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
})

const page = ref(1)
const size = ref(props.defaultSize)
const total = ref(0)

const req = typeof props.action === 'function' ? props.action : params => axios.get(props.action, { params })
const { data, loading, run } = useAsync(
  () =>
    req({
      [props.pageKey]: page.value,
      [props.sizeKey]: size.value,
      ...props.params,
    }).then(res => {
      total.value = res[props.totalKey]
      if (props.dataKey) return res[props.dataKey]
      return res
    }),
  {
    delay: props.delay,
    manual: true,
  }
)

const refresh = () => {
  page.value = 1
  size.value = props.defaultSize
}

watch([page, size], run, { immediate: true })

if (props.params) {
  watch(props.params, refresh, { deep: true })
}

defineExpose({
  refresh,
})
</script>
