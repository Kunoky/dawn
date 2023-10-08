<template>
  <div>
    <CTable
      :page-conf="{
        action: 'so/getChangeInformationList',
      }"
      ref="tableRef"
      id="query"
    >
      <el-table-column label="SO NO" prop="aaa" />
      <el-table-column label="客户名称" prop="bbb" />
      <el-table-column label="申请人" prop="ccc" />
      <el-table-column label="申请时间" prop="ddd" />
      <el-table-column label="变更信息" prop="eee" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="状态" prop="fff" />
      <el-table-column label="操作" fixed="right" class-name="small-padding fixed-width" width="100">
        <template #default="{ row }">
          <el-button type="info" link @click="handleDeatil(row)">详情</el-button>
          <el-button type="primary" link @click="handleClose(row)">关闭</el-button>
        </template>
      </el-table-column>
      <template #form="{ form }">
        <el-form-item label="SO NO" prop="so">
          <el-input v-model="form.so" placeholder="请输入SO NO" clearable />
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
    <el-dialog title="详情" width="40%" v-model="detailVisible" :close-on-click-modal="false">
      <el-descriptions class="margin-top" :column="2" border size="small">
        <el-descriptions-item>
          <template #label>SO NO</template>
          {{ current.aaa }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>客户名称</template>
          {{ current.bbb }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>申请人</template>
          {{ current.ccc }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>申请时间</template>
          {{ current.ddd }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template #label>状态</template>
          {{ current.fff }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template #label>变更信息</template>
          {{ current.eee }}
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
const current = ref(null)
const detailVisible = ref(false)

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
const tableRef = ref(null)
const changeOptions = val => {
  if (!val) {
    tableRef.value.form.orderType = ''
    tableRef.value.form.subType = ''
  } else {
    tableRef.value.form.orderType = val[0]
    tableRef.value.form.subType = val[1]
  }
}

const handleDeatil = row => {
  current.value = row
  detailVisible.value = true
}
const handleCloseDetail = () => {
  detailVisible.value = false
}

// 关闭
const handleClose = () => {
  // detailVisible.value = true
  ElMessageBox.confirm('是否确认在SAP手工处理', i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  }).then(() => {
    // current.value = {
    //   ...row,
    //   deleting: true,
    // }
    // return req.delete('system/user/' + row.userId)
  })
  // .then(({ code }) => {
  // if (code === 200) {
  //   ElMessage.success(i18n.t('tip.success'))
  //   refresh()
  // }
  // })
}
</script>
