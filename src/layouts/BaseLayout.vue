<script setup>
// import { useAppStore } from '@/store/app'
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
const { user, menuTree, idMenu, keyMenu } = storeToRefs(userStore)
const breadcrumb = ref([])
const mitter = useMitt()
const mainRef = ref()
let mainSize = ''
const resizeObserver = new ResizeObserver(() => {
  const { scrollHeight, scrollWidth } = mainRef.value.$el
  const size = {
    ...mainRef.value.$el.getBoundingClientRect().toJSON(),
    scrollHeight,
    scrollWidth,
  }
  const sizeStr = JSON.stringify(size)
  if (sizeStr !== mainSize) {
    mainSize = sizeStr
    mitter.emit('main-size-change', size)
  }
})

onMounted(() => {
  resizeObserver.observe(mainRef.value.$el)
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(
  route,
  async v => {
    await nextTick()
    const activeLink = document.querySelector('.el-menu .router-link-active')
    if (activeLink) {
      active.value = activeLink.dataset.id
    }
    let menuPath = []
    if (v.name) {
      let menu = keyMenu.value[v.name]
      if (menu) {
        menuPath = getBreadcrumb(menu)
      }
    }
    breadcrumb.value = menuPath
  },
  { immediate: true }
)

function getBreadcrumb(menu, menus = []) {
  menus.unshift(menu)
  if (menu.pId && menu.pId !== '0') {
    getBreadcrumb(idMenu.value[menu.pId], menus)
  }
  return menus
}
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
if (user.value.roles?.includes('fse')) {
  userOptions.splice(1, 0, {
    label: '切换FSE',
    value: 'fse',
  })
}
const handleUserCommand = e => {
  switch (e) {
    case 'userProfile':
      router.push('/user/profile')
      break
    case 'fse':
      location.href = '/mobile/'
      break
    case 'logout':
      userStore.logout()
      break
    default:
  }
}

const { isDark, toggle } = useTheme()
function toggleTheme(e) {
  const transition = document.startViewTransition(toggle)

  transition.ready.then(() => {
    const { clientX, clientY } = e
    const radius = Math.hypot(Math.max(clientX, innerWidth - clientX), Math.max(clientY, innerHeight - clientY))
    if (isDark.value)
      document.documentElement.animate(
        {
          clipPath: [`circle(${radius}px at ${clientX}px ${clientY}px)`, `circle(0% at ${clientX}px ${clientY}px)`],
        },
        {
          duration: 500,
          pseudoElement: '::view-transition-old(root)',
        }
      )
    else
      document.documentElement.animate(
        {
          clipPath: [`circle(0% at ${clientX}px ${clientY}px)`, `circle(${radius}px at ${clientX}px ${clientY}px)`],
        },
        {
          duration: 500,
          pseudoElement: '::view-transition-new(root)',
        }
      )
  })
}

// 懒加载组件外面裹了一层，导致keepAlive无法获取到name进行缓存
const setComponentName = (c, name) => {
  if (!c?.type) return
  c.type.name = name
  return c
}
</script>
<template>
  <el-container class="base-layout">
    <el-aside
      v-show="menuTree.length"
      :width="isCollapse ? '64px' : '200px'"
      class="base-layout_aside ht-100vh dp-f fd-c"
    >
      <div class="fs-2 fw-b dp-f ai-c jc-c logo">
        <img v-if="isCollapse" src="/logo-s.png" class="mgv-s" alt="logo" />
        <template v-else>
          <img src="/logo.png" class="mgr-m" alt="logo" />
          <span>{{ appName }}</span>
        </template>
      </div>
      <el-menu :default-active="active" :collapse="isCollapse" theme="dark" class="fx-1 base-layout_menu of-o">
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
          <el-breadcrumb>
            <el-breadcrumb-item v-for="i in breadcrumb" :key="i.name">{{ i.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="">
            <el-button link @click="toggleTheme" :aria-description="isDark ? $t('theme.light') : $t('theme.dark')">
              <i-ep-sunny v-if="isDark"></i-ep-sunny>
              <i-ep-moon v-else></i-ep-moon>
            </el-button>
            <CDropdown :modelValue="lang" @update:modelValue="handleLangChange" :options="langs">
              <span v-loading="loading.lang" class="mgl-s">{{ $t('lang') }}</span>
            </CDropdown>
            <CDropdown v-if="user.userId" @update:modelValue="handleUserCommand" :options="userOptions">
              <span class="cs-p">{{ user.userName }}</span>
            </CDropdown>
            <el-button v-else class="mgl-s" @click="userStore.goLogin" text>{{ $t('common.login') }}</el-button>
          </div>
        </div>
        <TagsView />
      </el-header>
      <el-main ref="mainRef" class="base-layout_main">
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
::view-transition-new(root),
::view-transition-old(root) {
  animation: none;
}

.dark::view-transition-old(root) {
  z-index: 1;
}

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
    .el-breadcrumb {
      line-height: unset;
    }
  }
  &_aside {
    transition: width 0.3s;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    overflow: hidden;
    .logo {
      height: 60px;
      color: #fff;
      background: #e71316;
      img {
        height: 22px;
      }
    }
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
    .c-table__main {
      background-color: var(--gray-1);
      border-radius: 2px;
      padding-left: var(--size-m);
      padding-right: var(--size-m);
    }

    .c-table__form {
      padding-top: var(--size-m);
      margin-bottom: var(--size-m);
    }
    &__main .el-table {
      .el-scrollbar__bar.is-horizontal {
        height: 12px;
      }
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
