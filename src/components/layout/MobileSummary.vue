<template>
  <button class="mobile-summary" @click="$emit('jump')">{{ label }}</button>
</template>

<script setup>
defineProps({ label: { type: String, required: true } })
defineEmits(['jump'])
</script>

<style scoped>
.mobile-summary {
  display: block;
  position: fixed;
  bottom: calc(76px + constant(safe-area-inset-bottom, 0px));
  bottom: calc(76px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 11;
  background: #154f46;
  color: white;
  box-shadow: 0 3px 15px #173c3722;
  border: 0;
  border-radius: 30px;
  font-size: 13px;
  max-width: calc(100% - 28px);
  white-space: nowrap;
  padding: 10px 22px;
  min-height: 40px;
  line-height: 1.4;
  box-sizing: border-box;
}
</style>
