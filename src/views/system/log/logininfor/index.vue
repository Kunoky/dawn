<template>
  <div>
    <CTable
      :page-conf="{
        action: 'monitor/logininfor/list',
      }"
      ref="tableRef"
      id="systemlogininfor"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="访问编号" prop="infoId" />
      <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true" sortable="custom" />
      <el-table-column label="地址" prop="ipaddr" :show-overflow-tooltip="true" />
      <el-table-column label="登录地点" prop="loginLocation" :show-overflow-tooltip="true" />
      <el-table-column label="操作系统" prop="os" :show-overflow-tooltip="true" />
      <el-table-column label="浏览器" prop="browser" :show-overflow-tooltip="true" />
      <el-table-column label="登录状态" prop="status">
        <template #default="{ row }">
          <DictTag :dict="sys_common_status" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="msg" :show-overflow-tooltip="true" />
      <el-table-column label="访问时间" prop="loginTime" sortable="custom" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.loginTime) }}</span>
        </template>
      </el-table-column>
      <template #actions>
        <el-button
          type="danger"
          plain
          @click="handleDel"
          v-hasPermi="['monitor:logininfor:remove']"
          :disabled="!selected.length"
        >
          <i-ep-delete />
          {{ $t('common.delete') }}
        </el-button>
        <el-button type="danger" plain @click="handleClear" v-hasPermi="['monitor:logininfor:remove']">
          <i-ep-delete />
          {{ $t('common.clean') }}
        </el-button>
        <el-button
          type="primary"
          plain
          @click="handleUnlock"
          v-hasPermi="['monitor:logininfor:unlock']"
          :disabled="selected.length !== 1"
        >
          <i-ep-unlock />
          {{ $t('common.unlock') }}
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="登录地址" prop="ipaddr">
          <el-input v-model="form.ipaddr" placeholder="请输入登录地址" clearable />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名称" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="登录状态" clearable>
            <el-option v-for="i in sys_common_status.options" :key="i.value" v-bind="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="登录时间">
          <RangePicker v-model="form.params" />
        </el-form-item>
      </template>
    </CTable>
  </div>
</template>
<script setup name="SystemLogininfor">
const { parseTime } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const sys_common_status = useDict('sys_common_status')

const selected = ref([])
function handleSelectionChange(selection) {
  selected.value = selection
}
const handleDel = () => {
  ElMessageBox.confirm(i18n.t('tip.delete'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      const ids = selected.value.map(i => i.infoId).join(',')
      return req.delete('monitor/logininfor/' + ids)
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
      return req.delete('monitor/logininfor/clean')
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}
const handleUnlock = () => {
  const { username } = selected[0]
  ElMessageBox.confirm(`确定解锁用户 ${username}？`, i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      return req.delete('monitor/logininfor/unlock/' + username)
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}
</script>
