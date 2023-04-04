// 该service仅作本地调试
import { operateByStoreName } from '@/utils/IDB'

const { syncOp } = operateByStoreName('role')

export async function addRole(data) {
  data.version = 1
  data.createdTime = new Date()
  data.updatedTime = new Date()

  return await syncOp('add', data)
}

export async function putRole(data) {
  const _data = await getRole(data.id)
  Object.assign(_data, data)
  _data.version++
  _data.updateTime = new Date()
  return await syncOp('put', _data)
}

export async function delRole(id) {
  return await syncOp('delete', id)
}

export async function getRole(id) {
  return await syncOp('get', id)
}

export async function listRole({ id, name, page, size }) {
  let list = await syncOp('getAll')
  list = list.filter(i => {
    if (id && i.id !== id) return false
    if (Array.isArray(name)) {
      if (!name.includes(i.name)) return false
    } else if (name && !i.name.match(name)) return false
    return true
  })
  const total = list.length
  list.sort((a, b) => b.id - a.id)
  if (size) {
    const end = page * size
    list = list.slice(end - size, end)
  }
  return {
    list,
    total,
  }
}
