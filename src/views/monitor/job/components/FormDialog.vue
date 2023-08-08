<template>
  <el-dialog :model-value="modelValue" @close="handleClose" :title="title" width="60%" v-bind="$attrs">
    <el-form :model="form" ref="formRef" label-width="80" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务名称" prop="jobName">
            <el-input v-model="form.jobName" placeholder="请输入任务名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务分组" prop="jobGroup">
            <el-select v-model="form.jobGroup" placeholder="请选择">
              <el-option v-for="i in sys_job_group.options" :key="i.value" v-bind="i" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="invokeTarget">
            <template #label>
              <span>
                调用方法
                <el-tooltip placement="top">
                  <template #content>
                    <div>
                      Bean调用示例：ryTask.ryParams('ry')
                      <br />
                      Class类调用示例：com.fmc.quartz.task.RyTask.ryParams('ry')
                      <br />
                      参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                    </div>
                  </template>
                  <i-ep-question-filled />
                </el-tooltip>
              </span>
            </template>
            <el-input v-model="form.invokeTarget" placeholder="请输入调用目标字符串" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="cron表达式" prop="cronExpression">
            <el-input v-model="form.cronExpression" type="textarea" placeholder="请输入cron执行表达式"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="执行策略" prop="misfirePolicy">
            <el-radio-group v-model="form.misfirePolicy">
              <el-radio-button label="1">立即执行</el-radio-button>
              <el-radio-button label="2">执行一次</el-radio-button>
              <el-radio-button label="3">放弃执行</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否并发" prop="concurrent">
            <el-radio-group v-model="form.concurrent">
              <el-radio-button label="0">允许</el-radio-button>
              <el-radio-button label="1">禁止</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio v-for="i in sys_job_status.options" :key="i.value" :label="i.value">{{ i.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
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

const title = computed(() => (props.data ? '编辑' : '新增') + '任务')

const rules = {
  jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  invokeTarget: [{ required: true, message: '调用目标字符串不能为空', trigger: 'blur' }],
  cronExpression: [{ required: true, message: 'cron执行表达式不能为空', trigger: 'change' }],
}

const loading = ref(false)
const formRef = ref()
const form = ref({})

const sys_job_group = useDict('sys_job_group')
const sys_job_status = useDict('sys_job_status')

watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        jobId: null,
        jobName: '',
        jobGroup: '',
        invokeTarget: '',
        cronExpression: '',
        misfirePolicy: 1,
        concurrent: 1,
        status: '0',
      }
      if (props.data) {
        for (let k in form.value) {
          form.value[k] = props.data[k]
        }
      }
      nextTick(() => {
        formRef.value.clearValidate()
      })
    }
  },
  { immediate: true }
)

const handleClose = () => {
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      req[form.value.jobId ? 'put' : 'post']('monitor/job', form.value)
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
