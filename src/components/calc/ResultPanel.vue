<template>
  <aside class="result" :id="id" aria-live="polite">
    <div class="result-top">
      <span class="eyebrow">{{ eyebrow }}</span>
      <span class="status-tag">{{ statusTag }}</span>
    </div>

    <template v-if="valid && result">
      <h2 class="result-caption">
        {{ headline }}
        <span v-if="result.tier && !yakuman" class="tier">{{ result.tier }}</span>
      </h2>
      <p>{{ contextLine }}</p>
      <slot name="tags" />
      <div class="payouts">
        <div v-for="(p, i) in result.payments" :key="i" class="payout">
          <span>{{ p.who }}{{ p.count > 1 ? '各' : '' }}支付</span>
          <strong>{{ fmt(p.amount) }}<small> 点</small></strong>
          <small v-if="p.extra">基本 {{ fmt(p.base) }} ＋ 本场 {{ fmt(p.extra) }}</small>
        </div>
      </div>
      <div v-if="result.deposit" class="deposit">
        桌上立直棒 <b>＋{{ fmt(result.deposit) }}</b>
      </div>
      <div class="total">
        <span>合计收到</span>
        <b>{{ fmt(result.total) }} <small>点</small></b>
      </div>
      <p v-if="subtle" class="subtle">{{ subtle }}</p>
    </template>

    <template v-else>
      <h2 v-html="emptyTitle" />
      <p>{{ emptyHint }}</p>
      <ul v-if="errors.length" class="error-list">
        <li v-for="(err, i) in errors" :key="i">
          <button @click="$emit('jump-error', err)">{{ err }}</button>
        </li>
      </ul>
      <div v-if="showMetrics" class="metrics">
        <div><b>{{ han || '—' }}</b><span>番</span></div>
        <div><b>{{ fuDisplay }}</b><span>符</span></div>
      </div>
    </template>

    <div class="result-footer">{{ footer }}</div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { fmt } from '../../utils/helpers.js'

const props = defineProps({
  id: { type: String, default: 'result-summary' },
  eyebrow: { type: String, default: '这一手 · 结算' },
  statusTag: { type: String, required: true },
  valid: { type: Boolean, default: false },
  yakuman: { type: Number, default: 0 },
  han: { type: Number, default: null },
  fu: { type: Object, default: () => ({}) },
  result: { type: Object, default: null },
  contextLine: { type: String, default: '' },
  subtle: { type: String, default: '' },
  emptyTitle: { type: String, default: '先选牌型，<br>点数交给我。' },
  emptyHint: { type: String, default: '修正下方输入后，即时更新结算。' },
  errors: { type: Array, default: () => [] },
  missing: { type: Array, default: () => [] },
  showMetrics: { type: Boolean, default: false },
  footer: { type: String, default: '四人日麻 · 按当前规则结算' },
})

defineEmits(['jump-error'])

const headline = computed(() =>
  props.yakuman ? props.result?.tier : `${props.han} 番 ${props.fu?.value} 符`
)

const fuDisplay = computed(() =>
  props.fu?.errors?.length ? '—' : props.fu?.value || '—'
)
</script>

<style scoped>
.result {
  background: var(--green);
  color: white;
  padding: 22px;
  border-radius: var(--radius);
  margin-bottom: 18px;
}

.result .eyebrow {
  color: #b9d5cc;
}

.result h2 {
  font-size: 23px;
  line-height: 1.5;
  font-weight: 600;
  margin: 12px 0;
}

.result p {
  color: #c8ddd6;
  font-size: 14px;
  line-height: 1.8;
  margin: 8px 0;
}

.result-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-tag {
  font-size: 12px;
  color: #d3e5dc;
  border: 1px solid #5e867b;
  border-radius: 20px;
  padding: 4px 9px;
}

.result-caption {
  font-size: 27px !important;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.tier {
  font-size: 13px;
  color: var(--accent);
  border: 1px solid #b6a579;
  border-radius: 5px;
  padding: 2px 8px;
}

.payout {
  padding: 16px 0;
  border-bottom: 1px solid #437168;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.payout > span {
  color: #c8ddd6;
  font-size: 14px;
}

.payout strong {
  font-size: 29px;
  font-weight: 600;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}

.payout strong small {
  font-size: 14px;
  font-weight: 400;
}

.payout > small {
  color: #c8ddd6;
  font-size: 12px;
}

.total,
.deposit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding-top: 16px;
}

.total b {
  font-size: 20px;
  color: var(--accent);
}

.total small {
  font-size: 12px;
}

.result-footer {
  font-size: 11px;
  color: #b9d5cc;
  margin-top: 18px;
}

.payouts {
  display: flex;
  gap: 22px;
}

.metrics {
  display: flex;
  border-top: 1px solid #437168;
  margin-top: 14px;
  padding-top: 14px;
  gap: 35px;
}

.metrics > div {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.metrics b {
  font-size: 30px;
  font-variant-numeric: tabular-nums;
}

.metrics span {
  font-size: 13px;
  color: #c8ddd6;
}

.error-list {
  list-style: none;
  padding: 0;
  margin: 12px 0;
}

.error-list button {
  font-size: 13px;
  color: #ffe5d6;
  background: #ffffff12;
  border: 1px solid #ffffff20;
  line-height: 1.7;
  text-align: left;
  margin-bottom: 8px;
  width: 100%;
}
</style>
