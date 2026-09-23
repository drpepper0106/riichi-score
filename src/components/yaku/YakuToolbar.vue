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
