<template>
  <el-tag :type="type">{{ dict.kv[value] }}</el-tag>
</template>
<script setup>
const props = defineProps({
  dict: {
    type: Object,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
})

const type = computed(() => {
  const t = props.dict.ko[props.value]?.listClass
  if (t === 'primary') return ''
  return t
})
</script>
