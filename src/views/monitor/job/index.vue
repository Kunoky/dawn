<template>
  <div>
    <CTable
      :page-conf="{
        action: 'monitor/job/list',
      }"
      ref="tableRef"
      id="monitorJob"
    >
      <el-table-column label="任务编号" width="100" prop="jobId" />
      <el-table-column label="任务名称" prop="jobName" :show-overflow-tooltip="true" />
      <el-table-column label="任务组名" prop="jobGroup">
        <template #default="{ row }">
          <DictTag :dict="sys_job_group" :value="row.jobGroup" />
        </template>
      </el-table-column>
      <el-table-column label="调用目标字符串" prop="invokeTarget" :show-overflow-tooltip="true" />
      <el-table-column label="cron执行表达式" prop="cronExpression" :show-overflow-tooltip="true" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)" v-hasPermi="['monitor:job:edit']">
            {{ $t('common.edit') }}
          </el-button>
          <el-button link type="danger" @click="handleDel(row)" v-hasPermi="['monitor:job:remove']">
            {{ $t('common.delete') }}
          </el-button>
          <el-button link type="primary" @click="handleExcute(row)" v-hasPermi="['monitor:job:changeStatus']">
            {{ $t('common.execute') }}
          </el-button>
          <el-button link type="primary" @click="handleDetail(row)" v-hasPermi="['monitor:job:query']">
            {{ $t('common.detail') }}
          </el-button>
          <RouterLink :to="'/monitor/job/log?name=' + row.jobName" v-hasPermi="['monitor:job:query']">
            <el-button link type="primary">
              {{ $t('common.log') }}
            </el-button>
          </RouterLink>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['monitor:job:add']">
          <i-ep-plus />
          {{ $t('common.add') }}
        </el-button>
        <router-link to="/monitor/job/log">
          <el-button type="info" plain @click="handleAdd" v-hasPermi="['monitor:job:query']">
            <i-ep-operation />
            日志
          </el-button>
        </router-link>
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
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择任务状态" clearable>
            <el-option v-for="i in sys_job_status.options" :key="i.value" v-bind="i" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
    <DetailDialog :data="current" v-model="visible.detail"></DetailDialog>
  </div>
</template>
<script setup name="MonitorJobLog">
import FormDialog from './components/FormDialog.vue'
import DetailDialog from './components/DetailDialog.vue'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
  detail: false,
})

const sys_job_group = useDict('sys_job_group')
const sys_job_status = useDict('sys_job_status')

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
      return req.delete('monitor/job/' + row.jobId)
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
  const s = ['停用', '启用'][row.status]
  ElMessageBox.confirm(`确定${s}任务 ${row.jobName} 吗`, i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      return req.put('monitor/job/changeStatus', { jobId: row.jobId, status: row.status })
    })
    .finally(refresh)
}

const handleExcute = row => {
  ElMessageBox.confirm(`确定执行一次任务 ${row.jobName} 吗`, i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      return req.put('monitor/job/run', { jobId: row.jobId, jobGroup: row.jobGroup })
    })
    .finally(refresh)
}

const handleDetail = row => {
  current.value = row
  visible.detail = true
}
</script>
