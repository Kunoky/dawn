const dicts = [
  {
    sort: 0,
    key: 'menu',
    val: 'Menu',
    category: 'menu',
    remark: '菜单字典',
    pId: 0,
    meta: {
      public: true,
    },
    id: 1,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 2,
    key: 'component',
    val: 'Component',
    meta: {
      title: 'Component',
      icon: 'yingyongchangjing',
    },
    id: 2,
  },
  {
    pId: 2,
    category: 'menu',
    sort: 1,
    key: 'componentPageWrapper',
    val: 'Page Wrapper',
    id: 3,
  },
  {
    pId: 2,
    category: 'menu',
    sort: 2,
    key: 'componentCTable',
    val: 'Common Table',
    id: 4,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 2,
    key: 'setting',
    val: 'Setting',
    meta: {
      icon: 'guanli',
    },
    id: 5,
  },
  {
    pId: 5,
    category: 'menu',
    sort: 1,
    key: 'settingDict',
    val: 'Dictionary',
    id: 6,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 3,
    key: 'Level1',
    val: 'Level 1',
    id: 7,
  },
  {
    pId: 7,
    category: 'menu',
    sort: 1,
    key: 'path1',
    val: 'Level2-1',
    id: 8,
  },
  {
    pId: 7,
    category: 'menu',
    sort: 2,
    key: 'Level2-2',
    val: 'Level2-2',
    id: 9,
  },
  {
    pId: 9,
    category: 'menu',
    sort: 1,
    key: 'path3',
    val: 'Level3-1',
    id: 10,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 4,
    key: 'https://cn.vitejs.dev',
    val: 'Vite',
    id: 11,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 5,
    key: 'https://pinia.vuejs.org',
    val: 'Pinia',
    id: 12,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 6,
    key: 'https://vitest.dev',
    val: 'Vitest',
    id: 13,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 7,
    key: 'https://github.com/vuejs/awesome-vue',
    val: 'Awesome',
    id: 14,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 1,
    key: 'demo',
    val: 'Demo',
    meta: {
      title: 'Custom Name',
      icon: 'zujian',
    },
    id: 15,
  },
  {
    pId: 0,
    category: 'bool',
    sort: 0,
    key: 'bool',
    val: 'Bool',
    remark: '选择项-是否',
    id: 16,
  },
  {
    pId: 16,
    category: 'bool',
    sort: 1,
    key: '0',
    val: '否',
    id: 17,
  },
  {
    pId: 16,
    category: 'bool',
    sort: 2,
    key: '1',
    val: '是',
    id: 18,
  },
  {
    pId: 0,
    category: 'gender',
    sort: 0,
    key: 'gender',
    val: '性别',
    id: 19,
  },
  {
    pId: 19,
    category: 'gender',
    sort: 1,
    key: '1',
    val: '男',
    id: 20,
  },
  {
    pId: 19,
    category: 'gender',
    sort: 2,
    key: '0',
    val: '女',
    id: 21,
  },
  {
    pId: 19,
    category: 'gender',
    sort: 3,
    key: '2',
    val: '其他',
    id: 22,
  },
  {
    pId: 5,
    category: 'menu',
    sort: 2,
    key: 'settingPermission',
    val: 'Permission',
    id: 23,
  },
  {
    pId: 5,
    category: 'menu',
    sort: 3,
    key: 'settingRole',
    val: 'Role',
    id: 24,
  },
  {
    pId: 5,
    category: 'menu',
    sort: 4,
    key: 'settingUser',
    val: 'User',
    id: 26,
  },
  {
    pId: 1,
    category: 'menu',
    sort: 0,
    key: 'home',
    val: 'Home',
    meta: {
      icon: 'home',
    },
    id: 27,
  },
]

const users = [
  {
    username: 'admin',
    password: 'admin',
    name: 'Admin',
    role: ['admin'],
  },
  {
    username: 'test',
    password: 'test',
    name: 'Test',
    role: ['test', 'test2', 'componentAdmin', 'guest'],
  },
  {
    username: 'guest',
    password: 'guest',
    name: 'Guest',
    role: ['guest'],
  },
]
const allPermission = {
  admin: 7,
}
const permissions = dicts
  .filter(i => i.category === 'menu')
  .map(i => {
    allPermission[i.key] = 7
    const p = {
      name: i.key,
      operand: 3,
    }
    if (p.name === 'demo') {
      p.operand = 5
      p.remark = 'Remark: 额外权限的说明'
    }
    return p
  })
dicts.push({
  name: 'admin',
  operand: 3,
})
allPermission.demo = 21
const roles = [
  {
    name: 'admin',
    permission: allPermission,
  },
  {
    name: 'componentAdmin',
    permission: {
      component: 0,
      componentPageWrapper: 7,
      componentCTable: 7,
    },
  },
  {
    name: 'test',
    permission: {
      setting: 0,
      settingDict: 3,
      settingPermission: 1,
      settingRole: 2,
    },
  },
  {
    name: 'test2',
    permission: {
      setting: 0,
      settingDict: 3,
      settingPermission: 3,
      settingRole: 4,
    },
  },
  {
    name: 'guest',
    permission: {
      demo: 21,
      'https://cn.vitejs.dev': 7,
      'https://pinia.vuejs.org': 7,
      'https://vitest.dev': 7,
      'https://github.com/vuejs/awesome-vue': 7,
    },
  },
]

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
      /** dict start */
      const dict = db.createObjectStore('dict', { keyPath: 'id', autoIncrement: true })
      dict.createIndex('category', 'category', { unique: false })
      dict.createIndex('pId', 'pId', { unique: false })
      dict.createIndex('pIdKey', ['pId', 'key'], { unique: true })
      dicts.forEach(i => {
        i.version = 1
        i.createdTime = new Date()
        i.updatedTime = new Date()
        dict.add(i)
      })
      /** dict end */

      /** user start */
      const user = db.createObjectStore('user', { keyPath: 'id', autoIncrement: true })
      user.createIndex('username', 'username', { unique: true })
      users.forEach(i => {
        i.version = 1
        i.createdTime = new Date()
        i.updatedTime = new Date()
        user.add(i)
      })
      /** user end */

      /** role start */
      const role = db.createObjectStore('role', { keyPath: 'id', autoIncrement: true })
      role.createIndex('name', 'name', { unique: true })
      roles.forEach(i => {
        i.version = 1
        i.createdTime = new Date()
        i.updatedTime = new Date()
        role.add(i)
      })
      /** role end */

      /** permission start */
      const permission = db.createObjectStore('permission', { keyPath: 'id', autoIncrement: true })
      permission.createIndex('name', 'name', { unique: true })
      permissions.forEach(i => {
        i.version = 1
        i.createdTime = new Date()
        i.updatedTime = new Date()
        permission.add(i)
      })
      /** permission end */
    }
  })

export async function getIDB() {
  if (!IDB) {
    IDB = await openDB()
  }
  return IDB
}

export async function getStore(storeName) {
  const db = await getIDB()
  return db.transaction(storeName, 'readwrite').objectStore(storeName)
}

export function syncReq(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = e => reject(e.target.error)
  })
}

export function syncOp(storeName, op, data) {
  return new Promise((resolve, reject) => {
    getStore(storeName)
      .then(store => syncReq(store[op](data)))
      .then(res => resolve(res))
      .catch(e => {
        ElMessage.error(e.message)
        reject(e)
      })
  })
}

export function operateByStoreName(storeName) {
  return {
    getStore() {
      return getStore(storeName)
    },
    syncOp(op, data) {
      return syncOp(storeName, op, data)
    },
  }
}
