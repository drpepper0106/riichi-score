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

<style scoped>
.page-heading {
  padding: 6px 4px 20px;
}

.page-heading h2 {
  font-size: 26px;
  font-weight: 600;
  margin: 10px 0;
}

.page-heading p {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.8;
  margin: 0;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.13em;
  color: var(--muted);
}

.panel {
  background: white;
  padding: 20px 16px;
  border: 1px solid var(--line);
  border-radius: 16px;
  margin-bottom: 18px;
}

.basic-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.basic-grid :deep(.choices button) {
  min-width: 50px;
}

.hint {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
}

.footnote {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.8;
}

.table-scroll {
  max-height: 67vh;
  overflow: auto;
  border: 1px solid var(--line);
  border-radius: 10px;
  margin: 18px -8px 0;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

th {
  background: #edf3ef;
  font-weight: 600;
  padding: 12px 6px;
  color: var(--green);
  font-size: 12px;
}

thead th {
  position: sticky;
  top: 0;
  z-index: 3;
  border-bottom: 1px solid var(--line);
}

tbody th {
  position: sticky;
  left: 0;
  z-index: 2;
  white-space: nowrap;
  border-right: 1px solid var(--line);
}

thead th:first-child {
  left: 0;
  z-index: 4;
}

td {
  border-bottom: 1px solid #e5ece7;
  border-right: 1px solid #e5ece7;
}

td button {
  border: 0;
  background: transparent;
  width: 100%;
  font-size: 12px;
  line-height: 1.8;
  padding: 10px 3px;
  min-height: 52px;
  white-space: nowrap;
  border-radius: 0;
}

td small {
  display: block;
  font-size: 11px;
  color: #7b7439;
}

.limit {
  background: #f9f7e9;
}

.current-cell {
  box-shadow: inset 0 0 0 2px var(--green);
  background: var(--light);
}

.dash {
  color: #bcc7c0;
}

.limit-list > button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  width: 100%;
  border: 0;
  border-bottom: 1px solid var(--line);
  border-radius: 0;
  padding: 17px 0;
  background: none;
  gap: 16px;
}

.limit-list small {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-top: 8px;
}

.limit-list strong {
  font-size: 14px;
  line-height: 1.7;
  text-align: right;
  color: var(--green);
  white-space: nowrap;
}
</style>
