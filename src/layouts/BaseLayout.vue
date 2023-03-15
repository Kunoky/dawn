<script setup>
import { ref, watch, onBeforeMount, nextTick } from 'vue'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import MenuItemRecursive from '@/components/MenuItemRecursive.vue'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const appStore = useAppStore()
const route = useRoute()
const appName = __APP_NAME__
const active = ref('')
const isCollapse = ref(false)
const { langs, menuTree, loading } = storeToRefs(appStore)
const { user } = storeToRefs(userStore)

onBeforeMount(() => {
  if (!localStorage.getItem('menuTree')) {
    appStore.genMenu()
  }
})

watch(
  route,
  async () => {
    await nextTick()
    const activeLink = document.querySelector('.el-menu .router-link-active')
    if (activeLink) {
      active.value = activeLink.dataset.id
    }
  },
  { immediate: true }
)

const handleCommand = e => {
  appStore.setLang(e)
}
const handleUserCommand = e => {
  switch (e) {
    case 'logout':
      userStore.logout()
      break
    default:
  }
}
</script>
<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside ht-100vh dp-f fd-c">
      <el-menu :default-active="active" :collapse="isCollapse" class="fl-1 menu">
        <menu-item-recursive v-for="i in menuTree" :key="i.id" :data="i" />
      </el-menu>
      <div class="bdt bdc-4 pd-s cs-p">
        <i-ep-expand v-if="isCollapse" @click="isCollapse = !isCollapse" />
        <i-ep-fold v-else @click="isCollapse = !isCollapse" />
      </div>
    </el-aside>
    <el-container class="ht-100vh">
      <el-header class="header">
        <span>{{ appName }}</span>
        <div class="ft-r">
          <el-dropdown @command="handleCommand">
            <span v-loading="loading.lang">
              <span>{{ $t('lang') }}</span>
              <i-ep-arrow-down />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="i in langs" :key="i.value" :command="i.value">{{ i.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown @command="handleUserCommand">
            <span class="mgl-s">
              <span>{{ user?.name }}</span>
              <i-ep-arrow-down />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped lang="scss">
.header {
  line-height: 60px;
  box-shadow: 0 2px 8px 0 rgb(29 35 41 / 5%);
  :deep(.el-dropdown) {
    line-height: 60px;
    .el-tooltip__trigger > svg {
      vertical-align: middle;
    }
  }
}
.aside {
  transition: width 0.3s;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
  overflow: hidden;
}
.menu {
  border-right: none;
}
</style>