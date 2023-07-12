// 该service仅作本地调试
import { operateByStoreName } from '@/utils/IDB'
const { syncOp } = operateByStoreName('user')

export const login = async user => axios.post('/login', user)

export const getUser = async () => axios.get('/getInfo')

export const listRoute = async () => axios.get('/getRouters')

export async function addUser(data) {
  data.version = 1
  data.createdTime = new Date()
  data.updatedTime = new Date()

  return await syncOp('add', data)
}

export async function putUser(data) {
  const _data = await syncOp('get', data.id)
  Object.assign(_data, data)
  _data.version++
  _data.updateTime = new Date()
  return await syncOp('put', _data)
}

export async function delUser(id) {
  return await syncOp('delete', id)
}

export async function listUser({ id, name, username, page, size }) {
  let list = await syncOp('getAll')
  list = list.filter(i => {
    if (id && i.id !== id) return false
    if (username && i.username !== username) return false
    if (name && !i.name.match(name)) return false
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
