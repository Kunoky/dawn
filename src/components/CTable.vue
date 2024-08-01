<template>
  <div class="c-table" :id="id" ref="cTableRef">
    <el-form
      v-if="showQuery"
      :inline="true"
      v-bind="formConf"
      :model="form"
      @keydown.enter="handleQuery"
      class="c-table__form"
      ref="formRef"
    >
      <slot name="form" :form="form"></slot>
      <el-form-item class="btns">
        <el-button type="primary" @click="handleQuery" :loading="pageRef?.loading">{{ $t('common.query') }}</el-button>
        <el-button @click="handleQueryReset" :disabled="pageRef?.loading">{{ $t('common.reset') }}</el-button>
        <el-button v-if="$slots.moreForm" @click="visible.moreForm = !visible.moreForm">
          {{ visible.moreForm ? $t('common.collapse') : $t('common.expand') }}
        </el-button>
      </el-form-item>
      <div v-if="visible.moreForm" class="pt-a lt-0 bgc-1 zi-9 bs-s pdh-m">
        <slot name="moreForm" :form="form"></slot>
      </div>
    </el-form>
    <div class="c-table__main" @mouseenter="hideMoreForm">
      <div v-if="toolStatus.bar" ref="toolbarRef" class="c-table__toolbar">
        <div v-if="toolStatus.title" class="c-table__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div class="c-table__actions">
          <slot name="actions"></slot>
          <el-tooltip v-if="toolStatus.search && $slots.form" :content="$t('common.query')" placement="top">
            <el-button link @click="showQuery = !showQuery" :aria-description="$t('common.query')">
              <template #icon>
                <i-ep-search />
              </template>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="toolStatus.download" :content="$t('common.export')" placement="top">
            <el-button link @click="handleExport" :aria-description="$t('common.export')" :loading="exportForm.loading">
              <template #icon>
                <i-ep-download />
              </template>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="toolStatus.refresh" :content="$t('common.refresh')" placement="top">
            <el-button link @click="refresh" :aria-description="$t('common.refresh')">
              <template #icon>
                <i-ep-refresh />
              </template>
            </el-button>
          </el-tooltip>
          <CDropdown
            v-if="toolStatus.size"
            v-model="tableSize"
            :options="$tm('component.CTable.sizes')"
            trigger="click"
          >
            <el-button link :aria-description="$t('component.CTable.size')">
              <template #icon>
                <el-tooltip :content="$t('component.CTable.size')" placement="top">
                  <CIcon icon="ant-design:column-height-outlined" />
                </el-tooltip>
              </template>
            </el-button>
          </CDropdown>
          <el-tooltip v-if="toolStatus.save && id" :content="$t('component.CTable.save')" placement="top">
            <el-button link @click="handleSave" :aria-description="$t('component.CTable.save')">
              <template #icon>
                <CIcon icon="ant-design:save-outlined" />
              </template>
            </el-button>
          </el-tooltip>
          <el-popover v-if="toolStatus.setting" trigger="click" width="240" popper-class="c-table__setting">
            <template #reference>
              <el-button link :aria-description="$t('component.CTable.setting')">
                <template #icon>
                  <el-tooltip :content="$t('component.CTable.setting')" placement="top">
                    <i-ep-setting />
                  </el-tooltip>
                </template>
              </el-button>
            </template>
            <div>
              <h4>
                <el-checkbox
                  v-model="columnCheckAll"
                  @change="handleColumnCheckAll"
                  :indeterminate="columnIndeterminate"
                ></el-checkbox>
                {{ $t('component.CTable.display') }}
                <el-button link type="primary" @click="handleColReset">
                  <b>{{ $t('common.reset') }}</b>
                </el-button>
              </h4>
              <template v-for="(i, idx) in columnsOptions" :key="i.label">
                <template v-if="i.children.length">
                  <div v-if="i.children.length < Object.keys(columnsSetting).length" class="group-title">
                    {{ $t('component.CTable.' + i.label) }}
                  </div>

                  <Draggable
                    tag="ul"
                    :list="i.children"
                    group="col"
                    handle=".handle"
                    item-key="prop"
                    @update="handleDragUpdate"
                    @add="handleDragAdd"
                    :data-idx="idx"
                  >
                    <template #item="{ element }">
                      <li>
                        <span class="left">
                          <CIcon v-if="i.children.length > 1" icon="ant-design:bars-outlined" class="handle" />
                          <el-checkbox v-model="element.isShow">{{ element.label }}</el-checkbox>
                        </span>
                        <span class="right">
                          <el-tooltip
                            v-if="element.props.fixed !== 'left'"
                            :content="$t('component.CTable.pinLeft')"
                            placement="top"
                          >
                            <CIcon
                              icon="ant-design:vertical-align-top-outlined"
                              @click="element.props.fixed = 'left'"
                            />
                          </el-tooltip>
                          <el-tooltip
                            v-if="element.props.fixed"
                            :content="$t('component.CTable.unpin')"
                            placement="top"
                          >
                            <CIcon
                              icon="ant-design:vertical-align-middle-outlined"
                              @click="element.props.fixed = false"
                            />
                          </el-tooltip>
                          <el-tooltip
                            v-if="element.props.fixed !== 'right'"
                            :content="$t('component.CTable.pinRight')"
                            placement="top"
                          >
                            <CIcon
                              icon="ant-design:vertical-align-bottom-outlined"
                              @click="element.props.fixed = 'right'"
                            />
                          </el-tooltip>
                        </span>
                      </li>
                    </template>
                  </Draggable>
                </template>
              </template>
            </div>
          </el-popover>
        </div>
        <c-dialog v-bind="$ElConfig.dialog" v-model="visible.export" :title="$t('common.export')">
          <div>
            {{ $t('common.total') }}:
            <span class="cl-p">{{ exportForm.total }}</span>
          </div>
          <div class="mgt-s">
            {{ $t('common.page') }}:
            <el-input-number v-model="exportForm.page" :min="1" :precision="0" />
          </div>
          <div class="mgt-s">
            {{ $t('common.size') }}:
            <el-input-number v-model="exportForm.size" :min="1" :max="exportForm.total" :precision="0" />
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="visible.export = false">{{ $t('common.cancel') }}</el-button>
              <el-button type="primary" @click="exportData">{{ $t('common.confirm') }}</el-button>
            </span>
          </template>
        </c-dialog>
      </div>
      <PageWrapper ref="pageRef" v-bind="pageConf" :params="mergedParams" :default-size="defaultSize">
        <template v-slot="{ data, loading }">
          <el-table
            ref="tableRef"
            :data="data"
            v-loading="loading"
            :maxHeight="maxHeight"
            border
            v-bind="{ ...$attrs, class: null }"
            :default-sort="cachedOrder"
            :size="tableSize"
            @sort-change="handleSortChange"
          >
            <el-table-column v-if="modelValue" width="40" fixed="left">
              <template #header>
                <el-checkbox
                  :modelValue="isSelectAll"
                  :indeterminate="isIndeterminate"
                  @change="handleSelectAll"
                ></el-checkbox>
              </template>
              <template #default="{ row, $index }">
                <el-checkbox
                  :modelValue="modelValueKeys.includes(getKey(row))"
                  @change="handleSelect(row, $event)"
                  :disabled="selectable && !selectable(row, $index)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <FW :component="getColumns()"></FW>
            <template #append>
              <slot name="append"></slot>
            </template>
            <template #empty>
              <slot name="empty"></slot>
            </template>
          </el-table>
        </template>
      </PageWrapper>
    </div>
  </div>
</template>
<script setup>
import PageWrapper from './PageWrapper.vue'
import CDropdown from './CDropdown.vue'
import FW from './FW.jsx'
import Draggable from 'vuedraggable'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  // 选中数据, 添加modelValue即进入选择模式
  modelValue: {
    type: Array,
  },
  // modelValue默认返回row-key，设置后返回row
  fullValue: {
    type: Boolean,
    default: false,
  },
  // 分页容器设置
  pageConf: {
    type: Object,
    required: true,
  },
  // 查询表单设置
  formConf: Object,
  params: Object, // 请求参数
  defaultSort: Object,
  // 查询参数中排序字段键名, 传入方法时，需要返回排序参数对象，形如({ column, prop, order }) => ({ orderBy: '' })
  orderKey: {
    type: [String, Function],
    default: 'orderByColumn',
  },
  // 排序顺序字段
  orderVKey: {
    type: String,
    default: 'isAsc',
  },
  // 同table.column
  sortOrders: {
    type: Array,
    default() {
      return ['ascending', 'descending', null]
    },
  },
  // 默认尺寸
  size: {
    type: String,
    default: 'small',
  },
  title: String, // 标题
  id: String, // 组件id，提供时可以对form，columnSetting数据进行缓存
  // 工具栏状态
  toolStatus: {
    type: Object,
  },
  defaultForm: {
    type: Object,
    default: () => ({}),
  }, // 表单默认值
  fixedHeader: {
    type: Boolean,
    default: true,
  }, // 导出方法，(params) => Promise
  onExport: {
    type: [Function, String],
  },
  exportName: String, // 导出文件名
  exportPage: {
    type: Boolean,
    default: true,
  }, // 设置onExport后，导出是否分页
  // 是否可选 (row: any, index: number) => boolean
  selectable: {
    type: Function,
  },
})

const emit = defineEmits(['update:modelValue', 'query', 'reset'])

const mitter = useMitt()
mitter.on('main-size-change', updateHeight)
onBeforeUnmount(() => {
  mitter.off('main-size-change', updateHeight)
})
onMounted(() => {
  handleScroll()
})
const visible = reactive({
  export: false,
  moreForm: false,
})
const i18n = useI18n()
const cTableRef = ref()
const formRef = ref()
const toolbarRef = ref()
const pageRef = ref()
const tableRef = ref()
const tableSize = ref(props.size)
const refresh = () => pageRef.value.refresh()
const refreshCurrent = () => pageRef.value.run()

let cachedData = {
  value: {
    form: cloneDeep(props.defaultForm),
    columnsSetting: {},
    defaultSize: props.pageConf?.defaultSize || 10,
    showQuery: null,
    mergedParams: null,
    defaultOrder: undefined,
  },
}
const CACHE_KEY = 'c-table__' + props.id
if (props.id) {
  cachedData = useStorageC(CACHE_KEY, cachedData.value)
}
const defaultSize = ref(cachedData.value.defaultSize)

const form = reactive(cachedData.value.form)
const mergedParams = reactive(cachedData.value.mergedParams || { ...props.params, ...form })
const showQuery = ref(cachedData.value.showQuery === false ? false : !!useSlots().form)
const handleQuery = () => {
  // 回车事件
  if (pageRef.value.loading) return
  Object.assign(mergedParams, form)
  emit('query', mergedParams)
  // form未更改则不触发
  nextTick(() => {
    pageRef.value.loading || refresh()
  })
}
const handleQueryReset = () => {
  for (let k in form) {
    form[k] = null
  }
  Object.assign(form, cloneDeep(props.defaultForm))
  emit('reset')
  handleQuery()
}
let cachedOrder = ref(cachedData.value.defaultOrder)
const baseOrder = ['ascending', 'descending', null]
const handleSortChange = ({ column, prop, order }) => {
  if (column.sortable === 'custom') {
    if (order) {
      cachedOrder.value = {
        prop,
        order,
      }
    } else {
      cachedOrder.value = undefined
    }
    let orderBy
    if (typeof props.orderKey === 'function') {
      orderBy = props.orderKey({ column, prop, order })
      Object.assign(mergedParams, orderBy)
    } else {
      const idx = baseOrder.indexOf(order)
      // if (idx < 2) {
      //   orderBy = prop + ' ' + props.sortOrders[idx]
      // }
      // mergedParams[props.orderKey] = orderBy

      if (idx < 2) {
        mergedParams[props.orderKey] = prop
        mergedParams[props.orderVKey] = props.sortOrders[idx]
      } else {
        mergedParams[props.orderKey] = undefined
        mergedParams[props.orderKey] = undefined
      }
    }
  }
}
watch(
  () => props.params,
  v => {
    Object.assign(mergedParams, v)
  },
  { deep: true }
)

const columnsSetting = reactive(cachedData.value.columnsSetting)
const columnsOptions = computed(() => {
  const options = [
    {
      label: 'fixedLeft',
      children: [],
    },
    {
      label: 'notFixed',
      children: [],
    },
    {
      label: 'fixedRight',
      children: [],
    },
  ]
  const cols = Object.values(columnsSetting)
  cols.sort((a, b) => a.order - b.order)
  cols.forEach(i => {
    if (!i.props.fixed) {
      options[1].children.push(i)
    } else if (i.props.fixed === 'left') {
      options[0].children.push(i)
    } else {
      options[2].children.push(i)
    }
  })
  return options
})
const columnCheckAll = ref(true)
const columnIndeterminate = computed(() => {
  const cols = Object.values(columnsSetting)
  const checkCount = cols.filter(i => i.isShow).length
  return checkCount > 0 && checkCount < cols.length
})
const handleColumnCheckAll = v => {
  if (columnIndeterminate.value) {
    v = true
    columnCheckAll.value = v
  }
  Object.values(columnsSetting).forEach(i => {
    i.isShow = v
  })
}
const handleSyncColumns = runTimeColumns => {
  runTimeColumns.forEach((i, idx) => {
    if (i.props?.prop) {
      columnsSetting[i.props.prop] ||= { isShow: true, order: idx, props: {} }
      columnsSetting[i.props.prop].label = i.props.label
    }
  })
}

const getColumns = () => {
  let cols = []
  useSlots()
    .default()
    .forEach(i => {
      if (typeof i.type === 'symbol') {
        if (Array.isArray(i.children)) {
          cols.push(...i.children)
        }
      } else {
        cols.push(i)
      }
    })
  if (!toolStatus.value.setting) return cols
  handleSyncColumns(cols)
  cols = cols.filter(i => {
    if (i.props?.prop) {
      const conf = columnsSetting[i.props.prop]
      if (!conf?.isShow) return false
      Object.assign(i.props, conf.props)
      i.order = conf.order
      i.key ??= i.props.prop
    }
    return true
  })
  cols.sort((a, b) => a.order - b.order)
  return cols
}
const handleDragUpdate = ({ target }) => {
  const pIdx = target.dataset.idx

  columnsOptions.value[pIdx].children.forEach((i, idx) => {
    i.order = idx
  })
}
const handleDragAdd = ({ newIndex, to }) => {
  const toIdx = to.dataset.idx
  columnsOptions.value[toIdx].children.forEach((i, idx) => {
    i.order = idx
    if (idx === newIndex) {
      i.props.fixed = ['left', false, 'right'][toIdx]
    }
  })
}
const handleColReset = () => {
  Object.values(columnsSetting).forEach(i => {
    i.isShow = true
    i.order = 0
    i.props = {}
  })
}
const handleSave = () => {
  cachedData.value = {
    form,
    columnsSetting,
    defaultSize: pageRef.value.size,
    showQuery: showQuery.value,
    mergedParams,
    defaultOrder: cachedOrder.value,
  }
  ElMessage.success(i18n.t('tip.success'))
}

const attrs = useAttrs()
const { getNestProp } = utils
const rowKey = attrs.rowKey || attrs['row-key']
if (props.modelValue && !rowKey) {
  console.error('A "row-key" is required when "modelValue" is set!')
}
let getKey
if (typeof rowKey === 'function') {
  getKey = rowKey
} else {
  getKey = row => getNestProp(row, rowKey)
}
const allKeys = computed(() => {
  return pageRef.value.data?.map(i => getKey(i)) || []
})
const modelValueKeys = computed(() => {
  if (!props.modelValue) return []
  if (props.fullValue) {
    return props.modelValue.map(i => getKey(i))
  }
  return props.modelValue
})
const isIndeterminate = computed(() => {
  let checkedCount = 0
  allKeys.value.forEach(i => {
    if (modelValueKeys.value.includes(i)) checkedCount++
  })
  return checkedCount > 0 && checkedCount < allKeys.value.length
})
const addValues = values => {
  let list = []
  if (props.fullValue) {
    list = [...props.modelValue]
    values.forEach(i => {
      if (!modelValueKeys.value.includes(getKey(i))) {
        list.push(i)
      }
    })
  } else {
    list = Array.from(new Set([...props.modelValue, ...values.map(i => getKey(i))]))
  }
  emit('update:modelValue', list)
}
const removeValues = values => {
  const keys = values.map(i => getKey(i))
  const list = props.modelValue.filter(i => !keys.includes(props.fullValue ? getKey(i) : i))
  emit('update:modelValue', list)
}
const handleSelect = (row, checked) => {
  if (checked) {
    addValues([row])
  } else {
    removeValues([row])
  }
}
const handleSelectAll = v => {
  if (v) {
    addValues(props.selectable ? pageRef.value.data.filter((i, idx) => props.selectable(i, idx)) : pageRef.value.data)
  } else {
    removeValues(pageRef.value.data)
  }
}

const isSelectAll = computed(() => allKeys.value.length && allKeys.value.every(i => modelValueKeys.value.includes(i)))

// 导出
const exportForm = reactive({
  page: 1,
  size: 10,
  total: 0,
  loading: false,
})
function handleExport() {
  if (props.onExport && !props.exportPage) return exportData()
  exportForm.size = pageRef.value.total
  exportForm.total = pageRef.value.total
  visible.export = true
}
function defaultExport(params) {
  return pageRef.value.listData(params).then(res => {
    const csvData = [[]]
    const getText = []
    const columns = tableRef.value.store.states.columns.value
    columns.forEach((i, idx) => {
      if (i.label && i.property) {
        csvData[0].push(i.label)
        getText.push(i.formatter ? row => i.formatter(row, i, row[i.property], idx) : row => row[i.property])
      }
    })
    res.forEach(i => {
      csvData.push(
        getText.map(j => {
          let v = j(i)
          v ??= ''
          return v
        })
      )
    })
    utils.exportCSV(csvData, props.exportName || document.title)
  })
}
const exportData = () => {
  exportForm.loading = true
  let exportFn
  if (props.onExport) {
    if (typeof props.onExport === 'function') {
      exportFn = props.onExport
    } else {
      exportFn = params =>
        req.post(props.onExport, params, { responseType: 'blob', params }).then(res => {
          utils.downloadFile(res, (props.exportName || document.title) + '.xlsx')
        })
    }
  } else {
    exportFn = defaultExport
  }
  let params = { ...mergedParams }
  if (!props.onExport || props.exportPage) {
    const { sizeKey = 'pageSize', pageKey = 'pageNum' } = props.pageConf
    params[pageKey] = exportForm.page
    params[sizeKey] = exportForm.size
  }
  exportFn(params)
    .then(() => (visible.export = false))
    .finally(() => (exportForm.loading = false))
}

// 0：隐藏，1：正常
const defaultToolStatus = {
  bar: 1,
  title: 1,
  search: 1,
  download: 1,
  refresh: 1,
  size: 1,
  save: 1,
  setting: 1,
}
const toolStatus = computed(() => ({
  ...defaultToolStatus,
  ...props.toolStatus,
}))

let isActivated = true
onActivated(() => {
  isActivated = true
  //激活时更新滚动条位置，0由于没有变化所以不会触发
  tableRef.value.scrollTo(scrollState.scrollLeft, scrollState.scrollTop)
})
onDeactivated(() => {
  isActivated = false
})

const maxHeight = ref(null)

function updateHeight() {
  // 由于keepalive和transition机制的存在，在切换的瞬间，会有2个组件同时存在，因此导致计算高度不准确
  setTimeout(() => {
    if (!props.fixedHeader || !isActivated) return
    const rect = cTableRef.value?.getBoundingClientRect()
    const body = document.body.getBoundingClientRect()
    const form = formRef.value?.$el?.getBoundingClientRect()
    const toolbar = toolbarRef.value?.getBoundingClientRect()
    const pager = pageRef.value?.pageRef.$el?.getBoundingClientRect()
    let height = body.height - rect.top - 16
    form && (height -= form.height + 16)
    toolbar && (height -= toolbar.height)
    pager && (height -= pager.height)
    maxHeight.value = height
  }, 300)
}
watch(showQuery, updateHeight)

const scrollState = {
  scrollLeft: 0,
  scrollTop: 0,
}
function handleScroll() {
  tableRef.value.scrollBarRef.wrapRef.addEventListener('scroll', function (e) {
    const { scrollLeft, scrollTop } = e.target
    scrollState.scrollLeft = scrollLeft
    scrollState.scrollTop = scrollTop
  })
}

function showMoreForm() {
  visible.moreForm = true
}

function hideMoreForm() {
  visible.moreForm = false
}
defineExpose({
  formRef,
  pageRef,
  tableRef,
  form,
  columnsSetting,
  refresh,
  refreshCurrent,
  handleQuery,
  handleColReset,
  handleQueryReset,
  handleSave,
  handleExport,
  showMoreForm,
  hideMoreForm,
})
</script>
<style lang="scss">
.c-table {
  &__form {
    position: relative;
    &::after {
      content: '';
      clear: both;
      display: table;
    }
    .btns {
      float: right;
      margin-right: 0;
    }
    .el-form-item {
      display: inline-block;
      position: relative;
      padding-top: 0.5em;
      .el-form-item__label {
        position: absolute;
        z-index: 9;
        top: 0;
        left: 8px;
        font-size: 0.7em;
        height: fit-content;
        line-height: unset;
        background: var(--gray-1);
        color: var(--primary-color);
        font-weight: bold;
        padding: 0 4px;
      }
    }
  }
  &__toolbar {
    display: flex;
    padding-bottom: var(--size-s);
  }
  &__title {
    font-size: 16px;
  }
  &__actions {
    flex: 1;
    text-align: right;
    .el-button {
      .el-icon,
      .icon {
        font-size: 16px;
        color: var(--gray-9);
      }
      & + .el-dropdown {
        margin-left: 12px;
      }
    }
    .el-dropdown {
      vertical-align: middle;
      & + .el-button {
        margin-left: 12px;
      }
    }
    .el-tooltip__trigger {
      outline: none;
    }
  }
  &__setting.el-popper {
    padding: 0;
    h4 {
      padding: var(--size-s);
      border-bottom: 1px solid var(--gray-3);
    }
    .group-title {
      font-size: 12px;
      color: var(--gray-7);
      padding-left: 16px;
      height: 24px;
      line-height: 24px;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 24px;
      .handle {
        color: var(--gray-5);
        margin-left: 2px;
        cursor: grab;
      }
      .left {
        flex: 1 1;
        display: flex;
        align-items: center;
      }
      .right {
        color: var(--primary-color);
        cursor: pointer;
        display: none;
        font-size: 16px;
        & > * {
          margin-right: 2px;
        }
      }
      .el-checkbox {
        margin-left: 16px;
        flex: 1 1;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: var(--gray-9);
        overflow: hidden;
        text-overflow: ellipsis;
        width: 0;
        flex: 1 1;
      }
      &:hover {
        background-color: #1890ff22;
        .right {
          display: unset;
        }
      }
    }
  }
  &__main {
    & > .el-table {
      .el-table__row {
        content-visibility: hidden;
        contain-intrinsic-height: 41px;
      }
      th.el-table__cell {
        background-color: var(--gray-3);
        color: var(--gray-9);
      }
    }
  }
}
</style>
