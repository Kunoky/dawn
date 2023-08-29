<template>
  <i v-show="icon" class="c-icon" :style="{ '--icon': `url(${source + icon}.svg)` }"></i>
</template>
<script setup>
defineProps({
  //icon市场中的svg名称 https://icones.netlify.app/
  source: {
    type: String,
    default: 'https://api.iconify.design/',
  },
  icon: {
    type: String,
  },
})
</script>
<style>
.c-icon {
  display: inline-block;
  -webkit-mask: var(--icon) no-repeat;
  mask: var(--icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: inherit;
  width: 1.2em;
  height: 1.2em;
}
</style>
