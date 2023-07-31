<template>
  <div class="tags-view of-a">
    <router-link v-for="(i, idx) in store.list" :to="{ name: i.name }" :key="i.name">
      <el-tag :closable="!i.meta.affix" type="info" size="large" @close.prevent="store.close(idx)">
        {{ i.meta.title }}
      </el-tag>
    </router-link>
  </div>
</template>
<script setup>
const route = useRoute()
const store = useTagsViewStore()
watch(
  route,
  v => {
    store.add(v)
  },
  { immediate: true }
)
</script>
<style lang="scss">
.tags-view {
  line-height: 40px;
  padding: 0 var(--size-m);
  & > a + a {
    margin-left: var(--size-s);
    display: inline-block;
  }
  .el-tag.el-tag--info {
    background-color: var(--gray-2);
  }
  .router-link-exact-active > .el-tag.el-tag--info {
    background-color: var(--primary-color);
    color: var(--gray-1);
    .el-tag__close {
      color: var(--gray-1);
    }
  }
}
</style>
