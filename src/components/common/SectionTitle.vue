<template>
  <div class="section-title">
    <span class="step">{{ step }}</span>
    <h2>{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  step: { type: String, required: true },
  title: { type: String, required: true },
})
</script>
