<template>
  <div class="c-table" :id="id">
    <el-form
      v-if="showQuery"
      :inline="true"
      v-bind="formConf"
      :model="form"
      @keydown.enter="handleQuery"
      class="c-table-form"
    >
      <slot name="form" :form="form"></slot>
      <el-form-item class="btns">
        <el-button type="primary" @click="handleQuery">{{ $t('common.query') }}</el-button>
        <el-button @click="handleQueryReset">{{ $t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <PageWrapper ref="pageRef" v-bind="pageConf" :params="mergedParams">
      <template v-slot="{ data, loading }">
        <div v-if="showHeader" class="c-table__header">
          <div class="c-table__title">
            <slot name="title">{{ title }}</slot>
          </div>
          <div class="c-table__actions">
            <slot name="actions"></slot>
            <el-tooltip v-if="$slots.form" :content="$t('common.query')" placement="top">
              <el-button link @click="showQuery = !showQuery">
                <template #icon>
                  <i-ep-search />
                </template>
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('common.refresh')" placement="top">
              <el-button link @click="refresh">
                <template #icon>
                  <i-ep-refresh />
                </template>
              </el-button>
            </el-tooltip>
            <CDropdown v-model="tableSize" :options="$tm('component.CTable.sizes')" trigger="click">
              <el-button link>
                <template #icon>
                  <el-tooltip :content="$t('component.CTable.size')" placement="top">
                    <IconFont icon="enlarge" />
                  </el-tooltip>
                </template>
              </el-button>
            </CDropdown>
            <el-tooltip v-if="id" :content="$t('component.CTable.save')" placement="top">
              <el-button link @click="handleSave">
                <template #icon>
                  <IconFont icon="save" />
                </template>
              </el-button>
            </el-tooltip>
            <el-popover trigger="click" width="200px" popper-class="c-table__setting">
              <template #reference>
                <el-button link>
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
        <el-table
          ref="tableRef"
          class="mgb-s"
          :data="data"
          v-loading="loading"
          v-bind="$attrs"
          :size="tableSize"
          @sort-change="handleSortChange"
        >
          <el-table-column v-for="i in getColumns()" :key="i.props?.prop" v-bind="i.props">
            <!-- 这里热重载失效了... -->
            <template v-for="(v, k) in i.children" v-slot:[k]="slotScope" :key="k">
              <FW :component="v" :attrs="slotScope"></FW>
            </template>
          </el-table-column>
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
</template>
<script setup>
import { computed, reactive, ref, useSlots, watch } from 'vue'
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
  // 显示header
  showHeader: {
    type: Boolean,
    default: true,
  },
  id: String, // 组件id，提供时可以对form，columnSetting数据进行缓存
})
const pageRef = ref()
const tableRef = ref()
const tableSize = ref(props.size)
const refresh = () => pageRef.value.refresh()

let catchData = {
  value: {
    form: {},
    columnsSetting: {},
  },
}
if (props.id) {
  catchData = useStorage(props.id, {
    form: {},
    columnsSetting: {},
  })
}
const mergedParams = reactive({ ...props.params })
const showQuery = ref(useSlots().form)
const form = reactive(catchData.value.form)
const handleQuery = () => {
  Object.assign(mergedParams, form)
}
const handleQueryReset = () => {
  for (let k in form) {
    form[k] = null
  }
  handleQuery()
}
const baseOrder = ['ascending', 'descending', null]
const handleSortChange = ({ column, prop, order }) => {
  if (column.sortable === 'custom') {
    let orderBy
    if (typeof props.orderKey === 'function') {
      orderBy = props.orderKey({ column, prop, order })
    } else {
      const idx = baseOrder.indexOf(order)
      if (idx < 2) {
        orderBy = prop + ' ' + props.sortOrders[idx]
      }
    }
    mergedParams[props.orderKey] = orderBy
  }
}
watch(
  () => props.params,
  v => {
    Object.assign(mergedParams, v)
  },
  { deep: true }
)

const columnsSetting = reactive(catchData.value.columnsSetting)
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
  catchData.value = {
    form,
    columnsSetting,
  }
}
defineExpose({
  refresh,
  pageRef,
  tableRef,
})
</script>
<style lang="scss">
@import url('@/style.css');
.c-table {
  &-form {
    padding-top: var(--size-m);
    &::after {
      content: '';
      clear: both;
      display: table;
    }
    .btns {
      float: right;
    }
  }
  &__header {
    display: flex;
    padding: var(--size-s) 0;
  }
  &__title {
    font-size: 16px;
  }
  &__actions {
    flex: 1;
    text-align: right;
    .el-button {
      font-size: 16px;
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
      // .el-checkbox.el-checkbox--small .el-checkbox__label {
      //   font-size: 14px;
      // }
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
