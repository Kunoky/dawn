<template>
  <div v-loading="loading">
    <el-row :gutter="16" v-if="data">
      <el-col :span="12">
        <el-card>
          <template #header>
            <i-ep-cpu />
            <span>CPU</span>
          </template>
          <ul>
            <li>
              <span>属性</span>
              <span>值</span>
            </li>

            <li>
              <span>核心数</span>
              <span>{{ data.cpu.cpuNum }}</span>
            </li>
            <li>
              <span>用户使用率</span>
              <span>{{ data.cpu.used }}%</span>
            </li>
            <li>
              <span>系统使用率</span>
              <span>{{ data.cpu.sys }}%</span>
            </li>
            <li>
              <span>当前空闲率</span>
              <span>{{ data.cpu.free }}%</span>
            </li>
          </ul>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <i-ep-tickets />
            <span>内存</span>
          </template>
          <ul>
            <li>
              <span>属性</span>
              <span>内存</span>
              <span>JVM</span>
            </li>

            <li>
              <span>总内存</span>
              <span>{{ data.mem.total }}G</span>
              <span>{{ data.jvm.total }}M</span>
            </li>
            <li>
              <span>已用内存</span>
              <span>{{ data.mem.used }}G</span>
              <span>{{ data.jvm.used }}M</span>
            </li>
            <li>
              <span>剩余内存</span>
              <span>{{ data.mem.free }}G</span>
              <span>{{ data.jvm.free }}M</span>
            </li>
            <li>
              <span>使用率</span>
              <span :class="{ 'cl-e': data.mem.usage > 80 }">{{ data.mem.usage }}%</span>
              <span :class="{ 'cl-e': data.jvm.usage > 80 }">{{ data.jvm.usage }}%</span>
            </li>
          </ul>
        </el-card>
      </el-col>

      <el-col :span="24">
        <el-card>
          <template #header>
            <i-ep-monitor />
            <span>服务器信息</span>
          </template>
          <ul>
            <li>
              <span>服务器名称</span>
              <span>{{ data.sys.computerName }}</span>
              <span>操作系统</span>
              <span>{{ data.sys.osName }}</span>
            </li>
            <li>
              <span>服务器IP</span>
              <span>{{ data.sys.computerIp }}</span>
              <span>系统架构</span>
              <span>{{ data.sys.osArch }}</span>
            </li>
          </ul>
        </el-card>
      </el-col>

      <el-col :span="24">
        <el-card>
          <template #header>
            <i-ep-coffee-cup />
            <span>Java虚拟机信息</span>
          </template>
          <ul>
            <li>
              <span>Java名称</span>
              <span>{{ data.jvm.name }}</span>
              <span>Java版本</span>
              <span>{{ data.jvm.version }}</span>
            </li>
            <li>
              <span>启动时间</span>
              <span>{{ data.jvm.startTime }}</span>
              <span>运行时长</span>
              <span>{{ data.jvm.runTime }}</span>
            </li>
            <li>
              <span>安装路径</span>
              <span style="flex: 3 3">
                {{ data.jvm.home }}
              </span>
            </li>
            <li>
              <span>项目路径</span>
              <span style="flex: 3 3">
                {{ data.sys.userDir }}
              </span>
            </li>
            <li>
              <span>运行参数</span>
              <span style="flex: 3 3">
                {{ data.jvm.inputArgs }}
              </span>
            </li>
          </ul>
        </el-card>
      </el-col>

      <el-col :span="24">
        <el-card>
          <template #header>
            <i-ep-message-box />
            <span>磁盘状态</span>
          </template>
          <ul>
            <li>
              <span>盘符路径</span>
              <span>文件系统</span>
              <span>盘符类型</span>
              <span>总大小</span>
              <span>可用大小</span>
              <span>已用大小</span>
              <span>已用百分比</span>
            </li>

            <li v-for="(sysFile, index) in data.sysFiles" :key="index">
              <span>{{ sysFile.dirName }}</span>
              <span>{{ sysFile.sysTypeName }}</span>
              <span>{{ sysFile.typeName }}</span>
              <span>{{ sysFile.total }}</span>
              <span>{{ sysFile.free }}</span>
              <span>{{ sysFile.used }}</span>
              <span :class="{ 'cl-e': sysFile.usage > 80 }">{{ sysFile.usage }}%</span>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="MonitorServer">
const { data, loading } = useAsync(() => req.get('monitor/server').then(res => res.data), {
  manual: false,
})
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
.el-col-24 {
  margin-top: var(--size-m);
}
:deep(.el-card__header) {
  display: flex;
  align-items: center;
  & > span {
    margin-left: var(--size-s);
  }
}
</style>
