<template>
  <div class="workspace">
    <ResultPanel
      :valid="evaluation.valid"
      :yakuman="evaluation.yakuman"
      :han="evaluation.han"
      :fu="evaluation.fu"
      :result="evaluation.result"
      :status-tag="statusTag"
      :context-line="contextLine"
      :subtle="subtle"
      :empty-title="emptyTitle"
      :empty-hint="emptyHint"
      :errors="evaluation.errors"
      :missing="evaluation.missing"
      :show-metrics="!evaluation.valid"
      @jump-error="onJumpError"
    />
    <div class="input-column">
      <BasicSection />
      <FuSection v-if="state.kind !== 'yakuman'" :evaluation="evaluation" />
      <HanSection :evaluation="evaluation" />
      <details class="panel">
        <summary>本场与桌上立直棒 <small>{{ state.honba }} 本场 · {{ state.sticks }} 根</small></summary>
        <p class="hint">不影响番符，只在基本点数上追加。</p>
        <CounterInput v-model="state.honba" label="本场数" />
        <CounterInput v-model="state.sticks" label="桌上立直棒" />
        <p class="hint">每本场：荣和加 300 点，自摸每家加 100 点。桌上每根立直棒为 1,000 点，由和牌者收取。</p>
      </details>
      <details v-if="evaluation.fu.value && !evaluation.yakuman" class="panel breakdown" open>
        <summary>为什么是 {{ evaluation.fu.value }} 符？</summary>
        <div class="lines">
          <div v-for="([name, n], i) in evaluation.fu.lines" :key="i">
            <span>{{ name }}</span><b>{{ n === null ? '—' : n }}</b>
          </div>
          <div class="sum">
            <span>{{ evaluation.fu.raw === evaluation.fu.value ? '最终符数' : `合计 ${evaluation.fu.raw} → 向上取整` }}</span>
            <b>{{ evaluation.fu.value }} 符</b>
          </div>
        </div>
      </details>
      <p class="footnote">按你填写的牌型计分。多个拆分请分别尝试；不自动判定振听、包牌或和牌是否合法。</p>
    </div>
  </div>
  <MobileSummary :label="mobileLabel" @jump="scrollTo('result-summary')" />
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../composables/useAppStore.js'
import { fmt } from '../../utils/helpers.js'
import ResultPanel from './ResultPanel.vue'
import BasicSection from './BasicSection.vue'
import FuSection from './FuSection.vue'
import HanSection from './HanSection.vue'
import CounterInput from '../common/CounterInput.vue'
import MobileSummary from '../layout/MobileSummary.vue'

const { state, featureEvaluation, scrollTo } = useAppStore()
const evaluation = featureEvaluation

const statusTag = computed(() =>
  evaluation.value.valid ? '已算好' : evaluation.value.errors.length ? '请核对' : '待填写'
)

const contextLine = computed(() =>
  `${state.dealer ? '庄家' : '闲家'} · ${state.win === 'ron' ? '荣和' : '自摸'}`
)

const subtle = computed(() =>
  evaluation.value.result?.tier && !evaluation.value.yakuman ? '已达到固定档位，符数不影响支付点数。' : ''
)

const emptyTitle = computed(() => {
  if (evaluation.value.errors.length) return '有几处需要核对'
  if (evaluation.value.fu.value) return `已算出 ${evaluation.value.fu.value} 符`
  return '先选牌型，<br>点数交给我。'
})

const emptyHint = computed(() =>
  evaluation.value.missing.length
    ? `还差：${evaluation.value.missing.join('、')}`
    : '修正下方输入后，即时更新结算。'
)

const mobileLabel = computed(() => {
  const e = evaluation.value
  if (e.valid) {
    return `${e.yakuman ? e.result.tier : `${e.han} 番 ${e.fu.value} 符`} · 收到 ${fmt(e.result.total)} 点`
  }
  if (e.errors.length) return '有输入需要核对 ↑'
  if (e.fu.value) return `${e.fu.value} 符 · ${e.missing.length ? '还需 ' + e.missing[0] : '查看结果'} ↑`
  return '填写牌型，即时算符 ↑'
})

function onJumpError(err) {
  scrollTo(/役|番|宝牌/.test(err) ? 'han-section' : 'fu-section')
}
</script>
