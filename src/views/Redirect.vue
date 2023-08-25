<template>
  <div></div>
</template>
<script setup>
const route = useRoute()
const router = useRouter()
const path = decodeURI(route.query.path)
router.replace({ path })
</script>
