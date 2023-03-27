const dicts = [
  {
    sort: 0,
    key: 'menu',
    val: 'Menu',
    category: 'menu',
    remark: '菜单字典',
    pId: 0,
    version: 14,
    createdTime: '2023-03-24T09:20:08.291Z',
    updatedTime: '2023-03-24T09:56:06.801Z',
    id: 1,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 1,
    key: '/component',
    val: 'Component',
    meta: {
      title: 'Component',
    },
    version: 1,
    createdTime: '2023-03-24T09:23:28.542Z',
    updatedTime: '2023-03-24T09:23:28.542Z',
    id: 2,
  },
  {
    pId: 2,
    category: 'menu',
    sort: 1,
    key: '/component/page-wrapper',
    val: 'Page Wrapper',
    version: 1,
    createdTime: '2023-03-24T09:24:47.639Z',
    updatedTime: '2023-03-24T09:24:47.639Z',
    id: 3,
  },
  {
    pId: 5,
    category: 'menu',
    sort: 1,
    key: '/setting/dict',
    val: 'Dictionary',
    version: 1,
    createdTime: '2023-03-24T09:28:40.040Z',
    updatedTime: '2023-03-24T09:28:40.040Z',
    id: 6,
  },
  {
    pId: 7,
    category: 'menu',
    sort: 1,
    key: '/path1',
    val: 'Level2-1',
    version: 1,
    createdTime: '2023-03-24T09:51:27.269Z',
    updatedTime: '2023-03-24T09:51:27.269Z',
    id: 8,
  },
  {
    pId: 9,
    category: 'menu',
    sort: 1,
    key: '/path2/path3',
    val: 'Level3-1',
    version: 1,
    createdTime: '2023-03-24T09:52:22.396Z',
    updatedTime: '2023-03-24T09:52:22.396Z',
    id: 10,
  },
  {
    pId: 2,
    category: 'menu',
    sort: 2,
    key: '/component/c-table',
    val: 'Common Table',
    version: 1,
    createdTime: '2023-03-24T09:25:51.375Z',
    updatedTime: '2023-03-24T09:25:51.375Z',
    id: 4,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 2,
    key: '/setting',
    val: 'Setting',
    version: 1,
    createdTime: '2023-03-24T09:26:36.909Z',
    updatedTime: '2023-03-24T09:26:36.909Z',
    id: 5,
  },
  {
    pId: 7,
    category: 'menu',
    sort: 2,
    key: '/path2',
    val: 'Level2-2',
    version: 1,
    createdTime: '2023-03-24T09:51:51.227Z',
    updatedTime: '2023-03-24T09:51:51.227Z',
    id: 9,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 3,
    key: '/',
    val: 'Level 1',
    version: 1,
    createdTime: '2023-03-24T09:50:48.512Z',
    updatedTime: '2023-03-24T09:50:48.512Z',
    id: 7,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 4,
    key: 'https://cn.vitejs.dev',
    val: 'Vite',
    version: 1,
    createdTime: '2023-03-24T09:53:14.400Z',
    updatedTime: '2023-03-24T09:53:14.400Z',
    id: 11,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 5,
    key: 'https://pinia.vuejs.org',
    val: 'Pinia',
    version: 1,
    createdTime: '2023-03-24T09:53:45.230Z',
    updatedTime: '2023-03-24T09:53:45.230Z',
    id: 12,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 6,
    key: 'https://vitest.dev',
    val: 'Vitest',
    version: 1,
    createdTime: '2023-03-24T09:55:10.674Z',
    updatedTime: '2023-03-24T09:55:10.674Z',
    id: 13,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 7,
    key: 'https://github.com/vuejs/awesome-vue',
    val: 'Awesome',
    version: 1,
    createdTime: '2023-03-24T09:56:06.796Z',
    updatedTime: '2023-03-24T09:56:06.796Z',
    id: 14,
  },
]
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
      dicts.forEach(i => {
        dict.add(i)
      })
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
