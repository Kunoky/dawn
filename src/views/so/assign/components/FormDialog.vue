<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="详情"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <el-descriptions class="margin-top" :column="3" border size="small">
      <el-descriptions-item>
        <template #label>SO NO</template>
        {{ form.soNo }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>设备序列号</template>
        {{ form.serialNo }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>设备型号</template>
        {{ form.modelNo }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>仪器SAP Equip编号</template>
        {{ form.eqId }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>维修类型</template>
        {{ form.orderType }} / {{ form.subType }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>客户名称</template>
        {{ form.custDesc }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>客户编号</template>
        {{ form.customerId }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>客户锁信息</template>
        {{ form.aaa }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>仪器地址</template>
        {{ form.equipAddress }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>客户联系人</template>
        <span v-if="form.name">{{ form.name }}</span>
        <span v-else-if="form.lastName + form.firstName === 0"></span>
        <span v-else>{{ form.lastName + form.firstName }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>客户联系人拼音</template>
        {{ form.lastName }} {{ form.firstName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>客户联系人电话</template>
        {{ form.mobile }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>客户联系人邮箱</template>
        {{ form.email }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>代理商</template>
        {{ form.vendor }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>报修来源</template>
        {{ repairSource.kv[form.source] }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>报修时间</template>
        {{ form.repairTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>保修期</template>
        {{ form.warrantyTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>报修内容</template>
        {{ form.content }}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const repairSource = useDict('repairSource')
const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
})
const form = ref({})
watch(
  () => props.modelValue,
  v => {
    if (v) {
      form.value = {
        TaskID: '',
        soNo: '',
        serialNo: '',
        modelNo: '',
        eqId: '',
        orderType: '',
        subType: '',
        custDesc: '',
        customerId: '',
        aaa: '',
        equipAddress: '',
        name: '',
        lastName: '',
        firstName: '',
        mobile: '',
        email: '',
        vendor: '',
        source: '',
        repairTime: '',
        warrantyTime: '',
        content: '',
      }
      if (props.data) {
        for (let k in form.value) {
          form.value[k] = props.data[k]
        }
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
