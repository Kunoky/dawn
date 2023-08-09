<template>
  <div>
    <el-row v-loading="loading" :gutter="16">
      <el-col :span="24" class="mgb-m">
        <el-card>
          <template #header>
            <i-ep-monitor />
            <span>基本信息</span>
          </template>
          <ul>
            <li>
              <span>Redis版本</span>
              <b>{{ data.info.redis_version }}</b>
              <span>运行模式</span>
              <b>{{ data.info.redis_mode == 'standalone' ? '单机' : '集群' }}</b>
              <span>端口</span>
              <b>{{ data.info.tcp_port }}</b>
              <span>客户端数</span>
              <b>{{ data.info.connected_clients }}</b>
            </li>
            <li>
              <span>运行时间(天)</span>
              <b>{{ data.info.uptime_in_days }}</b>
              <span>使用内存</span>
              <b>{{ data.info.used_memory_human }}</b>
              <span>使用CPU</span>
              <b>{{ parseFloat(data.info.used_cpu_user_children).toFixed(2) }}</b>
              <span>内存配置</span>
              <b>{{ data.info.maxmemory_human }}</b>
            </li>
            <li>
              <span>AOF是否开启</span>
              <b>{{ data.info.aof_enabled == '0' ? '否' : '是' }}</b>
              <span>RDB是否成功</span>
              <b>{{ data.info.rdb_last_bgsave_status }}</b>
              <span>Key数量</span>
              <b>{{ data.dbSize }}</b>
              <span>网络入口/出口</span>
              <b>{{ data.info.instantaneous_input_kbps }}kps/{{ data.info.instantaneous_output_kbps }}kps</b>
            </li>
          </ul>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header>
            <i-ep-pie-chart />
            <span>命令统计</span>
          </template>
          <CEcharts :option="commandOption" style="height: 420px" />
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header>
            <i-ep-odometer />
            <span>内存信息</span>
          </template>
          <CEcharts :option="memoOption" style="height: 420px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="MonitorCache">
const commandOption = ref({})
const memoOption = ref({})
const { data, loading } = useAsync(
  () =>
    req.get('monitor/server').then(res => {
      res.data.info ??= {}
      commandOption.value = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '命令',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: res.data.commandStats,
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
          },
        ],
      }
      memoOption.value = {
        tooltip: {
          formatter: '{b} <br/>{a} : ' + res.data.info.used_memory_human,
        },
        series: [
          {
            name: '峰值',
            type: 'gauge',
            min: 0,
            max: 1000,
            detail: {
              formatter: res.data.info.used_memory_human,
            },
            data: [
              {
                value: parseFloat(res.data.info.used_memory_human),
                name: '内存消耗',
              },
            ],
          },
        ],
      }

      return res.data
    }),
  {
    manual: false,
    initialData: { info: {} },
  }
)
</script>
<style lang="scss" scoped>
li {
  display: flex;
  align-items: center;
  line-height: 1.5em;
  padding: var(--size-s) 0;
  color: var(--gray-7);
  border-bottom: 1px solid var(--gray-5);
  &:first-child {
    font-weight: bold;
  }
  & > * {
    flex: 1 1;
  }
}

:deep(.el-card__header) {
  display: flex;
  align-items: center;
  & > span {
    margin-left: var(--size-s);
  }
}
</style>
