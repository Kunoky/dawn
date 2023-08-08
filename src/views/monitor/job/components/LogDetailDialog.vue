<template>
  <el-dialog :model-value="modelValue" @close="handleClose" title="调度日志详情" width="60%" v-bind="$attrs">
    <el-row>
      <el-col :span="12">
        <b>日志序号：</b>
        <span>{{ data.jobLogId }}</span>
      </el-col>
      <el-col :span="12">
        <b>任务分组：</b>
        <span>{{ sys_job_group.kv[data.jobGroup] }}</span>
      </el-col>
      <el-col :span="12">
        <b>任务名称：</b>
        <span>{{ data.jobName }}</span>
      </el-col>
      <el-col :span="12">
        <b>执行时间：</b>
        <span>{{ data.createTime }}</span>
      </el-col>
      <el-col :span="12">
        <b>调用方法：</b>
        <span>{{ data.invokeTarget }}</span>
      </el-col>
      <el-col :span="24">
        <b>日志信息：</b>
        <span>{{ data.jobMessage }}</span>
      </el-col>
      <el-col :span="12">
        <b>执行状态：</b>
        <span>{{ ['正常', '失败'][data.status] }}</span>
      </el-col>
      <el-col :span="24" v-if="data.status == 1">
        <b>异常信息：</b>
        <span>{{ data.exceptionInfo }}</span>
      </el-col>
    </el-row>
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

const sys_job_group = useDict('sys_job_group')

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
<style lang="scss" scoped>
.el-col {
  b {
    width: 120px;
    text-align: right;
    display: inline-block;
  }
  span {
    color: var(--gray-7);
    flex: 1 1;
  }
  display: flex;
  margin-bottom: var(--size-l);
}
</style>
