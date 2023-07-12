<template>
  <div class="c-table" :id="id">
    <el-form
      v-if="showQuery"
      :inline="true"
      v-bind="formConf"
      :model="form"
      @keydown.enter="handleQuery"
      class="c-table__form"
    >
      <slot name="form" :form="form"></slot>
      <el-form-item class="btns">
        <el-button type="primary" @click="handleQuery" :loading="pageRef?.loading">{{ $t('common.query') }}</el-button>
        <el-button @click="handleQueryReset" :disabled="pageRef?.loading">{{ $t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <div class="c-table__main">
      <div v-if="showToolbar" class="c-table__toolbar">
        <div class="c-table__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div class="c-table__actions">
          <slot name="actions"></slot>
          <el-tooltip v-if="$slots.form" :content="$t('common.query')" placement="top">
            <el-button link @click="showQuery = !showQuery" :aria-description="$t('common.query')">
              <template #icon>
                <i-ep-search />
              </template>
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('common.refresh')" placement="top">
            <el-button link @click="refresh" :aria-description="$t('common.refresh')">
              <template #icon>
                <i-ep-refresh />
              </template>
            </el-button>
          </el-tooltip>
          <CDropdown v-model="tableSize" :options="$tm('component.CTable.sizes')" trigger="click">
            <el-button link :aria-description="$t('component.CTable.size')">
              <template #icon>
                <el-tooltip :content="$t('component.CTable.size')" placement="top">
                  <IconFont icon="enlarge" />
                </el-tooltip>
              </template>
            </el-button>
          </CDropdown>
          <el-tooltip v-if="id" :content="$t('component.CTable.save')" placement="top">
            <el-button link @click="handleSave" :aria-description="$t('component.CTable.save')">
              <template #icon>
                <IconFont icon="save" />
              </template>
            </el-button>
          </el-tooltip>
          <el-popover trigger="click" width="200px" popper-class="c-table__setting">
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
                        <span>
                          <IconFont v-if="i.children.length > 1" icon="justify" class="handle" />
                          <el-checkbox v-model="element.isShow">{{ element.label }}</el-checkbox>
                        </span>
                        <span class="right">
                          <el-tooltip
                            v-if="element.props.fixed !== 'left'"
                            :content="$t('component.CTable.pinLeft')"
                            placement="top"
                          >
                            <IconFont icon="to-top" @click="element.props.fixed = 'left'" />
                          </el-tooltip>
                          <el-tooltip
                            v-if="element.props.fixed"
                            :content="$t('component.CTable.unpin')"
                            placement="top"
                          >
                            <IconFont icon="to-center" @click="element.props.fixed = false" />
                          </el-tooltip>
                          <el-tooltip
                            v-if="element.props.fixed !== 'right'"
                            :content="$t('component.CTable.pinRight')"
                            placement="top"
                          >
                            <IconFont icon="to-bottom" @click="element.props.fixed = 'right'" />
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
      </div>
      <PageWrapper ref="pageRef" v-bind="pageConf" :params="mergedParams" :default-size="defaultSize">
        <template v-slot="{ data, loading }">
          <el-table
            ref="tableRef"
            :data="data"
            v-loading="loading"
            v-bind="{ ...$attrs, class: null }"
            :default-sort="cachedOrder"
            :size="tableSize"
            @sort-change="handleSortChange"
          >
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

const props = defineProps({
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
    default: 'orderBy',
  },
  // 同table.column
  sortOrders: {
    type: Array,
    default() {
      return ['ASC', 'DESC', null]
    },
  },
  // 默认尺寸
  size: {
    type: String,
    default: 'small',
  },
  title: String, // 标题
  // 显示toolbar
  showToolbar: {
    type: Boolean,
    default: true,
  },
  id: String, // 组件id，提供时可以对form，columnSetting数据进行缓存
})

const i18n = useI18n()
const pageRef = ref()
const tableRef = ref()
const tableSize = ref(props.size)
const refresh = () => pageRef.value.refresh()

let cachedData = {
  value: {
    form: {},
    columnsSetting: {},
    defaultSize: props.pageConf?.defaultSize || 10,
    showQuery: null,
    mergedParams: null,
    defaultOrder: undefined,
  },
}
const CACHE_KEY = 'c-table__' + props.id
if (props.id) {
  cachedData = useStorage(CACHE_KEY, cachedData.value)
}
const defaultSize = ref(cachedData.value.defaultSize)

const form = reactive(cachedData.value.form)
const mergedParams = reactive(cachedData.value.mergedParams || { ...props.params, ...form })
const showQuery = ref(cachedData.value.showQuery === false ? false : !!useSlots().form)
const handleQuery = () => {
  // 回车事件
  if (pageRef.value.loading) return
  Object.assign(mergedParams, form)
  // form未更改则不触发
  nextTick(() => {
    pageRef.value.loading || refresh()
  })
}
const handleQueryReset = () => {
  for (let k in form) {
    form[k] = null
  }
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
      if (idx < 2) {
        orderBy = prop + ' ' + props.sortOrders[idx]
      }
      mergedParams[props.orderKey] = orderBy
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
  let cols = useSlots().default()
  handleSyncColumns(cols)
  cols = cols.filter(i => {
    if (i.props?.prop) {
      const conf = columnsSetting[i.props.prop]
      if (!conf?.isShow) return false
      Object.assign(i.props, conf.props)
      i.order = conf.order
    }
    if (typeof i.type === 'symbol') return false
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
defineExpose({
  pageRef,
  tableRef,
  form,
  columnsSetting,
  refresh,
  handleQuery,
  handleColReset,
  handleQueryReset,
  handleSave,
})
</script>
<style lang="scss">
.c-table {
  &__form {
    &::after {
      content: '';
      clear: both;
      display: table;
    }
    .btns {
      float: right;
      margin: 0;
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
      .iconfont,
      .icon {
        font-size: 16px;
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
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: var(--gray-9);
      }
      &:hover {
        background-color: #1890ff22;
        .right {
          display: unset;
        }
      }
    }
  }
  .el-table th.el-table__cell {
    background-color: var(--gray-2);
  }
}
</style>
