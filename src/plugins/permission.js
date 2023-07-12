import { getToken } from '@/utils/auth'
import { useUserStore } from '@/store/user'

export default {
  install(app, { hasPermission }) {
    /**
     * 权限指令，没有权限时隐藏元素
     * 用法 v-permission v-permission:admin v-permission:demo="1"
     */
    app.directive('permission', {
      mounted: function (el, binding) {
        const { value, arg } = binding
        // 登录即可
        if (!arg && getToken()) {
          if (value || value === 0) console.warn('value requires args to take effect')
          return
        }
        if (hasPermission(arg, value)) return
        el.style.display = 'none'
      },
    })

    app.directive('hasPermi', {
      mounted(el, binding) {
        const { value } = binding
        const all_permission = '*:*:*'
        const store = useUserStore()
        const permissions = store.user?.permissions

        if (value && value instanceof Array && value.length > 0) {
          const permissionFlag = value

          const hasPermissions = permissions?.some(permission => {
            return all_permission === permission || permissionFlag.includes(permission)
          })

          if (!hasPermissions) {
            el.parentNode && el.parentNode.removeChild(el)
          }
        } else {
          throw new Error(`请设置操作权限标签值`)
        }
      },
    })
    app.config.globalProperties.$hasPermission = hasPermission
  },
}
