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

<style scoped>
nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  padding: 8px 12px var(--safe-bottom);
  border: 1px solid var(--line);
  border-bottom: 0;
  border-radius: 20px 20px 0 0;
  width: 100%;
  z-index: 10;
  box-shadow: 0 -5px 30px #173c3710;
}

nav button {
  flex: 1;
  border: 0;
  background: none;
  font-size: 13px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px;
  min-height: 0;
  min-width: 0;
}

nav button span {
  font-size: 23px;
  line-height: 1.1;
}

nav button.active {
  background: var(--light);
  color: var(--green);
  font-weight: 600;
}
</style>
