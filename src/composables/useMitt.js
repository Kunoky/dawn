import mitt from 'mitt'

const mittMap = {}

export function useMitt(name = 'global') {
  return (mittMap[name] ??= mitt())
}
