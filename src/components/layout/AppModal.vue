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
