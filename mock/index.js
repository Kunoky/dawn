function resData(data, status = 200, msg = '调用成功', code = 200) {
  return {
    data,
    status,
    msg,
    code,
  }
}

function resPage(data) {
  return resData({
    records: data,
    totalRow: data.length,
  })
}

const menus = [
  {
    menuId: 0,
    parentId: 0,
    menuType: 2,
    menuName: '超级管理员',
    orderNum: 0,
    path: '*:*:*',
    status: 1,
  },
  {
    menuId: 1,
    parentId: 0,
    menuType: 1,
    icon: 'ep:house',
    menuName: '首页',
    path: '/home',
    routeName: 'Home',
    orderNum: 0,
    isCache: 1,
    visible: 1,
    status: 1,
  },
  {
    menuId: 2,
    parentId: 0,
    menuType: 1,
    icon: 'ep:setting',
    menuName: '系统管理',
    orderNum: 0,
    path: '/system',
    routeName: 'System',
    isCache: 1,
    visible: 1,
    status: 1,
  },
  {
    menuId: 3,
    parentId: 2,
    menuType: 1,
    icon: 'ep:set-up',
    menuName: '菜单管理',
    orderNum: 0,
    path: '/system/menu',
    routeName: 'SystemMenu',
    isCache: 1,
    visible: 1,
    status: 1,
  },
  {
    menuId: 4,
    parentId: 2,
    menuType: 1,
    icon: 'ant-design:crown-outlined',
    menuName: '角色管理',
    orderNum: 0,
    path: '/system/role',
    routeName: 'SystemRole',
    isCache: 1,
    visible: 1,
    status: 1,
  },
  {
    menuId: 5,
    parentId: 2,
    menuType: 1,
    icon: 'ep:user',
    menuName: '用户管理',
    orderNum: 0,
    path: '/system/user',
    routeName: 'SystemUser',
    isCache: 1,
    visible: 1,
    status: 1,
  },
  {
    menuId: 6,
    parentId: 2,
    menuType: 1,
    icon: 'ant-design:apartment-outlined',
    menuName: '组织管理',
    orderNum: 0,
    path: '/system/org',
    routeName: 'SystemOrg',
    isCache: 1,
    visible: 1,
    status: 1,
  },
  {
    menuId: 7,
    parentId: 2,
    menuType: 1,
    icon: 'ant-design:profile-outlined',
    menuName: '字典管理',
    orderNum: 0,
    path: '/system/dict',
    routeName: 'SystemDict',
    isCache: 1,
    visible: 1,
    status: 1,
  },
]
const users = [
  {
    createTime: '2023-08-27 10:06:45',
    updateTime: '2023-08-27 10:06:45',
    createBy: 'admin',
    updateBy: '11',
    userId: '1',
    organizationId: '1',
    orgCode: '10001',
    loginName: 'admin',
    userName: 'admin',
    userType: null,
    email: '',
    phoneNumber: '',
    sex: 1,
    avatar: '',
    status: 1,
    loginIp: '',
    loginDate: null,
    permissions: null,
    roles: null,
    orgName: '赛默飞世尔科技公司',
    remark: '超级管理员',
    picturePath: null,
    delFlag: false,
    roleIds: null,
    roleNames: null,
    oldPassword: null,
  },
]
const orgs = [
  {
    createTime: '2023-08-27 10:35:46',
    updateTime: null,
    createBy: 'admin',
    updateBy: null,
    orgId: '1',
    orgCode: '10001',
    orgName: '赛默飞世尔科技公司',
    parentId: '0',
    picturePath: '/file\\picture\\1.png',
    delFlag: false,
  },
  {
    createTime: '2023-08-27 10:35:46',
    updateTime: null,
    createBy: 'admin',
    updateBy: null,
    orgId: '2',
    orgCode: '10002',
    orgName: '公司总部',
    parentId: '1',
    picturePath: '/file\\picture\\1.png',
    delFlag: false,
  },
  {
    createTime: '2023-08-27 10:35:46',
    updateTime: null,
    createBy: 'admin',
    updateBy: null,
    orgId: '3',
    orgCode: '10003',
    orgName: '战略发展部',
    parentId: '1',
    picturePath: '/file\\picture\\1.png',
    delFlag: false,
  },
]
const dicts = [
  {
    dictId: 1,
    parentId: 0,
    category: 'gender',
    value: 'gender',
    label: '性别',
    orderNum: 1,
    remark: '性别',
    valueType: 'number',
  },
  {
    dictId: 2,
    parentId: 1,
    category: 'gender',
    value: 0,
    label: '女',
    orderNum: 1,
    remark: '',
  },
  {
    dictId: 3,
    parentId: 1,
    category: 'gender',
    value: 1,
    label: '男',
    orderNum: 2,
    remark: '',
  },
  {
    dictId: 4,
    parentId: 0,
    category: 'status',
    value: 'status',
    label: '状态',
    orderNum: 2,
    remark: '状态',
    valueType: 'number',
  },
  {
    dictId: 5,
    parentId: 4,
    category: 'status',
    value: 1,
    label: '启用',
    orderNum: 1,
    remark: '',
  },
  {
    dictId: 6,
    parentId: 4,
    category: 'status',
    value: 0,
    label: '停用',
    orderNum: 2,
    remark: '',
  },
  {
    dictId: 7,
    parentId: 0,
    category: 'bool',
    value: 'bool',
    label: '是否',
    orderNum: 3,
    remark: '是否',
    valueType: 'number',
  },
  {
    dictId: 8,
    parentId: 7,
    category: 'bool',
    value: 1,
    label: '是',
    orderNum: 1,
    remark: '',
  },
  {
    dictId: 9,
    parentId: 7,
    category: 'bool',
    value: 0,
    label: '否',
    orderNum: 2,
    remark: '',
  },
]

const roles = [
  {
    roleId: 1,
    roleName: '超级管理员',
    roleKey: 'admin',
    orderNum: 1,
    status: 1,
  },
  {
    roleId: 2,
    roleName: '普通用户',
    roleKey: 'user',
    orderNum: 2,
    status: 1,
  },
]
export default [
  {
    url: '/api/mock/get',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: {
          name: 'mock',
        },
      }
    },
  },
  {
    url: '/api/mock/post',
    method: 'post',
    timeout: 2000,
    response: {
      code: 0,
      data: {
        name: 'mock',
      },
    },
  },
  {
    url: '/api/mock/text',
    method: 'post',
    rawResponse: async (req, res) => {
      let reqbody = ''
      await new Promise(resolve => {
        req.on('data', chunk => {
          reqbody += chunk
        })
        req.on('end', () => resolve(undefined))
      })
      res.setHeader('Content-Type', 'text/plain')
      res.statusCode = 200
      res.end(`hello, ${reqbody}`)
    },
  },
  {
    url: '/api/auth/login',
    method: 'post',
    response: () => {
      return resData({ tokenValue: 'xxx' })
    },
  },
  {
    url: '/api/menu',
    method: 'get',
    response: () => {
      return resData(menus)
    },
  },
  {
    url: '/api/menu/list',
    method: 'get',
    response: () => {
      return resData(menus)
    },
  },
  {
    url: '/api/user/list',
    method: 'get',
    response: () => {
      return resPage(users)
    },
  },
  {
    url: '/api/user/getSysOrganizationList',
    method: 'get',
    response: () => {
      return resData(orgs)
    },
  },
  {
    url: '/api/dict',
    method: 'get',
    response: () => {
      return resData(dicts)
    },
  },
  {
    url: '/api/dict',
    method: 'post',
    response: req => {
      const data = req.body
      data.dictId = dicts.length + 1
      dicts.push(data)
      return resData(data)
    },
  },
  {
    url: '/api/dict',
    method: 'put',
    response: req => {
      const data = req.body
      const dict = dicts.find(i => i.dictId === data.dictId)
      Object.assign(dict, data)
      return resData(dict)
    },
  },
  {
    url: '/api/dict/{dictId}',
    method: 'delete',
    response: req => {
      const data = req.params.dictId
      const idx = dicts.findIndex(i => i.dictId === data)
      dicts.splice(idx, 1)
      return resData()
    },
  },
  {
    url: '/api/role/list',
    method: 'get',
    response: () => {
      return resPage(roles)
    },
  },
  {
    url: '/api/organization/list',
    method: 'get',
    response: () => {
      return resData(orgs)
    },
  },
]
