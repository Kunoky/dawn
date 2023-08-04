<template>
  <div>
    <CTable
      :page-conf="{
        action: 'monitor/operlog/list',
      }"
      v-model="selected"
      row-key="operId"
      ref="tableRef"
      id="systemOperlog"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="日志编号" prop="operId" />
      <el-table-column label="系统模块" prop="title" :show-overflow-tooltip="true" />
      <el-table-column label="操作类型" prop="businessType">
        <template #default="{ row }">
          <DictTag :dict="sys_oper_type" :value="row.businessType" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作人员"
        width="110"
        prop="operName"
        :show-overflow-tooltip="true"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column label="主机" prop="operIp" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="操作状态" prop="status">
        <template #default="{ row }">
          <DictTag :dict="sys_common_status" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作日期" prop="operTime" width="180" sortable="custom">
        <template #default="{ row }">
          <span>{{ parseTime(row.operTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消耗时间" prop="costTime" width="110" :show-overflow-tooltip="true" sortable="custom">
        <template #default="{ row }">
          <span>{{ row.costTime }}毫秒</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleView(row, index)" v-hasPermi="['monitor:operlog:query']">
            {{ $t('common.detail') }}
          </el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button
          type="danger"
          plain
          @click="handleDel"
          v-hasPermi="['monitor:operlog:remove']"
          :disabled="!selected.length"
        >
          <i-ep-delete />
          {{ $t('common.delete') }}
        </el-button>
        <el-button type="danger" plain @click="handleClear" v-hasPermi="['monitor:operlog:remove']">
          <i-ep-delete />
          {{ $t('common.clean') }}
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="系统模块" prop="title">
          <el-input v-model="form.title" placeholder="请输入系统模块" clearable />
        </el-form-item>
        <el-form-item label="操作人员" prop="operName">
          <el-input v-model="form.operName" placeholder="请输入操作人员" clearable />
        </el-form-item>
        <el-form-item label="类型" prop="businessType">
          <el-select v-model="form.businessType" placeholder="操作类型" clearable>
            <el-option v-for="i in sys_oper_type.options" :key="i.value" v-bind="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="操作状态" clearable>
            <el-option v-for="i in sys_common_status.options" :key="i.value" v-bind="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <RangePicker v-model="form.params" />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form"></FormDialog>
  </div>
</template>
<script setup name="SystemOperlog">
import FormDialog from './components/FormDialog.vue'

const { parseTime } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
})

const sys_oper_type = useDict('sys_oper_type')
const sys_common_status = useDict('sys_common_status')

const handleView = row => {
  current.value = row
  visible.form = true
}

const selected = ref([])

const handleDel = () => {
  ElMessageBox.confirm(i18n.t('tip.delete'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      return req.delete('monitor/operlog/' + selected.value)
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}

const handleClear = () => {
  ElMessageBox.confirm('确定清空所有日志？', i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      return req.delete('monitor/operlog/clean')
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}
</script>
