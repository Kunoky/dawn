<template>
  <el-dialog :model-value="modelValue" @close="handleClose" title="分配数据权限" width="60%" v-bind="$attrs">
    <el-form :model="form" ref="formRef" label-width="120" :show-message="false" v-loading="dataLoading">
      <el-form-item label="角色名称">
        <el-input v-model="form.roleName" :disabled="true" />
      </el-form-item>
      <el-form-item label="权限字符">
        <el-input v-model="form.roleKey" :disabled="true" />
      </el-form-item>
      <el-form-item label="权限范围">
        <el-select v-model="form.dataScope">
          <el-option
            v-for="item in dataScopeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据权限" v-show="form.dataScope == 2">
        <el-checkbox @change="handleCheckedTreeExpand">展开/折叠</el-checkbox>
        <el-checkbox @change="handleCheckedTreeNodeAll">全选/全不选</el-checkbox>
        <el-checkbox v-model="form.deptCheckStrictly">父子联动</el-checkbox>
        <!-- <el-tree-select
          class="wd-100"
          v-model="form.deptIds" 
          multiple
          show-checkbox
          :data="deptTree"
          node-key="id"
          collapse-tags
          :check-strictly="!form.deptCheckStrictly"
          empty-text="加载中，请稍候"
          :props="{ label: 'label', children: 'children' }"
        /> -->
        <el-tree
          class="wd-100 bd"
          :data="deptTree"
          show-checkbox
          ref="deptRef"
          node-key="id"
          :check-strictly="!form.deptCheckStrictly"
          empty-text="加载中，请稍候"
          :props="{ label: 'label', children: 'children' }"
        ></el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('common.confirm') }}</el-button>
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

/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' },
])

const loading = ref(false)
const formRef = ref()
const form = ref({})

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        roleId: undefined,
        dataScope: '',
        roleName: '',
        roleKey: '',
        // roleSort: 0,
        // status: '0',
        deptIds: [],
        // menuIds: [],
        deptCheckStrictly: true,
        // menuCheckStrictly: true,
        // remark: '',
      }

      getData()
      getdept()
      nextTick(() => {
        formRef.value.clearValidate()
      })
    }
  },
  { immediate: true }
)

const { run: getData, loading: dataLoading } = useAsync(() => req.get('system/role/' + (props.data?.roleId || '')), {
  onSuccess(res) {
    for (let k in form.value) {
      form.value[k] = res.data[k]
    }
    form.value.roleSort = +form.value.roleSort
    nextTick(() => {
      formRef.value.clearValidate()
    })
  },
})

const handleClose = () => {
  emit('update:modelValue', false)
}

const deptRef = ref()
const deptTree = ref([])
const getdept = () => {
  req.get('system/role/deptTree/' + props.data.roleId).then(res => {
    deptTree.value = res.data
    if (props.data) {
      deptTree.value = res.depts
      // nextTick(() => {
      deptRef.value.setCheckedKeys(res.checkedKeys)
      // res.checkedKeys.forEach(i => deptRef.value.setChecked(i, true, false))
      // })
    }
  })
}
function getdeptAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = deptRef.value.getCheckedKeys()
  // 半选中的菜单节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = deptTree.value
  for (let i = 0; i < treeList.length; i++) {
    deptRef.value.store.nodesMap[treeList[i].id].expanded = value
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value) {
  deptRef.value.setCheckedNodes(value ? deptTree.value : [])
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      if (form.value.dataScope === '2') {
        form.value.deptIds = getdeptAllCheckedKeys()
      } else {
        form.value.deptIds = []
      }
      req
        .put('system/role', form.value)
        .then(({ code }) => {
          if (code === 200) {
            emit('success')
            emit('update:modelValue', false)
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}
</script>
