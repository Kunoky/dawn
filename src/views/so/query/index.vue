<template>
  <div>
    <CTable
      :page-conf="{
        action: 'so/getSoList',
      }"
      ref="tableRef"
      id="systemRole"
    >
      <el-table-column label="SO NO" prop="so" width="130" />
      <el-table-column label="维修任务号" prop="TaskID" width="120" />
      <el-table-column label="仪器序列号" prop="aaa" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="型号" prop="bbb" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="ccc" width="128" />
      <el-table-column label="维修类型" prop="ddd" width="100" />
      <el-table-column label="仪器地址" prop="eee" width="100" />
      <el-table-column label="创建人" prop="www" width="100" />
      <el-table-column label="客户单位名称" prop="fff" width="100" />
      <el-table-column label="客户编号" prop="ggg" width="100" />
      <el-table-column label="客户联系人" prop="hhh" width="100" />
      <el-table-column label="客户联系人电话" prop="iii" width="120" />
      <el-table-column label="客户联系人邮箱" prop="jjj" width="130" />
      <el-table-column label="代理商" prop="kkk" width="100" />
      <el-table-column label="报修内容" prop="lll" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="报修来源" prop="mmm" width="100" />
      <el-table-column label="报修时间" prop="nnn" width="100" />
      <el-table-column label="保修期" prop="ooo" width="100" />
      <el-table-column label="FSE工程师名称" prop="ppp" width="100" />
      <el-table-column label="FSE work center" prop="qqq" width="115" />
      <el-table-column label="FSE storage location" prop="rrr" width="140" />
      <el-table-column label="SO状态" prop="ttt" width="140">
        <template #default="{ row }">
          {{ row.ttt === '3' ? '待审批' : '' }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="审批结果" prop="uuu" width="140" /> -->
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="100">
        <template #default="{ row }">
          <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
          <el-button type="primary" link @click="handleClose(row)">关闭</el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain>
          <i-ep-bottom />
          导出
        </el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="SO NO" prop="so">
          <el-input v-model="form.so" placeholder="请输入SO NO" clearable />
        </el-form-item>
        <el-form-item label="SO 状态" prop="ttt">
          <el-select v-model="form.ttt" placeholder="请选择SO 状态" clearable>
            <el-option label="A" value="fse" />
            <el-option label="B" value="qt" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="仪器序列号" prop="TaskID">
          <el-input v-model="form.TaskID" placeholder="请输入仪器序列号" clearable />
        </el-form-item> -->
        <el-form-item label="维修类型" prop="ddd">
          <el-cascader v-model="form.ddd" :options="options" filterable clearable style="width: 100%" />
        </el-form-item>
        <el-form-item label="客户联系人" prop="hhh">
          <el-input v-model="form.hhh" placeholder="请输入客户联系人" clearable />
        </el-form-item>
        <el-form-item label="客户联系人电话" prop="iii">
          <el-input v-model="form.iii" placeholder="请输入客户联系人电话" clearable />
        </el-form-item>
        <el-form-item label="报修来源" prop="mmm">
          <el-select v-model="form.mmm" placeholder="请输入报修来源" clearable>
            <el-option label="FSE" value="fse" />
            <el-option label="其他" value="qt" />
          </el-select>
        </el-form-item>
        <el-form-item label="工程师名称">
          <el-input v-model="form.ppp" placeholder="请输入FSE工程师名称">
            <template #append>
              <el-button><i-ep-Search /></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="报修时间">
          <el-date-picker
            v-model="form.params"
            placeholder="请选择时间"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
      </template>
    </CTable>
    <Details :data="current" v-model="visible.detail" @success="handleFormSuccess"></Details>

    <el-dialog title="关闭" width="30%" v-model="detailVisible" :close-on-click-modal="false">
      <el-form :model="formDetails" ref="formRefDetails" label-width="80" :rules="rules">
        <el-form-item label="原因" prop="so">
          <el-select v-model="formDetails.so" placeholder="请选择原因" clearable style="width: 100%">
            <el-option label="超客户预算" value="1" />
            <el-option label="经费审批未通过" value="2" />
            <el-option label="第三方维修" value="3" />
            <el-option label="未中标" value="4" />
            <el-option label="暂不维修" value="5" />
            <el-option label="仪器报废" value="6" />
            <el-option label="转延保" value="7" />
            <el-option label="客户无反馈" value="8" />
            <el-option label="其他" value="9" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formDetails.so === '9'" label="其他原因" prop="details">
          <el-input type="textarea" v-model="formDetails.details" placeholder="请输入其他原因" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDetail">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Details from './components/details.vue'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const options = [
  {
    value: 'SM01',
    label: 'SM01',
  },
  {
    value: 'SM02',
    label: 'SM02',
  },
  {
    value: 'SM03',
    label: 'SM03',
    children: [
      {
        value: 'xxx',
        label: '111',
      },
      {
        value: 'xxx',
        label: '222',
      },
      {
        value: 'xxx',
        label: '333',
      },
      {
        value: 'xxx',
        label: '444',
      },
    ],
  },
  {
    value: 'SM04',
    label: 'SM04',
    children: [
      {
        value: 'xxx',
        label: '111',
      },
      {
        value: 'xxx',
        label: '222',
      },
    ],
  },
  {
    value: 'SM05',
    label: 'SM05',
    children: [
      {
        value: 'xxx',
        label: '111',
      },
      {
        value: 'xxx',
        label: '222',
      },
      {
        value: 'xxx',
        label: '333',
      },
    ],
  },
]
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

const detailVisible = ref(false)
const formRefDetails = ref(null)
const formDetails = ref({
  so: '',
  details: '',
})
const rules = {
  so: [{ required: true, message: '原因不能为空', trigger: 'change' }],
  details: [{ required: true, message: '其他原因不能为空', trigger: 'blur' }],
}
const handleClose = () => {
  detailVisible.value = true
}
const handleCloseDetail = () => {
  detailVisible.value = false
  nextTick(() => {
    formRefDetails.value.clearValidate()
  })
}
const handleConfirm = () => {
  formRefDetails.value.validate(valid => {
    if (valid) {
      // form.value.value = form.value.category
      // loading.value = true
      // req[form.value.dictId ? 'put' : 'post']('/dict', form.value)
      //   .then(({ code }) => {
      //     if (code === 200) {
      //       emit('success')
      //       emit('update:modelValue', false)
      //     }
      //   })
      //   .finally(() => {
      //     loading.value = false
      //   })
    }
  })
}

// const mitter = useMitt()
// mitter.on('qurey-refresh', refresh)
</script>
