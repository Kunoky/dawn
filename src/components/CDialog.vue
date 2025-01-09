<template>
  <ElOverlay v-if="state.shouldMount" :overlay-class="['c-dialog', modalClass, visible || 'hidden']" @click="maskClick">
    <DragResize
      :w="state.width"
      :h="state.height"
      :x="state.x"
      :y="state.y"
      :parentH="state.parentH"
      :parentW="state.parentW"
      contentClass="c-dialog_container"
      :isResizable="resizable"
      :isDraggable="draggable"
      :parentLimitation="parentLimitation"
      ref="dragResize"
    >
      <div ref="dragResizeContent" class="c-dialog_content pt-r">
        <div class="c-dialog_header pt-s tp-0 bgc-1 pd-m zi-999">
          <slot name="header">
            <div class="c-dialog_title cs-m">
              <slot name="title">
                <h3>{{ props.title }}</h3>
              </slot>
            </div>
          </slot>
          <div v-if="showClose" class="c-dialog_close cs-p pt-a rt-0 tp-0 pd-m" @click="close">
            <CIcon icon="ep:close" />
          </div>
        </div>
        <div class="c-dialog_body pd-m" @mousedown.stop @touchstart.stop>
          <slot />
        </div>
        <div class="c-dialog_footer pd-m ta-r pt-s bt-0 rt-0 bgc-1 zi-999" @click="handleFooterClick">
          <slot name="footer"></slot>
        </div>
      </div>
    </DragResize>
  </ElOverlay>
</template>
<script setup>
import DragResize from 'vue-drag-resize'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  resizable: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
  },
  width: {
    type: [Number, String],
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  parentLimitation: {
    type: Boolean,
    default: true,
  },
  modalClass: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue', 'open', 'close', 'opened', 'closed'])

const dragResizeContent = ref()
const dragResize = ref()
const visible = computed(() => props.modelValue)

function getWidth() {
  let width = innerWidth / 2
  if (props.width) {
    if (isNaN(props.width)) {
      if (props.width.endsWith('px')) {
        width = +props.width.slice(0, -2)
      } else if (props.width.endsWith('%')) {
        width = innerWidth * (props.width.slice(0, -1) / 100)
      } else if (props.width.endsWith('vw')) {
        width = innerWidth * (props.width.slice(0, -2) / 100)
      } else {
        console.warn('CDialog: width must be a number or a string with px, %, vw suffix')
      }
    } else {
      width = +props.width
    }
  }
  return width
}

const width = getWidth()
const state = reactive({
  shouldMount: visible.value,
  width,
  height: 200,
  x: (innerWidth - width) / 2,
  y: 0,
  parentH: innerHeight,
  parentW: innerWidth,
})

let resizeObserver
watch([visible, dragResizeContent], ([value, content]) => {
  if (value && content) {
    /* 重新设置宽高，修正窗口尺寸变化 */
    dragResize.value.parentWidth = innerWidth
    dragResize.value.parentHeight = innerHeight
    state.width = getWidth()

    state.x = (innerWidth - state.width) / 2
    dragResize.value.left = state.x
    dragResize.value.right = state.x
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(entries => {
        if (dragResize.value.active) return
        state.height = Math.min(entries[0].contentRect.height, innerHeight - 40)
        state.y = Math.max((innerHeight - state.height) / 2, 20)
        dragResize.value.top = state.y
        dragResize.value.bottom = state.y
      })
      resizeObserver.observe(content)
    }
  }
  if (value) {
    state.shouldMount = true
    emit('open')
    nextTick(() => {
      emit('opened')
    })
  } else {
    if (props.destroyOnClose) {
      state.shouldMount = false
    }
    resizeObserver?.disconnect()
    resizeObserver = null
    nextTick(() => {
      emit('closed')
    })
  }
})

function maskClick() {
  if (props.closeOnClickModal) {
    close()
  }
}
function close() {
  emit('close')
  emit('update:modelValue', false)
}

function handleFooterClick(e) {
  if (e.target !== document.activeElement) {
    document.activeElement.blur()
  }
}
</script>
<style lang="scss">
.c-dialog {
  z-index: 999;
  transition: width 0.3s, height 0.3s;
  width: 100%;
  &.hidden {
    width: 0;
    height: 0;
  }
  &_container > .content-container {
    background-color: var(--gray-1);
    overflow: auto;
    border-radius: 2px;
    min-width: 200px;
  }
  &_content {
    min-width: 400px;
    cursor: move;
  }
  &_body {
    cursor: default;
  }
}
</style>
