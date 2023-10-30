<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="生成报价"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-button class="mt-4" type="primary" style="margin-bottom: 10px" @click="onAddItem">新增配件</el-button>
    <el-table
      v-loading="dataLoading"
      :data="tableData"
      :summary-method="getSummaries"
      border
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa' }"
      show-summary
    >
      <el-table-column prop="materialNo" label="配件/Labor料号">
        <template #default="{ row }">
          <el-select
            clearable
            v-model="row.materialNo"
            placeholder="请输入配件/Labor料号"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodMaterialNo"
            :loading="materialNoLoading"
            @change="changeMaterialNo($event, row)"
          >
            <el-option v-for="item in materialNoOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位">
        <template #default="{ row }">
          <div class="txt">{{ row.unit }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="单价">
        <template #default="{ row }">
          <el-input v-model="row.unitPrice" placeholder="请输入" @blur="handelPrice(row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="includeTaxPrice" label="含税价格">
        <template #default="{ row }">
          <div class="txt">{{ row.includeTaxPrice }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="配件/Labor数量">
        <template #default="{ row }">
          <el-input v-model="row.quantity" placeholder="请输入" @blur="handelCalculateTotalPrice(row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="subTotal" label="总价">
        <template #default="{ row }">
          <div class="txt">{{ row.subTotal }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="112px">
        <!-- <el-form-item>
          <el-switch v-model="switchVal" active-text="修改折扣率" inactive-text="修改最终价格" @change="handelShowSwitch" />
        </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="最终价格" prop="finalPrice" class="form_flex">
              <el-input
                class="mgr-s"
                v-model="formData.finalPrice"
                @blur="handelEditTotal"
                placeholder="请输入最终价格"
              />
              <el-button style="padding: 0 2px" @click="handelEditTotal">计算折扣率</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="折扣率" prop="discountRate" class="form_flex">
              <el-input
                class="mgr-s"
                v-model="formData.discountRate"
                @blur="handelEditDiscount"
                placeholder="请输入折扣"
              >
                <template #append>%</template>
              </el-input>
              <el-button style="padding: 0 2px" @click="handelEditDiscount">计算最终价格</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model="invoiceInfo" label-width="112px">
        <el-row>
          <el-col :span="24">
            <div class="mgb-l fw-b fs-3" style="margin-left: 40px">发票信息：</div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票抬头" prop="companyName">
              <el-input v-model="invoiceInfo.companyName" placeholder="请输入发票抬头" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人" prop="recipient">
              <el-input v-model="invoiceInfo.recipient" placeholder="请输入收件人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="invoiceInfo.tel" placeholder="请输入联系电话" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行" prop="bankName">
              <el-input v-model="invoiceInfo.bankName" placeholder="请输入开户行" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行账号" prop="bankAccount">
              <el-input v-model="invoiceInfo.bankAccount" placeholder="请输入开户行账号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税号" prop="taxNo">
              <el-input v-model="invoiceInfo.taxNo" placeholder="请输入税号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="注册地址及电话" prop="registeredAddress">
              <el-input v-model="invoiceInfo.registeredAddress" placeholder="请输入注册地址及电话" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
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
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})

const loading = ref(false)
const tableData = ref([])
const invoiceInfo = ref({
  companyName: '',
  recipient: '',
  tel: '',
  bankName: '',
  bankAccount: '',
  taxNo: '',
  registeredAddress: '',
})
const formData = ref({
  discountRate: 100,
  finalPrice: null,
  quotePrice: null,
})
watch(
  () => props.modelValue,
  v => {
    if (v) {
      props.data?.soNo && getPayDemandNote()
    }
  },
  { immediate: true }
)
const { run: getPayDemandNote, loading: dataLoading } = useAsync(async () => {
  return req.get(`/quote/payDemandNote`, { params: { soNo: props.data.soNo, type: 1 } }).then(res => {
    tableData.value = res.data.quoteDetailList
    formData.value = res.data.quoteSummary
    invoiceInfo.value = res.data.invoiceInfo
    return res
  })
})

const onAddItem = () => {
  tableData.value.push({
    materialNo: '',
    unit: '',
    includeTaxPrice: '',
    quantity: '',
    subTotal: '',
  })
}
const deleteRow = index => {
  tableData.value.splice(index, 1)
}

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

const changeMaterialNo = (val, row) => {
  row.materialNo = val.materialNo
  row.unit = val.unit
  row.unitPrice = val.unitPrice
  row.includeTaxPrice = val.includeTaxPrice
}

function getTotal() {
  const total = tableData.value
    .reduce((p, i) => {
      p += +i.subTotal
      return p
    }, 0)
    .toFixed(2)
  formData.value.quotePrice = total
}

const getSummaries = () => {
  return ['总计', '', '', '', formData.value.quotePrice]
}
const validateDiscount = (rule, value, callback) => {
  let reg = new RegExp('^([1-9]|[1-9]\\d|100)$')
  if (!reg.test(value)) {
    callback(new Error('只能输入1~100的正整数'))
  } else {
    callback()
  }
}
const validateRate = (rule, value, callback) => {
  let reg = /^\d+(\.\d{0,2})?$/
  if (value > +formData.value.quotePrice) {
    callback(new Error('最终价格不能超过合计总价'))
  } else if (!reg.test(value)) {
    callback(new Error('只能输入数字，并且只能输入两位小数'))
  } else {
    callback()
  }
}
const rules = {
  finalPrice: [
    { required: true, message: '最终价格不能为空', trigger: 'blur' },
    { required: true, validator: validateRate, trigger: 'blur' },
  ],
  discountRate: [
    { required: true, message: '折扣率不能为空', trigger: 'blur' },
    { required: true, validator: validateDiscount, trigger: 'blur' },
  ],
}

// const switchVal = ref(true)
// 修改开关按钮，值重置
// const handelShowSwitch = () => {
//   formData.value.discountRate = 100
//   console.log(formData.value.quotePrice);
//   formData.value.finalPrice = formData.value.quotePrice
//   nextTick(() => {
//     formRef.value.clearValidate()
//   })
// }
// 修改折扣
const handelEditDiscount = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (formData.value.discoun !== undefined || formData.value.discoun !== '') {
        let totalData = ref(null)
        totalData.value = (formData.value.discountRate * formData.value.quotePrice) / 100
        formData.value.finalPrice = (parseInt(totalData.value * 100) / 100).toFixed(2)
      }
    }
  })
}
const handelEditTotal = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (formData.value.finalPrice !== '' || formData.value.totalVa !== undefined) {
        let data = ref(null)
        data.value = (formData.value.finalPrice / formData.value.quotePrice) * 100
        formData.value.discountRate = Math.floor(data.value)
      }
    }
  })
}
/** 鼠标移入cell */
// const handleCellEnter = row => {
//   row.isEdit = true
//   console.log(tableData.value, '223334');
// }
/** 鼠标移出cell */
// const handleCellLeave = row => {
// row.isEdit = false
// }
const handelPrice = row => {
  let res = row.unitPrice * 1.13
  row.includeTaxPrice = (parseInt(res * 100) / 100).toFixed(2)
  handelCalculateTotalPrice(row)
}
const handelCalculateTotalPrice = row => {
  let data = row.includeTaxPrice * row.quantity
  row.subTotal = (parseInt(data * 100) / 100).toFixed(2)
  getTotal()
}
const handleClose = () => {
  emit('update:modelValue', false)
}
const formRef = ref(null)
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      let data = {
        quoteDetailList: tableData.value,
        invoiceInfo: invoiceInfo.value,
        quoteSummary: formData.value,
        soNo: props.data.soNo,
      }
      req.post('/quote/save', data).then(res => {
        window.open(import.meta.env.VITE_SERVER_PATH + res.data, '_blank')
        emit('update:modelValue', false)
      })
    }
  })
}
</script>

<style scoped>
.form_flex :deep(.el-form-item__content) {
  display: flex;
  flex-flow: inherit;
  justify-content: space-between;
}
</style>
