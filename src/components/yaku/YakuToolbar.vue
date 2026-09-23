<template>
  <div class="yaku-toolbar">
    <input
      id="yaku-search"
      v-model="state.query"
      type="search"
      placeholder="搜索役种，例如：断幺、三色"
      aria-label="搜索役种"
    />
    <div class="filter-chips">
      <ChoiceButtons v-model="state.filter" :options="filterOpts" />
    </div>
    <div v-if="manual" class="mode-line">
      <span class="hint">{{ closedHint }}</span>
      <label class="check-label">
        <input v-model="state.onlyAvailable" type="checkbox" />
        只看当前可用
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../composables/useAppStore.js'
import ChoiceButtons from '../common/ChoiceButtons.vue'

defineProps({ manual: { type: Boolean, default: false } })

const { state } = useAppStore()

const filterOpts = [
  { v: 'all', t: '全部' },
  { v: '1', t: '1 番' },
  { v: '2', t: '2 番' },
  { v: '3', t: '3 番' },
  { v: '6', t: '6 番' },
  { v: 'yakuman', t: '役满' },
]

const closedHint = computed(() => {
  if (state.closed === null) return '门前状态未选，暂显示门前番数'
  return state.closed ? '当前门前清' : '当前有副露'
})
</script>

<style scoped>
.yaku-toolbar {
  padding: 16px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 16px;
  margin-bottom: 18px;
}

.yaku-toolbar input[type='search'] {
  width: 100%;
  font-size: 16px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
  outline-offset: 3px;
}

.filter-chips {
  margin: 14px 0;
}

.filter-chips :deep(.choices) {
  gap: 5px;
}

.filter-chips :deep(.choices button) {
  min-width: 40px;
  font-size: 12px;
  padding: 8px 5px;
}

.yaku-toolbar .mode-line {
  margin-bottom: 0;
}

.mode-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
}

.hint {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  min-height: 44px;
}

.check-label input[type='checkbox'] {
  accent-color: var(--green);
  width: 19px;
  height: 19px;
  flex-shrink: 0;
}

.yaku-toolbar > :deep(.choices) {
  margin-top: 14px;
}
</style>
