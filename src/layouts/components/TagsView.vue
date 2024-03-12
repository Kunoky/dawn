<template>
  <div class="tags-view dp-f" @click.right="handleRightClick" ref="elRef">
    <div class="tags fx-1 of-a ws-nw">
      <router-link
        v-for="(i, index) in store.list"
        :to="{ name: i.name }"
        :key="i.name"
        :data-index="index"
        class="tag-link"
      >
        <el-tag :closable="!i.meta.affix && !!index" type="info" size="large" @close.prevent="store.close(index)">
          {{ i.meta.title }}
        </el-tag>
      </router-link>
    </div>
    <div>
      <el-button link @click="store.refresh"><i-ep-refresh /></el-button>
    </div>
    <CLay v-model="menuVisible" :x="menuPosition.x" :y="menuPosition.y">
      <ul class="pdh-m pdv-s cl-8 lh-2 cs-p">
        <li class="cl-p-h" v-for="(i, index) in menus" :key="i" @click="handleMenuClick(index)">{{ i }}</li>
      </ul>
    </CLay>
  </div>
</template>
<script setup>
const route = useRoute()
const store = useTagsViewStore()
watch(
  route,
  v => {
    store.add(v)
    nextTick(() => {
      const active = elRef.value.querySelector('.router-link-exact-active > .el-tag.el-tag--info')
      active?.scrollIntoView()
    })
  },
  { immediate: true }
)
const menus = ['关闭', '关闭左侧', '关闭右侧', '关闭其他', '关闭所有']
const menuVisible = ref(false)
const menuPosition = reactive({
  x: 0,
  y: 0,
})

const idx = ref()
const elRef = ref()
function handleRightClick(e) {
  const tagEl = utils.getElNest(e.target, '.tag-link', elRef.value)
  if (tagEl) {
    let { index } = tagEl.dataset
    index = +index
    if (!index) return
    e.preventDefault()
    idx.value = index
    menuPosition.x = e.x
    menuPosition.y = e.y
    menuVisible.value = true
  }
}

function handleMenuClick(index) {
  ;[store.close, store.closeLeft, store.closeRight, store.closeOther, store.closeAll][index](idx.value)
  menuVisible.value = false
}
</script>
<style lang="scss">
.tags-view {
  line-height: 40px;
  padding: 0 var(--size-m);
  .tags > a + a {
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
