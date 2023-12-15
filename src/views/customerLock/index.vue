<template>
  <div>
    <CTable
      :page-conf="{
        action: '/block/list',
      }"
      ref="tableRef"
      id="customerLock"
    >
      <el-table-column label="客户编码" prop="customerId" />
      <el-table-column label="客户锁信息" prop="blockFlag" />
      <!-- <el-table-column label="创建来源" prop="creator" width="120" />
      <el-table-column label="创建时间" prop="date" width="100" />
      <el-table-column label="分组" prop="group" width="60" /> -->
      <el-table-column label="名称一" prop="name" />
      <el-table-column label="名称二" prop="name2" />
      <!-- <el-table-column label="名称三" prop="name3" width="100" />
      <el-table-column label="名称四" prop="name4" width="140" :show-overflow-tooltip="true" />
      <el-table-column label="国家" prop="cty" width="80" />
      <el-table-column label="城市" prop="city" width="80" />
      <el-table-column label="地区" prop="district" width="80" />
      <el-table-column label="邮政编码" prop="postalCode" width="100" />
      <el-table-column label="街道" prop="street" width="150" :show-overflow-tooltip="true" />
      <el-table-column label="传真1" prop="taxNo1" width="130" />
      <el-table-column label="传真2" prop="taxNo2" width="130" />
      <el-table-column label="区域" prop="region" width="100" />
      <el-table-column label="电话" prop="tel" width="110" /> -->
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="100">
        <template #default="{ row }">
          <el-button type="info" link @click="handleEdit(row)">修改</el-button>
          <el-button type="danger" link @click="handleDel(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd">
          <i-ep-plus />
          新增
        </el-button>
        <el-button type="warning" plain @click="handleTemplate">下载模板</el-button>
        <el-button type="primary" @click="upLoadFile">导入</el-button>
        <el-upload
          class="upload-demo"
          v-model:file-list="fileList"
          multiple
          accept=".xls,.xlsx"
          :action="url"
          :headers="headers"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :show-file-list="false"
          :on-error="handleError"
        >
          <button type="primary" style="display: none" ref="fileUploadRef">导入</button>
        </el-upload>
      </template>
      <template #form="{ form }">
        <el-form-item label="客户编码" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入客户编码" clearable />
        </el-form-item>
        <el-form-item label="客户锁信息" prop="blockFlag">
          <el-input v-model="form.blockFlag" placeholder="请输入客户锁信息" clearable />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>

<script setup>
import FormDialog from './components/FormDialog.vue'
import { getToken } from '@/utils/auth'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()
const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
})

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
      return req.delete(`/block/${row.customerId}`)
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

// 导入
const fileUploadRef = ref(null)
const upLoadFile = () => {
  ElMessageBox.confirm('导入操作将会把之前的历史数据全部清除，是否继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      fileUploadRef.value.click()
    })
    .catch(() => {})
}

const headers = {
  Authorization: 'Bearer ' + getToken(),
  'Call-Source': 'WEB',
  'Api-Version': 1.0,
}
const url = import.meta.env.VITE_SERVER_PATH + '/block/import'
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

// 下载模板
const handleTemplate = () => {
  const link = document.createElement('a')
  link.href = import.meta.env.VITE_SERVER_PATH + '/file/template/客户锁模板.xlsx'
  link.setAttribute('download', '客户锁模板') // 下载文件的名称及文件类型后缀
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link) // 下载完成移除元素
}
</script>

<style scoped>
.upload-demo {
  display: inline-block;
  margin: 0 10px;
}
</style>
