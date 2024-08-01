<template>
  <el-select
    :modelValue="modelValue"
    :value-key="valueKey"
    :filterable="filterable"
    :multiple="multiple"
    collapse-tags
    collapse-tags-tooltip
    :filter-method="handleFilter"
    @change="handleChange"
  >
    <template #header>
      <slot name="header">
        <template v-if="multiple && showDefaultHeader">
          <el-button type="primary" link @click="handleSelectAll">全选</el-button>
          <el-button type="primary" link @click="handleSelectInvert">反选</el-button>
        </template>
      </slot>
    </template>
    <el-option v-for="i in selectOptions" :key="i.value" :label="i.label" :value="i.value" :disabled="i.disabled" />
  </el-select>
</template>
<script setup>
const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
  modelValue: {},
  multiple: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
  filterMethod: {
    type: Function,
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  getValue: {
    type: Function,
  },
  labelKey: {
    type: String,
    default: 'label',
  },
  options: {
    type: [Array, Object],
    default: () => [],
  },
  selectable: {
    type: Function,
  },
  showDefaultHeader: {
    type: Boolean,
    default: true,
  },
})

const state = reactive({
  s: '',
})

const selectOptions = computed(() => {
  if (Array.isArray(props.options)) {
    const arr = []
    props.options.forEach(i => {
      const label = props.labelKey ? i[props.labelKey] : i
      const value = props.getValue ? props.getValue(i) : props.valueKey ? i[props.valueKey] : i
      if (state.s && !label.match(new RegExp(utils.escapeRegExp(state.s), 'i'))) return

      arr.push({ label, value, disabled: props.selectable ? !props.selectable(i) : false })
    })
    return arr
  }
  return Object.entries(props.options).map(([k, v]) => ({
    label: v,
    value: k,
  }))
})

function handleFilter(s) {
  if (props.filterMethod) {
    props.filterMethod(s)
  } else {
    state.s = s
  }
}

function handleSelectAll() {
  const arr = []
  selectOptions.value.forEach(i => {
    if (i.disabled) return
    arr.push(i.value)
  })
  handleChange(arr)
}

function handleSelectInvert() {
  const arr = []
  selectOptions.value.forEach(i => {
    if (!i.disabled && !props.modelValue.includes(i.value)) {
      arr.push(i.value)
    }
  })
  handleChange(arr)
}

function handleChange(v) {
  emit('change', v)
  emit('update:modelValue', v)
}
</script>
<style></style>
