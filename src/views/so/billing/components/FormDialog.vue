<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="添加Billing号"
    width="30%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="80" :rules="rules">
      <el-form-item label="Billing号" prop="TaskID">
        <el-input v-model="form.TaskID" placeholder="请输入Billing号" clearable />
      </el-form-item>
    </el-form>
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

// const title = computed(() => (props.data ? '完善信息' : '新建维修申请'))

const rules = {
  TaskID: [{ required: true, message: 'Billing号不能为空', trigger: 'blur' }],
  // aaa: [{ required: true, message: '仪器序列号不能为空', trigger: 'blur' }],
  // bbb: [{ required: true, message: '仪器物料号不能为空', trigger: 'blur' }],
  // ccc: [{ required: true, message: '仪器SAP Equip编号不能为空', trigger: 'blur' }],
  // ddd: [{ required: true, message: '维修类型不能为空', trigger: 'change' }],
  // eee: [{ required: true, message: '仪器地址不能为空', trigger: 'blur' }],
  // fff: [{ required: true, message: '客户单位名称不能为空', trigger: 'blur' }],
  // // ggg: [{ required: true, message: '客户编号不能为空', trigger: 'blur' }],
  // hhh: [{ required: true, message: '客户联系人不能为空', trigger: 'blur' }],
  // iii: [{ required: true, message: '客户联系人电话不能为空', trigger: 'blur' }],
  // jjj: [{ required: true, message: '客户联系人邮箱不能为空', trigger: 'blur' }],
  // // kkk: [{ required: true, message: '代理商不能为空', trigger: 'blur' }],
  // lll: [{ required: true, message: '报修内容不能为空', trigger: 'blur' }],
  // // mmm: [{ required: true, message: '报修来源不能为空', trigger: 'blur' }],
  // nnn: [{ required: true, message: '报修时间不能为空', trigger: 'blur' }],
  // // ooo: [{ required: true, message: '保修期不能为空', trigger: 'blur' }],
  // ppp: [{ required: true, message: 'FSE工程师名称不能为空', trigger: 'blur' }],
  // qqq: [{ required: true, message: 'FSE work cente不能为空', trigger: 'blur' }],
  // rrr: [{ required: true, message: 'FSE storage location不能为空', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        // TaskID: '',
        // aaa: '',
        // bbb: '',
        // ccc: '',
        // ddd: [],
        // eee: '',
        // fff: '',
        // ggg: '',
        // hhh: '',
        // iii: '',
        // jjj: '',
        // kkk: '',
        // lll: '',
        // mmm: '',
        // nnn: '',
        // ooo: '',
        // ppp: '',
        // qqq: '',
        // rrr: '',
        // label: '',
        // value: '',
        // category: '',
        // orderNum: 0,
        // valueType: 'string',
        // remark: '',
      }
      if (props.data) {
        for (let k in form.value) {
          form.value[k] = props.data[k]
        }
      }
      nextTick(() => {
        formRef.value.clearValidate()
      })
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
</script>
<style scoped>
.date-box /deep/ .el-input__wrapper {
  width: 95%;
}
</style>
