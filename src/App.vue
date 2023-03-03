<script setup>
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
</script>

<template>
  <el-config-provider :locale="appStore.elLang">
    <router-view />
  </el-config-provider>
</template>
