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
