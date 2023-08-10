import { getToken } from '@/utils/auth'

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
        if (hasPermission(value)) return
        el.style.display = 'none'
      },
    })
    app.config.globalProperties.$hasPermission = hasPermission
  },
}
