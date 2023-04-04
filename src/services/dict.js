// 该service仅作本地调试
import { operateByStoreName, syncReq } from '@/utils/IDB'

const { getStore, syncOp } = operateByStoreName('dict')

function rootUpdate(store, category) {
  return new Promise((resolve, reject) => {
    const index = store.index('category')
    const keyRange = IDBKeyRange.only(category)
    const req = index.openCursor(keyRange)
    req.onsuccess = e => {
      const cursor = e.target.result
      if (!cursor) return reject('root not find')
      if (cursor.value.pId === 0) {
        const root = cursor.value
        root.version++
        root.updatedTime = new Date()
        resolve(syncReq(store.put(root)))
      } else {
        cursor.continue()
      }
    }
    req.onerror = e => reject(e.target.error)
  })
}
export async function addDict(dict) {
  dict.pId ??= 0
  dict.sort ??= 0
  dict.version = 1
  dict.createdTime = new Date()
  dict.updatedTime = new Date()

  const store = await getStore()
  if (dict.pId) await rootUpdate(store, dict.category)
  const id = await syncReq(store.add(dict))

  return id
}

export async function putDict(dict) {
  const _dict = await getDict(dict.id)
  Object.assign(_dict, dict)
  _dict.version++
  _dict.updateTime = new Date()
  const store = await getStore()
  if (dict.pId) await rootUpdate(store, dict.category)
  const id = await syncReq(store.put(_dict))
  return id
}

export async function delDict(id) {
  if (!Array.isArray(id)) {
    id = [id]
  }
  const dict = await getDict(id[0])
  const store = await getStore()
  if (dict.pId) await rootUpdate(store, dict.category)
  return Promise.all(id.map(i => syncReq(store.delete(i))))
}

export async function getDict(id) {
  return syncOp('get', id)
}

export async function listDict({ id, category, pId, page, size }) {
  let list = await syncOp('getAll')
  list = list.filter(i => {
    if (Array.isArray(id)) {
      if (!id.includes(i.id)) return false
    } else {
      if (id && i.id !== id) return false
    }
    if (Array.isArray(category)) {
      if (!category.includes(i.category)) return false
    } else {
      if (category && i.category !== category) return false
    }
    if (Array.isArray(pId)) {
      if (!pId.includes(i.pId)) return false
    } else {
      if ((pId || pId === 0) && i.pId !== pId) return false
    }

    return true
  })
  const total = list.length
  list.sort((a, b) => a.sort - b.sort)
  if (size) {
    const end = page * size
    list = list.slice(end - size, end)
  }
  return {
    list,
    total,
  }
}
