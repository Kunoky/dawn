<template>
  <!-- <svg v-if="symbol" class="icon" aria-hidden="true">
    <use :xlink:href="type"></use>
  </svg>
  <i v-else :class="['iconfont', type]"/> -->
  <i :class="['iconfont', type]" />
</template>
<script setup>
const props = defineProps({
  icon: String, // icon
  // symbol: Boolean, // 是否symbol模式
})
const type = computed(() => {
  let c = 'icon-' + props.icon
  // if (props.symbol) return '#' + c
  return c
})
</script>
