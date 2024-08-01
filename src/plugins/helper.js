let inputFocused
function focusInput(el) {
  const input = el.querySelector('input')
  if (input) el = input
  if (inputFocused === el || !el.offsetParent) return
  inputFocused = el
  // 输入框聚焦，下拉框展开
  if (inputFocused.getAttribute('readonly') === null) {
    inputFocused.focus()
  } else {
    inputFocused.click()
  }
}
export default {
  install(app) {
    app.directive('focus', {
      // 当被绑定的元素插入到DOM中时……
      mounted: focusInput,

      // 可选：在组件更新时再次聚焦，例如v-if条件变化后重新渲染
      updated: focusInput,
    })
  },
}
