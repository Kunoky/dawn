<template>
  <div></div>
</template>
<script setup>
definePage({
  meta: {
    public: true,
  },
})
const route = useRoute()
const router = useRouter()
const path = decodeURI(route.query.path)
router.replace({ path })
</script>
