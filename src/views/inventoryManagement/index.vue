<template>
  <div>
    <CTable :page-conf="{ action: '/st/list' }" ref="tableRef" id="inventoryManagement">
      <el-table-column label="SO订单编号" prop="soNo" />
      <el-table-column label="移库凭证号" prop="transferVoucherNo" :show-overflow-tooltip="true" />
      <el-table-column label="快递单号" prop="expressNo" />
      <el-table-column label="是否有异常" prop="exceptionFlag">
        <template #default="{ row }">
          <span>{{ row.exceptionFlag ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createByName" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="120">
        <template #default="{ row }">
          <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
          <el-button type="primary" link @click="handleDel(row)">删除</el-button>
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
        <el-form-item label="SO订单编号" prop="soNo">
          <el-input v-model="form.soNo" placeholder="请输入SO订单编号" clearable />
        </el-form-item>
        <el-form-item label="移库凭证号" prop="transferVoucherNo">
          <el-input v-model="form.transferVoucherNo" placeholder="请输入移库凭证号" clearable />
        </el-form-item>
        <el-form-item label="快递单号" prop="expressNo">
          <el-input v-model="form.expressNo" placeholder="请输入快递单号" clearable />
        </el-form-item>
        <el-form-item label="时间" prop="timeScope">
          <el-date-picker
            value-format="YYYY-MM-DD"
            v-model="form.timeScope"
            placeholder="请选择时间"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="是否有异常" prop="exceptionFlag">
          <el-select v-model="form.exceptionFlag" placeholder="请选择是否有异常" clearable>
            <el-option v-for="i in bool.options" :key="i.value" v-bind="i" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
  </div>
</template>

<script setup>
import { getToken } from '@/utils/auth'
import FormDialog from './components/FormDialog.vue'
const bool = useDict('bool')
const i18n = useI18n()
const tableRef = ref()
const refresh = () => tableRef.value.refresh()

const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
})

const handleAdd = () => {
  current.value = null
  visible.form = true
}
const handleDeatil = row => {
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
      return req.delete(`/st/${row.id}`)
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
const headers = {
  Authorization: 'Bearer ' + getToken(),
  'Call-Source': 'WEB',
  'Api-Version': 1.0,
}
const url = import.meta.env.VITE_SERVER_PATH + '/st/import'
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
