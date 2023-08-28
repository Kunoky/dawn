<template>
  <el-sub-menu v-if="data.children" :index="data.name">
    <template #title>
      <CIcon :icon="data.meta.icon" />
      <span>{{ data.meta.title || data.name }}</span>
    </template>
    <menu-item-recursive v-for="i in data.children" :key="i.name" :data="i" :parent-path="path" />
  </el-sub-menu>
  <a v-else-if="data.path.startsWith('http')" :href="data.path" target="_blank">
    <el-menu-item :index="data.name">
      <CIcon :icon="data.meta.icon" />
      <template #title>
        {{ data.meta.title || data.name }}
      </template>
    </el-menu-item>
  </a>
  <router-link v-else :to="{ path: path }" :data-id="data.name">
    <!-- <router-link v-else :to="{ name: data.name }" :data-id="data.name"> -->
    <el-menu-item :index="data.name">
      <CIcon :icon="data.meta.icon" />
      <template #title>
        {{ data.meta.title || data.name }}
      </template>
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
<style>
.el-menu-item .c-icon,
.el-sub-menu .c-icon {
  margin-right: var(--size-s);
  flex-shrink: 0;
}
</style>
