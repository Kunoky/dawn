<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="title"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="80" :rules="rules">
      <el-form-item label="字典名称" prop="label">
        <el-input v-model="form.label" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典类型" prop="type">
        <el-input v-model="form.type" placeholder="请输入字典类型" />
      </el-form-item>
      <el-form-item label="序号" prop="orderNum">
        <el-input-number v-model="form.orderNum" :min="0" />
      </el-form-item>
      <el-form-item label="数据类型" prop="valueType">
        <el-radio-group v-model="form.valueType">
          <el-radio
            v-for="i in [
              { label: 'string', value: 2 },
              { label: 'number', value: 1 },
            ]"
            :key="i.value"
            :label="i.value"
          >
            {{ i.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="i in [
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ]"
            :key="i.value"
            :label="i.value"
          >
            {{ i.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

const title = computed(() => (props.data ? '编辑' : '新增') + '字典类型')

const rules = {
  label: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        id: null,
        label: '',
        value: '',
        type: '',
        status: 1,
        orderNum: 0,
        valueType: 2,
        remark: '',
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
      form.value.value = form.value.type
      loading.value = true
      req[form.value.id ? 'put' : 'post']('/dict', form.value)
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
