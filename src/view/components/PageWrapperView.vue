<template>
  <div class="view-page-wrapper">
    <section class="dp-f fd-c ht-100">
      <h3 class="bg">photo 列表</h3>
      <PageWrapper action="/albums/1/photos" totalKey="length" dataKey="" placement="top">
        <template v-slot="{ data, loading }">
          <ul class="ls-n fx-1 of-a pd-m bg mgt-m" v-loading="loading">
            <li v-for="i in data" :key="i.id" class="bs pd-m mgb-m dp-f">
              <el-image style="width: 100px; height: 100px" :src="i.url"></el-image>
              <div class="fx-1 pdl-m">
                <h4>{{ i.title }}</h4>
              </div>
            </li>
          </ul>
        </template>
      </PageWrapper>
    </section>
  </div>
</template>
<script setup></script>
<style lang="scss">
.view-page-wrapper {
  height: 100%;
  .el-pagination {
    background-color: var(--gray-1);
    margin: 0;
    padding: 0 var(--size-m) var(--size-m) 0;
  }
}
</style>
