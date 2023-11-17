<template>
  <div>
    <CTable
      :page-conf="{
        action: '/ic/list',
      }"
      ref="tableRef"
      id="query"
    >
      <el-table-column label="SO NO" prop="soNo" />
      <el-table-column label="客户名称" prop="custName" />
      <el-table-column label="申请人" prop="requestName" />
      <el-table-column label="申请时间" prop="createTime" />
      <el-table-column label="变更信息" prop="content" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          {{ row.status ? '已关闭' : '已提交' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="100">
        <template #default="{ row }">
          <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
          <el-button v-if="!row.status" type="primary" link @click="handleClose(row)">关闭</el-button>
        </template>
      </el-table-column>
      <template #form="{ form }">
        <el-form-item label="SO NO" prop="soNo">
          <el-input v-model="form.soNo" placeholder="请输入SO NO" clearable />
        </el-form-item>
        <!-- <el-form-item label="设备序列号" prop="serialNo">
          <el-input v-model="form.serialNo" placeholder="请输入设备型号" clearable />
        </el-form-item> -->
        <!-- <el-form-item label="设备型号" prop="modelNo">
          <el-input v-model="form.modelNo" placeholder="请输入设备型号" clearable />
        </el-form-item> -->
        <!-- <el-form-item label="CRC" prop="isCrc">
          <el-select v-model="form.isCrc" placeholder="请选择CRC" clearable>
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="区域" prop="area">
          <el-input v-model="form.area" placeholder="请输入区域" clearable />
        </el-form-item> -->
        <el-form-item label="客户名称" prop="custName">
          <el-input v-model="form.custName" placeholder="请输入客户名称" clearable />
        </el-form-item>
        <el-form-item label="申请人" prop="requestName">
          <el-input v-model="form.requestName" placeholder="请输入申请人" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select clearable v-model="form.status" placeholder="请选择状态">
            <el-option label="已提交" value="0" />
            <el-option label="已关闭" value="1" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="工程师名称" prop="fseId">
          <el-select clearable v-model="form.fseId" placeholder="请输入FSE工程师名称" filterable remote reserve-keyword
            :remote-method="remoteMethodEngineerName" :loading="engineerNameLoading">
            <el-option v-for="item in engineerNameOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="SO类型" prop="options">
          <el-cascader v-model="form.options" :options="options" filterable clearable @change="changeOptions" :props="{
            label: 'name',
            value: 'id',
            checkStrictly: true,
          }" />
        </el-form-item> -->
      </template>
    </CTable>
    <el-dialog title="详情" width="40%" v-model="detailVisible" :close-on-click-modal="false">
      <el-descriptions class="margin-top" :column="2" border size="small">
        <el-descriptions-item>
          <template #label>SO NO</template>
          {{ current.soNo }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>客户名称</template>
          {{ current.custName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>申请人</template>
          {{ current.requestName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>申请时间</template>
          {{ current.createTime }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template #label>状态</template>
          {{ current.status ? '已关闭' : '已提交' }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template #label>变更信息</template>
          {{ current.content }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseDetail">{{ $t('common.cancel') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const i18n = useI18n()
const refresh = () => tableRef.value.refresh()

const tableRef = ref(null)

// 工程师名称
// const engineerNameLoading = ref(false)
// const engineerNameList = ref([])
// const engineerNameOptions = ref([])
// async function getEngineerName(v) {
//   return req.get('/user/fse', { params: { fseName: v } }).then(res => {
//     engineerNameList.value = res.data.map(item => {
//       return { value: item.fseId, label: `${item.fseId} / ${item.fseName}` }
//     })
//   })
// }
// const remoteMethodEngineerName = query => {
//   if (query) {
//     engineerNameLoading.value = true
//     getEngineerName(query).then(() => {
//       engineerNameLoading.value = false
//       engineerNameOptions.value = engineerNameList.value.filter(item => {
//         return item.label.toLowerCase().includes(query.toLowerCase())
//       })
//     })
//   } else {
//     engineerNameOptions.value = []
//   }
// }

// onMounted(() => {
//   getMaintenanceType()
// })
// const options = ref([])
// const getMaintenanceType = async () => {
//   return req.get('/data/maintenanceType').then(res => {
//     const [tree] = utils.arr2tree(res.data, 'id', 'pid')
//     options.value = tree
//   })
// }

// const changeOptions = val => {
//   if (!val) {
//     tableRef.value.form.orderType = ''
//     tableRef.value.form.subType = ''
//   } else {
//     tableRef.value.form.orderType = val[0]
//     tableRef.value.form.subType = val[1]
//   }
// }

// 详情
const current = ref(null)
const detailVisible = ref(false)
const handleDeatil = row => {
  current.value = row
  detailVisible.value = true
}
const handleCloseDetail = () => {
  detailVisible.value = false
}

// 关闭
const handleClose = row => {
  ElMessageBox.confirm('是否确认在SAP手工处理', i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      return req.put(`/ic/${row.id}`)
    })
    .then(({ code }) => {
      if (code === 200) {
        refresh()
      }
    })
}
</script>
