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
        <el-collapse-item title="基础信息" name="1">
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
              {{ form.customerLockName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>仪器地址</template>
              {{ form.equipAddress }}
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
              <template #label>工程师名称</template>
              {{ form.fseName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>FSE work center</template>
              {{ form.fseWorkCenter }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>FSE storage location</template>
              {{ form.fseStorageLocation }}
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
              <template #label>所属区域</template>
              {{ regionalStatus.kv[form.area] }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>是否CRC</template>
              {{ bool.kv[form.isCrc] }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>PO号</template>
              {{ form.po }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>是否Promotio</template>
              {{ bool.kv[form.isPromotion] }}
            </el-descriptions-item>
            <el-descriptions-item v-if="form.isPromotion">
              <template #label>promotionCode</template>
              {{ form.promotionCode }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>报修内容</template>
              {{ form.content }}
            </el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item v-if="itemList.length > 0" title="Parts Plan & Labor" name="2">
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
        <el-collapse-item v-if="quoteData" title="报价信息" name="3">
          <div style="margin-bottom: 10px">报价编号：{{ quoteData.quoteNo }}</div>
          <el-table
            size="small"
            :data="quoteData.quoteDetailList"
            style="width: 100%; margin-bottom: 20px"
            max-height="190"
            :header-cell-style="{ background: '#f5f7fa' }"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column label="报价明细" align="center">
              <el-table-column prop="materialNo" label="配件/Labor料号" />
              <el-table-column prop="unit" label="单位" />
              <el-table-column prop="includeTaxPrice" label="含税价格" />
              <el-table-column prop="quantity" label="配件/Labor数量" />
              <el-table-column prop="subTotal" label="总价" />
            </el-table-column>
          </el-table>
          <div>
            <el-table
              size="small"
              :data="quoteData === null ? [] : [quoteData.quoteSummary]"
              style="width: 100%; margin-bottom: 20px"
              max-height="190"
              :header-cell-style="{ background: '#f5f7fa' }"
            >
              <el-table-column label="汇总" align="center">
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
              </el-table-column>
            </el-table>
          </div>
          <p class="p">发票信息</p>
          <el-descriptions class="margin-top" :column="3" border size="small">
            <el-descriptions-item>
              <template #label>发票类型</template>
              {{
                quoteData.invoiceInfo?.invoiceType === 1
                  ? '普票'
                  : quoteData.invoiceInfo?.invoiceType === 2
                  ? '专票'
                  : ''
              }}
            </el-descriptions-item>
            <el-descriptions-item v-if="quoteData.invoiceInfo?.invoiceType === 1">
              <template #label>邮箱</template>
              {{ quoteData.invoiceInfo?.recipientEmail }}
            </el-descriptions-item>
            <el-descriptions-item v-if="quoteData.invoiceInfo?.invoiceType === 2">
              <template #label>地址</template>
              {{ quoteData.invoiceInfo?.mailingAddress }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>发票抬头</template>
              {{ quoteData.invoiceInfo?.companyName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>收件人</template>
              {{ quoteData.invoiceInfo?.recipient }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>联系电话</template>
              {{ quoteData.invoiceInfo?.tel }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>开户行</template>
              {{ quoteData.invoiceInfo?.bankName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>开户行账号</template>
              {{ quoteData.invoiceInfo?.bankAccount }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>税号</template>
              {{ quoteData.invoiceInfo?.taxNo }}
            </el-descriptions-item>
            <el-descriptions-item :span="3">
              <template #label>注册地址及电话</template>
              {{ quoteData.invoiceInfo?.registeredAddress }}
            </el-descriptions-item>
            <el-descriptions-item :span="3">
              <template #label>特殊要求</template>
              {{ quoteData.invoiceInfo?.remark }}
            </el-descriptions-item>
          </el-descriptions>
          <el-table
            size="small"
            :data="quoteData.quoteCommunicationList"
            style="width: 100%; margin-bottom: 10px"
            :header-cell-style="{ background: '#f5f7fa' }"
          >
            <el-table-column label="沟通记录" align="center">
              <el-table-column prop="custName" label="沟通人" />
              <el-table-column prop="communicationTime" label="时间" />
              <el-table-column prop="content" label="结果" width="300" :show-overflow-tooltip="true" />
              <el-table-column prop="pendingStatus" label="Pending状态">
                <template #default="{ row }">
                  {{ pendingStatus.kv[row.pendingStatus] }}
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item v-if="transferLogList !== null && transferLogList.length > 0" title="流转信息" name="4">
          <el-timeline class="timeline">
            <el-timeline-item
              v-for="(item, index) in transferLogList"
              :key="index"
              center
              :timestamp="item.approvalDate"
              placement="top"
            >
              <el-card>
                <h4>审批人：{{ item.approve }}</h4>
                <p>审批状态：{{ item.approvalStatus }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-collapse-item>
        <el-collapse-item v-if="serviceReport !== null && serviceReport.length > 0" title="服务报告信息" name="5">
          <div v-for="(item, index) in serviceReport" :key="index" class="workLogList">
            <el-descriptions class="margin-top" :column="2" border size="small">
              <el-descriptions-item>
                <template #label>工程师名称</template>
                {{ item.createByName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>开始维修时间</template>
                {{ item.startTime }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>结束维修时间</template>
                {{ item.endTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="2">
                <template #label>维修描述</template>
                {{ item.content }}
              </el-descriptions-item>
              <el-descriptions-item :span="2">
                <template #label>是否草稿标识</template>
                {{ item.draftFlag ? '是' : '否' }}
              </el-descriptions-item>
            </el-descriptions>
            <el-table
              size="small"
              :data="item.materialList"
              style="width: 100%; margin-bottom: 20px"
              max-height="200"
              :header-cell-style="{ background: '#f5f7fa' }"
              show-summary
              :summary-method="getSummaries"
            >
              <el-table-column label="Parts消耗情况" align="center">
                <el-table-column prop="materialNo" label="料号" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="unitPrice" label="单价" />
                <el-table-column prop="quantity" label="实际消耗数量" />
                <el-table-column prop="subTotal" label="总价" />
              </el-table-column>
            </el-table>
            <el-table
              size="small"
              :data="item.laborList"
              style="width: 100%; margin-bottom: 20px"
              max-height="200"
              :header-cell-style="{ background: '#f5f7fa' }"
              show-summary
              :summary-method="getSummaries"
            >
              <el-table-column label="Labor消耗情况" align="center">
                <el-table-column prop="materialNo" label="料号" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="unitPrice" label="单价" />
                <el-table-column prop="quantity" label="实际消耗数量" />
                <el-table-column prop="subTotal" label="总价" />
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="attachmentList !== null && attachmentList.length > 0" title="附件信息" name="6">
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
        <el-collapse-item v-if="workLogList !== null && workLogList.length > 0" title="工作日志" name="7">
          <div v-for="(item, index) in workLogList" :key="index" class="workLogList">
            <el-descriptions class="margin-top" :column="3" border size="small">
              <el-descriptions-item>
                <template #label>工程师姓名</template>
                {{ item?.createByName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>开始时间</template>
                {{ item?.startTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="3">
                <template #label>结束时间</template>
                {{ item?.endTime }}
              </el-descriptions-item>
              <el-descriptions-item :span="3">
                <template #label>工作过程</template>
                {{ item?.content }}
              </el-descriptions-item>
              <el-descriptions-item :span="3">
                <template #label>服务描述（英文）</template>
                {{ item?.longDescription }}
              </el-descriptions-item>
            </el-descriptions>
            <el-table
              size="small"
              :data="item?.lockMaterialList"
              style="width: 100%; margin-bottom: 20px"
              max-height="200"
              :header-cell-style="{ background: '#f5f7fa' }"
              show-summary
              :summary-method="getSummaries"
            >
              <el-table-column label="配件消耗情况" align="center">
                <el-table-column prop="materialNo" label="物料号" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="unitPrice" label="单价" />
                <el-table-column prop="itemName" label="名称" />
                <el-table-column prop="quantity" label="实际消耗数量" />
                <el-table-column prop="itemType" label="消耗类型">
                  <template #default="{ row }">{{ MaterialConsumptionType.kv[row.itemType] }}</template>
                </el-table-column>
                <el-table-column prop="subTotal" label="总价" />
              </el-table-column>
            </el-table>
            <el-table
              size="small"
              :data="item?.lockLaborList"
              style="width: 100%; margin-bottom: 20px"
              max-height="200"
              :header-cell-style="{ background: '#f5f7fa' }"
            >
              <el-table-column label="工时" align="center">
                <el-table-column prop="aty" label="工时种类" />
                <el-table-column prop="materialNo" label="物料号" />
                <el-table-column prop="itemName" label="描述" />
                <el-table-column prop="itemName" label="Labor类型">
                  <template #default="{ row }">
                    {{ laborType.kv[row.laborType] }}
                  </template>
                </el-table-column>
                <el-table-column prop="workHour" label="工作时长(小时)" />
              </el-table-column>
            </el-table>
          </div>
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
const laborType = useDict('laborType')
const MaterialConsumptionType = useDict('MaterialConsumptionType')
const pendingStatus = useDict('pendingStatus')
const regionalStatus = useDict('regionalStatus') // 区域
const bool = useDict('bool')

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

const handleDownloadFile = row => {
  let fileName = attachmentType.value.kv[row.type]
  if (row.path) {
    const link = document.createElement('a')
    //_blank表示在新窗口打开链接
    // link.target = '_blank'
    link.href = import.meta.env.VITE_SERVER_PATH + row.path
    link.setAttribute('download', fileName) // 下载文件的名称及文件类型后缀
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // 下载完成移除元素
  }
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

.margin-top {
  margin-bottom: 20px;
}
.margin-top :deep(.el-descriptions__label) {
  width: 130px;
}
.workLogList {
  border: 1px solid #ccc;
  border-radius: 5px;
  /* padding: 0 10px; */
  margin-bottom: 10px;
}

.workLogList .title {
  font-size: 12px;
}
.timeline :deep(.el-timeline-item__content) .el-card__body {
  padding: 10px 20px;
}
.timeline :deep(.el-timeline-item__content) .el-card__body p {
  margin: 5px 0 0;
}
</style>
