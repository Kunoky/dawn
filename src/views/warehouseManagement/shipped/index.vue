<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
      }"
      ref="tableRef"
      id="shipped"
    >
      <el-table-column label="SO NO" prop="soNo" width="130" />
      <el-table-column label="设备序列号" prop="serialNo" width="140" />
      <el-table-column label="设备型号" prop="modelNo" width="110" />
      <el-table-column label="收货地址" prop="deliveryAddress" width="200" />
      <el-table-column label="联系人" prop="contactPerson" width="100" />
      <el-table-column label="联系人电话" prop="contactTel" width="120" />
      <el-table-column label="领用时间" prop="createTime" width="140" />
      <el-table-column label="工程师名称" prop="fseName" />
      <el-table-column label="FSE work center" prop="fseWorkCenter" width="145" />
      <el-table-column label="FSE storage location" prop="fseStorageLocation" width="140" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="130">
        <template #default="{ row }">
          <div>
            <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
            <el-button type="primary" link @click="handleDelivery(row)">确认发货</el-button>
          </div>
          <div>
            <el-button type="primary" link @click="handleAdd(row)">新建移库单</el-button>
          </div>
        </template>
      </el-table-column>
      <template #form="{ form }">
        <el-form-item label="SO NO" prop="soNo">
          <el-input v-model="form.soNo" placeholder="请输入SO NO" clearable />
        </el-form-item>
        <el-form-item label="设备序列号" prop="serialNo">
          <el-input v-model="form.serialNo" placeholder="请输入设备型号" clearable />
        </el-form-item>
        <el-form-item label="设备型号" prop="modelNo">
          <el-input v-model="form.modelNo" placeholder="请输入设备型号" clearable />
        </el-form-item>
        <el-form-item label="工程师名称" prop="fseWorkCenter">
          <el-select
            clearable
            v-model="form.fseWorkCenter"
            placeholder="请输入FSE工程师名称"
            filterable
            remote
            :remote-method="remoteMethodEngineerName"
            :loading="engineerNameLoading"
          >
            <el-option v-for="item in engineerNameOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <Details :data="current" v-model="visible.detail" @success="handleFormSuccess"></Details>

    <el-dialog
      title="新建移库单"
      width="30%"
      v-model="detailVisible"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form :model="form" ref="formRef" label-width="155" :rules="rules">
        <el-form-item label="SO订单编号" prop="soNo">
          <el-input v-model="form.soNo" placeholder="请输入SO订单编号" />
        </el-form-item>
        <el-form-item label="移库凭证号" prop="transferVoucherNo">
          <el-input v-model="form.transferVoucherNo" placeholder="请输入移库凭证号" />
        </el-form-item>
        <el-form-item label="快递单号" prop="expressNo">
          <el-input v-model="form.expressNo" placeholder="请输入快递单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Details from './Details.vue'
const listData = params => {
  return req.get('/spareParts/page', { params }).then(res => {
    return { data: res.data }
  })
}

// 工程师名称
const engineerNameLoading = ref(false)
const engineerNameList = ref([])
const engineerNameOptions = ref([])
async function getEngineerName(v) {
  return req.get('/user/fse', { params: { fseName: v } }).then(res => {
    engineerNameList.value = res.data.map(item => {
      return { value: item.fseWorkCenter, label: `${item.fseWorkCenter}_${item.fseName}` }
    })
  })
}
const remoteMethodEngineerName = query => {
  if (query) {
    engineerNameLoading.value = true
    getEngineerName(query).then(() => {
      engineerNameLoading.value = false
      engineerNameOptions.value = engineerNameList.value.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    })
  } else {
    engineerNameOptions.value = []
  }
}

const tableRef = ref()
const refresh = () => tableRef.value.refresh()

const current = ref(null)
const visible = reactive({
  form: false,
  permission: false,
  detail: false,
})

const handleDeatil = row => {
  current.value = row
  visible.detail = true
}
const handleFormSuccess = () => {
  refresh()
}

const handleDelivery = row => {
  ElMessageBox.confirm('确定发货后无法修改，是否继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      return req.put(`/spareParts/delivery/${row.soNo}`)
    })
    .then(({ code }) => {
      if (code === 200) {
        refresh()
      }
    })
}

// 新建移库单
const detailVisible = ref(false)
const formRef = ref(null)
const form = ref({})
const rules = {
  soNo: [{ required: true, message: 'SO订单编号不能为空', trigger: 'blur' }],
  transferVoucherNo: [{ required: true, message: '移库凭证号不能为空', trigger: 'blur' }],
  expressNo: [{ required: true, message: '快递单号不能为空', trigger: 'blur' }],
}

const handleAdd = row => {
  form.value.soNo = row.soNo
  detailVisible.value = true
}

const handleClose = () => {
  detailVisible.value = false
  formRef.value.resetFields()
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      req.post('/st', form.value).then(({ code }) => {
        if (code === 200) {
          detailVisible.value = false
        }
        formRef.value.resetFields()
      })
    }
  })
}
</script>
