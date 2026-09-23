<template>
  <div :class="['choices', gridClass]" role="group" :aria-label="ariaLabel">
    <button
      v-for="opt in options"
      :key="String(opt.v)"
      type="button"
      :class="{ selected: modelValue === opt.v }"
      :aria-pressed="modelValue === opt.v"
      @click="$emit('update:modelValue', opt.v)"
    >
      {{ opt.t }}
      <span v-if="fuLabel" class="option-fu">{{ fuLabel(opt.v) }}</span>
      <small v-if="opt.sub">{{ opt.sub }}</small>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { default: null },
  options: { type: Array, required: true },
  gridClass: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  fuLabel: { type: Function, default: null },
})
defineEmits(['update:modelValue'])
</script>
