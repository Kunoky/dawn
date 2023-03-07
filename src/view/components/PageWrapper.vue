<template>
  <div class="dp-f fd-c ht-100">
    <h2>分页容器</h2>
    <section class="fl-1 of-a pdr-m">
      <h3>photo 列表</h3>
      <PageWrapper action="/albums/1/photos" totalKey="length" dataKey="" placement="top">
        <template v-slot="{ data, total, loading }">
          <div>total: {{ total }}</div>
          <ul class="ls-n" v-loading="loading">
            <li v-for="i in data" :key="i.id" class="bsd-4 pd-m mgb-m dp-f">
              <el-image style="width: 100px; height: 100px" :src="i.url"></el-image>
              <div class="fl-1 pdl-m">
                <h4>{{ i.title }}</h4>
              </div>
            </li>
          </ul>
        </template>
      </PageWrapper>
    </section>
  </div>
</template>
<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
</script>
