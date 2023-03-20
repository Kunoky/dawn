<template>
  <div>
    <CTable
      :page-conf="{
        action: '/users',
        totalKey: 'length',
        dataKey: '',
      }"
      title="用户表格"
      ref="tableRef"
      id="viewComponentTable"
      class="view-component-table"
    >
      <el-table-column v-if="showSelect" type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" sortable="custom"></el-table-column>
      <el-table-column prop="name" label="姓名" sortable></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="email" label="Email"></el-table-column>
      <el-table-column prop="phone" label="号码"></el-table-column>
      <el-table-column prop="company.name" label="公司"></el-table-column>
      <el-table-column prop="website" label="网站">
        <template v-slot="{ row }">
          <a class="tc-p" :href="row.website" target="_blank">{{ row.website }}</a>
        </template>
      </el-table-column>
      <template #actions>
        <el-button @click="refresh">{{ $t('common.refresh') }}</el-button>
        <el-button @click="handleSelect">可选</el-button>
      </template>
      <template #form="{ form }">
        <el-form-item label="name">
          <el-input v-model="form.name" placeholder="Name" />
        </el-form-item>
      </template>
    </CTable>
  </div>
</template>
<script setup>
import CTable from '@/components/CTable.vue'
import { ref } from 'vue'

const tableRef = ref()
const showSelect = ref(false)

const handleSelect = () => {
  showSelect.value = !showSelect.value
}
const refresh = () => tableRef.value.refresh()
</script>
<style lang="scss">
.view-component-table {
  .c-table__form,
  .c-table__main,
  .el-pagination {
    background-color: var(--gray-1);
    border-radius: 2px;
    padding-left: var(--size-m);
    padding-right: var(--size-m);
  }

  .c-table__form {
    padding-top: var(--size-m);
    margin-bottom: var(--size-m);
  }
  .c-table__toolbar {
    padding-top: var(--size-m);
  }
  .el-pagination {
    margin: 0;
    padding: var(--size-m);
  }
}
</style>
