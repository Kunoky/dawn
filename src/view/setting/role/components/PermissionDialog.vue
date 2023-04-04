<template>
  <el-dialog :model-value="modelValue" @close="handleClose" title="Assign Permissions" width="40%" v-bind="$attrs">
    <el-tree
      ref="treeRef"
      :data="treeData"
      node-key="name"
      show-checkbox
      check-strictly
      @check-change="handleCheck"
      v-loading="loading.get"
    >
      <template #default="{ node }">
        <span class="dict-tree-item">
          <span>{{ node.label }}</span>
          <span v-if="node.data.remark" class="tc-7 mgl-s">({{ node.data.remark }})</span>
        </span>
      </template>
    </el-tree>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.close') }}</el-button>
        <el-button type="primary" @click="handleSave">{{ $t('common.save') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { listPermission } from '@/services/permission'
import { getRole, putRole } from '@/services/role'

const NAME_SEPARATOR = '::'

const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  id: Number,
  modelValue: Boolean,
})

const loading = reactive({
  get: false,
  save: false,
})
const treeRef = ref(null)
const treeData = ref([])
const init = () => {
  loading.get = true
  Promise.all([getRole(props.id), listPermission({})])
    .then(([role, permission]) => {
      permission.list.forEach(i => {
        i.children = []
        i.label = i.name
        const operations = ['create', 'update', 'delete']
        for (let j = 0; j < i.operand; j++) {
          i.children.push({
            label: operations[j] || 'custom ' + (j + 1),
            name: i.name + NAME_SEPARATOR + j,
          })
        }
      })
      treeData.value = permission.list
      nextTick(() => {
        Object.entries(role.permission || {}).forEach(([k, v]) => {
          const node = treeRef.value.getNode(k)
          // permission已删除
          if (!node) return
          treeRef.value.setChecked(k, true)
          // 转为2进制字符串1代表选中，0未选中
          const operand = v.toString(2)
          const end = operand.length - 1
          if (end > -1) {
            const childNodes = node.childNodes
            for (let i = end; i > -1; i--) {
              if (operand[i] === '1') {
                treeRef.value.setChecked(childNodes[end - i].data.name, true)
              }
            }
          }
        })
      })
    })
    .finally(() => {
      loading.get = false
    })
}

watch(
  () => props.modelValue,
  v => {
    if (v) {
      init()
    }
  },
  { immediate: true }
)
const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSave = async () => {
  const permission = {}
  const keys = treeRef.value.getCheckedKeys()
  keys.forEach(i => {
    const [key, idx] = i.split(NAME_SEPARATOR)
    permission[key] ??= 0
    if (idx) {
      permission[key] += Math.pow(2, idx)
    }
  })
  loading.save = true
  await putRole({ id: props.id, permission })
  loading.save = false
  handleClose()
}
const handleCheck = (node, isChecked) => {
  const [key, idx] = node.name.split(NAME_SEPARATOR)
  if (idx) {
    if (isChecked && !treeRef.value.getNode(key).isChecked) {
      treeRef.value.setChecked(key, true)
    }
  } else {
    if (isChecked) {
      // treeRef.value.setChecked(key, true, true)
      // treeRef.value.getNode(key).childNodes.forEach(i => {
      //   treeRef.value.setChecked(i.data.name, true)
      // })
    } else {
      treeRef.value.getNode(key).childNodes.forEach(i => {
        treeRef.value.setChecked(i.data.name, false)
      })
    }
  }
}
</script>
<style lang="scss"></style>
