<template>
  <iframe class="c-iframe" @load="handleLoad" />
</template>
<script setup>
const inst = getCurrentInstance()
let loadingInstance
onMounted(() => {
  loadingInstance = ElLoading.service({
    target: inst.vnode.el.parentNode,
  })
})

const handleLoad = () => {
  loadingInstance.close()
}
</script>
<sytle lang="scss">
.c-iframe {
  border: none;
  width: 100%;
  display: block;
}
</sytle>
