<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="title"
    width="50%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form v-if="title !== '移库单详情'" :model="form" ref="formRef" label-width="155" :rules="rules">
      <el-form-item label="SO订单编号" prop="soNo">
        <el-input v-model="form.soNo" placeholder="请输入SO订单编号" />
      </el-form-item>
      <el-form-item label="移库凭证号" prop="transferVoucherNo">
        <el-input v-model="form.transferVoucherNo" placeholder="请输入移库凭证号" />
      </el-form-item>
      <el-form-item label="快递单号" prop="expressNo">
        <el-input v-model="form.expressNo" placeholder="请输入快递单号" />
      </el-form-item>
    </el-form>
    <div v-if="title === '移库单详情'" v-loading="dataLoading">
      <div style="margin-bottom: 20px">
        <el-descriptions class="margin-top" :column="2" border size="small">
          <el-descriptions-item>
            <template #label>移库凭证号</template>
            {{ form.transferVoucherNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>SO订单编号</template>
            {{ form.soNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>快递单号</template>
            {{ form.expressNo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>是否有异常情况</template>
            {{ form.exceptionFlag ? '是' : '否' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <span style="font-weight: bold">移库单详情</span>
      <el-table
        size="small"
        :data="tableData"
        style="width: 100%; margin-top: 10px; margin-bottom: 20px"
        :header-cell-style="{ background: '#f5f7fa' }"
        max-height="220"
      >
        <el-table-column prop="sernr" label="序列号" />
        <el-table-column prop="matnr" label="配件料号" width="150" />
        <el-table-column prop="charg" label="批次号" />
        <el-table-column prop="meins" label="单位" />
        <el-table-column prop="menge" label="数量" />
        <el-table-column prop="shkzg" label="借/贷" />
        <el-table-column prop="lgort" label="Storage location" width="120" />
      </el-table>
      <div v-if="form.exceptionFlag" style="margin-bottom: 10px">
        <span style="font-weight: bold">异常情况</span>
        <el-descriptions style="margin-top: 10px" class="margin-top" :column="2" border size="small">
          <el-descriptions-item :span="2">
            <template #label>异常说明</template>
            {{ form.exception }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <span style="font-weight: bold">附件信息</span>
      <el-table
        size="small"
        :data="annexData"
        style="width: 100%; margin-top: 10px"
        max-height="220"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column prop="fileName" label="文件名称" />
        <el-table-column prop="createTime" label="上传时间" />
        <el-table-column label="操作" class-name="small-padding fixed-width" width="100">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDownloadFile(row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm" v-if="title !== '移库单详情'">
          {{ $t('common.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})
const title = computed(() => (props.data ? '移库单详情' : '新增移库单'))

const tableData = ref([])
const annexData = ref([])
const rules = {
  soNo: [{ required: true, message: 'SO订单编号不能为空', trigger: 'blur' }],
  transferVoucherNo: [{ required: true, message: '移库凭证号不能为空', trigger: 'blur' }],
  expressNo: [{ required: true, message: '快递单号不能为空', trigger: 'blur' }],
}

const formRef = ref()
const form = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      props.data && getDetails()
    }
  },
  { immediate: true }
)
const { run: getDetails, loading: dataLoading } = useAsync(async () => {
  return req.get(`/st/details`, { params: { id: props.data.id } }).then(res => {
    form.value = res.data
    annexData.value = res.data.attachments
    tableData.value = res.data.moveStocks
    return res
  })
})

const handleClose = () => {
  emit('update:modelValue', false)
  if (title.value === '移库单详情') {
    form.value = {}
  } else {
    formRef.value.resetFields()
  }
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      let data = {
        soNo: form.value.soNo,
        transferVoucherNo: form.value.transferVoucherNo,
        expressNo: form.value.expressNo,
      }
      req.post('/st', data).then(() => {
        emit('update:modelValue', false)
      })
    }
  })
}

const attachmentType = useDict('attachmentType')
const handleDownloadFile = row => {
  let fileName = attachmentType.value.kv[row.type]
  if (row.path) {
    const link = document.createElement('a')
    link.href = import.meta.env.VITE_SERVER_PATH + row.path
    link.setAttribute('download', fileName) // 下载文件的名称及文件类型后缀
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // 下载完成移除元素
  }
}
</script>
