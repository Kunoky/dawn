<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="title"
    width="40%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form v-if="title !== '移库单详情'" :model="form" ref="formRef" label-width="155" :rules="rules">
      <el-form-item label="移库凭证号" prop="ccc">
        <el-input v-model="form.ccc" placeholder="请输入移库凭证号" />
      </el-form-item>
      <el-form-item label="SO订单编号" prop="bbb">
        <el-input v-model="form.bbb" placeholder="请输入SO订单编号" />
      </el-form-item>
      <el-form-item label="快递单号" prop="kkk">
        <el-input v-model="form.kkk" placeholder="请输入快递单号" />
      </el-form-item>
      <!-- <el-form-item label="是否有异常" prop="lll">
        <el-select v-model="form.lll" placeholder="请选择是否有异常" clearable>
          <el-option label="是" value="SM01" />
          <el-option label="否" value="SM02" />
        </el-select>
      </el-form-item> -->
    </el-form>
    <div style="margin-bottom: 20px" v-if="title == '移库单详情'">
      <el-descriptions class="margin-top" :column="2" border size="small">
        <el-descriptions-item>
          <template #label>移库凭证号</template>
          {{ form.ccc }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>SO订单编号</template>
          {{ form.bbb }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>快递单号</template>
          {{ form.kkk }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>是否有异常情况</template>
          {{ form.lll }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="title == '移库单详情'">
      <span style="font-weight: bold">移库单详情</span>
      <el-table
        size="small"
        :data="tableData"
        style="width: 100%; margin-top: 10px; margin-bottom: 20px"
        :header-cell-style="{ background: '#f5f7fa' }"
        max-height="220"
      >
        <el-table-column prop="date" label="序列号" />
        <el-table-column prop="date1" label="配件料号" />
        <el-table-column prop="date2" label="批次号" />
        <el-table-column prop="name" label="单位" />
        <el-table-column prop="sss" label="数量" />
        <el-table-column prop="sss" label="数量借/贷" />
        <el-table-column prop="address" label="Storage location" width="120" />
        <el-table-column prop="time" label="时间" />
      </el-table>
    </div>
    <div v-if="title == '移库单详情'">
      <span style="font-weight: bold">异常情况</span>
      <el-descriptions style="margin-top: 10px" class="margin-top" :column="2" border size="small">
        <el-descriptions-item>
          <template #label>异常说明</template>
          xxxxxxxxxxxxxxxxxxx
        </el-descriptions-item>
      </el-descriptions>
      <el-table
        size="small"
        :data="annexData"
        style="width: 100%; margin-top: 10px"
        max-height="220"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column prop="name" label="文件名称" />
        <el-table-column prop="dateTime" label="上传时间" />
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
        <el-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('common.confirm') }}</el-button>
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
const title = computed(() => (props.data ? '移库单详情' : '新建移库单'))

const tableData = [
  {
    date: '1',
    date1: '0000000001',
    name: 'xxx',
    aaa: '92',
    sss: '2',
    address: 'XXXXXXXXXXXX',
    time: '2023-06-13',
  },
  {
    date: '3',
    date1: '0000000002',
    name: 'xxx',
    aaa: '67',
    sss: '2',
    address: 'XXXXXXXXXXXX',
    time: '2323-09-01',
  },
  {
    date: '2',
    date1: '0000000003',
    name: 'xxx',
    aaa: '45',
    sss: '2',
    address: 'XXXXXXXXXXXX',
    time: '2023-08-08',
  },
  {
    date: '25',
    date1: '0000000004',
    name: 'xxx',
    aaa: '24',
    sss: '2',
    address: 'XXXXXXXXXXXX',
    time: '2023-03-21',
  },
]
const annexData = [
  { name: '文件1', id: 1, dateTime: '2023-08-23' },
  { name: '香香', id: 2, dateTime: '2023-08-01' },
]
const rules = {
  // aaa: [{ required: true, message: 'SO订单编号不能为空', trigger: 'blur' }],
  bbb: [{ required: true, message: '移库凭证号不能为空', trigger: 'blur' }],
  ccc: [{ required: true, message: '时间不能为空', trigger: 'blur' }],
  // ddd: [{ required: true, message: 'torage location不能为空', trigger: 'blur' }],
  // eee: [{ required: true, message: '配件料号不能为空', trigger: 'blur' }],
  // fff: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  // ggg: [{ required: true, message: '数量借/贷不能为空', trigger: 'blur' }],
  // hhh: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
  // iii: [{ required: true, message: '批次号不能为空', trigger: 'blur' }],
  // jjj: [{ required: true, message: '序列号不能为空', trigger: 'blur' }],
  kkk: [{ required: true, message: '快递单号不能为空', trigger: 'blur' }],
  lll: [{ required: true, message: '是否有异常情况不能为空', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        // aaa: '',
        bbb: '',
        ccc: '',
        // ddd: '',
        // eee: '',
        // fff: '',
        // ggg: '',
        // hhh: '',
        // iii: '',
        // jjj: '',
        kkk: '',
        lll: '',
      }
      if (props.data) {
        for (let k in form.value) {
          form.value[k] = props.data[k]
        }
      }
      // nextTick(() => {
      //   formRef.value.clearValidate()
      // })
    }
  },
  { immediate: true }
)

const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      // form.value.value = form.value.category
      // loading.value = true
      // req[form.value.dictId ? 'put' : 'post']('/dict', form.value)
      //   .then(({ code }) => {
      //     if (code === 200) {
      //       emit('success')
      //       emit('update:modelValue', false)
      //     }
      //   })
      //   .finally(() => {
      //     loading.value = false
      //   })
    }
  })
}
const handleDownloadFile = () => {}
</script>
