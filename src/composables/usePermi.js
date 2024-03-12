import { useUserStore } from '../store/user'

export function usePermi(name) {
  const store = useUserStore()
  return (n, _name) => store.hasPermission(_name || name, n)
}
