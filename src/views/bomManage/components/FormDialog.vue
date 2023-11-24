<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="新增BOM"
    width="40%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="80" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="物料号" prop="material">
            <el-select
              clearable
              v-model="form.material"
              placeholder="请输入物料号"
              filterable
              remote
              :remote-method="remoteMethodMaterialNo"
              :loading="materialNoLoading"
              @change="changeMaterialNo"
              style="width: 100%"
            >
              <el-option v-for="item in materialNoOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单价" prop="unitPrice">
            <el-input v-model="form.unitPrice" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'success'])
defineProps({
  modelValue: Boolean,
})
const loading = ref(false)
const formRef = ref()
const form = ref({})
const rules = {
  material: [{ required: true, message: '物料号不能为空', trigger: 'blur' }],
}

// 搜索bom
const materialNoLoading = ref(false)
const materialNoList = ref([])
const materialNoOptions = ref([])
async function getEngineerName(v) {
  return req.get('/data/material', { params: { materialNo: v } }).then(res => {
    materialNoList.value = res.data.map(item => {
      return { value: item, label: item.materialNo }
    })
  })
}
const remoteMethodMaterialNo = query => {
  if (query) {
    materialNoLoading.value = true
    getEngineerName(query).then(() => {
      materialNoLoading.value = false
      materialNoOptions.value = materialNoList.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    })
  } else {
    materialNoOptions.value = []
  }
}

const changeMaterialNo = val => {
  if (val.isBom) {
    ElMessage.error('已是BOM，无需添加')
    form.value.material = ''
  } else {
    form.value.material = val.materialNo
    form.value.description = val.itemName
    form.value.unit = val.unit
    form.value.unitPrice = val.unitPrice
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
  nextTick(() => {
    formRef.value.resetFields()
  })
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      let data = {
        material: form.value.material,
        description: form.value.description,
      }
      req
        .post('/bom', data)
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
