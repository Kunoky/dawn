<template>
  <div>
    <CTable
      :page-conf="{
        action: 'system/role/list',
      }"
      ref="tableRef"
      id="systemRole"
    >
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="显示顺序" prop="roleSort" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-tooltip content="修改" placement="top" v-if="row.roleId !== 1">
            <el-button link type="primary" @click="handleEdit(row)" v-hasPermi="['system:role:edit']">
              <i-ep-edit />
            </el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" v-if="row.roleId !== 1">
            <el-button link type="primary" @click="handleDel(row)" v-hasPermi="['system:role:remove']">
              <i-ep-delete />
            </el-button>
          </el-tooltip>
          <el-tooltip content="数据权限" placement="top" v-if="row.roleId !== 1">
            <el-button link type="primary" @click="handleDataScope(row)" v-hasPermi="['system:role:edit']">
              <i-ep-circle-check />
            </el-button>
          </el-tooltip>
          <el-tooltip content="分配用户" placement="top" v-if="row.roleId !== 1">
            <RouterLink :to="'/system/role/user?id=' + row.roleId" v-hasPermi="['system:role:edit']">
              <el-button link type="primary">
                <i-ep-user />
              </el-button>
            </RouterLink>
          </el-tooltip>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:user:add']">
          <i-ep-plus />
          新增
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="角色状态" clearable>
            <el-option v-for="i in sys_normal_disable.options" :key="i.value" :label="i.label" :value="i.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <range-picker v-model="form.params" />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" :deptTree="deptTree" @success="handleFormSuccess"></FormDialog>
    <PermissionDialog :data="current" v-model="visible.permission" :deptTree="deptTree"></PermissionDialog>
  </div>
</template>
<script setup name="SystemRole">
import FormDialog from './components/FormDialog.vue'
import PermissionDialog from './components/PermissionDialog.vue'

const { parseTime } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
})

const sys_normal_disable = useDict('sys_normal_disable')

const deptTree = ref([])
req.get('system/user/deptTree').then(res => (deptTree.value = res.data))

const handleAdd = () => {
  current.value = null
  visible.form = true
}

const handleEdit = row => {
  current.value = row
  visible.form = true
}

const handleDataScope = row => {
  current.value = row
  visible.permission = true
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
      return req.delete('system/user/' + row.userId)
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}
const handleFormSuccess = () => {
  refresh()
}

const handleStatusChange = row => {
  ElMessageBox.confirm(i18n.t('tip.confirm'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  }).then(() => {
    current.value = {
      ...row,
      deleting: true,
    }
    return req.put('system/user/changeStatus', { userId: row.userId, status: row.status })
  })
}
</script>
