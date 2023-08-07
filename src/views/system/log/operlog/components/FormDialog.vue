<template>
  <el-dialog :model-value="modelValue" @close="handleClose" title="操作日志明细" width="60%" v-bind="$attrs">
    <el-form label-width="100">
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作模块：">{{ data.title }} / {{ sys_oper_type.kv[data.businessType] }}</el-form-item>
          <el-form-item label="登录信息：">
            {{ data.operName }} / {{ data.operIp }} / {{ data.operLocation }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求地址：">{{ data.operUrl }}</el-form-item>
          <el-form-item label="请求方式：">{{ data.requestMethod }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="操作方法：">{{ data.method }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="请求参数：" class="of-a">{{ data.operParam }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="返回参数：">{{ data.jsonResult }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="操作状态：">
            <div v-if="data.status === 0">正常</div>
            <div v-else-if="data.status === 1">失败</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="消耗时间：">{{ data.costTime }}毫秒</el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="操作时间：">{{ parseTime(data.operTime) }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="异常信息：" v-if="data.status === 1">{{ data.errorMsg }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.close') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])
defineProps({
  data: Object,
  modelValue: Boolean,
})

const { parseTime } = utils

const sys_oper_type = useDict('sys_oper_type')
const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
