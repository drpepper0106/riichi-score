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
