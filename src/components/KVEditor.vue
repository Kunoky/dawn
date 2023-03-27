<template>
  <ul class="kv-editor">
    <li v-for="(_, k) in obj" :key="k" class="kv-editor__item dp-f mgb-m">
      <span class="kv-editor__k fl-1">{{ k }}</span>
      <span class="kv-editor__separator mgh-s">:</span>
      <el-input class="kv-editor__v fl-1" v-model="obj[k]" placeholder="value"></el-input>
      <span class="kv-editor__actions mgl-m tc-p cs-p"><i-ep-delete @click="handleDel(k)" /></span>
    </li>
    <li class="kv-editor__item dp-f">
      <el-input :class="['kv-editor__k', 'fl-1', isKeyError && 'is-error']" v-model="kv.key" placeholder="key" />
      <span class="kv-editor__separator mgh-s">:</span>
      <el-input class="kv-editor__v fl-1" v-model="kv.val" placeholder="value"></el-input>
      <span class="kv-editor__actions mgl-m tc-p cs-p"><i-ep-plus @click="handleAdd" /></span>
    </li>
  </ul>
</template>
<script setup>
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: Object,
})
const isKeyError = ref(false)
const obj = ref(null)
watch(
  () => props.modelValue,
  v => {
    obj.value = { ...v }
  },
  { immediate: true }
)
const kv = reactive({
  key: '',
  val: '',
})
const handleAdd = () => {
  if (!kv.key || Object.hasOwn(obj.value, kv.key)) return (isKeyError.value = true)
  isKeyError.value = false
  obj.value[kv.key] = kv.val
  emit('update:modelValue', obj.value)
  kv.key = ''
  kv.val = ''
}
const handleDel = k => {
  delete obj.value[k]
  emit('update:modelValue', obj.value)
}
</script>
<style lang="scss">
.kv-editor {
  .is-error .el-input__wrapper {
    box-shadow: 0 0 0 1px var(--el-color-danger) inset;
  }
}
</style>
