<template>
  <el-submenu v-if="data.children" :index="String(data.id)">
    <template slot="title">
      <i v-if="data.meta?.icon" :class="'el-icon-' + data.meta.icon"></i>
      <span slot="title">{{ data.val }}</span>
    </template>
    <menu-item-recursive v-for="i in data.children" :key="i.id" :data="i" />
  </el-submenu>
  <a v-else-if="data.key.startsWith('http')" :href="data.key" target="_blank">
    <el-menu-item :index="String(data.id)">{{ data.val }}</el-menu-item>
  </a>
  <router-link v-else :to="data.key" :data-id="data.id">
    <el-menu-item :index="String(data.id)">{{ data.val }}</el-menu-item>
  </router-link>
</template>
<script>
export default {
  name: 'MenuItemRecursive',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
}
</script>
