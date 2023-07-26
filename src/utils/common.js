/**
 * 数组转树
 * @param {Array} arr
 * @returns {Array[Array, Object]} 返回根数组和id映射对象
 */
export function arr2tree(arr, key = 'id', pKey = 'pId') {
  const idObj = {},
    root = []
  arr.forEach(i => {
    i.children = undefined
    if (idObj[i[key]]) {
      Object.assign(idObj[i[key]], i)
    } else {
      idObj[i[key]] = i
    }
    if (i[pKey]) {
      idObj[i[pKey]] ||= {}
      idObj[i[pKey]].children ||= []
      idObj[i[pKey]].children.push(idObj[i[key]])
    } else {
      root.push(idObj[i[key]])
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
 * 将num转成2进制，看从右到左第n位是否有值
 * @param {Number} num
 * @param {Number} n
 * @returns {Boolean}
 */
export function hasBit(num, n) {
  return !!((num >> n) % 2)
}

export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time
        .replace(new RegExp(/-/gm), '/')
        .replace('T', ' ')
        .replace(new RegExp(/\.[\d]{3}/gm), '')
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 分隔符转驼峰
 * @param {string} str
 * @param {string} separator
 * @returns
 */
export function sep2Hump(str, separator = '_') {
  return str.replace(new RegExp('\\' + separator + '(\\w)|\\' + separator, 'g'), (_, letter) => {
    if (letter) {
      return letter.toUpperCase()
    }
    return ''
  })
}
