<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    title="详情"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
    class="query-detail-dialog"
  >
    <div class="demo-collapse">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础信息" name="1">
          <el-descriptions class="margin-top" :column="3" border size="small">
            <el-descriptions-item>
              <template #label>维修任务号</template>
              {{ form.TaskID }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>SO NO</template>
              {{ form.so }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>仪器序列号</template>
              {{ form.aaa }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>型号</template>
              {{ form.bbb }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>仪器SAP Equip编号</template>
              {{ form.ccc }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>维修类型</template>
              {{ form.ddd }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>客户单位名称</template>
              {{ form.fff }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>客户编号</template>
              {{ form.ggg }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>仪器地址</template>
              {{ form.eee }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>客户联系人</template>
              {{ form.hhh }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>客户联系人电话</template>
              {{ form.iii }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>客户联系人邮箱</template>
              {{ form.jjj }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>FSE工程师名称</template>
              {{ form.ppp }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>FSE work center</template>
              {{ form.qqq }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>FSE storage location</template>
              {{ form.rrr }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>代理商</template>
              {{ form.kkk }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>报修来源</template>
              {{ form.mmm }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>报修时间</template>
              {{ form.nnn }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>保修期</template>
              {{ form.ooo }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>报修内容</template>
              {{ form.lll }}
            </el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item title="Parts Plan & Labor" name="2">
          <div>
            <div style="margin-bottom: 10px">申请时间：2023-08-22 09:11:23</div>
            <el-table
              size="small"
              :data="tableData"
              style="width: 100%; margin-bottom: 20px"
              max-height="190"
              :header-cell-style="{ background: '#f5f7fa' }"
              show-summary
              :summary-method="getSummaries"
            >
              <el-table-column prop="date" label="配件/Labor料号" />
              <el-table-column prop="name" label="单位" />
              <el-table-column prop="aaa" label="单价" />
              <el-table-column prop="sss" label="配件/Labor数量" />
              <el-table-column prop="address" label="总价" />
            </el-table>
            <div style="margin-bottom: 10px">申请时间：2023-08-24 09:11:23</div>
            <el-table
              size="small"
              :data="tableData"
              style="width: 100%; margin-bottom: 20px"
              max-height="190"
              :header-cell-style="{ background: '#f5f7fa' }"
              show-summary
              :summary-method="getSummaries"
            >
              <el-table-column prop="date" label="配件/Labor料号" />
              <el-table-column prop="name" label="单位" />
              <el-table-column prop="aaa" label="单价" />
              <el-table-column prop="sss" label="配件/Labor数量" />
              <el-table-column prop="address" label="总价" />
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="报价信息" name="3">
          <div style="margin-bottom: 10px">报价日期： 2023-08-08 12:19:30</div>
          <el-table
            size="small"
            :data="tableData"
            style="width: 100%; margin-bottom: 20px"
            max-height="190"
            :header-cell-style="{ background: '#f5f7fa' }"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column prop="date" label="配件/Labor料号" />
            <el-table-column prop="name" label="单位" />
            <el-table-column prop="aaa" label="含税价格" />
            <el-table-column prop="sss" label="配件/Labor数量" />
            <el-table-column prop="address" label="总价" />
          </el-table>
          <div>
            <el-table
              size="small"
              :data="tableData1"
              style="width: 100%; margin-bottom: 20px"
              max-height="190"
              :header-cell-style="{ background: '#f5f7fa' }"
            >
              <el-table-column type="index" label="序号" />
              <el-table-column prop="aaa" label="配件总价" />
              <el-table-column prop="bbb" label="最终价格" />
              <el-table-column prop="ccc" label="折扣率" />
              <el-table-column prop="ddd" label="报价人" />
              <el-table-column prop="eee" label="报价时间" />
              <el-table-column prop="fff" label="审批状态" />
            </el-table>
            <!-- <div style="margin-bottom: 10px">报价日期： 2023-08-28 12:19:30</div>
            <el-table size="small" :data="tableData1" style="width: 100%; margin-bottom: 20px" max-height="190"
              :header-cell-style="{ background: '#f5f7fa' }">
              <el-table-column type="index" label="序号" />
              <el-table-column prop="aaa" label="配件总价" />
              <el-table-column prop="bbb" label="最终价格" />
              <el-table-column prop="ccc" label="折扣率" />
              <el-table-column prop="ddd" label="报价人" />
              <el-table-column prop="eee" label="报价时间" />
              <el-table-column prop="fff" label="审批状态" />
            </el-table> -->
          </div>
        </el-collapse-item>
        <el-collapse-item title="流转信息" name="4">
          <el-timeline>
            <el-timeline-item center timestamp="2023-08-24 10:30:23" placement="top">
              <el-card>
                <h4>审批人：xxxx</h4>
                <p>审批结果：xxxxx</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item center timestamp="2023-08-23 12:34:26" placement="top">
              <el-card>
                <h4>审批人：xxxx</h4>
                <p>审批结果：xxxxx</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-collapse-item>
        <el-collapse-item title="服务报告信息" name="5">
          <el-descriptions class="margin-top" :column="2" border size="small">
            <el-descriptions-item>
              <template #label>开始维修时间</template>
              2023-08-23 12:34:26
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>结束维修时间</template>
              2023-08-26 08:34:26
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>维修描述</template>
              {{ form.TaskID }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>是否xxx</template>
              是
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>Q1</template>
              xxxxxxxxx
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>Q2</template>
              xxxxxxxxx
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>Q3</template>
              xxxxxxxxx
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>Q4</template>
              xxxxxxxxx
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>Q5</template>
              xxxxxxxxx
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>Q6</template>
              xxxxxxxxx
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>Q6</template>
              xxxxxxxxx
            </el-descriptions-item>
          </el-descriptions>
          <p>Parts & Labor消耗情况</p>
          <el-table
            size="small"
            :data="tableData"
            style="width: 100%; margin-bottom: 20px"
            max-height="200"
            :header-cell-style="{ background: '#f5f7fa' }"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column prop="date" label="配件/Labor料号" />
            <el-table-column prop="name" label="单位" />
            <el-table-column prop="aaa" label="单价" />
            <el-table-column prop="sss" label="实际消耗数量" />
            <el-table-column prop="address" label="总价" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="附件信息" name="6">
          <span>服务报告附件</span>
          <el-table
            size="small"
            :data="annexData"
            style="width: 100%; margin-top: 10px; margin-bottom: 20px"
            max-height="220"
            :header-cell-style="{ background: '#f5f7fa' }"
          >
            <el-table-column prop="name" label="文件名称" />
            <el-table-column prop="dateTime" label="上传时间" />
            <el-table-column label="操作" class-name="small-padding fixed-width" width="100">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleDownloadFile(row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <span>收费确认单附件</span>
          <el-table
            size="small"
            :data="annexData"
            style="width: 100%; margin-top: 10px; margin-bottom: 20px"
            max-height="220"
            :header-cell-style="{ background: '#f5f7fa' }"
          >
            <el-table-column prop="name" label="文件名称" />
            <el-table-column prop="dateTime" label="上传时间" />
            <el-table-column label="操作" class-name="small-padding fixed-width" width="100">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleDownloadFile(row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <span>补充审批材料</span>
          <el-table
            size="small"
            :data="annexData"
            style="width: 100%; margin-top: 10px"
            max-height="220"
            :header-cell-style="{ background: '#f5f7fa' }"
          >
            <el-table-column prop="name" label="文件名称" />
            <el-table-column prop="dateTime" label="上传时间" />
            <el-table-column label="操作" class-name="small-padding fixed-width" width="100">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleDownloadFile(row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <span>报价确认单附件</span>
          <el-table
            size="small"
            :data="annexData"
            style="width: 100%; margin-top: 10px"
            max-height="220"
            :header-cell-style="{ background: '#f5f7fa' }"
          >
            <el-table-column prop="name" label="文件名称" />
            <el-table-column prop="dateTime" label="上传时间" />
            <el-table-column label="操作" class-name="small-padding fixed-width" width="100">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleDownloadFile(row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
        <!-- <el-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('common.confirm') }}</el-button> -->
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

const activeNames = ref(['1'])
const tableData = [
  {
    date: '1',
    name: 'xxx',
    aaa: '92',
    sss: '2',
    address: '322',
  },
  {
    date: '3',
    name: 'xxx',
    aaa: '67',
    sss: '2',
    address: '13676',
  },
  {
    date: '2',
    name: 'xxx',
    aaa: '45',
    sss: '2',
    address: '2324',
  },
  {
    date: '25',
    name: 'xxx',
    aaa: '24',
    sss: '2',
    address: '34534',
  },
]
const tableData1 = [
  // {
  //   aaa: '50856.00',
  //   bbb: '41369.60',
  //   ccc: '80%',
  //   ddd: 'xxx',
  //   eee: '2023-08-22 09:11:23',
  //   fff: '已通过',
  // },
  {
    aaa: '101712.00',
    bbb: '81369.60',
    ccc: '80%',
    ddd: 'xxx',
    eee: '2023-08-24 09:11:23',
    fff: '已通过',
  },
]
const annexData = [
  { name: '文件1', id: 1, dateTime: '2023-08-23' },
  { name: '香香', id: 2, dateTime: '2023-08-01' },
]
// const loading = ref(false)
const form = ref({})
watch(
  () => props.modelValue,
  v => {
    if (v) {
      if (props.data) {
        form.value = props.data
      }
    }
  },
  { immediate: true }
)
const getSummaries = param => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    const values = data.map(item => Number(item[column.property]))
    if (column.property === 'address') {
      sums[index] = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
    }
  })
  for (let i = 0; i < sums.length; i++) {
    if (!isNaN(sums[i])) {
      sums[i] = sums[i].toFixed(2)
    }
  }
  // zong.value = sums
  // formData.value.totalVal = zong.value[4]
  return sums
}

const handleClose = () => {
  activeNames.value = ['1']
  emit('update:modelValue', false)
}
// const handleConfirm = () => {
//   formRef.value.validate(valid => {
//     if (valid) {
//       // form.value.value = form.value.category
//       // loading.value = true
//       // req[form.value.dictId ? 'put' : 'post']('/dict', form.value)
//       //   .then(({ code }) => {
//       //     if (code === 200) {
//       //       emit('success')
//       //       emit('update:modelValue', false)
//       //     }
//       //   })
//       //   .finally(() => {
//       //     loading.value = false
//       //   })
//     }
//   })
// }
// const mitter = useMitt()
// const handleDownloadFile = () => {
//   mitter.emit('query-refresh')
// }
</script>
<style scoped>
.demo-collapse :deep(.el-collapse-item__header) {
  font-size: 14px;
  font-weight: bold;
}

/* .query-detail-dialog .el-dialog__body {
  padding: 0;
} */
</style>
