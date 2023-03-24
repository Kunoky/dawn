// 该service仅作本地调试
let IDB

const openDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open('dawn', 1)
    request.onerror = function (e) {
      console.error('indexedDB Error: ' + e.target.errorCode)
      reject(e.target.error)
    }
    request.onsuccess = function (e) {
      IDB = e.target.result
      resolve(e.target.result)
    }

    request.onupgradeneeded = function (e) {
      const db = e.target.result
      // 为该数据库创建一个对象仓库
      const dict = db.createObjectStore('dict', { keyPath: 'id', autoIncrement: true })
      dict.createIndex('category', 'category', { unique: false })
      dict.createIndex('pId', 'pId', { unique: false })
      dict.createIndex('pIdKey', ['pId', 'key'], { unique: true })
    }
  })

export async function getIDB() {
  if (!IDB) {
    IDB = await openDB()
  }
  return IDB
}

export async function getStore() {
  const db = await getIDB()
  return db.transaction('dict', 'readwrite').objectStore('dict')
}

export function syncReq(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = e => reject(e.target.error)
  })
}

export function syncOp(op, data) {
  return new Promise((resolve, reject) => {
    getStore()
      .then(store => syncReq(store[op](data)))
      .then(res => resolve(res))
      .catch(e => {
        ElMessage.error(e.message)
        reject(e)
      })
  })
}
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
  const id = await syncReq(store.put(dict))
  return id
}

export async function delDict(id) {
  const dict = await getDict(id)
  const store = await getStore()
  if (dict.pId) await rootUpdate(store, dict.category)
  const res = await syncReq(store.delete(id))
  return res
}

export async function getDict(id) {
  return syncOp('get', id)
}

export async function listDict({ category, pId, page, size }) {
  let list = await syncOp('getAll')
  list = list.filter(i => {
    if (category && i.category !== category) return false
    if ((pId || pId === 0) && i.pId !== pId) return false
    return true
  })
  const total = list.length
  if (size) {
    const end = page * size
    list = list.slice(end - size, end)
  }
  return {
    list,
    total,
  }
}
