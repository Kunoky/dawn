<template>
  <div>
    <CTable
      :page-conf="{
        action: 'monitor/jobLog/list',
      }"
      v-model="selected"
      :params="params"
      row-key="jobLogId"
      ref="tableRef"
      id="monitorJobLog"
    >
      <el-table-column label="日志编号" width="80" prop="jobLogId" />
      <el-table-column label="任务名称" prop="jobName" :show-overflow-tooltip="true" />
      <el-table-column label="任务组名" prop="jobGroup" :show-overflow-tooltip="true">
        <template #default="{ row }">
          <DictTag :ditc="sys_job_group" :value="row.jobGroup" />
        </template>
      </el-table-column>
      <el-table-column label="调用目标字符串" prop="invokeTarget" :show-overflow-tooltip="true" />
      <el-table-column label="日志信息" prop="jobMessage" :show-overflow-tooltip="true" />
      <el-table-column label="执行状态" prop="status">
        <template #default="{ row }">
          <DictTag :dict="sys_common_status" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="执行时间" prop="createTime" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleDetail(row)" v-hasPermi="['monitor:job:query']">
            {{ $t('common.detail') }}
          </el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button
          type="danger"
          plain
          @click="handleDel"
          v-hasPermi="['monitor:job:remove']"
          :disabled="!selected.length"
        >
          <i-ep-delete />
          {{ $t('common.delete') }}
        </el-button>
        <el-button type="danger" plain @click="handleClear" v-hasPermi="['monitor:job:remove']">
          <i-ep-delete />
          {{ $t('common.clean') }}
        </el-button>
        <RouterLink to="/monitor/job">
          <el-button plain>
            <i-ep-close />
            {{ $t('common.close') }}
          </el-button>
        </RouterLink>
      </template>
      <template #form="{ form }">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="form.jobName" placeholder="请输入任务名称" clearable />
        </el-form-item>
        <el-form-item label="任务组名" prop="jobGroup">
          <el-select v-model="form.jobGroup" placeholder="请选择任务组名" clearable>
            <el-option v-for="i in sys_job_group.options" :key="i.value" v-bind="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择执行状态" clearable>
            <el-option v-for="i in sys_common_status.options" :key="i.value" v-bind="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间" style="width: 308px">
          <RangePicker v-model="form.params" />
        </el-form-item>
      </template>
    </CTable>
    <LogDetailDialog :data="current" v-model="visible.detail"></LogDetailDialog>
  </div>
</template>
<script setup name="MonitorJob">
import { RouterLink } from 'vue-router'
import LogDetailDialog from './components/LogDetailDialog.vue'

const { parseTime } = utils
const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  detail: false,
})

const route = useRoute()
const params = {
  jobName: route.query.name,
}
onMounted(() => {
  tableRef.value.form.jobName = params.jobName
})

const sys_job_group = useDict('sys_job_group')
const sys_common_status = useDict('sys_common_status')

const selected = ref([])

const handleDel = () => {
  ElMessageBox.confirm(i18n.t('tip.delete'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      return req.delete('monitor/jobLog/' + selected.value.join(','))
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
      return req.delete('monitor/jobLog/clean')
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}

const handleDetail = row => {
  current.value = row
  visible.detail = true
}
</script>
