<template>
  <div id="toast" role="status" :class="{ show: visible }">
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
