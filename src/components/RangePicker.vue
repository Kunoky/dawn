<template>
  <el-date-picker
    v-model="value"
    value-format="YYYY-MM-DD"
    type="daterange"
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    v-bind="$attrs"
  ></el-date-picker>
</template>
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  beginKey: {
    type: String,
    default: 'beginTime',
  },
  endKey: {
    type: String,
    default: 'endTime',
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})
const value = ref([])
watch(
  () => props.modelValue,
  val => {
    if (val[props.beginKey] === value.value[0] && val[props.endKey] === value.value[1]) return
    value.value = [val[props.beginKey], val[props.endKey]]
  },
  {
    deep: true,
    immediate: true,
  }
)
watch(value, val => {
  emit('update:modelValue', {
    ...props.modelValue,
    [props.beginKey]: val[0],
    [props.endKey]: val[1],
  })
})
</script>
<style></style>
