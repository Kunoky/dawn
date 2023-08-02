<template>
  <div>
    <CTable
      :page-conf="{
        action: listData,
        hidePage: true,
        dataKey: 'data',
      }"
      ref="tableRef"
      id="systemdept"
      row-key="deptId"
    >
      <el-table-column prop="deptName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag>{{ disableDict.kv[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)" v-hasPermi="['system:dept:edit']">修改</el-button>
          <el-button link type="primary" @click="handleAdd(row)" v-hasPermi="['system:dept:add']">新增</el-button>
          <el-button
            v-if="row.parentId !== 0"
            link
            type="danger"
            @click="handleDel(row)"
            v-hasPermi="['system:dept:remove']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <template #actions>
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:dept:add']">新增</el-button>
        <el-button type="info" plain @click="toggleExpand">展开/折叠</el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入部门名称" clearable />
        </el-form-item>
        <el-form-item label="部门状态">
          <el-select v-model="form.status" placeholder="请选择部门状态" clearable>
            <el-option v-for="i in disableDict.options" v-bind="i" :key="i.key" />
          </el-select>
        </el-form-item>
      </template>
    </CTable>
    <FormDialog
      :data="current"
      v-model="visible.form"
      @success="handleFormSuccess"
      :depts="deptTree"
      :parentId="parentId"
    ></FormDialog>
  </div>
</template>
<script setup name="SystemDept">
import FormDialog from './components/FormDialog.vue'

const { parseTime, arr2tree } = utils

const tableRef = ref()
const refresh = () => tableRef.value.refresh()
const i18n = useI18n()

const allExpandKeys = ref([])
const listData = params =>
  req.get('/system/dept/list', { params }).then(res => {
    const [list, obj] = arr2tree(res.data, 'deptId', 'parentId')
    const keys = []
    Object.values(obj).forEach(i => {
      if (i.children) {
        keys.push(i.deptId)
      } else {
        i.children = []
      }
    })
    allExpandKeys.value = keys
    return { data: list }
  })
const isExpandAll = ref(false)
const toggleExpand = () => {
  const tRef = tableRef.value.tableRef
  isExpandAll.value = !isExpandAll.value
  allExpandKeys.value.forEach(i => {
    tRef.toggleRowExpansion({ deptId: i }, isExpandAll.value)
  })
}

const disableDict = useDict('sys_normal_disable')

const parentId = ref(0)
const current = ref(null)
const visible = reactive({
  form: false,
  config: false,
})

const deptTree = ref([])
const gendeptTree = () => {
  if (deptTree.value.length) return
  let tree = [
    {
      deptId: 0,
      deptName: '主类目',
      children: [],
    },
  ]
  listData().then(({ data }) => {
    tree[0].children = data
    deptTree.value = tree
  })
}

const handleAdd = row => {
  gendeptTree()
  parentId.value = row?.deptId || 0
  current.value = null
  visible.form = true
}

const handleEdit = row => {
  gendeptTree()
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
      return req.delete('system/dept/' + row.deptId)
    })
    .then(({ code }) => {
      if (code === 200) {
        ElMessage.success(i18n.t('tip.success'))
        refresh()
      }
    })
}
const handleFormSuccess = () => {
  refresh()
}
</script>
