<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="4" class="bgc-1 pdt-m">
        <div>
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable style="margin-bottom: 20px" />
        </div>
        <div>
          <el-tree
            :data="deptTree"
            :props="{ label: 'label', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="deptTreeRef"
            node-key="id"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20">
        <CTable
          :page-conf="{
            action: 'system/user/list',
          }"
          :params="params"
          ref="tableRef"
          id="systemUser"
        >
          <el-table-column label="用户编号" key="userId" prop="userId" />
          <el-table-column label="用户名称" key="userName" prop="userName" :show-overflow-tooltip="true" />
          <el-table-column label="用户昵称" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
          <el-table-column label="部门" key="deptName" prop="dept.deptName" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" key="phonenumber" prop="phonenumber" width="120" />
          <el-table-column label="状态" key="status">
            <template #default="{ row }">
              <el-switch
                :modelValue="row.status"
                active-value="0"
                inactive-value="1"
                @click="handleStatusChange(row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="160">
            <template #default="{ row }">
              <span>{{ parseTime(row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" class-name="small-padding fixed-width">
            <template #default="{ row }">
              <el-tooltip :content="$t('common.edit')" placement="top" v-if="row.userId !== 1">
                <el-button link type="primary" @click="handleEdit(row)" v-hasPermi="['system:user:edit']">
                  <i-ep-edit />
                </el-button>
              </el-tooltip>
              <el-tooltip :content="$t('common.delete')" placement="top" v-if="row.userId !== 1">
                <el-button link type="primary" @click="handleDel(row)" v-hasPermi="['system:user:remove']">
                  <i-ep-delete />
                </el-button>
              </el-tooltip>
              <el-tooltip :content="$t('view.user.resetPwd')" placement="top" v-if="row.userId !== 1">
                <el-button link type="primary" @click="handleResetPwd(row)" v-hasPermi="['system:user:resetPwd']">
                  <i-ep-key />
                </el-button>
              </el-tooltip>
              <el-tooltip :content="$t('view.user.assignRole')" placement="top" v-if="row.userId !== 1">
                <RouterLink v-hasPermi="['system:user:edit']" :to="'/system/user/role?id=' + row.userId">
                  <el-button link type="primary">
                    <i-ep-circle-check />
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
            <el-button type="info" plain @click="handleImport" v-hasPermi="['system:user:import']">
              <i-ep-upload />
              导入
            </el-button>
            <el-button type="warning" plain @click="handleExport" v-hasPermi="['system:user:export']">
              <i-ep-download />
              导出
            </el-button>
          </template>
          <template #form="{ form }">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" clearable />
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" clearable />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="用户状态" clearable>
                <el-option v-for="i in sys_normal_disable.options" :key="i.value" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <range-picker v-model="form.params" />
            </el-form-item>
          </template>
        </CTable>
      </el-col>
    </el-row>
    <FormDialog :data="current" v-model="visible.form" :deptTree="deptTree" @success="handleFormSuccess"></FormDialog>
  </div>
</template>
<script setup name="SystemUser">
import FormDialog from './components/FormDialog.vue'

const { parseTime } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
  config: false,
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

const deptName = ref('')
const deptTreeRef = ref()
const filterNode = (v, data) => {
  if (!v) return true
  return data.label.match(v)
}
watch(deptName, val => {
  deptTreeRef.value.filter(val)
})
const params = reactive({
  deptId: undefined,
})
function handleNodeClick(data) {
  params.deptId = data.id
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
const handleResetPwd = row => {
  ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
  }).then(({ value }) => {
    return req.put('system/user/resetPwd', { userId: row.userId, password: value })
  })
}

const handleImport = () => {}

const handleExport = () => {}
</script>
