<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="(form.id ? 'Edit' : 'Add') + ' Permission'"
    width="40%"
    v-bind="$attrs"
  >
    <el-form :model="form" ref="formRef" label-width="80" :show-message="false">
      <el-form-item label="Name" prop="name" required :disabled="form.id">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="operand" prop="operand" required>
        <el-input-number v-model="form.operand" :min="3" :precision="0" />
      </el-form-item>
      <el-form-item label="Remark" prop="remark">
        <el-input v-model="form.remark" type="textarea" />
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
import { addPermission, putPermission } from '@/services/permission'

const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})

const loading = ref(false)
const formRef = ref()
const form = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        name: '',
        operand: 3,
        remark: '',
      }
      if (props.data) {
        for (let k in form.value) {
          form.value[k] = props.data[k]
        }
        form.value.id = props.data.id
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
      // IDB无法处理proxy对象
      ;(props.data?.id ? putPermission : addPermission)(toRaw(form.value))
        .then(() => {
          emit('success')
          emit('update:modelValue', false)
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}
</script>
