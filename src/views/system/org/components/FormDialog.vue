<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="(form.orgId ? '编辑' : '新增') + '组织'"
    width="60%"
    v-bind="$attrs"
  >
    <el-form :model="form" ref="formRef" label-width="80" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级组织" prop="parentId">
            <el-tree-select
              v-model="form.parentId"
              :data="orgs"
              :props="{ value: 'orgId', label: 'orgName', children: 'children' }"
              value-key="orgId"
              placeholder="选择上级组织"
              check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织名称" prop="orgName">
            <el-input v-model="form.orgName" placeholder="请输入组织名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织代码" prop="orgCode">
            <el-input v-model="form.orgCode" placeholder="请输入组织代码" />
          </el-form-item>
        </el-col>
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
  orgs: Array,
  parentId: Number,
})

const rules = {
  parentId: [{ required: true, message: '上级组织不能为空', trigger: 'blur' }],
  orgName: [{ required: true, message: '组织名称不能为空', trigger: 'blur' }],
  // orgCode: [{ required: true, message: '组织代码不能为空', trigger: 'blur' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        orgId: null,
        parentId: props.parentId,
        orgName: '',
        orgCode: '',
        // orderNum: 0,
        // leader: '',
        // phone: '',
        // email: '',
        // status: '0',
      }
      if (props.data) {
        for (let k in form.value) {
          form.value[k] = props.data[k]
        }
        form.value.parentId &&= +form.value.parentId
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
      req[form.value.orgId ? 'put' : 'post']('organization', form.value)
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
