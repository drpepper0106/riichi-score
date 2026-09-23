<template>
  <div class="toast" role="status" :class="{ show: visible }">
    {{ text }}
    <button v-if="showUndo" @click="$emit('undo')">撤销</button>
  </div>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  text: { type: String, default: '' },
  showUndo: { type: Boolean, default: false },
})
defineEmits(['undo'])
</script>

<style scoped>
.toast {
  display: none;
  position: fixed;
  bottom: calc(208px + constant(safe-area-inset-bottom, 0px));
  bottom: calc(208px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  background: #203d36;
  color: white;
  border-radius: 12px;
  padding: 12px 20px;
  z-index: 30;
  max-width: 90%;
  font-size: 14px;
}

.toast.show {
  display: block;
}

.toast button {
  background: transparent;
  border: 0;
  color: #eacb83;
  padding: 0 10px;
  min-height: 30px;
}
</style>
