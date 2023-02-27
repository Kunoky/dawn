import { useUserStore } from '@/store/user'

/**
 * 权限指令，没有权限时隐藏元素
 * 用法 v-permission v-permission="'admin'" v-permission="['admin']"
 */
export default {
  install(Vue) {
    Vue.directive('permission', {
      inserted: function (el, binding) {
        const { value } = binding
        const store = useUserStore()
        // 登录即可
        if (!value && store.user) {
          return
        }
        if (Array.isArray(value)) {
          if (value.some(i => store.permission.inclueds(i))) {
            return
          }
        } else if (store.permission.inclueds(value)) {
          return
        }
        el.style.display = 'none'
      },
    })
  },
}
