<template>
  <div>
    <CTable
      :page-conf="{
        action: 'so/getSoList',
      }"
      ref="tableRef"
      id="shipped"
    >
      <el-table-column label="SO NO" prop="so" width="130" />
      <el-table-column label="维修任务号" prop="TaskID" width="120" />
      <el-table-column label="设备序列号" prop="aaa" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="设备型号" prop="bbb" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="仪器SAP Equip编号" prop="ccc" width="128" />
      <el-table-column label="维修类型" prop="ddd" width="100" />
      <el-table-column label="仪器地址" prop="eee" width="100" />
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
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="80">
        <template #default="{ row }">
          <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
          <!-- <el-button type="primary" link @click="handleExamine(row)">
              审批
            </el-button> -->
        </template>
      </el-table-column>
      <!-- <template #actions>
          <el-button type="primary" plain>
            <i-ep-bottom />
            导出
          </el-button>
        </template> -->
      <template #form="{ form }">
        <el-form-item label="SO NO" prop="so">
          <el-input v-model="form.so" placeholder="请输入联系人" clearable />
        </el-form-item>
        <el-form-item label="设备序列号" prop="serialNo">
          <el-select v-model="form.serialNo" placeholder="请输入设备序列号" style="width: 100%" clearable>
            <el-option label="A" value="shanghai" />
            <el-option label="B" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="modelNo">
          <el-input v-model="form.modelNo" placeholder="请输入设备型号" clearable />
        </el-form-item>
        <el-form-item label="CRC" prop="modelNo">
          <el-select v-model="form.serialNo" placeholder="请选择CRC" style="width: 100%" clearable>
            <el-option label="是" value="shanghai" />
            <el-option label="否" value="beijing" />
          </el-select>
          <!-- <el-input v-model="form.modelNo" placeholder="请输入CRC" clearable /> -->
        </el-form-item>
        <el-form-item label="区域" prop="modelNo">
          <el-input v-model="form.modelNo" placeholder="请输入区域" clearable />
        </el-form-item>
        <el-form-item label="客户名称" prop="custDesc">
          <el-input v-model="form.custDesc" placeholder="请输入客户名称" clearable />
        </el-form-item>
        <el-form-item label="工程师名称">
          <el-input v-model="form.ppp" placeholder="请输入FSE工程师名称">
            <template #append>
              <el-button><i-ep-Search /></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="SO类型" prop="orderType">
          <el-cascader
            v-model="orderType"
            :options="options"
            filterable
            clearable
            @change="changeOptions"
            :props="{
              label: 'name',
              value: 'id',
              checkStrictly: true,
            }"
          />
        </el-form-item>
      </template>
    </CTable>
    <Details :data="current" v-model="visible.detail" @success="handleFormSuccess"></Details>
  </div>
</template>

<script setup>
import Details from './components/details.vue'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
// const options = [
//   {
//     value: 'SM01',
//     label: 'SM01',
//   },
//   {
//     value: 'SM02',
//     label: 'SM02',
//   },
//   {
//     value: 'SM03',
//     label: 'SM03',
//     children: [
//       {
//         value: 'xxx',
//         label: '111',
//       },
//       {
//         value: 'xxx',
//         label: '222',
//       },
//       {
//         value: 'xxx',
//         label: '333',
//       },
//       {
//         value: 'xxx',
//         label: '444',
//       },
//     ],
//   },
//   {
//     value: 'SM04',
//     label: 'SM04',
//     children: [
//       {
//         value: 'xxx',
//         label: '111',
//       },
//       {
//         value: 'xxx',
//         label: '222',
//       },
//     ],
//   },
//   {
//     value: 'SM05',
//     label: 'SM05',
//     children: [
//       {
//         value: 'xxx',
//         label: '111',
//       },
//       {
//         value: 'xxx',
//         label: '222',
//       },
//       {
//         value: 'xxx',
//         label: '333',
//       },
//     ],
//   },
// ]
onMounted(() => {
  getMaintenanceType()
})
const options = ref([])
const getMaintenanceType = async () => {
  return req.get('/data/maintenanceType').then(res => {
    const [tree] = utils.arr2tree(res.data, 'id', 'pid')
    options.value = tree
  })
}
const orderType = ref([])
const changeOptions = val => {
  if (!val) {
    tableRef.value.form.orderType = ''
    tableRef.value.form.subType = ''
  } else {
    tableRef.value.form.orderType = val[0]
    tableRef.value.form.subType = val[1]
  }
}
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
</script>
