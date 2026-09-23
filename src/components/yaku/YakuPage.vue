<template>
  <div v-if="manualMode">
    <div class="page-heading">
      <span class="eyebrow">YAKU REFERENCE</span>
      <h2>役种，一眼查清。</h2>
      <p>选中成立的役，番数一起算。</p>
    </div>
    <YakuToolbar manual />
    <div class="yaku-layout">
      <div class="yaku-list">
        <YakuCard v-for="y in filteredYaku" :key="y.id" :yaku="y" selectable />
        <div v-if="!filteredYaku.length" class="panel"><p>没有找到这个役种，试试更短的名称。</p></div>
      </div>
      <YakuTotalSidebar />
    </div>
    <MobileSummary :label="mobileLabel" @jump="scrollTo('yaku-total')" />
  </div>

  <div v-else>
    <div class="page-heading">
      <span class="eyebrow">YAKU REFERENCE</span>
      <h2>役种，一眼查清。</h2>
      <p>牌面模式自动判断役种。这里查条件与番数，无需再勾选。</p>
    </div>
    <YakuToolbar />
    <div class="auto-reference">
      <article
        v-for="y in filteredYaku"
        :key="y.id"
        class="yaku-card"
        :class="{ picked: picked.has(y.id) }"
      >
        <div class="yaku-pick">
          <span>
            <strong>{{ y.name }}</strong>
            <small>{{ yakuMeta(y) }}</small>
          </span>
          <b v-if="picked.has(y.id)" class="yaku-value">本手成立</b>
        </div>
        <p>{{ y.desc }}</p>
        <details>
          <summary>牌例与易错点</summary>
          <TileExample :example="y.example" />
          <p>{{ y.tip }}</p>
        </details>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../composables/useAppStore.js'
import YakuToolbar from './YakuToolbar.vue'
import YakuCard from './YakuCard.vue'
import YakuTotalSidebar from './YakuTotalSidebar.vue'
import TileExample from '../common/TileExample.vue'
import MobileSummary from '../layout/MobileSummary.vue'

const { state, Riichi, handCalculation, scrollTo } = useAppStore()

const manualMode = computed(() => state.entry !== 'hand')

const picked = computed(() => new Set(handCalculation.value.best?.yaku.map((y) => y.id) || []))

const filteredYaku = computed(() => {
  const list = Riichi.YAKU.filter((y) => {
    if (state.filter !== 'all') {
      if (state.filter === 'yakuman' && !y.yakuman) return false
      if (state.filter !== 'yakuman' && (y.yakuman || String(y.closed) !== state.filter)) return false
    }
    if (state.query && !y.name.includes(state.query) && !y.desc.includes(state.query)) {
      if (!(state.query === '断幺' && y.id === 'tanyao')) return false
    }
    if (manualMode.value && state.onlyAvailable) {
      if (state.closed === false) return true
      if (y.menzen) return false
      if (y.id === 'tanyao' && !state.rules.kuitan) return false
    }
    return true
  })
  return list
})

const yc = computed(() => Riichi.yakuCount(state))

const mobileLabel = computed(() =>
  `已选 ${state.yaku.length} 个役 · ${yc.value.yakuman ? `${yc.value.yakuman} 倍役满` : `${yc.value.han} 番`} · 查看合计 ↓`
)

function yakuMeta(y) {
  if (y.yakuman) {
    return y.yakuman === 2 && state.rules.doubleYakuman ? '特殊双倍役满' : '役满'
  }
  return `门前 ${y.closed} 番 · ${y.open ? `副露 ${y.open} 番` : '门前限定'}`
}
</script>
