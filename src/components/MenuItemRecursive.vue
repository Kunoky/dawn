<template>
  <el-sub-menu v-if="data.children" :index="String(data.id)">
    <template #title>
      <IconFont v-if="data.meta?.icon" :icon="data.meta.icon" class="mgr-s fs-3" />
      <span>{{ data.val }}</span>
    </template>
    <menu-item-recursive v-for="i in data.children" :key="i.id" :data="i" />
  </el-sub-menu>
  <a v-else-if="data.key.startsWith('http')" :href="data.key" target="_blank">
    <el-menu-item :index="String(data.id)">
      <IconFont v-if="data.meta?.icon" :icon="data.meta.icon" class="mgr-s fs-3" />
      {{ data.val }}
    </el-menu-item>
  </a>
  <router-link v-else :to="{ name: data.key }" :data-id="data.id">
    <el-menu-item :index="String(data.id)">
      <IconFont v-if="data.meta?.icon" :icon="data.meta.icon" class="mgr-s fs-3" />
      {{ data.val }}
    </el-menu-item>
  </router-link>
</template>
<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  },
})
</script>
