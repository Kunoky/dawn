<template>
  <el-dropdown @command="$emit('update:modelValue', $event)" v-bind="$attrs">
    <slot></slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="i in commands"
          :key="i.value"
          :command="i.value"
          :class="{ 'is-active': i.value === modelValue }"
        >
          {{ i.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
defineEmits(['update:modelValue'])
const props = defineProps({
  // 下拉选项，支持对象数组和对象，对象数组结构为{value: label}
  options: {
    type: [Array, Object],
  },
  modelValue: [String, Number],
})

const commands = computed(() => {
  if (!props.options) return []
  if (Array.isArray(props.options)) return props.options
  return Object.entries(props.options).map(([k, v]) => ({
    label: v,
    value: k,
  }))
})
</script>
<style>
.is-active {
  color: var(--primary-color);
}
.el-dropdown + .el-dropdown {
  margin-left: var(--size-s);
}
</style>
