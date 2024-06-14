export default {
  install(app, { hasRole }) {
    app.directive('hasRole', {
      mounted(el, binding) {
        const { value } = binding
        if (hasRole(value)) return
        el.style.display = 'none'
      },
    })
    app.config.globalProperties.$hasRole = hasRole
  },
}
