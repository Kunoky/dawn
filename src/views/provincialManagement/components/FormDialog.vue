<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="title"
    width="50%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="140" :rules="rules" v-loading="dataLoading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="省份编码" prop="reg">
            <el-input v-model="form.reg" placeholder="请输入省份编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="省份" prop="province">
            <el-input v-model="form.province" placeholder="请输入省份" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="省份(拼音)" prop="province_py">
            <el-input v-model="form.province_py" placeholder="请输入省份(拼音)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属区域" prop="region">
            <el-select v-model="form.region" placeholder="请选择所属区域" style="width: 100%" clearable>
              <el-option
                v-for="(item, index) in regionalStatus.options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="FSE Leader邮箱" prop="fse_leader">
            <el-input v-model="form.fse_leader" placeholder="请输入FSE Leader邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="service sales邮箱" prop="service_sales">
            <el-input v-model="form.service_sales" placeholder="请输入service sales邮箱" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
  options: Array,
})

const title = computed(() => (props.data ? '修改省份' : '新增省份管理'))
const regionalStatus = useDict('regionalStatus') // 区域

const rules = {
  reg: [{ required: true, message: '省份编码不能为空', trigger: 'blur' }],
  province: [{ required: true, message: '省份不能为空', trigger: 'blur' }],
  province_py: [{ required: true, message: '省份编码(拼音)不能为空', trigger: 'blur' }],
  region: [{ required: true, message: '所属区域不能为空', trigger: 'change' }],
  fse_leader: [
    { required: true, message: 'FSE Leader邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  service_sales: [
    { required: true, message: 'service sales邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
}
const formRef = ref()
const form = ref({})
watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        id: undefined,
        reg: '',
        province: '',
        province_py: '',
        region: '',
        fse_leader: '',
        service_sales: '',
      }
      nextTick(() => {
        formRef.value.clearValidate()
      })
      // props.data?.id && getRequestInfo()
    }
  },
  { immediate: true }
)

// const { run: getRequestInfo, loading: dataLoading } = useAsync(
//   async () => {
//     return req.get(`/request/info/${props.data.id}`)
//   },
//   {
//     onSuccess(res) {
//       form.value = res.data
//       form.value.dataOptions = [res.data.orderType, res.data.subType]
//       attachmentsList.value = res.data.attachments

//       // 暂存用做数据对比
//       staging.value.aaa = res.data.custDesc
//       staging.value.bbb = res.data.equipAddress
//       nextTick(() => {
//         formRef.value.clearValidate()
//       })
//     },
//   }
// )
// 取消
const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  // formRef.value.validate(valid => {
  //   if (valid) {
  //   }
  // })
}
</script>
