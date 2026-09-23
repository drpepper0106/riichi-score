<template>
  <button class="mobile-summary" @click="$emit('jump')">{{ label }}</button>
</template>

<script setup>
defineProps({ label: { type: String, required: true } })
defineEmits(['jump'])
</script>
