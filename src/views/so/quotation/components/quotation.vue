<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="生成报价"
    width="800px"
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
      <el-table-column width="130" prop="materialNo" label="配件/Labor料号">
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
      <el-table-column prop="unitPrice" label="单价" width="120">
        <template #default="{ row }">
          <el-input v-model="row.unitPrice" placeholder="请输入" @blur="handelPrice(row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="includeTaxPrice" label="含税价格">
        <template #default="{ row }">
          <div class="txt">{{ row.includeTaxPrice === null ? handelPrice(row) : row.includeTaxPrice }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="配件/Labor数量" width="100">
        <template #default="{ row }">
          <el-input v-model="row.quantity" placeholder="请输入" @blur="handelCalculateTotalPrice(row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="subTotal" label="总价">
        <template #default="{ row }">
          <div class="txt">{{ row.subTotal }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="112px">
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
      <el-form ref="invoiceInfoRef" :model="invoiceInfo" :rules="rulesInvoiceInfo" label-width="112px">
        <el-row>
          <el-col :span="24">
            <div class="mgb-l fw-b fs-3" style="margin-left: 40px">发票信息：</div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票类型" prop="invoiceType">
              <el-select
                v-model="invoiceInfo.invoiceType"
                style="width: 100%"
                @change="handelInvoiceType"
                placeholder="请选择发票类型"
                clearable
              >
                <el-option label="普票" :value="1" />
                <el-option label="专票" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票抬头" prop="companyName">
              <el-input v-model="invoiceInfo.companyName" placeholder="请输入发票抬头" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="invoiceInfo.invoiceType === 1">
            <el-form-item label="邮箱" prop="recipientEmail">
              <el-input v-model="invoiceInfo.recipientEmail" placeholder="请输入邮箱" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="invoiceInfo.invoiceType === 2">
            <el-form-item label="地址" prop="mailingAddress">
              <el-input v-model="invoiceInfo.mailingAddress" placeholder="请输入地址" clearable />
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
import Big from 'big.js'
const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})

const loading = ref(false)
const tableData = ref([])
const invoiceInfo = ref({
  invoiceType: 1,
  recipientEmail: '',
  mailingAddress: '',
  companyName: '',
  recipient: '',
  tel: '',
  bankName: '',
  bankAccount: '',
  taxNo: '',
  registeredAddress: '',
  type: 1,
})
const formData = ref({
  type: 1,
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
    formData.value = res.data.quoteSummary === null ? formData.value : res.data.quoteSummary
    invoiceInfo.value = res.data.invoiceInfo === null ? invoiceInfo.value : res.data.invoiceInfo
    getTotal()
    return res
  })
})

const rulesInvoiceInfo = {
  recipientEmail: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  tel: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的电话格式', trigger: 'blur' }],
}

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
  getTotal()
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
  row.isBom = val.isBom
  row.itemName = val.itemName
}
function getTotal() {
  const total = tableData.value
    .reduce((p, i) => {
      p += +i.subTotal
      return p
    }, 0)
    .toFixed(2)
  formData.value.quotePrice = total
  formData.value.finalPrice ??= total
}

const getSummaries = () => {
  return ['总计', '', '', '', '', '', formData.value.quotePrice]
}
const validateDiscount = (rule, value, callback) => {
  let reg = new RegExp('^([0-9]|[1-9]\\d|100)$')
  if (!reg.test(value)) {
    callback(new Error('只能输入0~100的正整数'))
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

// b就是a四舍五入的值 如果b小于a 就返回b+0.01 否则返回b
function getFinalPrice(a) {
  let b = Number(a.toFixed(2))
  if (b < a) {
    b = b + 0.01
  }
  return Number(b.toFixed(2))
}
// 修改折扣
const handelEditDiscount = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (formData.value.discountRate !== undefined || formData.value.discountRate !== '') {
        const x = new Big(formData.value.discountRate)
        const y = new Big(formData.value.quotePrice)
        let totalData = ref(null)
        // (折扣率 * 总金额) / 100
        totalData.value = x.times(y).div(100)
        const temp = getFinalPrice(totalData.value)
        formData.value.finalPrice = temp
      }
    }
  })
}
const handelEditTotal = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (formData.value.finalPrice !== '' || formData.value.totalVa !== undefined) {
        const x = new Big(formData.value.finalPrice)
        const y = new Big(formData.value.quotePrice)
        // (最终价格 / 总金额) * 100
        formData.value.discountRate = Math.floor(x.div(y).times(100))
      }
    }
  })
}

const handelPrice = row => {
  let res = row.unitPrice * 1.13
  row.includeTaxPrice = res.toFixed(2)
  // console.log(row.includeTaxPrice,'res');
  // row.includeTaxPrice = (parseInt(res * 100) / 100).toFixed(2)
  handelCalculateTotalPrice(row)
}
const handelCalculateTotalPrice = row => {
  let data = row.includeTaxPrice * row.quantity
  row.subTotal = data.toFixed(2)
  // row.subTotal = (parseInt(data * 100) / 100).toFixed(2)
  getTotal()
}

function handelInvoiceType(val) {
  if (val === 1) {
    invoiceInfo.value.mailingAddress = ''
  } else {
    invoiceInfo.value.recipientEmail = ''
  }
}

const formRef = ref(null)
const invoiceInfoRef = ref(null)
const handleClose = () => {
  nextTick(() => {
    formRef.value.resetFields()
    invoiceInfoRef.value.resetFields()
    tableData.value = []
  })
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const hasEmptyNum = tableData.value.some(
        obj => obj.unitPrice === null || obj.unitPrice === '' || obj.quantity === null || obj.quantity === ''
      )
      if (hasEmptyNum) {
        // 数组中存在空值，返回 false
        ElMessage.error('单价与配件/Labor数量不能为空!')
      } else {
        // 数组中不存在空值，返回 true
        invoiceInfo.value.soNo = props.data.soNo
        formData.value.soNo = props.data.soNo
        let data = {
          quoteDetailList: tableData.value,
          invoiceInfo: invoiceInfo.value,
          quoteSummary: formData.value,
        }
        // console.log(data);
        req.post('/quote/save', data).then(res => {
          if (res.data === '') {
            emit('success')
            emit('update:modelValue', false)
          } else {
            emit('success')
            emit('update:modelValue', false)
            window.open(import.meta.env.VITE_SERVER_PATH + res.data, '_blank')
          }
        })
      }
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
