<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside ht-100vh dp-f fd-c">
      <el-menu :default-active="active" :collapse="isCollapse" class="fl-1 menu">
        <menu-item-recursive v-for="i in menuTree" :key="i.id" :data="i" />
      </el-menu>
      <div class="bdt bdc-4 pd-s cs-p">
        <i v-if="isCollapse" class="el-icon-s-unfold" @click="isCollapse = !isCollapse" />
        <i v-else class="el-icon-s-fold" @click="isCollapse = !isCollapse" />
      </div>
    </el-aside>

    <el-container class="ht-100vh">
      <el-header class="header">
        <span>{{ appName }}</span>
        <div class="ft-r">
          <el-dropdown @command="handleCommand">
            <span v-loading="loading.lang">
              <span>{{ $t('lang') }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="i in langs" :key="i.value" :command="i.value">{{ i.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleUserCommand">
            <span class="mgl-s">
              <span>{{ user.name }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { mapState, mapActions } from 'pinia'
import MenuItemRecursive from '@/components/MenuItemRecursive.vue'

export default {
  name: 'DefaultLayout',
  components: { MenuItemRecursive },
  computed: {
    ...mapState(useAppStore, ['lang', 'langs', 'loading', 'menuTree']),
    ...mapState(useUserStore, ['user']),
  },
  created() {
    if (!localStorage.getItem('menuTree')) {
      this.genMenu()
    }
  },
  data() {
    return {
      /* global __APP_NAME__ */
      appName: __APP_NAME__,
      active: '',
      isCollapse: false,
    }
  },
  methods: {
    ...mapActions(useAppStore, ['setLang', 'genMenu']),
    ...mapActions(useUserStore, ['logout']),
    handleCommand(e) {
      this.setLang(e)
    },
    handleUserCommand(e) {
      switch (e) {
        case 'logout':
          this.logout()
          break
        default:
      }
    },
  },
  watch: {
    $route: {
      handler() {
        this.$nextTick(() => {
          const active = document.querySelector('.el-menu .router-link-active')
          if (active) {
            this.active = active.dataset.id
          }
        })
      },
      immediate: true,
    },
  },
}
</script>
<style scoped lang="scss">
.header {
  line-height: 60px;
  box-shadow: 0 2px 8px 0 rgb(29 35 41 / 5%);
}
.aside {
  transition: width 0.3s;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
.menu {
  border-right: none;
}
</style>
