<template><div class="c-echarts" ref="echartsRef"></div></template>
<script setup>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 按需引入图表，图表后缀都为 Chart
import { BarChart, LineChart, PieChart, GaugeChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { SVGRenderer } from 'echarts/renderers'
import { onMounted, onUnmounted, watch } from 'vue'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
  BarChart,
  LineChart,
  PieChart,
  GaugeChart,
])

const props = defineProps({
  option: {
    type: Object,
  },
})
const echartsRef = ref()
const chart = ref()

const resize = () => chart.value.resize()

onMounted(() => {
  chart.value = echarts.init(echartsRef.value, null, { renderer: 'svg' })
  setOption()
  addEventListener('resize', resize)
})
onUnmounted(() => {
  removeEventListener('resize', resize)
})

const setOption = () => {
  chart.value.setOption(props.option)
}

watch(
  () => props.option,
  () => setOption()
)
</script>
