<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="(form.id ? 'Edit' : 'Add') + ' Dictionary Item'"
    width="40%"
    v-bind="$attrs"
  >
    <el-form :model="form" ref="formRef" label-width="80" :show-message="false">
      <el-form-item label="Key" prop="key" required>
        <el-input v-model="form.key" />
      </el-form-item>
      <el-form-item label="Value" prop="val" required>
        <el-input v-model="form.val" />
      </el-form-item>
      <el-form-item label="Category" prop="category" required>
        <el-input v-model="form.category" :disabled="!!(form.pId || form.id)" />
      </el-form-item>
      <el-form-item label="Order" prop="sort" required>
        <el-input-number v-model="form.sort" :min="0" :precision="0" />
      </el-form-item>
      <el-form-item label="Remark" prop="remark">
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>
      <el-collapse>
        <el-collapse-item title="Meta" name="meta">
          <KVEditor v-model="form.meta" />
        </el-collapse-item>
      </el-collapse>
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
import { addDict, putDict } from '@/services/dict'

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
      form.value = { ...props.data } || {
        key: '',
        val: '',
        category: '',
        sort: 0,
        remark: '',
      }
      form.value.sort ??= 0
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
      ;(props.data?.id ? putDict : addDict)(toRaw(form.value))
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
