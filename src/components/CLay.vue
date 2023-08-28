<template>
  <Teleport to="body">
    <Transition>
      <div
        ref="elRef"
        v-show="modelValue"
        class="c-lay bgc-1 bs-m bdr-l pt-f zi-999"
        :style="{ left: x + 'px', top: y + 'px' }"
      >
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup>
defineProps({
  x: Number,
  y: Number,
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

const elRef = ref()
function handleClick(e) {
  const self = utils.getElNest(e.target, '.c-lay')
  if (!self) {
    emit('update:modelValue', false)
  }
}
document.addEventListener('click', handleClick)
document.addEventListener('contextmenu', handleClick, true)
onUnmounted(() => {
  document.removeEventListener('click', handleClick)
  document.removeEventListener('contextmenu', handleClick)
})
</script>
