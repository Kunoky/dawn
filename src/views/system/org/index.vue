<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
        hidePager: true,
        dataKey: 'data',
        totalKey: 'total',
      }"
      ref="tableRef"
      id="systemOrg"
      row-key="orgId"
    >
      <el-table-column prop="orgName" label="组织名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="orgCode" label="组织代码" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-button link type="info" @click="handleEdit(row)" v-hasPermi="['system:org:edit']">修改</el-button>
          <el-button link type="info" @click="handleAdd(row)" v-hasPermi="['system:org:add']">新增</el-button>
          <el-button
            v-if="row.parentId !== 0"
            link
            type="danger"
            @click="handleDel(row)"
            v-hasPermi="['system:org:del']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:org:add']">新增</el-button>
        <el-button type="info" plain @click="toggleExpand">展开/折叠</el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="组织名称" prop="orgName">
          <el-input v-model="form.orgName" placeholder="请输入组织名称" clearable />
        </el-form-item>
      </template>
    </CTable>
    <FormDialog
      :data="current"
      v-model="visible.form"
      @success="handleFormSuccess"
      :orgs="orgTree"
      :parentId="parentId"
    ></FormDialog>
  </div>
</template>
<script setup name="SystemOrg">
import FormDialog from './components/FormDialog.vue'

const { parseTime, arr2tree } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const allExpandKeys = ref([])
const listData = params =>
  req.get('/organization/list', { params }).then(res => {
    const [list, obj] = arr2tree(res, 'orgId', 'parentId')
    const keys = []
    Object.values(obj).forEach(i => {
      if (i.children) {
        keys.push(i.orgId)
      } else {
        i.children = []
      }
    })
    allExpandKeys.value = keys
    return { data: list, total: list.length }
  })
const isExpandAll = ref(false)
const toggleExpand = () => {
  const tRef = tableRef.value.tableRef
  isExpandAll.value = !isExpandAll.value
  allExpandKeys.value.forEach(i => {
    tRef.toggleRowExpansion({ orgId: i }, isExpandAll.value)
  })
}

const parentId = ref('0')
const current = ref(null)
const visible = reactive({
  form: false,
  config: false,
})

const orgTree = ref([])
const genOrgTree = () => {
  let tree = [
    {
      orgId: '0',
      orgName: '根组织',
      children: [],
    },
  ]
  tree[0].children = tableRef.value.pageRef.data
  orgTree.value = tree
}

const handleAdd = row => {
  genOrgTree()
  parentId.value = row?.orgId || '0'
  current.value = null
  visible.form = true
}

const handleEdit = row => {
  genOrgTree()
  current.value = row
  visible.form = true
}
const handleDel = row => {
  ElMessageBox.confirm(i18n.t('tip.delete'), i18n.t('common.warning'), {
    confirmButtonText: i18n.t('common.confirm'),
    cancelButtonText: i18n.t('common.cancel'),
    type: 'warning',
  })
    .then(() => {
      current.value = {
        ...row,
        deleting: true,
      }
      return req.delete('organization/' + row.orgId)
    })
    .then(({ code }) => {
      if (code === 200) {
        refresh()
      }
    })
}
const handleFormSuccess = () => {
  refresh()
}
</script>
