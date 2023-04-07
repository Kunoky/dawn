import { useDark, useToggle } from '@vueuse/core'

export function useTheme() {
  const isDark = useDark()
  const toggle = useToggle(isDark)
  return {
    isDark,
    toggle,
  }
}
