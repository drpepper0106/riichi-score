<template>
  <AppHeader @open-settings="settingsOpen = true" />

  <main id="app-main">
    <CalcPage v-if="state.tab === 'calc'" />
    <YakuPage v-else-if="state.tab === 'yaku'" />
    <PointTablePage v-else :on-cell="openCellDetail" />
  </main>

  <AppNav :model-value="state.tab" @update:model-value="switchTab" />

  <AppModal v-model:open="settingsOpen">
    <SettingsModal @default-rules="restoreRules" />
  </AppModal>

  <AppModal v-model:open="cellModalOpen">
    <span class="eyebrow">点数详情</span>
    <h2>{{ cellTitle }}</h2>
    <p class="hint">{{ state.tableDealer ? '庄家' : '闲家' }} · {{ state.tableWin === 'ron' ? '荣和' : '自摸' }}</p>
    <p v-if="cellError" class="note">{{ cellError }}</p>
    <template v-else>
      <div v-for="(p, i) in cellDetail?.payments || []" :key="i" class="payment-detail">
        <span>{{ p.who }}{{ p.count > 1 ? '各' : '' }}支付</span>
        <b>{{ fmt(p.amount) }} 点</b>
      </div>
      <p class="note">{{ cellDetail?.tier ? `${cellDetail.tier} · ` : '' }}合计 {{ fmt(cellDetail?.total || 0) }} 点，不含本场与桌上立直棒。</p>
    </template>
  </AppModal>

  <AppToast
    :visible="toast.visible"
    :text="toast.text"
    :show-undo="toast.showUndo"
    @undo="undoFeature"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from './composables/useAppStore.js'
import { fmt } from './utils/helpers.js'
import AppHeader from './components/layout/AppHeader.vue'
import AppNav from './components/layout/AppNav.vue'
import AppModal from './components/layout/AppModal.vue'
import AppToast from './components/layout/AppToast.vue'
import CalcPage from './components/calc/CalcPage.vue'
import YakuPage from './components/yaku/YakuPage.vue'
import PointTablePage from './components/table/PointTablePage.vue'
import SettingsModal from './components/settings/SettingsModal.vue'

const { state, Riichi, toast, undoFeature, notify, switchTab } = useAppStore()

const settingsOpen = ref(false)
const cellModalOpen = ref(false)
const cellDetail = ref(null)
const cellError = ref(null)
const cellYakuman = ref(false)

const cellTitle = computed(() => {
  if (cellYakuman.value) return '役满'
  return `${cellHan.value} 番 ${cellFu.value} 符`
})

const cellFu = ref(0)
const cellHan = ref(0)

function openCellDetail(fu, han, yakuman = 0) {
  cellYakuman.value = !!yakuman
  cellFu.value = fu
  cellHan.value = han
  cellError.value = yakuman ? null : Riichi.combination(fu, han, state.tableWin)
  cellDetail.value = Riichi.score({
    fu,
    han,
    yakuman,
    dealer: state.tableDealer,
    win: state.tableWin,
    rules: state.rules,
  })
  cellModalOpen.value = true
}

function restoreRules() {
  state.rules = { ...Riichi.RULES }
  settingsOpen.value = true
  notify('已恢复默认规则')
}
</script>

<style scoped>
#app-main {
  padding: 0 14px;
  /* fallback + env：Tab(64) + summary(48) + 间距，再加 home indicator */
  padding-bottom: calc(160px + constant(safe-area-inset-bottom, 0px));
  padding-bottom: calc(160px + env(safe-area-inset-bottom, 0px));
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.13em;
  color: var(--muted);
}

.hint {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
}

.note {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
  padding: 12px 14px;
  background: var(--bg);
  border-radius: 10px;
}
</style>
