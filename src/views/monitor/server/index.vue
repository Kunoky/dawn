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
              <span><div>属性</div></span>
              <span><div>值</div></span>
            </li>

            <li>
              <span><div>核心数</div></span>
              <span>
                <div>{{ data.cpu.cpuNum }}</div>
              </span>
            </li>
            <li>
              <span><div>用户使用率</div></span>
              <span>
                <div>{{ data.cpu.used }}%</div>
              </span>
            </li>
            <li>
              <span><div>系统使用率</div></span>
              <span>
                <div>{{ data.cpu.sys }}%</div>
              </span>
            </li>
            <li>
              <span><div>当前空闲率</div></span>
              <span>
                <div>{{ data.cpu.free }}%</div>
              </span>
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
              <span><div>属性</div></span>
              <span><div>内存</div></span>
              <span><div>JVM</div></span>
            </li>

            <li>
              <span><div>总内存</div></span>
              <span>
                <div>{{ data.mem.total }}G</div>
              </span>
              <span>
                <div>{{ data.jvm.total }}M</div>
              </span>
            </li>
            <li>
              <span><div>已用内存</div></span>
              <span>
                <div>{{ data.mem.used }}G</div>
              </span>
              <span>
                <div>{{ data.jvm.used }}M</div>
              </span>
            </li>
            <li>
              <span><div>剩余内存</div></span>
              <span>
                <div>{{ data.mem.free }}G</div>
              </span>
              <span>
                <div>{{ data.jvm.free }}M</div>
              </span>
            </li>
            <li>
              <span><div>使用率</div></span>
              <span>
                <div :class="{ 'cl-e': data.mem.usage > 80 }">{{ data.mem.usage }}%</div>
              </span>
              <span>
                <div :class="{ 'cl-e': data.jvm.usage > 80 }">{{ data.jvm.usage }}%</div>
              </span>
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
              <span><div>服务器名称</div></span>
              <span>
                <div>{{ data.sys.computerName }}</div>
              </span>
              <span><div>操作系统</div></span>
              <span>
                <div>{{ data.sys.osName }}</div>
              </span>
            </li>
            <li>
              <span><div>服务器IP</div></span>
              <span>
                <div>{{ data.sys.computerIp }}</div>
              </span>
              <span><div>系统架构</div></span>
              <span>
                <div>{{ data.sys.osArch }}</div>
              </span>
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
              <span><div>Java名称</div></span>
              <span>
                <div>{{ data.jvm.name }}</div>
              </span>
              <span><div>Java版本</div></span>
              <span>
                <div>{{ data.jvm.version }}</div>
              </span>
            </li>
            <li>
              <span><div>启动时间</div></span>
              <span>
                <div>{{ data.jvm.startTime }}</div>
              </span>
              <span><div>运行时长</div></span>
              <span>
                <div>{{ data.jvm.runTime }}</div>
              </span>
            </li>
            <li>
              <span><div>安装路径</div></span>
              <span style="flex: 3 3">
                <div>{{ data.jvm.home }}</div>
              </span>
            </li>
            <li>
              <span><div>项目路径</div></span>
              <span style="flex: 3 3">
                <div>{{ data.sys.userDir }}</div>
              </span>
            </li>
            <li>
              <span><div>运行参数</div></span>
              <span style="flex: 3 3">
                <div>{{ data.jvm.inputArgs }}</div>
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
              <span><div>盘符路径</div></span>
              <span><div>文件系统</div></span>
              <span><div>盘符类型</div></span>
              <span><div>总大小</div></span>
              <span><div>可用大小</div></span>
              <span><div>已用大小</div></span>
              <span><div>已用百分比</div></span>
            </li>

            <li v-for="(sysFile, index) in data.sysFiles" :key="index">
              <span>
                <div>{{ sysFile.dirName }}</div>
              </span>
              <span>
                <div>{{ sysFile.sysTypeName }}</div>
              </span>
              <span>
                <div>{{ sysFile.typeName }}</div>
              </span>
              <span>
                <div>{{ sysFile.total }}</div>
              </span>
              <span>
                <div>{{ sysFile.free }}</div>
              </span>
              <span>
                <div>{{ sysFile.used }}</div>
              </span>
              <span>
                <div :class="{ 'cl-e': sysFile.usage > 80 }">{{ sysFile.usage }}%</div>
              </span>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
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
