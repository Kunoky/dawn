<template>
  <el-dialog :model-value="modelValue" @close="handleClose" title="分配数据权限" width="60%" v-bind="$attrs">
    <CTable
      :page-conf="{
        action: 'system/role/authUser/unallocatedList',
      }"
      v-model="ids"
      selectable
      :params="params"
      ref="tableRef"
      row-key="userId"
      hide-toolbar
    >
      <el-table-column label="用户名称" key="userName" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="用户昵称" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
      <el-table-column label="邮箱" key="email" prop="email" :show-overflow-tooltip="true" />
      <el-table-column label="手机" key="phonenumber" prop="phonenumber" width="120" />
      <el-table-column label="状态" key="status">
        <template #default="{ row }">
          <DictTag :dict="sys_normal_disable" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="160">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>

      <template #form="{ form }">
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名称" clearable />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入手机号码" clearable />
        </el-form-item>
      </template>
    </CTable>
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
defineProps({
  data: Object,
  modelValue: Boolean,
})

const { parseTime } = utils

const sys_normal_disable = useDict('sys_normal_disable')

const route = useRoute()
const params = computed(() => ({ roleId: route.query.id }))

const handleClose = () => {
  emit('update:modelValue', false)
}

const ids = ref([])
const loading = ref(false)
const handleConfirm = () => {
  if (!ids.value.length) return ElMessage.warning('请选择要分配的用户')
  loading.value = true
  req
    .put('system/role/authUser/selectAll', null, {
      params: {
        roleId: route.query.id,
        userIds: ids.value.join(','),
      },
    })
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
</script>
