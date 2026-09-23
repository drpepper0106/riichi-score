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

<style scoped>
.section-title {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.section-title h2 {
  font-size: 19px;
  margin: 0;
}

.step {
  font-family: Georgia, serif;
  color: #658f81;
  font-size: 20px;
}
</style>
