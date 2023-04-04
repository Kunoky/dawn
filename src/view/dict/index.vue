<template>
  <div>
    <CTable
      :page-conf="{
        action: listDict,
      }"
      :params="{
        pId: 0,
      }"
      ref="tableRef"
      id="viewDictTable"
    >
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="key" label="Key"></el-table-column>
      <el-table-column prop="val" label="Value"></el-table-column>
      <el-table-column prop="category" label="Category"></el-table-column>
      <el-table-column prop="pId" label="PID"></el-table-column>
      <el-table-column prop="remark" label="Remark" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createdTime" label="Created Time" width="168">
        <template v-slot="{ row }">
          {{ row.createdTime?.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedTime" label="Updated Time" width="168">
        <template v-slot="{ row }">
          {{ row.updatedTime?.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="Operation" width="240">
        <template v-slot="{ row }">
          <el-button @click="hadnleView(row)" :disabled="current?.id === row.id && current?.deleting">
            {{ $t('common.view') }}
          </el-button>
          <el-button
            v-permission:settingDict="2"
            @click="hadnleEdit(row)"
            :disabled="current?.id === row.id && current?.deleting"
          >
            {{ $t('common.edit') }}
          </el-button>
          <el-button
            v-permission:settingDict="3"
            type="danger"
            @click="hadnleDel(row)"
            :loading="current?.id === row.id && current?.deleting"
          >
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button v-permission:settingDict="1" type="primary" @click="hadnleAdd">{{ $t('common.add') }}</el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="category">
          <el-input v-model="form.category" placeholder="Category" />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog :data="current" v-model="visible.form" @success="handleFormSuccess"></FormDialog>
    <ViewTree :root="current" v-model="visible.view"></ViewTree>
  </div>
</template>
<script setup>
import { listDict, delDict } from '@/services/dict'
import FormDialog from './components/FormDialog.vue'
import ViewTree from './components/ViewTree.vue'

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const current = ref(null)
const visible = reactive({
  form: false,
  view: false,
})

const hadnleAdd = () => {
  current.value = null
  visible.form = true
}
const hadnleEdit = row => {
  current.value = row
  visible.form = true
}
const hadnleDel = row => {
  ElMessageBox.confirm(i18n.t('tip.delete'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      delDict(row.id)
      current.value = {
        ...row,
        deleting: true,
      }
    })
    .then(() => {
      ElMessage.success(i18n.t('tip.success'))
      refresh()
    })
}
const handleFormSuccess = () => {
  refresh()
}
const hadnleView = row => {
  current.value = row
  visible.view = true
}
</script>
