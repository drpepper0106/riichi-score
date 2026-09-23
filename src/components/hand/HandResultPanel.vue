<template>
  <aside class="result hand-result" id="hand-result" aria-live="polite">
    <div class="result-top">
      <span class="eyebrow">牌面自动算分</span>
      <span class="status-tag">{{ statusTag }}</span>
    </div>

    <template v-if="calc.best">
      <h2 class="result-caption">
        {{ calc.best.yakuman ? calc.best.payment.tier : `${calc.best.han} 番 ${calc.best.fu.value} 符` }}
        <span v-if="calc.best.payment.tier && !calc.best.yakuman" class="tier">{{ calc.best.payment.tier }}</span>
      </h2>
      <p>{{ hand.seat === 27 ? '庄家' : '闲家' }} · {{ hand.method === 'ron' ? '荣和' : '自摸' }} · {{ calc.closed ? '门前清' : '有副露' }}</p>
      <div class="auto-yaku-tags">
        <span v-for="y in calc.best.yaku" :key="y.id">{{ y.name }} {{ y.value }}{{ calc.best.yakuman ? '倍' : '番' }}</span>
      </div>
      <div class="payouts">
        <div v-for="(p, i) in calc.best.payment.payments" :key="i" class="payout">
          <span>{{ p.who }}{{ p.count > 1 ? '各' : '' }}支付</span>
          <strong>{{ fmt(p.amount) }}<small> 点</small></strong>
          <small v-if="p.extra">基本 {{ fmt(p.base) }} ＋ 本场 {{ fmt(p.extra) }}</small>
        </div>
      </div>
      <div v-if="calc.best.payment.deposit" class="deposit">
        桌上立直棒 <b>＋{{ fmt(calc.best.payment.deposit) }}</b>
      </div>
      <div class="total">
        <span>合计收到</span>
        <b>{{ fmt(calc.best.payment.total) }} <small>点</small></b>
      </div>
      <p class="subtle">
        {{ calc.best.yakuman ? '役满不叠加普通役和宝牌。' : `宝牌 ${hand.dora} · 赤宝牌 ${hand.aka} · 里宝牌 ${hand.ura}` }}
      </p>
    </template>

    <template v-else>
      <h2 v-html="emptyTitle" />
      <p v-if="calc.missing.length">还需：{{ calc.missing.join('、') }}</p>
      <ul v-if="calc.errors.length" class="error-list">
        <li v-for="(err, i) in calc.errors" :key="i">
          <button type="button" @click="scrollTo('hand-board')">{{ err }}</button>
        </li>
      </ul>
    </template>

    <div class="result-footer">
      {{ calc.valid && calc.candidates.length > 1 ? `已比较 ${calc.candidates.length} 种合法解释，采用最高得点。` : '按当前牌桌规则 · 本地计算' }}
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { fmt } from '../../utils/helpers.js'
import { useAppStore } from '../../composables/useAppStore.js'

const props = defineProps({
  hand: { type: Object, required: true },
  calc: { type: Object, required: true },
})

const { scrollTo } = useAppStore()

const statusTag = computed(() =>
  props.calc.valid ? '已算好' : props.calc.errors.length ? '请核对' : `${props.calc.total}/${props.calc.target} 张`
)

const emptyTitle = computed(() => {
  if (props.calc.errors.length) return '有几处需要核对'
  if (props.calc.total === 0) return '把牌放上来，<br>自动算番与符。'
  return '继续录牌，<br>不用自己拆算。'
})
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

.auto-yaku-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.auto-yaku-tags span {
  border: 1px solid #6b9286;
  color: #e1e9dd;
  padding: 4px 7px;
  font-size: 11px;
  border-radius: 5px;
}
</style>
