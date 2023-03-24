/**
 * 数组转树
 * @param {Array} arr
 * @returns {Array[Array, Object]} 返回根数组和id映射对象
 */
export function arr2tree(arr) {
  const idObj = {},
    root = []
  arr.forEach(i => {
    if (i.meta && typeof i.meta === 'string') {
      i.meta = JSON.parse(i.meta)
    }
    if (idObj[i.id]) {
      Object.assign(idObj[i.id], i)
    } else {
      idObj[i.id] = i
    }
    if (i.pId) {
      idObj[i.pId] ||= { children: [] }
      idObj[i.pId].children ||= []
      idObj[i.pId].children.push(i)
    } else {
      root.push(i)
    }
  })
  return [root, idObj]
}
