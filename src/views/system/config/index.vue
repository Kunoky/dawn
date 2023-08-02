<template>
  <div>
    <CTable
      :page-conf="{
        action: 'system/config/list',
      }"
      ref="tableRef"
      id="systemConfig"
    >
      <el-table-column label="参数主键" prop="configId" />
      <el-table-column label="参数名称" prop="configName" :show-overflow-tooltip="true" />
      <el-table-column label="参数键名" prop="configKey" :show-overflow-tooltip="true" />
      <el-table-column label="参数键值" prop="configValue" :show-overflow-tooltip="true" />
      <el-table-column label="系统内置" prop="configType">
        <template #default="{ row }">
          <el-tag>{{ sys_yes_no.kv[row.configType] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" prop="createTime" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)" v-hasPermi="['system:config:edit']">
            {{ $t('common.edit') }}
          </el-button>
          <el-button link type="danger" @click="handleDel(row)" v-hasPermi="['system:config:remove']">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:config:add']">
          <i-ep-plus />
          {{ $t('common.add') }}
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="参数名称" prop="configName">
          <el-input v-model="form.configName" placeholder="请输入参数名称" clearable />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="form.configKey" placeholder="请输入参数键名" clearable />
        </el-form-item>
        <el-form-item label="系统内置" prop="configType">
          <el-select v-model="form.configType" placeholder="系统内置" clearable>
            <el-option v-for="i in sys_yes_no.options" :key="i.value" v-bind="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <RangePicker v-model="form.params" />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>
<script setup name="SystemConfig">
import FormDialog from './components/FormDialog.vue'

const { parseTime } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
})

const sys_yes_no = useDict('sys_yes_no')

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
      return req.delete('system/config/' + row.configId)
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
</script>
