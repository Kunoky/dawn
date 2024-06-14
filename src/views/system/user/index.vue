<template>
  <div>
    <!-- <el-row :gutter="16">
      <el-col :span="4" class="bgc-1 pdt-m">
        <div>
          <el-input v-model="orgName" placeholder="请输入部门名称" clearable style="margin-bottom: 20px" />
        </div>
        <div>
          <el-tree
            :data="orgTree"
            :props="{ label: 'label', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="orgTreeRef"
            node-key="id"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20"> -->
    <CTable
      :page-conf="{
        action: 'user/list',
      }"
      :params="params"
      ref="tableRef"
      id="systemUser"
    >
      <el-table-column label="用户编号" prop="userId" />
      <el-table-column label="用户名称" prop="userName" />
      <el-table-column label="登录名称" prop="loginName" />
      <el-table-column label="角色" prop="roleName" />
      <el-table-column label="手机号码" prop="phoneNumber" width="120" />
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <el-switch
            :disabled="!!row.isSuperAdmin || !userStore.hasPermission(['system:user:edit'])"
            :model-value="row.status"
            :active-value="true"
            :inactive-value="false"
            @change="handleStatusChange(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="140">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <template v-if="!row.isSuperAdmin">
            <el-tooltip :content="$t('common.edit')" placement="top">
              <el-button link type="info" @click="handleEdit(row)" v-hasPermi="['system:user:edit']">
                <i-ep-edit />
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('common.delete')" placement="top">
              <el-button link type="info" @click="handleDel(row)" v-hasPermi="['system:user:del']">
                <i-ep-delete />
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('view.user.resetPwd')" placement="top">
              <el-button link type="info" @click="handleResetPwd(row)" v-hasPermi="['system:user:resetPwd']">
                <i-ep-key />
              </el-button>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:user:add']">
          <i-ep-plus />
          新增
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名称" clearable />
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="用户状态" clearable>
            <el-option v-for="i in status.options" :key="i.value" :label="i.label" :value="i.value" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <!-- </el-col>
    </el-row> -->
    <FormDialog :data="current" v-model="visible.form" :orgTree="orgTree" @success="handleFormSuccess"></FormDialog>
  </div>
</template>
<script setup name="SystemUser">
import FormDialog from './components/FormDialog.vue'

const { parseTime, arr2tree } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
  config: false,
})

const userStore = useUserStore()
const status = useDict('status')
// const regionalStatus = useDict('regionalStatus')

const orgTree = ref([])
req.get('/organization/list').then(res => {
  res.data.forEach(i => {
    i.id = i.orgId
    i.label = i.orgName
  })
  const [tree] = arr2tree(res.data, 'orgId', 'parentId')
  orgTree.value = tree
})

const handleAdd = () => {
  current.value = null
  visible.form = true
}

const handleEdit = row => {
  current.value = row
  visible.form = true
}
const handleDel = row => {
  ElMessageBox.confirm(i18n.t('tip.delete'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      current.value = {
        ...row,
        deleting: true,
      }
      return req.delete('user/deleteOne/' + row.userId)
    })
    .then(({ code }) => {
      if (code === 200) {
        refresh()
      }
    })
}
const handleFormSuccess = () => {
  refresh()
}

const orgName = ref('')
const orgTreeRef = ref()
// const filterNode = (v, data) => {
//   if (!v) return true
//   return data.label.match(v)
// }
watch(orgName, val => {
  orgTreeRef.value.filter(val)
})
const params = reactive({
  orgId: undefined,
})
// function handleNodeClick(data) {
//   if (params.orgId === data.id) {
//     params.orgId = null
//     orgTreeRef.value.setCurrentKey(null)
//   } else {
//     params.orgId = data.id
//   }
// }

const handleStatusChange = row => {
  return ElMessageBox.confirm(i18n.t('tip.confirm'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  }).then(() => {
    current.value = {
      ...row,
      deleting: true,
    }
    return req.put('user/status', { userId: row.userId, status: !row.status }).finally(refresh)
  })
}
const handleResetPwd = row => {
  ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
  }).then(({ value }) => {
    return req.put('user/resetPassword', { userId: row.userId, password: value })
  })
}
</script>
