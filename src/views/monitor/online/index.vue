<template>
  <div>
    <CTable
      :page-conf="{
        action: 'monitor/online/list',
      }"
      ref="tableRef"
      id="monitorOnline"
    >
      <el-table-column label="会话编号" prop="tokenId" :show-overflow-tooltip="true" />
      <el-table-column label="登录名称" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="所属部门" prop="deptName" :show-overflow-tooltip="true" />
      <el-table-column label="主机" prop="ipaddr" :show-overflow-tooltip="true" />
      <el-table-column label="登录地点" prop="loginLocation" :show-overflow-tooltip="true" />
      <el-table-column label="操作系统" prop="os" :show-overflow-tooltip="true" />
      <el-table-column label="浏览器" prop="browser" :show-overflow-tooltip="true" />
      <el-table-column label="登录时间" prop="loginTime" width="180">
        <template #default="{ row }">
          <span>{{ parseTime(row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleForceLogout(row)" v-hasPermi="['monitor:online:forceLogout']">
            强退
          </el-button>
        </template>
      </el-table-column>
      <template #form="{ form }">
        <el-form-item label="登录地址" prop="ipaddr">
          <el-input v-model="form.ipaddr" placeholder="请输入登录地址" clearable />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名称" clearable />
        </el-form-item>
      </template>
    </CTable>
  </div>
</template>
<script setup name="MonitorOnline">
const { parseTime } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const handleForceLogout = row => {
  const { userName, tokenId } = row
  ElMessageBox.confirm(`确定强退用户 ${userName} ?`, i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      return req.delete('monitor/online/' + tokenId)
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}
</script>
