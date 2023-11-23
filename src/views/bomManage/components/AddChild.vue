<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose1"
    title="明细管理"
    width="50%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-button type="primary" @click="addChildRow">新增子项物料</el-button>
    <el-table :data="childTableData" style="width: 100%" max-height="360" v-loading="dataLoading">
      <el-table-column label="子项物料号" prop="component" width="110" />
      <el-table-column label="描述" prop="description" />
      <el-table-column label="数量" prop="quantity" width="80" />
      <el-table-column label="创建人" prop="createBy" width="80" />
      <el-table-column label="创建时间" prop="createTime" width="160" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="100">
        <template #default="{ row }">
          <el-button type="danger" link @click="handleDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose1">取消</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="addVisible"
    @close="handleClose"
    title="新增子项物料"
    width="40%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-form :model="form" ref="formRef" label-width="100" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="子项物料号" prop="component">
            <el-select
              clearable
              v-model="form.component"
              placeholder="请输入子项物料号"
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
          <el-form-item label="数量" prop="quantity">
            <el-input v-model="form.quantity" placeholder="请输入数量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述" prop="description">
            <el-input v-model="form.description" disabled />
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
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})

const childTableData = ref([])
watch(
  () => props.modelValue,
  v => {
    if (v) {
      props.data?.material && getDetails()
    }
  },
  { immediate: true }
)
const { run: getDetails, loading: dataLoading } = useAsync(async () => {
  return req.get(`/bom/item/${props.data.material}`).then(res => {
    childTableData.value = res.data
    return res
  })
})

// 增加子
const addVisible = ref(false)
const formRef = ref()
const form = ref({})
const addChildRow = () => {
  addVisible.value = true
}
const rules = {
  component: [{ required: true, message: '子项物料号不能为空', trigger: 'blur' }],
  quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
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
    form.value.component = ''
  } else {
    form.value.component = val.materialNo
    form.value.description = val.itemName
    form.value.unitPrice = val.unitPrice
  }
}

const handleDel = row => {
  ElMessageBox.confirm('数据删除后无法恢复，确定继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      return req.delete(`/bom/item/${row.material}/${row.component}`)
    })
    .then(({ code }) => {
      if (code === 200) {
        getDetails()
      }
    })
}
const handleClose = () => {
  addVisible.value = false
  nextTick(() => {
    formRef.value.resetFields()
  })
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      let data = {
        component: form.value.component,
        material: props.data.material,
        description: form.value.description,
        quantity: form.value.quantity,
      }
      req
        .post('/bom/item', data)
        .then(({ code }) => {
          if (code === 200) {
            getDetails()
            nextTick(() => {
              formRef.value.resetFields()
            })
          }
        })
        .finally(() => {
          addVisible.value = false
        })
    }
  })
}

const handleClose1 = () => {
  emit('update:modelValue', false)
}
</script>
<style scoped>
.date-box :deep(.el-input__wrapper) {
  width: 95%;
}
</style>
