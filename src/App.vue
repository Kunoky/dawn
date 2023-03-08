<script setup>
import { useAppStore } from '@/store/app'
import LoadingComponent from '@/components/Loading.vue'

const appStore = useAppStore()
</script>

<template>
  <el-config-provider :locale="appStore.elLang">
    <Suspense timeout="200">
      <router-view />
      <template #fallback>
        <LoadingComponent />
      </template>
    </Suspense>
  </el-config-provider>
</template>
