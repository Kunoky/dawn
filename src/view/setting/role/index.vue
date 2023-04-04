<template>
  <div>
    <CTable
      :page-conf="{
        action: listRole,
      }"
      :params="{
        pId: 0,
      }"
      ref="tableRef"
      id="viewRoleTable"
    >
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="remark" label="Remark" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createdTime" label="Created Time" width="128">
        <template v-slot="{ row }">
          {{ row.createdTime?.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedTime" label="Updated Time" width="128">
        <template v-slot="{ row }">
          {{ row.updatedTime?.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="Operation" width="240">
        <template v-slot="{ row }">
          <el-button @click="hadnleConfig(row)" :disabled="current?.id === row.id && current?.deleting">
            {{ $t('common.config') }}
          </el-button>
          <el-button
            v-permission:settingRole="2"
            @click="hadnleEdit(row)"
            :disabled="current?.id === row.id && current?.deleting"
          >
            {{ $t('common.edit') }}
          </el-button>
          <el-button
            v-permission:settingRole="3"
            type="danger"
            @click="hadnleDel(row)"
            :loading="current?.id === row.id && current?.deleting"
          >
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button v-permission:settingRole="1" type="primary" @click="hadnleAdd">{{ $t('common.add') }}</el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="Name">
          <el-input v-model="form.name" placeholder="Name" />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
    <PermissionDialog :id="current?.id" v-model="visible.permission"></PermissionDialog>
  </div>
</template>
<script setup>
import { listRole, delRole } from '@/services/role'
import FormDialog from './components/FormDialog.vue'
import PermissionDialog from './components/PermissionDialog.vue'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
})

const hadnleAdd = () => {
  current.value = null
  visible.form = true
}
const hadnleEdit = row => {
  current.value = row
  visible.form = true
}
const hadnleDel = row => {
  ElMessageBox.confirm(i18n.t('tip.delete'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      delRole(row.id)
      current.value = {
        ...row,
        deleting: true,
      }
    })
    .then(() => {
      ElMessage.success(i18n.t('tip.success'))
      refresh()
    })
}
const handleFormSuccess = () => {
  refresh()
}
const hadnleConfig = row => {
  current.value = row
  visible.permission = true
}
</script>
