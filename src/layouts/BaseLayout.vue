<script setup>
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import MenuItemRecursive from '@/components/MenuItemRecursive.vue'
import TagsView from './components/TagsView.vue'

const userStore = useUserStore()
const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const appName = __APP_NAME__
const active = ref('')
const isCollapse = ref(false)
const { lang, langs, loading } = storeToRefs(appStore)
const { user, menuTree } = storeToRefs(userStore)
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

const handleLangChange = v => {
  appStore.setLang(v)
}

const userOptions = [
  {
    label: i18n.t('view.layout.userProfile'),
    value: 'userProfile',
  },
  {
    label: i18n.t('common.logout'),
    value: 'logout',
  },
]
const handleUserCommand = e => {
  switch (e) {
    case 'userProfile':
      router.push('/user/profile')
      break
    case 'logout':
      userStore.logout()
      break
    default:
  }
}

const { isDark, toggle } = useTheme()

// 懒加载组件外面裹了一层，导致keepAlive无法获取到name进行缓存
const setComponentName = (c, name) => {
  c.type.name = name
  return c
}
</script>
<template>
  <el-container class="base-layout">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="base-layout_aside ht-100vh dp-f fd-c">
      <el-menu :default-active="active" :collapse="isCollapse" class="fx-1 base-layout_menu of-o">
        <menu-item-recursive v-for="i in menuTree" :key="i.id" :data="i" />
      </el-menu>
      <div class="bdt bdc-4 pd-s cs-p">
        <i-ep-expand
          v-if="isCollapse"
          @click="isCollapse = !isCollapse"
          role="button"
          :aria-description="$t('common.expand')"
        />
        <i-ep-fold v-else @click="isCollapse = !isCollapse" role="button" :aria-description="$t('common.collapse')" />
      </div>
    </el-aside>
    <el-container class="ht-100vh">
      <el-header class="base-layout_header">
        <div class="main base-layout_header dp-f jc-sb">
          <div>
            <span>{{ appName }}</span>
          </div>

          <div class="">
            <el-button link @click="toggle()" :aria-description="isDark ? $t('theme.light') : $t('theme.dark')">
              <i-ep-sunny v-if="isDark"></i-ep-sunny>
              <i-ep-moon v-else></i-ep-moon>
            </el-button>
            <CDropdown :modelValue="lang" @update:modelValue="handleLangChange" :options="langs">
              <span v-loading="loading.lang" class="mgl-s">{{ $t('lang') }}</span>
            </CDropdown>
            <CDropdown v-if="user" @update:modelValue="handleUserCommand" :options="userOptions">
              <span>{{ user?.nickName }}</span>
            </CDropdown>
            <!-- <el-dropdown v-if="user" @command="handleUserCommand">
              <span class="mgl-s">
                <span>{{ user?.nickName }}</span>
                <i-ep-arrow-down />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">{{ $t('common.logout') }}</el-dropdown-item>
                  <el-dropdown-item command="logout">{{ $t('view.layout.userProfile') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown> -->
            <router-link v-else to="/login" class="fs-5 cl-8 mgl-s">{{ $t('common.login') }}</router-link>
          </div>
        </div>
        <TagsView />
      </el-header>
      <el-main class="base-layout_main">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="tagsViewStore.names">
              <component :is="setComponentName(Component, route.name)" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang="scss">
.base-layout {
  color: var(--el-text-color-primary);
  background-color: var(--gray-1);
  min-width: 1280px;
  max-width: 2000px;
  margin: 0 auto;
  &_header {
    padding: 0;
    & > .main {
      padding: var(--el-header-padding);
      line-height: 60px;
      box-shadow: 0 2px 8px 0 rgb(29 35 41 / 5%);
      .el-dropdown {
        line-height: 60px;
        .el-tooltip__trigger > svg {
          vertical-align: middle;
        }
      }
    }
  }
  &_aside {
    transition: width 0.3s;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    overflow: hidden;
  }
  &_menu {
    border-right: none;
    .el-sub-menu__title,
    .el-menu-item {
      & i {
        font-size: 18px;
      }
    }
  }
  &_main {
    background-color: var(--gray-3);
    padding: var(--size-m);
    & > * {
      min-height: 100%;
      box-sizing: border-box;
    }
    .bg {
      background-color: var(--gray-1);
      border-radius: 2px;
      &:not(.of-a):not(.of-s) {
        padding: var(--size-m);
      }
      & + .bg {
        margin-top: var(--size-m);
      }
    }
  }
  .c-table {
    .c-table__form,
    .c-table__main,
    .el-pagination {
      background-color: var(--gray-1);
      border-radius: 2px;
      padding-left: var(--size-m);
      padding-right: var(--size-m);
    }

    .c-table__form {
      padding-top: var(--size-m);
      margin-bottom: var(--size-m);
    }
    .c-table__toolbar {
      padding-top: var(--size-m);
    }
    .el-pagination {
      margin: 0;
      padding: var(--size-m);
    }
  }
  .el-header {
    height: 100px;
  }
}
</style>
