<template>
  <div>
    <CTable
      :page-conf="{
        action: '/bom/list',
      }"
      ref="tableRef"
      id="customerLock"
    >
      <el-table-column label="物料号" prop="material" />
      <el-table-column label="描述" prop="description" />
      <el-table-column label="创建人" prop="createByName" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="130">
        <template #default="{ row }">
          <el-button type="info" link @click="handleEdit(row)">明细管理</el-button>
          <el-button type="danger" link @click="handleDel(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd">
          <i-ep-plus />
          新增
        </el-button>
        <el-upload
          ref="upload"
          v-model:file-list="fileList"
          class="upload-demo"
          :action="url"
          :show-file-list="false"
          :headers="headers"
          multiple
          accept=".xls,.xlsx"
          :on-error="handleError"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
        >
          <el-button type="primary">导入</el-button>
        </el-upload>
      </template>
      <template #form="{ form }">
        <el-form-item label="物料号" prop="material">
          <el-input v-model="form.material" placeholder="请输入物料号" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述" clearable />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog v-model="visible.form" @success="handleFormSuccess"></FormDialog>
    <AddChild :data="current" v-model="visible.addChildForm"></AddChild>
  </div>
</template>

<script setup>
import FormDialog from './components/FormDialog.vue'
import AddChild from './components/AddChild.vue'
import { getToken } from '@/utils/auth'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const current = ref(null)
const visible = reactive({
  form: false,
  addChildForm: false,
  permission: false,
})

const handleAdd = () => {
  visible.form = true
}

const handleEdit = row => {
  current.value = row
  visible.addChildForm = true
}

const handleDel = row => {
  ElMessageBox.confirm('数据删除后无法恢复，确定继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      return req.delete(`/bom/${row.material}`)
    })
    .then(({ code }) => {
      if (code === 200) {
        refresh()
      }
    })
}
const handleFormSuccess = () => {
  refresh()
}

const headers = {
  Authorization: 'Bearer ' + getToken(),
  'Call-Source': 'WEB',
  'Api-Version': 1.0,
}
const url = import.meta.env.VITE_SERVER_PATH + '/bom/import'
const fileList = ref([])
function handleError(e) {
  let msg = e.message
  try {
    msg = JSON.parse(e.message).msg
  } catch (e) {
    console.error(e)
  }
  ElMessage.error(msg)
}

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 10
  const isStyle =
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    // .excel
    file.type === 'application/vnd.ms-excel'
  // .xls
  if (!isStyle) {
    ElMessage.error('文件只能是 EXCEL/XLS格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 10MB！')
    return false
  }
  return isLt2M && isStyle
}

function handleSuccess(res) {
  if (res.code === 200) {
    ElMessage.success({
      dangerouslyUseHTMLString: true,
      message: `上传成功：${res.data.successCount}条<br/>上传失败：${res.data.failedCount}条`,
    })
    refresh()
  }
}
</script>
<style scoped>
.upload-demo {
  display: inline-block;
  margin: 0 10px;
}
</style>
