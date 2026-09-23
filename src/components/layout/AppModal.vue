<template>
  <dialog ref="dialogEl" @click="onBackdrop">
    <slot />
    <button class="close-modal" aria-label="关闭" @click="close">×</button>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['update:open'])
const dialogEl = ref(null)

watch(
  () => props.open,
  (v) => {
    if (!dialogEl.value) return
    if (v && !dialogEl.value.open) dialogEl.value.showModal()
    if (!v && dialogEl.value.open) dialogEl.value.close()
  }
)

function close() {
  emit('update:open', false)
}

function onBackdrop(e) {
  if (e.target !== dialogEl.value) return
  const r = dialogEl.value.getBoundingClientRect()
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close()
}
</script>

<style scoped>
dialog {
  border: 0;
  border-radius: 22px;
  padding: 30px;
  width: calc(100% - 28px);
  color: var(--ink);
  max-height: 85dvh;
}

dialog::backdrop {
  background: #102c2866;
  backdrop-filter: blur(3px);
}

.close-modal {
  position: absolute;
  right: 12px;
  top: 12px;
  border: 0;
  font-size: 24px;
  padding: 0;
  width: 40px;
  background: transparent;
}

:deep(.payment-detail) {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  border-bottom: 1px solid var(--line);
  padding: 18px 0;
  font-size: 14px;
}

:deep(.payment-detail b) {
  font-size: 21px;
  color: var(--green);
}
</style>
