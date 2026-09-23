<template>
  <nav aria-label="主要页面">
    <button
      v-for="item in tabs"
      :key="item.id"
      :class="{ active: modelValue === item.id }"
      :aria-current="modelValue === item.id ? 'page' : 'false'"
      @click="$emit('update:modelValue', item.id)"
    >
      <span>{{ item.icon }}</span>{{ item.label }}
    </button>
  </nav>
</template>

<script setup>
defineProps({ modelValue: { type: String, required: true } })
defineEmits(['update:modelValue'])

const tabs = [
  { id: 'calc', icon: '▦', label: '算点数' },
  { id: 'yaku', icon: '發', label: '役种参考' },
  { id: 'table', icon: '▤', label: '点数表' },
]
</script>
