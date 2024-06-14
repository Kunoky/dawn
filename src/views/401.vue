<template>
  <div class="pd-l ta-c">
    <h2>401</h2>
    <p>你无权访问</p>
    <RouterLink class="cl-p" to="/">{{ countdown }}s 回到首页</RouterLink>
  </div>
</template>
<script setup>
definePage({
  name: 'Unauthorized',
  meta: {
    public: true,
  },
})

const router = useRouter()
const countdown = ref(5)
const timer = setInterval(() => {
  if (!--countdown.value) {
    router.replace('/')
    clearInterval(timer)
  }
}, 1000)
</script>
