<template>
  <el-sub-menu v-if="hasChildren" :index="data.name">
    <template #title>
      <CIcon :icon="data.meta.icon" />
      <span>{{ data.meta.title || data.name }}</span>
    </template>
    <menu-item-recursive v-for="i in data.children" :key="i.name" :data="i" />
  </el-sub-menu>
  <a v-else-if="data.meta.type === 3" :href="data.path" target="_blank">
    <el-menu-item :index="data.name">
      <CIcon :icon="data.meta.icon" />
      <template #title>
        {{ data.meta.title || data.name }}
      </template>
    </el-menu-item>
  </a>
  <router-link v-else-if="data.meta.visible" :to="{ path: data.path }" :data-id="data.name">
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
})
const hasChildren = computed(() => props.data.children?.filter(i => i.meta.visible).length)
</script>
<style>
.el-menu-item .c-icon,
.el-sub-menu .c-icon {
  margin-right: var(--size-s);
  flex-shrink: 0;
  top: 0;
}
</style>
