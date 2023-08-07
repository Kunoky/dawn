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
      <el-form-item label="字典类型">
        <el-input v-model="form.dictType" :disabled="true" />
      </el-form-item>
      <el-form-item label="数据标签" prop="dictLabel">
        <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
      </el-form-item>
      <el-form-item label="数据键值" prop="dictValue">
        <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
      </el-form-item>
      <el-form-item label="样式属性" prop="cssClass">
        <el-input v-model="form.cssClass" placeholder="请输入样式属性" />
      </el-form-item>
      <el-form-item label="显示排序" prop="dictSort">
        <el-input-number v-model="form.dictSort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="回显样式" prop="listClass">
        <el-select v-model="form.listClass">
          <el-option
            v-for="i in listClassOptions"
            :key="i.value"
            :label="i.label + '(' + i.value + ')'"
            :value="i.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="i in sys_normal_disable.options" :key="i.value" :label="i.value">{{ i.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
  type: String,
})

const title = computed(() => (props.data ? '编辑' : '新增') + '字典数据')

const rules = {
  dictLabel: [{ required: true, message: '数据标签不能为空', trigger: 'blur' }],
  dictValue: [{ required: true, message: '数据键值不能为空', trigger: 'blur' }],
  dictSort: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }],
}

// 数据标签回显样式
const listClassOptions = ref([
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' },
])

const loading = ref(false)
const formRef = ref()
const form = ref({})

const sys_normal_disable = useDict('sys_normal_disable')

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        dictCode: null,
        dictType: props.type,
        dictLabel: '',
        dictValue: '',
        cssClass: '',
        listClass: 'default',
        dictSort: 0,
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
      req[form.value.dictId ? 'put' : 'post']('system/dict/data', form.value)
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
