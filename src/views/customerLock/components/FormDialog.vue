<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="title"
    width="50%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="100" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户编码" prop="customerId">
            <el-input
              v-model="form.customerId"
              :disabled="title === '修改客户锁信息'"
              placeholder="请输入客户编码"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户锁信息" prop="blockFlag" class="date-box">
            <el-input v-model="form.blockFlag" placeholder="请输入客户锁信息" clearable />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="创建来源" prop="creator">
            <el-input v-model="form.creator" placeholder="请输入创建人" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间" prop="date" class="date-box">
            <el-date-picker
              v-model="form.date"
              style="width: 100%"
              type="date"
              placeholder="请选择创建时间"
              value-format="YYYY-MM-DD"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分组" prop="group" class="data-box">
            <el-input-number v-model="form.group" :min="1" style="width: 100%" />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="名称一" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称一" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称二" prop="name2">
            <el-input v-model="form.name2" placeholder="请输入名称二" clearable />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="名称三" prop="name3">
            <el-input v-model="form.name3" placeholder="请输入名称三" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称四" prop="name4">
            <el-input v-model="form.name4" placeholder="请输入名称四" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家" prop="cty">
            <el-input v-model="form.cty" placeholder="请输入城市" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="city">
            <el-input v-model="form.city" placeholder="请输入城市" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地区" prop="district">
            <el-input v-model="form.district" placeholder="请输入区" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮政编码" prop="postalCode">
            <el-input v-model="form.postalCode" placeholder="请输入邮政编码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="街道" prop="street">
            <el-input type="textarea" v-model="form.street" placeholder="请输入街道" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="传真一" prop="taxNo1">
            <el-input v-model="form.taxNo1" placeholder="请输入传真一" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="传真二" prop="taxNo2">
            <el-input v-model="form.taxNo2" placeholder="请输入传真二" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域" prop="region">
            <el-input v-model="form.region" placeholder="请输入区域" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="tel">
            <el-input v-model="form.tel" placeholder="请输入电话" clearable />
          </el-form-item>
        </el-col> -->
      </el-row>
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

const title = computed(() => (props.data ? '修改客户锁信息' : '新增客户锁信息'))

const rules = {
  customerId: [{ required: true, message: '客户编号不能为空', trigger: 'blur' }],
  blockFlag: [{ required: true, message: '客户锁信息不能为空', trigger: 'blur' }],
  tel: [
    {
      pattern: /^((0\d{2,3}(-)?\d{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/,
      message: '请输入正确的电话格式',
      trigger: 'blur',
    },
  ],
}
const loading = ref(false)
const formRef = ref()
const form = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        customerId: '',
        blockFlag: '',
        creator: '',
        date: [],
        group: null,
        name: '',
        name2: '',
        name3: '',
        name4: '',
        city: '',
        district: '',
        street: '',
        postalCode: '',
        taxNo1: '',
        taxNo2: '',
        region: '',
        tel: '',
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
      loading.value = true
      req[title.value === '修改客户锁信息' ? 'put' : 'post']('/block', form.value)
        .then(({ code }) => {
          if (code === 200) {
            emit('success')
            emit('update:modelValue', false)
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}
</script>
<style scoped>
.date-box :deep(.el-input__wrapper) {
  width: 95%;
}
</style>
