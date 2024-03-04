/**
 * 数组转树
 * @param {Array} arr
 * @returns {Array[Array, Object]} 返回根数组和id映射对象
 */
export function arr2tree(arr, key = 'id', pKey = 'pId') {
  const idNode = {},
    root = []
  arr.forEach(i => {
    delete i.children
    if (idNode[i[key]]) {
      Object.assign(idNode[i[key]], i)
    } else {
      idNode[i[key]] = i
    }
    if (i[pKey] && i[pKey] !== '0') {
      idNode[i[pKey]] ||= {}
      idNode[i[pKey]].children ||= []
      idNode[i[pKey]].children.push(idNode[i[key]])
    } else {
      root.push(idNode[i[key]])
    }
  })
  return [root, idNode]
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

/**
 * 获取由'.'分割的嵌套属性
 * @param {Object} obj
 * @param {String} key
 * @returns {*}
 */
export function getNestProp(obj, key) {
  const keys = key.split('.')
  let v = obj
  keys.some(i => {
    v = v[i]
    if (!v) return true
    return false
  })
  return v
}

/**
 * 判断元素是否与选择器匹配
 * @param {*} element
 * @param {*} selector
 * @returns
 */
export function matchesSelector(element, selector) {
  if (element.matchesSelector) {
    return element.matchesSelector(selector)
  } else if (element.webkitMatchesSelector) {
    return element.webkitMatchesSelector(selector)
  } else if (element.mozMatchesSelector) {
    return element.mozMatchesSelector(selector)
  } else if (element.msMatchesSelector) {
    return element.msMatchesSelector(selector)
  } else {
    console.warn('matchesSelector is not support')
    return false
  }
}

export function getElNest(el, selector, finalEl = document.body) {
  if (matchesSelector(el, selector)) {
    return el
  } else if (el !== finalEl && el.parentNode) {
    return getElNest(el.parentNode, selector, finalEl)
  }
}

export function obj2params(obj) {
  let param = ''
  if (obj) {
    Object.entries(obj).forEach(([k, v]) => {
      param &&= param + '&'
      param += k + '=' + v
    })
  }
  return param
}

/**
 * 通配符匹配
 * @param {String} str
 * @param {String} pattern
 * @returns
 */
export function wildMatch(str, pattern) {
  return str.match(new RegExp('^' + pattern.replace('*', '.*').replace('?', '.') + '$'))
}

/**
 * input accept熟悉匹配
 * @param {String} type
 * @param {String} types
 * @returns {Boolean}
 */
export function mimeTypeMatch(type, types) {
  return types.split(/,\s*/).some(i => wildMatch(type, i))
}

/**
 *
 * @description 导出csv
 * @author kuroky <1048413674@qq.com>
 * @date 2023-10-27
 * @param {Array} data csv数据
 * @param {String} name 下载时的文件名
 */
export function exportCSV(data, name) {
  name ??= new Date().toLocaleString()
  const csv = []
  data.forEach(i => {
    csv.push(['\ufeff' + i.join(',') + '\n'])
  })
  const blob = new Blob(csv, { type: 'text/csv;charset=UTF-8' })
  const url = URL.createObjectURL(blob)
  // const url =  "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(csv)
  let link = document.createElement('a')
  link.href = url
  link.download = name + '.csv'
  link.click()
  URL.revokeObjectURL(url)
  link.remove()
}

/**
 * @description 下载
 * @author kuroky <1048413674@qq.com>
 * @date 2024-02-01
 * @param {*} url
 * @param {*} name
 */
export function download(url, name) {
  let link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  link.remove()
}

export function downloadFile(file, name, type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
  const blob = new Blob([file], { type })
  const url = URL.createObjectURL(blob)
  let link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
  link.remove()
}

/**
 * @description 复制文本
 * @author kuroky <1048413674@qq.com>
 * @date 2023-11-23
 * @param {String} txt
 */
export function copy(txt) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(txt)
      .then(() => {
        ElMessage.success('复制成功')
      })
      .catch(() => {
        ElMessage.error('复制失败')
      })
  } else {
    // 创建text area
    const textArea = document.createElement('textarea')
    textArea.value = txt
    // 使text area不在viewport，同时设置不可见
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    return new Promise((resolve, reject) => {
      // 执行复制命令并移除文本框
      document.execCommand('copy') ? resolve() : reject(new Error('出错了'))
      textArea.remove()
    }).then(
      () => {
        ElMessage.success('复制成功')
      },
      () => {
        ElMessage.error('复制失败')
      }
    )
  }
}

/**
 * 判断时间是否是过去的
 * @param {String | Date} date
 * @returns {Boolean}
 */
export function isBeforeNow(date) {
  if (typeof date === 'string') date = new Date(date)
  if (date <= Date.now()) return true
  return false
}

/**
 * @description base64转File
 * @author kuroky <1048413674@qq.com>
 * @date 2023-11-23
 * @param {String} base64
 * @param {String} name
 * @returns {File}
 */
export function base642file(base64, name = Date.now()) {
  const [h, b] = base64.split(',')
  const type = h.match(/^data:([^;]+);base64/)[1]
  const buf = atob(b)
  let len = buf.length
  const u8arr = new Uint8Array(len)
  while (len--) {
    u8arr[len] = buf.charCodeAt(len)
  }
  return new File([u8arr], name, { type })
}

export const regexp = {
  // eslint-disable-next-line
  en: /^[a-zA-Z0-9\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\\\;\'\,\.\/\{\}\|\:\"\>\?\"' '\t\n]*$/,
  telephone: /^((0\d{2,3}(-)?\d{7,8})|(1[3-9]\d{9}))$/,
  email:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  phone: /^1[3-9]\d{9}$/,
}

export const elValidator = {
  en: (_, v, cb) => cb(!v || regexp.en.test(v) ? undefined : new Error('请输入英文')),
  telephone: (_, v, cb) => cb(!v || regexp.telephone.test(v) ? undefined : new Error('请输入正确的电话号码')),
  email: (_, v, cb) => cb(!v || regexp.email.test(v) ? undefined : new Error('请输入正确的邮箱')),
  phone: (_, v, cb) => cb(!v || regexp.phone.test(v) ? undefined : new Error('请输入正确的手机号码')),
  beforeNow: (_, v, cb) => cb(!v || regexp.beforeNow.test(v) ? undefined : new Error('请选择过去的时间')),
  select: { required: true, message: '请选择', trigger: 'blur' },
  input: { required: true, message: '请输入', trigger: 'blur' },
}

export const varValidator = {
  en: v => !v || regexp.en.test(v) || '请输入英文',
  telephone: v => !v || regexp.telephone.test(v) || '请输入正确的电话号码',
  email: v => !v || regexp.email.test(v) || '请输入正确的邮箱',
  phone: v => !v || regexp.phone.test(v) || '请输入正确的手机号码',
  beforeNow: v => !v || isBeforeNow(v) || '请选择过去的时间',
}

export const validator = elValidator

/**
 * @description 服务器文件预览
 * @author kuroky <1048413674@qq.com>
 * @date 2023-12-07
 * @param {String} path
 */
export function previewFile(path) {
  window.open(import.meta.env.VITE_SERVER_PATH + path)
}

/**
 * @description 字符串拼接
 * @author kuroky <1048413674@qq.com>
 * @date 2023-12-11
 * @param {Array} values
 * @param {String} separator
 * @returns
 */
export function strConcat(values, separator = '') {
  return values.filter(i => i || i !== 0).join(separator)
}

/**
 * @description 解析query
 * @author kuroky <1048413674@qq.com>
 * @date 2023-12-12
 * @param {String} q
 */
export function parseQuery(q) {
  const params = {}
  q &&
    q.split('&').forEach(i => {
      const [k, v] = i.split('=')
      params[k] = v
    })
  return params
}

/**
 * @description 解析url
 * @author kuroky <1048413674@qq.com>
 * @date 2023-12-12
 * @param {*} url
 * @returns
 */
export function parseURL(url) {
  const [path, q] = url.split('?')
  const query = parseQuery(q)
  return {
    path,
    query,
  }
}
