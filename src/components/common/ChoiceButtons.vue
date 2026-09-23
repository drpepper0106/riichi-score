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

<style scoped>
.choices {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.choices > button {
  flex: 1;
  min-width: 80px;
  font-size: 14px;
  padding: 11px 8px;
}

.choices > button.selected {
  color: var(--green);
  border-color: var(--green);
  background: var(--light);
  box-shadow: inset 0 0 0 1px var(--green);
}

.choices > button.selected::before {
  content: '✓ ';
  font-weight: 700;
}

.choices.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.choices.grid button {
  min-width: 0;
}

.choices small {
  display: block;
  font-size: 12px;
  margin-top: 5px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--muted);
}

.option-fu {
  display: block;
  width: fit-content;
  margin: 7px auto 0;
  padding: 3px 7px;
  border-radius: 5px;
  background: #edf3ed;
  color: #376b52;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;
  white-space: nowrap;
}

.choices button.selected .option-fu {
  background: #d6e8db;
}
</style>
