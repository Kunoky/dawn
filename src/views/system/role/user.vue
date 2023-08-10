<template>
  <div>
    <CTable
      :page-conf="{
        action: 'system/role/authUser/allocatedList',
      }"
      v-model="selected"
      row-key="userId"
      :params="params"
      ref="tableRef"
      id="systemRoleUser"
    >
      <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true" />
      <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
      <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <DictTag :dict="sys_normal_disable" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleCancelAuth(row)" v-hasPermi="['system:role:remove']">
            取消授权
          </el-button>
        </template>
      </el-table-column>

      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:role:add']">
          <i-ep-plus />
          添加用户
        </el-button>
        <el-button
          type="danger"
          plain
          @click="handleCancelAuthBatch"
          v-hasPermi="['system:role:remove']"
          :disabled="!selected.length"
        >
          <i-ep-delete />
          批量取消授权
        </el-button>
        <RouterLink to="/system/role">
          <el-button type="warning" plain>
            <i-ep-close />
            {{ $t('common.close') }}
          </el-button>
        </RouterLink>
      </template>
      <template #form="{ form }">
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名称" clearable />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入手机号码" clearable />
        </el-form-item>
      </template>
    </CTable>
    <UserDialog :data="current" v-model="visible.form"></UserDialog>
  </div>
</template>
<script setup name="SystemRoleUser">
import UserDialog from './components/UserDialog.vue'

definePage({
  meta: {
    title: '分配用户',
    permission: ['system:role:edit'],
  },
})

const { parseTime } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
})

const sys_normal_disable = useDict('sys_common_status')

const route = useRoute()
const params = {
  roleId: route.query.id,
}

const selected = ref([])

const handleAdd = () => {
  visible.form = true
}

const handleCancelAuth = row => {
  const { username, userId } = row
  ElMessageBox.confirm(`确定要取消 ${username} 角色吗？`, i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      return req.put('system/role/authUser/cancel', {
        userId,
        roleId: route.query.id,
      })
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}

const handleCancelAuthBatch = () => {
  ElMessageBox.confirm(`是否取消选中数据的角色？`, i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      return req.put('system/role/authUser/cancelAll', null, {
        params: { userIds: selected.value.join(','), roleId: route.query.id },
      })
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}
</script>
