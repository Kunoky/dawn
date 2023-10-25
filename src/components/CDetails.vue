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
      <el-collapse v-model="activeNames" v-loading="dataLoading">
        {{ props.data.status }}
        <el-collapse-item title="基础信息" name="1">
          <el-descriptions class="margin-top" :column="3" border size="small">
            <el-descriptions-item>
              <template #label>维修任务号</template>
              {{ form.TaskID }}
            </el-descriptions-item>
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
              <template #label>客户单位名称</template>
              {{ form.custDesc }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>客户编号</template>
              {{ form.customerId }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>客户锁信息</template>
              TC锁
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>仪器地址</template>
              {{ form.eee }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>客户联系人</template>
              {{ form.name }}
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
              <template #label>FSE工程师名称</template>
              {{ form.transferFseName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>FSE work center</template>
              {{ form.transferWorkCenter }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>FSE storage location</template>
              {{ form.transferStorageLocation }}
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
        </el-collapse-item>
        <el-collapse-item title="Parts Plan & Labor" name="2">
          <div>
            <el-table
              size="small"
              :data="itemList"
              style="width: 100%; margin-bottom: 20px"
              max-height="190"
              :header-cell-style="{ background: '#f5f7fa' }"
              show-summary
              :summary-method="getSummaries"
            >
              <el-table-column prop="materialNo" label="配件/Labor料号" />
              <el-table-column prop="unit" label="单位" />
              <el-table-column prop="unitPrice" label="单价" />
              <el-table-column prop="quantity" label="配件/Labor数量" />
              <el-table-column prop="subTotal" label="总价" />
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="报价信息" name="3">
          <div style="margin-bottom: 10px">报价编号：{{ quoteData?.quoteNo }}</div>
          <el-table
            size="small"
            :data="quoteData?.quoteDetailList"
            style="width: 100%; margin-bottom: 20px"
            max-height="190"
            :header-cell-style="{ background: '#f5f7fa' }"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column prop="materialNo" label="配件/Labor料号" />
            <el-table-column prop="unit" label="单位" />
            <el-table-column prop="includeTaxPrice" label="含税价格" />
            <el-table-column prop="quantity" label="配件/Labor数量" />
            <el-table-column prop="subTotal" label="总价" />
          </el-table>
          <div>
            <el-table
              size="small"
              :data="[quoteData?.quoteSummary]"
              style="width: 100%; margin-bottom: 20px"
              max-height="190"
              :header-cell-style="{ background: '#f5f7fa' }"
            >
              <el-table-column type="index" label="序号" />
              <el-table-column prop="quotePrice" label="配件总价" />
              <el-table-column prop="finalPrice" label="最终价格" />
              <el-table-column prop="discountRate" label="折扣率" />
              <el-table-column prop="quoteName" label="报价人" />
              <el-table-column prop="quoteTime" label="报价时间" />
              <el-table-column prop="approveStatus" label="审批状态">
                <template #default="{ row }">
                  <span>
                    {{ row?.approveStatus === 0 ? '未审批' : row?.approveStatus === 1 ? '审批通过' : '审批拒绝' }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <p class="p">发票信息：</p>
          <el-descriptions class="margin-top" :column="3" border size="small">
            <el-descriptions-item>
              <template #label>发票抬头</template>
              {{ quoteData?.invoiceInfo?.companyName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>收件人</template>
              {{ quoteData?.invoiceInfo?.recipient }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>联系电话</template>
              {{ quoteData?.invoiceInfo?.tel }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>开户行</template>
              {{ quoteData?.invoiceInfo?.bankName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>开户行账号</template>
              {{ quoteData?.invoiceInfo?.bankAccount }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>税号</template>
              {{ quoteData?.invoiceInfo?.taxNo }}
            </el-descriptions-item>
            <el-descriptions-item :span="3">
              <template #label>注册地址及电话</template>
              {{ quoteData?.invoiceInfo?.registeredAddress }}
            </el-descriptions-item>
            <el-descriptions-item :span="3">
              <template #label>特殊要求</template>
              {{ quoteData?.invoiceInfo?.remark }}
            </el-descriptions-item>
          </el-descriptions>
          <p class="p">沟通记录：</p>
          <el-table
            size="small"
            :data="quoteData?.quoteCommunicationList"
            style="width: 100%; margin-bottom: 10px"
            :header-cell-style="{ background: '#f5f7fa' }"
          >
            <el-table-column prop="custName" label="沟通人" />
            <el-table-column prop="communicationTime" label="时间" />
            <el-table-column prop="content" label="结果" />
          </el-table>
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
        <!-- {{ props.data.status }}
        {{ only }} -->
        <!-- TODO so状态 需修改 -->
        <el-collapse-item
          v-if="props.data.status !== 3 && props.data.status !== 4 && props.data.status !== 5 && only !== 'shipped'"
          title="服务报告信息"
          name="5"
        >
          <el-descriptions class="margin-top" :column="2" border size="small">
            <el-descriptions-item>
              <template #label>开始维修时间</template>
              {{ serviceReport?.reportBaseInfo?.startTime }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>结束维修时间</template>
              {{ serviceReport?.reportBaseInfo?.endTime }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>维修描述</template>
              {{ serviceReport?.reportBaseInfo?.content }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>是否草稿标识</template>
              {{ serviceReport?.reportBaseInfo?.draftFlag === 1 ? '是' : '否' }}
            </el-descriptions-item>
            <div v-if="serviceReport?.reportBaseInfo?.draftFlag === 1">
              <el-descriptions-item :span="2">
                <template #label>Q1</template>
                {{ serviceReport?.reportBaseInfo.startTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="2">
                <template #label>Q2</template>
                {{ serviceReport?.reportBaseInfo.startTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="2">
                <template #label>Q3</template>
                {{ serviceReport?.reportBaseInfo.startTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="2">
                <template #label>Q4</template>
                {{ serviceReport?.reportBaseInfo.startTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="2">
                <template #label>Q5</template>
                {{ serviceReport?.reportBaseInfo.startTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="2">
                <template #label>Q6</template>
                {{ serviceReport?.reportBaseInfo.startTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="2">
                <template #label>Q6</template>
                {{ serviceReport?.reportBaseInfo.startTime }}
              </el-descriptions-item>
            </div>
          </el-descriptions>
          <p>Parts & Labor消耗情况</p>
          <el-table
            size="small"
            :data="serviceReport?.itemConsumptionList"
            style="width: 100%; margin-bottom: 20px"
            max-height="200"
            :header-cell-style="{ background: '#f5f7fa' }"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column prop="itemNo" label="配件/Labor料号" />
            <el-table-column prop="name" label="单位" />
            <el-table-column prop="unitPrice" label="单价" />
            <el-table-column prop="quantity" label="实际消耗数量" />
            <el-table-column prop="subTotal" label="总价" />
          </el-table>
        </el-collapse-item>
        <el-collapse-item title="附件信息" name="6" v-if="only !== 'shipped'">
          <div v-for="(val, idx) in attachmentList" :key="idx">
            <span>{{ attachmentType.kv[val.type] }}</span>
            <el-table
              size="small"
              :data="val.dataList"
              style="width: 100%; margin-top: 10px; margin-bottom: 20px"
              max-height="220"
              :header-cell-style="{ background: '#f5f7fa' }"
            >
              <el-table-column prop="fileName" label="文件名称" />
              <el-table-column prop="createTime" label="上传时间" />
              <el-table-column prop="createByName" label="上传人" />
              <el-table-column label="操作" class-name="small-padding fixed-width" width="100">
                <template #default="{ row }">
                  <el-button type="primary" link @click="handleDownloadFile(row)">下载</el-button>
                  <el-button type="primary" v-if="row.createBy === user.userId" link @click="handleDel(row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="only !== 'shipped'" title="工作日志" name="7">
          <el-descriptions class="margin-top" :column="3" border size="small">
            <el-descriptions-item>
              <template #label>工作时长</template>
              {{ workLogList?.workHour }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>开始时间</template>
              {{ workLogList?.startTime }}
            </el-descriptions-item>
            <el-descriptions-item :span="3">
              <template #label>结束时间</template>
              {{ workLogList?.endTime }}
            </el-descriptions-item>
            <el-descriptions-item :span="3">
              <template #label>工作过程</template>
              {{ workLogList?.content }}
            </el-descriptions-item>
            <el-descriptions-item :span="3">
              <template #label>服务描述</template>
              {{ workLogList?.shortDescription }}
            </el-descriptions-item>
            <el-descriptions-item :span="3">
              <template #label>服务描述</template>
              {{ workLogList?.longDescription }}
            </el-descriptions-item>
          </el-descriptions>
          <p>Parts & Labor消耗情况</p>
          <el-table
            size="small"
            :data="workLogList?.itemConsumptionList"
            style="width: 100%; margin-bottom: 20px"
            max-height="200"
            :header-cell-style="{ background: '#f5f7fa' }"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column prop="itemNo" label="配件/Labor料号" />
            <el-table-column prop="name" label="单位" />
            <el-table-column prop="unitPrice" label="单价" />
            <el-table-column prop="quantity" label="实际消耗数量" />
            <el-table-column prop="subTotal" label="总价" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const emit = defineEmits(['update:modelValue', 'success'])
const props = defineProps({
  data: Object,
  modelValue: Boolean,
  only: String,
})
const attachmentType = useDict('attachmentType')
const repairSource = useDict('repairSource')

const activeNames = ref(['1'])
const form = ref({})
const itemList = ref([])
const quoteData = ref({})
const transferLogList = ref([]) //流转信息
const serviceReport = ref([])
const attachmentList = ref([])
const workLogList = ref([])
watch(
  () => props.modelValue,
  v => {
    if (v) {
      props.data?.soNo && getInfo()
    }
  },
  { immediate: true }
)
const { run: getInfo, loading: dataLoading } = useAsync(
  async () => {
    return req.get(`/so/info/${props.data.soNo}`)
  },
  {
    onSuccess(res) {
      form.value = res.data.serviceOrderBaseInfo
      itemList.value = res.data.itemList
      quoteData.value = res.data.quoteData
      transferLogList.value = res.data.transferLogList
      serviceReport.value = res.data.serviceReport
      attachmentList.value = res.data.attachmentList
      workLogList.value = res.data.workLogList
    },
  }
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
    if (column.property === 'subTotal') {
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

const handleDownloadFile = () => {
  // req.post('/so/export', tableRef.value.form, { responseType: 'blob' }).then(response => {
  //   if (response) {
  //     const elink = document.createElement('a')
  //     elink.style.display = 'none'
  //     const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  //     const blobUrl = URL.createObjectURL(blob)
  //     elink.href = blobUrl
  //     elink.download = 'so数据'
  //     document.body.appendChild(elink)
  //     elink.click()
  //     document.body.removeChild(elink)
  //   }
  // })
}
const handleDel = row => {
  req.delete('attachment/' + row.id).then(() => {
    getInfo()
  })
}
</script>
<style scoped>
.demo-collapse :deep(.el-collapse-item__header) {
  font-size: 14px;
  font-weight: bold;
}

.p {
  margin: 20px 0 0;
}
</style>
