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
