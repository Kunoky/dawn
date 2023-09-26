<template>
  <el-dialog
    :model-value="modelValue"
    @close="handleClose"
    :title="title"
    width="60%"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <!-- <el-table
      :data="tableData"
      @cell-mouse-enter="handleCellEnter"
      @cell-mouse-leave="handleCellLeave"
      border
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa' }"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column prop="aaa" label="料号">
        <template #default="{ row }">
          <el-input v-if="row.isEdit" v-model="row.aaa" placeholder="请输入"></el-input>
          <div v-else class="txt">{{ row.aaa }}</div>
        </template>
        </el-table-column>
      <el-table-column prop="bbb" label="名称">
        </el-table-column>
      <el-table-column prop="ccc" label="单位">
        </el-table-column>
      <el-table-column prop="ddd" label="单价">
        <template #default="{ row }">
          <el-input v-if="row.isEdit" v-model="row.date" placeholder="请输入"></el-input>
          <div v-else class="txt">{{ row.date }}</div>
        </template>
      </el-table-column>
    </el-table> -->
    <p>BOM列表</p>
    <el-table :data="parentTableData" style="width: 100%">
      <el-table-column label="料号">
        <template v-slot="{ row }">
          <el-select v-model="row.class" @change="handleClassChange(row)">
            <el-option
              v-for="option in classOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="school" label="名称"></el-table-column>
      <el-table-column prop="aaa" label="单位"></el-table-column>
      <el-table-column prop="bbb" label="单价"></el-table-column>
    </el-table>

    <p>物料列表</p>
    <el-button type="primary" @click="addChildRow">新增物料</el-button>
    <el-table :data="childTableData" style="width: 100%">
      <el-table-column label="料号">
        <template v-slot="{ row }">
          <el-select v-model="row.name" @change="handleNameChange(row)">
            <el-option
              v-for="option in nameOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="名称">
        <template v-slot="{ row }">
          <el-input v-model="row.gender"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template v-slot="{ row }">
          <el-input v-model="row.age"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="单价">
        <template v-slot="{ row }">
          <el-input v-model="row.date"></el-input>
        </template>
      </el-table-column>
    </el-table>
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

const title = computed(() => (props.data ? '修改BOM' : '新增BOM'))
const loading = ref(false)
const parentTableData = ref([{ class: '', school: '', aaa: '', bbb: '' }])
const childTableData = ref([
  // { name: '套餐二', gender: 'xxxxx', age: 'xxxxxxxxxxxxxxxxxxx', date: '34' }
])
const classOptions = ref([
  { label: '套餐一', value: '套餐一', school: 'xxxx', aaa: 'xxxxxxxxxxxxx', bbb: '20' },
  { label: '套餐二', value: '套餐二', school: 'xxxx', aaa: 'xxxxxxxxxxxxx', bbb: '90' },
  { label: '套餐三', value: '套餐三', school: 'xxxx', aaa: 'xxxxxxxxxxxxx', bbb: '120' },
])
const nameOptions = ref([
  { label: '套餐一', value: '套餐一', gender: 'xxxxx', age: 'xxxxxxxxxxxxxxxxxxx', date: '34' },
  { label: '套餐二', value: '套餐二', gender: 'xxxxx', age: 'xxxxxxxxxxxxxxxxxxx', date: '345' },
  { label: '套餐三', value: '套餐三', gender: 'xxxxx', age: 'xxxxxxxxxxxxxxxxxxx', date: '32' },
])
// watch(
//   () => props.modelValue,
//   v => {
//     if (v) {
//       tableData.value = {
//         aaa: '',
//         bbb: '',
//         ccc: '',
//         ddd: '',
//       }
//       if (props.data) {
//         for (let k in form.value) {
//           form.value[k] = props.data[k]
//         }
//       }
//       // nextTick(() => {
//       //   formRef.value.clearValidate()
//       // })
//     }
//   },
//   { immediate: true }
// )
const addChildRow = () => {
  childTableData.value.push({
    name: '',
    gender: '',
    age: '',
    date: '',
  })
}
const handleClassChange = row => {
  const selectedOption = classOptions.value.find(option => option.value === row.class)
  if (selectedOption) {
    row.school = selectedOption.school
    row.aaa = selectedOption.aaa
    row.bbb = selectedOption.bbb
  }
}
const handleNameChange = row => {
  const selectedOption = nameOptions.value.find(option => option.value === row.name)
  if (selectedOption) {
    row.gender = selectedOption.gender
    row.age = selectedOption.age
    row.date = selectedOption.date
  }
}
const handleClose = () => {
  parentTableData.value = [{ class: '', school: '', aaa: '', bbb: '' }]
  childTableData.value = []
  emit('update:modelValue', false)
}
const handleConfirm = () => {
  // formRef.value.validate(valid => {
  //   if (valid) {
  // form.value.value = form.value.category
  // loading.value = true
  // req[form.value.dictId ? 'put' : 'post']('/dict', form.value)
  //   .then(({ code }) => {
  //     if (code === 200) {
  //       emit('success')
  //       emit('update:modelValue', false)
  //     }
  //   })
  //   .finally(() => {
  //     loading.value = false
  //   })
  // }
  // })
}

// /** 鼠标移入cell */
// // const handleCellEnter = (row, column, cell, event) => {
//   const handleCellEnter = row => {
//   row.isEdit = true
// }
// /** 鼠标移出cell */
// // const handleCellLeave = (row, column, cell, event) => {
// const handleCellLeave = row => {
//   row.isEdit = false
// }
</script>
<style scoped>
.date-box :deep(.el-input__wrapper) {
  width: 95%;
}
</style>
