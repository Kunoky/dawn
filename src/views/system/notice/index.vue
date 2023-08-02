<template>
  <div>
    <CTable
      :page-conf="{
        action: 'system/notice/list',
      }"
      ref="tableRef"
      id="systemNotice"
    >
      <el-table-column label="序号" prop="noticeId" width="100" />
      <el-table-column label="公告标题" prop="noticeTitle" :show-overflow-tooltip="true" />
      <el-table-column label="公告类型" prop="noticeType" width="100">
        <template #default="{ row }">
          <DictTag :dict="sys_notice_type" :value="row.noticeType" />
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="100">
        <template #default="{ row }">
          <DictTag :dict="sys_notice_status" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建者" prop="createBy" width="100" />
      <el-table-column label="创建时间" prop="createTime" width="100">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)" v-hasPermi="['system:notice:edit']">
            {{ $t('common.edit') }}
          </el-button>
          <el-button link type="danger" @click="handleDel(row)" v-hasPermi="['system:notice:remove']">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:notice:add']">
          <i-ep-plus />
          {{ $t('common.add') }}
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="公告标题" prop="noticeTitle">
          <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" clearable />
        </el-form-item>
        <el-form-item label="操作人员" prop="createBy">
          <el-input v-model="form.createBy" placeholder="请输入操作人员" clearable />
        </el-form-item>
        <el-form-item label="类型" prop="noticeType">
          <el-select v-model="form.noticeType" placeholder="公告类型" clearable>
            <el-option v-for="i in sys_notice_type.options" :key="i.value" v-bind="i" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>
<script setup name="SystemNotice">
import FormDialog from './components/FormDialog.vue'

const { parseTime } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
})

const sys_notice_type = useDict('sys_notice_type')
const sys_notice_status = useDict('sys_notice_status')

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
      return req.delete('system/notice/' + row.noticeId)
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
