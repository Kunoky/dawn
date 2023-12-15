<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="title"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="100" :rules="rules">
      <el-form-item label="SO订单编号" prop="soNo">
        <el-input :disabled="title === '修改移库单'" v-model="form.soNo" placeholder="请输入SO订单编号" />
      </el-form-item>
      <el-form-item label="移库凭证号" prop="transferVoucherNo">
        <el-input :disabled="title === '修改移库单'" v-model="form.transferVoucherNo" placeholder="请输入移库凭证号" />
      </el-form-item>
      <el-form-item label="快递单号" prop="expressNo">
        <el-input v-model="form.expressNo" placeholder="请输入快递单号" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">
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
const title = computed(() => (props.data ? '修改移库单' : '新增移库单'))
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
      form.value = {
        soNo: '',
        transferVoucherNo: '',
        expressNo: '',
        remark: '',
        id: undefined,
      }
      if (props.data) {
        for (let k in form.value) {
          form.value[k] = props.data[k]
        }
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  emit('update:modelValue', false)
  nextTick(() => {
    formRef.value.resetFields()
  })
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      req[form.value.id ? 'put' : 'post']('/st', form.value).then(() => {
        emit('success')
        emit('update:modelValue', false)
      })
    }
  })
}
</script>
