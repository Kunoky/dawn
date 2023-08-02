<template>
  <el-dialog :model-value="modelValue" @close="handleClose" :title="title" width="60%" v-bind="$attrs">
    <el-form :model="form" ref="formRef" label-width="80" :show-message="false" :rules="rules">
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="form.postName" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="form.postCode" placeholder="请输入编码名称" />
      </el-form-item>
      <el-form-item label="岗位顺序" prop="postSort">
        <el-input-number v-model="form.postSort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="岗位状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="i in sys_normal_disable.options" :key="i.value" :label="i.value">{{ i.label }}</el-radio>
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

const title = computed(() => (props.data ? '编辑' : '新增') + '岗位')

const rules = {
  postName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
  postCode: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
  postSort: [{ required: true, message: '岗位顺序不能为空', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

const sys_normal_disable = useDict('sys_normal_disable')

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        postId: undefined,
        postCode: '',
        postName: '',
        postSort: 0,
        status: '0',
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
      loading.value = true
      req[form.value.postId ? 'put' : 'post']('system/post', form.value)
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
