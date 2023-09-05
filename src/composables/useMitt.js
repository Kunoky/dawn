import mitt from 'mitt'

const mittCatch = {}
export function useMitt(name = 'global') {
  if (!mittCatch[name]) {
    mittCatch[name] = mitt()
  }
  return mittCatch[name]
}
