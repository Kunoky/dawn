<template>
  <el-dialog :model-value="modelValue" @close="handleClose" title="任务详情" width="60%" v-bind="$attrs">
    <el-row>
      <el-col :span="12">
        <b>任务编号：</b>
        <span>{{ data.jobId }}</span>
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
        <b>创建时间：</b>
        <span>{{ data.createTime }}</span>
      </el-col>
      <el-col :span="12">
        <b>cron表达式：</b>
        <span>{{ data.cronExpression }}</span>
      </el-col>
      <el-col :span="12">
        <b>下次执行时间：</b>
        <span>{{ data.nextValidTime }}</span>
      </el-col>
      <el-col :span="24">
        <b>调用目标方法：</b>
        <span>{{ data.invokeTarget }}</span>
      </el-col>
      <el-col :span="12">
        <b>任务状态：</b>
        <span>{{ ['正常', '失败'][data.status] }}</span>
      </el-col>
      <el-col :span="12">
        <b>是否并发：</b>
        <span>{{ ['允许', '禁止'][data.concurrent] }}</span>
      </el-col>
      <el-col :span="12">
        <b>执行策略：</b>
        <span>{{ ['默认策略', '立即执行', '执行一次', '放弃执行'][data.misfirePolicy] }}</span>
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
  }
  margin-bottom: var(--size-l);
}
</style>
