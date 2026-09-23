<template>
  <div class="entry-switch">
    <div>
      <span class="eyebrow">TWO WAYS TO SCORE</span>
      <p>选择你顺手的录入方式</p>
    </div>
    <ChoiceButtons v-model="state.entry" :options="entryOpts" />
  </div>
  <div class="calculation-actions">
    <span>{{ state.entry === 'hand' ? '牌面录入' : '特征录入' }}</span>
    <div>
      <button
        v-if="canUndo"
        class="restore-hand"
        type="button"
        @click="onUndo"
      >撤销上一步</button>
      <button class="clear-hand" type="button" @click="onClear">
        <span aria-hidden="true">↺</span> 清空这一手
      </button>
    </div>
  </div>
  <HandCalc v-if="state.entry === 'hand'" />
  <FeatureCalc v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../composables/useAppStore.js'
import ChoiceButtons from '../common/ChoiceButtons.vue'
import HandCalc from '../hand/HandCalc.vue'
import FeatureCalc from './FeatureCalc.vue'

const { state, undo, undoHand, resetHand, resetFeature, undoFeature } = useAppStore()

const entryOpts = [
  { v: 'hand', t: '牌面录入', sub: '自动识别役、番与符' },
  { v: 'features', t: '特征录入', sub: '根据算符基础规则计算' },
]

const canUndo = computed(() =>
  state.entry === 'hand' ? !!state.handUndo : !!undo.snapshot
)

function onUndo() {
  if (state.entry === 'hand') undoHand()
  else undoFeature()
}

function onClear() {
  if (state.entry === 'hand') resetHand()
  else resetFeature()
}
</script>

<style scoped>
.entry-switch {
  display: block;
  padding: 14px;
  margin: 0 0 16px;
  background: #e5eeea;
  border-radius: 16px;
}

.entry-switch p {
  font-size: 14px;
  margin: 7px 0 0;
}

.entry-switch > div:first-child {
  display: none;
}

.entry-switch > :deep(.choices) {
  min-width: 0;
}

.entry-switch :deep(.choices button) {
  background: #f8fbf9;
}

.entry-switch :deep(.choices button.selected) {
  background: white;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.13em;
  color: var(--muted);
}

.calculation-actions {
  position: sticky;
  top: 0;
  z-index: 8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
  margin: -8px 0 14px;
  background: rgba(242, 245, 244, 0.97);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 3px 10px #173c370a;
}

.calculation-actions > span {
  font-size: 12px;
  color: var(--muted);
}

.calculation-actions > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-hand {
  border: 1px solid #ad6351;
  background: #fff2e9;
  color: #923e2c;
  font-weight: 600;
  white-space: nowrap;
  font-size: 14px;
  padding: 10px;
}

.restore-hand {
  background: white;
  font-size: 13px;
  padding: 10px 8px;
}

.calculation-actions ~ :deep(.workspace [id]) {
  scroll-margin-top: 90px;
}
</style>
