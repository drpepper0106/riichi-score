<template>
  <div class="workspace hand-workspace">
    <HandResultPanel :hand="state.hand" :calc="calc" />
    <div class="input-column">
      <HandBoard
        :hand="state.hand"
        :builder="state.builder"
        :calc="calc"
        :can-add="canAddTile"
        @pick="pickTile"
        @remove-tile="removeLooseTile"
        @edit-group="editGroup"
        @remove-group="removeGroup"
        @undo="undoHand"
        @orphans="fillOrphans"
      />
      <HandWinningSection :hand="state.hand" />
      <HandContextSection :hand="state.hand" />
      <HandDoraSection :hand="state.hand" />
      <HandBreakdown :hand="state.hand" :calc="calc" />
      <p class="footnote">自动判定牌型役与最高得点拆分。振听、包牌、多人同时和牌及事件发生经过不在本工具判断范围内。</p>
    </div>
  </div>
  <MobileSummary :label="mobileLabel" @jump="scrollTo('hand-result')" />
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../composables/useAppStore.js'
import { fmt } from '../../utils/helpers.js'
import HandResultPanel from './HandResultPanel.vue'
import HandBoard from './HandBoard.vue'
import HandWinningSection from './HandWinningSection.vue'
import HandContextSection from './HandContextSection.vue'
import HandDoraSection from './HandDoraSection.vue'
import HandBreakdown from './HandBreakdown.vue'
import MobileSummary from '../layout/MobileSummary.vue'

const {
  state,
  handCalculation,
  canAddTile,
  pickTile,
  removeLooseTile,
  removeGroup,
  undoHand,
  fillOrphans,
  scrollTo,
} = useAppStore()

const calc = handCalculation

function editGroup(index) {
  const g = state.hand.groups[index]
  if (!g) return
  state.builder.edit = index
  state.builder.area = g.open ? 'open' : 'hand'
  if (g.open) state.builder.meldType = g.type
  else state.builder.handType = 'quad'
  document.getElementById('entry-pad')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const mobileLabel = computed(() => {
  const c = calc.value
  if (c.valid && c.best) {
    const head = c.best.yakuman ? c.best.payment.tier : `${c.best.han} 番 ${c.best.fu.value} 符`
    return `${head} · 收到 ${fmt(c.best.payment.total)} 点 ↑`
  }
  if (c.errors.length) return '有输入需要核对 ↑'
  return `${c.total}/${c.target} 张 · ${c.missing[0] || '继续填写'} ↑`
})
</script>

<style scoped>
.workspace {
  display: block;
}

.hand-workspace {
  display: flex;
  flex-direction: column;
}

.input-column {
  padding-bottom: 0;
}

.hand-workspace > .input-column {
  width: 100%;
  order: 0;
  padding-bottom: 0;
}

.hand-workspace > :deep(.hand-result) {
  order: 1;
  width: 100%;
  scroll-margin-bottom: calc(160px + constant(safe-area-inset-bottom, 0px));
  scroll-margin-bottom: calc(160px + env(safe-area-inset-bottom, 0px));
}

.footnote {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.8;
}
</style>
