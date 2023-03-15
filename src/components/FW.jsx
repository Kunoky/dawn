export default function FunctionalWrapper({ component, attrs }) {
  if (typeof component !== 'function') return component
  return component(attrs)
}
