<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="生成报价"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-table
      :data="tableData"
      @cell-mouse-enter="handleCellEnter"
      @cell-mouse-leave="handleCellLeave"
      border
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa' }"
      show-summary
      :summary-method="getSummaries"
    >
      <!-- <el-table-column prop="data" label="操作类型" width="180" align="center">
      </el-table-column>
      <el-table-column prop="name" label="设备名称">
        <template #default="scope">
          <el-input v-if="scope.row.isEdit" v-model="scope.row.name" placeholder="请输入"></el-input>
          <div v-else class="txt">{{ scope.row.name }}</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="date" label="配件/Labor料号" />
      <el-table-column prop="name" label="单位" />
      <el-table-column prop="aaa" label="含税价格">
        <template #default="{ row }">
          <el-input v-if="row.isEdit" v-model="row.aaa" placeholder="请输入"></el-input>
          <div v-else class="txt">{{ row.aaa }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sss" label="配件/Labor数量">
        <template #default="{ row }">
          <el-input v-if="row.isEdit" v-model="row.sss" placeholder="请输入"></el-input>
          <div v-else class="txt">{{ row.sss }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="总价" />
    </el-table>

    <div style="margin-top: 20px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="130px">
        <!-- <el-form-item>
                  <el-switch v-model="formData.switchVal" active-text="修改折扣率" inactive-text="修改最终价格"
                    @change="handelShowSwitch" />
                </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="最终价格"
              prop="totalVal"
              :rules="[{ required: true, validator: validateRate, trigger: 'blur' }]"
            >
              <el-input style="width: 74%" class="mgr-s" v-model="formData.totalVal" placeholder="请输入最终价格" />
              <el-button @click="handelEditTotal">计算折扣率</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="折扣率" prop="discount">
              <el-input disabled v-model="formData.discount" placeholder="请输入折扣">
                <template #append>%</template>
              </el-input>
              <!-- <el-button @click="handelEditDiscount">计算最终价格</el-button> -->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="mgb-l fw-b fs-3" style="margin-left: 50px">发票信息：</div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票抬头" prop="aaa">
              <el-input v-model="formData.aaa" placeholder="请输入发票抬头" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收件人" prop="bbb">
              <el-input v-model="formData.bbb" placeholder="请输入收件人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="ccc">
              <el-input v-model="formData.ccc" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行" prop="ddd">
              <el-input v-model="formData.ddd" placeholder="请输入开户行" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行账号" prop="eee">
              <el-input v-model="formData.eee" placeholder="请输入开户行账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税号" prop="fff">
              <el-input v-model="formData.fff" placeholder="请输入税号" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="注册地址及电话" prop="ggg">
              <el-input v-model="formData.ggg" placeholder="请输入注册地址及电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Pending具体状态" prop="hhh">
              <el-select v-model="formData.hhh" placeholder="请选择Pending具体状态" clearable style="width: 100%">
                <el-option label="客户内部流程申请" value="1" />
                <el-option label="与客户议价中" value="2" />
                <el-option label="待付款" value="3" />
                <el-option label="线下合同审批" value="4" />
                <el-option label="其他" value="5" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="remark" prop="iii">
              <el-input type="textarea" v-model="formData.iii" placeholder="请输入Pending具体" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('common.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<!-- https://blog.csdn.net/hongtoushan/article/details/114130938 -->
<script setup>
const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})

const activeNames = ref(['2'])
const tableData = [
  {
    date: '1',
    name: 'xxx',
    aaa: '92',
    sss: '2',
    address: '322',
  },
  {
    date: '3',
    name: 'xxx',
    aaa: '67',
    sss: '2',
    address: '13676',
  },
  {
    date: '2',
    name: 'xxx',
    aaa: '45',
    sss: '2',
    address: '2324',
  },
  {
    date: '25',
    name: 'xxx',
    aaa: '24',
    sss: '2',
    address: '34534',
  },
]
const loading = ref(false)
const form = ref({})
watch(
  () => props.modelValue,
  v => {
    if (v) {
      if (props.data) {
        form.value = props.data
      }
    }
  },
  { immediate: true }
)
const handleClose = () => {
  activeNames.value = ['2']
  emit('update:modelValue', false)
}
const formRef = ref()
const handleConfirm = () => {
  // formRef.value.validate(valid => {
  //   if (valid) {
  //   }
  // })
}
const zong = ref(50856.0)
const formData = ref({
  discount: 100,
  totalVal: null,
  aaa: '',
  bbb: '',
  ccc: '',
  ddd: '',
  eee: '',
  fff: '',
  ggg: '',
  hhh: '',
  iii: '',
})
const rules = {
  // totalVal: [{ required: true, validator: validateRate, trigger: 'blur' }],
  aaa: [{ required: true, message: '发票抬头不能为空', trigger: 'blur' }],
  bbb: [{ required: true, message: '收件人不能为空', trigger: 'blur' }],
  ccc: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
  ddd: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
  eee: [{ required: true, message: '开户行账号不能为空', trigger: 'blur' }],
  fff: [{ required: true, message: '税号不能为空', trigger: 'blur' }],
  ggg: [{ required: true, message: '注册地址及电话不能为空', trigger: 'blur' }],
  hhh: [{ required: true, message: 'pending具体状态不能为空', trigger: 'change' }],
  iii: [{ required: true, message: 'remark不能为空', trigger: 'blur' }],
}
const validateRate = (rule, value, callback) => {
  // console.log(value, zong.value)
  if (value === '') {
    callback(new Error('最终价格不能为空'))
  } else if (value > zong.value) {
    callback(new Error('最终价格不能超过合计总价'))
  }
}
const getSummaries = param => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    const values = data.map(item => Number(item[column.property]))
    if (column.property === 'address') {
      sums[index] = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
    }
  })
  for (let i = 0; i < sums.length; i++) {
    if (!isNaN(sums[i])) {
      sums[i] = sums[i].toFixed(2)
    }
  }
  formData.value.totalVal = zong.value
  return sums
}
// 修改开关按钮，值重置
// const handelShowSwitch = () => {
//   formData.value.discount = 100
//   formData.value.totalVal = zong.value[4]
//   nextTick(() => {
//     formRef.value.clearValidate()
//   })
// }
// 修改折扣
// const handelEditDiscount = () => {
//   if (formData.value.discoun != undefined || formData.value.discoun != '') {
//     let totalData = ref(null)
//     totalData.value = (formData.value.discount * zong.value) / 100
//     formData.value.totalVal = totalData.value.toFixed(2)
//   }
// }
const handelEditTotal = () => {
  if (formData.value.totalVal !== '' || formData.value.totalVa !== undefined) {
    let data = ref(null)
    data.value = (formData.value.totalVal / zong.value) * 100
    formData.value.discount = Math.floor(data.value)
  }
}
/** 鼠标移入cell */
// const handleCellEnter = (row, column, cell, event) => {
const handleCellEnter = row => {
  row.isEdit = true
}
/** 鼠标移出cell */
// const handleCellLeave = (row, column, cell, event) => {
const handleCellLeave = row => {
  row.isEdit = false
}
</script>

<style></style>
