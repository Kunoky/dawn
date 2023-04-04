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
      idObj[i.pId] ||= {}
      idObj[i.pId].children ||= []
      idObj[i.pId].children.push(idObj[i.id])
    } else {
      root.push(idObj[i.id])
    }
  })
  return [root, idObj]
}

/**
 * 树转数组
 * @param {Array} tree 树形数据
 * @param {String} key 需要返回的key值，否则返回对象自身
 * @param {Array} arr 最终返回的数组
 * @returns {Array}
 */
export function tree2arr(tree, key, arr = []) {
  tree.forEach(i => {
    const { children, ...rest } = i
    if (key) {
      arr.push(i[key])
    } else {
      arr.push(rest)
    }
    if (Array.isArray(children)) {
      tree2arr(children, key, arr)
    }
  })
  return arr
}

/**
 * 将num转成2进制，看从右到左第n（从1开始）位是否有值
 * @param {Number} num
 * @param {Number} n
 * @returns {Boolean}
 */
export function hasBit(num, n) {
  const binary = num.toString(2)
  const len = binary.length
  if (binary[len - n] !== '1') return false
  return true
}
