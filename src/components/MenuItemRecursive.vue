<template>
  <el-sub-menu v-if="data.children" :index="data.name">
    <template #title>
      <IconFont v-if="data.meta?.icon" :icon="data.meta.icon" class="mgr-s fs-3" />
      <span>{{ data.meta.title || data.name }}</span>
    </template>
    <menu-item-recursive v-for="i in data.children" :key="i.name" :data="i" :parent-path="path" />
  </el-sub-menu>
  <a v-else-if="data.path.startsWith('http')" :href="data.path" target="_blank">
    <el-menu-item :index="data.name">
      <IconFont v-if="data.meta?.icon" :icon="data.meta.icon" class="mgr-s fs-3" />
      {{ data.meta.title || data.name }}
    </el-menu-item>
  </a>
  <router-link v-else :to="{ path: path }" :data-id="data.name">
    <!-- <router-link v-else :to="{ name: data.name }" :data-id="data.name"> -->
    <el-menu-item :index="data.name">
      <IconFont v-if="data.meta?.icon" :icon="data.meta.icon" class="mgr-s fs-3" />
      {{ data.meta.title || data.name }}
    </el-menu-item>
  </router-link>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  parentPath: {
    type: String,
  },
})

const getPath = () => {
  let path = props.data.path
  if (!path.startsWith('/')) {
    path = props.parentPath + '/' + path
  }
  return path
}

const path = getPath()
</script>
