// 该service仅作本地调试
import { operateByStoreName, syncReq } from '@/utils/IDB'
import { listRole } from './role'
const { syncOp, getStore } = operateByStoreName('user')

export const login = async user => {
  const store = await getStore()
  const data = await syncReq(store.index('username').get(user.username))
  const res = {
    code: 0,
    data: null,
    msg: '',
  }
  if (!data || data.password !== user.password) {
    res.code = 1
    res.msg = '用户名或密码错误'
  } else {
    delete data.password
    delete data.role
    data.token = 'token'
    res.data = data
  }
  return res
}

export const getUser = async id => {
  const user = await syncOp('get', id)
  const role = await listRole({ name: user.role })
  const permission = {}
  role.list.forEach(i => {
    for (let p in i.permission) {
      if (permission[p]) {
        //权限合并
        permission[p] = permission[p] | i.permission[p]
      } else {
        permission[p] = i.permission[p]
      }
    }
  })
  user.permission = permission
  return user
}

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
