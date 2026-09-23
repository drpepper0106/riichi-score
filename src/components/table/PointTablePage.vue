<template>
  <div class="page-heading">
    <span class="eyebrow">SCORE TABLE</span>
    <h2>点数，随手查。</h2>
    <p>按每位玩家的实际支付显示，不含本场和立直棒。</p>
  </div>

  <section class="panel">
    <div class="basic-grid">
      <ChoiceButtons v-model="state.tableDealer" :options="dealerOpts" />
      <ChoiceButtons v-model="state.tableWin" :options="winOpts" />
    </div>
    <p class="hint">{{ state.tableWin === 'ron' ? '表内数值为放铳者支付。' : '表内数值为每位付款人的支付。' }}点击格子看详情。</p>

    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>符 / 番</th>
            <th v-for="h in [1, 2, 3, 4]" :key="h">{{ h }} 番</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in Riichi.FUS" :key="f">
            <th>{{ f }} 符</th>
            <td
              v-for="h in [1, 2, 3, 4]"
              :key="h"
              :class="{ limit: cellScore(f, h).tier, 'current-cell': isActive(f, h) }"
            >
              <button type="button" :aria-label="`${f}符${h}番`" @click="openCell(f, h)">
                <span v-if="combinationError(f, h)" class="dash">—</span>
                <template v-else>
                  <span v-html="cellLabel(cellScore(f, h))" />
                  <small v-if="cellScore(f, h).tier">{{ cellScore(f, h).tier }}</small>
                </template>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="footnote">“—”表示不成立的常规组合。1 番 30 符荣和也可以是门前平和。</p>
  </section>

  <section class="panel">
    <SectionTitle step="満" title="满贯及以上" />
    <div class="limit-list">
      <button v-for="item in limitRows" :key="item.han" type="button" @click="openCell(30, item.han)">
        <span>
          <b>{{ item.score.tier }}</b>
          <small>{{ item.note }}</small>
        </span>
        <strong v-html="cellLabel(item.score)" />
      </button>
      <button type="button" @click="openCell(0, 0, 1)">
        <span>
          <b>真实役满</b>
          <small>多倍役满按倍数结算</small>
        </span>
        <strong v-html="cellLabel(yakumanScore)" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../composables/useAppStore.js'
import { fmt } from '../../utils/helpers.js'
import ChoiceButtons from '../common/ChoiceButtons.vue'
import SectionTitle from '../common/SectionTitle.vue'

const props = defineProps({
  onCell: { type: Function, required: true },
})

const { state, Riichi, currentEvaluation } = useAppStore()

const dealerOpts = [{ v: false, t: '闲家' }, { v: true, t: '庄家' }]
const winOpts = [{ v: 'ron', t: '荣和' }, { v: 'tsumo', t: '自摸' }]

const evaluation = computed(() => currentEvaluation())

function cellScore(fu, han, yakuman = 0) {
  return Riichi.score({
    fu,
    han,
    yakuman,
    dealer: state.tableDealer,
    win: state.tableWin,
    rules: state.rules,
  })
}

const yakumanScore = computed(() => cellScore(0, 0, 1))

function combinationError(f, h) {
  return Riichi.combination(f, h, state.tableWin)
}

function cellLabel(r) {
  return r.payments
    .map((p) =>
      `${state.tableWin === 'ron' ? '' : state.tableDealer ? '每家付 ' : p.who === '庄家' ? '庄家付 ' : '闲家付 '}${fmt(p.amount)}`
    )
    .join('<br>')
}

function isActive(f, h) {
  const e = evaluation.value
  if (!e.valid || e.yakuman) return false
  const dealer = state.entry === 'hand' ? state.hand.seat === 27 : state.dealer
  const win = state.entry === 'hand' ? state.hand.method : state.win
  return dealer === state.tableDealer && win === state.tableWin && e.fu.value === f && e.han === h
}

const limitRows = computed(() =>
  [5, 6, 8, 11, 13].map((han) => ({
    han,
    score: cellScore(30, han),
    note: {
      5: '5 番，或番符达到满贯',
      6: '6～7 番',
      8: '8～10 番',
      11: '11～12 番',
      13: '13 番及以上',
    }[han],
  }))
)

function openCell(fu, han, yakuman = 0) {
  props.onCell(fu, han, yakuman)
}
</script>
