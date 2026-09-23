<template>
  <label class="counter-label">
    {{ label }}
    <span class="counter">
      <button type="button" :aria-label="`减少${label}`" @click="change(-1)">−</button>
      <input
        :aria-label="label"
        type="number"
        inputmode="numeric"
        :min="min"
        :max="max"
        :value="modelValue"
        @change="onInput"
      />
      <button type="button" :aria-label="`增加${label}`" @click="change(1)">＋</button>
    </span>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  label: { type: String, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 99 },
})
const emit = defineEmits(['update:modelValue'])

function clamp(n) {
  return Math.max(props.min, Math.min(props.max, Math.floor(n)))
}

function change(delta) {
  emit('update:modelValue', clamp(props.modelValue + delta))
}

function onInput(e) {
  let n = Number(e.target.value)
  if (!Number.isFinite(n)) n = 0
  emit('update:modelValue', clamp(n))
}
</script>

<style scoped>
.counter-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  margin: 18px 0;
}

.counter {
  display: flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
  max-width: 150px;
  flex-shrink: 0;
}

.counter button {
  border: 0;
  border-radius: 0;
  min-width: 42px;
  padding: 8px;
}

.counter input {
  width: 50px;
  text-align: center;
  border: 0;
  min-height: 44px;
  background: transparent;
  color: var(--ink);
  -moz-appearance: textfield;
}

.counter input::-webkit-inner-spin-button {
  appearance: none;
}
</style>
